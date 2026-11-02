from sqlalchemy import Column, BigInteger, Date, Numeric, String, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class ClimateTimeseries(Base):
    __tablename__ = "climate_timeseries"

    record_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    record_date = Column(Date, nullable=False, index=True)
    rainfall_mm = Column(Numeric(6, 2), nullable=False)
    temperature_c = Column(Numeric(4, 2), nullable=False)
    humidity_percent = Column(Numeric(5, 2), nullable=False)
    wind_speed_ms = Column(Numeric(5, 2), default=3.20)
    solar_radiation_mj = Column(Numeric(6, 2), default=18.50)
    data_source = Column(String(20), nullable=False)
    is_anomaly = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

