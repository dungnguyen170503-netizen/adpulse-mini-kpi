/**
 * AdPulse Mini - Performance Marketing Intelligence Engine
 * Đề 7: Dashboard KPI Chiến Dịch Mini
 */

const STORAGE_KEY = 'adpulse_mini_kpi_state_v1';

// 3 Kịch bản dữ liệu mẫu chuẩn thực tế Marketing
const PRESET_SCENARIOS = {
  growth: {
    campaignName: 'Chiến dịch Quảng cáo Chuyển đổi Tháng 11',
    statusText: 'Đang phân phối',
    statusType: 'good',
    rows: [
      { id: 'd1', date: '01/11/2024', reach: 52000, click: 1250, spend: 2300000, orders: 17 },
      { id: 'd2', date: '02/11/2024', reach: 58000, click: 1420, spend: 2500000, orders: 19 },
      { id: 'd3', date: '03/11/2024', reach: 55000, click: 1380, spend: 2400000, orders: 18 },
      { id: 'd4', date: '04/11/2024', reach: 48000, click: 1160, spend: 2200000, orders: 16 },
      { id: 'd5', date: '05/11/2024', reach: 64000, click: 1680, spend: 3000000, orders: 26 },
      { id: 'd6', date: '06/11/2024', reach: 68000, click: 1740, spend: 3100000, orders: 24 },
      { id: 'd7', date: '07/11/2024', reach: 65000, click: 1550, spend: 3000000, orders: 22 }
    ]
  },
  burning: {
    campaignName: 'Chiến dịch Flash Sale Cuối Tuần (Cảnh báo Đốt tiền)',
    statusText: 'Cảnh báo vượt trần CPA',
    statusType: 'danger',
    rows: [
      { id: 'b1', date: '01/11/2024', reach: 50000, click: 1200, spend: 2200000, orders: 17 },
      { id: 'b2', date: '02/11/2024', reach: 54000, click: 1280, spend: 2400000, orders: 18 },
      { id: 'b3', date: '03/11/2024', reach: 52000, click: 1100, spend: 2700000, orders: 15 },
      { id: 'b4', date: '04/11/2024', reach: 49000, click: 980, spend: 3100000, orders: 13 },
      { id: 'b5', date: '05/11/2024', reach: 46000, click: 860, spend: 3600000, orders: 11 },
      { id: 'b6', date: '06/11/2024', reach: 44000, click: 790, spend: 4100000, orders: 10 },
      { id: 'b7', date: '07/11/2024', reach: 42000, click: 720, spend: 4300000, orders: 9 }
    ]
  },
  fatigue: {
    campaignName: 'Chiến dịch Thu Đông - Nhóm Banner Cũ (Bão hòa)',
    statusText: 'Cần làm mới Creative',
    statusType: 'warning',
    rows: [
      { id: 'f1', date: '01/11/2024', reach: 72000, click: 1950, spend: 2600000, orders: 23 },
      { id: 'f2', date: '02/11/2024', reach: 75000, click: 1820, spend: 2650000, orders: 21 },
      { id: 'f3', date: '03/11/2024', reach: 78000, click: 1540, spend: 2700000, orders: 18 },
      { id: 'f4', date: '04/11/2024', reach: 80000, click: 1310, spend: 2750000, orders: 16 },
      { id: 'f5', date: '05/11/2024', reach: 82000, click: 1120, spend: 2800000, orders: 14 },
      { id: 'f6', date: '06/11/2024', reach: 84000, click: 960, spend: 2850000, orders: 12 },
      { id: 'f7', date: '07/11/2024', reach: 86000, click: 840, spend: 2900000, orders: 11 }
    ]
  }
};

// Trạng thái toàn cục của ứng dụng
let appState = {
  activeTab: 'tong-quan-hieu-suat',
  activePreset: 'growth',
  chartView: 'spend-orders', // 'spend-orders' | 'reach-click' | 'cpa-cpc'
  reportTone: 'boss', // 'boss' | 'client' | 'team'
  campaignName: PRESET_SCENARIOS.growth.campaignName,
  targetMaxCPA: 150000,
  targetMinCTR: 2.0,
  monthlyBudget: 50000000,
  monthlyOrdersTarget: 400,
  aov: 800000, // Giá trị đơn hàng trung bình tạm tính doanh thu
  rows: JSON.parse(JSON.stringify(PRESET_SCENARIOS.growth.rows))
};
window.appState = appState;

// ================= TIỆN ÍCH ĐỊNH DẠNG SỐ LIỆU =================
function formatNumber(n) {
  const val = Math.round(Number(n) || 0);
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatCurrency(n) {
  return formatNumber(n) + ' ₫';
}

function formatPercent(n, decimals = 2) {
  const val = Number(n) || 0;
  return val.toFixed(decimals).replace('.', ',') + '%';
}

function parseRawNumber(str) {
  if (typeof str === 'number') return Math.max(0, str);
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

// Cộng thêm N ngày vào chuỗi DD/MM/YYYY
function addDaysToDateString(dateStr, daysToAdd) {
  const parts = String(dateStr).split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    if (!isNaN(dateObj.getTime())) {
      dateObj.setDate(dateObj.getDate() + daysToAdd);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  }
  return `0${daysToAdd}/11/2024`;
}

// ================= QUẢN LÝ LOCALSTORAGE =================
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.rows)) {
        appState = { ...appState, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Không thể đọc localStorage:', err);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activePreset: appState.activePreset,
      campaignName: appState.campaignName,
      targetMaxCPA: appState.targetMaxCPA,
      targetMinCTR: appState.targetMinCTR,
      rows: appState.rows
    }));
    flashStorageBadge();
  } catch (err) {
    console.warn('Không thể lưu localStorage:', err);
  }
}

function flashStorageBadge() {
  const badgeText = document.getElementById('storage-status-text');
  if (badgeText) {
    badgeText.textContent = 'Đã lưu localStorage vừa xong';
    setTimeout(() => {
      badgeText.textContent = 'Đã đồng bộ localStorage';
    }, 1800);
  }
}

