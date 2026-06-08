from sqlalchemy import Column, Integer, String, Enum as SAEnum, DateTime, func, Boolean, DECIMAL, ForeignKey
from sqlalchemy import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
from enum import Enum

class CategoryType(str, Enum):
    tops = "tops"
    bottoms = "bottoms"
    outerwear = "outerwear"

class Region(str, Enum):
    US = "US"
    UK = "UK"
    EU = "EU"
    India = "India"
    Asia = "Asia"

class FitStyle(str, Enum):
    slim = "slim"
    regular = "regular"
    relaxed = "relaxed"
    oversized = "oversized"

class ClothingCategory(Base):
    __tablename__ = "clothing_categories"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    category_type = Column(SAEnum(CategoryType), nullable=False)
    description = Column(String, nullable=True)

    size_charts = relationship("SizeChart", back_populates="category")
    fit_adjustments = relationship("FitAdjustment", back_populates="category")

class SizeChart(Base):
    __tablename__ = "size_charts"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    brand_id = Column(Uuid, ForeignKey("brands.id"), nullable=False)
    category_id = Column(Uuid, ForeignKey("clothing_categories.id"), nullable=False)
    region = Column(SAEnum(Region), nullable=False)
    fit_style = Column(SAEnum(FitStyle), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    brand = relationship("Brand", back_populates="size_charts")
    category = relationship("ClothingCategory", back_populates="size_charts")
    measurements = relationship("SizeMeasurement", back_populates="size_chart")

class SizeMeasurement(Base):
    __tablename__ = "size_measurements"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    size_chart_id = Column(Uuid, ForeignKey("size_charts.id"), nullable=False)
    size_label = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

    # Core measurements
    chest_min_cm = Column(DECIMAL(5, 2))
    chest_max_cm = Column(DECIMAL(5, 2))
    waist_min_cm = Column(DECIMAL(5, 2), nullable=True)
    waist_max_cm = Column(DECIMAL(5, 2), nullable=True)
    hip_min_cm = Column(DECIMAL(5, 2), nullable=True)
    hip_max_cm = Column(DECIMAL(5, 2), nullable=True)
    shoulder_min_cm = Column(DECIMAL(5, 2), nullable=True)
    shoulder_max_cm = Column(DECIMAL(5, 2), nullable=True)
    length_cm = Column(DECIMAL(5, 2), nullable=True)

    size_chart = relationship("SizeChart", back_populates="measurements")

class FitAdjustment(Base):
    __tablename__ = "fit_adjustments"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    category_id = Column(Uuid, ForeignKey("clothing_categories.id"), nullable=False)
    fit_style = Column(SAEnum(FitStyle), nullable=False)
    
    chest_adjustment_cm = Column(DECIMAL(5, 2), default=0)
    waist_adjustment_cm = Column(DECIMAL(5, 2), default=0)
    hip_adjustment_cm = Column(DECIMAL(5, 2), default=0)
    
    description = Column(String, nullable=True)

    category = relationship("ClothingCategory", back_populates="fit_adjustments")
