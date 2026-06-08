from sqlalchemy import Column, String, DateTime, func, Boolean, Enum
from sqlalchemy import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    country_origin = Column(String, nullable=True)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    size_charts = relationship("SizeChart", back_populates="brand")
