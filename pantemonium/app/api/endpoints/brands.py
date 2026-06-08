from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.models.brands import Brand
from app.models.clothing import ClothingCategory, SizeChart
from app.schemas.brands import BrandResponse, CategoryResponse
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[BrandResponse])
async def read_brands(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve brands.
    """
    result = await db.execute(select(Brand).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/categories", response_model=List[CategoryResponse])
async def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve all categories.
    """
    result = await db.execute(select(ClothingCategory).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{brand_id}", response_model=BrandResponse)
async def read_brand(
    brand_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get brand by ID.
    """
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.get("/{brand_id}/categories", response_model=List[CategoryResponse])
async def read_brand_categories(
    brand_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get categories for a brand.
    """
    # This requires joining SizeChart -> Category or similar.
    # Because categories are linked to brands via SizeChart? Or direct?
    # Schema doesn't show direct link Brand <-> Category.
    # It shows Brand <-> SizeChart <-> Category.
    # So we find categories that have size charts for this brand.
    
    query = select(ClothingCategory).join(SizeChart).where(SizeChart.brand_id == brand_id).distinct()
    result = await db.execute(query)
    return result.scalars().all()
