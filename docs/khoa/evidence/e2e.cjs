const { chromium } = require('playwright-core');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const rec = (id, date, spend, reach, clicks, orders) => ({ id, date, campaign_name: 'Chiến dịch Thu Đông 2026', spend, reach, clicks, orders, source_type: 'manual', status: 'valid' });
// Bộ 1 của Dũng, bỏ ngày 03/11 để tạo ngày THIẾU
const GAP = [rec('a', '2026-11-01', 300000, 5000, 150, 6), rec('b', '2026-11-02', 450000, 7500, 210, 9), rec('d', '2026-11-04', 720000, 12000, 360, 15), rec('e', '2026-11-05', 900000, 15000, 420, 18)];

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} · ${name} ${detail}`); };

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(d => { if (!localStorage.getItem('__seeded')) { localStorage.setItem('adpulse_campaign_records_v1', JSON.stringify(d)); localStorage.setItem('__seeded', '1'); } }, GAP);
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);

  const shot = async (n) => page.screenshot({ path: path.join(OUT, n), fullPage: true });
  await shot('desktop-overview.png');

  // Tab Phân tích
  await page.getByRole('tab', { name: 'Phân tích' }).click();
  await page.waitForTimeout(3000);
  await shot('desktop-analysis.png');
  const gapNote = await page.getByText('Không có dòng dữ liệu ngày: 03/11/2026').count();
  check('Phân tích: báo ngày thiếu 03/11 và để trống biểu đồ', gapNote > 0);
  const canvases = await page.locator('canvas').count();
  check('Phân tích: có 3 biểu đồ', canvases === 3, `canvas=${canvases}`);
  // Giá trị thực sự đưa vào chart: lấy từ Chart.js instance qua canvas
  const chartData = await page.evaluate(() => Array.from(document.querySelectorAll('canvas')).map(c => {
    const inst = window.Chart ? window.Chart.getChart(c) : null; return inst ? inst.data.datasets[0].data : null; }));
  console.log('chartData(window.Chart)=', JSON.stringify(chartData));

  // Tab Báo cáo
  await page.getByRole('tab', { name: 'Báo cáo' }).click();
  await page.waitForTimeout(800);
  await shot('desktop-report.png');
  const text = await page.getByTestId('report-text').innerText();
  fs.writeFileSync(path.join(OUT, 'report-text.txt'), text, 'utf8');
  check('Text: kỳ 01/11/2026 – 05/11/2026', text.includes('01/11/2026 – 05/11/2026'));
  check('Text: chi phí 2.370.000', /2\.370\.000/.test(text));
  check('Text: reach 39.500', text.includes('39.500'));
  check('Text: CTR 2.89%', text.includes('2.89%'));
  check('Text: CPC 2.079', text.includes('2.079'));
  check('Text: chi phí/đơn 49.375', text.includes('49.375'));
  check('Text: ghi ngày thiếu 03/11', text.includes('03/11/2026'));

  await page.getByRole('button', { name: /Sao chép/ }).first().click();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check('Copy: clipboard khớp nội dung xem trước', clip.replace(/\r\n/g,'\n') === text.replace(/\r\n/g,'\n'));

  // PPTX
  await page.getByRole('radio', { name: /PPTX/ }).click();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Tải PPTX/ }).click()]);
  const pptxPath = path.join(OUT, dl.suggestedFilename());
  await dl.saveAs(pptxPath);
  const zip = new PizZip(fs.readFileSync(pptxPath));
  const slides = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort();
  const slideText = slides.map(f => (zip.file(f).asText().match(/<a:t>([^<]*)<\/a:t>/g) || []).map(t => t.replace(/<\/?a:t>/g, '')).join(' | '));
  fs.writeFileSync(path.join(OUT, 'pptx-text.txt'), slideText.map((t, i) => `--- slide ${i + 1} ---\n${t}`).join('\n'), 'utf8');
  const all = slideText.join('\n');
  check('PPTX: file ' + dl.suggestedFilename() + ' mở được, ' + slides.length + ' slide', slides.length === 4);
  check('PPTX: kỳ 01/11/2026 – 05/11/2026', all.includes('01/11/2026 – 05/11/2026'));
  check('PPTX: chi phí/reach/CTR/CPC/CPA khớp', ['2.370.000', '39.500', '2.89%', '2.079', '49.375'].every(v => all.includes(v)));
  check('PPTX: ghi "Không có dữ liệu" cho 03/11', all.includes('Không có dữ liệu'));
  check('PPTX: chữ Việt giữ dấu', all.includes('Báo cáo chiến dịch Facebook Ads') && all.includes('Số liệu chính'));

  // Ngày đổi dữ liệu / lọc kỳ -> banner cũ
  await page.getByRole('button', { name: 'Tùy chọn' }).click(); await page.locator('input[type=date]').first().fill('2026-11-02');
  await page.waitForTimeout(500);
  check('Dữ liệu/kỳ đổi: hiện banner "Cập nhật báo cáo"', await page.getByText('Dữ liệu đã thay đổi sau khi tạo báo cáo').count() > 0);
  await shot('desktop-report-stale.png');

  // Mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, permissions: ['clipboard-read', 'clipboard-write'] });
  const mp = await m.newPage();
  await mp.addInitScript(d => { if (!localStorage.getItem('__seeded')) { localStorage.setItem('adpulse_campaign_records_v1', JSON.stringify(d)); localStorage.setItem('__seeded', '1'); } }, GAP);
  await mp.goto('http://localhost:5173/');
  await mp.waitForTimeout(1500);
  await mp.screenshot({ path: path.join(OUT, 'mobile-overview.png'), fullPage: false });
  await mp.getByRole('tab', { name: 'Phân tích' }).last().click(); await mp.waitForTimeout(3000);
  await mp.screenshot({ path: path.join(OUT, 'mobile-analysis.png'), fullPage: true });
  await mp.getByRole('tab', { name: 'Báo cáo' }).last().click(); await mp.waitForTimeout(800);
  await mp.screenshot({ path: path.join(OUT, 'mobile-report.png'), fullPage: false });
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check('Mobile: không tràn ngang', !overflow);
  const copyVisible = await mp.getByRole('button', { name: /Sao chép/ }).last().isVisible();
  check('Mobile: nút Sao chép cố định hiển thị', copyVisible);
  await mp.getByRole('button', { name: /Sao chép/ }).last().click();
  const clip2 = await mp.evaluate(() => navigator.clipboard.readText());
  check('Mobile: copy hoạt động', clip2.includes('01/11/2026 – 05/11/2026'));

  check('Không có lỗi console/page', errors.length === 0, errors.slice(0, 3).join(' || '));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => { console.error('E2E ERROR', e); process.exit(1); });


