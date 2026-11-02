from fastapi import APIRouter
from app.api.endpoints import farms, weather, simulation, overview

api_router = APIRouter()

api_router.include_router(farms.router, prefix="/farms", tags=["Farms & Spatial GIS"])
api_router.include_router(weather.router, prefix="/weather", tags=["Climate & LSTM Forecasting"])
api_router.include_router(simulation.router, tags=["Digital Twin Simulation (PySD)"])
api_router.include_router(overview.router, prefix="/twin", tags=["Executive Twin Overview"])

