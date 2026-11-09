/**
 * REPORT MODEL (Khoa · C2/U1/K2)
 * Chỉ ĐỌC từ CampaignReportSnapshot do kpiEngine (Dũng) tạo.
 * Không tính CTR/CPC/CPA ở đây. Các hàm dưới chỉ lọc kỳ, dựng trục ngày, nhận diện nguồn và tạo dấu vết phiên bản dữ liệu.
 */
import { CampaignReportSnapshot, DailyAdRecord, PeriodSummaryRecord } from '../types/campaign';
import { calculateDailyMetrics } from '../utils/kpiEngine';

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

/**
 * Tạo CampaignReportSnapshot chuẩn từ bản ghi tổng kỳ (PeriodSummaryRecord)
 * Sử dụng trực tiếp calculateDailyMetrics của Dũng (kpiEngine) để lấy đúng CTR, CPC, CPA, CVR.
 * Tuyệt đối KHÔNG sinh ra dailyRecords giả theo ngày (hasDailyBreakdown = false).
 */
export function buildSnapshotFromSummary(summary: PeriodSummaryRecord): CampaignReportSnapshot {
  const kpis = calculateDailyMetrics({
    id: summary.id,
    date: summary.period_start,
    spend: Number(summary.total_spend) || 0,
    reach: Number(summary.total_reach) || 0,
    clicks: Number(summary.total_clicks) || 0,
    orders: Number(summary.total_orders) || 0,
    source_type: 'image_ocr',
    status: 'valid'
  });
  const zeroDivisionCount = (kpis.cpc.status === 'zero_division' || kpis.cpa.status === 'zero_division') ? 1 : 0;
  return {
    meta: {
      snapshotId: `snap_sum_${summary.id}`,
      generatedAt: new Date().toISOString(),
      periodStart: summary.period_start,
      periodEnd: summary.period_end,
      totalDays: 0,
      currency: 'VND',
      campaignName: 'Chiến dịch Facebook Ads (Tổng kỳ từ ảnh)',
      hasDailyBreakdown: false
    },
    totals: {
      spend: Number(summary.total_spend) || 0,
      reachSum: Number(summary.total_reach) || 0,
      clicks: Number(summary.total_clicks) || 0,
      orders: Number(summary.total_orders) || 0
    },
    kpis,
    dailyRecords: [],
    summaryRecord: summary,
    dataIntegrity: {
      isClean: zeroDivisionCount === 0,
      missingFieldsCount: 0,
      zeroDivisionCount,
      duplicateDatesResolved: 0,
      warnings: []
    }
  };
}

/** Kiểm tra xem snapshot có dữ liệu báo cáo hợp lệ không (bản ghi theo ngày hoặc bản ghi tổng kỳ từ ảnh). */
export function hasReportData(snapshot: CampaignReportSnapshot): boolean {
  return snapshot.dailyRecords.length > 0 || !!snapshot.summaryRecord;
}

/** Nhận diện nhãn nguồn dữ liệu rõ ràng cho người dùng trên Dashboard và trong 4 định dạng báo cáo. */
export function sourceLabelOf(snapshot: CampaignReportSnapshot): string {
  if (snapshot.summaryRecord && snapshot.dailyRecords.length === 0) {
    const fileNote = snapshot.summaryRecord.imageFileName ? ` (${snapshot.summaryRecord.imageFileName})` : '';
    return `Ảnh chụp tổng kỳ OCR${fileNote}`;
  }
  const recs = snapshot.dailyRecords;
  if (recs.length === 0) return 'Chưa có dữ liệu';

  const ids = recs.map(r => r.id);
  if (ids.every(id => id.startsWith('b1_'))) return 'Dữ liệu mẫu · Bộ 1 (Chuẩn mực)';
  if (ids.every(id => id.startsWith('b2_'))) return 'Dữ liệu mẫu · Bộ 2 (Lỗi/Thiếu)';
  if (ids.every(id => id.startsWith('b3_'))) return 'Dữ liệu mẫu · Bộ 3 (Biên/Số 0/Trùng)';
  if (ids.every(id => id.startsWith('def_'))) return 'Dữ liệu mẫu (Mặc định 10 ngày)';

  const types = Array.from(new Set(recs.map(r => r.source_type)));
  const mapType = (t: string) => {
    if (t === 'manual') return 'Nhập tay';
    if (t === 'excel_csv') return 'File Excel / CSV';
    if (t === 'text_copy') return 'Dán văn bản (Clipboard)';
    if (t === 'image_ocr') return 'Ảnh chụp OCR (Theo ngày)';
    return 'Đã nhập';
  };
  const baseLabel = types.length === 1 ? mapType(types[0]) : `Kết hợp (${types.map(mapType).join(' + ')})`;
  if (snapshot.summaryRecord) {
    return `${baseLabel} + Ảnh tổng kỳ`;
  }
  return baseLabel;
}

