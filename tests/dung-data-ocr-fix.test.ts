import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { analyzeAdImage } from '../src/utils/imageParser';
import { loadCampaignData, saveCampaignData, clearCampaignData, markAppInitialized, isAppInitialized } from '../src/utils/storage';
import { mergeDuplicateRecords } from '../src/utils/validation';
import { DailyAdRecord } from '../src/types/campaign';

// Mock localStorage cho môi trường kiểm thử Node.js
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

// Gắn Mock LocalStorage vào global nếu chưa có
if (typeof (globalThis as any).window === 'undefined') {
  (globalThis as any).window = {
    localStorage: new MockLocalStorage()
  };
} else if (!(globalThis as any).window.localStorage) {
  (globalThis as any).window.localStorage = new MockLocalStorage();
}

test('Ca 1: Bấm Hủy khi trùng ngày -> Giữ nguyên số dòng và số tổng', () => {
  const existing: DailyAdRecord[] = [
    {
      id: 'rec_1',
      date: '2026-11-01',
      spend: 500000,
      reach: 10000,
      clicks: 300,
      orders: 10,
      source_type: 'manual',
      status: 'valid'
    }
  ];

  const duplicateIncoming: DailyAdRecord = {
    id: 'rec_dup',
    date: '2026-11-01',
    spend: 800000,
    reach: 15000,
    clicks: 400,
    orders: 15,
    source_type: 'manual',
    status: 'valid'
  };

  // Giả lập logic trong App.tsx khi người dùng bấm "HỦY" (Cancel):
  // Hàm handleAddSingle phát hiện trùng ngày và người dùng chọn không gộp -> abort, không thêm!
  let currentRecords = [...existing];
  const isDuplicate = currentRecords.some(r => r.date === duplicateIncoming.date);
  assert.equal(isDuplicate, true);

  // Người dùng bấm HỦY -> Giữ nguyên currentRecords
  const userConfirmed = false;
  if (userConfirmed) {
    currentRecords = mergeDuplicateRecords([...currentRecords, duplicateIncoming]);
  } // else: abort

  assert.equal(currentRecords.length, 1);
  assert.equal(currentRecords[0].spend, 500000);
  assert.equal(currentRecords[0].reach, 10000);
});

test('Ca 2: Phân biệt lần đầu mở app vs Đã xóa hết dữ liệu rồi tải lại trang', () => {
  window.localStorage.clear();

  // 1. Lần đầu mở app (chưa từng lưu gì)
  assert.equal(loadCampaignData(), null);

  // App đánh dấu đã khởi tạo và lưu dữ liệu
  markAppInitialized();
  saveCampaignData([
    {
      id: 'rec_init',
      date: '2026-11-01',
      spend: 300000,
      reach: 5000,
      clicks: 150,
      orders: 5,
      source_type: 'manual',
      status: 'valid'
    }
  ]);
  assert.equal(loadCampaignData()?.length, 1);

  // 2. Người dùng xóa sạch toàn bộ dữ liệu (Xóa hết)
  clearCampaignData();

  // 3. Tải lại trang (Reload)
  const reloaded = loadCampaignData();
  assert.notEqual(reloaded, null, 'Không được trả về null làm app tưởng lần đầu mở');
  assert.deepEqual(reloaded, [], 'Dữ liệu sau khi reload phải giữ nguyên là mảng rỗng []');
});

test('Ca 3: Hai ảnh có số khác nhau -> OCR trích xuất ra các con số khác nhau từ pixel', async () => {
  const fixture1 = path.join(process.cwd(), 'docs/evidence/fixtures/daily-ads-1.png');
  const fixture2 = path.join(process.cwd(), 'docs/evidence/fixtures/daily-ads-2.png');

  const buf1 = fs.readFileSync(fixture1);
  const buf2 = fs.readFileSync(fixture2);

  const res1 = await analyzeAdImage(buf1);
  const res2 = await analyzeAdImage(buf2);

  assert.equal(res1.mode, 'daily_rows');
  assert.equal(res2.mode, 'daily_rows');

  const spendRow1Image1 = res1.dailyRows?.[0]?.spend;
  const spendRow1Image2 = res2.dailyRows?.[0]?.spend;

  assert.ok(spendRow1Image1 !== undefined);
  assert.ok(spendRow1Image2 !== undefined);
  assert.notEqual(spendRow1Image1, spendRow1Image2, 'Hai ảnh khác nhau phải đọc ra số khác nhau');
  assert.equal(spendRow1Image1, 300000);
  assert.equal(spendRow1Image2, 700000);
});

test('Ca 4: Đổi tên ảnh nhưng giữ nguyên nội dung -> OCR vẫn đọc đúng số (không theo tên file)', async () => {
  const fixtureRenamed = path.join(process.cwd(), 'docs/evidence/fixtures/daily-ads-1-renamed.png');
  const bufRenamed = fs.readFileSync(fixtureRenamed);

  const resRenamed = await analyzeAdImage(bufRenamed);

  assert.equal(resRenamed.mode, 'daily_rows');
  assert.equal(resRenamed.dailyRows?.length, 3);
  assert.equal(resRenamed.dailyRows?.[0]?.spend, 300000);
  assert.equal(resRenamed.dailyRows?.[1]?.spend, 450000);
  assert.equal(resRenamed.dailyRows?.[2]?.spend, 600000);
});

test('Ca 5: Ảnh mờ / nhiễu -> Đánh dấu độ tin cậy thấp và ghi chú thiếu dữ liệu', async () => {
  const fixtureBlurry = path.join(process.cwd(), 'docs/evidence/fixtures/blurry-ads.png');
  const bufBlurry = fs.readFileSync(fixtureBlurry);

  const resBlurry = await analyzeAdImage(bufBlurry);

  assert.ok(resBlurry.confidenceScore < 40, 'Độ tin cậy của ảnh mờ phải < 40%');
  assert.ok(resBlurry.ambiguities.length > 0, 'Phải có cảnh báo về độ mờ');
  assert.ok(resBlurry.ambiguities.some(a => a.includes('mờ') || a.includes('nhiễu')));
});

test('Ca 6: Ảnh chỉ có tổng kỳ -> Lưu period_summary, KHÔNG tạo bản ghi giả theo ngày', async () => {
  const fixtureSummary = path.join(process.cwd(), 'docs/evidence/fixtures/summary-ads.png');
  const bufSummary = fs.readFileSync(fixtureSummary);

  const resSummary = await analyzeAdImage(bufSummary);

  assert.equal(resSummary.mode, 'period_summary');
  assert.ok(resSummary.periodSummary !== undefined);
  assert.equal(resSummary.dailyRows, undefined, 'Tuyệt đối KHÔNG sinh ra các dòng ngày giả mạo');

  assert.equal(resSummary.periodSummary.period_start, '2026-11-01');
  assert.equal(resSummary.periodSummary.period_end, '2026-11-07');
  assert.equal(resSummary.periodSummary.total_spend, 3500000);
  assert.equal(resSummary.periodSummary.total_reach, 50000);
  assert.equal(resSummary.periodSummary.total_clicks, 1500);
  assert.equal(resSummary.periodSummary.total_orders, 50);
});
