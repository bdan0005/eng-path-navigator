import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_distances
from sklearn.decomposition import PCA
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

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
# Weighted KNN using cosine distance
# -------------------------------
k = 3

def cosine_weighted_knn_predict(X_train, y_train, X_test, k=3):
    predictions_top1 = []
    predictions_top3 = []

    for i in range(X_test.shape[0]):
        x = X_test[i].reshape(1, -1)
        distances = cosine_distances(x, X_train).flatten()  
        neighbors_idx = np.argsort(distances)[:k]
        neighbors_labels = y_train[neighbors_idx]
        neighbors_weights = 1 / (distances[neighbors_idx] + 1e-6)  # avoid div by 0

        vote_dict = {}
        for label, w in zip(neighbors_labels, neighbors_weights):
            vote_dict[label] = vote_dict.get(label, 0) + w
        sorted_votes = sorted(vote_dict.items(), key=lambda x: x[1], reverse=True)
        predictions_top1.append(sorted_votes[0][0])
        predictions_top3.append([label for label, _ in sorted_votes[:3]])

    return predictions_top1, predictions_top3

y_pred_top1, y_pred_top3 = cosine_weighted_knn_predict(X_train_scaled, y_train, X_test_scaled, k=k)

# -------------------------------
# Accuracy
# -------------------------------
top1_accuracy = np.mean(y_pred_top1 == y_test)
top3_correct = sum(y_test[i] in y_pred_top3[i] for i in range(len(y_test)))
top3_accuracy = top3_correct / len(y_test)

print(f"Top-1 Accuracy: {top1_accuracy:.2%} ({sum(np.array(y_pred_top1) == y_test)}/{len(y_test)})")
print(f"Top-3 Accuracy: {top3_accuracy:.2%} ({top3_correct}/{len(y_test)})")

# -------------------------------
# Visualizations
# -------------------------------

# 1. Clusters of specialisations (PCA projection)
pca = PCA(n_components=2)
X_train_pca = pca.fit_transform(X_train_scaled)

plt.figure(figsize=(10, 7))
for spec in np.unique(y_train):
    idx = (y_train == spec)
    plt.scatter(X_train_pca[idx, 0], X_train_pca[idx, 1], label=spec, alpha=0.6)
plt.title("Clusters of Engineering Specialisations (PCA Projection)")
plt.xlabel("PC1")
plt.ylabel("PC2")
plt.legend()
plt.show()

# 2. Distribution of Top-1 predicted specialisations
plt.figure(figsize=(10, 6))
sns.countplot(x=y_pred_top1, order=pd.Series(y_pred_top1).value_counts().index)
plt.title("Distribution of Top-1 Predicted Specialisations")
plt.xticks(rotation=45)
plt.show()

# 3. Confusion matrix of predictions
cm = confusion_matrix(y_test, y_pred_top1, labels=np.unique(y_train))
plt.figure(figsize=(12, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=np.unique(y_train), yticklabels=np.unique(y_train))
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix of Specialisation Predictions")
plt.show()

# 4. Frequency of specialisations in Top-3 recommendations
top3_flat = [s for sublist in y_pred_top3 for s in sublist]
top3_counts = Counter(top3_flat)

plt.figure(figsize=(10, 6))
sns.barplot(x=list(top3_counts.keys()), y=list(top3_counts.values()))
plt.xticks(rotation=45)
plt.title("Frequency of Specialisations in Top-3 Recommendations")
plt.show()
