from pydantic import BaseModel
from typing import List, Optional

class DailyForecastItem(BaseModel):
    day: int
    date: str
    rainfall_mm: float
    temperature_c: float
    humidity_percent: float
    wind_speed_ms: float
    solar_radiation_mj: float
    et0_evaporation_mm: float
    is_anomaly: bool
    risk_status: str  # SAFE (Green), ALERT (Yellow), DANGER (Red)

class WeatherForecastResponse(BaseModel):
    horizon_days: int
    dry_spell_window_days: int
    total_expected_rainfall_mm: float
    anomaly_detected: bool
    forecast_items: List[DailyForecastItem]