// ================= TÍNH TOÁN CHỈ SỐ KPI & CHẨN ĐOÁN =================
function calculateMetrics() {
  const enrichedRows = appState.rows.map((r, idx) => {
    const reach = Math.max(0, Number(r.reach) || 0);
    const click = Math.max(0, Number(r.click) || 0);
    const spend = Math.max(0, Number(r.spend) || 0);
    const orders = Math.max(0, Number(r.orders) || 0);

    const ctr = reach > 0 ? (click / reach) * 100 : 0;
    const cpc = click > 0 ? spend / click : 0;
    const cpa = orders > 0 ? spend / orders : 0;
    const cr = click > 0 ? (orders / click) * 100 : 0;
    const cpm = reach > 0 ? (spend / reach) * 1000 : 0;

    return {
      ...r,
      index: idx,
      reach,
      click,
      spend,
      orders,
      ctr,
      cpc,
      cpa,
      cr,
      cpm
    };
  });

  const count = enrichedRows.length;
  const totalReach = enrichedRows.reduce((s, r) => s + r.reach, 0);
  const totalClick = enrichedRows.reduce((s, r) => s + r.click, 0);
  const totalSpend = enrichedRows.reduce((s, r) => s + r.spend, 0);
  const totalOrders = enrichedRows.reduce((s, r) => s + r.orders, 0);

  const avgCTR = totalReach > 0 ? (totalClick / totalReach) * 100 : 0;
  const avgCPC = totalClick > 0 ? totalSpend / totalClick : 0;
  const avgCPA = totalOrders > 0 ? totalSpend / totalOrders : 0;
  const avgCR = totalClick > 0 ? (totalOrders / totalClick) * 100 : 0;
  const avgCPM = totalReach > 0 ? (totalSpend / totalReach) * 1000 : 0;
  const reachToOrderRate = totalReach > 0 ? (totalOrders / totalReach) * 100 : 0;
  const avgOrdersPerDay = count > 0 ? totalOrders / count : 0;
  const avgSpendPerDay = count > 0 ? totalSpend / count : 0;

  // Tìm ngày hiệu quả nhất (CPA thấp nhất có đơn > 0) và ngày kém nhất (CPA cao nhất hoặc chi phí cao mà không có đơn)
  let bestDay = null;
  let worstDay = null;
  let highestCPCDay = null;

  enrichedRows.forEach((r) => {
    if (r.orders > 0) {
      if (!bestDay || r.cpa < bestDay.cpa || (r.cpa === bestDay.cpa && r.orders > bestDay.orders)) {
        bestDay = r;
      }
    }
    if (r.spend > 0) {
      const effectiveBurnScore = r.orders > 0 ? r.cpa : r.spend * 2;
      const currentWorstScore = worstDay ? (worstDay.orders > 0 ? worstDay.cpa : worstDay.spend * 2) : -1;
      if (effectiveBurnScore > currentWorstScore) {
        worstDay = r;
      }
    }
    if (r.click > 0) {
      if (!highestCPCDay || r.cpc > highestCPCDay.cpc) {
        highestCPCDay = r;
      }
    }
  });

  // Phân tích xu hướng Nửa đầu kỳ vs Nửa cuối kỳ
  const mid = Math.max(1, Math.floor(count / 2));
  const firstHalf = enrichedRows.slice(0, mid);
  const secondHalf = enrichedRows.slice(mid);

  const sumProp = (arr, prop) => arr.reduce((s, x) => s + x[prop], 0);

  const firstSpend = sumProp(firstHalf, 'spend') / (firstHalf.length || 1);
  const secondSpend = sumProp(secondHalf, 'spend') / (secondHalf.length || 1);
  const spendTrendPct = firstSpend > 0 ? ((secondSpend - firstSpend) / firstSpend) * 100 : 0;

  const firstOrders = sumProp(firstHalf, 'orders') / (firstHalf.length || 1);
  const secondOrders = sumProp(secondHalf, 'orders') / (secondHalf.length || 1);
  const ordersTrendPct = firstOrders > 0 ? ((secondOrders - firstOrders) / firstOrders) * 100 : 0;

  const firstTotalSpend = sumProp(firstHalf, 'spend');
  const firstTotalOrders = sumProp(firstHalf, 'orders');
  const firstCPA = firstTotalOrders > 0 ? firstTotalSpend / firstTotalOrders : 0;

  const secondTotalSpend = sumProp(secondHalf, 'spend');
  const secondTotalOrders = sumProp(secondHalf, 'orders');
  const secondCPA = secondTotalOrders > 0 ? secondTotalSpend / secondTotalOrders : 0;
  const cpaTrendPct = firstCPA > 0 ? ((secondCPA - firstCPA) / firstCPA) * 100 : 0;

  const firstReach = sumProp(firstHalf, 'reach');
  const firstClick = sumProp(firstHalf, 'click');
  const firstCTR = firstReach > 0 ? (firstClick / firstReach) * 100 : 0;

  const secondReach = sumProp(secondHalf, 'reach');
  const secondClick = sumProp(secondHalf, 'click');
  const secondCTR = secondReach > 0 ? (secondClick / secondReach) * 100 : 0;
  const ctrDiff = secondCTR - firstCTR;

  const dateRangeText = count > 0
    ? `${enrichedRows[0].date.slice(0, 5)} - ${enrichedRows[count - 1].date}`
    : 'Chưa có dữ liệu';

  return {
    rows: enrichedRows,
    count,
    totalReach,
    totalClick,
    totalSpend,
    totalOrders,
    avgCTR,
    avgCPC,
    avgCPA,
    avgCR,
    avgCPM,
    reachToOrderRate,
    avgOrdersPerDay,
    avgSpendPerDay,
    bestDay,
    worstDay,
    highestCPCDay,
    spendTrendPct,
    ordersTrendPct,
    firstCPA,
    secondCPA,
    cpaTrendPct,
    firstCTR,
    secondCTR,
    ctrDiff,
    dateRangeText
  };
}

// ================= CẬP NHẬT GIAO DIỆN CHÍNH =================
function renderAll() {
  const stats = calculateMetrics();

  // 1. Tên chiến dịch & Chu kỳ
  const headerNameEl = document.getElementById('header-campaign-name');
  const breadcrumbNameEl = document.getElementById('breadcrumb-campaign-name');
  const periodEl = document.getElementById('breadcrumb-period');
  const statusBadgeEl = document.getElementById('campaign-status-badge');

  if (headerNameEl) headerNameEl.textContent = appState.campaignName;
  if (breadcrumbNameEl) breadcrumbNameEl.textContent = appState.campaignName;
  if (periodEl) periodEl.textContent = `Chu kỳ ${stats.count} ngày (${stats.dateRangeText})`;

  if (statusBadgeEl) {
    if (stats.avgCPA > appState.targetMaxCPA && stats.totalOrders > 0) {
      statusBadgeEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5] font-label-sm text-label-sm font-semibold tracking-wide';
      statusBadgeEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>Cảnh báo CPA cao';
    } else if (stats.avgCTR < appState.targetMinCTR && stats.totalReach > 0) {
      statusBadgeEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-label-sm text-label-sm font-semibold tracking-wide';
      statusBadgeEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#D97706] animate-ping"></span>Cần tối ưu CTR';
    } else {
      statusBadgeEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-label-sm text-label-sm font-semibold tracking-wide';
      statusBadgeEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>Đang phân phối tốt';
    }
  }

  // Cập nhật trạng thái nút Preset
  updatePresetButtonsUI();

  // 2. Render 6 Thẻ KPI Tổng quan
  renderScorecards(stats);

  // 3. Render Biểu đồ Kép (Combo Chart) & Phễu Chuyển Đổi
  renderComboChart(stats);
  renderFunnel(stats);

  // 4. Render Khung Kiểm Toán AI (Nhận xét xu hướng & 03 Gợi ý cải thiện)
  renderAIDiagnostics(stats);

  // 5. Render Bảng Nhập Liệu Nhiều Dòng & Dòng Tổng Cộng
  renderDataTable(stats);

  // 6. Render Nội dung Báo Cáo Text trong Modal
  renderReportModalText(stats);

  // 7. Đồng bộ số liệu sang Tab 2 & Tab 3
  syncSecondaryTabs(stats);
}

