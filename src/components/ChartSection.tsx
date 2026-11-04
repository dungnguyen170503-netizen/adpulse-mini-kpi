import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CampaignRecord } from '../types/campaign';
import { calculateRecordMetrics } from '../utils/calculations';
import { formatDateShort, formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { BarChart2, LineChart, Layers, Eye, DollarSign, ShoppingBag } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartSectionProps {
  records: CampaignRecord[];
}

type ViewMode = 'orders-spend' | 'reach-clicks' | 'efficiency';
type ChartStyle = 'combo' | 'line' | 'bar';

export const ChartSection: React.FC<ChartSectionProps> = ({ records }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('orders-spend');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('combo');

  // Sắp xếp theo ngày tăng dần
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const calculated = sorted.map(calculateRecordMetrics);

  const labels = sorted.map(r => formatDateShort(r.date));

  // Cấu hình datasets theo từng viewMode
  let chartData: any;
  let chartOptions: ChartOptions<any>;

  if (viewMode === 'orders-spend') {
    // Chi phí (Trục phải - VNĐ) & Đơn hàng (Trục trái - Đơn)
    const isLine = chartStyle === 'line';
    const isBar = chartStyle === 'bar';

    chartData = {
      labels,
      datasets: [
        {
          type: (isLine ? 'line' : isBar ? 'bar' : 'bar') as const,
          label: 'Đơn hàng (Đơn)',
          data: calculated.map(r => r.orders),
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'yLeft',
          order: 2,
        },
        {
          type: (isBar ? 'bar' : 'line') as const,
          label: 'Chi phí (VNĐ)',
          data: calculated.map(r => r.spend),
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          borderColor: '#6366f1',
          borderWidth: 3,
          pointBackgroundColor: '#818cf8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35,
          fill: !isBar,
          yAxisID: 'yRight',
          order: 1,
        },
      ],
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || '';
              const val = context.raw;
              if (context.dataset.yAxisID === 'yRight') {
                return `${label}: ${formatCurrency(val)}`;
              }
              return `${label}: ${formatNumber(val)} đơn`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } },
        },
        yLeft: {
          type: 'linear' as const,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Số Đơn Hàng',
            color: '#10b981',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#10b981' },
          beginAtZero: true,
        },
        yRight: {
          type: 'linear' as const,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Chi Phí (VNĐ)',
            color: '#818cf8',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#818cf8',
            callback: (val: any) => `${(val / 1000).toLocaleString('vi-VN')}k`,
          },
          beginAtZero: true,
        },
      },
    };
  } else if (viewMode === 'reach-clicks') {
    // Reach (Trục trái) & Clicks (Trục phải)
    const isLine = chartStyle === 'line';
    const isBar = chartStyle === 'bar';

    chartData = {
      labels,
      datasets: [
        {
          type: (isLine ? 'line' : isBar ? 'bar' : 'bar') as const,
          label: 'Tiếp cận (Reach)',
          data: calculated.map(r => r.reach),
          backgroundColor: 'rgba(14, 165, 233, 0.65)',
          borderColor: '#0284c7',
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'yLeft',
          order: 2,
        },
        {
          type: (isBar ? 'bar' : 'line') as const,
          label: 'Lượt nhấp (Clicks)',
          data: calculated.map(r => r.click),
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: '#f59e0b',
          borderWidth: 3,
          pointBackgroundColor: '#fbbf24',
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35,
          fill: !isBar,
          yAxisID: 'yRight',
          order: 1,
        },
      ],
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || '';
              const val = context.raw;
              return `${label}: ${formatNumber(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#94a3b8' },
        },
        yLeft: {
          type: 'linear' as const,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Reach (Lượt tiếp cận)',
            color: '#38bdf8',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#38bdf8' },
          beginAtZero: true,
        },
        yRight: {
          type: 'linear' as const,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Số Lượt Click',
            color: '#f59e0b',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { drawOnChartArea: false },
          ticks: { color: '#f59e0b' },
          beginAtZero: true,
        },
      },
    };
  } else {
    // Efficiency: CTR (%) & CPA (VNĐ)
    chartData = {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: 'CTR (%)',
          data: calculated.map(r => Number(r.ctr.toFixed(2))),
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#f472b6',
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'yLeft',
        },
        {
          type: 'line' as const,
          label: 'CPA / Chi phí mỗi đơn (VNĐ)',
          data: calculated.map(r => Math.round(r.cpa)),
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#fcd34d',
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'yRight',
        },
      ],
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || '';
              const val = context.raw;
              if (context.dataset.yAxisID === 'yLeft') {
                return `${label}: ${formatPercent(val)}`;
              }
              return `${label}: ${formatCurrency(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#94a3b8' },
        },
        yLeft: {
          type: 'linear' as const,
          position: 'left' as const,
          title: {
            display: true,
            text: 'CTR (%)',
            color: '#ec4899',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: {
            color: '#ec4899',
            callback: (v: any) => `${v}%`,
          },
          beginAtZero: true,
        },
        yRight: {
          type: 'linear' as const,
          position: 'right' as const,
          title: {
            display: true,
            text: 'CPA (VNĐ / đơn)',
            color: '#fbbf24',
            font: { family: 'Plus Jakarta Sans', weight: 'bold' },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#fbbf24',
            callback: (val: any) => `${(val / 1000).toLocaleString('vi-VN')}k`,
          },
          beginAtZero: true,
        },
      },
    };
  }

  return (
    <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Biểu Đồ Xu Hướng Quảng Cáo Theo Ngày
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trực quan hóa tương quan giữa Chi phí, Lượt tiếp cận, Click và Số đơn hàng
          </p>
        </div>

        {/* View Mode Tabs & Chart Style Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* View Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('orders-spend')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'orders-spend'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đơn & Chi Phí
            </button>
            <button
              onClick={() => setViewMode('reach-clicks')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'reach-clicks'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reach & Clicks
            </button>
            <button
              onClick={() => setViewMode('efficiency')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'efficiency'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CTR & CPA
            </button>
          </div>

          {/* Style Switcher (Chỉ áp dụng khi không ở view efficiency) */}
          {viewMode !== 'efficiency' && (
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <button
                onClick={() => setChartStyle('combo')}
                title="Biểu đồ hỗn hợp Cột + Đường"
                className={`p-1.5 rounded-lg transition-all ${
                  chartStyle === 'combo' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartStyle('bar')}
                title="Biểu đồ Cột"
                className={`p-1.5 rounded-lg transition-all ${
                  chartStyle === 'bar' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartStyle('line')}
                title="Biểu đồ Đường"
                className={`p-1.5 rounded-lg transition-all ${
                  chartStyle === 'line' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LineChart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="h-80 sm:h-96 w-full relative">
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <BarChart2 className="w-12 h-12 mb-2 stroke-[1.5] opacity-40" />
            <p className="text-sm">Chưa có dữ liệu để vẽ biểu đồ.</p>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};
