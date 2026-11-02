-- ==============================================================================
-- DDL & SEED DATA SISTEM DIGITAL TWIN TAMBAK GARAM PAMEKASAN
-- ==============================================================================

-- 1. TABEL DATA MASTER TAMBAK GARAM REGIONAL
CREATE TABLE IF NOT EXISTS salt_production_zones (
    zone_id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    sub_district VARCHAR(100) NOT NULL,
    regency VARCHAR(100) DEFAULT 'Pamekasan',
    total_area_ha NUMERIC(8, 2) NOT NULL,
    crystallization_area_ha NUMERIC(8, 2) NOT NULL,
    brine_storage_capacity_m3 NUMERIC(10, 2) NOT NULL,
    default_geomembrane_ratio NUMERIC(3, 2) DEFAULT 0.00,
    active_farmers_count INT DEFAULT 0,
    geojson_geometry JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL RUN TUN WAKTU KLIMATOLOGI (HISTORIS & OUTPUT LSTM)
CREATE TABLE IF NOT EXISTS climate_timeseries (
    record_id BIGSERIAL PRIMARY KEY,
    record_date DATE NOT NULL,
    rainfall_mm NUMERIC(6, 2) NOT NULL,
    temperature_c NUMERIC(4, 2) NOT NULL,
    humidity_percent NUMERIC(5, 2) NOT NULL,
    wind_speed_ms NUMERIC(5, 2) DEFAULT 3.20,
    solar_radiation_mj NUMERIC(6, 2) DEFAULT 18.50,
    data_source VARCHAR(20) CHECK (data_source IN ('BMKG_HISTORICAL', 'NASA_POWER', 'LSTM_PREDICTED')),
    is_anomaly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_date_source UNIQUE (record_date, data_source)
);

CREATE INDEX IF NOT EXISTS idx_climate_date ON climate_timeseries(record_date);

-- 3. TABEL SESI SKENARIO SIMULASI PENGGUNA
CREATE TABLE IF NOT EXISTS simulation_runs (
    simulation_id VARCHAR(36) PRIMARY KEY,
    scenario_title VARCHAR(150) NOT NULL,
    target_zone_id INT REFERENCES salt_production_zones(zone_id) ON DELETE SET NULL,
    geomembrane_intervention_ratio NUMERIC(3, 2) NOT NULL,
    rainfall_stress_multiplier NUMERIC(3, 2) DEFAULT 1.00,
    simulated_horizon_days INT DEFAULT 14,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL OUTPUT SIMULASI SYSTEM DYNAMICS (PYSD OUTPUT)
CREATE TABLE IF NOT EXISTS simulation_timeseries_results (
    result_id BIGSERIAL PRIMARY KEY,
    simulation_id VARCHAR(36) NOT NULL REFERENCES simulation_runs(simulation_id) ON DELETE CASCADE,
    day_step INT NOT NULL,
    projection_date DATE NOT NULL,
    stock_brine_m3 NUMERIC(12, 2) NOT NULL,
    daily_evaporation_m3 NUMERIC(10, 2) NOT NULL,
    damaged_salt_tons NUMERIC(10, 2) NOT NULL,
    crystallized_harvest_tons NUMERIC(10, 2) NOT NULL,
    accumulated_inventory_tons NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_simulation_results ON simulation_timeseries_results(simulation_id, day_step);

-- ==============================================================================
-- SEED DATA AWAL: SENTRA TAMBAK GARAM PAMEKASAN
-- ==============================================================================
INSERT INTO salt_production_zones (zone_id, zone_name, sub_district, regency, total_area_ha, crystallization_area_ha, brine_storage_capacity_m3, default_geomembrane_ratio, active_farmers_count, geojson_geometry)
VALUES 
(1, 'Sentra Tambak Garam Galis (Lembung - Konang)', 'Galis', 'Pamekasan', 485.50, 340.00, 185000.00, 0.25, 420, 
 '{"type": "Polygon", "coordinates": [[[113.5600, -7.1850], [113.6150, -7.1850], [113.6250, -7.2150], [113.5700, -7.2180], [113.5550, -7.1980], [113.5600, -7.1850]]]}'::jsonb),
(2, 'Sentra Tambak Garam Pademawu (Bunder - Majungan)', 'Pademawu', 'Pamekasan', 620.00, 450.00, 240000.00, 0.35, 560,
 '{"type": "Polygon", "coordinates": [[[113.4850, -7.1880], [113.5500, -7.1860], [113.5550, -7.2180], [113.4900, -7.2250], [113.4780, -7.2050], [113.4850, -7.1880]]]}'::jsonb),
(3, 'Sentra Tambak Garam Tlanakan (Kramat - Branta)', 'Tlanakan', 'Pamekasan', 310.20, 215.00, 115000.00, 0.15, 280,
 '{"type": "Polygon", "coordinates": [[[113.4200, -7.1950], [113.4750, -7.1920], [113.4780, -7.2200], [113.4300, -7.2300], [113.4150, -7.2100], [113.4200, -7.1950]]]}'::jsonb)
ON CONFLICT (zone_id) DO NOTHING;

