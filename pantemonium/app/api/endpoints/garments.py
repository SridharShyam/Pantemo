from typing import Any, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Request
from pydantic import BaseModel
from app.ml.garment_scanner import GarmentScanner

router = APIRouter()
scanner = GarmentScanner()

class ScanResult(BaseModel):
    category: str
    brand: Optional[str] = "Unknown"
    detected_size: Optional[str] = "Unknown"
    inferred_size: Optional[str] = "Unknown"
    confidence: float
    measurements: dict
    detected_points: list
    comparative_recommendations: Optional[list] = []
    note: Optional[str] = None

@router.post("/scan", response_model=ScanResult)
async def scan_garment(
    request: Request,
    image_b64: Optional[str] = None,
    category: str = Query("tops", description="The type of garment: tops, bottoms, outerwear")
) -> Any:
    """
    Scan a garment and return its measurements using the AI scanning engine.
    """
    try:
        # In a real app, we'd handle the image input (file or base64)
        # For the demo, we simulate processing the image.
        result = scanner.scan_garment(image_data=image_b64 or "dummy_data", category=category)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_garment_categories() -> Any:
    """
    Retrieve supported garment categories for scanning.
    """
    return ["tops", "bottoms", "outerwear", "dresses", "suits"]
