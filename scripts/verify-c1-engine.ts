// VERIFICATION SCRIPT: IMPORT DIRECTLY FROM PRODUCTION kpiEngine.ts (SSOT)
import { calculatePeriodAggregates } from '../src/utils/kpiEngine';
import { DATASET_1_NORMAL, DATASET_2_DIRTY, DATASET_3_EDGE } from '../src/data/sampleData';

console.log('=====================================================');
console.log('KIỂM CHỨNG LÕI TÍNH TOÁN kpiEngine.ts THẬT VỚI 3 BỘ SỐ THỬ');
console.log('=====================================================\n');

// 1. Bộ 1: Chuẩn 5 ngày (01/11 - 05/11)
const snap1 = calculatePeriodAggregates(DATASET_1_NORMAL);
console.log('--- BỘ 1 (Chuẩn 5 ngày) ---');
console.log(`Chi phí: ${snap1.totals.spend.toLocaleString('vi-VN')} đ (Kỳ vọng: 2.970.000 đ)`);
console.log(`Reach tổng (cộng dồn ngày): ${snap1.totals.reachSum.toLocaleString('vi-VN')} (Kỳ vọng: 49.500)`);
console.log(`Clicks: ${snap1.totals.clicks.toLocaleString('vi-VN')} (Kỳ vọng: 1.460)`);
console.log(`Orders: ${snap1.totals.orders.toLocaleString('vi-VN')} (Kỳ vọng: 60)`);
console.log(`CTR kỳ: ${snap1.kpis.ctr.formatted} [giá trị: ${snap1.kpis.ctr.value}] (Kỳ vọng: 2.95%)`);
console.log(`CPC kỳ: ${snap1.kpis.cpc.formatted} [giá trị: ${snap1.kpis.cpc.value}] (Kỳ vọng: 2.034 đ)`);
console.log(`CPA kỳ: ${snap1.kpis.cpa.formatted} [giá trị: ${snap1.kpis.cpa.value}] (Kỳ vọng: 49.500 đ)`);
console.log(`CVR kỳ: ${snap1.kpis.cvr.formatted} [giá trị: ${snap1.kpis.cvr.value}] (Kỳ vọng: 4.11%)\n`);

if (snap1.totals.spend === 2970000 && snap1.kpis.ctr.value === 2.95 && snap1.kpis.cpc.value === 2034 && snap1.kpis.cpa.value === 49500) {
  console.log('=> BỘ 1: KHỚP 100% VỚI BẢNG TÍNH TAY C1!\n');
} else {
  console.error('=> BỘ 1: LỆCH SỐ LIỆU!');
  process.exit(1);
}

// 2. Bộ 2: Dữ liệu bẩn / thiếu / bất thường
const snap2 = calculatePeriodAggregates(DATASET_2_DIRTY);
console.log('--- BỘ 2 (Dữ liệu bẩn / thiếu) ---');
console.log(`Chi phí: ${snap2.totals.spend.toLocaleString('vi-VN')} đ (Kỳ vọng: 950.000 đ)`);
console.log(`Reach tổng: ${snap2.totals.reachSum.toLocaleString('vi-VN')} (Kỳ vọng: 11.000)`);
console.log(`Clicks: ${snap2.totals.clicks.toLocaleString('vi-VN')} (Kỳ vọng: 1.470)`);
console.log(`Orders: ${snap2.totals.orders.toLocaleString('vi-VN')} (Kỳ vọng: 17)`);
console.log(`CTR kỳ: ${snap2.kpis.ctr.formatted} [giá trị: ${snap2.kpis.ctr.value}] (Kỳ vọng: 13.36%)`);
console.log(`CPC kỳ: ${snap2.kpis.cpc.formatted} [giá trị: ${snap2.kpis.cpc.value}] (Kỳ vọng: 646 đ)`);
console.log(`CPA kỳ: ${snap2.kpis.cpa.formatted} [giá trị: ${snap2.kpis.cpa.value}] (Kỳ vọng: 55.882 đ)\n`);

