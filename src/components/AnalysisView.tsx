import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler
} from 'chart.js';
import { CampaignReportSnapshot } from '../types/campaign';
import { buildDailySeries, calendarDaysBetween, collectDataNotes, formatDateVN, sourceLabelOf } from '../report/reportModel';
import { formatVND } from '../utils/kpiEngine';
import { AlertTriangle, Image as ImageIcon, Info } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

interface Props {
  snapshot: CampaignReportSnapshot;
  onOpenImport?: () => void;
  onLoadSampleDaily?: () => void;
}

const axisColor = '#94a3b8';
const baseOptions = (unit: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (c: any) => c.raw === null ? 'Không có dữ liệu' : `${Number(c.raw).toLocaleString('vi-VN')} ${unit}`
      }
    }
  },
  scales: {
    x: { ticks: { color: axisColor }, grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { color: axisColor, callback: (v: any) => Number(v).toLocaleString('vi-VN') },
      grid: { color: 'rgba(148,163,184,0.15)' },
      title: { display: true, text: unit, color: axisColor }
    }
  }
});

const ChartCard: React.FC<{ title: string; question: string; children: React.ReactNode }> = ({ title, question, children }) => (
  <figure className="min-w-0 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
    <figcaption className="mb-3">
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs text-slate-400">{question}</div>
    </figcaption>
    <div className="relative w-full h-56 sm:h-64">{children}</div>
  </figure>
);

