import React, { useMemo, useState } from 'react';
import { CampaignReportSnapshot } from '../types/campaign';
import { buildTextReport } from '../report/textReport';
import { downloadPptx } from '../report/pptxReport';
import { dataVersionOf, snapshotTimeLabel } from '../report/reportModel';
import { Copy, Download, FileText, FileDown, Mail, Presentation, RefreshCw, AlertTriangle, Check } from 'lucide-react';

interface Props {
  /** Snapshot hiện tại theo dữ liệu/bộ lọc đang xem */
  current: CampaignReportSnapshot;
  /** Mở màn PDF với đúng snapshot đã đóng băng để PDF/text/PPTX cùng số */
  onOpenPdf: (snapshot: CampaignReportSnapshot) => void;
  onToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

type Format = 'text' | 'pdf' | 'email' | 'pptx';

export const ReportView: React.FC<Props> = ({ current, onOpenPdf, onToast }) => {
  // Snapshot báo cáo bất biến: chỉ đổi khi người dùng bấm "Cập nhật báo cáo".
  const [frozen, setFrozen] = useState<CampaignReportSnapshot>(current);
  const [format, setFormat] = useState<Format>('text');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const frozenVersion = useMemo(() => dataVersionOf(frozen), [frozen]);
  const currentVersion = useMemo(() => dataVersionOf(current), [current]);
  const stale = frozenVersion !== currentVersion;
  const text = useMemo(() => buildTextReport(frozen, frozenVersion), [frozen, frozenVersion]);
  const empty = frozen.dailyRecords.length === 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    onToast('Đã sao chép báo cáo text', 'success');
  };

  const pptx = async () => {
    setBusy(true);
    try {
      const name = await downloadPptx(frozen, frozenVersion);
      onToast(`Đã tải ${name}`, 'success');
    } catch (e: any) {
      onToast(`Không tạo được PPTX: ${e?.message || 'lỗi không rõ'}. Dữ liệu và các báo cáo khác không bị ảnh hưởng.`, 'error');
    } finally { setBusy(false); }
  };

  const cards: { id: Format; title: string; desc: string; icon: React.ReactNode; note?: string }[] = [
    { id: 'text', title: 'Text', desc: 'Copy gửi Zalo/sếp', icon: <FileText className="w-5 h-5" /> },
    { id: 'pdf', title: 'PDF', desc: 'Tài liệu A4 (phần của Dũng)', icon: <FileDown className="w-5 h-5" /> },
    { id: 'email', title: 'HTML email', desc: 'Chưa có trong PR này (phần của Lộc)', icon: <Mail className="w-5 h-5" />, note: 'chưa làm' },
    { id: 'pptx', title: 'PPTX', desc: '4 slide 16:9, tải trực tiếp', icon: <Presentation className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-4 pb-24 md:pb-0">
      {stale && (
        <div role="alert" className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
          <span className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
            Dữ liệu đã thay đổi sau khi tạo báo cáo (dựa trên dữ liệu lúc {snapshotTimeLabel(frozen.meta.generatedAt)}).</span>
          <button type="button" onClick={() => setFrozen(current)} className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-bold flex items-center gap-1.5 self-start">
            <RefreshCw className="w-3.5 h-3.5" aria-hidden /> Cập nhật báo cáo
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="radiogroup" aria-label="Chọn định dạng báo cáo">
        {cards.map(c => (
          <button
            key={c.id} type="button" role="radio" aria-checked={format === c.id}
            disabled={c.id === 'email'}
            onClick={() => setFormat(c.id)}
            className={`text-left p-3 rounded-2xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              format === c.id ? 'bg-indigo-950/60 border-indigo-500' : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 text-indigo-300">{c.icon}<span className="text-sm font-bold text-white">{c.title}</span>
              {c.note && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{c.note}</span>}</div>
            <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
          </button>
        ))}
      </div>

      <section className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3" aria-label="Xem trước báo cáo">
        {format === 'text' && (
          <>
            <pre className="whitespace-pre-wrap text-xs md:text-sm text-slate-200 font-mono bg-slate-950 rounded-xl p-4 max-h-[28rem] overflow-auto" data-testid="report-text">{text}</pre>
            <div className="hidden md:flex gap-2">
              <button type="button" onClick={copy} disabled={empty} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}{copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </>
        )}
        {format === 'pdf' && (
          <div className="text-sm text-slate-300 space-y-3">
            <p>PDF được tạo trực tiếp từ cùng snapshot ở màn xuất của Dũng.</p>
            <button type="button" onClick={() => onOpenPdf(frozen)} disabled={empty} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50"><FileDown className="w-4 h-4" aria-hidden />Mở xuất PDF</button>
          </div>
        )}
        {format === 'pptx' && (
          <div className="text-sm text-slate-300 space-y-3">
            <p>Slide 16:9 gồm: tiêu đề + kỳ, số liệu chính, bảng theo ngày, lưu ý dữ liệu. Tạo trực tiếp từ snapshot, không cần xuất text trước.</p>
            <button type="button" onClick={pptx} disabled={empty || busy} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50">
              <Download className="w-4 h-4" aria-hidden />{busy ? 'Đang tạo…' : 'Tải PPTX'}
            </button>
          </div>
        )}
        <p className="text-xs text-slate-500">Snapshot {frozen.meta.snapshotId} · dữ liệu v{frozenVersion} · lúc {snapshotTimeLabel(frozen.meta.generatedAt)}</p>
      </section>

      {/* Nút Sao chép cố định cuối màn hình trên mobile (đúng thiết kế S9) */}
      {format === 'text' && (
        <div className="md:hidden fixed bottom-16 inset-x-0 px-4 z-30">
          <button type="button" onClick={copy} disabled={empty} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
            {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}{copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      )}
    </div>
  );
};
