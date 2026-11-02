import React from 'react';
import { CloudRain, Sun, CloudSun, Droplets } from 'lucide-react';
import { DailyForecast } from '../types';

interface ForecastProps {
  forecasts: DailyForecast[];
}

export const WeatherForecastStrip: React.FC<ForecastProps> = ({ forecasts }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
          <CloudSun className="w-4 h-4 text-sky-400" />
          <span>Prediksi Iklim Mikro 14 Hari (Deep Learning LSTM)</span>
        </h2>
        <span className="text-[11px] text-slate-400">Pesisir Pamekasan (7.16° S, 113.48° E)</span>
      </div>

      <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-1">
        {forecasts.map((f) => {
          const isDanger = f.risk_status === 'DANGER';
          const isAlert = f.risk_status === 'ALERT';

          return (
            <div
              key={f.day}
              className={`flex-shrink-0 w-28 rounded-lg p-2.5 border text-center transition ${
                isDanger
                  ? 'bg-red-950/40 border-red-700/60 text-red-200'
                  : isAlert
                  ? 'bg-amber-950/30 border-amber-700/50 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="text-[10px] font-medium text-slate-400">H+{f.day}</div>
              <div className="text-xs font-semibold mt-0.5">{f.date.slice(5)}</div>

              <div className="my-2 flex justify-center">
                {isDanger ? (
                  <CloudRain className="w-6 h-6 text-red-400 animate-bounce" />
                ) : isAlert ? (
                  <CloudSun className="w-6 h-6 text-amber-400" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-300" />
                )}
              </div>

              <div className="text-xs font-bold">{f.temperature_c}°C</div>
              
              <div className="mt-1 flex items-center justify-center space-x-1 text-[10px] text-sky-300">
                <Droplets className="w-3 h-3" />
                <span>{f.rainfall_mm} mm</span>
              </div>

              <div className="mt-0.5 text-[9px] text-slate-400">
                ET₀: {f.et0_evaporation_mm} mm
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
