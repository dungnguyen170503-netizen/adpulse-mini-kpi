const { chromium } = require('playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const PizZip = require('pizzip');
const out = 'docs/loc/evidence';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const checks = [];
    const check = (name, ok) => { assert.ok(ok, name); checks.push({ name, ok }); console.log('PASS ' + name); };
    await page.goto('http://127.0.0.1:5173');
    await page.getByRole('button', { name: /Bộ 1/ }).first().click();
    await page.reload();
    await page.getByRole('tab', { name: 'Báo cáo', exact: true }).click();
    // Explicit deterministic fixture tests UI/export behavior; NOT evidence of a live model call.
    await page.route('**/api/ai/analyze', route => {
      const { snapshot } = route.request().postDataJSON();
      return route.fulfill({ json: { status: 'ready', source: 'UI test fixture', model: 'fixture', snapshotId: snapshot.meta.snapshotId, dataVersion: 'fixture', generatedAt: '2026-11-08', summary: 'Nhận xét kiểm thử: CTR 2.95%, 60 đơn.', suggestions: [1, 2, 3].map(i => ({ title: 'Gợi ý kiểm thử ' + i, evidence: 'Chi phí 2.970.000 đ', limitation: 'Chưa có mục tiêu', action: 'Đối chiếu số liệu', verification: 'Kiểm tra kỳ sau' })) } });
    });
    await page.getByRole('button', { name: 'Tạo nhận xét và 3 gợi ý' }).click();
    await page.getByTestId('ai-analysis').waitFor();
    check('Nhận xét + 3 gợi ý hiện trong báo cáo Text', (await page.getByTestId('report-text').textContent()).includes('Gợi ý kiểm thử 3'));
    await page.getByRole('radio', { name: /HTML email/ }).click();
    const htmlDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Tải HTML', exact: true }).click();
    const hd = await htmlDownload; await hd.saveAs(out + '/sample-report.html');
    check('HTML tải được, có KPI và AI', fs.readFileSync(out + '/sample-report.html', 'utf8').includes('Gợi ý kiểm thử 3'));
    await page.getByRole('radio', { name: /PPTX/ }).click();
    const pptDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Tải PPTX' }).click();
    const pd = await pptDownload; await pd.saveAs(out + '/sample-report-with-ai-fixture.pptx');
    const zip = new PizZip(fs.readFileSync(out + '/sample-report-with-ai-fixture.pptx'));
    const slides = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f));
    check('PPTX có 8 slide gồm nhận xét và 3 gợi ý', slides.length === 8 && slides.some(f => zip.file(f).asText().includes('Gợi ý kiểm thử 3')));
    await page.getByRole('radio', { name: /^PDF/ }).click(); await page.getByRole('button', { name: 'Mở xuất PDF' }).click();
    check('PDF xem trước có cùng nhận xét AI', await page.getByText('Nhận xét và gợi ý AI', { exact: true }).isVisible());
    await page.screenshot({ path: out + '/pdf-ai-preview.png', fullPage: true });
    await page.keyboard.press('Escape');
    await page.reload(); await page.getByRole('tab', { name: 'Báo cáo', exact: true }).click();
    await page.route('**/api/ai/chat', route => route.fulfill({ json: { answer: 'Câu trả lời kiểm thử: kỳ 01/11–05/11, CTR 2.95%.' } }));
    await page.getByText('Hỏi về KPI và xu hướng', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Câu hỏi cho AI' }).fill('CTR là bao nhiêu?');
    await page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click();
    await page.getByText(/Câu trả lời kiểm thử:/).waitFor();
    check('Chatbot hiển thị câu trả lời từ API', true);
    await page.unroute('**/api/ai/analyze');
    await page.route('**/api/ai/analyze', route => route.fulfill({ status: 502, json: { error: 'Lỗi thử nghiệm Gemini' } }));
    await page.getByRole('button', { name: 'Tạo nhận xét và 3 gợi ý' }).click();
    await page.getByRole('alert').filter({ hasText: 'Lỗi thử nghiệm' }).waitFor();
    check('Lỗi AI không chặn báo cáo KPI', (await page.getByTestId('report-text').textContent()).includes('2.95%'));
    for (const width of [834, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      check('AI/chat responsive ' + width, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.screenshot({ path: out + '/mobile-ai-error.png', fullPage: true });
    fs.writeFileSync(out + '/ui-results.json', JSON.stringify({ fixture: true, checks }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
