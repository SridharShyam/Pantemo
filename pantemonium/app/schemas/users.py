from pydantic import BaseModel, UUID4, EmailStr
from datetime import datetime
from typing import Optional

class UserMeasureRequest(BaseModel):
    chest_cm: float
    waist_cm: float
    hip_cm: float
    shoulder_width_cm: Optional[float] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None

class UserMeasureCreate(UserMeasureRequest):
    preferred_fit: str = "regular"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID4
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
