import React, { useState } from 'react';
import { ImageOcrDraft, DailyAdRecord, PeriodSummaryRecord } from '../types/campaign';
import { analyzeAdImage, IMAGE_SUPPORT_CAPABILITIES } from '../utils/imageParser';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Edit3,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface ImageImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDailyImport: (records: DailyAdRecord[]) => void;
  onConfirmSummaryImport: (summary: PeriodSummaryRecord) => void;
}

export const ImageImportModal: React.FC<ImageImportModalProps> = ({
  isOpen,
  onClose,
  onConfirmDailyImport,
  onConfirmSummaryImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<ImageOcrDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State chỉnh sửa cho bản ghi tổng kỳ
  const [summaryForm, setSummaryForm] = useState({
    period_start: '2026-11-01',
    period_end: '2026-11-07',
    total_spend: 3500000,
    total_reach: 50000,
    total_clicks: 1500,
    total_orders: 50,
    notes: 'Nhận diện từ ảnh chụp Meta Ads Manager'
  });

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeAdImage(selected);
      setDraft(result);
      if (result.periodSummary) {
        setSummaryForm({
          period_start: result.periodSummary.period_start,
          period_end: result.periodSummary.period_end,
          total_spend: result.periodSummary.total_spend,
          total_reach: result.periodSummary.total_reach,
          total_clicks: result.periodSummary.total_clicks,
          total_orders: result.periodSummary.total_orders,
          notes: `Ảnh: ${selected.name}`
        });
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phân tích ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán KPI xem trước cho tổng kỳ
  const previewCtr = summaryForm.total_reach > 0
    ? (summaryForm.total_clicks / summaryForm.total_reach) * 100
    : 0;
  const previewCpc = summaryForm.total_clicks > 0
    ? Math.round(summaryForm.total_spend / summaryForm.total_clicks)
    : null;
  const previewCpa = summaryForm.total_orders > 0
    ? Math.round(summaryForm.total_spend / summaryForm.total_orders)
    : null;

  const handleSaveSummary = () => {
    const summaryRecord: PeriodSummaryRecord = {
      id: `summary_${Date.now()}`,
      period_start: summaryForm.period_start,
      period_end: summaryForm.period_end,
      total_spend: Number(summaryForm.total_spend),
      total_reach: Number(summaryForm.total_reach),
      total_clicks: Number(summaryForm.total_clicks),
      total_orders: Number(summaryForm.total_orders),
      is_aggregate_only: true,
      notes: summaryForm.notes
    };

    onConfirmSummaryImport(summaryRecord);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setDraft(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <p role="alert" className="p-4 bg-amber-950 text-amber-200 text-sm">OCR hiện là mô phỏng: số liệu mẫu được chọn theo tên file, không trích xuất từ ảnh. Không dùng kết quả này làm số liệu thật nếu chưa nhập lại và đối chiếu từng ô.</p>
        {/* Header */}
        <div className="p-5 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Ảnh chụp · Bản demo OCR (chưa đọc ảnh thật)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Phân tích ảnh chụp màn hình Meta Ads • Tự động nhận diện tổng kỳ hoặc chi tiết ngày • Sửa chỗ mơ hồ trước khi lưu
            </p>
          </div>
          <button
            onClick={() => { handleReset(); onClose(); }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!draft ? (
            /* Bước 1: Tải lên ảnh */
            <div className="space-y-6">
              <label className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40 group">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-white">
                  Kéo thả hoặc bấm để chọn ảnh chụp màn hình Meta Ads Manager
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Định dạng: PNG, JPG, JPEG, WebP (Rõ nét từ 720p trở lên)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              {/* Thông tin hỗ trợ và giới hạn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Phạm vi hỗ trợ tốt:</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {IMAGE_SUPPORT_CAPABILITIES.supported.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Chưa hỗ trợ (Ghi rõ phạm vi):</span>
                  </div>
                  <ul className="space-y-1 text-slate-400 list-disc list-inside">
                    {IMAGE_SUPPORT_CAPABILITIES.unsupported.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Bước 2: Xem trước và chỉnh sửa chỗ mơ hồ */
            <div className="space-y-6">
              {/* Cảnh báo tính toàn vẹn dữ liệu */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-purple-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">
                    Nguyên tắc dữ liệu (C1 Contract): Không tự tạo ngày giả từ ảnh tổng kỳ!
                  </p>
                  <p className="text-slate-300">
                    Ảnh chụp được nhận diện dưới dạng <b>Báo cáo tổng hợp cả kỳ ({summaryForm.period_start} đến {summaryForm.period_end})</b>. Hệ thống giữ nguyên số liệu tổng hợp thay vì tự chia đều cho các ngày để bịa số liệu ngày ảo.
                  </p>
                </div>
              </div>

              {/* Giao diện đối chiếu: Ảnh chụp bên trái vs Form chỉnh sửa bên phải */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ảnh chụp gốc */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Ảnh Chụp Báo Cáo Gốc:</span>
                  </span>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center max-h-80">
                    <img
                      src={draft.imagePreviewUrl}
                      alt="Ads Screenshot Preview"
                      className="max-h-72 object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Tên file: {draft.fileName} • Độ tin cậy OCR: {draft.confidenceScore}%
                  </p>
                </div>

                {/* Form Đối Chiếu & Chỉnh Sửa Chỗ Mơ Hồ */}
                <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Số Liệu Trích Xuất (Cho Phép Sửa):</span>
                    </h4>
                    <span className="text-[11px] text-purple-300">Báo Cáo Tổng Kỳ</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Kỳ Bắt Đầu */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Kỳ Bắt Đầu:
                      </label>
                      <input
                        type="date"
                        value={summaryForm.period_start}
                        onChange={(e) => setSummaryForm({ ...summaryForm, period_start: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Kỳ Kết Thúc */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Kỳ Kết Thúc:
                      </label>
                      <input
                        type="date"
                        value={summaryForm.period_end}
                        onChange={(e) => setSummaryForm({ ...summaryForm, period_end: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Tổng Chi Phí */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        * Tổng Chi Phí (VNĐ):
                      </label>
                      <input
                        type="number"
                        step="10000"
                        value={summaryForm.total_spend}
                        onChange={(e) => setSummaryForm({ ...summaryForm, total_spend: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Tổng Reach */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        * Tổng Reach (Người):
                      </label>
                      <input
                        type="number"
                        value={summaryForm.total_reach}
                        onChange={(e) => setSummaryForm({ ...summaryForm, total_reach: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Tổng Clicks */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        * Tổng Clicks (Nhấp):
                      </label>
                      <input
                        type="number"
                        value={summaryForm.total_clicks}
                        onChange={(e) => setSummaryForm({ ...summaryForm, total_clicks: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Tổng Đơn Hàng */}
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        * Tổng Đơn Hàng:
                      </label>
                      <input
                        type="number"
                        value={summaryForm.total_orders}
                        onChange={(e) => setSummaryForm({ ...summaryForm, total_orders: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Xem Trước Chỉ Số KPI Tính Được */}
                  <div className="pt-3 border-t border-slate-800">
                    <span className="block text-[11px] font-bold text-slate-400 mb-2">
                      Xem Trước Chỉ Số KPI Cả Kỳ Tính Được:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400">CTR Kỳ</span>
                        <div className="text-sm font-bold text-indigo-300 font-mono">
                          {formatPercent(previewCtr)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400">CPC Kỳ</span>
                        <div className="text-sm font-bold text-amber-300 font-mono">
                          {previewCpc ? formatVND(previewCpc) : 'N/A'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400">CPA Kỳ</span>
                        <div className="text-sm font-bold text-emerald-300 font-mono">
                          {previewCpa ? formatVND(previewCpa) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:px-8 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {draft ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Chọn Ảnh Khác
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { handleReset(); onClose(); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Hủy
            </button>

            {draft && (
              <button
                type="button"
                onClick={handleSaveSummary}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu số liệu đã tự đối chiếu (demo OCR)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
