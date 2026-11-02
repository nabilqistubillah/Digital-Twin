from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text
from datetime import datetime
from app.core.database import Base

class SaltProductionZone(Base):
    __tablename__ = "salt_production_zones"

    zone_id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String(100), nullable=False)
    sub_district = Column(String(100), nullable=False)
    regency = Column(String(100), default="Pamekasan")
    total_area_ha = Column(Numeric(8, 2), nullable=False)
    crystallization_area_ha = Column(Numeric(8, 2), nullable=False)
    brine_storage_capacity_m3 = Column(Numeric(10, 2), nullable=False)
    default_geomembrane_ratio = Column(Numeric(3, 2), default=0.00)
    active_farmers_count = Column(Integer, default=0)
    geojson_geometry = Column(Text, nullable=False)  # Stores JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

