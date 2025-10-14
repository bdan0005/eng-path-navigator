import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, top_k_accuracy_score
from sklearn.preprocessing import MinMaxScaler
from itertools import product
import joblib
from logistic_regression import LogisticRegression

# --------------------------
# --- Load and preprocess data ---
# --------------------------
df = pd.read_csv("survey_results_clean.csv")

personality_traits = ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"]
skills = ["Chemical Processes", "Circuits", "Coding", "CAD", "Data Analysis", "Dynamics", "Engineering Design",
          "Materials Properties", "Numerical Modelling", "Smart Systems", "Statics", "3D Printing"]

# Hobbies one-hot encoding
df["__hobby_list__"] = df["Hobbies"].fillna("").astype(str).str.split(",")
all_hobbies = sorted({h.strip() for sublist in df["__hobby_list__"] for h in sublist if h.strip()})
for hobby in all_hobbies:
    col = f"hobby_{hobby.replace(' ','_')}"
    df[col] = df["__hobby_list__"].apply(lambda L: float(hobby in [h.strip() for h in L]))
df["hobby_Other"] = df["Please.select.the.hobbies.activities.you.enjoy.in.your.spare.time..Please.select.up.to.5.options....Other...Text"].fillna("").astype(str).str.strip().apply(lambda t: float(bool(t)))
hobbies = [c for c in df.columns if c.startswith("hobby_")]

target = "Engineering Specialisation"

# --------------------------
# --- Prepare features and target ---
# --------------------------
X = df[personality_traits + skills + hobbies].fillna(0)
y_labels = df[target]
# Convert string class labels to integers
classes = np.unique(y_labels)
class_to_int = {c: i for i, c in enumerate(classes)}
int_to_class = {i: c for c, i in class_to_int.items()}
y = y_labels.map(class_to_int).values

# Scale features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

# --------------------------
# --- Train custom logistic regression ---
# --------------------------
clf = LogisticRegression(lr=0.5, epochs=1000)
clf.fit(X_train, y_train)

# Predictions
y_pred = clf.predict(X_test)
y_pred_proba = clf.predict_proba(X_test)

# Convert predicted integers back to class labels
y_pred_labels = np.array([int_to_class[i] for i in y_pred])
y_test_labels = np.array([int_to_class[i] for i in y_test])

# Evaluation
acc_top1 = accuracy_score(y_test_labels, y_pred_labels)
acc_top3 = top_k_accuracy_score(y_test, y_pred_proba, k=3)
acc_top5 = top_k_accuracy_score(y_test, y_pred_proba, k=5)

print(f"\nPrediction Accuracy @1: {acc_top1:.2f}")
print(f"Prediction Accuracy @3: {acc_top3:.2f}")
print(f"Prediction Accuracy @5: {acc_top5:.2f}")

# --------------------------
# --- Recommender function ---
# --------------------------
def recommend_specialisation(student_features, model, scaler, classes, top_n=3):
    if isinstance(student_features, dict):
        student_df = pd.DataFrame([student_features])
    else:
        student_df = student_features.to_frame().T
    student_scaled = scaler.transform(student_df)
    proba = model.predict_proba(student_scaled)[0]
    ranking = pd.DataFrame({
        "Specialisation": classes,
        "Match %": (proba * 100).round(2)
    }).sort_values("Match %", ascending=False).reset_index(drop=True)
    return ranking.head(top_n), ranking

# Example recommendation for first test student
student_idx = 0
student_features = pd.Series(X_test[student_idx], index=X.columns)
top3, full_ranking = recommend_specialisation(student_features, clf, scaler, classes, top_n=3)

print("\nTop-3 Recommendations:")
print(top3)
print("\nFull Ranking:")
print(full_ranking)

# --------------------------
# --- Save model and scaler ---
# --------------------------
joblib.dump(clf, "pred_model.pkl")
joblib.dump(scaler, "scaler.pkl")
