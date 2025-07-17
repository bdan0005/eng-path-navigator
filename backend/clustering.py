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
# Rule Generation
# -------------------------------
labels = ['Low', 'Medium', 'High']
rule_scores = defaultdict(float)

numeric_features = {
    'CAD': cad_centers,
    'Design': design_centers,
    'Printing': printing_centers,
    'Teamwork': teamwork_centers,
    'Coding': coding_centers,
    'Microcontrollers': microcontrollers_centers,
}

labeled_features = {
    'Extraversion': 'extraversion_memberships',
    'Emotionality': 'emotionality_memberships',
    'Conscientiousness': 'conscientiousness_memberships',
    'Agreeableness': 'agreeableness_memberships',
    'Openness': 'openness_memberships',
}

for _, row in df.iterrows():
    spec = row['Current specialisation']
    fuzzy_sets = []

    # Add fuzzy memberships from numeric features
    for feat_name in numeric_features:
        feat_key = feat_name.lower().replace(" ", "_")
        memberships = [
            row[f'{feat_key}_low'],
            row[f'{feat_key}_med'],
            row[f'{feat_key}_high'],
        ]
        fuzzy_sets.append((feat_name, memberships))

    # Add memberships from pre-labeled personality traits
    for feat_name, col_name in labeled_features.items():
        memberships = row[col_name]
        fuzzy_sets.append((feat_name, memberships))

    # Recursively generate all rule label combinations and score them
    def generate_combinations(i=0, path=(), strength=1.0):
        if i == len(fuzzy_sets):
            rule_key = tuple(path) + (spec,)
            rule_scores[rule_key] += strength
            return
        feat_name, memberships = fuzzy_sets[i]
        for j, label in enumerate(labels):
            u = memberships[j]
            if u > 0:
                generate_combinations(i + 1, path + (label,), strength * u)

    generate_combinations()

# -------------------------------
# Output Learned Rules
# -------------------------------
feature_names = list(numeric_features.keys()) + list(labeled_features.keys())

print("\nTop Learned Fuzzy Rules:\n")
for rule, strength in sorted(rule_scores.items(), key=lambda x: x[1], reverse=True)[:30]:
    labels_part = rule[:-1]
    spec = rule[-1]
    conditions = " AND ".join([f"{feature_names[i]} is {label}" for i, label in enumerate(labels_part)])
    print(f"IF {conditions} THEN Recommend {spec} (Strength: {strength:.2f})")