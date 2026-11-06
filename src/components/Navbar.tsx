import React from 'react';
import {
  Layers,
  Database,
  RotateCcw,
  Sparkles,
  Trash2,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';

interface NavbarProps {
  recordCount: number;
  lastSavedAt: string | null;
  onLoadDataset1: () => void;
  onLoadDataset2: () => void;
  onLoadDataset3: () => void;
  onReloadPage: () => void;
  onClearAll: () => void;
  onOpenMultiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recordCount,
  lastSavedAt,
  onLoadDataset1,
  onLoadDataset2,
  onLoadDataset3,
  onReloadPage,
  onClearAll,
  onOpenMultiModal
}) => {
  const formattedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Chưa lưu';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & State */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="font-extrabold text-base tracking-wider">AP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                AdPulse Mini KPI
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                Đề 7 • Bảng B
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                Thanh Dũng (D1/K1)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <Database className="w-3 h-3" />
                <span>LocalStorage: {recordCount} ngày</span>
              </span>
              <span>•</span>
              <span>Lưu lúc: {formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Test Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nạp 3 Bộ Dữ Liệu Kiểm Thử của C1 */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={onLoadDataset1}
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
              title="Nạp Bộ 1: 5 ngày E-Commerce chuẩn mực"
            >
              Bộ 1 (Chuẩn)
            </button>
            <button
              type="button"
              onClick={onLoadDataset2}
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
              title="Nạp Bộ 2: Dữ liệu bẩn/thiếu/bất thường"
            >
              Bộ 2 (Lỗi/Thiếu)
            </button>
            <button
              type="button"
              onClick={onLoadDataset3}
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
              title="Nạp Bộ 3: Mẫu số 0, 0 click/đơn, ngày trùng"
            >
              Bộ 3 (Biên/Số 0)
            </button>
          </div>

          {/* Nút Thử Tải Lại Trang (F5 Reload Test) */}
          <button
            type="button"
            onClick={onReloadPage}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Thử tải lại trang để chứng minh dữ liệu lưu trong LocalStorage vẫn còn nguyên"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Thử F5 Tải Lại</span>
          </button>

          {/* Nút Nhập Nhiều Dòng */}
          <button
            type="button"
            onClick={onOpenMultiModal}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Nhập Nhiều Dòng</span>
          </button>

          {/* Xóa sạch */}
          <button
            type="button"
            onClick={onClearAll}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Xóa toàn bộ dữ liệu"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
