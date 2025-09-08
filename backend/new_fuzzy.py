import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from collections import defaultdict

# -------------------------------
# CONFIGURATION
# -------------------------------
excel_file = "rough_survey_data.xlsx"
specialisation_column = "Q1"

# numeric features have numbers associated with them
# numeric features are: each of the 5 ITP scores (out of 100), rank for all 12 content topics (students only choose four) 
numeric_features = [
    "Q11_1",   # ITP extraversion score
    "Q11_2",   # ITP emotionality score
    "Q11_3",   # ITP conscientiousness score
    "Q11_4",   # ITP agreeableness score
    "Q11_5",   # ITP openness score 
    "Q21_16",  # Chemical processes (waste water)
    "Q21_18",  # Circuits
    "Q21_11",  # Coding
    "Q21_14",  # Computer aided design (CAD)
    "Q21_12",  # Data analysis
    "Q21_20",  # Dynamics
    "Q21_10",  # Engineering design
    "Q21_17",  # Materials properties
    "Q21_15",  # Numerical modelling
    "Q21_19",  # Smart systems
    "Q21_9",  # Statics
    "Q21_13"   # 3D printing
]

# hobbies are originally labelled text columns (we will drop these after expanding)
labelled_text_cols = ["Q12", "Q12_15_TEXT"]

# define all the possible hobbies
all_hobbies = [
    "Arts and crafts", 
    "Board games", 
    "Bouldering", 
    "Cars/automotive",
    "Cooking/Baking", 
    "Gaming", 
    "Gardening", 
    "Lego", 
    "Music",
    "Outdoor activities (e.g. hiking)", 
    "Podcasts",
    "Programming or other computer‐related activities",
    "Reading", 
    "Sports", 
    "Travelling"
]

# -------------------------------
# FUZZY UTILITIES
# -------------------------------
def define_fuzzy_sets(vals):
    km = KMeans(n_clusters=3, random_state=0)
    centers = km.fit(vals.values.reshape(-1,1)).cluster_centers_.flatten()
    return np.sort(centers)

def triangular_membership(x, a, b, c):
    if x <= a or x >= c:
        return 0.0
    if x == b:
        return 1.0
    if x < b:
        return (x - a) / (b - a)
    return (c - x) / (c - b)

def compute_memberships(series, centers, lo, hi):
    a, b, c = centers
    return [
        (
            triangular_membership(x, lo, a, b),
            triangular_membership(x, a, b, c),
            triangular_membership(x, b, c, hi)
        )
        for x in series
    ]

# -------------------------------
# LOAD & INITIAL PREPROCESS
# -------------------------------
df = pd.read_excel(excel_file, engine="openpyxl")

# hobby text processing
# 1) Expand the comma‐separated Q12 into one binary column per hobby
#    1.0 if chosen, 0.0 if not.
df["__hobby_list__"] = (
    df["Q12"]
      .fillna("")            # missing → empty list
      .astype(str)
      .str.split(",")
)
for hobby in all_hobbies + ["Other"]:
    col = f"hobby_{hobby.replace(' ','_').replace('(','').replace(')','')}"
    df[col] = df["__hobby_list__"].apply(lambda L: float(hobby in L))

# 2) If they typed anything in Q12_15_TEXT, mark hobby_Other = 1
#    (this overwrites the “Other” column above)
# may not need this at all
df["hobby_Other"] = df["Q12_15_TEXT"].fillna("").astype(str).str.strip().apply(lambda t: float(bool(t)))

# 3) Drop the intermediate and original text columns
df = df.drop(columns=labelled_text_cols + ["__hobby_list__"])

# 4) Add our new hobby columns to the numeric_features list
hobby_features = [c for c in df.columns if c.startswith("hobby_")]
numeric_features = numeric_features + hobby_features

# 5a) Coerce all supposed-numeric cols to numbers
df[numeric_features] = df[numeric_features].apply(pd.to_numeric, errors="coerce")

# 5b) For each Q21_* topic rank, fill missing with "max rank" (they didn't choose it)
topic_cols = [
    "Q21_16","Q21_18","Q21_11","Q21_14","Q21_12",
    "Q21_20","Q21_10","Q21_17","Q21_15","Q21_19",
    "Q21_9", "Q21_13"
]
for col in topic_cols:
    max_rank = df[col].max(skipna=True)
    df[col].fillna(max_rank, inplace=True)

