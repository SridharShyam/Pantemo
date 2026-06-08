from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy import Uuid
import uuid
from app.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    client_name = Column(String, nullable=False)
    api_key_hash = Column(String, nullable=False, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    rate_limit_per_hour = Column(Integer, default=1000)
    created_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True), nullable=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
