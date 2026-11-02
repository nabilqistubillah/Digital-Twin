from fastapi import APIRouter
from typing import Dict, Any
from app.services.lstm_service import generate_lstm_climate_forecast
from app.services.pysd_service import run_system_dynamics_simulation
from app.schemas.simulation_schema import SimulationRequest

router = APIRouter()

@router.get("/overview", response_model=Dict[str, Any])
def get_digital_twin_overview():
    """
    Mengambil data ringkasan KPI eksekutif untuk status awal Command Center.
    """
    forecast = generate_lstm_climate_forecast(days=14)
    sim_default = run_system_dynamics_simulation(SimulationRequest(geomembrane_ratio=0.35))

    return {
        "status": "TWIN_ACTIVE",
        "sync_source": "BMKG & NASA POWER (Synchronized)",
        "monitored_regency": "Kabupaten Pamekasan",
        "total_zones": 3,
        "total_salt_area_ha": 1415.70,
        "active_farmers_count": 1260,
        "dry_spell_window_days": forecast.dry_spell_window_days,
        "rainfall_anomaly_warning": forecast.anomaly_detected,
        "baseline_yield_projection_tons": sim_default.kpi.total_baseline_yield_tons,
        "current_mitigated_yield_tons": sim_default.kpi.total_adaptive_yield_tons,
        "potential_saved_tons": sim_default.kpi.total_saved_salt_tons
    }

