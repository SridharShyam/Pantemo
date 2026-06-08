from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class BrandBase(BaseModel):
    name: str
    country_origin: Optional[str] = None
    description: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: UUID4
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    category_type: str
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: UUID4

    class Config:
        from_attributes = True
