import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# -------------------------------
# Load Data
# -------------------------------
df = pd.read_csv("survey_results_clean.csv")

# -------------------------------
# Get personality/skills columns
# -------------------------------
personality_cols = ["Extraversion", "Emotionality", "Conscientiousness", 
                    "Agreeableness", "Openness"]

skill_cols = ["Chemical Processes", "Circuits", "Coding", "CAD", 
              "Data Analysis", "Dynamics", "Engineering Design", 
              "Materials Properties", "Numerical Modelling", 
              "Smart Systems", "Statics", "3D Printing"]

# -------------------------------
# Fix NaN values in hobbies
# -------------------------------
for col in personality_cols + skill_cols:
    df[col] = df[col].fillna(df[col].mean())

df["Hobbies"] = df["Hobbies"].fillna("")
df["Hobbies"] = df["Hobbies"].apply(lambda x: [h.strip() for h in str(x).split(",")])

# -------------------------------
# Convert skill rankings to 0-1 scale
# -------------------------------
for col in skill_cols:
    df[col] = (13 - df[col]) / 12  # 0 = least interested, 1 = most interested

# -------------------------------
# Encode hobbies
# -------------------------------
all_hobbies = sorted({h for sublist in df["Hobbies"] for h in sublist if h != ""})
for hobby in all_hobbies:
    df[f"hobby_{hobby}"] = df["Hobbies"].apply(lambda x: 1 if hobby in x else 0)
hobby_cols = [f"hobby_{h}" for h in all_hobbies]

# -------------------------------
# Combine features
# -------------------------------
all_features = personality_cols + skill_cols + hobby_cols

# -------------------------------
# Train/test split
# -------------------------------
train_df, test_df = train_test_split(
    df, test_size=0.2, random_state=42, stratify=df["Engineering Specialisation"]
)

X_train = train_df[all_features].values
y_train = train_df["Engineering Specialisation"].values
X_test = test_df[all_features].values
y_test = test_df["Engineering Specialisation"].values

# -------------------------------
# Scale features
# -------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -------------------------------
# Random Forest Classifier
# -------------------------------
rf = RandomForestClassifier(
    n_estimators=200,        # number of trees
    max_depth=None,          # allow trees to grow fully
    random_state=42,
    class_weight="balanced"  # handle uneven class sizes
)
rf.fit(X_train_scaled, y_train)

# -------------------------------
# Accuracy
# -------------------------------
y_pred = rf.predict(X_test_scaled)
top1_accuracy = np.mean(y_pred == y_test)

probs = rf.predict_proba(X_test_scaled)
top3_correct = 0
for i, row_probs in enumerate(probs):
    top3_idx = np.argsort(row_probs)[::-1][:3]  # indices of top 3 probabilities
    top3_labels = rf.classes_[top3_idx]
    if y_test[i] in top3_labels:
        top3_correct += 1
top3_accuracy = top3_correct / len(y_test)

print(f"Top-1 Accuracy: {top1_accuracy:.2%} ({sum(y_pred == y_test)}/{len(y_test)})")
print(f"Top-3 Accuracy: {top3_accuracy:.2%} ({top3_correct}/{len(y_test)})")
