/**
 * BÁO CÁO PPTX (R4) — tạo trực tiếp từ CampaignReportSnapshot, không cần xuất text trước.
 * Số lấy từ snapshot.totals / snapshot.kpis[*].formatted (kpiEngine). Không tính KPI riêng.
 */
import PptxGenJS from 'pptxgenjs';
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { buildDailySeries, collectDataNotes, formatDateVN, snapshotTimeLabel } from './reportModel';

const BLUE = '0B5FFF';
const GRAY = '5B6472';
const DARK = '111827';

export function pptxFileName(snapshot: CampaignReportSnapshot): string {
  return `adpulse-bao-cao-${snapshot.meta.periodStart}-${snapshot.meta.periodEnd}.pptx`;
}

export async function downloadPptx(snapshot: CampaignReportSnapshot, dataVersion: string): Promise<string> {
  const { meta, totals, kpis } = snapshot;
  const { points, missingDates, daysWithData, daysInRange } = buildDailySeries(snapshot);
  const period = `${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)}`;
  const footer = `Snapshot ${meta.snapshotId} · dữ liệu v${dataVersion} · ${snapshotTimeLabel(meta.generatedAt)}`;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Báo cáo chiến dịch Facebook Ads';

  const addFooter = (s: PptxGenJS.Slide) =>
    s.addText(footer, { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 9, color: GRAY, fontFace: 'Arial' });

  // Slide 1: Tiêu đề + kỳ
  let s = pptx.addSlide();
  s.addText('Báo cáo chiến dịch Facebook Ads', { x: 0.5, y: 1.6, w: 9, h: 0.9, fontSize: 32, bold: true, color: DARK, fontFace: 'Arial' });
  s.addText(`Kỳ báo cáo: ${period}`, { x: 0.5, y: 2.6, w: 9, h: 0.5, fontSize: 20, color: BLUE, fontFace: 'Arial' });
  const rowNote = snapshot.dailyRecords.length !== daysWithData ? ` · ${snapshot.dailyRecords.length} dòng bản ghi` : '';
  s.addText(`${daysWithData}/${daysInRange} ngày có dữ liệu${missingDates.length ? ` · thiếu ${missingDates.length} ngày` : ''}${rowNote}`, {
    x: 0.5, y: 3.2, w: 9, h: 0.4, fontSize: 14, color: GRAY, fontFace: 'Arial'
  });
  addFooter(s);

  // Slide 2: KPI
  s = pptx.addSlide();
  s.addText(`Số liệu chính · ${period}`, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const cards: [string, string][] = [
    ['Chi phí', formatVND(totals.spend)],
    ['Reach (tổng các ngày)', totals.reachSum.toLocaleString('vi-VN')],
    ['Click', totals.clicks.toLocaleString('vi-VN')],
    ['Số đơn', totals.orders.toLocaleString('vi-VN')],
    ['CTR (click/reach)', kpis.ctr.formatted],
    ['CPC', kpis.cpc.formatted],
    ['Chi phí mỗi đơn', kpis.cpa.formatted]
  ];
  cards.forEach(([label, value], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.5 + col * 2.3;
    const y = 1.1 + row * 1.7;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.1, h: 1.45, fill: { color: 'F3F6FB' }, line: { color: 'D6DCE8', width: 1 }, rectRadius: 0.1 });
    s.addText(label, { x: x + 0.1, y: y + 0.1, w: 1.9, h: 0.4, fontSize: 11, color: GRAY, fontFace: 'Arial' });
    s.addText(value, { x: x + 0.1, y: y + 0.55, w: 1.9, h: 0.7, fontSize: value.length > 12 ? 15 : 20, bold: true, color: DARK, fontFace: 'Arial', fit: 'shrink' });
  });
  s.addText('Reach là tổng các ngày, không phải số người duy nhất cả kỳ.', { x: 0.5, y: 4.6, w: 9, h: 0.4, fontSize: 11, italic: true, color: GRAY, fontFace: 'Arial' });
  addFooter(s);

  // Slide 3: Bảng theo ngày (ngày thiếu hiện "Không có dữ liệu")
  s = pptx.addSlide();
  s.addText('Theo ngày', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const head = ['Ngày', 'Reach', 'Chi phí (VND)', 'Số đơn'].map(t => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: BLUE }, fontFace: 'Arial', fontSize: 11 } }));
  const rows = points.slice(0, 12).map(p => p.hasRecord
    ? [p.label, (p.reach ?? 0).toLocaleString('vi-VN'), (p.spend ?? 0).toLocaleString('vi-VN'), String(p.orders ?? 0)]
    : [p.label, 'Không có dữ liệu', '—', '—']
  ).map(r => r.map(t => ({ text: t, options: { fontFace: 'Arial', fontSize: 10, color: t === 'Không có dữ liệu' ? 'B42318' : DARK } })));
  s.addTable([head, ...rows], { x: 0.5, y: 0.95, w: 9, colW: [1.6, 2.4, 3, 2], border: { type: 'solid', color: 'D6DCE8', pt: 0.5 } });
  if (points.length > 12) s.addText(`Hiển thị 12/${points.length} ngày đầu của kỳ.`, { x: 0.5, y: 4.9, w: 9, h: 0.3, fontSize: 10, color: GRAY, fontFace: 'Arial' });
  addFooter(s);

  // Slide 4: Ghi chú dữ liệu + AI
  s = pptx.addSlide();
  s.addText('Lưu ý dữ liệu & gợi ý', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const notes = collectDataNotes(snapshot);
  if (notes.length === 0) notes.push('Không có cảnh báo dữ liệu.');
  notes.push('Gợi ý AI: chưa có trong bản này (do Lộc tích hợp).');
  s.addText(notes.map(t => ({ text: t, options: { bullet: true, breakLine: true } })), {
    x: 0.6, y: 1.1, w: 8.8, h: 3.7, fontSize: 13, color: DARK, fontFace: 'Arial', valign: 'top'
  });
  addFooter(s);

  const name = pptxFileName(snapshot);
  await pptx.writeFile({ fileName: name });
  return name;
}
