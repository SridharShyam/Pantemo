from sqlalchemy import Boolean, Column, String, DateTime, func, Integer
from sqlalchemy import Uuid
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships will be defined here or later using back_populates
    # measurements = relationship("UserMeasurement", back_populates="user")
    # recommendations = relationship("Recommendation", back_populates="user")
    # feedback = relationship("Feedback", back_populates="user")
