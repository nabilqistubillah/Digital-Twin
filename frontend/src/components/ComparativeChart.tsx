import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationCurvePoint } from '../types';

interface ChartProps {
  data: SimulationCurvePoint[];
  scenarioTitle: string;
}

export const ComparativeChart: React.FC<ChartProps> = ({ data, scenarioTitle }) => {
  const chartData = data.map((d) => ({
    name: `H+${d.day}`,
    date: d.date,
    rainfall: d.rainfall_mm,
    baseline: Math.round(d.baseline_salt_stock_tons),
    adaptive: Math.round(d.adaptive_salt_stock_tons),
    saved: Math.round(d.saved_salt_tons)
  }));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Proyeksi Stok Garam: Baseline vs Skenario Mitigasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Komparasi akumulasi stok kristal garam di meja kristalisasi selama 14 hari ke depan
          </p>
        </div>
        <div className="text-xs bg-slate-800 px-2.5 py-1 rounded text-sky-400 font-medium border border-slate-700">
          {scenarioTitle}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" T" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            
            {/* Garis Merah Putus-putus: Baseline Do-Nothing */}
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline (Tanpa Intervensi)"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2 }}
            />

            {/* Garis Hijau Solid: Skenario Adaptif dengan Terpal */}
            <Line
              type="monotone"
              dataKey="adaptive"
              name="Skenario Mitigasi (Terpal Aktif)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />

            {/* Garis Hujan Bar/Line */}
            <Line
              type="step"
              dataKey="rainfall"
              name="Curah Hujan (mm)"
              stroke="#0284c7"
              strokeWidth={1.5}
              dot={false}
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 px-1">
        <span>Catatan: Curah hujan &gt; 10 mm memicu penurunan tajam stok kristal pada garis merah (baseline).</span>
        <span className="text-emerald-400 font-medium">Garis hijau memperlihatkan retensi volume stok yang berhasil diselamatkan.</span>
      </div>
    </div>
  );
};
