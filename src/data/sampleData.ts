/**
 * REFERENCE TEST DATASETS (Adhering to C1 Contract & Math Verification)
 */

import { DailyAdRecord, PeriodSummaryRecord } from '../types/campaign';

/**
 * BỘ 1: DỮ LIỆU CHUẨN MỰC (5 ngày E-Commerce sạch)
 * Tổng tính tay: Spend 2,970,000 đ | Reach 49,500 | Clicks 1,460 | Orders 60
 * KPI toàn kỳ kỳ vọng: CTR 2.95% | CPC 2,034 đ | CPA 49,500 đ | CVR 4.11%
 */
export const DATASET_1_NORMAL: DailyAdRecord[] = [
  {
    id: 'b1_d1',
    date: '2026-11-01',
    campaign_name: 'Chiến dịch Thu Đông 2026',
    spend: 300000,
    reach: 5000,
    clicks: 150,
    orders: 6,
    source_type: 'manual',
    status: 'valid',
    notes: 'Khởi động ngày đầu'
  },
  {
    id: 'b1_d2',
    date: '2026-11-02',
    campaign_name: 'Chiến dịch Thu Đông 2026',
    spend: 450000,
    reach: 7500,
    clicks: 210,
    orders: 9,
    source_type: 'manual',
    status: 'valid',
    notes: 'Tăng nhẹ ngân sách'
  },
  {
    id: 'b1_d3',
    date: '2026-11-03',
    campaign_name: 'Chiến dịch Thu Đông 2026',
    spend: 600000,
    reach: 10000,
    clicks: 320,
    orders: 12,
    source_type: 'manual',
    status: 'valid',
    notes: 'Target tệp lookalike 2%'
  },
  {
    id: 'b1_d4',
    date: '2026-11-04',
    campaign_name: 'Chiến dịch Thu Đông 2026',
    spend: 720000,
    reach: 12000,
    clicks: 360,
    orders: 15,
    source_type: 'manual',
    status: 'valid',
    notes: 'Bổ sung video creative'
  },
  {
    id: 'b1_d5',
    date: '2026-11-05',
    campaign_name: 'Chiến dịch Thu Đông 2026',
    spend: 900000,
    reach: 15000,
    clicks: 420,
    orders: 18,
    source_type: 'manual',
    status: 'valid',
    notes: 'Scale up ngày cuối tuần'
  }
];

/**
 * BỘ 2: THIẾU / BẤT THƯỜNG (Dirty & Partial Data)
 */
export const DATASET_2_DIRTY: DailyAdRecord[] = [
  {
    id: 'b2_d1',
    date: '2026-11-01',
    campaign_name: 'Chiến dịch Test Dirty',
    spend: 250000,
    reach: 0, // Thiếu Reach
    clicks: 80,
    orders: 4,
    source_type: 'manual',
    status: 'warning',
    notes: 'Quên nhập Reach (sẽ hiển thị CTR N/A nhưng CPC/CPA vẫn tính chuẩn)'
  },
  {
    id: 'b2_d2',
    date: '2026-11-02',
    campaign_name: 'Chiến dịch Test Dirty',
    spend: 300000,
    reach: 6000,
    clicks: 120,
    orders: 5,
    source_type: 'manual',
    status: 'valid',
    notes: 'Bản ghi chuẩn'
  },
  {
    id: 'b2_d3',
    date: '2026-11-03',
    campaign_name: 'Chiến dịch Test Dirty',
    spend: 100000,
    reach: 4000,
    clicks: 70,
    orders: 2,
    source_type: 'manual',
    status: 'valid',
    notes: 'Ngân sách nhỏ'
  },
  {
    id: 'b2_d4',
    date: '2026-11-04',
    campaign_name: 'Chiến dịch Test Dirty',
    spend: 300000,
    reach: 1000,
    clicks: 1200, // Clicks > Reach
    orders: 6,
    source_type: 'manual',
    status: 'warning',
    notes: 'Clicks > Reach (Cảnh báo nhầm cột Impressions)'
  }
];

/**
 * BỘ 3: TRƯỜNG HỢP BIÊN (Edge Cases, Mẫu số 0, Ngày trùng)
 */
