import type { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { formatDateVN, sourceLabelOf } from './reportModel';
import { buildTextReport } from './textReport';

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export function buildHtmlReport(snapshot: CampaignReportSnapshot, version: string): string {
  const { meta, totals, kpis } = snapshot;
  const period = `${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)}`;
  const source = escapeHtml(sourceLabelOf(snapshot));
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Báo cáo AdPulse</title></head><body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:720px;margin:auto;background:white;border-collapse:collapse;border-radius:12px;overflow:hidden"><tr><td style="padding:24px;border-top:5px solid #4f46e5"><h1 style="color:#312e81;font-size:22px;margin:0 0 8px">AdPulse · Báo cáo chiến dịch Facebook Ads</h1><p style="margin:0 0 16px;font-size:13px;color:#475569"><b>Kỳ:</b> ${escapeHtml(period)} &nbsp;·&nbsp; <b>Nguồn:</b> ${source}</p><table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:16px"><tr><td style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;width:33.3%"><div style="font-size:11px;color:#64748b;text-transform:uppercase">Tổng chi phí</div><div style="font-size:18px;font-weight:bold;color:#0f172a;margin-top:4px">${escapeHtml(formatVND(totals.spend))}</div></td><td style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;width:33.3%"><div style="font-size:11px;color:#64748b;text-transform:uppercase">Số đơn hàng</div><div style="font-size:18px;font-weight:bold;color:#047857;margin-top:4px">${escapeHtml(totals.orders.toLocaleString('vi-VN'))} đơn</div></td><td style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;width:33.3%"><div style="font-size:11px;color:#64748b;text-transform:uppercase">Chi phí / đơn (CPA)</div><div style="font-size:18px;font-weight:bold;color:#312e81;margin-top:4px">${escapeHtml(kpis.cpa.formatted)}</div></td></tr></table><div style="white-space:pre-wrap;line-height:1.7;color:#1e293b;font-size:14px">${escapeHtml(buildTextReport(snapshot, version))}</div></td></tr></table></body></html>`;
}
