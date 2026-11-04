import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  FileSpreadsheet, 
  Share2, 
  RotateCcw, 
  Sun, 
  Moon,
  TrendingUp
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMultiEntry: () => void;
  onOpenReport: () => void;
  onResetSampleData: () => void;
  recordCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenMultiEntry,
  onOpenReport,
  onResetSampleData,
  recordCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 bg-slate-900/80 border-slate-800/80 dark:bg-slate-950/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AdPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">KPI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Đề 7: Vibe Coding
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Marketer Ads Dashboard</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-slate-300 font-medium">{recordCount} ngày theo dõi</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nạp dữ liệu mẫu */}
          <button
            onClick={onResetSampleData}
            title="Khôi phục lại 10 ngày dữ liệu mẫu chuẩn Digital Marketing"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nạp Data Mẫu</span>
          </button>

          {/* Nhập nhiều dòng / Excel */}
          <button
            onClick={onOpenMultiEntry}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Nhập Nhiều Dòng / Excel</span>
            <span className="sm:hidden">Nhập dòng</span>
          </button>

          {/* Nút Xuất Báo Cáo - Hero Button */}
          <button
            onClick={onOpenReport}
            className="relative group overflow-hidden flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Share2 className="w-4 h-4" />
            <span>Xuất Báo Cáo</span>
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-medium">Copy Sếp</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
