const { chromium } = require('playwright-core');
const PizZip = require('pizzip');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const AFTER_DIR = path.resolve(__dirname, '../docs/khoa/evidence/ux-polish/after');
fs.mkdirSync(AFTER_DIR, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} · ${name}${detail ? ' — ' + detail : ''}`);
  assert.ok(ok, `${name} ${detail}`);
};

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });

  try {
    // 1. Capture AFTER screenshots at 1440, 834, 390 (matching BEFORE screenshots)
    for (const vp of [
      { name: '1440', width: 1440, height: 900 },
      { name: '834', width: 834, height: 1112 },
      { name: '390', width: 390, height: 844, isMobile: true, hasTouch: true },
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: Boolean(vp.isMobile),
        hasTouch: Boolean(vp.hasTouch),
      });
      const page = await ctx.newPage();
      await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(AFTER_DIR, `overview-${vp.name}.png`), fullPage: true });
      const ovOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      check(`Responsive ${vp.name}px (Tổng quan): không tràn ngang`, !ovOverflow);

      if (vp.name === '390') {
        const mobileCardsVisible = await page.locator('[aria-label="Danh sách ngày trên điện thoại"]').isVisible();
        check('Mobile 390px: hiển thị thẻ tóm tắt theo ngày dễ đọc trên điện thoại', mobileCardsVisible);
      }

      const tabBtn = vp.name === '390'
        ? page.getByRole('tab', { name: 'Báo cáo' }).last()
        : page.getByRole('tab', { name: 'Báo cáo' }).first();
      await tabBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(AFTER_DIR, `report-${vp.name}.png`), fullPage: true });
      const rpOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      check(`Responsive ${vp.name}px (Báo cáo): không tràn ngang`, !rpOverflow);
      await ctx.close();
    }

    // 2. End-to-End First-Time User & UX Polish Verification on Desktop 1440px
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true,
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));

    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Check 1: Grouped Input menu & separated Sample Data
    const sampleGroupVisible = await page.getByRole('group', { name: 'Dùng dữ liệu mẫu' }).isVisible();
    check('Tách riêng cụm "Dùng dữ liệu mẫu" khỏi nút Nhập dữ liệu chính', sampleGroupVisible);

    const inputBtn = page.getByRole('button', { name: 'Nhập dữ liệu', exact: true });
    await inputBtn.click();
    await page.waitForTimeout(200);
    const menuVisible = await page.getByRole('menu', { name: 'Chọn cách nhập dữ liệu' }).isVisible();
    check('Gom 4 cách nhập dưới nút chính "Nhập dữ liệu"', menuVisible);
    await page.screenshot({ path: path.join(AFTER_DIR, 'input-menu-1440.png'), fullPage: false });

    // Keyboard Escape closes menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    check('Bàn phím: nhấn Escape đóng menu Nhập dữ liệu', !(await page.getByRole('menu', { name: 'Chọn cách nhập dữ liệu' }).isVisible()));

    // Check 2: Prominent Source, Period, and Days with Data
    const statusSummary = await page.getByRole('group', { name: 'Bộ lọc kỳ' }).innerText();
    check(
      'Hiển thị rõ Nguồn đang xem, Kỳ báo cáo và Số ngày có dữ liệu ở đầu trang',
      statusSummary.includes('NGUỒN ĐANG XEM') &&
        statusSummary.includes('27/10/2026 – 05/11/2026') &&
        statusSummary.includes('10/10 ngày có dữ liệu')
    );

    // Check 3: Empty state -> Multi-row entry -> Inline field errors -> Undo -> Save
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Xóa dữ liệu' }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(AFTER_DIR, 'empty-1440.png'), fullPage: true });
    check('Trạng thái chưa có dữ liệu (Empty State): hiển thị hướng dẫn rõ ràng', await page.getByTestId('empty-state-panel').isVisible());

    // Open Multi-row entry from Empty State CTA
    await page.getByRole('button', { name: /Nhập tay nhiều ngày/ }).first().click();
    await page.waitForTimeout(300);

    // Trigger inline validation errors: leave spend empty and set clicks > reach
    const spendInput = page.locator('input[aria-label="Dòng 1 Chi phí"]');
    const reachInput = page.locator('input[aria-label="Dòng 1 Reach"]');
    const clicksInput = page.locator('input[aria-label="Dòng 1 Clicks"]');
    const ordersInput = page.locator('input[aria-label="Dòng 1 Đơn hàng"]');

    await spendInput.fill('');
    await reachInput.fill('100');
    await clicksInput.fill('250');
    await ordersInput.fill('5');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(AFTER_DIR, 'inline-errors-1440.png'), fullPage: false });

    const bodyText = await page.locator('body').innerText();
    check(
      'Thông báo lỗi cạnh trường cần sửa (Inline validation): báo rõ ô Chi phí trống và Click > Reach',
      bodyText.includes('Thiếu Chi phí (nhập 0 nếu = 0)') && bodyText.includes('Click > Reach')
    );

    // Test Undo button in multi-row entry
    const undoBtn = page.getByRole('button', { name: 'Hoàn tác' });
    check('Nút Hoàn tác trong bảng nhập nhiều ngày khả dụng khi vừa sửa', await undoBtn.isEnabled());

    // Fix fields and save valid rows
    await spendInput.fill('500000');
    await reachInput.fill('10000');
    await clicksInput.fill('300');
    await ordersInput.fill('10');
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /Xác Nhận & Lưu/ }).click();
    await page.waitForTimeout(400);

    const afterManualText = await page.getByRole('group', { name: 'Bộ lọc kỳ' }).innerText();
    check(
      'Sau khi nhập tay và xác nhận: cập nhật Nguồn Nhập tay và 3/3 ngày có dữ liệu',
      afterManualText.includes('Nhập tay') && afterManualText.includes('3/3 ngày có dữ liệu')
    );

    // Switch back to Bộ 1 for standard report & stale report checks
    await page.getByRole('button', { name: /Bộ 1/ }).first().click();
    await page.waitForTimeout(400);

    // Check 4: Report Tab Layout (Top 3 KPIs + Export first, Collapsible AI below)
    await page.getByRole('tab', { name: 'Báo cáo' }).first().click();
    await page.waitForTimeout(400);

    const topKpisBox = await page.getByTestId('report-kpi-header').boundingBox();
    const reportTextBox = await page.getByTestId('report-text').boundingBox();
    const aiSectionBox = await page.locator('section[aria-label="Trợ lý AI"]').boundingBox();
    check(
      'Bố cục tab Báo cáo: KPI chính (Chi phí, Số đơn, Chi phí/đơn) và khung xuất nằm trên phần AI',
      Boolean(topKpisBox && reportTextBox && aiSectionBox && topKpisBox.y < reportTextBox.y && reportTextBox.y < aiSectionBox.y)
    );

    const topKpisText = await page.getByTestId('report-kpi-header').innerText();
    check(
      'Tab Báo cáo hiện rõ 3 KPI quan trọng nhất cho sếp: Tổng chi phí, Số đơn hàng, Chi phí / đơn (CPA)',
      topKpisText.includes('TỔNG CHI PHÍ') && topKpisText.includes('2.970.000 đ') &&
        topKpisText.includes('SỐ ĐƠN HÀNG') && topKpisText.includes('60') &&
        topKpisText.includes('CHI PHÍ / ĐƠN (CPA)') && topKpisText.includes('49.500 đ')
    );

    // Test AI waiting Cancel button and collapsible AI details
    await page.route('**/api/ai/analyze', async (route) => {
      await new Promise((r) => setTimeout(r, 400));
      const { snapshot } = route.request().postDataJSON();
      return route.fulfill({
        json: {
          status: 'ready',
          source: 'UI test fixture',
          model: 'fixture',
          snapshotId: snapshot.meta.snapshotId,
          dataVersion: 'fixture',
          generatedAt: '2026-11-08',
          summary: 'Nhận xét kiểm thử: Chi phí 2.970.000 đ, 60 đơn, CPA 49.500 đ.',
          suggestions: [1, 2, 3].map((i) => ({
            title: 'Gợi ý tối ưu ' + i,
            evidence: 'CPA 49.500 đ, CTR 2.95%',
            limitation: 'Chưa có mục tiêu CPA trần',
            action: 'Theo dõi phân bổ ngân sách',
            verification: 'Đối chiếu CPA kỳ tới',
          })),
        },
      });
    });

    await page.getByRole('button', { name: 'Tạo nhận xét và 3 gợi ý' }).click();
    await page.waitForTimeout(100);
    const cancelAiVisible = await page.getByRole('button', { name: 'Hủy chờ' }).isVisible();
    check('Trạng thái AI đang chờ: hiện rõ nút "Hủy chờ"', cancelAiVisible);

    await page.getByTestId('ai-analysis').waitFor({ timeout: 5000 });
    const toggleAiBtn = page.getByRole('button', { name: /Mở rộng chi tiết AI|Thu gọn chi tiết AI/ });
    check('Phần AI dài được thu gọn mặc định trong tab Báo cáo và có nút "Mở rộng chi tiết AI"', (await toggleAiBtn.innerText()).includes('Mở rộng chi tiết AI'));
    await toggleAiBtn.click();
    await page.waitForTimeout(150);
    check('Bấm "Mở rộng chi tiết AI" chuyển sang "Thu gọn chi tiết AI"', (await toggleAiBtn.innerText()).includes('Thu gọn chi tiết AI'));

    // Check 5: Stale Report Banner when changing period or editing data
    await page.getByRole('button', { name: 'Tùy chọn' }).click();
    await page.locator('input[type=date]').first().fill('2026-11-02');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(AFTER_DIR, 'report-stale-1440.png'), fullPage: true });

    const staleBannerText = await page.getByTestId('stale-report-banner').innerText();
    check(
      'Báo cáo cũ sau khi đổi kỳ/dữ liệu: chỉ rõ bản đang xem thuộc kỳ nào, kỳ mới là gì và có nút Cập nhật ngay',
      staleBannerText.includes('Dữ liệu đã thay đổi sau khi tạo báo cáo') &&
        staleBannerText.includes('01/11/2026 – 05/11/2026') &&
        staleBannerText.includes('02/11/2026 – 05/11/2026')
    );

    await page.getByRole('button', { name: /Cập nhật báo cáo/ }).click();
    await page.waitForTimeout(300);
    check('Bấm "Cập nhật báo cáo" đồng bộ báo cáo sang kỳ mới', !(await page.getByTestId('stale-report-banner').isVisible()));

    // Check 6: Period Summary (`summary-ads.png` OCR & `Ảnh tổng kỳ mẫu`) synchronization across Dashboard, Analysis, and 4 Export formats
    await page.getByRole('button', { name: 'Ảnh tổng kỳ mẫu' }).click();
    await page.waitForTimeout(400);

    // Go to Overview and capture screenshot
    await page.getByRole('tab', { name: 'Tổng quan' }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(AFTER_DIR, 'summary-overview-1440.png'), fullPage: true });
    const overviewSummaryText = await page.locator('main').innerText();
    check(
      'Tổng quan (Ảnh tổng kỳ): hiển thị đúng kỳ 01/11/2026 – 07/11/2026, nguồn summary-ads.png và KPI (3.500.000 đ, 50 đơn, CPA 70.000 đ, CTR 3.00%, CPC 2.333 đ)',
      ['01/11/2026 – 07/11/2026', 'summary-ads.png', 'Chỉ có tổng kỳ', '3.500.000 đ', '50.000', '1.500', '50', '3.00%', '2.333 đ', '70.000 đ'].every((t) =>
        overviewSummaryText.includes(t)
      )
    );

    // Go to Analysis and verify explanation why there are no daily points
    await page.getByRole('tab', { name: 'Phân tích' }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(AFTER_DIR, 'summary-analysis-1440.png'), fullPage: true });
    const explanationText = await page.getByTestId('summary-only-analysis').innerText();
    check(
      'Phân tích (Ảnh tổng kỳ): giải thích rõ vì sao biểu đồ ngày không có điểm dữ liệu và không tự chia đều số giả',
      explanationText.includes('Vì sao biểu đồ theo ngày không có điểm dữ liệu?') &&
        explanationText.includes('không tự chia trung bình ra từng ngày ảo') &&
        explanationText.includes('3.500.000 đ')
    );

    // Go to Report and verify Text, PDF, HTML, PPTX all match period, source, and KPIs
    await page.getByRole('tab', { name: 'Báo cáo' }).first().click();
    await page.waitForTimeout(400);
    if (await page.getByTestId('stale-report-banner').isVisible()) {
      await page.getByRole('button', { name: /Cập nhật báo cáo/ }).click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: path.join(AFTER_DIR, 'summary-report-1440.png'), fullPage: true });

    const summaryTokens = ['01/11/2026 – 07/11/2026', 'summary-ads.png', '3.500.000 đ', '50.000', '1.500', '50', '3.00%', '2.333 đ', '70.000 đ'];

    // 6a. Text report
    const summaryReportText = await page.getByTestId('report-text').innerText();
    check(
      'Xuất Text (Ảnh tổng kỳ): khớp kỳ, nguồn và toàn bộ KPI',
      summaryTokens.every((t) => summaryReportText.includes(t))
    );

    // 6b. HTML report
    await page.getByRole('radio', { name: /HTML email/ }).click();
    const [htmlDl] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Tải HTML', exact: true }).click(),
    ]);
    const htmlPath = path.join(AFTER_DIR, 'summary-report.html');
    await htmlDl.saveAs(htmlPath);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    check(
      'Xuất HTML (Ảnh tổng kỳ): khớp kỳ, nguồn và toàn bộ KPI',
      summaryTokens.every((t) => htmlContent.includes(t))
    );

    // 6c. PPTX report
    await page.getByRole('radio', { name: /PPTX/ }).click();
    const [pptxDl] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Tải PPTX/ }).click(),
    ]);
    const pptxPath = path.join(AFTER_DIR, 'summary-report.pptx');
    await pptxDl.saveAs(pptxPath);
    const zip = new PizZip(fs.readFileSync(pptxPath));
    const slideXmls = Object.keys(zip.files)
      .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
      .sort()
      .map((f) => zip.file(f).asText())
      .join('\n');
    check(
      'Xuất PPTX (Ảnh tổng kỳ): khớp kỳ, nguồn và toàn bộ KPI, slide 3 giải thích tổng kỳ',
      summaryTokens.every((t) => slideXmls.includes(t)) && slideXmls.includes('Nguồn dữ liệu là ảnh chụp tổng kỳ')
    );

    // 6d. PDF preview modal
    await page.getByRole('radio', { name: /^PDF/ }).click();
    await page.getByRole('button', { name: 'Mở xuất PDF' }).click();
    await page.waitForTimeout(300);
    const pdfDialogText = await page.locator('body').innerText();
    check(
      'Xuất PDF (Ảnh tổng kỳ): khớp kỳ, nguồn và toàn bộ KPI',
      summaryTokens.every((t) => pdfDialogText.includes(t))
    );
    await page.getByRole('button', { name: 'Đóng hộp thoại PDF' }).click();
    await page.waitForTimeout(200);

    check('Không phát sinh lỗi runtime trên trang', pageErrors.length === 0, pageErrors.join(' | '));
    fs.writeFileSync(path.join(AFTER_DIR, 'verification-results.json'), JSON.stringify(results, null, 2), 'utf8');
    await ctx.close();
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error('VERIFY ERROR:', err);
  process.exit(1);
});
