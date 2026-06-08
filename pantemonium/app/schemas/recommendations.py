from pydantic import BaseModel, UUID4
from decimal import Decimal
from typing import Optional, List, Dict, Any

class RecommendationRequest(BaseModel):
    brand_id: UUID4
    category_id: UUID4
    fit_preference: str = "regular"
    region: str = "US"

class RecommendationResponse(BaseModel):
    recommendation_id: UUID4
    brand_name: str
    category: str
    recommended_size: str
    confidence_score: float
    fit_explanation: Optional[str] = None
    alternative_sizes: List[Dict[str, Any]] = []
    size_chart_reference: UUID4

class FeedbackCreate(BaseModel):
    recommendation_id: UUID4
    purchased: bool
    fit_result: Optional[str] = None
    rating: Optional[int] = None
    comments: Optional[str] = None
