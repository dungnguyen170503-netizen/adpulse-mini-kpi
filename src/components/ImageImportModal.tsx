import React, { useState } from 'react';
import { ImageOcrDraft, DailyAdRecord, PeriodSummaryRecord } from '../types/campaign';
import { analyzeAdImage, IMAGE_SUPPORT_CAPABILITIES } from '../utils/imageParser';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import { validateRow } from '../utils/validation';
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
  ShieldCheck,
  Plus,
  Trash2,
  Loader2
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
    notes: 'Trích xuất từ ảnh chụp Meta Ads Manager'
  });

  // State chỉnh sửa cho bản ghi theo ngày
  const [dailyRowsForm, setDailyRowsForm] = useState<Partial<DailyAdRecord>[]>([]);

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

      if (result.dailyRows) {
        setDailyRowsForm(result.dailyRows);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phân tích ảnh qua OCR');
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

  // Lưu bản ghi tổng kỳ (dành cho Khoa · UI)
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
      notes: summaryForm.notes,
      imageSourceUrl: draft?.imagePreviewUrl,
      imageFileName: draft?.fileName
    };

    onConfirmSummaryImport(summaryRecord);
    handleReset();
    onClose();
  };

  // Lưu các bản ghi theo ngày
  const handleSaveDailyRows = () => {
    if (dailyRowsForm.length === 0) {
      alert('Vui lòng thêm ít nhất 1 dòng dữ liệu ngày.');
      return;
    }

    const recordsToSave: DailyAdRecord[] = [];
    for (let i = 0; i < dailyRowsForm.length; i++) {
      const row = dailyRowsForm[i];
      if (!row.date || row.spend === undefined || row.reach === undefined || row.clicks === undefined || row.orders === undefined) {
        alert(`Dòng thứ ${i + 1} còn ô trống hoặc thiếu số liệu. Vui lòng nhập đủ trước khi lưu.`);
        return;
      }

      const completeRecord: DailyAdRecord = {
        id: `rec_ocr_${Date.now()}_${i}`,
        date: row.date,
        campaign_name: 'Chiến dịch Facebook Ads',
        spend: Number(row.spend),
        reach: Number(row.reach),
        clicks: Number(row.clicks),
        orders: Number(row.orders),
        source_type: 'image_ocr',
        status: 'valid',
        notes: row.notes || `OCR (${draft?.confidenceScore ?? 80}%)`
      };

      const validation = validateRow(completeRecord);
      if (!validation.isValid) {
        alert(`Dòng ngày ${row.date} không hợp lệ: ${Object.values(validation.errors).join(', ')}`);
        return;
      }

      recordsToSave.push(completeRecord);
    }

    onConfirmDailyImport(recordsToSave);
    handleReset();
    onClose();
  };

  const handleUpdateRow = (index: number, field: keyof DailyAdRecord, val: any) => {
    setDailyRowsForm(prev => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: val };
      return clone;
    });
  };

  const handleAddEmptyRow = () => {
    setDailyRowsForm(prev => [
      ...prev,
      { date: '', spend: 0, reach: 0, clicks: 0, orders: 0, notes: 'Thêm thủ công' }
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setDailyRowsForm(prev => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFile(null);
    setDraft(null);
    setError(null);
    setDailyRowsForm([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Banner thông báo chất lượng OCR */}
        <div className="p-3 px-6 bg-indigo-950/80 border-b border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <b>OCR Tesseract.js trích xuất trực tiếp từ pixel ảnh thật:</b> Xem trước cạnh ảnh gốc, cho phép chỉnh sửa mọi ô mờ trước khi lưu.
            </span>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 hidden md:inline">Single Source of Truth</span>
        </div>

        {/* Header */}
        <div className="p-5 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Nhập Dữ Liệu Từ Ảnh Chụp Báo Cáo Meta Ads (OCR Thật)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Phân tích ký tự từ ảnh • Phân biệt bảng theo ngày và tổng kỳ • Cho phép đối chiếu và sửa trước khi lưu
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
          {isLoading && (
            <div className="p-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <p className="text-sm font-semibold text-white">Đang chạy Tesseract OCR nhận diện pixel ảnh thật...</p>
              <p className="text-xs text-slate-400">Quá trình phân tích bảng số liệu có thể mất vài giây.</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !draft && (
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
                  Hỗ trợ: PNG, JPG, JPEG, WebP (Rõ nét từ 720p trở lên, góc thẳng)
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
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {IMAGE_SUPPORT_CAPABILITIES.supported.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Giới hạn chưa hỗ trợ:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {IMAGE_SUPPORT_CAPABILITIES.unsupported.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!isLoading && draft && (
            /* Bước 2: Xem trước và chỉnh sửa chỗ mơ hồ */
            <div className="space-y-6">
              {/* Cảnh báo tính toàn vẹn dữ liệu */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-purple-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">
                    {draft.mode === 'period_summary'
                      ? 'Ảnh Báo Cáo Tổng Kỳ (Không Tự Sinh Dữ Liệu Ngày Giả)'
                      : 'Bảng Dữ Liệu Bóc Tách Theo Ngày'}
                  </p>
                  <p className="text-slate-300">
                    Độ tin cậy OCR: <b>{draft.confidenceScore}%</b>. {draft.ambiguities.join(' ')}
                  </p>
                </div>
              </div>

              {/* Giao diện đối chiếu: Ảnh chụp bên trái vs Form chỉnh sửa bên phải */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Ảnh chụp gốc bên trái (5 cols) */}
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Ảnh Chụp Báo Cáo Gốc (Đối Chiếu):</span>
                  </span>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center max-h-96">
                    <img
                      src={draft.imagePreviewUrl}
                      alt="Ads Screenshot Preview"
                      className="max-h-88 object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Tệp: <span className="font-mono text-slate-300">{draft.fileName}</span>
                  </p>
                </div>

                {/* Form Đối Chiếu & Chỉnh Sửa bên phải (7 cols) */}
                <div className="lg:col-span-7 space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  {draft.mode === 'period_summary' ? (
                    /* Giao diện chỉnh sửa cho Bản Ghi Tổng Kỳ */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Số Liệu Tổng Kỳ (Cho Phép Sửa):</span>
                        </h4>
                        <span className="text-[11px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-500/30">
                          Period Summary Only
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
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

                        <div>
                          <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                            * Tổng Reach:
                          </label>
                          <input
                            type="number"
                            value={summaryForm.total_reach}
                            onChange={(e) => setSummaryForm({ ...summaryForm, total_reach: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                            * Tổng Clicks:
                          </label>
                          <input
                            type="number"
                            value={summaryForm.total_clicks}
                            onChange={(e) => setSummaryForm({ ...summaryForm, total_clicks: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>

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
                  ) : (
                    /* Giao diện chỉnh sửa cho Bảng Chi Tiết Theo Ngày */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Bảng Chi Tiết Theo Ngày ({dailyRowsForm.length} ngày):</span>
                        </h4>
                        <button
                          type="button"
                          onClick={handleAddEmptyRow}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm ngày</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-900 text-slate-400 sticky top-0">
                            <tr>
                              <th className="p-2 pl-3">Ngày</th>
                              <th className="p-2">Chi phí (VNĐ)</th>
                              <th className="p-2">Reach</th>
                              <th className="p-2">Clicks</th>
                              <th className="p-2">Orders</th>
                              <th className="p-2 pr-3 text-center">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {dailyRowsForm.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40">
                                <td className="p-2 pl-3">
                                  <input
                                    type="date"
                                    value={row.date || ''}
                                    onChange={(e) => handleUpdateRow(idx, 'date', e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs w-32"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={row.spend ?? ''}
                                    placeholder="0"
                                    onChange={(e) => handleUpdateRow(idx, 'spend', e.target.value === '' ? undefined : Number(e.target.value))}
                                    className={`bg-slate-900 border rounded px-2 py-1 text-white text-xs w-28 font-mono ${row.spend === undefined ? 'border-amber-500 bg-amber-950/20' : 'border-slate-700'}`}
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={row.reach ?? ''}
                                    placeholder="0"
                                    onChange={(e) => handleUpdateRow(idx, 'reach', e.target.value === '' ? undefined : Number(e.target.value))}
                                    className={`bg-slate-900 border rounded px-2 py-1 text-white text-xs w-24 font-mono ${row.reach === undefined ? 'border-amber-500 bg-amber-950/20' : 'border-slate-700'}`}
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={row.clicks ?? ''}
                                    placeholder="0"
                                    onChange={(e) => handleUpdateRow(idx, 'clicks', e.target.value === '' ? undefined : Number(e.target.value))}
                                    className={`bg-slate-900 border rounded px-2 py-1 text-white text-xs w-20 font-mono ${row.clicks === undefined ? 'border-amber-500 bg-amber-950/20' : 'border-slate-700'}`}
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={row.orders ?? ''}
                                    placeholder="0"
                                    onChange={(e) => handleUpdateRow(idx, 'orders', e.target.value === '' ? undefined : Number(e.target.value))}
                                    className={`bg-slate-900 border rounded px-2 py-1 text-white text-xs w-20 font-mono ${row.orders === undefined ? 'border-amber-500 bg-amber-950/20' : 'border-slate-700'}`}
                                  />
                                </td>
                                <td className="p-2 pr-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRow(idx)}
                                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        * Các ô màu vàng là ô chưa nhận diện rõ từ ảnh. Vui lòng đối chiếu với ảnh gốc và điền bổ sung trước khi lưu.
                      </p>
                    </div>
                  )}
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

            {draft && draft.mode === 'period_summary' && (
              <button
                type="button"
                onClick={handleSaveSummary}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Bản Ghi Tổng Kỳ (Khoa · UI)</span>
              </button>
            )}

            {draft && draft.mode === 'daily_rows' && (
              <button
                type="button"
                onClick={handleSaveDailyRows}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Nạp Bảng Dữ Liệu Ngày (OCR)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
