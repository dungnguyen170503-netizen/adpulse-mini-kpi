import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Database,
  RotateCcw,
  Trash2,
  FileSpreadsheet,
  Image as ImageIcon,
  FileDown,
  PlusCircle,
  ChevronDown,
  ClipboardPaste,
  FlaskConical
} from 'lucide-react';

interface NavbarProps {
  recordCount: number;
  lastSavedAt: string | null;
  hasSummarySnapshot?: boolean;
  sourceLabel: string;
  isSampleData: boolean;
  onLoadDataset1: () => void;
  onLoadDataset2: () => void;
  onLoadDataset3: () => void;
  onLoadSampleSummary: () => void;
  onReloadPage: () => void;
  onClearAll: () => void;
  onOpenMultiModal: () => void;
  onOpenFileImport: (defaultTab?: 'file' | 'clipboard') => void;
  onOpenImageImport: () => void;
  onOpenPdfExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recordCount,
  lastSavedAt,
  hasSummarySnapshot,
  sourceLabel,
  isSampleData,
  onLoadDataset1,
  onLoadDataset2,
  onLoadDataset3,
  onLoadSampleSummary,
  onReloadPage,
  onClearAll,
  onOpenMultiModal,
  onOpenFileImport,
  onOpenImageImport,
  onOpenPdfExport
}) => {
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImportMenuOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsImportMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const formattedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : 'Chưa lưu';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 space-y-2">
        {/* Hàng 1: Thương hiệu + Cụm hành động chính (Nhập dữ liệu, Xuất PDF, Xóa/Tải lại) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Trạng thái nguồn */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
              <span className="font-extrabold text-sm tracking-wider">AP</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                  AdPulse Mini KPI
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    hasSummarySnapshot && recordCount === 0
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : isSampleData
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : recordCount > 0
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {sourceLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Database className="w-3 h-3 text-indigo-400 flex-shrink-0" aria-hidden />
                  <span>
                    {hasSummarySnapshot && recordCount === 0
                      ? 'Bản ghi tổng kỳ từ ảnh'
                      : `${recordCount} dòng ngày đã lưu`}
                  </span>
                </span>
                <span>•</span>
                <span>Lưu lúc {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Cụm nút chính: Nhập dữ liệu (Dropdown gom 4 cách nhập) + Xuất PDF + Tiện ích */}
          <div className="flex flex-wrap items-center gap-2">
            {/* NÚT CHÍNH: NHẬP DỮ LIỆU (Gom toàn bộ cách nhập dưới 1 nút chính dễ thấy) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isImportMenuOpen}
                onClick={() => setIsImportMenuOpen(prev => !prev)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <PlusCircle className="w-4 h-4" aria-hidden />
                <span>Nhập dữ liệu</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isImportMenuOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              {isImportMenuOpen && (
                <div
                  role="menu"
                  aria-label="Chọn cách nhập dữ liệu"
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Chọn cách nhập số liệu thật
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsImportMenuOpen(false); onOpenMultiModal(); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-start gap-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <Layers className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" aria-hidden />
                    <div>
                      <div className="text-xs font-bold text-white">1. Nhập tay nhiều ngày</div>
                      <div className="text-[11px] text-slate-400">Gõ bảng trực tiếp, xem trước KPI từng dòng</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsImportMenuOpen(false); onOpenFileImport('file'); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-start gap-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden />
                    <div>
                      <div className="text-xs font-bold text-white">2. Tải file Excel / CSV</div>
                      <div className="text-[11px] text-slate-400">Chọn file .xlsx, .xls, .csv và ghép cột tự động</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsImportMenuOpen(false); onOpenFileImport('clipboard'); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-start gap-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <ClipboardPaste className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" aria-hidden />
                    <div>
                      <div className="text-xs font-bold text-white">3. Dán bảng từ Google Sheets / Zalo</div>
                      <div className="text-[11px] text-slate-400">Copy vùng bảng rồi dán thẳng để kiểm tra</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsImportMenuOpen(false); onOpenImageImport(); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-start gap-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" aria-hidden />
                    <div>
                      <div className="text-xs font-bold text-white">4. Đọc ảnh chụp báo cáo (OCR)</div>
                      <div className="text-[11px] text-slate-400">Nhận diện ảnh bảng ngày hoặc ảnh tổng kỳ</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Nút Xuất PDF nhanh */}
            <button
              type="button"
              onClick={onOpenPdfExport}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-100 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700 hover:border-rose-500 flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Xem trước và tải báo cáo PDF A4"
            >
              <FileDown className="w-4 h-4 text-rose-400" aria-hidden />
              <span>Xuất PDF</span>
            </button>

            {/* Tải lại & Xóa sạch */}
            <button
              type="button"
              onClick={onReloadPage}
              className="min-h-[40px] px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Tải lại trang (kiểm tra lưu trữ LocalStorage)"
              aria-label="Tải lại trang F5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" aria-hidden />
              <span className="hidden sm:inline">F5</span>
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="min-h-[40px] px-2.5 py-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-rose-300 hover:bg-rose-500/15 border border-slate-700/80 text-xs font-semibold flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              title="Xóa toàn bộ dữ liệu để bắt đầu từ màn trống"
              aria-label="Xóa dữ liệu"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" aria-hidden />
              <span className="hidden lg:inline">Xóa dữ liệu</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Tách riêng "Dùng dữ liệu mẫu" thành khu vực lựa chọn độc lập, hiện rõ trên cả điện thoại và máy tính */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Dùng dữ liệu mẫu">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              <FlaskConical className="w-3 h-3" aria-hidden />
              <span>Dùng dữ liệu mẫu:</span>
            </span>
            <button
              type="button"
              onClick={onLoadDataset1}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Nạp Bộ 1: 5 ngày chuẩn mực E-Commerce"
            >
              Bộ 1 (Chuẩn)
            </button>
            <button
              type="button"
              onClick={onLoadDataset2}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Nạp Bộ 2: Dữ liệu thiếu Reach và Clicks > Reach"
            >
              Bộ 2 (Lỗi/Thiếu)
            </button>
            <button
              type="button"
              onClick={onLoadDataset3}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Nạp Bộ 3: Mẫu số 0, ngày tạm dừng và ngày trùng lặp"
            >
              Bộ 3 (Biên/Trùng)
            </button>
            <button
              type="button"
              onClick={onLoadSampleSummary}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 hover:text-white text-[11px] font-semibold border border-purple-500/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              title="Nạp mẫu Ảnh tổng kỳ (01/11 – 07/11, chỉ có số tổng, không có dòng ngày)"
            >
              Ảnh tổng kỳ mẫu
            </button>
          </div>

          <span className="hidden md:inline text-[11px] text-slate-400">
            Mẹo: Bấm <b>Nhập dữ liệu</b> để nạp số thật, hoặc chọn một <b>Dữ liệu mẫu</b> để trải nghiệm nhanh.
          </span>
        </div>
      </div>
    </header>
  );
};
