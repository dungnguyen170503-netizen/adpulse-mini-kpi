import { AiPanel } from './AiPanel';
import { buildHtmlReport } from '../report/htmlReport';
import type { AiAnalysis, CampaignReportSnapshot } from '../types/campaign';
import React, { useMemo, useState } from 'react';
import { buildTextReport } from '../report/textReport';
import { downloadPptx } from '../report/pptxReport';
import { formatVND } from '../utils/kpiEngine';
import {
  buildDailySeries,
  calendarDaysBetween,
  dataVersionOf,
  formatDateVN,
  hasReportData,
  snapshotTimeLabel,
  sourceLabelOf
} from '../report/reportModel';
import {
  Copy,
  Download,
  FileText,
  FileDown,
  Mail,
  Presentation,
  RefreshCw,
  AlertTriangle,
  Check,
  DollarSign,
  ShoppingBag,
  Target,
  Database,
  Calendar
} from 'lucide-react';

interface Props {
  /** Snapshot hiện tại theo dữ liệu/bộ lọc đang xem */
  current: CampaignReportSnapshot;
  /** Snapshot báo cáo đã đóng băng (giữ nguyên kể cả khi chuyển sang tab khác rồi quay lại) */
  frozen: CampaignReportSnapshot;
  onRefreshFrozen: () => void;
  onAi: (ai: AiAnalysis) => void;
  /** Mở màn PDF với đúng snapshot đã đóng băng để PDF/text/PPTX cùng số */
  onOpenPdf: (snapshot: CampaignReportSnapshot) => void;
  onToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

type Format = 'text' | 'pdf' | 'email' | 'pptx';

export const ReportView: React.FC<Props> = ({ current, frozen, onRefreshFrozen, onOpenPdf, onToast, onAi }) => {
  const [format, setFormat] = useState<Format>('text');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const frozenVersion = useMemo(() => dataVersionOf(frozen), [frozen]);
  const currentVersion = useMemo(() => dataVersionOf(current), [current]);
  const stale = frozenVersion !== currentVersion;
  const text = useMemo(() => buildTextReport(frozen, frozenVersion), [frozen, frozenVersion]);
  const empty = !hasReportData(frozen);
  const html = useMemo(() => buildHtmlReport(frozen, frozenVersion), [frozen, frozenVersion]);

  const frozenSeries = useMemo(() => buildDailySeries(frozen), [frozen]);
  const isSummaryOnly = !!frozen.summaryRecord && frozen.dailyRecords.length === 0;
  const frozenPeriodText =
    frozen.meta.periodStart && frozen.meta.periodEnd
      ? `${formatDateVN(frozen.meta.periodStart)} – ${formatDateVN(frozen.meta.periodEnd)}`
      : 'Chưa có kỳ';
  const currentPeriodText =
    current.meta.periodStart && current.meta.periodEnd
      ? `${formatDateVN(current.meta.periodStart)} – ${formatDateVN(current.meta.periodEnd)}`
      : 'Chưa có kỳ';
  const frozenSourceText = sourceLabelOf(frozen);
  const currentSourceText = sourceLabelOf(current);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Đã sao chép báo cáo text', 'success');
  };

