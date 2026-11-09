import { useEffect, useRef, useState } from 'react';
import type { AiAnalysis, CampaignReportSnapshot } from '../types/campaign';
import { aiReportText } from '../report/aiReport';
import { formatDateVN, hasReportData, sourceLabelOf } from '../report/reportModel';
import { Sparkles, ChevronDown, ChevronUp, Loader2, XCircle, RefreshCw } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export function AiPanel({
  snapshot,
  onReady,
  defaultCollapsed = false
}: {
  snapshot: CampaignReportSnapshot;
  onReady: (ai: AiAnalysis) => void;
  defaultCollapsed?: boolean;
}) {
  const [analysis, setAnalysis] = useState(snapshot.ai);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);
  const controller = useRef<AbortController>();

  useEffect(() => {
    setAnalysis(snapshot.ai);
  }, [snapshot.ai]);

  useEffect(() => () => controller.current?.abort(), []);

  const hasData = hasReportData(snapshot);

  const call = async (chat: boolean) => {
    if (busy) return;
    setBusy(true);
    setError('');
    const request = new AbortController();
    controller.current = request;
    const timer = setTimeout(() => request.abort(), 95000);
    try {
      const response = await fetch(`/api/ai/${chat ? 'chat' : 'analyze'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: request.signal,
        body: JSON.stringify({ snapshot, ...(chat ? { question, history: messages.slice(-10) } : {}) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI chưa sẵn sàng.');
      if (chat) {
        setMessages(prev => [...prev, { role: 'user', content: question }, { role: 'assistant', content: data.answer }]);
        setQuestion('');
      } else {
        setAnalysis(data);
        onReady(data);
      }
    } catch (e: any) {
      if (!request.signal.aborted) setError(e?.message || 'Không kết nối được AI.');
      else setError('Đã dừng yêu cầu AI hoặc hết thời gian chờ. Bạn có thể thử lại.');
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  return (
    <section aria-label="Trợ lý AI" className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 space-y-3 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" aria-hidden />
            <h2 className="font-bold text-indigo-200 text-sm sm:text-base">Trợ lý AI · Gemini (Tùy chọn mở rộng)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kỳ {formatDateVN(snapshot.meta.periodStart)} – {formatDateVN(snapshot.meta.periodEnd)} · Nguồn: {sourceLabelOf(snapshot)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {busy && (
            <button
              type="button"
              onClick={() => controller.current?.abort()}
              className="min-h-[38px] rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-300 flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" aria-hidden />
              <span>Hủy chờ</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => call(false)}
            disabled={busy || !hasData}
            className="min-h-[38px] rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white disabled:opacity-50 flex items-center gap-1.5"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                <span>Đang hỏi Gemini…</span>
              </>
            ) : (
              <span>Tạo nhận xét và 3 gợi ý</span>
            )}
          </button>
        </div>
      </div>

      {/* Trạng thái AI đang chờ */}
      {busy && (
        <div role="status" className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between gap-2">
          <span>AI đang phân tích số liệu kỳ này (tối đa 90 giây). Bạn vẫn có thể xem KPI và xuất 4 định dạng báo cáo ngay bên trên.</span>
        </div>
      )}

      {/* Trạng thái lỗi AI: không chặn KPI và báo cáo */}
      {error && (
        <div role="alert" className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs sm:text-sm text-amber-200 flex flex-wrap items-center justify-between gap-2">
          <span>{error} KPI và báo cáo vẫn sử dụng được.</span>
          <button
            type="button"
            onClick={() => call(false)}
            disabled={busy || !hasData}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/40 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" aria-hidden />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* Kết quả AI: thu gọn mặc định khi dài, cho phép mở rộng khi cần */}
      {analysis ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className="font-semibold text-emerald-300">
              Đã có nhận xét & 3 gợi ý AI (đã tự động đính kèm vào Text, PDF, HTML, PPTX)
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="text-indigo-300 hover:text-white font-semibold flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1.5 py-0.5"
            >
              <span>{isExpanded ? 'Thu gọn chi tiết AI' : 'Mở rộng chi tiết AI'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" aria-hidden /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden />}
            </button>
          </div>
          <div
            data-testid="ai-analysis"
            className={`whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-slate-200 transition-all ${
              isExpanded ? '' : 'max-h-40 overflow-y-auto'
            }`}
          >
            {aiReportText({ ...snapshot, ai: analysis })}
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-400">
          Chưa có nhận xét AI. Bạn có thể xuất báo cáo ngay ở trên với đầy đủ KPI, hoặc bấm <b>"Tạo nhận xét và 3 gợi ý"</b> nếu muốn đính kèm phân tích từ Gemini.
        </p>
      )}

      <details className="border-t border-slate-800 pt-3">
        <summary className="cursor-pointer text-xs sm:text-sm font-semibold text-slate-300 hover:text-white">
          Hỏi về KPI và xu hướng
        </summary>
        <div aria-live="polite" className="space-y-3 py-3 max-h-96 overflow-auto">
          {messages.map((m, i) => (
            <p key={i} className="whitespace-pre-wrap break-words text-xs sm:text-sm">
              <b>{m.role === 'user' ? 'Bạn' : 'Gemini'}: </b>
              {m.content}
            </p>
          ))}
        </div>
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={e => {
            e.preventDefault();
            if (question.trim()) call(true);
          }}
        >
          <input
            aria-label="Câu hỏi cho AI"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            maxLength={1500}
            disabled={busy}
            placeholder="Vì sao cần kiểm tra chi phí mỗi đơn kỳ này?"
            className="min-w-0 flex-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-xs sm:text-sm text-white"
          />
          <button
            disabled={busy || !question.trim() || !hasData}
            className="min-h-[40px] rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white disabled:opacity-50"
          >
            Gửi câu hỏi
          </button>
        </form>
      </details>
    </section>
  );
}
