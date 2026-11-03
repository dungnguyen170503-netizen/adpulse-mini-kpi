/**
 * ==============================================================================
 * ADPULSE MINI - PERFORMANCE MARKETING INTELLIGENCE ENGINE
 * Đề 7: Dashboard KPI Chiến Dịch Quảng Cáo Mini (Vibe Coding)
 * ==============================================================================
 */

const STORAGE_KEY = 'adpulse_mini_kpi_state_v2';

// 3 Kịch bản dữ liệu mẫu chuẩn thực tế Marketing
const PRESET_SCENARIOS = {
  growth: {
    campaignName: 'Chiến dịch Chuyển đổi Tháng 11 (Tăng trưởng tốt)',
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
    campaignName: 'Chiến dịch Thu Đông - Banner Cũ (Bão hòa Creative)',
    statusText: 'Cần làm mới Creative',
    statusType: 'warning',
    rows: [
      { id: 'f1', date: '01/11/2024', reach: 60000, click: 1400, spend: 2500000, orders: 16 },
      { id: 'f2', date: '02/11/2024', reach: 58000, click: 1250, spend: 2500000, orders: 15 },
      { id: 'f3', date: '03/11/2024', reach: 56000, click: 1050, spend: 2600000, orders: 13 },
      { id: 'f4', date: '04/11/2024', reach: 54000, click: 920, spend: 2700000, orders: 11 },
      { id: 'f5', date: '05/11/2024', reach: 52000, click: 780, spend: 2800000, orders: 10 },
      { id: 'f6', date: '06/11/2024', reach: 50000, click: 690, spend: 2900000, orders: 8 },
      { id: 'f7', date: '07/11/2024', reach: 48000, click: 590, spend: 3000000, orders: 7 }
    ]
  }
};

// Trạng thái ứng dụng toàn cục
let appState = {
  activePreset: 'growth',
  chartView: 'spend-orders', // 'spend-orders' | 'reach-click' | 'cpa-cpc'
  reportTone: 'boss', // 'boss' | 'client' | 'team'
  campaignName: PRESET_SCENARIOS.growth.campaignName,
  targetMaxCPA: 150000,
  targetMinCTR: 2.0,
  rows: JSON.parse(JSON.stringify(PRESET_SCENARIOS.growth.rows))
};

window.appState = appState;

// Tiện ích format
function formatNumber(n) {
  const val = Math.round(Number(n) || 0);
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatCurrency(n) {
  return formatNumber(n) + ' đ';
}

function formatPercent(n, decimals = 2) {
  const val = Number(n) || 0;
  return val.toFixed(decimals).replace('.', ',') + '%';
}

// ================= QUẢN LÝ LOCALSTORAGE =================
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.rows) && parsed.rows.length > 0) {
      appState.rows = parsed.rows;
      if (parsed.activePreset) appState.activePreset = parsed.activePreset;
      if (parsed.campaignName) appState.campaignName = parsed.campaignName;
      return true;
    }
  } catch (err) {
    console.warn('Không thể đọc localStorage:', err);
  }
  return false;
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      rows: appState.rows,
      activePreset: appState.activePreset,
      campaignName: appState.campaignName
    }));
    notifyStorageSynced();
  } catch (err) {
    console.warn('Không thể lưu localStorage:', err);
  }
}

function notifyStorageSynced() {
  const badgeText = document.getElementById('storage-status-text');
  if (badgeText) {
    badgeText.textContent = 'Đã lưu LocalStorage vừa xong';
    setTimeout(() => {
      badgeText.textContent = 'Đã lưu LocalStorage';
    }, 1500);
  }
}

