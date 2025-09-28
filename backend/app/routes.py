from fastapi import APIRouter
import joblib
import pandas as pd
from models import Student

router = APIRouter()

# Load model
clf = joblib.load("model/pred_model.pkl")
scaler = joblib.load("model/scaler.pkl")

@router.get("/hello")
def say_hello():
    return {"message": "Hello from FastAPI route!"}

personality_features = ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"]
interests_features = ["Chemical Processes", "Circuits", "Coding", "CAD", "Data Analysis", "Dynamics",
                   "Engineering Design", "Materials Properties", "Numerical Modelling", "Smart Systems",
                   "Statics", "3D Printing"]
hobbies_features = [
    "hobby_Arts_and_crafts", "hobby_Board_games", "hobby_Bouldering", "hobby_Cars/automotive",
    "hobby_Cooking/Baking", "hobby_Gaming", "hobby_Gardening", "hobby_Lego", "hobby_Music",
    "hobby_Outdoor_activities", "hobby_Programming_or_other_computer-related_activities",
    "hobby_Reading", "hobby_Sports", "hobby_Travelling", "hobby_3D_printing"
]

features = personality_features + interests_features + hobbies_features

@router.post("/predict")
def predict(student: Student):
    personality_values = [
        student.extraversion / 100,
        student.emotionality / 100,
        student.conscientiousness / 100,
        student.agreeableness / 100,
        student.openness / 100
    ]

    interests_dict = {s: 0 for s in interests_features}
    for i, interest in enumerate(student.interests):
        if interest in interests_features:
            interests_dict[interest] = (len(student.skills_ranked) - i) / len(student.interests)

    interests_values = [interests_dict[s] for s in interests_features]

    hobbies_dict = {h: 0 for h in hobbies_features}
    for hobby in student.hobbies:
        col_name = f"hobby_{hobby.replace(' ', '_')}"
        if col_name in hobbies_dict:
            hobbies_dict[col_name] = 1
    hobbies_values = [hobbies_dict[h] for h in hobbies_features]

    X = personality_values + interests_values + hobbies_values
    df = pd.DataFrame([X], columns=features)

    X_scaled = scaler.transform(df)
    proba = clf.predict_proba(X_scaled)[0]

    ranking = sorted(
        zip(clf.classes_, (proba * 100).round(2)),
        key=lambda x: x[1],
        reverse=True
    )

    return {"ranking": ranking}