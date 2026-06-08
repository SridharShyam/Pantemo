from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.api import deps
from app.models.users import User
from app.models.measurements import UserMeasurement
from app.schemas.users import UserResponse, UserMeasureCreate, UserMeasureRequest
from app.schemas.measurements import MeasurementResponse, MeasurementCreate
from app.database import get_db
from app.ml import cv_model
from pydantic import BaseModel

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/me/measurements", response_model=MeasurementResponse)
async def create_measurement(
    measurement_in: MeasurementCreate,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create new measurement for current user.
    """
    # Deactivate old measurements? 
    # Or just mark new one as current?
    # Logic: Set all existing current=True measurements for this user to False
    
    await db.execute(
        update(UserMeasurement).where(UserMeasurement.user_id == current_user.id).values(is_current=False)
    )
    
    measurement = UserMeasurement(
        user_id=current_user.id,
        chest_cm=measurement_in.chest_cm,
        waist_cm=measurement_in.waist_cm,
        hip_cm=measurement_in.hip_cm,
        shoulder_width_cm=measurement_in.shoulder_width_cm,
        height_cm=measurement_in.height_cm,
        weight_kg=measurement_in.weight_kg,
        preferred_fit=measurement_in.preferred_fit,
        is_current=True
    )
    db.add(measurement)
    await db.commit()
    await db.refresh(measurement)
    return measurement

class CVMeasurementRequest(BaseModel):
    height_cm: float
    image_b64: str = None  # Optional, since we mock it

@router.post("/me/measurements/cv", response_model=MeasurementCreate)
async def estimate_measurements_cv(
    request: CVMeasurementRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Use ML Computer Vision to estimate body measurements from height and an image.
    """
    estimated = cv_model.estimate_measurements(
        height_cm=request.height_cm,
        image_b64=request.image_b64
    )
    
    # Return as a MeasurementCreate payload so frontend can populate the form
    return MeasurementCreate(
        chest_cm=estimated["chest_cm"],
        waist_cm=estimated["waist_cm"],
        hip_cm=estimated["hip_cm"],
        shoulder_width_cm=estimated["shoulder_width_cm"],
        height_cm=estimated["height_cm"],
        weight_kg=estimated["weight_kg"],
        preferred_fit="regular"  # default
    )

@router.get("/me/measurements", response_model=List[MeasurementResponse])
async def read_measurements(
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all measurements for current user.
    """
    result = await db.execute(
        select(UserMeasurement).where(UserMeasurement.user_id == current_user.id)
    )
    return result.scalars().all()
