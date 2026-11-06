import React from 'react';
import {
  Layers,
  Database,
  RotateCcw,
  Sparkles,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';

interface NavbarProps {
  recordCount: number;
  lastSavedAt: string | null;
  hasSummarySnapshot?: boolean;
  onLoadDataset1: () => void;
  onLoadDataset2: () => void;
  onLoadDataset3: () => void;
  onReloadPage: () => void;
  onClearAll: () => void;
  onOpenMultiModal: () => void;
  onOpenFileImport: () => void;
  onOpenImageImport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recordCount,
  lastSavedAt,
  hasSummarySnapshot,
  onLoadDataset1,
  onLoadDataset2,
  onLoadDataset3,
  onReloadPage,
  onClearAll,
  onOpenMultiModal,
  onOpenFileImport,
  onOpenImageImport
}) => {
  const formattedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Chưa lưu';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & State */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
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
                Thanh Dũng (D1–D3, K1)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <Database className="w-3 h-3" />
                <span>LocalStorage: {recordCount} ngày</span>
              </span>
              {hasSummarySnapshot && (
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                  + Snapshot Tổng Kỳ
                </span>
              )}
              <span>•</span>
              <span>Lưu lúc: {formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Input Source Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 4 Nguồn Nhập Số Liệu: Tay, Excel/CSV, Text, Ảnh */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            {/* 1. Nhập tay */}
            <button
              type="button"
              onClick={onOpenMultiModal}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Nhập tay nhiều dòng cùng lúc"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Nhập Tay</span>
            </button>

            {/* 2. Excel / CSV / Text */}
            <button
              type="button"
              onClick={onOpenFileImport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600/80 hover:text-white text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700/60"
              title="Nhập file Excel (.xlsx), CSV hoặc dán văn bản từ Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel/CSV/Text</span>
            </button>

            {/* 3. Ảnh chụp OCR */}
            <button
              type="button"
              onClick={onOpenImageImport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600/80 hover:text-white text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700/60"
              title="Đọc ảnh chụp màn hình Meta Ads Manager"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Ảnh Chụp (OCR)</span>
            </button>
          </div>

          {/* Nạp 3 Bộ Dữ Liệu Kiểm Thử */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={onLoadDataset1}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
            >
              Bộ 1
            </button>
            <button
              type="button"
              onClick={onLoadDataset2}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
            >
              Bộ 2
            </button>
            <button
              type="button"
              onClick={onLoadDataset3}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] font-medium transition-colors"
            >
              Bộ 3
            </button>
          </div>

          {/* F5 Reload Test */}
          <button
            type="button"
            onClick={onReloadPage}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Thử F5 tải lại trang để chứng minh LocalStorage hoạt động bền vững"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">F5 Test</span>
          </button>

          {/* Clear all */}
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