export const AnalysisView: React.FC<Props> = ({ snapshot, onOpenImport, onLoadSampleDaily }) => {
  const { points, missingDates } = buildDailySeries(snapshot);
  const dataNotes = collectDataNotes(snapshot);

  // Trường hợp chỉ có tổng kỳ từ ảnh chụp (PeriodSummaryRecord), không có điểm dữ liệu theo ngày
  if (points.length === 0 && snapshot.summaryRecord) {
    const sum = snapshot.summaryRecord;
    const calDays = calendarDaysBetween(sum.period_start, sum.period_end);
    return (
      <div className="space-y-4" data-testid="summary-only-analysis">
        <div
          role="region"
          aria-label="Giải thích biểu đồ tổng kỳ"
          className="p-5 sm:p-6 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-slate-100 space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Vì sao biểu đồ theo ngày không có điểm dữ liệu?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Nguồn đang xem là <b>{sourceLabelOf(snapshot)}</b> cho kỳ{' '}
                <b>{formatDateVN(sum.period_start)} – {formatDateVN(sum.period_end)}</b>
                {calDays ? ` (${calDays} ngày lịch)` : ''}. Ảnh gốc chỉ chứa <b>con số tổng hợp của cả kỳ</b>, không có bảng chi tiết từng ngày.
              </p>
              <p className="text-xs text-purple-200 flex items-center gap-1.5 pt-1">
                <Info className="w-4 h-4 flex-shrink-0" aria-hidden />
                <span>
                  Quy tắc minh bạch dữ liệu: Hệ thống <b>không tự chia trung bình ra từng ngày ảo</b> để tránh vẽ biểu đồ xu hướng giả.
                </span>
              </p>
            </div>
          </div>

          {(onOpenImport || onLoadSampleDaily) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {onOpenImport && (
                <button
                  type="button"
                  onClick={onOpenImport}
                  className="min-h-[38px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  Nhập dữ liệu theo ngày
                </button>
              )}
              {onLoadSampleDaily && (
                <button
                  type="button"
                  onClick={onLoadSampleDaily}
                  className="min-h-[38px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Xem thử Bộ 1 (5 ngày có biểu đồ)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Khung đối chiếu nhanh số tổng kỳ ngay tại tab Phân tích */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
          <table className="w-full text-xs">
            <caption className="text-left px-4 py-3 text-sm font-bold text-white">
              Bảng tổng hợp cả kỳ từ ảnh chụp (KPI tính từ lõi chung)
            </caption>
            <thead className="text-slate-400 bg-slate-950/60">
              <tr>
                <th className="px-3 py-2.5 text-left">Kỳ tổng hợp</th>
                <th className="px-3 py-2.5 text-right">Reach</th>
                <th className="px-3 py-2.5 text-right">Click</th>
                <th className="px-3 py-2.5 text-right">Chi phí (VND)</th>
                <th className="px-3 py-2.5 text-right">Số đơn</th>
                <th className="px-3 py-2.5 text-right">CTR</th>
                <th className="px-3 py-2.5 text-right">CPC</th>
                <th className="px-3 py-2.5 text-right">Chi phí/đơn</th>
              </tr>
            </thead>
            <tbody className="text-slate-100 font-mono">
              <tr className="border-t border-slate-800">
                <td className="px-3 py-3 font-sans font-semibold">
                  {formatDateVN(sum.period_start)} – {formatDateVN(sum.period_end)}
                </td>
                <td className="px-3 py-3 text-right">{snapshot.totals.reachSum.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-3 text-right">{snapshot.totals.clicks.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-3 text-right font-bold text-white">{formatVND(snapshot.totals.spend)}</td>
                <td className="px-3 py-3 text-right font-bold text-emerald-400">{snapshot.totals.orders.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-3 text-right text-indigo-300">{snapshot.kpis.ctr.formatted}</td>
                <td className="px-3 py-3 text-right text-amber-300">{snapshot.kpis.cpc.formatted}</td>
                <td className="px-3 py-3 text-right font-bold text-emerald-300">{snapshot.kpis.cpa.formatted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="p-8 text-center text-slate-300 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <p className="text-base font-bold text-white">Chưa có số liệu để vẽ biểu đồ theo ngày</p>
        <p className="text-xs text-slate-400">
          Hãy bấm <b>Nhập dữ liệu</b> ở thanh trên cùng để thêm số liệu chiến dịch, hoặc chọn một <b>Dữ liệu mẫu</b> để xem biểu đồ xu hướng.
        </p>
        {(onOpenImport || onLoadSampleDaily) && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {onOpenImport && (
              <button
                type="button"
                onClick={onOpenImport}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Nhập dữ liệu
              </button>
            )}
            {onLoadSampleDaily && (
              <button
                type="button"
                onClick={onLoadSampleDaily}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Dùng dữ liệu mẫu (Bộ 1)
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const labels = points.map(p => p.label);
  // null = ngày không có dòng dữ liệu: Chart.js để khoảng trống (spanGaps=false), KHÔNG vẽ về 0.
  const reach = points.map(p => p.reach);
  const spend = points.map(p => p.spend);
  const orders = points.map(p => p.orders);

  return (
    <div className="space-y-4">
      {dataNotes.length > 0 && (
        <div role="region" aria-label="Lưu ý dữ liệu" className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 space-y-1">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
            <span>Lưu ý dữ liệu trong kỳ ({dataNotes.length})</span>
          </div>
          <ul className="list-disc list-inside text-slate-300 space-y-0.5">
            {dataNotes.map((n, idx) => <li key={idx}>{n}</li>)}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Reach theo ngày" question="Mỗi ngày tiếp cận bao nhiêu người? (người/ngày)">
          <Line aria-label="Biểu đồ reach theo ngày" data={{ labels, datasets: [{ label: 'Reach', data: reach, borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', fill: true, spanGaps: false, tension: 0.25, pointRadius: 4 }] }} options={baseOptions('người')} />
        </ChartCard>
        <ChartCard title="Chi phí theo ngày" question="Mỗi ngày tiêu bao nhiêu tiền? (VND/ngày)">
          <Bar aria-label="Biểu đồ chi phí theo ngày" data={{ labels, datasets: [{ label: 'Chi phí', data: spend, backgroundColor: '#6366f1' }] }} options={baseOptions('VND')} />
        </ChartCard>
        <ChartCard title="Số đơn theo ngày" question="Mỗi ngày có bao nhiêu đơn? (đơn/ngày)">
          <Bar aria-label="Biểu đồ số đơn theo ngày" data={{ labels, datasets: [{ label: 'Số đơn', data: orders, backgroundColor: '#14b8a6' }] }} options={baseOptions('đơn')} />
        </ChartCard>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <table className="w-full text-xs">
          <caption className="text-left px-4 py-3 text-sm font-bold text-white">Bảng số theo ngày (KPI từ lõi tính chung)</caption>
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Ngày</th><th className="px-3 py-2 text-right">Reach (người)</th>
              <th className="px-3 py-2 text-right">Click</th><th className="px-3 py-2 text-right">Chi phí (VND)</th>
              <th className="px-3 py-2 text-right">Đơn</th><th className="px-3 py-2 text-right">CTR</th>
              <th className="px-3 py-2 text-right">CPC</th><th className="px-3 py-2 text-right">Chi phí/đơn</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {snapshot.dailyRecords.map(r => (
              <tr key={r.id} className="border-t border-slate-800">
                <td className="px-3 py-2">{formatDateVN(r.date)}</td>
                <td className="px-3 py-2 text-right">{r.reach.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-2 text-right">{r.clicks.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-2 text-right">{r.spend.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-2 text-right">{r.orders.toLocaleString('vi-VN')}</td>
                <td className="px-3 py-2 text-right">{r.kpis.ctr.formatted}</td>
                <td className="px-3 py-2 text-right">{r.kpis.cpc.formatted}</td>
                <td className="px-3 py-2 text-right">{r.kpis.cpa.formatted}</td>
              </tr>
            ))}
            {missingDates.map(d => (
              <tr key={`m-${d}`} className="border-t border-slate-800 text-amber-300">
                <td className="px-3 py-2">{formatDateVN(d)}</td>
                <td className="px-3 py-2 text-right" colSpan={7}>Không có dữ liệu</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
