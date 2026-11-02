from pydantic import BaseModel, Field
from typing import List, Optional

class SimulationRequest(BaseModel):
    zone_id: Optional[int] = Field(default=None, description="ID sentra tambak (None untuk seluruh Pamekasan)")
    geomembrane_ratio: float = Field(default=0.35, ge=0.0, le=1.0, description="Rasio adopsi geomembran penutup anti-hujan (0.0 - 1.0)")
    rainfall_stress_multiplier: float = Field(default=1.00, ge=0.5, le=3.0, description="Pengali stres hujan anomali")
    simulation_days: int = Field(default=14, ge=7, le=30, description="Horizon hari simulasi")

class SimulationCurvePoint(BaseModel):
    day: int
    date: str
    rainfall_mm: float
    et0_evaporation_mm: float
    baseline_salt_stock_tons: float
    adaptive_salt_stock_tons: float
    saved_salt_tons: float
    baseline_brine_m3: float
    adaptive_brine_m3: float

class SimulationKpi(BaseModel):
    total_baseline_yield_tons: float
    total_adaptive_yield_tons: float
    total_saved_salt_tons: float
    protection_efficiency_percent: float
    economic_value_saved_idr: float
    dry_spell_window_days: int

class SimulationResponse(BaseModel):
    simulation_id: str
    scenario_title: str
    applied_geomembrane_ratio: float
    rainfall_stress_multiplier: float
    kpi: SimulationKpi
    timeseries: List[SimulationCurvePoint]

