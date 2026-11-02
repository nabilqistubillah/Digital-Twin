import json
import os
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.lstm_service import generate_lstm_climate_forecast

router = APIRouter()

GEOJSON_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "pamekasan_salt_zones.geojson")
)

@router.get("/spatial", response_model=Dict[str, Any])
def get_spatial_salt_farms():
    """
    Mengambil data poligon GeoJSON sentra tambak garam Pamekasan
    dengan pengayaan atribut status risiko klimatologis dinamis hari ini.
    """
    if not os.path.exists(GEOJSON_PATH):
        raise HTTPException(status_code=404, detail="GeoJSON data sentra tambak tidak ditemukan")

    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        geojson_data = json.load(f)

    # Ambil ramalan cuaca hari ini dari LSTM
    forecast = generate_lstm_climate_forecast(days=3)
    today_weather = forecast.forecast_items[0] if forecast.forecast_items else None

    # Inject status risiko ke setiap fitur poligon
    for feature in geojson_data.get("features", []):
        props = feature.get("properties", {})
        if today_weather:
            props["current_rainfall_mm"] = today_weather.rainfall_mm
            props["current_temperature_c"] = today_weather.temperature_c
            props["current_et0_mm"] = today_weather.et0_evaporation_mm
            props["risk_status"] = today_weather.risk_status
        else:
            props["risk_status"] = "SAFE"

    return geojson_data

