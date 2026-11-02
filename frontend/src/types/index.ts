export interface ZoneProperties {
  zone_id: number;
  zone_name: string;
  sub_district: string;
  regency: string;
  total_area_ha: number;
  crystallization_area_ha: number;
  brine_storage_capacity_m3: number;
  default_geomembrane_ratio: number;
  active_farmers_count: number;
  current_rainfall_mm?: number;
  current_temperature_c?: number;
  current_et0_mm?: number;
  risk_status?: 'SAFE' | 'ALERT' | 'DANGER';
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: ZoneProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface DailyForecast {
  day: number;
  date: string;
  rainfall_mm: number;
  temperature_c: number;
  humidity_percent: number;
  wind_speed_ms: number;
  solar_radiation_mj: number;
  et0_evaporation_mm: number;
  is_anomaly: boolean;
  risk_status: 'SAFE' | 'ALERT' | 'DANGER';
}

export interface WeatherForecastData {
  horizon_days: number;
  dry_spell_window_days: number;
  total_expected_rainfall_mm: number;
  anomaly_detected: boolean;
  forecast_items: DailyForecast[];
}

export interface SimulationCurvePoint {
  day: number;
  date: string;
  rainfall_mm: number;
  et0_evaporation_mm: number;
  baseline_salt_stock_tons: number;
  adaptive_salt_stock_tons: number;
  saved_salt_tons: number;
  baseline_brine_m3: number;
  adaptive_brine_m3: number;
}

export interface SimulationKpi {
  total_baseline_yield_tons: number;
  total_adaptive_yield_tons: number;
  total_saved_salt_tons: number;
  protection_efficiency_percent: number;
  economic_value_saved_idr: number;
  dry_spell_window_days: number;
}

export interface SimulationResponse {
  simulation_id: string;
  scenario_title: string;
  applied_geomembrane_ratio: number;
  rainfall_stress_multiplier: number;
  kpi: SimulationKpi;
  timeseries: SimulationCurvePoint[];
}
