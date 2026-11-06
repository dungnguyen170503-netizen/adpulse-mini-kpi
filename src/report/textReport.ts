/**
 * BÁO CÁO TEXT (R1) — dựng trực tiếp từ CampaignReportSnapshot.
 * Mọi số lấy từ snapshot.totals / snapshot.kpis[*].formatted do kpiEngine tạo; không tính lại.
 */
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { buildDailySeries, collectDataNotes, formatDateVN, snapshotTimeLabel } from './reportModel';

export function buildTextReport(snapshot: CampaignReportSnapshot, dataVersion: string): string {
  const { meta, totals, kpis } = snapshot;
  const { daysWithData, daysInRange } = buildDailySeries(snapshot);
  const L: string[] = [];

  if (snapshot.dailyRecords.length === 0) {
    return 'BÁO CÁO CHIẾN DỊCH FACEBOOK ADS\nChưa có dữ liệu để báo cáo.';
  }

  const rowNote = snapshot.dailyRecords.length !== daysWithData ? `, ${snapshot.dailyRecords.length} dòng bản ghi` : '';
  L.push('BÁO CÁO CHIẾN DỊCH FACEBOOK ADS');
  L.push(`Kỳ: ${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)} (${daysWithData}/${daysInRange} ngày có dữ liệu${rowNote})`);
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
  const notes = collectDataNotes(snapshot);
  if (notes.length === 0) notes.push('Không có cảnh báo.');
  notes.forEach(n => L.push(`- ${n}`));

  L.push('');
  L.push('4. GỢI Ý AI');
  L.push('- Chưa có gợi ý AI trong bản này (phần AI do Lộc tích hợp).');

  L.push('');
  L.push(`Snapshot ${meta.snapshotId} · dữ liệu v${dataVersion} · tạo lúc ${snapshotTimeLabel(meta.generatedAt)}`);
  return L.join('\n');
}
