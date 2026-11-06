import React from 'react';
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import {
  DollarSign,
  Users,
  MousePointerClick,
  ShoppingBag,
  Percent,
  Coins,
  Target,
  AlertTriangle,
  Info
} from 'lucide-react';

interface KpiStatsGridProps {
  snapshot: CampaignReportSnapshot;
}

export const KpiStatsGrid: React.FC<KpiStatsGridProps> = ({ snapshot }) => {
  const { totals, kpis, meta } = snapshot;

  return (
    <div className="space-y-4">
      {/* 4 Thẻ Số Liệu Tổng Hợp */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Tổng Chi Phí */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Chi Phí</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {formatVND(totals.spend)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Nguyên tệ: VNĐ</span>
          </p>
        </div>

        {/* Tổng Reach (Cộng dồn ngày) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Tổng Reach*</span>
              <div className="group/tip relative cursor-pointer">
                <Info className="w-3.5 h-3.5 text-slate-500 hover:text-blue-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tip:block w-56 p-2 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 shadow-xl z-20">
                  *Tổng lượt tiếp cận từng ngày cộng dồn, không phải số người tiếp cận duy nhất (Unique Reach) toàn chiến dịch do có trùng lặp người xem giữa các ngày.
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {totals.reachSum.toLocaleString('vi-VN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Lượt tiếp cận theo ngày</p>
        </div>

        {/* Tổng Clicks */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {totals.clicks.toLocaleString('vi-VN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Lượt nhấp vào quảng cáo</p>
        </div>

        {/* Tổng Đơn Hàng */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Đơn Hàng</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400 tracking-tight">
            {totals.orders.toLocaleString('vi-VN')} <span className="text-xs text-slate-400 font-normal">đơn</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Chuyển đổi thành công</p>
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số Hiệu Quả KPI Cốt Lõi (Theo Đề 7 & C1 Contract) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* CTR Toàn Kỳ */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Tỷ Lệ Nhấp (CTR)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Clicks / Reach (Đề 7)</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {kpis.ctr.formatted}
            </span>
          </div>
          {kpis.ctr.warningMessage && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{kpis.ctr.warningMessage}</span>
            </div>
          )}
        </div>

        {/* CPC Toàn Kỳ */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chi Phí / Click (CPC)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Tổng Chi Phí / Tổng Clicks</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${kpis.cpc.value === null ? 'text-amber-400' : 'text-white'}`}>
              {kpis.cpc.formatted}
            </span>
          </div>
          {kpis.cpc.warningMessage && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{kpis.cpc.warningMessage}</span>
            </div>
          )}
        </div>

        {/* CPA Toàn Kỳ (Chi phí / Đơn) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Chi Phí / Đơn (CPA)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Tổng Chi Phí / Tổng Đơn Hàng</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${kpis.cpa.value === null ? 'text-emerald-400' : 'text-emerald-300'}`}>
              {kpis.cpa.formatted}
            </span>
          </div>
          {kpis.cpa.warningMessage && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{kpis.cpa.warningMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
