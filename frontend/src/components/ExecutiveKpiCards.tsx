import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, SunMedium } from 'lucide-react';
import { SimulationKpi } from '../types';

interface KpiProps {
  kpi: SimulationKpi;
}

export const ExecutiveKpiCards: React.FC<KpiProps> = ({ kpi }) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Estimasi Produksi Adaptif */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Proyeksi Panen</span>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold text-slate-100">
            {kpi.total_adaptive_yield_tons.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">Ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Baseline: <span className="text-slate-300 font-mono">{kpi.total_baseline_yield_tons.toLocaleString('id-ID')} Ton</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Garam Terselamatkan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Potensi Garam Terselamatkan</span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold text-emerald-400">
            +{kpi.total_saved_salt_tons.toLocaleString('id-ID')} <span className="text-sm font-normal text-emerald-400/80">Ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Efisiensi Proteksi: <span className="text-emerald-400 font-semibold">{kpi.protection_efficiency_percent}%</span>
          </div>
        </div>
      </div>

      {/* KPI 3: Nilai Ekonomi Terlindungi */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Nilai Ekonomi Terlindungi</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold text-amber-300">
            {formatIDR(kpi.economic_value_saved_idr)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Estimasi Harga: <span className="text-slate-300">Rp 1.200/kg Garam K1</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Dry Spell Window */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Jendela Hari Terik (Dry Spell)</span>
          <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
            <SunMedium className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold text-orange-400">
            {kpi.dry_spell_window_days} <span className="text-sm font-normal text-orange-400/80">Hari</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fase Kristalisasi: <span className="text-slate-300">{kpi.dry_spell_window_days >= 7 ? 'Sangat Optimal' : 'Waspada Hujan'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