// ================= TÍNH TOÁN CÁC CHỈ SỐ QUẢNG CÁO =================
function calculateMetrics() {
  const rows = appState.rows || [];
  const count = rows.length;

  if (count === 0) {
    return {
      count: 0,
      totalSpend: 0,
      totalReach: 0,
      totalClick: 0,
      totalOrders: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgCPA: 0,
      avgCR: 0,
      avgCPM: 0,
      dateRangeText: 'Chưa có ngày',
      rowsWithMetrics: []
    };
  }

  let totalSpend = 0;
  let totalReach = 0;
  let totalClick = 0;
  let totalOrders = 0;

  const rowsWithMetrics = rows.map((r) => {
    const reach = Number(r.reach) || 0;
    const click = Number(r.click) || 0;
    const spend = Number(r.spend) || 0;
    const orders = Number(r.orders) || 0;

    totalSpend += spend;
    totalReach += reach;
    totalClick += click;
    totalOrders += orders;

    const ctr = reach > 0 ? (click / reach) * 100 : 0;
    const cpc = click > 0 ? spend / click : 0;
    const cpa = orders > 0 ? spend / orders : 0;
    const cr = click > 0 ? (orders / click) * 100 : 0;

    return {
      ...r,
      reach,
      click,
      spend,
      orders,
      ctr,
      cpc,
      cpa,
      cr
    };
  });

  const avgCTR = totalReach > 0 ? (totalClick / totalReach) * 100 : 0;
  const avgCPC = totalClick > 0 ? totalSpend / totalClick : 0;
  const avgCPA = totalOrders > 0 ? totalSpend / totalOrders : 0;
  const avgCR = totalClick > 0 ? (totalOrders / totalClick) * 100 : 0;
  const avgCPM = totalReach > 0 ? (totalSpend / totalReach) * 1000 : 0;

  // Tính xu hướng so sánh nửa đầu chu kỳ vs nửa cuối chu kỳ
  const mid = Math.floor(count / 2);
  const firstHalf = rowsWithMetrics.slice(0, mid || 1);
  const secondHalf = rowsWithMetrics.slice(mid);

  const firstSpend = firstHalf.reduce((s, r) => s + r.spend, 0);
  const secondSpend = secondHalf.reduce((s, r) => s + r.spend, 0);
  const firstOrders = firstHalf.reduce((s, r) => s + r.orders, 0);
  const secondOrders = secondHalf.reduce((s, r) => s + r.orders, 0);

  const firstCPA = firstOrders > 0 ? firstSpend / firstOrders : 0;
  const secondCPA = secondOrders > 0 ? secondSpend / secondOrders : 0;

  const spendTrendPct = firstSpend > 0 ? ((secondSpend - firstSpend) / firstSpend) * 100 : 0;
  const ordersTrendPct = firstOrders > 0 ? ((secondOrders - firstOrders) / firstOrders) * 100 : 0;
  const cpaTrendPct = firstCPA > 0 ? ((secondCPA - firstCPA) / firstCPA) * 100 : 0;

  // Tìm ngày đỉnh (Peak) và ngày tệ nhất (Worst Day)
  const sortedByOrders = [...rowsWithMetrics].filter(r => r.orders > 0).sort((a, b) => b.orders - a.orders);
  const bestDay = sortedByOrders.length > 0 ? sortedByOrders[0] : null;

  const sortedByCpa = [...rowsWithMetrics].filter(r => r.orders > 0).sort((a, b) => b.cpa - a.cpa);
  const worstDay = sortedByCpa.length > 0 ? sortedByCpa[0] : null;

  const highestCPCDay = [...rowsWithMetrics].sort((a, b) => b.cpc - a.cpc)[0] || null;

  const dateRangeText = count === 1
    ? rows[0].date
    : `${rows[0].date} - ${rows[count - 1].date}`;

  return {
    count,
    totalSpend,
    totalReach,
    totalClick,
    totalOrders,
    avgCTR,
    avgCPC,
    avgCPA,
    avgCR,
    avgCPM,
    avgSpendPerDay: count > 0 ? totalSpend / count : 0,
    avgOrdersPerDay: count > 0 ? totalOrders / count : 0,
    spendTrendPct,
    ordersTrendPct,
    cpaTrendPct,
    firstCPA,
    secondCPA,
    bestDay,
    worstDay,
    highestCPCDay,
    dateRangeText,
    rows: rowsWithMetrics,
    campaignName: appState.campaignName
  };
}

