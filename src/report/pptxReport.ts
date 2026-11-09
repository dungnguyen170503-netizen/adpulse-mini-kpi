/**
 * BÁO CÁO PPTX (R4) — tạo trực tiếp từ CampaignReportSnapshot, không cần xuất text trước.
 * Số lấy từ snapshot.totals / snapshot.kpis[*].formatted (kpiEngine). Không tính KPI riêng.
 * Hỗ trợ đồng nhất cả dữ liệu theo ngày và dữ liệu tổng kỳ từ ảnh chụp (PeriodSummaryRecord).
 */
import PptxGenJS from 'pptxgenjs';
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND } from '../utils/kpiEngine';
import { buildDailySeries, calendarDaysBetween, collectDataNotes, formatDateVN, snapshotTimeLabel, sourceLabelOf } from './reportModel';

const BLUE = '0B5FFF';
const GRAY = '5B6472';
const DARK = '111827';

export function pptxFileName(snapshot: CampaignReportSnapshot): string {
  return `adpulse-bao-cao-${snapshot.meta.periodStart || 'ky'}-${snapshot.meta.periodEnd || 'bao-cao'}.pptx`;
}

export async function downloadPptx(snapshot: CampaignReportSnapshot, dataVersion: string): Promise<string> {
  const { meta, totals, kpis } = snapshot;
  const { points, missingDates, daysWithData, daysInRange } = buildDailySeries(snapshot);
  const period = `${formatDateVN(meta.periodStart)} – ${formatDateVN(meta.periodEnd)}`;
  const sourceLabel = sourceLabelOf(snapshot);
  const footer = `Snapshot ${meta.snapshotId} · Nguồn: ${sourceLabel} · dữ liệu v${dataVersion} · ${snapshotTimeLabel(meta.generatedAt)}`;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Báo cáo chiến dịch Facebook Ads';

  const addFooter = (s: PptxGenJS.Slide) =>
    s.addText(footer, { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 9, color: GRAY, fontFace: 'Arial' });

  // Slide 1: Tiêu đề + kỳ + nguồn
  let s = pptx.addSlide();
  s.addText('Báo cáo chiến dịch Facebook Ads', { x: 0.5, y: 1.4, w: 9, h: 0.9, fontSize: 32, bold: true, color: DARK, fontFace: 'Arial' });
  s.addText(`Kỳ báo cáo: ${period}`, { x: 0.5, y: 2.4, w: 9, h: 0.5, fontSize: 20, color: BLUE, fontFace: 'Arial' });
  if (snapshot.summaryRecord && snapshot.dailyRecords.length === 0) {
    const calDays = calendarDaysBetween(meta.periodStart, meta.periodEnd);
    s.addText(`Nguồn: ${sourceLabel} · Chỉ có tổng kỳ từ ảnh chụp${calDays ? ` (${calDays} ngày lịch)` : ''}, không tách theo ngày`, {
      x: 0.5, y: 3.0, w: 9, h: 0.4, fontSize: 14, color: GRAY, fontFace: 'Arial'
    });
  } else {
    const rowNote = snapshot.dailyRecords.length !== daysWithData ? ` · ${snapshot.dailyRecords.length} dòng bản ghi` : '';
    s.addText(`${daysWithData}/${daysInRange} ngày có dữ liệu${missingDates.length ? ` · thiếu ${missingDates.length} ngày` : ''}${rowNote} · Nguồn: ${sourceLabel}`, {
      x: 0.5, y: 3.0, w: 9, h: 0.4, fontSize: 14, color: GRAY, fontFace: 'Arial'
    });
  }
  addFooter(s);

  // Slide 2: KPI
  s = pptx.addSlide();
  s.addText(`Số liệu chính · ${period}`, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const cards: [string, string][] = [
    ['Chi phí', formatVND(totals.spend)],
    ['Số đơn', totals.orders.toLocaleString('vi-VN')],
    ['Chi phí mỗi đơn', kpis.cpa.formatted],
    ['Reach (tổng các ngày)', totals.reachSum.toLocaleString('vi-VN')],
    ['Click', totals.clicks.toLocaleString('vi-VN')],
    ['CTR (click/reach)', kpis.ctr.formatted],
    ['CPC', kpis.cpc.formatted]
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

  // Slide 3: Bảng theo ngày (ngày thiếu hiện "Không có dữ liệu", ảnh tổng kỳ hiện giải thích rõ)
  s = pptx.addSlide();
  s.addText('Theo ngày', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const head = ['Ngày', 'Reach', 'Chi phí (VND)', 'Số đơn'].map(t => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: BLUE }, fontFace: 'Arial', fontSize: 11 } }));
  if (snapshot.summaryRecord && points.length === 0) {
    const summaryRow = [
      `${period} (Tổng kỳ)`,
      totals.reachSum.toLocaleString('vi-VN'),
      totals.spend.toLocaleString('vi-VN'),
      String(totals.orders)
    ].map(t => ({ text: t, options: { fontFace: 'Arial', fontSize: 11, bold: true, color: DARK } }));
    s.addTable([head, summaryRow], { x: 0.5, y: 0.95, w: 9, colW: [2.4, 2.2, 2.6, 1.8], border: { type: 'solid', color: 'D6DCE8', pt: 0.5 } });
    s.addText(
      'Nguồn dữ liệu là ảnh chụp tổng kỳ: chỉ có số tổng hợp của cả kỳ, không có điểm theo từng ngày. Hệ thống giữ nguyên số tổng và không tự chia đều thành ngày giả.',
      { x: 0.5, y: 2.2, w: 9, h: 0.8, fontSize: 12, color: GRAY, fontFace: 'Arial' }
    );
  } else {
    const rows = points.slice(0, 12).map(p => p.hasRecord
      ? [p.label, (p.reach ?? 0).toLocaleString('vi-VN'), (p.spend ?? 0).toLocaleString('vi-VN'), String(p.orders ?? 0)]
      : [p.label, 'Không có dữ liệu', '—', '—']
    ).map(r => r.map(t => ({ text: t, options: { fontFace: 'Arial', fontSize: 10, color: t === 'Không có dữ liệu' ? 'B42318' : DARK } })));
    s.addTable([head, ...rows], { x: 0.5, y: 0.95, w: 9, colW: [1.6, 2.4, 3, 2], border: { type: 'solid', color: 'D6DCE8', pt: 0.5 } });
    if (points.length > 12) s.addText(`Hiển thị 12/${points.length} ngày đầu của kỳ.`, { x: 0.5, y: 4.9, w: 9, h: 0.3, fontSize: 10, color: GRAY, fontFace: 'Arial' });
  }
  addFooter(s);

  // Slide 4: Ghi chú dữ liệu + AI
  s = pptx.addSlide();
  s.addText('Lưu ý dữ liệu & gợi ý', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: 'Arial' });
  const notes = collectDataNotes(snapshot);
  if (notes.length === 0) notes.push('Không có cảnh báo dữ liệu.');
  if (!snapshot.ai) notes.push('Chưa có nhận xét AI.');
  s.addText(notes.map(t => ({ text: t, options: { bullet: true, breakLine: true } })), {
    x: 0.6, y: 1.1, w: 8.8, h: 3.7, fontSize: 13, color: DARK, fontFace: 'Arial', valign: 'top'
  });
  addFooter(s);

  if (snapshot.ai?.status === 'ready') {
    const ai = snapshot.ai;
    const pages = [{ title: 'Nhận xét AI', body: ai.source + ' · ' + ai.model + '\n' + ai.summary },
      ...ai.suggestions.map((v, i) => ({ title: (i + 1) + '. ' + v.title, body: 'Căn cứ: ' + v.evidence + '\n\nGiới hạn: ' + v.limitation + '\n\nHành động: ' + v.action + '\n\nKiểm tra: ' + v.verification }))];
    for (const page of pages) {
      const slide = pptx.addSlide();
      slide.addText(page.title, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true, fontFace: 'Arial', fit: 'shrink' });
      slide.addText(page.body, { x: 0.5, y: 1, w: 9, h: 4, fontSize: 16, fontFace: 'Arial', fit: 'shrink', valign: 'top' });
      addFooter(slide);
    }
  }
  const name = pptxFileName(snapshot);
  await pptx.writeFile({ fileName: name });
  return name;
}
