from fastapi import APIRouter, Request, Response
import requests
import json
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

GOOGLE_SCRIPT_URL = os.environ.get("GOOGLE_SCRIPT_URL")

if GOOGLE_SCRIPT_URL is None:
    raise ValueError("GOOGLE_SCRIPT_URL is not set in environment variables")

@router.get("/hello")
def say_hello():
    return {"message": "Hello from FastAPI route!"}

# API function - getting recommendations
personality_features = ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"]
interests_features = ["Chemical Processes", "Circuits", "Coding", "CAD", "Data Analysis", "Dynamics",
                   "Engineering Design", "Materials Properties", "Numerical Modelling", "Smart Systems",
                   "Statics", "3D Printing"]
hobbies_features = ['hobby_3D_printing', 'hobby_Arts_and_crafts', 'hobby_Board_games', 'hobby_Bouldering', 'hobby_Cars/automotive', 'hobby_Cooking/Baking', 'hobby_Gaming', 'hobby_Gardening', 'hobby_Lego', 'hobby_Music', 'hobby_Other', 'hobby_Outdoor_activities_(e.g._hiking)', 'hobby_Programming_or_other_computer-related_activities', 'hobby_Reading', 'hobby_Sports', 'hobby_Travelling']

features = personality_features + interests_features + hobbies_features

@router.post("/recommend")
def recommend(student: Student):
    # --- Personality ---
    personality_values = [
        student.extraversion / 100,
        student.emotionality / 100,
        student.conscientiousness / 100,
        student.agreeableness / 100,
        student.openness / 100
    ]

    # --- Interests ---
    interests_dict = {s: 0 for s in interests_features}
    for i, interest in enumerate(student.interests):
        if interest in interests_features:
            interests_dict[interest] = (len(student.interests) - i) / len(student.interests)
    interests_values = [interests_dict[s] for s in interests_features]

    # --- Hobbies ---
    hobbies_dict = {h: 0 for h in hobbies_features}
    for hobby in student.hobbies:
        col_name = f"hobby_{hobby.replace(' ', '_')}"
        if col_name in hobbies_dict:
            hobbies_dict[col_name] = 1
    hobbies_values = [hobbies_dict[h] for h in hobbies_features]

    # --- Combine features ---
    X = personality_values + interests_values + hobbies_values
    df = pd.DataFrame([X], columns=features)

    # --- Scale & Predict ---
    X_scaled = scaler.transform(df)
    proba = clf.predict_proba(X_scaled)[0]
    raw_scores = clf.decision_function(X_scaled)[0]

    # --- Combine results ---
    ranking = sorted(
        [
            {
                "specialisation": cls,
                "raw_score": round(float(raw), 4),
                "probability": round(float(p) * 100, 2)
            }
            for cls, raw, p in zip(clf.classes_, raw_scores, proba)
        ],
        key=lambda x: x["probability"],
        reverse=True
    )

    return {"ranking": ranking}

@router.api_route("/send-to-sheet", methods=["POST", "OPTIONS"])
async def send_to_sheet(req: Request):
    """
    Handles POST and OPTIONS requests, applies CORS manually,
    and forwards valid POST data to the Google Apps Script endpoint.
    """
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600"
    }

    # --- Handle preflight (OPTIONS) ---
    if req.method == "OPTIONS":
        return Response(status_code=204, headers=cors_headers)

    # --- Handle POST ---
    try:
        data = await req.json()
        if not data:
            raise ValueError("Request body must be valid JSON.")

        print(f"Received data: {data}")

        sheet_response = requests.post(
            GOOGLE_SCRIPT_URL,
            json=data,
            headers={"Content-Type": "application/json"}
        )
        sheet_response.raise_for_status()

        return Response(
            content=sheet_response.text,
            status_code=200,
            headers={"Access-Control-Allow-Origin": "*"}
        )

    except ValueError as e:
        print(f"Data error: {e}")
        return Response(f"Bad Request: {e}", status_code=400, headers=cors_headers)

    except requests.exceptions.RequestException as e:
        print(f"Outbound request failed: {e}")
        return Response("Internal Server Error: Failed to reach Google Script.", status_code=500, headers=cors_headers)

    except Exception as e:
        print(f"Unexpected error: {e}")
        return Response(f"Internal Server Error: {e}", status_code=500, headers=cors_headers)