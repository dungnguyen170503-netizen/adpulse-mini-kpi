/**
 * REPORT MODEL (Khoa · C2/U1/K2)
 * Chỉ ĐỌC từ CampaignReportSnapshot do kpiEngine (Dũng) tạo.
 * Không tính CTR/CPC/CPA ở đây. Các hàm dưới chỉ lọc kỳ, dựng trục ngày và tạo dấu vết phiên bản dữ liệu.
 */
import { CampaignReportSnapshot, DailyAdRecord } from '../types/campaign';

export type PeriodPreset = 'all' | 'last7' | 'custom';

export interface PeriodFilter {
  preset: PeriodPreset;
  from?: string; // YYYY-MM-DD, dùng khi preset = custom
  to?: string;
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Khoảng ngày thực tế (from/to) mà bộ lọc áp lên dữ liệu. "7 ngày gần nhất" tính lùi từ ngày có dữ liệu mới nhất. */
export function resolvePeriod(records: DailyAdRecord[], filter: PeriodFilter): { from: string; to: string } | null {
  if (records.length === 0) return null;
  const dates = records.map(r => r.date).sort();
  const min = dates[0];
  const max = dates[dates.length - 1];
  if (filter.preset === 'last7') return { from: addDays(max, -6) < min ? min : addDays(max, -6), to: max };
  if (filter.preset === 'custom') {
    // Chỉ chọn một đầu thì đầu còn lại lấy theo dữ liệu (không bỏ qua bộ lọc âm thầm)
    const from = filter.from || min;
    const to = filter.to || max;
    return from <= to ? { from, to } : { from: to, to: from };
  }
  return { from: min, to: max };
}

export function filterRecords(records: DailyAdRecord[], filter: PeriodFilter): DailyAdRecord[] {
  const p = resolvePeriod(records, filter);
  if (!p) return [];
  return records.filter(r => r.date >= p.from && r.date <= p.to);
}

export function formatDateVN(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function periodLabel(snapshot: CampaignReportSnapshot, requested?: { from: string; to: string } | null): string {
  const from = requested?.from || snapshot.meta.periodStart;
  const to = requested?.to || snapshot.meta.periodEnd;
  if (!from || !to) return 'Chưa có dữ liệu';
  return `${formatDateVN(from)} – ${formatDateVN(to)}`;
}

export interface DayPoint {
  date: string;            // YYYY-MM-DD
  label: string;           // dd/mm
  hasRecord: boolean;
  reach: number | null;    // null = KHÔNG có dòng dữ liệu → khoảng trống, không vẽ thành 0
  spend: number | null;
  orders: number | null;
}

/**
 * Trục ngày liên tục trong kỳ. Ngày KHÔNG có dòng nhập → null (khoảng trống).
 * Ngày có dòng nhập tường minh (kể cả toàn 0) → vẽ đúng giá trị 0.
 * Nhiều dòng cùng ngày (chưa gộp) được cộng lại chỉ để vẽ điểm; KPI vẫn do kpiEngine tính.
 */
export function buildDailySeries(snapshot: CampaignReportSnapshot): { points: DayPoint[]; missingDates: string[] } {
  const recs = snapshot.dailyRecords;
  if (recs.length === 0) return { points: [], missingDates: [] };
  const from = snapshot.meta.periodStart;
  const to = snapshot.meta.periodEnd;
  const byDate = new Map<string, { reach: number; spend: number; orders: number }>();
  for (const r of recs) {
    const cur = byDate.get(r.date) || { reach: 0, spend: 0, orders: 0 };
    cur.reach += Number(r.reach || 0);
    cur.spend += Number(r.spend || 0);
    cur.orders += Number(r.orders || 0);
    byDate.set(r.date, cur);
  }
  const points: DayPoint[] = [];
  const missingDates: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const v = byDate.get(d);
    const [, m, dd] = d.split('-');
    if (v) points.push({ date: d, label: `${dd}/${m}`, hasRecord: true, reach: v.reach, spend: v.spend, orders: v.orders });
    else {
      points.push({ date: d, label: `${dd}/${m}`, hasRecord: false, reach: null, spend: null, orders: null });
      missingDates.push(d);
    }
  }
  return { points, missingDates };
}

/** Dấu vết nội dung dữ liệu: đổi dữ liệu hoặc kỳ → khác nhau. Dùng để phát hiện báo cáo cũ. */
export function dataVersionOf(snapshot: CampaignReportSnapshot): string {
  const core = snapshot.dailyRecords.map(r => [r.id, r.date, r.spend, r.reach, r.clicks, r.orders].join('|')).join(';');
  const sum = snapshot.summaryRecord ? JSON.stringify(snapshot.summaryRecord) : '';
  const s = `${snapshot.meta.periodStart}~${snapshot.meta.periodEnd}#${core}#${sum}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}

export function snapshotTimeLabel(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}
