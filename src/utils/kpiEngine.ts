/**
 * CORE KPI CALCULATION ENGINE - MODULE K1
 * Single Source of Truth (SSOT) adhering to C1 Contract
 */

import {
  DailyAdRecord,
  CalculatedKPIs,
  CalculatedDailyRecord,
  CampaignReportSnapshot,
  MetricValue
} from '../types/campaign';

/**
 * Định dạng tiền tệ VNĐ
 */
export function formatVND(val: number | null | undefined, fallback = '—'): string {
  if (val === null || val === undefined || isNaN(val)) return fallback;
  return `${Math.round(val).toLocaleString('vi-VN')} đ`;
}

/**
 * Định dạng phần trăm
 */
export function formatPercent(val: number | null | undefined, fallback = '—'): string {
  if (val === null || val === undefined || isNaN(val)) return fallback;
  return `${val.toFixed(2)}%`;
}

/**
 * Tính toán chỉ số KPI cho 1 dòng dữ liệu ngày
 */
export function calculateDailyMetrics(record: DailyAdRecord): CalculatedKPIs {
  const spend = Number(record.spend) || 0;
  const reach = Number(record.reach) || 0;
  const clicks = Number(record.clicks) || 0;
  const orders = Number(record.orders) || 0;

  // 1. CTR = (Clicks / Reach) * 100
  let ctr: MetricValue<number>;
  if (reach <= 0) {
    ctr = {
      value: null,
      formatted: '—',
      status: 'zero_division',
      warningMessage: 'Reach = 0, chưa có cơ sở tính CTR'
    };
  } else {
    const rawCtr = (clicks / reach) * 100;
    ctr = {
      value: Number(rawCtr.toFixed(2)),
      formatted: `${rawCtr.toFixed(2)}%`,
      status: rawCtr > 100 ? 'out_of_bounds' : 'valid',
      warningMessage: rawCtr > 100 ? 'Clicks lớn hơn Reach (bất thường)' : undefined
    };
  }

  // 2. CPC = Spend / Clicks
  let cpc: MetricValue<number>;
  if (clicks <= 0) {
    if (spend > 0) {
      cpc = {
        value: null,
        formatted: 'N/A (0 click)',
        status: 'zero_division',
        warningMessage: 'Đã chi tiền nhưng 0 lượt click (không thể chia cho 0)'
      };
    } else {
      cpc = {
        value: null,
        formatted: '—',
        status: 'zero_division'
      };
    }
  } else {
    const rawCpc = Math.round(spend / clicks);
    cpc = {
      value: rawCpc,
      formatted: `${rawCpc.toLocaleString('vi-VN')} đ`,
      status: 'valid'
    };
  }

  // 3. CPA = Spend / Orders (Chi phí trên mỗi đơn hàng)
  let cpa: MetricValue<number>;
  if (orders <= 0) {
    if (spend > 0) {
      cpa = {
        value: null,
        formatted: 'N/A (Chưa có đơn)',
        status: 'zero_division',
        warningMessage: 'Đã chi tiền nhưng chưa phát sinh đơn hàng'
      };
    } else {
      cpa = {
        value: null,
        formatted: '—',
        status: 'zero_division'
      };
    }
  } else {
    const rawCpa = Math.round(spend / orders);
    cpa = {
      value: rawCpa,
      formatted: `${rawCpa.toLocaleString('vi-VN')} đ`,
      status: 'valid'
    };
  }

  // 4. CVR = (Orders / Clicks) * 100
  let cvr: MetricValue<number>;
  if (clicks <= 0) {
    cvr = {
      value: null,
      formatted: '—',
      status: 'zero_division'
    };
  } else {
    const rawCvr = (orders / clicks) * 100;
    cvr = {
      value: Number(rawCvr.toFixed(2)),
      formatted: `${rawCvr.toFixed(2)}%`,
      status: 'valid'
    };
  }

  const missing = (...values: unknown[]) => values.some(v => typeof v !== 'number' || !Number.isFinite(v));
  const unavailable: MetricValue<number> = { value: null, formatted: '—', status: 'missing_data', warningMessage: 'Thiếu hoặc sai số liệu; cần sửa trước khi lưu' };
  if (missing(record.reach, record.clicks)) ctr = { ...unavailable };
  if (missing(record.spend, record.clicks)) cpc = { ...unavailable };
  if (missing(record.spend, record.orders)) cpa = { ...unavailable };
  if (missing(record.orders, record.clicks)) cvr = { ...unavailable };
  return { ctr, cpc, cpa, cvr };
}

/**
 * Gắn kết quả tính toán KPI vào từng bản ghi ngày
 */
export function enrichRecordsWithKPIs(records: DailyAdRecord[]): CalculatedDailyRecord[] {
  return records.map(record => ({
    ...record,
    kpis: calculateDailyMetrics(record)
  }));
}

/**
 * Tổng hợp toàn kỳ và tạo CampaignReportSnapshot (SSOT)
 */
