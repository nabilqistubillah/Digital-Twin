import pytest
from app.services.penman_monteith import calculate_fao56_penman_monteith
from app.services.lstm_service import generate_lstm_climate_forecast
from app.services.pysd_service import run_system_dynamics_simulation
from app.schemas.simulation_schema import SimulationRequest

def test_penman_monteith_calculation():
    # Suhu 32°C, RH 65%, Angin 3.5 m/s, Radiasi 21 MJ/m2
    et0 = calculate_fao56_penman_monteith(temp_c=32.0, humidity_percent=65.0, wind_speed_ms=3.5, solar_radiation_mj=21.0)
    assert et0 > 2.0
    assert et0 < 10.0

def test_lstm_forecast_generator():
    forecast = generate_lstm_climate_forecast(days=14)
    assert forecast.horizon_days == 14
    assert len(forecast.forecast_items) == 14
    assert forecast.dry_spell_window_days >= 0

def test_system_dynamics_simulation():
    req = SimulationRequest(geomembrane_ratio=0.5, rainfall_stress_multiplier=1.0, simulation_days=14)
    res = run_system_dynamics_simulation(req)
    assert res.kpi.total_adaptive_yield_tons >= res.kpi.total_baseline_yield_tons
    assert res.kpi.total_saved_salt_tons >= 0.0
    assert len(res.timeseries) == 14