  const pptx = async () => {
    setBusy(true);
    try {
      const name = await downloadPptx(frozen, frozenVersion);
      onToast(`Đã tải ${name}`, 'success');
    } catch (e: any) {
      onToast(`Không tạo được PPTX: ${e?.message || 'lỗi không rõ'}. Dữ liệu và các báo cáo khác không bị ảnh hưởng.`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const cards: { id: Format; title: string; desc: string; icon: React.ReactNode; note?: string }[] = [
    { id: 'text', title: 'Text', desc: 'Copy gửi Zalo/sếp', icon: <FileText className="w-5 h-5" /> },
    { id: 'pdf', title: 'PDF', desc: 'Tài liệu A4, tải trực tiếp', icon: <FileDown className="w-5 h-5" /> },
    { id: 'email', title: 'HTML email', desc: 'Xem trước, sao chép và tải HTML', icon: <Mail className="w-5 h-5" /> },
    { id: 'pptx', title: 'PPTX', desc: '4 slide KPI + slide AI nếu có', icon: <Presentation className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-4 pb-24 md:pb-0">
      {/* 1. Banner cảnh báo báo cáo cũ khi sửa dữ liệu hoặc đổi kỳ: chỉ rõ bản đang xem là của kỳ nào, nguồn nào và cho cập nhật ngay */}
      {stale && (
        <div
          role="alert"
          data-testid="stale-report-banner"
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-950/50 border-2 border-amber-500/60 text-amber-100 text-xs shadow-lg"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" aria-hidden />
            <div className="space-y-1">
              <div className="font-bold text-sm text-white">
                Dữ liệu đã thay đổi sau khi tạo báo cáo (dựa trên dữ liệu lúc {snapshotTimeLabel(frozen.meta.generatedAt)}).
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                • <b>Bản báo cáo đang xem:</b> Kỳ <b>{frozenPeriodText}</b> · Nguồn: <b>{frozenSourceText}</b>
                <br />• <b>Dữ liệu/kỳ mới trên bảng:</b> Kỳ <b>{currentPeriodText}</b> · Nguồn: <b>{currentSourceText}</b>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefreshFrozen}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold flex items-center gap-1.5 self-start md:self-center flex-shrink-0 shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden />
            <span>Cập nhật báo cáo</span>
          </button>
        </div>
      )}

      {/* 2. Đưa 3 KPI chính (Chi phí, Số đơn, Chi phí/đơn) + Nguồn & Kỳ của bản báo cáo lên ĐẦU tab Báo cáo */}
      <section
        aria-label="Tóm tắt KPI chính gửi sếp"
        data-testid="report-kpi-header"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Số liệu chốt trong báo cáo này:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              <span>Kỳ: {frozenPeriodText}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
              <Database className="w-3.5 h-3.5" aria-hidden />
              <span>Nguồn: {frozenSourceText}</span>
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {isSummaryOnly
              ? `Chỉ có tổng kỳ từ ảnh (${calendarDaysBetween(frozen.meta.periodStart, frozen.meta.periodEnd) || '—'} ngày lịch)`
              : `${frozenSeries.daysWithData}/${frozenSeries.daysInRange} ngày có dữ liệu`}
          </span>
        </div>

        {/* 3 Thẻ KPI quan trọng nhất với sếp: Chi phí, Số đơn, Chi phí/đơn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">1. Tổng chi phí</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5" data-testid="report-kpi-spend">
                {formatVND(frozen.totals.spend)}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" aria-hidden />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">2. Số đơn hàng</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-0.5" data-testid="report-kpi-orders">
                {frozen.totals.orders.toLocaleString('vi-VN')} <span className="text-xs font-sans font-normal text-slate-400">đơn</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" aria-hidden />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">3. Chi phí / đơn (CPA)</div>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-300 font-mono mt-0.5" data-testid="report-kpi-cpa">
                {frozen.kpis.cpa.formatted}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center">
              <Target className="w-5 h-5" aria-hidden />
            </div>
          </div>
        </div>

        {/* Hàng chỉ số phụ: Reach, Click, CTR, CPC */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-300 pt-1">
          <span>Reach cộng dồn: <b className="font-mono text-white">{frozen.totals.reachSum.toLocaleString('vi-VN')}</b></span>
          <span>Click: <b className="font-mono text-white">{frozen.totals.clicks.toLocaleString('vi-VN')}</b></span>
          <span>CTR (click/reach): <b className="font-mono text-indigo-300">{frozen.kpis.ctr.formatted}</b></span>
          <span>CPC (chi phí/click): <b className="font-mono text-amber-300">{frozen.kpis.cpc.formatted}</b></span>
        </div>
      </section>

      {/* 3. Chọn định dạng báo cáo & Thao tác xuất ngay trên đầu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="radiogroup" aria-label="Chọn định dạng báo cáo">
        {cards.map(c => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={format === c.id}
            onClick={() => setFormat(c.id)}
            className={`min-h-[68px] text-left p-3.5 rounded-2xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              format === c.id ? 'bg-indigo-950/70 border-indigo-500 shadow-md' : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 text-indigo-300">
              {c.icon}
              <span className="text-sm font-bold text-white">{c.title}</span>
              {c.note && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{c.note}</span>}
            </div>
            <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
          </button>
        ))}
      </div>

      {/* 4. Khung thao tác xuất & Xem trước báo cáo */}
      <section className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3" aria-label="Xem trước báo cáo">
        {format === 'text' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Bản xem trước Text (Gửi Zalo / Tin nhắn cho sếp)
              </span>
              <button
                type="button"
                onClick={copy}
                disabled={empty}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20"
              >
                {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
            <pre
              className="whitespace-pre-wrap text-xs md:text-sm text-slate-200 font-mono bg-slate-950 rounded-xl p-4 max-h-[24rem] overflow-auto border border-slate-800/80"
              data-testid="report-text"
            >
              {text}
            </pre>
          </>
        )}

        {format === 'email' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Bản xem trước HTML Email
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold disabled:opacity-50"
                  disabled={empty}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(html);
                      onToast('Đã sao chép mã HTML');
                    } catch {
                      onToast('Không sao chép được. Hãy tải HTML.', 'error');
                    }
                  }}
                >
                  Sao chép HTML
                </button>
                <button
                  type="button"
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold disabled:opacity-50"
                  disabled={empty}
                  onClick={() => {
                    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'adpulse-' + (frozen.meta.periodStart || 'report') + '.html';
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                >
                  Tải HTML
                </button>
              </div>
            </div>
            <iframe title="Xem trước HTML email" sandbox="" srcDoc={html} className="w-full h-96 rounded-xl bg-white" />
          </div>
        )}

        {format === 'pdf' && (
          <div className="text-sm text-slate-300 space-y-3">
            <p>
              PDF A4 dùng đúng số liệu kỳ <b>{frozenPeriodText}</b> ({frozenSourceText}) và nhận xét AI của báo cáo này.
            </p>
            <button
              type="button"
              onClick={() => onOpenPdf(frozen)}
              disabled={empty}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" aria-hidden />
              <span>Mở xuất PDF</span>
            </button>
          </div>
        )}

        {format === 'pptx' && (
          <div className="text-sm text-slate-300 space-y-3">
            <p>
              Slide 16:9 gồm: tiêu đề + kỳ + nguồn ({frozenSourceText}), số liệu chính, bảng theo ngày (hoặc tổng kỳ từ ảnh), lưu ý dữ liệu. Tạo trực tiếp từ snapshot, không cần xuất text trước.
            </p>
            <button
              type="button"
              onClick={pptx}
              disabled={empty || busy}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" aria-hidden />
              <span>{busy ? 'Đang tạo…' : 'Tải PPTX'}</span>
            </button>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Snapshot {frozen.meta.snapshotId} · Nguồn: {frozenSourceText} · dữ liệu v{frozenVersion} · lúc {snapshotTimeLabel(frozen.meta.generatedAt)}
        </p>
      </section>

      {/* 5. Phần AI dài đặt phía dưới và thu gọn mặc định để không che khuất KPI & nút xuất, mở rộng khi cần */}
      <AiPanel key={frozen.meta.snapshotId} snapshot={frozen} onReady={onAi} defaultCollapsed={true} />

      {/* Nút Sao chép cố định cuối màn hình trên mobile (đúng thiết kế S9) */}
      {format === 'text' && (
        <div className="md:hidden fixed bottom-16 inset-x-0 px-4 z-30">
          <button
            type="button"
            onClick={copy}
            disabled={empty}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
