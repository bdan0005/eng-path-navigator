from fastapi import FastAPI
from app.routes import router as app_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://eng-path-navigator.onrender.com"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}
