import React from 'react';
import { Waves, Activity, CloudSun, Database } from 'lucide-react';

interface HeaderBarProps {
  twinStatus: string;
  anomalyDetected: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ twinStatus, anomalyDetected }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-sky-600/20 text-sky-400 rounded-lg border border-sky-500/30">
          <Waves className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-100 tracking-wide">
              SALT-TWIN <span className="text-sky-400">PAMEKASAN</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              v1.0-alpha
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Digital Twin Sentra Tambak Garam Rakyat • Deep Learning LSTM × System Dynamics PySD
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-xs">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Data Feed:</span>
          <span className="font-semibold text-emerald-400">BMKG / NASA POWER</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="text-slate-300">Twin Engine:</span>
          <span className="font-semibold text-sky-400">{twinStatus}</span>
        </div>

        {anomalyDetected && (
          <div className="flex items-center space-x-1.5 bg-red-950/80 text-red-300 border border-red-700/60 px-3 py-1.5 rounded-md animate-pulse">
            <CloudSun className="w-4 h-4 text-red-400" />
            <span className="font-medium">Peringatan: Anomali Hujan Terdeteksi</span>
          </div>
        )}
      </div>
    </header>
  );
};
