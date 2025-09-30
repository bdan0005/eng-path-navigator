from fastapi import APIRouter
import joblib
import os
import pandas as pd
from app.models import Student

router = APIRouter()

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

clf = joblib.load(os.path.join(MODEL_DIR, "pred_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

@router.get("/hello")
def say_hello():
    return {"message": "Hello from FastAPI route!"}

# API function - getting recommendations
personality_features = ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"]
interests_features = ["Chemical Processes", "Circuits", "Coding", "CAD", "Data Analysis", "Dynamics",
                   "Engineering Design", "Materials Properties", "Numerical Modelling", "Smart Systems",
                   "Statics", "3D Printing"]
hobbies_features = [
    "hobby_Arts_and_crafts", "hobby_Board_games", "hobby_Bouldering", "hobby_Cars/automotive",
    "hobby_Cooking/Baking", "hobby_Gaming", "hobby_Gardening", "hobby_Lego", "hobby_Music",
    "hobby_Outdoor_activities_(e.g._hiking)", "hobby_Programming_or_other_computer-related_activities",
    "hobby_Reading", "hobby_Sports", "hobby_Travelling", "hobby_3D_printing", "hobby_Other"
]

features = personality_features + interests_features + hobbies_features

@router.post("/recommend")
def recommend(student: Student):
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
            interests_dict[interest] = (len(student.interests) - i) / len(student.interests)

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