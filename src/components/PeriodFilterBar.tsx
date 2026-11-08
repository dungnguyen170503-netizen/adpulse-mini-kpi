import React from 'react';
import { PeriodFilter, PeriodPreset, calendarDaysBetween } from '../report/reportModel';
import { Calendar, Database, CheckCircle2 } from 'lucide-react';

interface Props {
  filter: PeriodFilter;
  onChange: (f: PeriodFilter) => void;
  rangeLabel: string;
  daysWithData: number;
  daysInRange: number;
  sourceLabel?: string;
  isSummaryOnly?: boolean;
  summaryStart?: string;
  summaryEnd?: string;
  totalRecordRows?: number;
}

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'all', label: 'Toàn bộ dữ liệu' },
  { id: 'last7', label: '7 ngày gần nhất' },
  { id: 'custom', label: 'Tùy chọn' }
];

export const PeriodFilterBar: React.FC<Props> = ({
  filter,
  onChange,
  rangeLabel,
  daysWithData,
  daysInRange,
  sourceLabel = 'Đang xem',
  isSummaryOnly = false,
  summaryStart,
  summaryEnd,
  totalRecordRows
}) => {
  const summaryCalDays = isSummaryOnly ? calendarDaysBetween(summaryStart, summaryEnd) : 0;
  const rowDiffNote =
    !isSummaryOnly && totalRecordRows !== undefined && totalRecordRows !== daysWithData
      ? ` (${totalRecordRows} dòng bản ghi)`
      : '';

  return (
    <div
      className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3"
      role="group"
      aria-label="Bộ lọc kỳ"
    >
      {/* Hàng 1: Hiển thị nổi bật Nguồn dữ liệu, Kỳ đang xem và Số ngày có dữ liệu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nguồn đang xem</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate" data-testid="active-source-label">
              {sourceLabel}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kỳ báo cáo</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate" data-testid="active-period-label">
              Kỳ: {rangeLabel}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Độ phủ dữ liệu</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-300 truncate" data-testid="active-days-label">
              {isSummaryOnly
                ? `Chỉ có tổng kỳ (${summaryCalDays || '—'} ngày lịch, không tách ngày)`
                : `${daysWithData}/${daysInRange} ngày có dữ liệu${rowDiffNote}`}
            </div>
          </div>
        </div>
      </div>

      {/* Hàng 2: Các nút chọn kỳ nhanh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-1 border-t border-slate-800/70">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Chọn kỳ xem:</span>
          {PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              disabled={isSummaryOnly}
              aria-pressed={filter.preset === p.id}
              onClick={() => onChange({ ...filter, preset: p.id })}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                filter.preset === p.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {p.label}
            </button>
          ))}
          {filter.preset === 'custom' && !isSummaryOnly && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <label className="flex items-center gap-1">
                <span>Từ</span>
                <input
                  type="date"
                  value={filter.from || ''}
                  onChange={e => onChange({ ...filter, from: e.target.value })}
                  className="min-h-[36px] bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center gap-1">
                <span>đến</span>
                <input
                  type="date"
                  value={filter.to || ''}
                  onChange={e => onChange({ ...filter, to: e.target.value })}
                  className="min-h-[36px] bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400">
          {isSummaryOnly ? (
            <span className="text-purple-300">
              Đang xem ảnh tổng kỳ cố định ({rangeLabel}) · không tách điểm theo ngày
            </span>
          ) : (
            <span>
              <span className="font-semibold text-slate-200">Kỳ: {rangeLabel}</span>
              <span> · {daysWithData}/{daysInRange} ngày có dữ liệu</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
