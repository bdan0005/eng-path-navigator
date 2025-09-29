import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, top_k_accuracy_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression

# Load data
df = pd.read_csv("survey_results_clean.csv")

# --- Features and target ---
personality_traits = [
    "Extraversion",
    "Emotionality",
    "Conscientiousness",
    "Agreeableness",
    "Openness"
]

skills = [
    "Chemical Processes",
    "Circuits",
    "Coding",
    "CAD",
    "Data Analysis",
    "Dynamics",
    "Engineering Design",
    "Materials Properties",
    "Numerical Modelling",
    "Smart Systems",
    "Statics",
    "3D Printing"
]

# hobbies processing
# Expand the comma-separated hobbies into binary columns
df["__hobby_list__"] = (
    df["Hobbies"]
      .fillna("")
      .astype(str)
      .str.split(",")
)

# Collect all unique hobby labels from the dataset
all_hobbies = sorted({h.strip() for sublist in df["__hobby_list__"] for h in sublist if h.strip()})

# Create binary columns for each hobby (one hot encoding)
for hobby in all_hobbies:
    col = f"hobby_{hobby.replace(' ','_')}"
    df[col] = df["__hobby_list__"].apply(lambda L: float(hobby in [h.strip() for h in L]))

# Add free-text "Other"
df["hobby_Other"] = df["Please.select.the.hobbies.activities.you.enjoy.in.your.spare.time..Please.select.up.to.5.options....Other...Text"].fillna("").astype(str).str.strip().apply(lambda t: float(bool(t)))

# Find hobby columns automatically
hobbies = [c for c in df.columns if c.startswith("hobby_")]

target = "Engineering Specialisation"

# --- Heatmaps to visualise ---
# Personality traits vs Specialisation
plt.figure(figsize=(12, 6))
sns.heatmap(
    df.groupby(target)[personality_traits].mean(),
    annot=True, cmap="coolwarm", cbar=True
)
plt.title("Average Personality Traits by Specialisation")
plt.tight_layout()
plt.show()

# Content interest/skills vs Specialisation
plt.figure(figsize=(12, 6))
sns.heatmap(
    df.groupby(target)[skills].mean(),
    annot=True, cmap="YlGnBu", cbar=True
)
plt.title("Average Skills by Specialisation")
plt.tight_layout()
plt.show()

# Hobbies vs Specialisation
plt.figure(figsize=(12, 6))
# Exclude "hobby_Other" from the heatmap if it's always 1 (no variance)
hobbies_for_heatmap = [h for h in hobbies if h != "hobby_Other"]

sns.heatmap(
    df.groupby(target)[hobbies_for_heatmap].mean(),
    annot=True, cmap="BuPu", cbar=True
)
plt.xticks(
    ticks=np.arange(len(hobbies_for_heatmap)) + 0.5,
    labels=[h.replace("hobby_", "").replace("_", " ") for h in hobbies_for_heatmap],
    rotation=45,
    ha="right"
)
plt.title("Average Hobbies by Specialisation")
plt.tight_layout()
plt.show()

# --- Fuzzy-style predictor ---
X = df[personality_traits + skills + hobbies].fillna(0)
y = df[target]

# Scale features to [0,1] to simulate fuzzy membership degrees
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# Logistic Regression baseline
clf = LogisticRegression(max_iter=500, multi_class="multinomial")
clf.fit(X_train, y_train)

# Predictions
y_pred = clf.predict(X_test)
y_pred_proba = clf.predict_proba(X_test)

# Evaluation
acc_top1 = accuracy_score(y_test, y_pred)
acc_top3 = top_k_accuracy_score(y_test, y_pred_proba, k=3, labels=clf.classes_)
acc_top5 = top_k_accuracy_score(y_test, y_pred_proba, k=5, labels=clf.classes_)

print(f"Prediction Accuracy @1: {acc_top1:.2f}")
print(f"Prediction Accuracy @3: {acc_top3:.2f}")
print(f"Prediction Accuracy @5: {acc_top5:.2f}")

# Recommender function
def recommend_specialisation(student_features, model, scaler, classes, top_n=3):
    """
    Given a student's features (dict or row), return ranked % match for all specialisations.
    """
    # Convert to DataFrame if dict
    if isinstance(student_features, dict):
        student_df = pd.DataFrame([student_features])
    else:
        student_df = student_features.to_frame().T
    
    # Scale features
    student_scaled = scaler.transform(student_df)
    
    # Predict probabilities
    proba = model.predict_proba(student_scaled)[0]
    
    # Build ranking table
    ranking = pd.DataFrame({
        "Specialisation": classes,
        "Match %": (proba * 100).round(2)
    }).sort_values("Match %", ascending=False).reset_index(drop=True)
    
    return ranking.head(top_n), ranking

# using recommender function
# Pick one test student (e.g., first row in X_test)
student_idx = 0
student_features = pd.Series(X_test[student_idx], index=df[personality_traits + skills + hobbies].columns)

# Get recommendations
top3, full_ranking = recommend_specialisation(student_features, clf, scaler, clf.classes_, top_n=3)

print("\nTop-3 Recommendations:")
print(top3)

print("\nFull Ranking:")
print(full_ranking)

all_rankings = []

# for i in range(11): # First 10 students in test set, but can change to len(X_test)
#     proba = y_pred_proba[i]
#     ranking = pd.DataFrame({
#         "Specialisation": clf.classes_,
#         "Match %": (proba * 100).round(2)
#     }).sort_values("Match %", ascending=False).reset_index(drop=True)
#     all_rankings.append(ranking)

#     # Example: print top-3 for student 0
#     print(f"\nRanked Recommendations for Student {i}:")
#     print(all_rankings[i].head(10))


# Getting the coefficients of the model after fitting the model
print("Coefficients shape:", clf.coef_.shape)
print("Intercepts shape:", clf.intercept_.shape)

# Feature names
feature_names = df[personality_traits + skills + hobbies].columns

# Print coefficients for each class
for idx, class_label in enumerate(clf.classes_):
    print(f"\nClass: {class_label}")
    for feature, coef in zip(feature_names, clf.coef_[idx]):
        print(f"{feature}: {coef:.4f}")

# Print intercepts for each class
print("\nIntercepts (log-odds) for each class:")
for idx, class_label in enumerate(clf.classes_):
    print(f"{class_label}: {clf.intercept_[idx]:.4f}")

# Create a DataFrame of coefficients
coef_df = pd.DataFrame(clf.coef_, index=clf.classes_, columns=feature_names)
# Remove hobby_ prefix from hobby list
pretty_feature_names = [f.replace("hobby_", "") for f in feature_names]
coef_df.columns = pretty_feature_names

plt.figure(figsize=(18, 6))
sns.heatmap(coef_df, annot=True, cmap="coolwarm", center=0, cbar=True)
plt.title("Logistic Regression Coefficient Heatmap (Features vs Specialisations)")
plt.xlabel("Feature")
plt.ylabel("Specialisation")
plt.tight_layout()
plt.show()