import numpy as np
from sklearn.cluster import KMeans
import pandas as pd
from collections import defaultdict

# -------------------------------
# Load Data
# -------------------------------
df = pd.read_csv("survey_results_clean.csv")

# Personality columns
personality_cols = ["Extraversion", "Emotionality", "Conscientiousness", 
                    "Agreeableness", "Openness"]

# Skill ranking columns (1-12)
skill_cols = ["Chemical Processes", "Circuits", "Coding", "CAD", 
              "Data Analysis", "Dynamics", "Engineering Design", 
              "Materials Properties", "Numerical Modelling", 
              "Smart Systems", "Statics", "3D Printing"]

# Convert skill rankings to 0-100 scale
for col in skill_cols:
    df[col] = (13 - df[col]) / 12 * 100

# --- Hobbies handling ---
# Split multiple hobbies into lists
df["Hobbies"] = df["Hobbies"].fillna("").apply(lambda x: [h.strip() for h in str(x).split(",")])

# Get all unique hobbies in dataset
all_hobbies = sorted({h for sublist in df["Hobbies"] for h in sublist if h != ""})

# Create one-hot encoding for hobbies
for hobby in all_hobbies:
    df[f"hobby_{hobby}"] = df["Hobbies"].apply(lambda x: 1 if hobby in x else 0)

hobby_cols = [f"hobby_{h}" for h in all_hobbies]

# --- Combine features ---
all_features = personality_cols + skill_cols + hobby_cols

# Learn average engineering specialisation profiles
profiles = df.groupby("Engineering Specialisation")[all_features].mean()

# Example new student
student = {
    "Extraversion": 55,
    "Emotionality": 40,
    "Conscientiousness": 70,
    "Agreeableness": 60,
    "Openness": 75,
    "Chemical Processes": 5,
    "Circuits": 8,
    "Coding": 1,
    "CAD": 6,
    "Data Analysis": 2,
    "Dynamics": 7,
    "Engineering Design": 4,
    "Materials Properties": 10,
    "Numerical Modelling": 3,
    "Smart Systems": 9,
    "Statics": 11,
    "3D Printing": 12,
    "Hobbies": ["Gaming", "Music", "Sports"]  # example multi-choice
}

# Convert student skill rankings
for col in skill_cols:
    student[col] = (13 - student[col]) / 12 * 100

# Add hobbies
for hobby in all_hobbies:
    student[f"hobby_{hobby}"] = 1 if hobby in student["Hobbies"] else 0

# Convert to vector
student_vec = np.array([student[c] for c in all_features])

# Cosine similarity
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare student to profiles
results = {}
for spec, row in profiles.iterrows():
    profile_vec = row.values
    similarity = cosine_similarity(student_vec, profile_vec)
    results[spec] = similarity

# Rank results
ranked = sorted(results.items(), key=lambda x: x[1], reverse=True)

print("\nRecommendations:")
for spec, score in ranked:
    print(f"{spec:30s} -> {score:.3f}")