export const DATASET_3_EDGE: DailyAdRecord[] = [
  {
    id: 'b3_d1',
    date: '2026-11-01',
    campaign_name: 'Chiến dịch Edge Cases',
    spend: 400000,
    reach: 8000,
    clicks: 0, // 0 Clicks
    orders: 0, // 0 Orders
    source_type: 'manual',
    status: 'warning',
    notes: 'Đốt 400k ngân sách nhưng 0 click, 0 đơn (Mẫu số 0 -> N/A)'
  },
  {
    id: 'b3_d2',
    date: '2026-11-02',
    campaign_name: 'Chiến dịch Edge Cases',
    spend: 0,
    reach: 0,
    clicks: 0,
    orders: 0,
    source_type: 'manual',
    status: 'valid',
    notes: 'Ngày tạm dừng chiến dịch (toàn bộ = 0)'
  },
  {
    id: 'b3_d3_a',
    date: '2026-11-03',
    campaign_name: 'Chiến dịch Edge Cases',
    spend: 150000,
    reach: 3000,
    clicks: 60,
    orders: 2,
    source_type: 'manual',
    status: 'valid',
    notes: 'Ad Set A ngày 03/11 (Trùng ngày)'
  },
  {
    id: 'b3_d3_b',
    date: '2026-11-03',
    campaign_name: 'Chiến dịch Edge Cases',
    spend: 100000,
    reach: 2000,
    clicks: 40,
    orders: 1,
    source_type: 'manual',
    status: 'valid',
    notes: 'Ad Set B ngày 03/11 (Trùng ngày -> Thử nút Gộp)'
  }
];

/**
 * Dữ liệu mặc định 10 ngày cho người dùng trải nghiệm ngay
 */
export const DEFAULT_CAMPAIGN_DATA: DailyAdRecord[] = [
  { id: 'def_1', date: '2026-10-27', campaign_name: 'Flash Sale Tháng 11', spend: 280000, reach: 4500, clicks: 135, orders: 5, source_type: 'manual', status: 'valid', notes: 'Khởi động A/B test hình ảnh' },
  { id: 'def_2', date: '2026-10-28', campaign_name: 'Flash Sale Tháng 11', spend: 320000, reach: 5200, clicks: 160, orders: 7, source_type: 'manual', status: 'valid', notes: 'Tập trung tệp khách hàng tiềm năng' },
  { id: 'def_3', date: '2026-10-29', campaign_name: 'Flash Sale Tháng 11', spend: 400000, reach: 6800, clicks: 210, orders: 8, source_type: 'manual', status: 'valid', notes: 'CTR tăng mạnh sau khi đổi hook tiêu đề' },
  { id: 'def_4', date: '2026-10-30', campaign_name: 'Flash Sale Tháng 11', spend: 450000, reach: 7500, clicks: 245, orders: 11, source_type: 'manual', status: 'valid', notes: 'Điều chỉnh đấu thầu chi phí thấp nhất' },
  { id: 'def_5', date: '2026-10-31', campaign_name: 'Flash Sale Tháng 11', spend: 550000, reach: 8900, clicks: 310, orders: 14, source_type: 'manual', status: 'valid', notes: 'Đỉnh điểm cuối tháng, chuyển đổi cao' },
  { id: 'def_6', date: '2026-11-01', campaign_name: 'Flash Sale Tháng 11', spend: 600000, reach: 9800, clicks: 330, orders: 15, source_type: 'manual', status: 'valid', notes: 'Bắt đầu ngày đầu tháng mới' },
  { id: 'def_7', date: '2026-11-02', campaign_name: 'Flash Sale Tháng 11', spend: 700000, reach: 11200, clicks: 390, orders: 18, source_type: 'manual', status: 'valid', notes: 'Mở rộng vị trí hiển thị Reels & Story' },
  { id: 'def_8', date: '2026-11-03', campaign_name: 'Flash Sale Tháng 11', spend: 750000, reach: 12000, clicks: 420, orders: 19, source_type: 'manual', status: 'valid', notes: 'Hiệu quả ổn định' },
  { id: 'def_9', date: '2026-11-04', campaign_name: 'Flash Sale Tháng 11', spend: 850000, reach: 13500, clicks: 460, orders: 20, source_type: 'manual', status: 'valid', notes: 'Bắt đầu có dấu hiệu bão hòa tệp' },
  { id: 'def_10', date: '2026-11-05', campaign_name: 'Flash Sale Tháng 11', spend: 900000, reach: 14200, clicks: 480, orders: 22, source_type: 'manual', status: 'valid', notes: 'Scale ngân sách thành công' }
];

/**
 * MẪU ẢNH TỔNG KỲ (Period Summary OCR Fixture theo chuẩn bàn giao của Dũng)
 * Kỳ: 01/11/2026 – 07/11/2026 | Spend: 3.500.000 đ | Reach: 50.000 | Clicks: 1.500 | Orders: 50
 * KPI kỳ vọng: CTR 3.00% | CPC 2.333 đ | CPA 70.000 đ | CVR 3.33%
 */
export const SAMPLE_PERIOD_SUMMARY: PeriodSummaryRecord = {
  id: 'summary_1731067200000_sample',
  period_start: '2026-11-01',
  period_end: '2026-11-07',
  total_spend: 3500000,
  total_reach: 50000,
  total_clicks: 1500,
  total_orders: 50,
  is_aggregate_only: true,
  imageFileName: 'summary-ads.png',
  notes: 'Trích xuất OCR Meta Ads Overview (Độ tin cậy: 91%)'
};
