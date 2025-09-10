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

target = "Engineering Specialisation"

# --- Heatmaps to visualise ---
plt.figure(figsize=(12, 6))
sns.heatmap(
    df.groupby(target)[personality_traits].mean(),
    annot=True, cmap="coolwarm", cbar=True
)
plt.title("Average Personality Traits by Specialisation")
plt.show()

plt.figure(figsize=(12, 6))
sns.heatmap(
    df.groupby(target)[skills].mean(),
    annot=True, cmap="YlGnBu", cbar=True
)
plt.title("Average Skills by Specialisation")
plt.show()

# --- Fuzzy-style predictor ---
X = df[personality_traits + skills].fillna(0)
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

print(f"Prediction Accuracy @1: {acc_top1:.2f}")
print(f"Prediction Accuracy @3: {acc_top3:.2f}")
