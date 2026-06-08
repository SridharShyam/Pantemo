from pydantic import BaseModel, UUID4
from decimal import Decimal
from typing import Optional
from enum import Enum
from datetime import datetime

class FitPreference(str, Enum):
    slim = "slim"
    regular = "regular"
    relaxed = "relaxed"
    oversized = "oversized"

class MeasurementBase(BaseModel):
    chest_cm: Decimal
    waist_cm: Decimal
    hip_cm: Decimal
    shoulder_width_cm: Optional[Decimal] = None
    height_cm: Optional[Decimal] = None
    weight_kg: Optional[Decimal] = None
    preferred_fit: FitPreference = FitPreference.regular

class MeasurementCreate(MeasurementBase):
    pass

class MeasurementResponse(MeasurementBase):
    id: UUID4
    user_id: UUID4
    measurement_date: datetime
    is_current: bool

    class Config:
        from_attributes = True
