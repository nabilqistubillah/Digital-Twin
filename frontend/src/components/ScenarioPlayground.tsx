import React from 'react';
import { Sliders, Play, RefreshCw, AlertTriangle, Layers } from 'lucide-react';

interface ScenarioPlaygroundProps {
  geomembraneRatio: number;
  setGeomembraneRatio: (val: number) => void;
  stressMultiplier: number;
  setStressMultiplier: (val: number) => void;
  onSimulate: () => void;
  isLoading: boolean;
}

export const ScenarioPlayground: React.FC<ScenarioPlaygroundProps> = ({
  geomembraneRatio,
  setGeomembraneRatio,
  stressMultiplier,
  setStressMultiplier,
  onSimulate,
  isLoading
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <Sliders className="w-5 h-5 text-sky-400" />
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          Scenario Playground (What-If)
        </h2>
      </div>

      {/* Control 1: Rasio Geomembran */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-slate-300 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Adopsi Terpal / Geomembran:</span>
          </label>
          <span className="font-mono font-bold text-sky-400 text-sm">
            {Math.round(geomembraneRatio * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={geomembraneRatio}
          onChange={(e) => setGeomembraneRatio(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0% (Terbuka Total)</span>
          <span>50%</span>
          <span>100% (Tunnel Penuh)</span>
        </div>
      </div>

      {/* Control 2: Stres Presipitasi Hujan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-slate-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengali Stres Hujan Anomali:</span>
          </label>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {stressMultiplier.toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.25"
          value={stressMultiplier}
          onChange={(e) => setStressMultiplier(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.5x (Kering)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Ekstrem)</span>
        </div>
      </div>

      {/* Preset Cepat */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-medium text-slate-400">Preset Skenario Mitigasi:</label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => { setGeomembraneRatio(0.0); setStressMultiplier(1.0); }}
            className="px-2 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60 transition text-[11px]"
          >
            Do Nothing (0%)
          </button>
          <button
            type="button"
            onClick={() => { setGeomembraneRatio(0.40); setStressMultiplier(1.25); }}
            className="px-2 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60 transition text-[11px]"
          >
            Moderat (40%)
          </button>
          <button
            type="button"
            onClick={() => { setGeomembraneRatio(0.85); setStressMultiplier(1.5); }}
            className="px-2 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60 transition text-[11px]"
          >
            Maksimal (85%)
          </button>
        </div>
      </div>

      {/* Tombol Eksekusi Simulasi */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSimulate}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-950/40 transition active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-sky-300" />
              <span>Menghitung Ulang PySD...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Simulasikan Ulang Digital Twin</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

