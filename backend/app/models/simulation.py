from sqlalchemy import Column, Integer, BigInteger, String, Numeric, DateTime, Date, ForeignKey
from datetime import datetime
from app.core.database import Base

class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    simulation_id = Column(String(36), primary_key=True)
    scenario_title = Column(String(150), nullable=False)
    target_zone_id = Column(Integer, ForeignKey("salt_production_zones.zone_id"), nullable=True)
    geomembrane_intervention_ratio = Column(Numeric(3, 2), nullable=False)
    rainfall_stress_multiplier = Column(Numeric(3, 2), default=1.00)
    simulated_horizon_days = Column(Integer, default=14)
    created_at = Column(DateTime, default=datetime.utcnow)

class SimulationTimeseriesResult(Base):
    __tablename__ = "simulation_timeseries_results"

    result_id = Column(BigInteger, primary_key=True, autoincrement=True)
    simulation_id = Column(String(36), ForeignKey("simulation_runs.simulation_id"), nullable=False, index=True)
    day_step = Column(Integer, nullable=False)
    projection_date = Column(Date, nullable=False)
    stock_brine_m3 = Column(Numeric(12, 2), nullable=False)
    daily_evaporation_m3 = Column(Numeric(10, 2), nullable=False)
    damaged_salt_tons = Column(Numeric(10, 2), nullable=False)
    crystallized_harvest_tons = Column(Numeric(10, 2), nullable=False)
    accumulated_inventory_tons = Column(Numeric(12, 2), nullable=False)

