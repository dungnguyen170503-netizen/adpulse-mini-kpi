import React from 'react';
import { PeriodFilter, PeriodPreset } from '../report/reportModel';

interface Props {
  filter: PeriodFilter;
  onChange: (f: PeriodFilter) => void;
  rangeLabel: string;
  daysWithData: number;
  daysInRange: number;
}

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'all', label: 'Toàn bộ dữ liệu' },
  { id: 'last7', label: '7 ngày gần nhất' },
  { id: 'custom', label: 'Tùy chọn' }
];

export const PeriodFilterBar: React.FC<Props> = ({ filter, onChange, rangeLabel, daysWithData, daysInRange }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800" role="group" aria-label="Bộ lọc kỳ">
    <div className="flex flex-wrap gap-2">
      {PRESETS.map(p => (
        <button
          key={p.id}
          type="button"
          aria-pressed={filter.preset === p.id}
          onClick={() => onChange({ ...filter, preset: p.id })}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            filter.preset === p.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          {p.label}
        </button>
      ))}
      {filter.preset === 'custom' && (
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <label className="flex items-center gap-1">Từ
            <input type="date" value={filter.from || ''} onChange={e => onChange({ ...filter, from: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100" />
          </label>
          <label className="flex items-center gap-1">đến
            <input type="date" value={filter.to || ''} onChange={e => onChange({ ...filter, to: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100" />
          </label>
        </div>
      )}
    </div>
    <div className="text-xs text-slate-300">
      <span className="font-semibold text-white">Kỳ: {rangeLabel}</span>
      <span className="text-slate-400"> · {daysWithData}/{daysInRange} ngày có dữ liệu</span>
    </div>
  </div>
);
