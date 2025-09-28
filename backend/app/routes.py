from fastapi import APIRouter
import joblib

router = APIRouter()

# Load model
clf = joblib.load("model/pred_model.pkl")
scaler = joblib.load("model/scaler.pkl")

@router.get("/hello")
def say_hello():
    return {"message": "Hello from FastAPI route!"}

@router.post("/predict")
def predict(features_in: Student):
    df = pd.DataFrame([features_in.data])
    df = df.reindex(columns=features, fill_value=0)

    X_scaled = scaler.transform(df)
    proba = clf.predict_proba(X_scaled)[0]

    ranking = sorted(
        zip(clf.classes_, (proba * 100).round(2)),
        key=lambda x: x[1],
        reverse=True
    )

    return {"ranking": ranking, "top3": ranking[:3]}