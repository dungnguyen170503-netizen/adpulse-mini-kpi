import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePeriodAggregates } from '../src/utils/kpiEngine';
import { DATASET_1_NORMAL, DATASET_2_DIRTY, DATASET_3_EDGE, SAMPLE_PERIOD_SUMMARY } from '../src/data/sampleData';
import { buildTextReport } from '../src/report/textReport';
import { buildHtmlReport } from '../src/report/htmlReport';
import { buildDailySeries, buildSnapshotFromSummary, dataVersionOf, sourceLabelOf } from '../src/report/reportModel';
import { canonicalSnapshot, requestSchema, analysisSchema } from '../server/ai';
import { normalizeNumber, normalizeDate, applyColumnMapping } from '../src/utils/fileParser';
import { validateRow } from '../src/utils/validation';

test('Ô trống giữ ở bản nháp, không tự chuyển thành 0 hay ngày hôm nay', () => {
  assert.ok(Number.isNaN(normalizeNumber('')));
  assert.equal(normalizeNumber('0'), 0);
  assert.equal(normalizeNumber('300.000 đ'), 300000);
  assert.equal(normalizeDate(''), '');
  const rows = applyColumnMapping([{ date: '2026-11-01', spend: '', reach: '0', clicks: '0', orders: '0' }], { date: 'date', spend: 'spend', reach: 'reach', clicks: 'clicks', orders: 'orders' });
  assert.equal(validateRow(rows[0]).isValid, false);
  assert.equal(validateRow({ ...rows[0], spend: 0 }).isValid, true);
  assert.equal(validateRow({ ...rows[0], spend: 0, date: '2026-02-30' }).isValid, false);
});

for (const [i, rows, expected] of [[1, DATASET_1_NORMAL, [2970000, 2.95, 2034, 49500]], [2, DATASET_2_DIRTY, [950000, 13.36, 646, 55882]], [3, DATASET_3_EDGE, [650000, .77, 6500, 216667]]] as const) {
  test(`Bộ ${i}: snapshot, server và báo cáo cùng KPI`, () => {
    const s = calculatePeriodAggregates([...rows]);
    assert.deepEqual([s.totals.spend, s.kpis.ctr.value, s.kpis.cpc.value, s.kpis.cpa.value], expected);
    assert.deepEqual(canonicalSnapshot(s).kpis, s.kpis);
    assert.ok(buildTextReport(s, dataVersionOf(s)).includes(s.kpis.ctr.formatted));
    assert.ok(buildHtmlReport(s, dataVersionOf(s)).includes(s.kpis.cpa.formatted));
  });
}
test('Chia 0 khác 0%; ngày trùng không tăng totalDays', () => {
  const s = calculatePeriodAggregates(DATASET_3_EDGE);
  assert.equal(s.meta.totalDays, 3);
  for (const row of s.dailyRecords) for (const metric of Object.values(row.kpis)) if (metric.value === null) assert.notEqual(metric.formatted, '0.00%');
  assert.equal(s.dataIntegrity.missingFieldsCount, 0);
});
test('Ngày thiếu ở biên kỳ vẫn để trống', () => {
  const s = calculatePeriodAggregates(DATASET_1_NORMAL);
  s.meta.periodStart = '2026-10-31';
  assert.equal(buildDailySeries(s).points[0].reach, null);
});
test('Server bỏ qua KPI giả và không nhận số null/âm', () => {
  const s = calculatePeriodAggregates(DATASET_1_NORMAL);
  s.kpis.ctr.value = 999;
  assert.equal(canonicalSnapshot(s).kpis.ctr.value, 2.95);
  for (const value of [null, -1, '']) {
    const bad = structuredClone(s); (bad.dailyRecords[0] as any).spend = value;
    assert.equal(requestSchema.safeParse({ snapshot: bad }).success, false);
  }
});
test('Đúng 3 gợi ý; HTML escape nội dung AI và Text cùng snapshot', () => {
  const s = calculatePeriodAggregates(DATASET_1_NORMAL);
  const suggestion = { title: 'Kiểm tra', evidence: 'CTR 2.95%', limitation: 'Chưa có mục tiêu', action: 'Đối chiếu', verification: 'So kỳ sau' };
  assert.equal(analysisSchema.safeParse({ summary: 'test', suggestions: [suggestion] }).success, false);
  s.ai = { status: 'ready', source: 'Test fixture', model: 'fixture', generatedAt: '2026-11-08', snapshotId: s.meta.snapshotId, dataVersion: dataVersionOf(s), summary: '<script>alert(1)</script>', suggestions: [suggestion, suggestion, suggestion] };
  assert.ok(buildTextReport(s, '1').includes(s.ai.summary));
  const html = buildHtmlReport(s, '1'); assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
});
test('Tổng kỳ từ ảnh OCR: không tạo bản ghi ngày giả, đồng bộ kỳ, nguồn và KPI giữa Dashboard, Server, Text, HTML', () => {
  const s = buildSnapshotFromSummary(SAMPLE_PERIOD_SUMMARY);
  assert.equal(s.dailyRecords.length, 0);
  assert.equal(s.meta.totalDays, 0);
  assert.equal(s.meta.periodStart, '2026-11-01');
  assert.equal(s.meta.periodEnd, '2026-11-07');
  assert.equal(sourceLabelOf(s), 'Ảnh chụp tổng kỳ OCR (summary-ads.png)');
  assert.deepEqual([s.totals.spend, s.totals.reachSum, s.totals.clicks, s.totals.orders], [3500000, 50000, 1500, 50]);
  assert.deepEqual([s.kpis.ctr.formatted, s.kpis.cpc.formatted, s.kpis.cpa.formatted], ['3.00%', '2.333 đ', '70.000 đ']);
  assert.equal(buildDailySeries(s).points.length, 0);
  assert.equal(requestSchema.safeParse({ snapshot: s }).success, true);
  assert.deepEqual(canonicalSnapshot(s).kpis, s.kpis);
  const text = buildTextReport(s, dataVersionOf(s));
  const html = buildHtmlReport(s, dataVersionOf(s));
  for (const token of ['01/11/2026 – 07/11/2026', 'Ảnh chụp tổng kỳ OCR', '3.500.000 đ', '50', '70.000 đ', '3.00%', '2.333 đ', 'Chỉ có tổng kỳ']) {
    assert.ok(text.includes(token), `Text report missing ${token}`);
    assert.ok(html.includes(token), `HTML report missing ${token}`);
  }
});
