const { chromium } = require('playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    await page.goto('http://127.0.0.1:5173');
    await page.getByRole('button', { name: /Bộ 1/ }).first().click(); await page.reload();
    await page.getByRole('tab', { name: 'Báo cáo', exact: true }).click();
    const result = page.waitForResponse(r => r.url().endsWith('/api/ai/analyze'), { timeout: 100000 });
    await page.getByRole('button', { name: 'Tạo nhận xét và 3 gợi ý' }).click();
    const response = await result; const ai = await response.json();
    assert.equal(response.status(), 200); assert.equal(ai.suggestions.length, 3);
    await page.getByTestId('ai-analysis').waitFor();
    assert.ok((await page.getByTestId('report-text').innerText()).includes(ai.summary));
    await page.screenshot({ path: 'docs/loc/evidence/live-browser-ai.png', fullPage: true });
    await page.getByText('Hỏi về KPI và xu hướng', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Câu hỏi cho AI' }).fill('Kỳ này chi bao nhiêu tiền, có bao nhiêu đơn và CTR là bao nhiêu?');
    const chatResponse = page.waitForResponse(r => r.url().endsWith('/api/ai/chat'), { timeout: 100000 });
    await page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click();
    const cr = await chatResponse; const chat = await cr.json(); assert.equal(cr.status(), 200); assert.ok(chat.answer.length > 0);
    await page.getByRole('radio', { name: /^PDF/ }).click(); await page.getByRole('button', { name: 'Mở xuất PDF' }).click();
    const pdf = page.waitForEvent('download', { timeout: 60000 });
    await page.getByRole('button', { name: /Tải File PDF Thật/ }).click();
    const download = await pdf; await download.saveAs('docs/loc/evidence/live-report.pdf');
    assert.ok(fs.statSync('docs/loc/evidence/live-report.pdf').size > 1000);
    fs.writeFileSync('docs/loc/evidence/live-browser.json', JSON.stringify({ realProvider: true, analysisStatus: response.status(), ai, chatStatus: cr.status(), chat, pdfDownloaded: true }, null, 2));
    console.log('PASS browser → API → Gemini → 3 suggestions → Text/PDF; live chat OK');
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
