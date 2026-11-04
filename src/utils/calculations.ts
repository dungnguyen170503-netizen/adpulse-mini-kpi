import { CampaignRecord, CalculatedCampaignRecord, AggregatedMetrics, MetricComparison } from '../types/campaign';

/**
 * Tính các chỉ số cho 1 bản ghi ngày
 */
export function calculateRecordMetrics(record: CampaignRecord): CalculatedCampaignRecord {
  const reach = Math.max(0, record.reach || 0);
  const click = Math.max(0, record.click || 0);
  const spend = Math.max(0, record.spend || 0);
  const orders = Math.max(0, record.orders || 0);

  // CTR = (Click / Reach) * 100
  const ctr = reach > 0 ? (click / reach) * 100 : 0;

  // CPC = Chi phí / Click
  const cpc = click > 0 ? spend / click : 0;

  // Chi phí trên mỗi đơn hàng (CPA) = Chi phí / Số đơn hàng
  const cpa = orders > 0 ? spend / orders : 0;

  // CVR (Conversion Rate) = (Đơn hàng / Click) * 100
  const cvr = click > 0 ? (orders / click) * 100 : 0;

  return {
    ...record,
    reach,
    click,
    spend,
    orders,
    ctr,
    cpc,
    cpa,
    cvr,
  };
}

/**
 * Tổng hợp toàn bộ chỉ số cho danh sách các ngày
 */
export function calculateAggregates(records: CampaignRecord[]): AggregatedMetrics {
  if (!records || records.length === 0) {
    return {
      totalSpend: 0,
      totalReach: 0,
      totalClick: 0,
      totalOrders: 0,
      avgCtr: 0,
      avgCpc: 0,
      avgCpa: 0,
      avgCvr: 0,
      daysCount: 0,
    };
  }

  // Sắp xếp theo ngày tăng dần
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  let totalSpend = 0;
  let totalReach = 0;
  let totalClick = 0;
  let totalOrders = 0;

  for (const r of sorted) {
    totalSpend += Number(r.spend || 0);
    totalReach += Number(r.reach || 0);
    totalClick += Number(r.click || 0);
    totalOrders += Number(r.orders || 0);
  }

  // Blended (chỉ số bình quân gia quyền theo tổng chi tiêu/lượt tương tác thực)
  const avgCtr = totalReach > 0 ? (totalClick / totalReach) * 100 : 0;
  const avgCpc = totalClick > 0 ? totalSpend / totalClick : 0;
  const avgCpa = totalOrders > 0 ? totalSpend / totalOrders : 0;
  const avgCvr = totalClick > 0 ? (totalOrders / totalClick) * 100 : 0;

  // So sánh chu kỳ (nếu có từ 2 ngày trở lên: nửa đầu vs nửa sau)
  let comparison: MetricComparison | undefined;
  if (sorted.length >= 2) {
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid);
    const secondHalf = sorted.slice(mid);

    const sum1 = aggregateSublist(firstHalf);
    const sum2 = aggregateSublist(secondHalf);

    comparison = {
      spendChangePct: calculatePctChange(sum1.spend, sum2.spend),
      reachChangePct: calculatePctChange(sum1.reach, sum2.reach),
      clickChangePct: calculatePctChange(sum1.click, sum2.click),
      ordersChangePct: calculatePctChange(sum1.orders, sum2.orders),
      ctrChangePct: calculatePctChange(sum1.ctr, sum2.ctr),
      cpcChangePct: calculatePctChange(sum1.cpc, sum2.cpc),
      cpaChangePct: calculatePctChange(sum1.cpa, sum2.cpa),
    };
  }

  return {
    totalSpend,
    totalReach,
    totalClick,
    totalOrders,
    avgCtr,
    avgCpc,
    avgCpa,
    avgCvr,
    daysCount: sorted.length,
    comparison,
  };
}

function aggregateSublist(list: CampaignRecord[]) {
  const spend = list.reduce((acc, c) => acc + (c.spend || 0), 0);
  const reach = list.reduce((acc, c) => acc + (c.reach || 0), 0);
  const click = list.reduce((acc, c) => acc + (c.click || 0), 0);
  const orders = list.reduce((acc, c) => acc + (c.orders || 0), 0);

  const ctr = reach > 0 ? (click / reach) * 100 : 0;
  const cpc = click > 0 ? spend / click : 0;
  const cpa = orders > 0 ? spend / orders : 0;

  return { spend, reach, click, orders, ctr, cpc, cpa };
}

export function calculatePctChange(oldVal: number, newVal: number): number {
  if (oldVal === 0) {
    return newVal > 0 ? 100 : 0;
  }
  return ((newVal - oldVal) / oldVal) * 100;
}
