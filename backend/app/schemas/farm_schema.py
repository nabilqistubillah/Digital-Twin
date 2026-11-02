from pydantic import BaseModel
from typing import Optional, Any, Dict, List

class FarmZoneBase(BaseModel):
    zone_id: int
    zone_name: str
    sub_district: str
    regency: str
    total_area_ha: float
    crystallization_area_ha: float
    brine_storage_capacity_m3: float
    default_geomembrane_ratio: float
    active_farmers_count: int

class FarmZoneResponse(FarmZoneBase):
    risk_level: str = "LOW"
    current_rainfall_mm: float = 0.0
    current_temperature_c: float = 30.5
    current_et0_mm: float = 5.2

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    properties: Dict[str, Any]
    geometry: Dict[str, Any]

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]

