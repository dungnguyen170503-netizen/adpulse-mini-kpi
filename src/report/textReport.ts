/**
 * BÁO CÁO TEXT (R1) — dựng trực tiếp từ CampaignReportSnapshot.
 * Mọi số lấy từ snapshot.totals / snapshot.kpis[*].formatted do kpiEngine tạo; không tính lại.
 */
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { buildDailySeries, formatDateVN, snapshotTimeLabel } from './reportModel';

export function buildTextReport(snapshot: CampaignReportSnapshot, dataVersion: string): string {
  const { meta, totals, kpis, dataIntegrity } = snapshot;
  const { missingDates } = buildDailySeries(snapshot);
  const L: string[] = [];

  if (snapshot.dailyRecords.length === 0) {
    return 'BÁO CÁO CHIẾN DỊCH FACEBOOK ADS\nChưa có dữ liệu để báo cáo.';
  }

  L.push('BÁO CÁO CHIẾN DỊCH FACEBOOK ADS');
  L.push(`Kỳ: ${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)} (${meta.totalDays} ngày có dữ liệu)`);
  L.push('');
  L.push('1. SỐ LIỆU CHÍNH');
  L.push(`- Chi phí: ${formatVND(totals.spend)}`);
  L.push(`- Reach (tổng các ngày, không phải người duy nhất cả kỳ): ${totals.reachSum.toLocaleString('vi-VN')}`);
  L.push(`- Click: ${totals.clicks.toLocaleString('vi-VN')}`);
  L.push(`- Số đơn: ${totals.orders.toLocaleString('vi-VN')}`);
  L.push('');
  L.push('2. CHỈ SỐ');
  L.push(`- CTR (click/reach): ${kpis.ctr.formatted}`);
  L.push(`- CPC (chi phí/click): ${kpis.cpc.formatted}`);
  L.push(`- Chi phí mỗi đơn: ${kpis.cpa.formatted}`);

  L.push('');
  L.push('3. LƯU Ý DỮ LIỆU');
  const notes: string[] = [];
  if (missingDates.length) notes.push(`Không có dòng dữ liệu các ngày: ${missingDates.map(formatDateVN).join(', ')}`);
  for (const [k, v] of [['CTR', kpis.ctr], ['CPC', kpis.cpc], ['Chi phí mỗi đơn', kpis.cpa]] as const) {
    if (v.warningMessage) notes.push(`${k}: ${v.warningMessage}`);
  }
  notes.push(...dataIntegrity.warnings);
  if (snapshot.summaryRecord) notes.push('Có số tổng kỳ lấy từ ảnh chụp, chỉ dùng ở mức tổng kỳ, không phải số theo ngày');
  if (notes.length === 0) notes.push('Không có cảnh báo.');
  notes.forEach(n => L.push(`- ${n}`));

  L.push('');
  L.push('4. GỢI Ý AI');
  L.push('- Chưa có gợi ý AI trong bản này (phần AI do Lộc tích hợp).');

  L.push('');
  L.push(`Snapshot ${meta.snapshotId} · dữ liệu v${dataVersion} · tạo lúc ${snapshotTimeLabel(meta.generatedAt)}`);
  return L.join('\n');
}