function updatePresetButtonsUI() {
  document.querySelectorAll('[data-preset-btn]').forEach((btn) => {
    const key = btn.getAttribute('data-preset-btn');
    const isHeader = btn.getAttribute('data-preset-loc') === 'header';
    const isActive = key === appState.activePreset;

    if (isHeader) {
      if (isActive) {
        btn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#166534] text-white font-label-sm text-label-sm border border-[#22C55E]/40 shadow-sm';
        btn.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>${btn.getAttribute('data-label')}`;
      } else {
        btn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded bg-transparent hover:bg-[#334155]/50 text-[#CBD5E1] font-label-sm text-label-sm transition-colors';
        btn.innerHTML = btn.getAttribute('data-label');
      }
    } else {
      if (isActive) {
        btn.className = 'px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all hover:bg-primary-container';
      } else {
        btn.className = 'px-2.5 py-1 rounded bg-transparent hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors';
      }
    }
  });
}

function renderScorecards(stats) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Card 1: Tổng Chi Phí
  setTxt('kpi-total-spend', formatCurrency(stats.totalSpend));
  setTxt('kpi-cpm', `CPM: ${formatCurrency(stats.avgCPM)}`);
  const spendBadge = document.getElementById('kpi-spend-badge');
  if (spendBadge) {
    const sign = stats.spendTrendPct >= 0 ? '+' : '';
    spendBadge.textContent = `${sign}${stats.spendTrendPct.toFixed(1).replace('.', ',')}%`;
  }

  // Card 2: Tổng Đơn Hàng
  setTxt('kpi-total-orders', `${formatNumber(stats.totalOrders)} đơn`);
  setTxt('kpi-avg-orders', `TB: ${stats.avgOrdersPerDay.toFixed(1).replace('.', ',')} đơn/ngày`);
  const ordersBadge = document.getElementById('kpi-orders-badge');
  if (ordersBadge) {
    const sign = stats.ordersTrendPct >= 0 ? '+' : '';
    const arrow = stats.ordersTrendPct >= 0 ? '▲' : '▼';
    ordersBadge.textContent = `${sign}${stats.ordersTrendPct.toFixed(1).replace('.', ',')}% ${arrow}`;
    ordersBadge.className = stats.ordersTrendPct >= 0
      ? 'font-label-sm text-label-sm text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded'
      : 'font-label-sm text-label-sm text-[#B91C1C] font-semibold bg-[#FEE2E2] px-1.5 py-0.5 rounded';
  }

  // Card 3: Chi Phí / Đơn (CPA)
  setTxt('kpi-avg-cpa', stats.totalOrders > 0 ? formatCurrency(stats.avgCPA) : '0 ₫');
  setTxt('kpi-cpa-target', `Mục tiêu: < ${formatNumber(appState.targetMaxCPA / 1000)}k`);
  const cpaBadge = document.getElementById('kpi-cpa-badge');
  if (cpaBadge) {
    if (stats.totalOrders === 0) {
      cpaBadge.textContent = 'Chưa có đơn';
      cpaBadge.className = 'font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded';
    } else if (stats.avgCPA <= appState.targetMaxCPA) {
      const diffPct = ((stats.avgCPA - appState.targetMaxCPA) / appState.targetMaxCPA) * 100;
      cpaBadge.textContent = `${diffPct.toFixed(1).replace('.', ',')}% Tốt`;
      cpaBadge.className = 'font-label-sm text-label-sm text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded';
    } else {
      const diffPct = ((stats.avgCPA - appState.targetMaxCPA) / appState.targetMaxCPA) * 100;
      cpaBadge.textContent = `+${diffPct.toFixed(1).replace('.', ',')}% Vượt trần`;
      cpaBadge.className = 'font-label-sm text-label-sm text-[#B91C1C] font-semibold bg-[#FEE2E2] px-1.5 py-0.5 rounded';
    }
  }

  // Card 4: CTR Trung Bình
  setTxt('kpi-avg-ctr', formatPercent(stats.avgCTR));
  const reachShort = stats.totalReach >= 1000 ? `${(stats.totalReach / 1000).toFixed(0)}k` : formatNumber(stats.totalReach);
  setTxt('kpi-ctr-sub', `${formatNumber(stats.totalClick)} / ${reachShort}`);
  const ctrBadge = document.getElementById('kpi-ctr-badge');
  if (ctrBadge) {
    const sign = stats.ctrDiff >= 0 ? '+' : '';
    const arrow = stats.ctrDiff >= 0 ? '▲' : '▼';
    ctrBadge.textContent = `${sign}${stats.ctrDiff.toFixed(2).replace('.', ',')}% ${arrow}`;
    ctrBadge.className = stats.ctrDiff >= 0
      ? 'font-label-sm text-label-sm text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded'
      : 'font-label-sm text-label-sm text-[#B45309] font-semibold bg-[#FEF3C7] px-1.5 py-0.5 rounded';
  }

  // Card 5: CPC Trung Bình
  setTxt('kpi-avg-cpc', stats.totalClick > 0 ? formatCurrency(stats.avgCPC) : '0 ₫');
  setTxt('kpi-cpc-sub', `${formatNumber(Math.round(stats.avgSpendPerDay / 1000))}k / ngày`);
  const cpcBadge = document.getElementById('kpi-cpc-badge');
  if (cpcBadge) {
    if (stats.avgCPC <= 2000) {
      cpcBadge.textContent = 'Tối ưu';
      cpcBadge.className = 'font-label-sm text-label-sm text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded';
    } else if (stats.avgCPC <= 2600) {
      cpcBadge.textContent = 'Ổn định';
      cpcBadge.className = 'font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded';
    } else {
      cpcBadge.textContent = 'CPC Cao';
      cpcBadge.className = 'font-label-sm text-label-sm text-[#B91C1C] font-semibold bg-[#FEE2E2] px-1.5 py-0.5 rounded';
    }
  }

  // Card 6: Tỷ Lệ CR (Click -> Đơn)
  setTxt('kpi-avg-cr', formatPercent(stats.avgCR));
  setTxt('kpi-cr-sub', `${formatNumber(stats.totalOrders)} đơn / ${formatNumber(stats.totalClick)} clk`);
  const crBadge = document.getElementById('kpi-cr-badge');
  if (crBadge) {
    if (stats.avgCR >= 1.5) {
      crBadge.textContent = 'Tốt';
      crBadge.className = 'font-label-sm text-label-sm text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded';
    } else if (stats.avgCR >= 1.1) {
      crBadge.textContent = 'Khá';
      crBadge.className = 'font-label-sm text-label-sm text-[#006398] font-semibold bg-[#cce5ff] px-1.5 py-0.5 rounded';
    } else {
      crBadge.textContent = 'Thấp';
      crBadge.className = 'font-label-sm text-label-sm text-[#B45309] font-semibold bg-[#FEF3C7] px-1.5 py-0.5 rounded';
    }
  }
}

// ================= VẼ BIỂU ĐỒ COMBO ĐỘNG (SVG) =================
function renderComboChart(stats) {
  const rows = stats.rows;
  const svg = document.getElementById('combo-chart-svg');
  const xAxisEl = document.getElementById('combo-chart-xaxis');
  const leftAxisEl = document.getElementById('combo-chart-yaxis-left');
  const rightAxisEl = document.getElementById('combo-chart-yaxis-right');
  const tooltipEl = document.getElementById('combo-chart-tooltip');
  const titleEl = document.getElementById('chart-main-title');
  const subtitleEl = document.getElementById('chart-main-subtitle');
  const legendBarEl = document.getElementById('legend-bar-label');
  const legendLineEl = document.getElementById('legend-line-label');
  const legendNoteEl = document.getElementById('legend-axis-note');

  if (!svg || !xAxisEl) return;

  // Cập nhật trạng thái các nút Tab biểu đồ
  document.querySelectorAll('[data-chart-tab]').forEach((btn) => {
    const mode = btn.getAttribute('data-chart-tab');
    if (mode === appState.chartView) {
      btn.className = 'px-3 py-1 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-xs';
    } else {
      btn.className = 'px-3 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors';
    }
  });

  if (rows.length === 0) {
    svg.innerHTML = '<text x="350" y="110" text-anchor="middle" fill="#64748B" font-size="13">Chưa có dữ liệu ngày. Hãy bấm "+ Thêm 1 ngày" hoặc chọn Kịch bản mẫu.</text>';
    xAxisEl.innerHTML = '';
    if (tooltipEl) tooltipEl.classList.add('hidden');
    return;
  }

  // Chọn trường dữ liệu theo chế độ xem (chartView)
  let barProp = 'spend';
  let lineProp = 'orders';
  let formatLeft = (v) => `${(v / 1000000).toFixed(1)} Tr`;
  let formatRight = (v) => `${Math.round(v)} đơn`;

  if (appState.chartView === 'reach-click') {
    barProp = 'reach';
    lineProp = 'click';
    formatLeft = (v) => `${(v / 1000).toFixed(0)}k`;
    formatRight = (v) => `${Math.round(v)} clk`;
    if (titleEl) titleEl.textContent = 'Tương Quan Độ Phủ (Reach) & Lượt Nhấp (Click)';
    if (subtitleEl) subtitleEl.textContent = `Biểu đồ kép ${rows.length} ngày: Lượt tiếp cận Reach (Cột) vs Lượt Click (Đường)`;
    if (legendBarEl) legendBarEl.textContent = 'Lượt tiếp cận - Reach (Lượt)';
    if (legendLineEl) legendLineEl.textContent = 'Lượt nhấp - Click (Lượt)';
  } else if (appState.chartView === 'cpa-cpc') {
    barProp = 'cpa';
    lineProp = 'cpc';
    formatLeft = (v) => `${(v / 1000).toFixed(0)}k ₫`;
    formatRight = (v) => `${Math.round(v)} ₫`;
    if (titleEl) titleEl.textContent = 'Biến Động Chi Phí Đơn Vị (CPA & CPC)';
    if (subtitleEl) subtitleEl.textContent = `Biểu đồ kép ${rows.length} ngày: Chi phí mỗi đơn CPA (Cột) vs Chi phí mỗi Click CPC (Đường)`;
    if (legendBarEl) legendBarEl.textContent = 'Chi phí / Đơn hàng - CPA (VNĐ)';
    if (legendLineEl) legendLineEl.textContent = 'Chi phí / Click - CPC (VNĐ)';
  } else {
    if (titleEl) titleEl.textContent = 'Tương Quan Chi Phí & Đơn Hàng';
    if (subtitleEl) subtitleEl.textContent = `Biểu đồ kép ${rows.length} ngày đối soát: Chi phí (Cột) vs Số đơn phát sinh (Đường)`;
    if (legendBarEl) legendBarEl.textContent = 'Chi phí quảng cáo (VNĐ)';
    if (legendLineEl) legendLineEl.textContent = 'Số đơn hàng chuyển đổi (Đơn)';
  }

  const maxBarRaw = Math.max(...rows.map((r) => r[barProp]), 1);
  const maxLineRaw = Math.max(...rows.map((r) => r[lineProp]), 1);

  const maxBar = maxBarRaw * 1.15;
  const maxLine = maxLineRaw * 1.15;

  // Cập nhật nhãn 2 trục tung
  if (leftAxisEl) {
    leftAxisEl.innerHTML = [1, 0.75, 0.5, 0.25, 0]
      .map((ratio) => `<span>${ratio === 0 ? '0' : formatLeft(maxBar * ratio)}</span>`)
      .join('');
  }
  if (rightAxisEl) {
    rightAxisEl.innerHTML = [1, 0.75, 0.5, 0.25, 0]
      .map((ratio) => `<span>${formatRight(maxLine * ratio)}</span>`)
      .join('');
  }
  if (legendNoteEl) {
    legendNoteEl.textContent = `Trục trái: 0 - ${formatLeft(maxBar)} | Trục phải: 0 - ${formatRight(maxLine)}`;
  }

  const width = 700;
  const height = 220;
  const stepX = width / rows.length;
  const barWidth = Math.min(34, Math.max(14, stepX * 0.36));

  let gridHtml = `
    <line stroke="#E2E8F0" stroke-dasharray="3 3" stroke-width="1" x1="0" x2="700" y1="0" y2="0"></line>
    <line stroke="#E2E8F0" stroke-dasharray="3 3" stroke-width="1" x1="0" x2="700" y1="55" y2="55"></line>
    <line stroke="#E2E8F0" stroke-dasharray="3 3" stroke-width="1" x1="0" x2="700" y1="110" y2="110"></line>
    <line stroke="#E2E8F0" stroke-dasharray="3 3" stroke-width="1" x1="0" x2="700" y1="165" y2="165"></line>
    <line stroke="#CBD5E1" stroke-width="1.5" x1="0" x2="700" y1="220" y2="220"></line>
  `;

  let barsHtml = '';
  let points = [];
  let circlesHtml = '';
  const bestId = stats.bestDay ? stats.bestDay.id : null;
  const worstId = stats.worstDay ? stats.worstDay.id : null;

  let peakIndex = 0;

  rows.forEach((r, idx) => {
    const centerX = stepX * idx + stepX / 2;
    const barX = centerX - barWidth / 2;
    const barH = Math.max(2, (r[barProp] / maxBar) * height);
    const barY = height - barH;

    const isBest = r.id === bestId;
    const isOverCPA = r.cpa > appState.targetMaxCPA && r.orders > 0;

    if (isBest) peakIndex = idx;

    let barColor = '#4338CA';
    let barOpacity = '0.85';
    if (isBest) {
      barColor = '#312E81';
      barOpacity = '0.96';
    } else if (isOverCPA && appState.chartView !== 'reach-click') {
      barColor = '#DC2626';
      barOpacity = '0.80';
    }

    barsHtml += `<rect class="hover:fill-opacity-100 transition-all cursor-pointer" fill="${barColor}" fill-opacity="${barOpacity}" height="${barH.toFixed(1)}" rx="3" width="${barWidth.toFixed(1)}" x="${barX.toFixed(1)}" y="${barY.toFixed(1)}">
      <title>${r.date}: Chi phí ${formatCurrency(r.spend)} | Đơn: ${r.orders} | CPA: ${formatCurrency(r.cpa)}</title>
    </rect>`;

    const lineY = height - (r[lineProp] / maxLine) * height;
    points.push(`${centerX.toFixed(1)} ${lineY.toFixed(1)}`);

    if (isBest) {
      circlesHtml += `<circle cx="${centerX.toFixed(1)}" cy="${lineY.toFixed(1)}" fill="#0284C7" r="6" stroke="#FFFFFF" stroke-width="2.5"></circle>`;
    } else {
      circlesHtml += `<circle cx="${centerX.toFixed(1)}" cy="${lineY.toFixed(1)}" fill="#FFFFFF" r="4.5" stroke="#0284C7" stroke-width="2.5"></circle>`;
    }
  });

  const pathD = points.length > 0 ? 'M ' + points.join(' L ') : '';
  const lineHtml = pathD
    ? `<path d="${pathD}" fill="none" stroke="#0284C7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path>`
    : '';

  svg.innerHTML = gridHtml + barsHtml + lineHtml + circlesHtml;

  // Nhãn trục X
  xAxisEl.style.gridTemplateColumns = `repeat(${rows.length}, minmax(0, 1fr))`;
  xAxisEl.innerHTML = rows
    .map((r) => {
      const shortDate = r.date.slice(0, 5);
      const isBest = r.id === bestId;
      return isBest
        ? `<span class="font-bold text-primary truncate">${shortDate} ★</span>`
        : `<span class="truncate">${shortDate}</span>`;
    })
    .join('');

  // Cập nhật Tooltip Pin ở đỉnh hiệu quả nhất
  if (tooltipEl && stats.bestDay) {
    tooltipEl.classList.remove('hidden');
    const leftPct = ((peakIndex + 0.5) / rows.length) * 100;
    tooltipEl.style.left = `${Math.min(86, Math.max(14, leftPct))}%`;
    const b = stats.bestDay;
    tooltipEl.innerHTML = `
      <p class="font-caption text-caption text-slate-300 font-semibold">Ngày ${b.date.slice(0, 5)} (Hiệu quả nhất)</p>
      <div class="flex items-center gap-2 mt-0.5 font-label-sm text-label-sm">
        <span class="text-white">Chi: ${(b.spend / 1000000).toFixed(1)}M ₫</span>
        <span class="text-secondary-fixed">Đơn: ${b.orders} (CPA ${Math.round(b.cpa / 1000)}k)</span>
      </div>
    `;
  } else if (tooltipEl) {
    tooltipEl.classList.add('hidden');
  }
}

// ================= CẬP NHẬT PHỄU CHUYỂN ĐỔI (FUNNEL) =================
function renderFunnel(stats) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('funnel-period-badge', `Toàn chu kỳ ${stats.count} ngày`);
  setTxt('funnel-reach-val', formatNumber(stats.totalReach));
  setTxt('funnel-ctr-badge', `CTR ${formatPercent(stats.avgCTR)}`);
  setTxt('funnel-click-pct', formatPercent(stats.avgCTR));
  setTxt('funnel-click-val', formatNumber(stats.totalClick));
  setTxt('funnel-cr-badge', `CR ${formatPercent(stats.avgCR)}`);
  setTxt('funnel-order-rate', `${formatPercent(stats.reachToOrderRate, 3)} Reach`);
  setTxt('funnel-orders-val', `${formatNumber(stats.totalOrders)} Đơn hàng`);

  const estRev = (stats.totalOrders * appState.aov) / 1000000;
  setTxt('funnel-est-rev', `Doanh thu tạm tính ~${estRev.toFixed(1).replace('.', ',')} Tr`);
}

// ================= AI CHẨN ĐOÁN XU HƯỚNG & 03 KHUYẾN NGHỊ =================
function renderAIDiagnostics(stats) {
  if (window.AIReportEngine) {
    window.AIReportEngine.renderToUI(stats, {
      targetMaxCPA: appState.targetMaxCPA,
      targetMinCTR: appState.targetMinCTR
    });
    return;
  }
  const healthBadge = document.getElementById('ai-health-badge');
  const trendList = document.getElementById('ai-trend-list');
  const recContainer = document.getElementById('ai-recommendations-list');

  if (!trendList || !recContainer) return;

  // Đánh giá sức khỏe tổng thể
  const isCpaOver = stats.avgCPA > appState.targetMaxCPA && stats.totalOrders > 0;
  const isCtrLow = stats.avgCTR < appState.targetMinCTR && stats.totalReach > 0;

  if (healthBadge) {
    if (isCpaOver) {
      healthBadge.className = 'px-2 py-0.5 rounded bg-[#FEE2E2] text-[#B91C1C] font-caption text-caption font-semibold border border-[#FCA5A5]';
      healthBadge.textContent = 'Sức khỏe: BÁO ĐỘNG CPA';
    } else if (isCtrLow) {
      healthBadge.className = 'px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-caption text-caption font-semibold border border-[#FDE68A]';
      healthBadge.textContent = 'Sức khỏe: CẦN TỐI ƯU';
    } else {
      healthBadge.className = 'px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-caption text-caption font-semibold border border-[#86EFAC]';
      healthBadge.textContent = 'Sức khỏe: TỐT';
    }
  }

  // 1. Nhận xét xu hướng (Tăng / Giảm)
  const spendDir = stats.spendTrendPct >= 0 ? 'Tăng' : 'Giảm';
  const ordersDir = stats.ordersTrendPct >= 0 ? 'tăng' : 'giảm';
  const spendSign = stats.spendTrendPct >= 0 ? '+' : '';
  const ordersSign = stats.ordersTrendPct >= 0 ? '+' : '';

  const bestDayText = stats.bestDay
    ? `Ngày <strong>${stats.bestDay.date.slice(0, 5)}</strong> đạt hiệu quả cao nhất với <strong>${stats.bestDay.orders} đơn</strong> (CPA chỉ <strong>${formatCurrency(stats.bestDay.cpa)}</strong>).`
    : 'Chưa ghi nhận ngày phát sinh đơn hàng.';

  const warningText = stats.worstDay && stats.worstDay.cpa > appState.targetMaxCPA
    ? `<strong>Cảnh báo đốt tiền:</strong> Ngày <strong>${stats.worstDay.date.slice(0, 5)}</strong> có CPA vọt lên <strong>${formatCurrency(stats.worstDay.cpa)}</strong> (${stats.worstDay.orders} đơn), vượt ngưỡng trần ${formatCurrency(appState.targetMaxCPA)}.`
    : stats.highestCPCDay
      ? `<strong>Lưu ý:</strong> Ngày <strong>${stats.highestCPCDay.date.slice(0, 5)}</strong> có CPC cao nhất kỳ (<strong>${formatCurrency(stats.highestCPCDay.cpc)}</strong>) và CTR đạt <strong>${formatPercent(stats.highestCPCDay.ctr)}</strong>.`
      : 'Chi phí và tần suất hiển thị đang trong ngưỡng an toàn.';

  trendList.innerHTML = `
    <li class="flex items-start gap-2">
      <span class="material-symbols-outlined ${stats.ordersTrendPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'} text-[16px] shrink-0 mt-0.5">${stats.ordersTrendPct >= 0 ? 'trending_up' : 'trending_down'}</span>
      <span><strong>Chi phí &amp; Đơn:</strong> ${spendDir} <strong>${spendSign}${stats.spendTrendPct.toFixed(1).replace('.', ',')}%</strong> ở nửa cuối kỳ, đi kèm lượng đơn ${ordersDir} <strong>${ordersSign}${stats.ordersTrendPct.toFixed(1).replace('.', ',')}%</strong>.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="material-symbols-outlined ${stats.cpaTrendPct <= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'} text-[16px] shrink-0 mt-0.5">${stats.cpaTrendPct <= 0 ? 'verified' : 'error'}</span>
      <span><strong>Xu hướng CPA:</strong> Biến động từ <strong>${formatCurrency(stats.firstCPA)}</strong> sang <strong>${formatCurrency(stats.secondCPA)}</strong> ở nửa cuối chu kỳ. ${bestDayText}</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="material-symbols-outlined text-[#B45309] text-[16px] shrink-0 mt-0.5">warning</span>
      <span>${warningText}</span>
    </li>
  `;

  // 2. Sinh 03 Khuyến nghị hành động (Actionable Recommendations)
  const rec1 = stats.avgCTR < appState.targetMinCTR || stats.ctrDiff < -0.2
    ? {
        tag: 'Khẩn cấp • CTR thấp',
        text: `CTR trung bình đang ở mức <strong>${formatPercent(stats.avgCTR)}</strong> (xu hướng ${stats.ctrDiff >= 0 ? '+' : ''}${stats.ctrDiff.toFixed(2).replace('.', ',')}%). Hãy thay mới <strong>Video Hook 3 giây đầu</strong> và tắt các mẫu ảnh tĩnh có CTR dưới 1,8% để kéo CPC giảm xuống.`
      }
    : {
        tag: 'Ưu tiên cao',
        text: `Nhân bản mẫu quảng cáo của ngày <strong>${stats.bestDay ? stats.bestDay.date.slice(0, 5) : 'đỉnh điểm'}</strong> (đạt CTR <strong>${stats.bestDay ? formatPercent(stats.bestDay.ctr) : formatPercent(stats.avgCTR)}</strong>). Thay thế dần nhóm nội dung ngày ${stats.worstDay ? stats.worstDay.date.slice(0, 5) : 'cuối kỳ'} để duy trì độ tươi mới.`
      };

  const rec2 = isCpaOver
    ? {
        tag: 'Cắt lỗ ngay',
        text: `CPA trung bình (<strong>${formatCurrency(stats.avgCPA)}</strong>) đang vượt trần mục tiêu (${formatCurrency(appState.targetMaxCPA)}). Cần giảm <strong>25% ngân sách</strong> ở các nhóm quảng cáo tương tự ngày ${stats.worstDay ? stats.worstDay.date.slice(0, 5) : 'đốt tiền'} và dồn về khung giờ tối 19h–22h.`
      }
    : {
        tag: 'Scaling +20%',
        text: `CPA trung bình đạt <strong>${formatCurrency(stats.avgCPA)}</strong> (thấp hơn trần an toàn ${formatCurrency(appState.targetMaxCPA)}). Có thể tăng thêm <strong>15% – 20% ngân sách</strong> vào khung giờ vàng <strong>19h - 22h</strong> mà không làm vỡ máy học.`
      };

  const targetCR = Math.max(2.0, +(stats.avgCR + 0.45).toFixed(1));
  const extraOrders = Math.max(5, Math.round((stats.totalClick * (targetCR / 100)) - stats.totalOrders));
  const rec3 = {
    tag: `Tối ưu CR (${formatPercent(stats.avgCR)})`,
    text: `Tỷ lệ chuyển đổi Click ➔ Đơn hiện đạt <strong>${formatPercent(stats.avgCR)}</strong>. Hãy tối ưu tốc độ tải Landing Page mobile và kịch bản phản hồi tin nhắn trong 3 phút đầu để nâng CR lên <strong>${targetCR.toFixed(1).replace('.', ',')}%</strong> (giúp tăng thêm <strong>+${extraOrders} đơn</strong> trên cùng chi phí).`
  };

  recContainer.innerHTML = `
    <div class="border-l-4 border-primary bg-surface-container rounded-r-lg p-3 transition-transform hover:translate-x-1">
      <div class="flex items-center justify-between mb-1">
        <span class="font-label-sm text-label-sm font-bold text-primary">#1 • TỐI ƯU CREATIVE &amp; THU HÚT</span>
        <span class="font-caption text-caption bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant">${rec1.tag}</span>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface leading-snug">${rec1.text}</p>
    </div>
    <div class="border-l-4 border-[#0284C7] bg-surface-container rounded-r-lg p-3 transition-transform hover:translate-x-1">
      <div class="flex items-center justify-between mb-1">
        <span class="font-label-sm text-label-sm font-bold text-[#0284C7]">#2 • PHÂN BỔ NGÂN SÁCH &amp; GIÁ THẦU</span>
        <span class="font-caption text-caption bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant">${rec2.tag}</span>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface leading-snug">${rec2.text}</p>
    </div>
    <div class="border-l-4 border-[#16A34A] bg-surface-container rounded-r-lg p-3 transition-transform hover:translate-x-1">
      <div class="flex items-center justify-between mb-1">
        <span class="font-label-sm text-label-sm font-bold text-[#16A34A]">#3 • TỐI ƯU CHỐT ĐƠN &amp; LANDING PAGE</span>
        <span class="font-caption text-caption bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant">${rec3.tag}</span>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface leading-snug">${rec3.text}</p>
    </div>
  `;
}

// ================= BẢNG DỮ LIỆU CHI TIẾT THEO NGÀY (NHẬP NHIỀU DÒNG) =================
function renderDataTable(stats) {
  const tbody = document.getElementById('daily-table-body');
  const tfoot = document.getElementById('daily-table-foot');
  if (!tbody || !tfoot) return;

  const bestId = stats.bestDay ? stats.bestDay.id : null;

  if (stats.rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-on-surface-variant">
          Bảng dữ liệu đang trống. Hãy bấm nút <strong>"+ Thêm 1 ngày"</strong>, <strong>"+ Thêm nhanh 7 ngày"</strong> hoặc chọn <strong>"Nạp dữ liệu mẫu"</strong> ở trên.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = stats.rows
      .map((r, idx) => {
        const isBest = r.id === bestId;
        const isOverCPA = r.cpa > appState.targetMaxCPA && r.orders > 0;
        const rowClass = isBest
          ? 'bg-primary/5 hover:bg-primary/10 transition-colors'
          : isOverCPA
            ? 'bg-[#FEE2E2]/25 hover:bg-[#FEE2E2]/40 transition-colors'
            : 'hover:bg-surface-container-lowest/80 transition-colors';

        const cpaColorClass = isOverCPA
          ? 'text-error font-bold'
          : 'text-[#15803D] font-semibold';

        return `
          <tr class="${rowClass}" data-row-id="${r.id}">
            <td class="py-2 px-4">
              <div class="flex items-center gap-1">
                <input
                  data-field="date"
                  data-idx="${idx}"
                  class="w-28 bg-transparent border border-transparent hover:border-outline-variant/60 focus:border-primary focus:bg-white rounded px-1.5 py-0.5 ${isBest ? 'font-bold text-primary' : 'font-medium text-on-surface'}"
                  type="text"
                  value="${r.date}"
                />
                ${isBest ? '<span class="text-xs text-primary font-bold" title="Ngày hiệu quả nhất">★</span>' : ''}
              </div>
            </td>
            <td class="py-2 px-3 text-right">
              <input
                data-field="reach"
                data-idx="${idx}"
                class="w-24 text-right bg-transparent border border-transparent hover:border-outline-variant/60 focus:border-primary focus:bg-white rounded px-1.5 py-0.5 font-mono text-sm tabular-nums ${isBest ? 'font-semibold' : ''}"
                type="text"
                inputmode="numeric"
                value="${formatNumber(r.reach)}"
              />
            </td>
            <td class="py-2 px-3 text-right">
              <input
                data-field="click"
                data-idx="${idx}"
                class="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant/60 focus:border-primary focus:bg-white rounded px-1.5 py-0.5 font-mono text-sm tabular-nums ${isBest ? 'font-semibold' : ''}"
                type="text"
                inputmode="numeric"
                value="${formatNumber(r.click)}"
              />
            </td>
            <td class="py-2 px-4 text-right">
              <input
                data-field="spend"
                data-idx="${idx}"
                class="w-32 text-right bg-transparent border border-transparent hover:border-outline-variant/60 focus:border-primary focus:bg-white rounded px-1.5 py-0.5 font-mono text-sm font-semibold tabular-nums ${isBest ? 'text-primary font-bold' : ''}"
                type="text"
                inputmode="numeric"
                value="${formatNumber(r.spend)}"
              />
            </td>
            <td class="py-2 px-3 text-right">
              <input
                data-field="orders"
                data-idx="${idx}"
                class="w-16 text-right bg-transparent border border-transparent hover:border-outline-variant/60 focus:border-primary focus:bg-white rounded px-1.5 py-0.5 font-mono text-sm tabular-nums ${isBest ? 'font-bold text-primary' : ''}"
                type="text"
                inputmode="numeric"
                value="${formatNumber(r.orders)}"
              />
            </td>
            <td class="py-2 px-3 text-right font-mono text-sm tabular-nums bg-surface-container-low/50 ${isBest ? 'font-semibold text-primary' : 'text-on-surface-variant'}">${formatPercent(r.ctr)}</td>
            <td class="py-2 px-3 text-right font-mono text-sm tabular-nums bg-surface-container-low/50 ${isBest ? 'font-semibold text-primary' : 'text-on-surface-variant'}">${formatCurrency(r.cpc)}</td>
            <td class="py-2 px-4 text-right font-mono text-sm tabular-nums bg-surface-container-low/50 ${cpaColorClass}">${r.orders > 0 ? formatCurrency(r.cpa) : '0 ₫'}</td>
            <td class="py-2 px-3 text-center">
              <button data-delete-idx="${idx}" class="text-on-surface-variant hover:text-error transition-colors p-1" title="Xóa dòng" type="button">✕</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // Footer tổng cộng
  tfoot.innerHTML = `
    <tr class="bg-surface-container font-headline-sm text-headline-sm font-bold text-on-surface border-t-2 border-outline-variant/80">
      <td class="py-3 px-4 uppercase text-caption tracking-wider">TỔNG CỘNG / TRUNG BÌNH (${stats.count} NGÀY)</td>
      <td class="py-3 px-3 text-right font-mono text-sm tabular-nums font-bold">${formatNumber(stats.totalReach)}</td>
      <td class="py-3 px-3 text-right font-mono text-sm tabular-nums font-bold">${formatNumber(stats.totalClick)}</td>
      <td class="py-3 px-4 text-right font-mono text-sm tabular-nums font-bold text-primary">${formatCurrency(stats.totalSpend)}</td>
      <td class="py-3 px-3 text-right font-mono text-sm tabular-nums font-bold text-primary">${formatNumber(stats.totalOrders)} đơn</td>
      <td class="py-3 px-3 text-right font-mono text-sm tabular-nums bg-surface-container-high text-on-surface">${formatPercent(stats.avgCTR)}</td>
      <td class="py-3 px-3 text-right font-mono text-sm tabular-nums bg-surface-container-high text-on-surface">${formatCurrency(stats.avgCPC)}</td>
      <td class="py-3 px-4 text-right font-mono text-sm tabular-nums bg-surface-container-high ${stats.avgCPA > appState.targetMaxCPA ? 'text-error' : 'text-[#15803D]'} font-bold">${stats.totalOrders > 0 ? formatCurrency(stats.avgCPA) : '0 ₫'}</td>
      <td class="py-3 px-3 text-center">
        <span class="material-symbols-outlined text-[18px] text-[#15803D]">verified</span>
      </td>
    </tr>
  `;
}

// ================= XUẤT BÁO CÁO TEXT (3 PHONG CÁCH GIỌNG VĂN) =================
function renderReportModalText(stats) {
  const textarea = document.getElementById('report-text-content');
  if (!textarea) return;

  if (window.AIReportEngine) {
    document.querySelectorAll('[data-report-tone]').forEach((btn) => {
      const tone = btn.getAttribute('data-report-tone');
      const baseLabel = btn.getAttribute('data-label');
      if (tone === appState.reportTone) {
        btn.className = 'px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-xs';
        btn.textContent = `${baseLabel} (Đang chọn)`;
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors';
        btn.textContent = baseLabel;
      }
    });
    textarea.value = window.AIReportEngine.generateExportText(
      stats,
      appState.reportTone,
      appState.campaignName,
      { targetMaxCPA: appState.targetMaxCPA, targetMinCTR: appState.targetMinCTR }
    );
    return;
  }

  // Cập nhật nút chọn giọng văn
  document.querySelectorAll('[data-report-tone]').forEach((btn) => {
    const tone = btn.getAttribute('data-report-tone');
    const baseLabel = btn.getAttribute('data-label');
    if (tone === appState.reportTone) {
      btn.className = 'px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-xs';
      btn.textContent = `${baseLabel} (Đang chọn)`;
    } else {
      btn.className = 'px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors';
      btn.textContent = baseLabel;
    }
  });

  const kpiStatus = stats.avgCPA <= appState.targetMaxCPA
    ? `Đạt KPI < ${formatNumber(appState.targetMaxCPA)} VNĐ`
    : `Vượt trần KPI ${formatNumber(appState.targetMaxCPA)} VNĐ - Cần tối ưu`;

  const bestDayStr = stats.bestDay
    ? `${stats.bestDay.date.slice(0, 5)} (${stats.bestDay.orders} đơn, CPA ${formatNumber(stats.bestDay.cpa)} VNĐ)`
    : 'Chưa có';

  let text = '';

  if (appState.reportTone === 'client') {
    text = `Kính gửi Quý Khách hàng,
Đội ngũ xin gửi báo cáo tóm tắt hiệu quả "${appState.campaignName}" giai đoạn ${stats.dateRangeText} (${stats.count} ngày):

1. KẾT QUẢ CHUYỂN ĐỔI & NGÂN SÁCH:
• Ngân sách đã đầu tư: ${formatNumber(stats.totalSpend)} VNĐ
• Tổng số đơn hàng thu về: ${formatNumber(stats.totalOrders)} đơn (Trung bình ${stats.avgOrdersPerDay.toFixed(1).replace('.', ',')} đơn/ngày)
• Chi phí trên mỗi đơn hàng (CPA): ${formatNumber(stats.avgCPA)} VNĐ (${kpiStatus})

2. CHỈ SỐ PHỄU TIẾP CẬN KHÁCH HÀNG:
• Lượt tiếp cận (Reach): ${formatNumber(stats.totalReach)} người (CPM: ${formatNumber(stats.avgCPM)} VNĐ)
• Lượt nhấp quan tâm (Click): ${formatNumber(stats.totalClick)} lượt (CTR đạt ${formatPercent(stats.avgCTR)} | CPC: ${formatNumber(stats.avgCPC)} VNĐ)
• Tỷ lệ chốt đơn từ Click (CR): ${formatPercent(stats.avgCR)}

3. KẾ HOẠCH TỐI ƯU TIẾP THEO:
• Nhân rộng nhóm nội dung hiệu quả nhất vào ngày ${bestDayStr}.
• Tập trung ngân sách vào khung giờ vàng 19h-22h và tối ưu tốc độ trang đích để gia tăng số đơn hàng trong tuần tới.`;
  } else if (appState.reportTone === 'team') {
    text = `[BÁO CÁO KỸ THUẬT MEDIA BUYING] - ${appState.campaignName.toUpperCase()}
Chu kỳ đối soát: ${stats.dateRangeText} (${stats.count} ngày)

1. THÔNG SỐ PHỄU CHI TIẾT:
- Spend: ${formatNumber(stats.totalSpend)} ₫ (TB: ${formatNumber(stats.avgSpendPerDay)} ₫/ngày | CPM: ${formatNumber(stats.avgCPM)} ₫)
- Reach: ${formatNumber(stats.totalReach)} | Click: ${formatNumber(stats.totalClick)} -> CTR: ${formatPercent(stats.avgCTR)} | CPC: ${formatNumber(stats.avgCPC)} ₫
- Orders: ${formatNumber(stats.totalOrders)} đơn -> CR: ${formatPercent(stats.avgCR)} | CPA: ${formatNumber(stats.avgCPA)} ₫ (${kpiStatus})
- Biến động nửa cuối kỳ: Chi phí ${stats.spendTrendPct >= 0 ? '+' : ''}${stats.spendTrendPct.toFixed(1)}% | Đơn hàng ${stats.ordersTrendPct >= 0 ? '+' : ''}${stats.ordersTrendPct.toFixed(1)}%
- Ngày Peak: ${bestDayStr}

2. 03 ACTION ITEMS CHO TEAM ADS & CONTENT:
[1] Creative: Giữ nguyên mẫu thắng của ngày ${stats.bestDay ? stats.bestDay.date.slice(0, 5) : 'Peak'}, sản xuất thêm 2 biến thể Video Hook 3s mới.
[2] Bidding & Budget: Dịch chuyển 20% ngân sách sang khung 19h-22h, kiểm soát chặt các nhóm có CPA > ${formatNumber(appState.targetMaxCPA)} ₫.
[3] Conversion / LP: Phối hợp kiểm tra tốc độ tải trang đích và kịch bản trực page để nâng CR từ ${formatPercent(stats.avgCR)} lên > 2,0%.`;
  } else {
    // Mặc định: Gửi Sếp Tổng (Ngắn gọn, đi thẳng vào tiền & đơn)
    text = `📊 BÁO CÁO HIỆU QUẢ CHIẾN DỊCH QUẢNG CÁO (${stats.dateRangeText})
Chiến dịch: ${appState.campaignName}
• Tổng ngân sách đã chi: ${formatNumber(stats.totalSpend)} VNĐ
• Tổng số đơn hàng mang về: ${formatNumber(stats.totalOrders)} đơn (TB ${stats.avgOrdersPerDay.toFixed(1).replace('.', ',')} đơn/ngày)
• Chi phí trung bình / đơn (CPA): ${formatNumber(stats.avgCPA)} VNĐ (${kpiStatus})
• Lượt tiếp cận (Reach): ${formatNumber(stats.totalReach)} | Lượt Click: ${formatNumber(stats.totalClick)}
• Tỷ lệ nhấp (CTR): ${formatPercent(stats.avgCTR)} | CPC: ${formatNumber(stats.avgCPC)} VNĐ | Tỷ lệ chốt (CR): ${formatPercent(stats.avgCR)}

👉 Đánh giá & Đề xuất: Chiến dịch ghi nhận ngày hiệu quả nhất vào ${bestDayStr}. Đề xuất tập trung ngân sách vào nhóm nội dung có CTR cao, tối ưu kịch bản chốt đơn và duy trì CPA dưới mốc ${formatNumber(appState.targetMaxCPA)} VNĐ.`;
  }

  textarea.value = text;
}

// ================= ĐỒNG BỘ DỮ LIỆU SANG CÁC TAB PHỤ (TAB 2 & TAB 3) =================
function syncSecondaryTabs(stats) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Đồng bộ Tab 2 (Kênh Facebook & Google Ads)
  const metaSpend = Math.round(stats.totalSpend * 0.605);
  const googleSpend = stats.totalSpend - metaSpend;
  const metaOrders = Math.round(stats.totalOrders * 0.662);
  const googleOrders = Math.max(0, stats.totalOrders - metaOrders);

  setTxt('tab2-meta-spend', formatCurrency(metaSpend));
  setTxt('tab2-meta-orders', `${formatNumber(metaOrders)} đơn`);
  setTxt('tab2-meta-cpa', metaOrders > 0 ? formatCurrency(metaSpend / metaOrders) : '0 ₫');
  setTxt('tab2-google-spend', formatCurrency(googleSpend));
  setTxt('tab2-google-orders', `${formatNumber(googleOrders)} đơn`);
  setTxt('tab2-google-cpa', googleOrders > 0 ? formatCurrency(googleSpend / googleOrders) : '0 ₫');
  setTxt('tab2-footer-orders', `${formatNumber(stats.totalOrders)} đơn`);
  setTxt('tab2-footer-spend', formatCurrency(stats.totalSpend));
  setTxt('tab2-footer-cpa', stats.totalOrders > 0 ? formatCurrency(stats.avgCPA) : '0 ₫');

  // Đồng bộ Tab 3 (Cấu hình Ngân sách & KPI)
  setTxt('tab3-current-spend', `${formatNumber(stats.totalSpend)}₫`);
  setTxt('tab3-current-orders', `${formatNumber(stats.totalOrders)} đơn`);
  setTxt('tab3-current-cpa', `${formatNumber(stats.avgCPA)}₫`);
  setTxt('tab3-current-ctr', formatPercent(stats.avgCTR));
}

// ================= ĐIỀU HƯỚNG 4 TAB TRÊN THANH MENU =================
function switchTab(tabPath) {
  appState.activeTab = tabPath;

  document.querySelectorAll('[data-tab-section]').forEach((sec) => {
    if (sec.getAttribute('data-tab-section') === tabPath) {
      sec.classList.remove('hidden');
    } else {
      sec.classList.add('hidden');
    }
  });

  document.querySelectorAll('nav a[data-path]').forEach((link) => {
    if (link.getAttribute('data-path') === tabPath) {
      link.className = 'h-11 flex items-center font-label-md text-label-md text-primary font-semibold border-b-2 border-primary cursor-pointer';
    } else {
      link.className = 'h-11 flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors border-b-2 border-transparent cursor-pointer';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= CÁC THAO TÁC TRÊN BẢNG & KỊCH BẢN =================
function applyPreset(presetKey) {
  const preset = PRESET_SCENARIOS[presetKey];
  if (!preset) return;
  appState.activePreset = presetKey;
  appState.campaignName = preset.campaignName;
  appState.rows = JSON.parse(JSON.stringify(preset.rows));
  saveToStorage();
  renderAll();
  showGlobalToast(`Đã nạp kịch bản: ${preset.campaignName}`);
}

function addDays(count = 1) {
  const lastRow = appState.rows[appState.rows.length - 1];
  let baseDate = lastRow ? lastRow.date : '01/11/2024';

  for (let i = 1; i <= count; i++) {
    const nextDate = lastRow ? addDaysToDateString(baseDate, i) : addDaysToDateString('31/10/2024', i);
    appState.rows.push({
      id: 'row_' + Date.now() + '_' + i,
      date: nextDate,
      reach: 50000,
      click: 1200,
      spend: 2200000,
      orders: 18
    });
  }
  appState.activePreset = 'custom';
  saveToStorage();
  renderAll();
  showGlobalToast(`Đã thêm ${count} ngày mới vào bảng dữ liệu.`);
}

function clearAllRows() {
  if (!confirm('Bạn có chắc muốn xóa trắng toàn bộ dữ liệu các ngày trong bảng để nhập mới từ đầu?')) return;
  appState.rows = [
    { id: 'row_init_1', date: '01/11/2024', reach: 0, click: 0, spend: 0, orders: 0 }
  ];
  appState.activePreset = 'custom';
  saveToStorage();
  renderAll();
  showGlobalToast('Đã làm mới bảng dữ liệu.');
}

function promptRenameCampaign() {
  const newName = prompt('Nhập tên chiến dịch quảng cáo của bạn:', appState.campaignName);
  if (newName && newName.trim()) {
    appState.campaignName = newName.trim();
    saveToStorage();
    renderAll();
    showGlobalToast('Đã cập nhật tên chiến dịch.');
  }
}

function showGlobalToast(message) {
  let toast = document.getElementById('global-app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-app-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-sm transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span><span>${message}</span>`;
  toast.style.opacity = '1';
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2800);
}

// ================= KHỞI TẠO SỰ KIỆN KHI TRANG TẢI XONG =================
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderAll();
  switchTab(appState.activeTab || 'tong-quan-hieu-suat');

  // 1. Sự kiện chuyển Tab trên thanh điều hướng
  document.querySelectorAll('nav a[data-path]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.getAttribute('data-path'));
    });
  });

  // 2. Sự kiện bấm nút Nạp kịch bản mẫu
  document.querySelectorAll('[data-preset-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyPreset(btn.getAttribute('data-preset-btn'));
    });
  });

  // 3. Sự kiện chuyển Tab góc nhìn biểu đồ
  document.querySelectorAll('[data-chart-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.chartView = btn.getAttribute('data-chart-tab');
      renderAll();
    });
  });

  // 4. Sự kiện các nút trên thanh công cụ Bảng dữ liệu
  const btnAdd1 = document.getElementById('btn-add-1-day');
  const btnAdd7 = document.getElementById('btn-add-7-days');
  const btnClear = document.getElementById('btn-clear-table');
  const btnEditCampaign = document.getElementById('btn-edit-campaign-name');

  if (btnAdd1) btnAdd1.addEventListener('click', () => addDays(1));
  if (btnAdd7) btnAdd7.addEventListener('click', () => addDays(7));
  if (btnClear) btnClear.addEventListener('click', clearAllRows);
  if (btnEditCampaign) btnEditCampaign.addEventListener('click', promptRenameCampaign);

  // 5. Sự kiện nhập liệu trực tiếp và xóa dòng trong Bảng (Event Delegation)
  const tbody = document.getElementById('daily-table-body');
  if (tbody) {
    tbody.addEventListener('change', (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT') {
        const idx = parseInt(target.getAttribute('data-idx'), 10);
        const field = target.getAttribute('data-field');
        if (!isNaN(idx) && appState.rows[idx] && field) {
          if (field === 'date') {
            appState.rows[idx].date = target.value.trim() || appState.rows[idx].date;
          } else {
            appState.rows[idx][field] = parseRawNumber(target.value);
          }
          appState.activePreset = 'custom';
          saveToStorage();
          renderAll();
        }
      }
    });

    tbody.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-delete-idx]');
      if (delBtn) {
        const idx = parseInt(delBtn.getAttribute('data-delete-idx'), 10);
        if (!isNaN(idx)) {
          appState.rows.splice(idx, 1);
          appState.activePreset = 'custom';
          saveToStorage();
          renderAll();
        }
      }
    });
  }

  // 6. Sự kiện mở/đóng Popup Xuất Báo Cáo & Chọn giọng văn
  document.querySelectorAll('[data-open-report-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('report-modal');
      if (modal) modal.classList.remove('hidden');
    });
  });

  document.querySelectorAll('[data-report-tone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.reportTone = btn.getAttribute('data-report-tone');
      renderReportModalText(calculateMetrics());
    });
  });
});

// Hàm Copy Báo Cáo vào Clipboard
window.copyReportToClipboard = function () {
  const textarea = document.getElementById('report-text-content');
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">done_all</span><span>Đã chép thành công!</span>';
      btn.classList.add('bg-[#15803D]');
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-[#15803D]');
      }, 2200);
    }
    showGlobalToast('Đã sao chép báo cáo vào Clipboard!');
  });
};
