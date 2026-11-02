from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.api_router import api_router

# Inisialisasi tabel basis data
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API Sistem Digital Twin Tambak Garam Pamekasan berbasis Integrasi Deep Learning (LSTM) dan System Dynamics (PySD).",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Konfigurasi Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health Check"])
def health_check():
    """
    Endpoint pemantauan kesehatan layanan backend.
    """
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "engine": "FastAPI + PySD + LSTM Core",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