// ================= RENDER TOÀN BỘ DASHBOARD =================
function renderDashboard() {
  const stats = calculateMetrics();

  // 1. Cập nhật Tiêu đề chiến dịch & Chu kỳ
  const headerNameEl = document.getElementById('header-campaign-name');
  const breadcrumbPeriodEl = document.getElementById('breadcrumb-period');
  const statusBadgeEl = document.getElementById('campaign-status-badge');

  if (headerNameEl) headerNameEl.textContent = appState.campaignName;
  if (breadcrumbPeriodEl) breadcrumbPeriodEl.textContent = `Chu kỳ ${stats.count} ngày (${stats.dateRangeText})`;

  if (statusBadgeEl) {
    if (stats.avgCPA > appState.targetMaxCPA && stats.totalOrders > 0) {
      statusBadgeEl.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200';
      statusBadgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>Cảnh báo Vượt trần CPA';
    } else if (stats.avgCTR < appState.targetMinCTR && stats.totalReach > 0) {
      statusBadgeEl.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200';
      statusBadgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Cần làm mới Creative';
    } else {
      statusBadgeEl.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200';
      statusBadgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>Đang phân phối';
    }
  }

  // 2. Cập nhật 4 Thẻ KPI (Scorecards)
  renderScorecards(stats);

  // 3. Render Biểu đồ Combo SVG & Phễu Chuyển Đổi
  renderComboChart(stats);
  renderFunnel(stats);

  // 4. Render Khung Kiểm Toán AI (Bạn C)
  if (window.AIReportEngine) {
    window.AIReportEngine.renderToUI(stats, {
      targetMaxCPA: appState.targetMaxCPA,
      targetMinCTR: appState.targetMinCTR
    });
  }

  // 5. Render Bảng Nhập Liệu
  renderDataTable(stats);

  // 6. Cập nhật nút kịch bản đang chọn
  updatePresetButtonsUI();
}

// Cập nhật giao diện 4 thẻ KPI
function renderScorecards(stats) {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('stat-total-spend', formatCurrency(stats.totalSpend));
  setEl('stat-spend-sub', `TB: ${formatCurrency(stats.avgSpendPerDay)} / ngày`);

  setEl('stat-total-orders', `${formatNumber(stats.totalOrders)} đơn`);
  setEl('stat-orders-sub', `TB: ${stats.avgOrdersPerDay.toFixed(1).replace('.', ',')} đơn / ngày`);

  setEl('stat-avg-cpa', formatCurrency(stats.avgCPA));
  const cpaBadge = document.getElementById('stat-cpa-badge');
  if (cpaBadge) {
    if (stats.avgCPA <= appState.targetMaxCPA) {
      cpaBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200';
      cpaBadge.textContent = 'ĐẠT KPI';
    } else {
      cpaBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200';
      cpaBadge.textContent = 'VƯỢT TRẦN';
    }
  }

  setEl('stat-avg-ctr', formatPercent(stats.avgCTR));
  setEl('stat-cpc-badge', `CPC: ${formatCurrency(stats.avgCPC)}`);
  setEl('stat-reach-sub', `${formatNumber(stats.totalReach)} Reach • ${formatNumber(stats.totalClick)} Click`);
}

// Cập nhật Phễu Chuyển Đổi
function renderFunnel(stats) {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('funnel-reach-val', formatNumber(stats.totalReach));
  setEl('funnel-click-val', formatNumber(stats.totalClick));
  setEl('funnel-orders-val', formatNumber(stats.totalOrders));
  setEl('funnel-ctr-badge', `CTR ${formatPercent(stats.avgCTR)}`);
  setEl('funnel-cr-badge', `CR ${formatPercent(stats.avgCR)}`);

  const clickBar = document.getElementById('funnel-click-bar');
  const ordersBar = document.getElementById('funnel-orders-bar');
  if (clickBar) {
    const clickPct = Math.min(Math.max(stats.avgCTR * 15, 10), 100);
    clickBar.style.width = clickPct + '%';
  }
  if (ordersBar) {
    const orderPct = Math.min(Math.max(stats.avgCR * 30, 8), 100);
    ordersBar.style.width = orderPct + '%';
  }
}

// Cập nhật nút kịch bản
function updatePresetButtonsUI() {
  document.querySelectorAll('[data-preset-btn]').forEach((btn) => {
    const key = btn.getAttribute('data-preset-btn');
    const isActive = key === appState.activePreset;
    if (isActive) {
      btn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs bg-indigo-600 text-white';
    } else {
      btn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all';
    }
  });
}

