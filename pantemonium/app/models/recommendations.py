from sqlalchemy import Column, Integer, String, Enum, DateTime, func, Boolean, DECIMAL, ForeignKey, JSON
from sqlalchemy import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    brand_id = Column(Uuid, ForeignKey("brands.id"), nullable=False)
    category_id = Column(Uuid, ForeignKey("clothing_categories.id"), nullable=False)
    size_chart_id = Column(Uuid, ForeignKey("size_charts.id"), nullable=False)
    
    recommended_size = Column(String, nullable=False)
    confidence_score = Column(DECIMAL(5, 2), nullable=False)
    fit_style_used = Column(String, nullable=True)
    measurement_snapshot = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="recommendations")
    brand = relationship("Brand")
    category = relationship("ClothingCategory")
    size_chart = relationship("SizeChart")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    recommendation_id = Column(Uuid, ForeignKey("recommendations.id"), nullable=False)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    
    purchased = Column(Boolean, default=False)
    # fit_result (enum: too_small, perfect, too_large, null)
    fit_result = Column(String, nullable=True) 
    rating = Column(Integer, nullable=True)
    comments = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    recommendation = relationship("Recommendation", backref="feedback")
    user = relationship("User", backref="feedback_history")
