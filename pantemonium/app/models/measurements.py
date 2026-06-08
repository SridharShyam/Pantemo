from sqlalchemy import Column, Integer, String, DateTime, func, Boolean, ForeignKey, DECIMAL, Enum as EnumType
from sqlalchemy import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
from enum import Enum

class FitPreference(str, Enum):
    slim = "slim"
    regular = "regular"
    relaxed = "relaxed"
    oversized = "oversized"

class UserMeasurement(Base):
    __tablename__ = "user_measurements"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    
    chest_cm = Column(DECIMAL(5, 2), nullable=False)
    waist_cm = Column(DECIMAL(5, 2), nullable=False)
    hip_cm = Column(DECIMAL(5, 2), nullable=False)
    shoulder_width_cm = Column(DECIMAL(5, 2), nullable=True)
    height_cm = Column(DECIMAL(5, 2), nullable=True)
    weight_kg = Column(DECIMAL(5, 2), nullable=True)
    
    preferred_fit = Column(EnumType(FitPreference), default=FitPreference.regular, nullable=False)
    measurement_date = Column(DateTime(timezone=True), server_default=func.now())
    is_current = Column(Boolean, default=True)

    user = relationship("User", backref="measurements")
