from fastapi import APIRouter
from app.api.endpoints import auth, users, brands, recommendations, garments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(brands.router, prefix="/brands", tags=["brands"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(garments.router, prefix="/garments", tags=["garments"])
