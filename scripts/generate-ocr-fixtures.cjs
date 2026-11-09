const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = path.join(__dirname, '../docs/evidence/fixtures');
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // 1. Daily Ads 1 (Clean Meta Ads UI with clean row spacing)
  const page1 = await browser.newPage();
  await page1.setContent(`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; background: #ffffff; width: 750px; color: #1e293b;">
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 20px;">Meta Ads Manager - Daily Breakdown Report</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 16px;">
        <thead>
          <tr style="border-bottom: 2px solid #cbd5e1; text-align: right; color: #475569;">
            <th style="padding: 12px 16px; text-align: left;">Date</th>
            <th style="padding: 12px 16px;">Spend</th>
            <th style="padding: 12px 16px;">Reach</th>
            <th style="padding: 12px 16px;">Clicks</th>
            <th style="padding: 12px 16px;">Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9; text-align: right;">
            <td style="padding: 14px 16px; text-align: left; font-weight: 500;">2026-11-01</td>
            <td style="padding: 14px 16px;">300000</td>
            <td style="padding: 14px 16px;">6000</td>
            <td style="padding: 14px 16px;">180</td>
            <td style="padding: 14px 16px;">6</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; text-align: right;">
            <td style="padding: 14px 16px; text-align: left; font-weight: 500;">2026-11-02</td>
            <td style="padding: 14px 16px;">450000</td>
            <td style="padding: 14px 16px;">9000</td>
            <td style="padding: 14px 16px;">270</td>
            <td style="padding: 14px 16px;">9</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; text-align: right;">
            <td style="padding: 14px 16px; text-align: left; font-weight: 500;">2026-11-03</td>
            <td style="padding: 14px 16px;">600000</td>
            <td style="padding: 14px 16px;">12000</td>
            <td style="padding: 14px 16px;">360</td>
            <td style="padding: 14px 16px;">12</td>
          </tr>
        </tbody>
      </table>
    </div>
  `);
  const buf1 = await page1.screenshot({ type: 'png' });
  fs.writeFileSync(path.join(dir, 'daily-ads-1.png'), buf1);
  fs.writeFileSync(path.join(dir, 'daily-ads-1-renamed.png'), buf1);
  await page1.close();

  // 2. Daily Ads 2 (Different numbers)
  const page2 = await browser.newPage();
  await page2.setContent(`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; background: #ffffff; width: 750px; color: #1e293b;">
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 20px;">Meta Ads Manager - Campaign Flash Sale</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 16px;">
        <thead>
          <tr style="border-bottom: 2px solid #cbd5e1; text-align: right; color: #475569;">
            <th style="padding: 12px 16px; text-align: left;">Date</th>
            <th style="padding: 12px 16px;">Spend</th>
            <th style="padding: 12px 16px;">Reach</th>
            <th style="padding: 12px 16px;">Clicks</th>
            <th style="padding: 12px 16px;">Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9; text-align: right;">
            <td style="padding: 14px 16px; text-align: left; font-weight: 500;">2026-11-04</td>
            <td style="padding: 14px 16px;">700000</td>
            <td style="padding: 14px 16px;">14000</td>
            <td style="padding: 14px 16px;">420</td>
            <td style="padding: 14px 16px;">14</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; text-align: right;">
            <td style="padding: 14px 16px; text-align: left; font-weight: 500;">2026-11-05</td>
            <td style="padding: 14px 16px;">850000</td>
            <td style="padding: 14px 16px;">17000</td>
            <td style="padding: 14px 16px;">510</td>
            <td style="padding: 14px 16px;">18</td>
          </tr>
        </tbody>
      </table>
    </div>
  `);
  const buf2 = await page2.screenshot({ type: 'png' });
  fs.writeFileSync(path.join(dir, 'daily-ads-2.png'), buf2);
  await page2.close();

  // 3. Period Summary Ads (Ảnh chỉ có tổng kỳ)
  const page3 = await browser.newPage();
  await page3.setContent(`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; background: #ffffff; width: 650px; color: #1e293b;">
      <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1d4ed8; font-size: 20px;">Meta Ads Overview - Period Summary</h2>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #64748b;">Period: 2026-11-01 to 2026-11-07</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 13px; color: #64748b; font-weight: 500;">Total Spend</div>
          <div style="font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px;">3500000 VND</div>
        </div>
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 13px; color: #64748b; font-weight: 500;">Total Reach</div>
          <div style="font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px;">50000</div>
        </div>
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 13px; color: #64748b; font-weight: 500;">Total Clicks</div>
          <div style="font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px;">1500</div>
        </div>
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 13px; color: #64748b; font-weight: 500;">Total Orders</div>
          <div style="font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px;">50</div>
        </div>
      </div>
    </div>
  `);
  const buf3 = await page3.screenshot({ type: 'png' });
  fs.writeFileSync(path.join(dir, 'summary-ads.png'), buf3);
  await page3.close();

  // 4. Blurry Ads
  const page4 = await browser.newPage();
  await page4.setContent(`
    <div style="font-family: Arial, sans-serif; padding: 24px; background: #ffffff; width: 600px; filter: blur(4px) opacity(50%);">
      <h3>Facebook Ads Report</h3>
      <p>Date: 2026-11-06</p>
      <p>Spend: 9999 Reach: ??? Clicks: ??? Orders: 2</p>
    </div>
  `);
  const buf4 = await page4.screenshot({ type: 'png' });
  fs.writeFileSync(path.join(dir, 'blurry-ads.png'), buf4);
  await page4.close();

  await browser.close();
  console.log('Regenerated fixtures with realistic Meta Ads style.');
}

main().catch(console.error);
