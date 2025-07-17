import numpy as np
from sklearn.cluster import KMeans
import pandas as pd
from collections import defaultdict

# -------------------------------
# Fuzzy Membership Mapping for Labeled Traits
# -------------------------------
label_to_membership = {
    "Low":    (1.0, 0.0, 0.0),
    "Medium": (0.0, 1.0, 0.0),
    "High":   (0.0, 0.0, 1.0)
}

def membership_from_label(label):
    return label_to_membership.get(label, (0.0, 0.0, 0.0))

# -------------------------------
# KMeans-Based Fuzzy Set Definition for Numeric Features
# -------------------------------
def define_fuzzy_sets(values):
    values = np.array(values).reshape(-1, 1)
    kmeans = KMeans(n_clusters=3, random_state=0).fit(values)
    centers = np.sort(kmeans.cluster_centers_.flatten())
    return centers

def triangular_membership(x, a, b, c):
    if x <= a or x >= c:
        return 0
    elif x == b:
        return 1
    elif x < b:
        return (x - a) / (b - a)
    else:
        return (c - x) / (c - b)

def compute_memberships(values, centers):
    a, b, c = centers
    memberships = []
    for x in values:
        u_low = triangular_membership(x, 0, a, b)
        u_med = triangular_membership(x, a, b, c)
        u_high = triangular_membership(x, b, c, 100)  # Assuming max 100
        memberships.append((u_low, u_med, u_high))
    return memberships

# -------------------------------
# Load Data
# -------------------------------
df = pd.read_excel("specialisation_data_clean.xlsx", engine="openpyxl")

# -------------------------------
# Define centers for numeric features only
# -------------------------------
cad_centers = define_fuzzy_sets(df['CAD'])
design_centers = define_fuzzy_sets(df['Design'])
printing_centers = define_fuzzy_sets(df['3D Printing'])
teamwork_centers = define_fuzzy_sets(df['Teamwork'])
coding_centers = define_fuzzy_sets(df['Coding'])
microcontrollers_centers = define_fuzzy_sets(df['Microcontrollers'])

# -------------------------------
# Compute memberships for numeric features
# -------------------------------
df[['cad_low', 'cad_med', 'cad_high']] = pd.DataFrame(compute_memberships(df['CAD'], cad_centers))
df[['design_low', 'design_med', 'design_high']] = pd.DataFrame(compute_memberships(df['Design'], design_centers))
df[['printing_low', 'printing_med', 'printing_high']] = pd.DataFrame(compute_memberships(df['3D Printing'], printing_centers))
df[['teamwork_low', 'teamwork_med', 'teamwork_high']] = pd.DataFrame(compute_memberships(df['Teamwork'], teamwork_centers))
df[['coding_low', 'coding_med', 'coding_high']] = pd.DataFrame(compute_memberships(df['Coding'], coding_centers))
df[['microcontrollers_low', 'microcontrollers_med', 'microcontrollers_high']] = pd.DataFrame(compute_memberships(df['Microcontrollers'], microcontrollers_centers))

# -------------------------------
# Compute membership tuples from labels (already given)
# -------------------------------
df['extraversion_memberships'] = df['Extraversion'].apply(membership_from_label)
df['emotionality_memberships'] = df['Emotionality'].apply(membership_from_label)
df['conscientiousness_memberships'] = df['Conscientiousness'].apply(membership_from_label)
df['agreeableness_memberships'] = df['Agreeableness'].apply(membership_from_label)
df['openness_memberships'] = df['Openness'].apply(membership_from_label)

# -------------------------------
# Build Specialisation Profiles (average fuzzy vectors)
# -------------------------------
def build_specialisation_profiles(df):
    profiles = defaultdict(list)

    for _, row in df.iterrows():
        profile = []

        # Numeric features - add their 3 membership values each
        for prefix in ['cad', 'design', 'printing', 'teamwork', 'coding', 'microcontrollers']:
            profile += [row[f"{prefix}_low"], row[f"{prefix}_med"], row[f"{prefix}_high"]]

        # Personality traits (already tuples of 3 membership values)
        for col in ['extraversion_memberships', 'emotionality_memberships',
                    'conscientiousness_memberships', 'agreeableness_memberships', 'openness_memberships']:
            profile += list(row[col])

        profiles[row['Current specialisation']].append(profile)

    # Average profiles for each specialisation
    averaged = {spec: np.mean(vectors, axis=0) for spec, vectors in profiles.items()}
    return averaged

specialisation_profiles = build_specialisation_profiles(df)

# -------------------------------
# Create fuzzy vector for a new student input
# -------------------------------
def fuzzy_vector_for_student(student_input, centers):
    profile = []

    # Numeric features
    for feat, (a, b, c) in centers.items():
        x = student_input[feat]
        mu_low = triangular_membership(x, 0, a, b)
        mu_med = triangular_membership(x, a, b, c)
        mu_high = triangular_membership(x, b, c, 100)
        profile += [mu_low, mu_med, mu_high]

    # Labeled features (personality traits)
    for feat in ['Extraversion', 'Emotionality', 'Conscientiousness', 'Agreeableness', 'Openness']:
        profile += list(label_to_membership.get(student_input[feat], (0, 0, 0)))

    return np.array(profile)

# -------------------------------
# Recommend specialisations based on similarity
# -------------------------------
def recommend_by_similarity(student_input, centers, specialisation_profiles, top_n=3):
    student_vec = fuzzy_vector_for_student(student_input, centers)
    similarities = {}

    for spec, profile_vec in specialisation_profiles.items():
        # Compute cosine similarity
        sim = np.dot(student_vec, profile_vec) / (np.linalg.norm(student_vec) * np.linalg.norm(profile_vec))
        similarities[spec] = sim

    return sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:top_n]

# -------------------------------
# Example new student input
# -------------------------------
new_student = {
    'CAD': 100,
    'Design': 100,
    'Printing': 55,
    'Teamwork': 88,
    'Coding': 0,
    'Microcontrollers': 0,
    'Extraversion': "Low",
    'Emotionality': "Low",
    'Conscientiousness': "Low",
    'Agreeableness': "Medium",
    'Openness': "High"
}

numeric_centers = {
    'CAD': cad_centers,
    'Design': design_centers,
    'Printing': printing_centers,
    'Teamwork': teamwork_centers,
    'Coding': coding_centers,
    'Microcontrollers': microcontrollers_centers
}

# -------------------------------
# Get recommendations
# -------------------------------
recommendations = recommend_by_similarity(new_student, numeric_centers, specialisation_profiles)

print("\nRecommended specialisations:")
for spec, score in recommendations:
    print(f"{spec}: {score:.4f}")
