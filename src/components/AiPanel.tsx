import { useEffect, useRef, useState } from 'react';
import type { AiAnalysis, CampaignReportSnapshot } from '../types/campaign';
import { aiReportText } from '../report/aiReport';

type Message = { role: 'user' | 'assistant'; content: string };
export function AiPanel({ snapshot, onReady }: { snapshot: CampaignReportSnapshot; onReady: (ai: AiAnalysis) => void }) {
  const [analysis, setAnalysis] = useState(snapshot.ai);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const controller = useRef<AbortController>();
  useEffect(() => () => controller.current?.abort(), []);
  const call = async (chat: boolean) => {
    if (busy) return;
    setBusy(true); setError('');
    const request = new AbortController(); controller.current = request;
    const timer = setTimeout(() => request.abort(), 95000);
    try {
      const response = await fetch(`/api/ai/${chat ? 'chat' : 'analyze'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: request.signal,
        body: JSON.stringify({ snapshot, ...(chat ? { question, history: messages.slice(-10) } : {}) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI chưa sẵn sàng.');
      if (chat) { setMessages(prev => [...prev, { role: 'user', content: question }, { role: 'assistant', content: data.answer }]); setQuestion(''); }
      else { setAnalysis(data); onReady(data); }
    } catch (e: any) {
      if (!request.signal.aborted) setError(e?.message || 'Không kết nối được AI.');
      else setError('Đã dừng yêu cầu AI hoặc hết thời gian chờ. Bạn có thể thử lại.');
    } finally { clearTimeout(timer); setBusy(false); }
  };
  return <section aria-label="Trợ lý AI" className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-4 space-y-4 min-w-0">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-bold text-indigo-200">Trợ lý AI · Gemini</h2><p className="text-xs text-slate-400">Kỳ {snapshot.meta.periodStart || '—'} – {snapshot.meta.periodEnd || '—'} · phân tích số liệu đang xem</p></div>
      <button onClick={() => call(false)} disabled={busy || !snapshot.dailyRecords.length} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold disabled:opacity-50">{busy ? 'Đang hỏi Gemini…' : 'Tạo nhận xét và 3 gợi ý'}</button>
    </div>
    {error && <p role="alert" className="text-sm text-amber-300">{error} KPI và báo cáo vẫn sử dụng được.</p>}
    {analysis ? <div data-testid="ai-analysis" className="whitespace-pre-wrap break-words text-sm leading-relaxed">{aiReportText({ ...snapshot, ai: analysis })}</div> : <p className="text-sm text-slate-400">Chưa có nhận xét AI. Bấm nút để gửi số liệu kỳ này tới Gemini.</p>}
    <details className="border-t border-slate-700 pt-3"><summary className="cursor-pointer font-semibold">Hỏi về KPI và xu hướng</summary>
      <div aria-live="polite" className="space-y-3 py-3 max-h-96 overflow-auto">{messages.map((m, i) => <p key={i} className="whitespace-pre-wrap break-words text-sm"><b>{m.role === 'user' ? 'Bạn' : 'Gemini'}: </b>{m.content}</p>)}</div>
      <form className="flex flex-col sm:flex-row gap-2" onSubmit={e => { e.preventDefault(); if (question.trim()) call(true); }}>
        <input aria-label="Câu hỏi cho AI" value={question} onChange={e => setQuestion(e.target.value)} maxLength={1500} disabled={busy} placeholder="Vì sao cần kiểm tra chi phí mỗi đơn kỳ này?" className="min-w-0 flex-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm" />
        <button disabled={busy || !question.trim() || !snapshot.dailyRecords.length} className="rounded-xl bg-indigo-600 px-4 py-2 disabled:opacity-50">Gửi câu hỏi</button>
      </form>
    </details>
  </section>;
}
