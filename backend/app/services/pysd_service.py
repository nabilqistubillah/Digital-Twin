import uuid
from typing import Dict, Any, List
from app.services.lstm_service import generate_lstm_climate_forecast
from app.schemas.simulation_schema import (
    SimulationRequest,
    SimulationResponse,
    SimulationCurvePoint,
    SimulationKpi
)

def run_system_dynamics_simulation(request: SimulationRequest) -> SimulationResponse:
    """
    Eksekutor simulasi System Dynamics (Virtual Twin Tambak Garam).
    Menghitung neraca massa diferensial:
      - Stock Brine (m3)
      - Laju Evaporasi (m3/hari) berdasarkan luaran ET0 Penman-Monteith
      - Kerusakan Garam Kristal (Ton) akibat presipitasi hujan
      - Komparasi kurva Baseline (Do Nothing) vs Adaptive Scenario (Geomembrane Protection)
    """
    horizon = request.simulation_days
    sim_id = str(uuid.uuid4())
    
    # 1. Tarik deret waktu peramalan iklim mikro dari LSTM Engine
    climate_forecast = generate_lstm_climate_forecast(
        days=horizon,
        stress_multiplier=request.rainfall_stress_multiplier
    )
    
    # Luas meja kristalisasi efektif (asumsi rata-rata sentra tambak Pamekasan ~300 ha meja)
    crystallization_area_m2 = 300.0 * 10000.0  # 3,000,000 m2
    initial_brine_m3 = 180000.0
    initial_salt_stock_tons = 2500.0  # Garam yang sedang dalam proses penjemuran
    
    # State variables untuk dua skenario paralel
    baseline_brine = initial_brine_m3
    baseline_salt = initial_salt_stock_tons
    
    adaptive_brine = initial_brine_m3
    adaptive_salt = initial_salt_stock_tons
    
    curve_points: List[SimulationCurvePoint] = []
    
    total_baseline_lost = 0.0
    total_adaptive_lost = 0.0
    
    geomembrane_eff = min(1.0, max(0.0, request.geomembrane_ratio))

    for item in climate_forecast.forecast_items:
        rain_mm = item.rainfall_mm
        et0_mm = item.et0_evaporation_mm
        
        # Laju Evaporasi Fisik (m3/hari) = ET0 (m) * Area (m2)
        evap_rate_m3 = (et0_mm / 1000.0) * crystallization_area_m2 * 0.40
        
        # Pembentukan garam baru per hari dari pemekatan brine (~0.12 ton per m3 brine terevaporasi)
        new_salt_crystallized = evap_rate_m3 * 0.012
        
        # --- 1. Skenario Baseline (Tanpa Intervensi / Rasio = 0.0) ---
        # Setiap 1 mm hujan yang jatuh di meja tak terlindung melarutkan sejumlah garam
        baseline_rain_damage = rain_mm * (crystallization_area_m2 / 10000.0) * 0.85
        baseline_salt_loss = min(baseline_salt + new_salt_crystallized, baseline_rain_damage)
        baseline_salt = max(0.0, baseline_salt + new_salt_crystallized - baseline_salt_loss)
        baseline_brine = max(20000.0, baseline_brine - evap_rate_m3 + (rain_mm * 15.0))
        total_baseline_lost += baseline_salt_loss
        
        # --- 2. Skenario Adaptif (Dengan Proteksi Terpal/Geomembran) ---
        # Air hujan yang jatuh ke atas terpal dibuang keluar saluran, mengurangi kerusakan
        unprotected_ratio = max(0.0, 1.0 - geomembrane_eff)
        adaptive_rain_damage = rain_mm * (crystallization_area_m2 / 10000.0) * 0.85 * unprotected_ratio
        adaptive_salt_loss = min(adaptive_salt + new_salt_crystallized, adaptive_rain_damage)
        adaptive_salt = max(0.0, adaptive_salt + new_salt_crystallized - adaptive_rain_damage)
        adaptive_brine = max(20000.0, adaptive_brine - evap_rate_m3 + (rain_mm * 15.0 * unprotected_ratio))
        total_adaptive_lost += adaptive_salt_loss
        
        saved_tons_today = max(0.0, adaptive_salt - baseline_salt)
        
        curve_points.append(
            SimulationCurvePoint(
                day=item.day,
                date=item.date,
                rainfall_mm=rain_mm,
                et0_evaporation_mm=et0_mm,
                baseline_salt_stock_tons=round(baseline_salt, 2),
                adaptive_salt_stock_tons=round(adaptive_salt, 2),
                saved_salt_tons=round(saved_tons_today, 2),
                baseline_brine_m3=round(baseline_brine, 2),
                adaptive_brine_m3=round(adaptive_brine, 2)
            )
        )
    
    final_baseline_yield = curve_points[-1].baseline_salt_stock_tons
    final_adaptive_yield = curve_points[-1].adaptive_salt_stock_tons
    total_saved = max(0.0, final_adaptive_yield - final_baseline_yield)
    
    # Asumsi harga garam rakyat K1 rata-rata Rp 1.200.000 / Ton
    economic_value = total_saved * 1200000.0
    
    efficiency = 0.0
    if total_baseline_lost > 0:
        efficiency = round(((total_baseline_lost - total_adaptive_lost) / total_baseline_lost) * 100.0, 1)

    kpi = SimulationKpi(
        total_baseline_yield_tons=round(final_baseline_yield, 2),
        total_adaptive_yield_tons=round(final_adaptive_yield, 2),
        total_saved_salt_tons=round(total_saved, 2),
        protection_efficiency_percent=efficiency,
        economic_value_saved_idr=round(economic_value, 0),
        dry_spell_window_days=climate_forecast.dry_spell_window_days
    )

    scenario_label = f"Skenario Mitigasi {int(geomembrane_eff * 100)}% Geomembran"
    if request.rainfall_stress_multiplier > 1.0:
        scenario_label += f" (Stres Hujan +{int((request.rainfall_stress_multiplier - 1.0)*100)}%)"

    return SimulationResponse(
        simulation_id=sim_id,
        scenario_title=scenario_label,
        applied_geomembrane_ratio=geomembrane_eff,
        rainfall_stress_multiplier=request.rainfall_stress_multiplier,
        kpi=kpi,
        timeseries=curve_points
    )