// ================= VẼ BIỂU ĐỒ COMBO DẠNG SVG THUẦN =================
function renderComboChart(stats) {
  const svg = document.getElementById('combo-chart-svg');
  const xAxisEl = document.getElementById('combo-chart-xaxis');
  const titleEl = document.getElementById('chart-main-title');
  const subtitleEl = document.getElementById('chart-main-subtitle');
  if (!svg || !xAxisEl) return;

  const rows = stats.rows || [];
  const count = rows.length;

  if (count === 0) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#94A3B8" font-size="13">Chưa có dữ liệu. Bấm "+ Thêm 1 Ngày Mới" hoặc chọn kịch bản mẫu ở trên.</text>';
    xAxisEl.innerHTML = '';
    return;
  }

  // Tùy chỉnh trường theo tab xem
  let barField = 'spend';
  let lineField = 'orders';
  let barLabel = 'Ngân sách';
  let lineLabel = 'Đơn hàng';
  let barFormatter = formatCurrency;
  let lineFormatter = (v) => `${formatNumber(v)} đơn`;

  if (appState.chartView === 'reach-click') {
    barField = 'reach';
    lineField = 'click';
    barLabel = 'Tiếp cận';
    lineLabel = 'Lượt nhấp';
    barFormatter = (v) => `${formatNumber(v)} người`;
    lineFormatter = (v) => `${formatNumber(v)} click`;
    if (titleEl) titleEl.textContent = 'Tương quan Lượt Tiếp Cận (Reach) & Lượt Nhấp (Click)';
    if (subtitleEl) subtitleEl.textContent = 'Cột: Quy mô tiếp cận • Đường: Số lượt nhấp quan tâm';
  } else if (appState.chartView === 'cpa-cpc') {
    barField = 'cpa';
    lineField = 'cpc';
    barLabel = 'Giá / Đơn (CPA)';
    lineLabel = 'Giá / Click (CPC)';
    barFormatter = formatCurrency;
    lineFormatter = formatCurrency;
    if (titleEl) titleEl.textContent = 'Biến Động Chi Phí: Giá / Đơn (CPA) & Giá / Click (CPC)';
    if (subtitleEl) subtitleEl.textContent = 'Cột: CPA thực tế • Đường: Chi phí trung bình mỗi click';
  } else {
    if (titleEl) titleEl.textContent = 'Tương quan Chi Phí & Sản Lượng Đơn Hàng Theo Ngày';
    if (subtitleEl) subtitleEl.textContent = 'Cột: Ngân sách chi tiêu (VNĐ) • Đường: Số đơn hàng phát sinh';
  }

  // Cập nhật tab active
  document.querySelectorAll('[data-chart-tab]').forEach((btn) => {
    const mode = btn.getAttribute('data-chart-tab');
    if (mode === appState.chartView) {
      btn.className = 'px-2.5 py-1 rounded bg-white text-indigo-700 shadow-xs';
    } else {
      btn.className = 'px-2.5 py-1 rounded text-slate-600 hover:text-slate-900';
    }
  });

  const width = svg.clientWidth || 700;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 25, left: 20 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxBar = Math.max(...rows.map((r) => r[barField] || 0), 1) * 1.15;
  const maxLine = Math.max(...rows.map((r) => r[lineField] || 0), 1) * 1.25;

  const stepX = plotWidth / count;
  const barWidth = Math.min(Math.max(stepX * 0.45, 18), 44);

  let elements = '';

  // Đường lưới ngang
  for (let i = 0; i <= 3; i++) {
    const y = padding.top + (plotHeight / 3) * i;
    elements += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4,4"/>`;
  }

  // Vẽ Cột
  rows.forEach((r, idx) => {
    const x = padding.left + idx * stepX + (stepX - barWidth) / 2;
    const h = (r[barField] / maxBar) * plotHeight;
    const y = padding.top + plotHeight - h;

    elements += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="6" fill="#6366F1" fill-opacity="0.85" class="hover:fill-opacity-100 transition-all cursor-pointer">
        <title>${r.date}: ${barLabel} ${barFormatter(r[barField])}</title>
      </rect>
    `;
  });

  // Vẽ Đường (Line Chart)
  const points = rows.map((r, idx) => {
    const cx = padding.left + idx * stepX + stepX / 2;
    const cy = padding.top + plotHeight - (r[lineField] / maxLine) * plotHeight;
    return { cx, cy, row: r };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`, '');

  elements += `<path d="${pathD}" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Các điểm chấm trên đường
  points.forEach((p) => {
    elements += `
      <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="4.5" fill="#FFFFFF" stroke="#10B981" stroke-width="2.5" class="cursor-pointer hover:r-6 transition-all">
        <title>${p.row.date}: ${lineLabel} ${lineFormatter(p.row[lineField])}</title>
      </circle>
    `;
  });

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = elements;

  // Cập nhật trục hoành
  xAxisEl.innerHTML = rows.map((r) => `<span class="truncate text-center" style="width: ${stepX}px">${r.date.slice(0, 5)}</span>`).join('');
}

// ================= RENDER BẢNG NHẬP LIỆU ĐA DÒNG =================
function renderDataTable(stats) {
  const tbody = document.getElementById('data-table-body');
  const tfoot = document.getElementById('data-table-footer');
  if (!tbody) return;

  const rows = stats.rows || [];

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-slate-400">
          Chưa có ngày nào trong danh sách. Hãy nhấp <strong>"+ Thêm 1 Ngày Mới"</strong> hoặc chọn kịch bản phía trên.
        </td>
      </tr>
    `;
    if (tfoot) tfoot.innerHTML = '';
    return;
  }

  tbody.innerHTML = rows.map((r) => `
    <tr class="hover:bg-slate-50/80 transition-colors">
      <td class="py-2.5 px-3">
        <input type="text" value="${r.date}" data-row-id="${r.id}" data-field="date" class="w-24 px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none text-xs font-semibold text-slate-900" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${r.reach}" data-row-id="${r.id}" data-field="reach" class="w-28 px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none text-xs text-slate-700" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${r.click}" data-row-id="${r.id}" data-field="click" class="w-24 px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none text-xs text-slate-700" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${r.spend}" data-row-id="${r.id}" data-field="spend" step="100000" class="w-28 px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none text-xs font-semibold text-slate-900" />
      </td>
      <td class="py-2.5 px-3">
        <input type="number" value="${r.orders}" data-row-id="${r.id}" data-field="orders" class="w-20 px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none text-xs font-bold text-emerald-700" />
      </td>
      <td class="py-2.5 px-3 text-right font-medium text-slate-600">
        ${formatPercent(r.ctr)}
      </td>
      <td class="py-2.5 px-3 text-right font-bold ${r.cpa > appState.targetMaxCPA ? 'text-rose-600' : 'text-slate-900'}">
        ${formatCurrency(r.cpa)}
      </td>
      <td class="py-2.5 px-3 text-center">
        <button type="button" data-delete-row="${r.id}" class="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors" title="Xóa ngày này">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </td>
    </tr>
  `).join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <td class="py-3 px-3 uppercase text-[11px] text-slate-500">TỔNG CỘNG (${stats.count} ngày)</td>
        <td class="py-3 px-3">${formatNumber(stats.totalReach)}</td>
        <td class="py-3 px-3">${formatNumber(stats.totalClick)}</td>
        <td class="py-3 px-3 text-brand-700 font-extrabold">${formatCurrency(stats.totalSpend)}</td>
        <td class="py-3 px-3 text-emerald-700 font-extrabold">${formatNumber(stats.totalOrders)} đơn</td>
        <td class="py-3 px-3 text-right">${formatPercent(stats.avgCTR)}</td>
        <td class="py-3 px-3 text-right text-brand-700 font-extrabold">${formatCurrency(stats.avgCPA)}</td>
        <td></td>
      </tr>
    `;
  }

  // Lắng nghe sự kiện sửa ô
  tbody.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-row-id');
      const field = e.target.getAttribute('data-field');
      const val = e.target.value;
      const row = appState.rows.find((r) => r.id === id);
      if (row) {
        row[field] = field === 'date' ? val : Number(val) || 0;
        saveToStorage();
        renderDashboard();
      }
    });
  });

  // Lắng nghe nút Xóa
  tbody.querySelectorAll('[data-delete-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-row');
      appState.rows = appState.rows.filter((r) => r.id !== id);
      saveToStorage();
      renderDashboard();
      showGlobalToast('Đã xóa 1 ngày khỏi bảng!');
    });
  });
}

// Thêm 1 ngày mới
function addNewRow() {
  const count = appState.rows.length;
  const lastRow = count > 0 ? appState.rows[count - 1] : null;
  const nextDayNum = count + 1;
  const newDate = nextDayNum < 10 ? `0${nextDayNum}/11/2024` : `${nextDayNum}/11/2024`;

  const newRow = {
    id: 'row_' + Date.now(),
    date: newDate,
    reach: lastRow ? lastRow.reach : 50000,
    click: lastRow ? lastRow.click : 1200,
    spend: lastRow ? lastRow.spend : 2500000,
    orders: lastRow ? lastRow.orders : 15
  };

  appState.rows.push(newRow);
  saveToStorage();
  renderDashboard();
  showGlobalToast('Đã thêm 1 ngày mới vào bảng số liệu!');
}

// Chuyển kịch bản mẫu
function switchPreset(presetKey) {
  const preset = PRESET_SCENARIOS[presetKey];
  if (!preset) return;
  appState.activePreset = presetKey;
  appState.campaignName = preset.campaignName;
  appState.rows = JSON.parse(JSON.stringify(preset.rows));
  saveToStorage();
  renderDashboard();
  showGlobalToast(`Đã áp dụng kịch bản: ${preset.statusText}!`);
}

// Toast thông báo
window.showGlobalToast = function (msg) {
  const toast = document.getElementById('global-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 2200);
};

// ================= KHỞI CHẠY KHI TẢI TRANG =================
document.addEventListener('DOMContentLoaded', () => {
  // Đọc từ LocalStorage nếu có
  loadFromStorage();

  // Khởi tạo Dashboard
  renderDashboard();

  // Nút Thêm 1 ngày mới
  const btnAdd = document.getElementById('btn-add-row');
  if (btnAdd) btnAdd.addEventListener('click', addNewRow);

  // Các nút kịch bản
  document.querySelectorAll('[data-preset-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchPreset(btn.getAttribute('data-preset-btn'));
    });
  });

  // Chuyển tab xem Biểu đồ
  document.querySelectorAll('[data-chart-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.chartView = btn.getAttribute('data-chart-tab');
      renderDashboard();
    });
  });

  // Modal Báo Cáo
  const reportModal = document.getElementById('report-modal');
  const btnOpenReport = document.getElementById('btn-open-report');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');

  if (btnOpenReport && reportModal) {
    btnOpenReport.addEventListener('click', () => {
      reportModal.classList.remove('hidden');
      if (window.AIReportEngine) {
        const stats = calculateMetrics();
        const textarea = document.getElementById('report-text-content');
        if (textarea) {
          textarea.value = window.AIReportEngine.generateExportText(
            stats,
            appState.reportTone,
            appState.campaignName,
            { targetMaxCPA: appState.targetMaxCPA, targetMinCTR: appState.targetMinCTR }
          );
        }
      }
    });
  }

  const hideModal = () => reportModal && reportModal.classList.add('hidden');
  if (btnCloseModal) btnCloseModal.addEventListener('click', hideModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', hideModal);

  // Chọn giọng văn báo cáo
  document.querySelectorAll('[data-report-tone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.reportTone = btn.getAttribute('data-report-tone');
      document.querySelectorAll('[data-report-tone]').forEach((b) => {
        if (b === btn) {
          b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white shadow-xs';
        } else {
          b.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors';
        }
      });
      if (window.AIReportEngine) {
        const stats = calculateMetrics();
        const textarea = document.getElementById('report-text-content');
        if (textarea) {
          textarea.value = window.AIReportEngine.generateExportText(
            stats,
            appState.reportTone,
            appState.campaignName,
            { targetMaxCPA: appState.targetMaxCPA, targetMinCTR: appState.targetMinCTR }
          );
        }
      }
    });
  });
});
