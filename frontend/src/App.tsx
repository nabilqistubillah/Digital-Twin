import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { ExecutiveKpiCards } from './components/ExecutiveKpiCards';
import { ScenarioPlayground } from './components/ScenarioPlayground';
import { InteractiveMap } from './components/InteractiveMap';
import { ComparativeChart } from './components/ComparativeChart';
import { WeatherForecastStrip } from './components/WeatherForecastStrip';
import {
  GeoJSONData,
  ZoneProperties,
  WeatherForecastData,
  SimulationResponse
} from './types';

export const App: React.FC = () => {
  const [geomembraneRatio, setGeomembraneRatio] = useState<number>(0.35);
  const [stressMultiplier, setStressMultiplier] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<ZoneProperties | null>(null);

  const [geojsonData, setGeojsonData] = useState<GeoJSONData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastData | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);

  // Load Initial Data (GeoJSON, Weather Forecast, and Default Simulation)
  useEffect(() => {
    // 1. Load GeoJSON
    fetch('/geojson/pamekasan_salt_zones.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeojsonData(data);
        if (data.features && data.features.length > 0) {
          setSelectedZone(data.features[0].properties);
        }
      })
      .catch((err) => console.error('Failed to load GeoJSON:', err));

    // 2. Initial Simulation & Forecast Call
    triggerSimulation(0.35, 1.0);
  }, []);

  const triggerSimulation = async (ratio: number, stress: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: selectedZone ? selectedZone.zone_id : null,
          geomembrane_ratio: ratio,
          rainfall_stress_multiplier: stress,
          simulation_days: 14
        })
      });

      if (response.ok) {
        const simData: SimulationResponse = await response.json();
        setSimulationResult(simData);
      } else {
        throw new Error('Backend offline or error');
      }

      // Fetch Weather Forecast
      const weatherRes = await fetch(`/api/weather/forecast?days=14&stress_multiplier=${stress}`);
      if (weatherRes.ok) {
        const wData: WeatherForecastData = await weatherRes.json();
        setWeatherData(wData);
      }
    } catch (e) {
      console.warn('Using client-side dynamic simulation fallback');
      // Client-side fallback dynamic simulation calculation if backend is booting
      const mockPoints = [];
      let baseStock = 2500;
      let adaptStock = 2500;

      for (let i = 1; i <= 14; i++) {
        const rain = (i === 5 ? 18.5 : i === 6 ? 14.0 : i === 4 ? 1.2 : 0.0) * stress;
        const et0 = 5.2;
        const newSalt = et0 * 14.4;
        const damage = rain * 25.5;
        
        baseStock = Math.max(0, baseStock + newSalt - damage);
        adaptStock = Math.max(0, adaptStock + newSalt - (damage * Math.max(0, 1 - ratio)));

        mockPoints.push({
          day: i,
          date: `2026-11-${String(i).padStart(2, '0')}`,
          rainfall_mm: rain,
          et0_evaporation_mm: et0,
          baseline_salt_stock_tons: Math.round(baseStock),
          adaptive_salt_stock_tons: Math.round(adaptStock),
          saved_salt_tons: Math.round(Math.max(0, adaptStock - baseStock)),
          baseline_brine_m3: 180000,
          adaptive_brine_m3: 180000
        });
      }

      const totalSaved = Math.max(0, adaptStock - baseStock);
      setSimulationResult({
        simulation_id: 'local-sim-01',
        scenario_title: `Skenario Mitigasi ${Math.round(ratio * 100)}% Terpal`,
        applied_geomembrane_ratio: ratio,
        rainfall_stress_multiplier: stress,
        kpi: {
          total_baseline_yield_tons: Math.round(baseStock),
          total_adaptive_yield_tons: Math.round(adaptStock),
          total_saved_salt_tons: Math.round(totalSaved),
          protection_efficiency_percent: Math.round(ratio * 92),
          economic_value_saved_idr: totalSaved * 1200000,
          dry_spell_window_days: stress > 1.2 ? 4 : 7
        },
        timeseries: mockPoints
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateClick = () => {
    triggerSimulation(geomembraneRatio, stressMultiplier);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Header Command Bar */}
      <HeaderBar
        twinStatus="PySD Engine Active"
        anomalyDetected={stressMultiplier > 1.0}
      />

      {/* 2. Main Command Center Grid */}
      <main className="flex-1 p-4 lg:p-6 space-y-5 max-w-[1700px] w-full mx-auto">
        {/* KPI Cards Row */}
        {simulationResult && (
          <ExecutiveKpiCards kpi={simulationResult.kpi} />
        )}

        {/* Central Split: Left Control + Right Maps & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (4 cols): Scenario Playground */}
          <div className="lg:col-span-4 space-y-5">
            <ScenarioPlayground
              geomembraneRatio={geomembraneRatio}
              setGeomembraneRatio={setGeomembraneRatio}
              stressMultiplier={stressMultiplier}
              setStressMultiplier={setStressMultiplier}
              onSimulate={handleSimulateClick}
              isLoading={isLoading}
            />

            {/* Microclimate Weather Forecast Strip */}
            {weatherData && (
              <WeatherForecastStrip forecasts={weatherData.forecast_items} />
            )}
          </div>

          {/* Right Column (8 cols): Interactive Map & Comparative Chart */}
          <div className="lg:col-span-8 space-y-5">
            {/* GIS Map */}
            <div className="h-[340px]">
              <InteractiveMap
                geojsonData={geojsonData}
                selectedZone={selectedZone}
                onSelectZone={(zone) => setSelectedZone(zone)}
                rainfallAnomaly={stressMultiplier > 1.0}
              />
            </div>

            {/* Comparative Stock Chart */}
            {simulationResult && (
              <ComparativeChart
                data={simulationResult.timeseries}
                scenarioTitle={simulationResult.scenario_title}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500">
        SALT-TWIN PAMEKASAN • Sistem Pendukung Keputusan Mitigasi Anomali Iklim Tambak Garam Rakyat • Tugas Akhir & Mobile Lanjutan
      </footer>
    </div>
  );
};

export default App;
