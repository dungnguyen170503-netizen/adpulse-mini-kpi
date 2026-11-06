import React from 'react';
import { AlertTriangle, Merge, Replace, X } from 'lucide-react';

interface DuplicateResolutionModalProps {
  isOpen: boolean;
  duplicateDates: string[];
  onMerge: () => void;
  onOverwrite: () => void;
  onCancel: () => void;
}

export const DuplicateResolutionModal: React.FC<DuplicateResolutionModalProps> = ({
  isOpen,
  duplicateDates,
  onMerge,
  onOverwrite,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Phát Hiện Trùng Lặp Ngày
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Các ngày sau đang bị trùng lặp số liệu: <span className="font-mono text-amber-300 font-semibold">{duplicateDates.join(', ')}</span>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <p className="font-medium text-white">Quy chuẩn kiến trúc dữ liệu (C1 Contract):</p>
          <p>
            Trục thời gian của biểu đồ đòi hỏi mỗi ngày chỉ có 1 điểm dữ liệu duy nhất. Bạn vui lòng chọn cách xử lý:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onMerge}
            className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-left shadow-lg shadow-indigo-500/25 transition-all group"
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Merge className="w-4 h-4" />
              <span>Gộp Chỉ Số (Merge)</span>
            </div>
            <p className="text-[11px] text-indigo-100 mt-1">
              Cộng dồn Spend, Reach, Clicks, Orders thành 1 dòng duy nhất cho mỗi ngày.
            </p>
          </button>

          <button
            type="button"
            onClick={onOverwrite}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-left border border-slate-700 transition-all"
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Replace className="w-4 h-4" />
              <span>Ghi Đè (Overwrite)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Lấy bản ghi mới nhất để thay thế cho bản ghi cũ cùng ngày.
            </p>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Hủy Bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
