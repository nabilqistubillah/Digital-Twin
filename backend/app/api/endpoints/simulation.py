from fastapi import APIRouter
from app.schemas.simulation_schema import SimulationRequest, SimulationResponse
from app.services.pysd_service import run_system_dynamics_simulation

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
def simulate_digital_twin_scenario(payload: SimulationRequest):
    """
    Mengeksekusi simulasi diferensial System Dynamics (PySD Engine)
    berdasarkan input skenario intervensi pengguna (What-If Analysis).
    Membandingkan kurva baseline vs kurva mitigasi geomembran secara seketika.
    """
    return run_system_dynamics_simulation(payload)

