from pydantic import BaseModel
from typing import List

class Student(BaseModel):
    extraversion: float
    emotionality: float
    conscientiousness: float
    agreeableness: float
    openness: float
    hobbies: List[str]
    interests: List[str]