# 5c) Now drop only on the 5 ITP scores + specialisation (they must all be answered)
itp_cols = ["Q11_1","Q11_2","Q11_3","Q11_4","Q11_5"]
df.dropna(subset=itp_cols + [specialisation_column], inplace=True)

# -------------------------------
# DEFINE & COMPUTE FUZZY MEMBERSHIPS FOR NUMERIC FEATURES
# -------------------------------
numeric_centers = {}
feature_ranges  = {}

for feat in numeric_features:
    vals = df[feat]
    lo, hi = vals.min(), vals.max()
    centers = define_fuzzy_sets(vals)
    numeric_centers[feat] = centers
    feature_ranges[feat]  = (lo, hi)

    # For each feat, compute (µ_low, µ_med, µ_high)
    df[[f"{feat}_low", f"{feat}_med", f"{feat}_high"]] = pd.DataFrame(
        compute_memberships(vals, centers, lo, hi),
        index=df.index
    )

# -------------------------------
# BUILD SPECIALISATION PROFILES
# -------------------------------
def build_specialisation_profiles(df):
    profiles = defaultdict(list)
    for _, row in df.iterrows():
        vec = []
        for feat in numeric_features:
            vec += [
                row[f"{feat}_low"],
                row[f"{feat}_med"],
                row[f"{feat}_high"]
            ]
        profiles[row[specialisation_column]].append(vec)

    # average fuzzy vectors per specialisation
    return {
        spec: np.mean(vectors, axis=0)
        for spec, vectors in profiles.items()
    }

specialisation_profiles = build_specialisation_profiles(df)

# -------------------------------
# INFERENCE & RECOMMENDATION
# -------------------------------
def fuzzy_vector_for_student(inp):
    vec = []
    for feat in numeric_features:
        lo, hi = feature_ranges[feat]
        a, b, c = numeric_centers[feat]
        x = inp.get(feat, lo)
        vec += [
            triangular_membership(x, lo, a, b),
            triangular_membership(x, a, b, c),
            triangular_membership(x, b, c, hi)
        ]
    return np.array(vec)

def recommend_by_similarity(inp, top_n=3):
    sv = fuzzy_vector_for_student(inp)
    sims = {
        spec: np.dot(sv, prof_vec) /
              (np.linalg.norm(sv) * np.linalg.norm(prof_vec))
        for spec, prof_vec in specialisation_profiles.items()
    }
    return sorted(sims.items(), key=lambda x: x[1], reverse=True)[:top_n]

# -------------------------------
# PRINT FUZZY RULES (OPTIONAL)
# -------------------------------
def print_fuzzy_rules():
    traits = numeric_features
    labels = ["Low", "Medium", "High"]
    for spec, prof in specialisation_profiles.items():
        parts = []
        for i, trait in enumerate(traits):
            m = prof[i*3:(i*3+3)]
            parts.append(f"{trait} is {labels[np.argmax(m)]}")
        print("IF " + " AND ".join(parts) + f" THEN Specialisation = {spec}\n")

print("\nFuzzy Rules Learned:\n")
print_fuzzy_rules()

# -------------------------------
# EXAMPLE NEW STUDENT
# -------------------------------
new_student = {
    # ITP scores:
    "Q11_1": 60, "Q11_2": 50, "Q11_3": 70, "Q11_4": 80, "Q11_5": 55,
    # Topic ranks (1–12):
    "Q21_16": 1, "Q21_18": 5, "Q21_11": 2, "Q21_14": 8,
    "Q21_12": 3, "Q21_20": 4, "Q21_10": 6, "Q21_17": 7,
    "Q21_15": 9, "Q21_19": 10, "Q21_9":  11, "Q21_13": 12,
    # Hobbies (1.0 = chosen, 0.0 = not)
    **{hf: (1.0 if hf=="hobby_Gaming" else 0.0) for hf in hobby_features}
}

print("\nTop-3 Recommendations:")
for spec, score in recommend_by_similarity(new_student):
    print(f"  {spec}: {score:.4f}")
