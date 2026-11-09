import { aiReportText } from './aiReport';
/**
 * BÁO CÁO TEXT (R1) — dựng trực tiếp từ CampaignReportSnapshot.
 * Mọi số lấy từ snapshot.totals / snapshot.kpis[*].formatted do kpiEngine tạo; không tính lại.
 * Hỗ trợ đồng nhất cả dữ liệu theo ngày và dữ liệu tổng kỳ từ ảnh chụp (PeriodSummaryRecord).
 */
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { buildDailySeries, calendarDaysBetween, collectDataNotes, formatDateVN, hasReportData, snapshotTimeLabel, sourceLabelOf } from './reportModel';

export function buildTextReport(snapshot: CampaignReportSnapshot, dataVersion: string): string {
  const { meta, totals, kpis } = snapshot;
  const { daysWithData, daysInRange } = buildDailySeries(snapshot);
  const L: string[] = [];

  if (!hasReportData(snapshot)) {
    return 'BÁO CÁO CHIẾN DỊCH FACEBOOK ADS\nChưa có dữ liệu để báo cáo.';
  }

  L.push('BÁO CÁO CHIẾN DỊCH FACEBOOK ADS');
  if (snapshot.summaryRecord && snapshot.dailyRecords.length === 0) {
    const calDays = calendarDaysBetween(meta.periodStart, meta.periodEnd);
    L.push(`Kỳ: ${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)} (Chỉ có tổng kỳ từ ảnh chụp${calDays ? `, ${calDays} ngày lịch` : ''}, không tách theo ngày)`);
  } else {
    const rowNote = snapshot.dailyRecords.length !== daysWithData ? `, ${snapshot.dailyRecords.length} dòng bản ghi` : '';
    L.push(`Kỳ: ${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)} (${daysWithData}/${daysInRange} ngày có dữ liệu${rowNote})`);
  }
  L.push(`Nguồn dữ liệu: ${sourceLabelOf(snapshot)}`);
  L.push('');
  L.push('1. SỐ LIỆU CHÍNH');
  L.push(`- Chi phí: ${formatVND(totals.spend)}`);
  L.push(`- Số đơn: ${totals.orders.toLocaleString('vi-VN')}`);
  L.push(`- Chi phí mỗi đơn: ${kpis.cpa.formatted}`);
  L.push(`- Reach (tổng các ngày, không phải người duy nhất cả kỳ): ${totals.reachSum.toLocaleString('vi-VN')}`);
  L.push(`- Click: ${totals.clicks.toLocaleString('vi-VN')}`);
  L.push('');
  L.push('2. CHỈ SỐ');
  L.push(`- CTR (click/reach): ${kpis.ctr.formatted}`);
  L.push(`- CPC (chi phí/click): ${kpis.cpc.formatted}`);
  L.push(`- Chi phí mỗi đơn: ${kpis.cpa.formatted}`);

  L.push('');
  L.push('3. LƯU Ý DỮ LIỆU');
  const notes = collectDataNotes(snapshot);
  if (notes.length === 0) notes.push('Không có cảnh báo.');
  notes.forEach(n => L.push(`- ${n}`));

  L.push('');
  L.push('4. GỢI Ý AI');
  L.push(aiReportText(snapshot));

  L.push('');
  L.push(`Snapshot ${meta.snapshotId} · dữ liệu v${dataVersion} · tạo lúc ${snapshotTimeLabel(meta.generatedAt)}`);
  return L.join('\n');
}
