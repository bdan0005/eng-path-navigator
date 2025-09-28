from pydantic import BaseModel

class Student(BaseModel):
    extraversion: float
    emotionality: float
    conscientiousness: float
    agreeableness: float
    openness: float
    