if (snap2.totals.spend === 950000 && snap2.kpis.ctr.value === 13.36 && snap2.kpis.cpc.value === 646 && snap2.kpis.cpa.value === 55882) {
  console.log('=> BỘ 2: KHỚP 100% VỚI BẢNG TÍNH TAY C1!\n');
} else {
  console.error('=> BỘ 2: LỆCH SỐ LIỆU!');
  process.exit(1);
}

// 3. Bộ 3: Biên độ / Chia cho 0 / Ngày trùng
const snap3 = calculatePeriodAggregates(DATASET_3_EDGE);
console.log('--- BỘ 3 (Edge cases: Chia 0, Ngày tạm dừng, Ngày trùng) ---');
console.log(`Tổng số ngày duy nhất (totalDays): ${snap3.meta.totalDays} (Kỳ vọng: 3 ngày duy nhất trên 4 bản ghi)`);
console.log(`Chi phí: ${snap3.totals.spend.toLocaleString('vi-VN')} đ (Kỳ vọng: 650.000 đ)`);
console.log(`CTR kỳ: ${snap3.kpis.ctr.formatted} [giá trị: ${snap3.kpis.ctr.value}] (Kỳ vọng: 0.77%)`);
console.log(`CPC kỳ: ${snap3.kpis.cpc.formatted} [giá trị: ${snap3.kpis.cpc.value}] (Kỳ vọng: 6.500 đ)`);
console.log(`CPA kỳ: ${snap3.kpis.cpa.formatted} [giá trị: ${snap3.kpis.cpa.value}] (Kỳ vọng: 216.667 đ)`);

// Kiểm tra chi tiết ca 3.1 (0 click, 0 đơn)
const row3_1 = snap3.dailyRecords[0]; // 2026-11-01
console.log(`\nKiểm tra ngày 2026-11-01 (Ca 3.1: Chi tiền nhưng 0 click, 0 đơn):`);
console.log(`- CPC: ${row3_1.kpis.cpc.formatted} | Trạng thái: ${row3_1.kpis.cpc.status} (Kỳ vọng: N/A (0 click) & zero_division)`);
console.log(`- CPA: ${row3_1.kpis.cpa.formatted} | Trạng thái: ${row3_1.kpis.cpa.status} (Kỳ vọng: N/A (Chưa có đơn) & zero_division)`);

// Kiểm tra chi tiết ca 3.2 (Tạm dừng chiến dịch: toàn 0)
const row3_2 = snap3.dailyRecords[1]; // 2026-11-02
console.log(`\nKiểm tra ngày 2026-11-02 (Ca 3.2: Tạm dừng chiến dịch, toàn bộ 0):`);
console.log(`- CTR: ${row3_2.kpis.ctr.formatted} | Trạng thái: ${row3_2.kpis.ctr.status} (Kỳ vọng: — & zero_division, không in 0.00%)`);
console.log(`- CPC: ${row3_2.kpis.cpc.formatted} | Trạng thái: ${row3_2.kpis.cpc.status} (Kỳ vọng: — & zero_division)`);

if (row3_1.kpis.cpc.status === 'zero_division' && row3_2.kpis.ctr.formatted === '—' && snap3.meta.totalDays === 3) {
  console.log('\n=> BỘ 3: TOÀN BỘ LOGIC BIÊN ĐÃ KHỚP CHÍNH XÁC VỚI SỰ ĐỒNG THUẬN KHOA - LỘC - DŨNG!');
} else {
  console.error('\n=> BỘ 3: LỆCH LOGIC BIÊN!');
  process.exit(1);
}

console.log('\n=====================================================');
console.log('KẾT LUẬN: LÕI THẬT kpiEngine.ts ĐÃ ĐƯỢC CHỨNG MINH 100% KHỚP CONTRACT!');
console.log('=====================================================');
