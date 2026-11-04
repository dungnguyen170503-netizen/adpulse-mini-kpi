import React from 'react';
import { 
  DollarSign, 
  Users, 
  MousePointerClick, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Percent,
  Sparkles
} from 'lucide-react';
import { AggregatedMetrics } from '../types/campaign';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

interface KpiStatsGridProps {
  metrics: AggregatedMetrics;
}

export const KpiStatsGrid: React.FC<KpiStatsGridProps> = ({ metrics }) => {
  const { comparison } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Tổng Chi Phí */}
      <div className="relative group rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Chi Phí</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-white mb-1">
          {formatCurrency(metrics.totalSpend)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">{metrics.daysCount} ngày chạy</span>
          {comparison && (
            <span className={`inline-flex items-center font-medium ${comparison.spendChangePct >= 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
              {comparison.spendChangePct >= 0 ? '+' : ''}{comparison.spendChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 2. Lượt Tiếp Cận (Reach) */}
      <div className="relative group rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-cyan-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lượt Tiếp Cận</span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-white mb-1">
          {formatNumber(metrics.totalReach)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Reach tích lũy</span>
          {comparison && (
            <span className={`inline-flex items-center font-medium ${comparison.reachChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {comparison.reachChangePct >= 0 ? '+' : ''}{comparison.reachChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 3. Lượt Click & CTR */}
      <div className="relative group rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-blue-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clicks & CTR</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <MousePointerClick className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-white mb-1">
          {formatNumber(metrics.totalClick)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">
            CTR: {formatPercent(metrics.avgCtr)}
          </span>
          {comparison && (
            <span className={`inline-flex items-center font-medium ${comparison.ctrChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {comparison.ctrChangePct >= 0 ? '+' : ''}{comparison.ctrChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 4. Tổng Đơn Hàng (Orders) */}
      <div className="relative group rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đơn Hàng (CVR)</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-400 mb-1">
          {formatNumber(metrics.totalOrders)} <span className="text-sm font-medium text-slate-400">đơn</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">CVR: {formatPercent(metrics.avgCvr)}</span>
          {comparison && (
            <span className={`inline-flex items-center font-semibold ${comparison.ordersChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {comparison.ordersChangePct >= 0 ? '+' : ''}{comparison.ordersChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 5. CPC Trung Bình */}
      <div className="relative group rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-purple-500/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CPC Trung Bình</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-white mb-1">
          {formatCurrency(metrics.avgCpc)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Giá mỗi Click</span>
          {comparison && (
            <span className={`inline-flex items-center font-medium ${comparison.cpcChangePct <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {/* CPC giảm là tốt (màu xanh) */}
              {comparison.cpcChangePct >= 0 ? '+' : ''}{comparison.cpcChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 6. CPA (Chi phí trên mỗi đơn hàng) - GOLDEN KPI */}
      <div className="relative group rounded-2xl p-4 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border border-indigo-500/40 hover:border-indigo-400 transition-all hover:shadow-xl hover:shadow-indigo-500/10 ring-1 ring-indigo-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            CPA / Đơn Hàng
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
            CPA
          </div>
        </div>
        <div className="text-2xl font-extrabold tracking-tight text-amber-300 mb-1">
          {formatCurrency(metrics.avgCpa)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Chi phí / 1 Đơn</span>
          {comparison && (
            <span className={`inline-flex items-center font-bold ${comparison.cpaChangePct <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {/* CPA giảm là sinh lời tốt hơn */}
              {comparison.cpaChangePct >= 0 ? '+' : ''}{comparison.cpaChangePct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
