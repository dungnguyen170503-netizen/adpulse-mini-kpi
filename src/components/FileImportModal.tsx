import React, { useState } from 'react';
import { DailyAdRecord, ColumnMapping, RawParseResult } from '../types/campaign';
import { parseExcelFile, parseDelimitedText, applyColumnMapping } from '../utils/fileParser';
import { calculateDailyMetrics, formatVND } from '../utils/kpiEngine';
import { validateRow } from '../utils/validation';
import {
  X,
  Upload,
  FileSpreadsheet,
  ClipboardPaste,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface FileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (records: DailyAdRecord[]) => void;
  existingDates: string[];
}

export const FileImportModal: React.FC<FileImportModalProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
  existingDates
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'clipboard'>('file');
  const [clipboardText, setClipboardText] = useState('');
  const [parseResult, setParseResult] = useState<RawParseResult | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [draftRecords, setDraftRecords] = useState<DailyAdRecord[]>([]);
  const [step, setStep] = useState<'input' | 'mapping' | 'preview'>('input');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Xử lý nạp file Excel hoặc CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const result = await parseExcelFile(file);
        setParseResult(result);
        setMapping(result.suggestedMapping);
        setStep('mapping');
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
        const text = await file.text();
        const result = parseDelimitedText(text, file.name);
        setParseResult(result);
        setMapping(result.suggestedMapping);
        setStep('mapping');
      } else {
        setErrorMessage('Định dạng file chưa được hỗ trợ. Vui lòng chọn file .xlsx, .xls hoặc .csv');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc file. Vui lòng kiểm tra định dạng.');
    }
  };

  // Xử lý nạp từ clipboard text
  const handleClipboardParse = () => {
    setErrorMessage(null);
    try {
      const result = parseDelimitedText(clipboardText);
      setParseResult(result);
      setMapping(result.suggestedMapping);
      setStep('mapping');
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc văn bản dán. Vui lòng đảm bảo có ít nhất 1 dòng tiêu đề và 1 dòng số liệu.');
    }
  };

  // Áp dụng ánh xạ và chuyển sang bước xem trước
  const handleProceedToPreview = () => {
    if (!parseResult || !mapping) return;
    if (!mapping.date || !mapping.spend) {
      alert('Vui lòng chọn ít nhất cột Ngày và cột Chi phí!');
      return;
    }

    const records = applyColumnMapping(
      parseResult.rows,
      mapping,
      activeTab === 'clipboard' ? 'text_copy' : 'excel_csv'
    );

    setDraftRecords(records);
    setStep('preview');
  };

  // Cho phép người dùng sửa trực tiếp trong bảng xem trước
  const handleDraftChange = (index: number, field: keyof DailyAdRecord, value: any) => {
    setDraftRecords(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Xác nhận lưu vào hệ thống
  const handleFinalSave = () => {
    if (draftRecords.some(r => !validateRow(r).isValid)) { alert('Vui lòng sửa các ô trống/sai trước khi lưu. Số 0 cần được nhập rõ.'); return; }
    onConfirmImport(draftRecords);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setParseResult(null);
    setMapping(null);
    setDraftRecords([]);
    setClipboardText('');
    setErrorMessage(null);
    setStep('input');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Nhập Dữ Liệu Từ File Excel / CSV & Text Copy
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ tự động nhận diện cột • Bản xem trước & sửa số liệu mơ hồ trước khi lưu • Tránh trùng lặp
            </p>
          </div>
          <button
            onClick={() => { handleReset(); onClose(); }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh Điều Hướng Bước (Wizard Steps) */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 'input' ? 'text-indigo-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'input' ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1</span>
            <span>Chọn nguồn nạp</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-2 ${step === 'mapping' ? 'text-indigo-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'mapping' ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2</span>
            <span>Ánh xạ cột dữ liệu</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-indigo-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'preview' ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>3</span>
            <span>Xem trước & sửa đổi</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* BƯỚC 1: CHỌN NGUỒN NẠP */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === 'file'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Tải Lên File Excel (.xlsx) / CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('clipboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === 'clipboard'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>Dán Văn Bản Từ Clipboard (Google Sheets / TSV)</span>
                </button>
              </div>

              {activeTab === 'file' ? (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40 group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      Kéo thả hoặc bấm để chọn file Excel / CSV
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Hỗ trợ: .xlsx, .xls, .csv, .tsv (Tối đa 10MB)
                    </span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.tsv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Phạm vi hỗ trợ */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-200">Ghi chú định dạng:</p>
                    <p>• Hỗ trợ bảng tính chuẩn từ Meta Ads Manager, Google Sheets, Excel có hàng tiêu đề.</p>
                    <p>• Tự động xử lý ký hiệu tiền tệ (VNĐ, đ) và dấu phân cách hàng nghìn kiểu Việt Nam.</p>
                    <p>• <b>Chưa hỗ trợ:</b> File Excel cài mật khẩu, file chứa macro nhị phân .xlsm bị lỗi cấu trúc.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Dán toàn bộ bảng số liệu sao chép từ Google Sheets, Excel hoặc tin nhắn Zalo/Email:
                    </label>
                    <textarea
                      rows={8}
                      value={clipboardText}
                      onChange={(e) => setClipboardText(e.target.value)}
                      placeholder={`Ngày\tChi phí\tReach\tClicks\tĐơn hàng\n2026-11-01\t300000\t5000\t150\t6\n2026-11-02\t450000\t7500\t210\t9`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!clipboardText.trim()}
                    onClick={handleClipboardParse}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                  >
                    <span>Phân Tích Dữ Liệu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 2: ÁNH XẠ CỘT DỮ LIỆU */}
          {step === 'mapping' && parseResult && mapping && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Kiểm Tra & Điều Chỉnh Ánh Xạ Cột
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hệ thống đã tự động ghép cột. Bạn có thể thay đổi nếu nhận diện chưa đúng:
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  Phát hiện {parseResult.rows.length} dòng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Cột Ngày */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-indigo-400 mb-1.5">
                    * Cột Ngày (Date):
                  </label>
                  <select
                    value={mapping.date}
                    onChange={(e) => setMapping({ ...mapping, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn cột Ngày --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Cột Chi Phí */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-indigo-400 mb-1.5">
                    * Cột Chi Phí (Spend):
                  </label>
                  <select
                    value={mapping.spend}
                    onChange={(e) => setMapping({ ...mapping, spend: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn cột Chi Phí --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Cột Reach */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Cột Reach (Tiếp cận):
                  </label>
                  <select
                    value={mapping.reach}
                    onChange={(e) => setMapping({ ...mapping, reach: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn cột Reach --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Cột Clicks */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Cột Clicks (Nhấp):
                  </label>
                  <select
                    value={mapping.clicks}
                    onChange={(e) => setMapping({ ...mapping, clicks: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn cột Clicks --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Cột Đơn hàng */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Cột Đơn Hàng (Orders):
                  </label>
                  <select
                    value={mapping.orders}
                    onChange={(e) => setMapping({ ...mapping, orders: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn cột Đơn hàng --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Cột Tên chiến dịch */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    Tên Chiến Dịch (Tùy chọn):
                  </label>
                  <select
                    value={mapping.campaign_name || ''}
                    onChange={(e) => setMapping({ ...mapping, campaign_name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Không chọn (Mặc định) --</option>
                    {parseResult.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dữ liệu mẫu 2 dòng đầu */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">Xem trước 2 dòng đầu từ nguồn:</span>
                <div className="overflow-x-auto border border-slate-800 rounded-xl p-3 bg-slate-950 font-mono text-[11px] text-slate-300">
                  <pre>{JSON.stringify(parseResult.rows.slice(0, 2), null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: XEM TRƯỚC BẢN NHÁP & SỬA ĐỔI */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Bản Xem Trước Dữ Liệu & Chỉnh Sửa Trực Tiếp
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    "Nguồn nào đọc không rõ thì cho sửa trước khi lưu" • Kiểm tra số liệu trước khi ghi vào LocalStorage
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('mapping')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Đổi Ánh Xạ
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl max-h-72">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Ngày</th>
                      <th className="py-2.5 px-3 text-right">Reach</th>
                      <th className="py-2.5 px-3 text-right">Clicks</th>
                      <th className="py-2.5 px-3 text-right">Chi Phí (VNĐ)</th>
                      <th className="py-2.5 px-3 text-right">Đơn Hàng</th>
                      <th className="py-2.5 px-3 bg-indigo-950/20 text-indigo-300">KPI Dự Kiến</th>
                      <th className="py-2.5 px-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {draftRecords.map((r, idx) => {
                      const kpis = calculateDailyMetrics(r);
                      const isDup = existingDates.includes(r.date);

                      return (
                        <tr key={r.id} className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-slate-500 font-sans">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              value={r.date}
                              onChange={(e) => handleDraftChange(idx, 'date', e.target.value)}
                              className="bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-white"
                            />
                            {isDup && (
                              <span className="block text-[10px] text-amber-400 font-sans">
                                ⚠️ Trùng ngày đã có
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={Number.isFinite(r.reach) ? r.reach : ""}
                              onChange={(e) => handleDraftChange(idx, 'reach', e.target.value === '' ? NaN : Number(e.target.value))}
                              className="w-20 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-right text-white"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={Number.isFinite(r.clicks) ? r.clicks : ""}
                              onChange={(e) => handleDraftChange(idx, 'clicks', e.target.value === '' ? NaN : Number(e.target.value))}
                              className="w-16 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-right text-white"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={Number.isFinite(r.spend) ? r.spend : ""}
                              onChange={(e) => handleDraftChange(idx, 'spend', e.target.value === '' ? NaN : Number(e.target.value))}
                              className="w-24 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-right text-white"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={Number.isFinite(r.orders) ? r.orders : ""}
                              onChange={(e) => handleDraftChange(idx, 'orders', e.target.value === '' ? NaN : Number(e.target.value))}
                              className="w-16 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-right text-white"
                            />
                          </td>
                          <td className="py-2 px-3 bg-indigo-950/10 font-sans text-[11px]">
                            <span className="text-indigo-300 font-semibold font-mono">CTR {kpis.ctr.formatted}</span> •{' '}
                            <span className="text-amber-300 font-mono">CPC {kpis.cpc.formatted}</span>
                          </td>
                          <td className="py-2 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                              Sẵn sàng
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:px-8 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { handleReset(); onClose(); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Hủy
            </button>

            {step === 'mapping' && (
              <button
                type="button"
                onClick={handleProceedToPreview}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                <span>Xem Trước ({parseResult?.rows.length} Dòng)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'preview' && (
              <button
                type="button"
                onClick={handleFinalSave}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Lưu Vào LocalStorage</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
