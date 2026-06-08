from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.config import settings

app = FastAPI(
    title="Pantemonium API",
    description="Size recommendation engine backend",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    origins = [str(origin) for origin in settings.CORS_ORIGINS]
    # Ensure no duplicates and handle potential string vs list issues
    if isinstance(settings.CORS_ORIGINS, str):
        import json
        try:
            origins = json.loads(settings.CORS_ORIGINS)
        except:
            origins = [settings.CORS_ORIGINS]
            
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Welcome to Pantemonium API"}
