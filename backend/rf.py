import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load your data
df = pd.read_excel("specialisation_data_clean.xlsx", engine="openpyxl")

# Define raw numeric features
numeric_features = ['CAD', 'Design', '3D Printing', 'Teamwork', 'Coding', 'Microcontrollers']

# Categorical personality features
categorical_features = ['Extraversion', 'Emotionality', 'Conscientiousness', 'Agreeableness', 'Openness']

# Target
target = 'Current specialisation'

label_map = {'Low': 0, 'Medium': 1, 'High': 2}
for col in categorical_features:
    df[col] = df[col].map(label_map)

# Combine all features
X = df[numeric_features + categorical_features].values

# Encode target
le = LabelEncoder()
y = le.fit_transform(df[target])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("Classification Report:")

def safe_classification_report(y_true, y_pred, label_encoder):
    labels_present = np.unique(y_true)
    class_names_present = label_encoder.inverse_transform(labels_present)
    return classification_report(y_true, y_pred, labels=labels_present, target_names=class_names_present)

# Use it like this:
print(safe_classification_report(y_test, y_pred, le))


new_student = {
    'CAD': 3,
    'Design': 5,
    '3D Printing': 2,
    'Teamwork': 1,
    'Coding': 0,
    'Microcontrollers': 0,
    'Extraversion': "Low",
    'Emotionality': "Low",
    'Conscientiousness': "Low",
    'Agreeableness': "Medium",
    'Openness': "High"
}

# Format input
student_vec = [
    new_student['CAD'],
    new_student['Design'],
    new_student['3D Printing'],
    new_student['Teamwork'],
    new_student['Coding'],
    new_student['Microcontrollers'],
    label_map[new_student['Extraversion']],
    label_map[new_student['Emotionality']],
    label_map[new_student['Conscientiousness']],
    label_map[new_student['Agreeableness']],
    label_map[new_student['Openness']],
]

student_vec = np.array(student_vec).reshape(1, -1)

# Predict
predicted_class = clf.predict(student_vec)[0]
predicted_label = le.inverse_transform([predicted_class])[0]

print("Predicted specialisation:", predicted_label)
