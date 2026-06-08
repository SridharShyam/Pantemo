from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.schemas.recommendations import RecommendationRequest, RecommendationResponse
from app.core.fit_engine import FitEngine
from app.database import get_db
from app.models.measurements import UserMeasurement
from app.models.recommendations import Recommendation
from app.ml import active_feedback
from typing import Any
import json
from pydantic import BaseModel

router = APIRouter()

@router.post("/calculate", response_model=RecommendationResponse)
async def calculate_fit(
    request: RecommendationRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
) -> Any:
    """
    Calculate size recommendation for the current user.
    """
    # 1. Fetch user measurements
    result = await db.execute(
        select(UserMeasurement).where(
            UserMeasurement.user_id == current_user.id,
            UserMeasurement.is_current == True
        )
    )
    measurement_record = result.scalar_one_or_none()
    
    if not measurement_record:
        raise HTTPException(
            status_code=400, 
            detail="User measurements not found. Please add measurements first via /users/me/measurements"
        )
        
    # Convert SQLAlchemy model to dict for engine
    user_measurements = {
        "chest_cm": measurement_record.chest_cm,
        "waist_cm": measurement_record.waist_cm,
        "hip_cm": measurement_record.hip_cm,
    }
    # Add optional measurements if they exist
    if measurement_record.shoulder_width_cm:
        user_measurements["shoulder_width_cm"] = measurement_record.shoulder_width_cm
    if measurement_record.height_cm:
        user_measurements["height_cm"] = measurement_record.height_cm
    if measurement_record.weight_kg:
        user_measurements["weight_kg"] = measurement_record.weight_kg
    
    # 2. Run Fit Engine
    engine = FitEngine(db)
    recommendation = await engine.calculate_recommendation(
        user_measurements=user_measurements,
        brand_id=request.brand_id,
        category_id=request.category_id,
        fit_preference=request.fit_preference,
        region=request.region
    )
    
    if "error" in recommendation:
         raise HTTPException(status_code=404, detail=recommendation["error"])
         
    # 3. Save recommendation to DB
    # Ensure values are compatible with DB columns
    db_rec = Recommendation(
        user_id=current_user.id,
        brand_id=request.brand_id,
        category_id=request.category_id,
        size_chart_id=recommendation["size_chart_reference"],
        recommended_size=recommendation["recommended_size"],
        confidence_score=recommendation["confidence_score"],
        fit_style_used=request.fit_preference,
        measurement_snapshot=user_measurements # SQLAlchemy JSON type handles dict
    )
    db.add(db_rec)
    await db.commit()
    await db.refresh(db_rec)
    
    # 4. Construct Response
    return {
        "recommendation_id": db_rec.id,
        "brand_name": "Calculated Brand", # TODO: Fetch brand name if needed, or rely on frontend providing it from ID
        "category": "Calculated Category", # TODO: Fetch category name
        "recommended_size": recommendation["recommended_size"],
        "confidence_score": float(recommendation["confidence_score"]),
        "fit_explanation": recommendation.get("fit_explanation", ""),
        "alternative_sizes": recommendation.get("alternatives", []),
        "size_chart_reference": recommendation["size_chart_reference"]
    }

@router.get("/history")
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
) -> Any:
    """
    Get recommendation history for the current user.
    """
    from sqlalchemy.orm import joinedload
    result = await db.execute(
        select(Recommendation)
        .options(joinedload(Recommendation.brand), joinedload(Recommendation.category))
        .where(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.created_at.desc())
    )
    recommendations = result.scalars().all()
    
    return [
        {
            "id": str(rec.id),
            "brand": rec.brand.name if rec.brand else "Unknown Brand",
            "category": rec.category.name if rec.category else "Unknown Category",
            "size": rec.recommended_size,
            "confidence": float(rec.confidence_score) * 100 if rec.confidence_score else 0,
            "fitStyle": rec.fit_style_used or "Unknown",
            "timestamp": rec.created_at.isoformat() if rec.created_at else None,
        }
        for rec in recommendations
    ]

# ML Feedback Loop Payload Schema
class FeedbackRequest(BaseModel):
    rating: str  # e.g., 'perfect', 'too_large', 'returned'

@router.post("/{recommendation_id}/feedback")
async def submit_feedback(
    recommendation_id: str,
    feedback: FeedbackRequest,
    current_user = Depends(deps.get_current_user)
) -> Any:
    """
    Submits ground-truth purchase/fit feedback into the ML active learning pipeline.
    """
    result = active_feedback.ingest_feedback(
        user_id=current_user.id, 
        rec_id=recommendation_id, 
        rating=feedback.rating
    )
    return result