export function calculatePeriodAggregates(records: DailyAdRecord[]): CampaignReportSnapshot {
  const enrichedRecords = enrichRecordsWithKPIs(records);

  // Sắp xếp theo ngày tăng dần
  const sorted = [...enrichedRecords].sort((a, b) => a.date.localeCompare(b.date));

  let totalSpend = 0;
  let totalReach = 0;
  let totalClicks = 0;
  let totalOrders = 0;

  let zeroDivisionCount = 0;
  let missingFieldsCount = 0;
  const warnings: string[] = [];

  const dateCounts: Record<string, number> = {};

  for (const r of sorted) {
    totalSpend += Number(r.spend || 0);
    totalReach += Number(r.reach || 0);
    totalClicks += Number(r.clicks || 0);
    totalOrders += Number(r.orders || 0);

    if (r.kpis.cpc.status === 'zero_division' || r.kpis.cpa.status === 'zero_division') {
      zeroDivisionCount++;
    }

    if ([r.reach, r.clicks, r.spend, r.orders].some(v => v == null)) {
      missingFieldsCount++;
    }

    dateCounts[r.date] = (dateCounts[r.date] || 0) + 1;
  }

  let duplicateDatesResolved = 0;
  for (const date in dateCounts) {
    if (dateCounts[date] > 1) {
      warnings.push(`Phát hiện ngày trùng lặp: ${date} (${dateCounts[date]} dòng)`);
      duplicateDatesResolved += (dateCounts[date] - 1);
    }
  }

  // Blended Aggregated KPIs (Tính trên tổng chia tổng - Bắt buộc)
  // CTR = (Tổng Clicks / Tổng Reach) * 100
  let periodCtr: MetricValue<number>;
  if (totalReach <= 0) {
    periodCtr = {
      value: null,
      formatted: '—',
      status: 'zero_division',
      warningMessage: 'Tổng Reach = 0'
    };
  } else {
    const rawCtr = (totalClicks / totalReach) * 100;
    periodCtr = {
      value: Number(rawCtr.toFixed(2)),
      formatted: `${rawCtr.toFixed(2)}%`,
      status: 'valid'
    };
  }

  // CPC = Tổng Spend / Tổng Clicks
  let periodCpc: MetricValue<number>;
  if (totalClicks <= 0) {
    periodCpc = {
      value: null,
      formatted: totalSpend > 0 ? 'N/A (0 click)' : '—',
      status: 'zero_division',
      warningMessage: totalSpend > 0 ? 'Chiến dịch chưa phát sinh lượt click' : undefined
    };
  } else {
    const rawCpc = Math.round(totalSpend / totalClicks);
    periodCpc = {
      value: rawCpc,
      formatted: `${rawCpc.toLocaleString('vi-VN')} đ`,
      status: 'valid'
    };
  }

  // CPA = Tổng Spend / Tổng Orders
  let periodCpa: MetricValue<number>;
  if (totalOrders <= 0) {
    periodCpa = {
      value: null,
      formatted: totalSpend > 0 ? 'N/A (Chưa có đơn)' : '—',
      status: 'zero_division',
      warningMessage: totalSpend > 0 ? 'Chiến dịch chưa phát sinh đơn hàng' : undefined
    };
  } else {
    const rawCpa = Math.round(totalSpend / totalOrders);
    periodCpa = {
      value: rawCpa,
      formatted: `${rawCpa.toLocaleString('vi-VN')} đ`,
      status: 'valid'
    };
  }

  // CVR = (Tổng Orders / Tổng Clicks) * 100
  let periodCvr: MetricValue<number>;
  if (totalClicks <= 0) {
    periodCvr = {
      value: null,
      formatted: '—',
      status: 'zero_division'
    };
  } else {
    const rawCvr = (totalOrders / totalClicks) * 100;
    periodCvr = {
      value: Number(rawCvr.toFixed(2)),
      formatted: `${rawCvr.toFixed(2)}%`,
      status: 'valid'
    };
  }

  const periodStart = sorted.length > 0 ? sorted[0].date : '';
  const periodEnd = sorted.length > 0 ? sorted[sorted.length - 1].date : '';

  return {
    meta: {
      snapshotId: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      generatedAt: new Date().toISOString(),
      periodStart,
      periodEnd,
      totalDays: new Set(sorted.map(r => r.date)).size,
      currency: 'VND',
      campaignName: 'Chiến dịch Facebook Ads',
      hasDailyBreakdown: sorted.length > 0
    },
    totals: {
      spend: totalSpend,
      reachSum: totalReach,
      clicks: totalClicks,
      orders: totalOrders
    },
    kpis: {
      ctr: periodCtr,
      cpc: periodCpc,
      cpa: periodCpa,
      cvr: periodCvr
    },
    dailyRecords: sorted,
    dataIntegrity: {
      isClean: warnings.length === 0 && zeroDivisionCount === 0,
      missingFieldsCount,
      zeroDivisionCount,
      duplicateDatesResolved,
      warnings
    }
  };
}
