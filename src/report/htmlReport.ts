import type { CampaignReportSnapshot } from '../types/campaign';
import { buildTextReport } from './textReport';
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function buildHtmlReport(snapshot: CampaignReportSnapshot, version: string): string {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Báo cáo AdPulse</title></head><body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:720px;margin:auto;background:white;border-collapse:collapse"><tr><td style="padding:24px;border-top:5px solid #4f46e5"><h1 style="color:#312e81;font-size:24px">AdPulse · Báo cáo chiến dịch</h1><div style="white-space:pre-wrap;line-height:1.7;color:#1e293b">${escapeHtml(buildTextReport(snapshot, version))}</div></td></tr></table></body></html>`;
}
