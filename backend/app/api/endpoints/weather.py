from fastapi import APIRouter, Query
from app.services.lstm_service import generate_lstm_climate_forecast
from app.schemas.climate_schema import WeatherForecastResponse

router = APIRouter()

@router.get("/forecast", response_model=WeatherForecastResponse)
def get_weather_forecast(
    days: int = Query(default=14, ge=3, le=30, description="Horizon peramalan iklim (hari)"),
    stress_multiplier: float = Query(default=1.0, ge=0.5, le=3.0, description="Pengali stres hujan")
):
    """
    Mengambil data peramalan iklim mikro multivariabel (LSTM Engine)
    termasuk estimasi laju evaporasi FAO-56 Penman-Monteith dan deteksi anomali hujan.
    """
    return generate_lstm_climate_forecast(days=days, stress_multiplier=stress_multiplier)

