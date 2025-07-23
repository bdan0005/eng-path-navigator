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

def compute_memberships(values, centers, min_val, max_val):
    a, b, c = centers
    memberships = []
    for x in values:
        u_low = triangular_membership(x, min_val, a, b)
        u_med = triangular_membership(x, a, b, c)
        u_high = triangular_membership(x, b, c, max_val)
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

# Get min and max for each numeric feature
feature_ranges = {
    'CAD': (df['CAD'].min(), df['CAD'].max()),
    'Design': (df['Design'].min(), df['Design'].max()),
    'Printing': (df['3D Printing'].min(), df['3D Printing'].max()),
    'Teamwork': (df['Teamwork'].min(), df['Teamwork'].max()),
    'Coding': (df['Coding'].min(), df['Coding'].max()),
    'Microcontrollers': (df['Microcontrollers'].min(), df['Microcontrollers'].max())
}

# -------------------------------
# Compute memberships for numeric features
# -------------------------------
df[['cad_low', 'cad_med', 'cad_high']] = pd.DataFrame(
    compute_memberships(df['CAD'], cad_centers, *feature_ranges['CAD'])
)
df[['design_low', 'design_med', 'design_high']] = pd.DataFrame(
    compute_memberships(df['Design'], design_centers, *feature_ranges['Design'])
)
df[['printing_low', 'printing_med', 'printing_high']] = pd.DataFrame(
    compute_memberships(df['3D Printing'], printing_centers, *feature_ranges['Printing'])
)
df[['teamwork_low', 'teamwork_med', 'teamwork_high']] = pd.DataFrame(
    compute_memberships(df['Teamwork'], teamwork_centers, *feature_ranges['Teamwork'])
)
df[['coding_low', 'coding_med', 'coding_high']] = pd.DataFrame(
    compute_memberships(df['Coding'], coding_centers, *feature_ranges['Coding'])
)
df[['microcontrollers_low', 'microcontrollers_med', 'microcontrollers_high']] = pd.DataFrame(
    compute_memberships(df['Microcontrollers'], microcontrollers_centers, *feature_ranges['Microcontrollers'])
)

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
def fuzzy_vector_for_student(student_input, centers, feature_ranges):
    profile = []

    for feat, (a, b, c) in centers.items():
        x = student_input[feat]
        min_val, max_val = feature_ranges[feat]
        mu_low = triangular_membership(x, min_val, a, b)
        mu_med = triangular_membership(x, a, b, c)
        mu_high = triangular_membership(x, b, c, max_val)
        profile += [mu_low, mu_med, mu_high]

    for feat in ['Extraversion', 'Emotionality', 'Conscientiousness', 'Agreeableness', 'Openness']:
        profile += list(label_to_membership.get(student_input[feat], (0, 0, 0)))

    return np.array(profile)

# -------------------------------
# Recommend specialisations based on similarity
# -------------------------------
def recommend_by_similarity(student_input, centers, specialisation_profiles, feature_ranges, top_n=3):
    student_vec = fuzzy_vector_for_student(student_input, centers, feature_ranges)
    similarities = {}

    for spec, profile_vec in specialisation_profiles.items():
        sim = np.dot(student_vec, profile_vec) / (np.linalg.norm(student_vec) * np.linalg.norm(profile_vec))
        similarities[spec] = sim

    return sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:top_n]

# -------------------------------
# Print fuzzy rules for each specialisation
# -------------------------------
def print_fuzzy_rules(specialisation_profiles):
    trait_names = ['CAD', 'Design', '3D Printing', 'Teamwork', 'Coding', 'Microcontrollers',
                   'Extraversion', 'Emotionality', 'Conscientiousness', 'Agreeableness', 'Openness']
    
    labels = ['Low', 'Medium', 'High']

    for spec, profile in specialisation_profiles.items():
        rule_parts = []
        for i, trait in enumerate(trait_names):
            # Each trait has 3 membership values, so index offset is i * 3
            idx = i * 3
            values = profile[idx:idx+3]
            max_label = labels[np.argmax(values)]
            rule_parts.append(f"{trait} is {max_label}")
        rule_str = " AND ".join(rule_parts)
        print(f"IF {rule_str} THEN Specialisation is {spec}\n")

print("\nFuzzy Rules Learned from Data:\n")
print_fuzzy_rules(specialisation_profiles)

# -------------------------------
# Example new student input
# -------------------------------
new_student = {
    'CAD': 3,
    'Design': 5,
    'Printing': 2,
    'Teamwork': 1,
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
recommendations = recommendations = recommend_by_similarity(new_student, numeric_centers, specialisation_profiles, feature_ranges)

print("\nRecommended specialisations:")
for spec, score in recommendations:
    print(f"{spec}: {score:.4f}")