/** Kiểm tra xem snapshot hiện tại có phải là dữ liệu mẫu hay không */
export function isSampleDataSnapshot(snapshot: CampaignReportSnapshot): boolean {
  if (snapshot.summaryRecord && snapshot.dailyRecords.length === 0) {
    return snapshot.summaryRecord.id.includes('sample');
  }
  if (snapshot.dailyRecords.length === 0) return false;
  return snapshot.dailyRecords.every(r =>
    r.id.startsWith('b1_') || r.id.startsWith('b2_') || r.id.startsWith('b3_') || r.id.startsWith('def_')
  );
}

/** Số ngày lịch trong khoảng từ..đến */
export function calendarDaysBetween(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const a = Date.parse(from + 'T00:00:00Z');
  const b = Date.parse(to + 'T00:00:00Z');
  if (isNaN(a) || isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86400000) + 1;
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
export function buildDailySeries(snapshot: CampaignReportSnapshot): {
  points: DayPoint[];
  missingDates: string[];
  daysWithData: number;
  daysInRange: number;
} {
  const recs = snapshot.dailyRecords;
  if (recs.length === 0) return { points: [], missingDates: [], daysWithData: 0, daysInRange: 0 };
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
  return {
    points,
    missingDates,
    daysWithData: points.length - missingDates.length,
    daysInRange: points.length
  };
}

/**
 * Tổng hợp ghi chú dữ liệu từ snapshot (không tính lại KPI):
 * gồm ngày thiếu trong kỳ, cảnh báo toàn kỳ, cảnh báo trùng ngày và cảnh báo từng dòng từ kpiEngine.
 */
export function collectDataNotes(snapshot: CampaignReportSnapshot): string[] {
  const { kpis, dataIntegrity, dailyRecords } = snapshot;
  const { missingDates } = buildDailySeries(snapshot);
  const notes: string[] = [];

  if (missingDates.length > 0) {
    notes.push(`Không có dòng dữ liệu các ngày: ${missingDates.map(formatDateVN).join(', ')} (biểu đồ để trống các ngày này, không tính là 0)`);
  }
  for (const [k, v] of [['CTR kỳ', kpis.ctr], ['CPC kỳ', kpis.cpc], ['Chi phí mỗi đơn kỳ', kpis.cpa]] as const) {
    if (v.warningMessage) notes.push(`${k}: ${v.warningMessage}`);
  }
  for (const w of dataIntegrity.warnings) {
    notes.push(w);
  }
  for (const r of dailyRecords) {
    const dLabel = formatDateVN(r.date);
    if (r.spend === 0 && r.reach === 0 && r.clicks === 0 && r.orders === 0) {
      notes.push(`Ngày ${dLabel}: toàn bộ số liệu = 0 (tạm dừng chiến dịch)`);
      continue;
    }
    const rowWarnings: string[] = [];
    if (r.kpis.ctr.warningMessage) rowWarnings.push(`CTR (${r.kpis.ctr.warningMessage})`);
    if (r.kpis.cpc.warningMessage) rowWarnings.push(`CPC (${r.kpis.cpc.warningMessage})`);
    if (r.kpis.cpa.warningMessage) rowWarnings.push(`Chi phí/đơn (${r.kpis.cpa.warningMessage})`);
    if (rowWarnings.length > 0) {
      notes.push(`Ngày ${dLabel}: ${rowWarnings.join('; ')}`);
    }
  }
  if (snapshot.summaryRecord) {
    const calDays = calendarDaysBetween(snapshot.summaryRecord.period_start, snapshot.summaryRecord.period_end);
    notes.push(
      `Số tổng kỳ lấy từ ảnh chụp (${formatDateVN(snapshot.summaryRecord.period_start)} – ${formatDateVN(snapshot.summaryRecord.period_end)}${calDays ? `, ${calDays} ngày lịch` : ''}): chỉ dùng ở mức tổng kỳ, không tự chia thành số theo ngày.`
    );
  }
  return notes;
}

/** Dấu vết nội dung dữ liệu: đổi dữ liệu hoặc kỳ → khác nhau. Dùng để phát hiện báo cáo cũ. */
export function dataVersionOf(snapshot: CampaignReportSnapshot): string {
  const core = snapshot.dailyRecords.map(r => [r.id, r.date, r.spend, r.reach, r.clicks, r.orders].join('|')).join(';');
  const sum = snapshot.summaryRecord
    ? [
        snapshot.summaryRecord.id,
        snapshot.summaryRecord.period_start,
        snapshot.summaryRecord.period_end,
        snapshot.summaryRecord.total_spend,
        snapshot.summaryRecord.total_reach,
        snapshot.summaryRecord.total_clicks,
        snapshot.summaryRecord.total_orders
      ].join('|')
    : '';
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
