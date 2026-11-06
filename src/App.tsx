import React, { useState, useEffect, useMemo } from 'react';
import { DailyAdRecord, CampaignReportSnapshot, PeriodSummaryRecord } from './types/campaign';
import {
  saveCampaignData,
  loadCampaignData,
  clearCampaignData,
  getLastSavedTimestamp
} from './utils/storage';
import { calculatePeriodAggregates, formatVND, formatPercent } from './utils/kpiEngine';
import { mergeDuplicateRecords, findDuplicateDates } from './utils/validation';
import {
  DATASET_1_NORMAL,
  DATASET_2_DIRTY,
  DATASET_3_EDGE,
  DEFAULT_CAMPAIGN_DATA
} from './data/sampleData';
import { Navbar } from './components/Navbar';
import { KpiStatsGrid } from './components/KpiStatsGrid';
import { DataTable } from './components/DataTable';
import { MultiRowEntryModal } from './components/MultiRowEntryModal';
import { FileImportModal } from './components/FileImportModal';
import { ImageImportModal } from './components/ImageImportModal';
import { PdfExportModal } from './components/PdfExportModal';
import { DuplicateResolutionModal } from './components/DuplicateResolutionModal';
import { Toast } from './components/Toast';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  FileSpreadsheet,
  Image as ImageIcon,
  FileDown,
  ArrowRight,
  Database
} from 'lucide-react';

const SUMMARY_STORAGE_KEY = 'adpulse_summary_snapshot_v1';

export const App: React.FC = () => {
  // 1. Khởi tạo state dữ liệu theo ngày từ LocalStorage
  const [records, setRecords] = useState<DailyAdRecord[]>(() => {
    const saved = loadCampaignData();
    if (saved && saved.length > 0) return saved;
    return DEFAULT_CAMPAIGN_DATA;
  });

  // Bản ghi tổng kỳ nhận từ ảnh chụp OCR (nếu có)
  const [summarySnapshot, setSummarySnapshot] = useState<PeriodSummaryRecord | null>(() => {
    try {
      const saved = localStorage.getItem(SUMMARY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => getLastSavedTimestamp());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Modal xử lý trùng ngày
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    dates: string[];
    pendingRows?: DailyAdRecord[];
  }>({ isOpen: false, dates: [] });

  // 2. Đồng bộ LocalStorage
  useEffect(() => {
    saveCampaignData(records);
    setLastSavedAt(new Date().toISOString());
  }, [records]);

  useEffect(() => {
    if (summarySnapshot) {
      localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summarySnapshot));
    } else {
      localStorage.removeItem(SUMMARY_STORAGE_KEY);
    }
  }, [summarySnapshot]);

  // 3. Tính toán toàn bộ chỉ số qua Lõi KPI Chung (Single Source of Truth)
  const snapshot: CampaignReportSnapshot = useMemo(() => {
    const snap = calculatePeriodAggregates(records);
    if (summarySnapshot) {
      snap.summaryRecord = summarySnapshot;
    }
    return snap;
  }, [records, summarySnapshot]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Handlers CRUD
  const handleAddSingle = (record: DailyAdRecord) => {
    const existing = records.find(r => r.date === record.date);
    if (existing) {
      if (window.confirm(`Ngày ${record.date} đã tồn tại. Bạn có muốn cộng dồn số liệu vào ngày này không?`)) {
        const merged = mergeDuplicateRecords([...records, record]);
        setRecords(merged);
        showToast(`Đã gộp số liệu thành công cho ngày ${record.date}!`, 'success');
        return;
      }
    }

    setRecords(prev => [...prev, record].sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Đã thêm số liệu ngày ${record.date} vào hệ thống!`, 'success');
  };

  const handleUpdate = (updated: DailyAdRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    showToast(`Đã cập nhật số liệu ngày ${updated.date}!`, 'success');
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast('Đã xóa 1 dòng số liệu khỏi hệ thống.', 'info');
  };

  // Lưu batch từ Modal Nhập Tay, File Excel/CSV hoặc Text Copy
  const handleBatchSave = (newRows: DailyAdRecord[], sourceLabel: string = 'dữ liệu') => {
    const combined = [...records, ...newRows];
    const duplicates = findDuplicateDates(combined);
    const duplicateDates = Object.keys(duplicates);

    if (duplicateDates.length > 0) {
      setDuplicateModal({
        isOpen: true,
        dates: duplicateDates,
        pendingRows: newRows
      });
      return;
    }

    setRecords(combined.sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Đã nạp thành công ${newRows.length} ngày ${sourceLabel} vào LocalStorage!`, 'success');
  };

  // Lưu snapshot tổng kỳ từ Ảnh Chụp OCR
  const handleSaveSummarySnapshot = (summary: PeriodSummaryRecord) => {
    setSummarySnapshot(summary);
    showToast(`Đã lưu Snapshot Tổng Kỳ (${summary.period_start} - ${summary.period_end}) từ ảnh chụp!`, 'success');
  };

  // Xử lý gộp trùng lặp
  const handleMergeDuplicates = () => {
    if (!duplicateModal.pendingRows) return;
    const combined = [...records, ...duplicateModal.pendingRows];
    const merged = mergeDuplicateRecords(combined);
    setRecords(merged);
    setDuplicateModal({ isOpen: false, dates: [] });
    showToast('Đã tự động gộp các ngày trùng lặp thành công!', 'success');
  };

  // Xử lý ghi đè trùng lặp
  const handleOverwriteDuplicates = () => {
    if (!duplicateModal.pendingRows) return;
    const pendingDates = duplicateModal.pendingRows.map(r => r.date);
    const filteredExisting = records.filter(r => !pendingDates.includes(r.date));
    const combined = [...filteredExisting, ...duplicateModal.pendingRows];
    setRecords(combined.sort((a, b) => a.date.localeCompare(b.date)));
    setDuplicateModal({ isOpen: false, dates: [] });
    showToast('Đã ghi đè số liệu các ngày trùng lặp thành công!', 'info');
  };

  // Nạp 3 bộ dữ liệu thử nghiệm C1
  const handleLoadDataset = (dataset: DailyAdRecord[], name: string) => {
    setRecords(dataset);
    setSummarySnapshot(null);
    showToast(`Đã nạp ${name} (${dataset.length} ngày) vào hệ thống!`, 'info');
  };

  const handleReloadPage = () => {
    showToast('Đang tải lại trang web...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu trong LocalStorage?')) {
      setRecords([]);
      setSummarySnapshot(null);
      clearCampaignData();
      showToast('Đã dọn sạch toàn bộ dữ liệu.', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        recordCount={records.length}
        lastSavedAt={lastSavedAt}
        hasSummarySnapshot={!!summarySnapshot}
        onLoadDataset1={() => handleLoadDataset(DATASET_1_NORMAL, 'Bộ 1: Chuẩn mực E-Commerce')}
        onLoadDataset2={() => handleLoadDataset(DATASET_2_DIRTY, 'Bộ 2: Dữ liệu Lỗi/Thiếu')}
        onLoadDataset3={() => handleLoadDataset(DATASET_3_EDGE, 'Bộ 3: Trường hợp Biên & Số 0')}
        onReloadPage={handleReloadPage}
        onClearAll={handleClearAll}
        onOpenMultiModal={() => setIsMultiModalOpen(true)}
        onOpenFileImport={() => setIsFileModalOpen(true)}
        onOpenImageImport={() => setIsImageModalOpen(true)}
        onOpenPdfExport={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Banner Tổng Quan Nhiệm Vụ Hoàn Thành */}
        <section className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-rose-950/60 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>BƯỚC 4: XUẤT BÁO CÁO PDF TRỰC TIẾP (SSOT K1/R2)</span>
              </span>
              <span className="text-xs text-slate-400">
                Kỳ: {snapshot.meta.periodStart || '—'} đến {snapshot.meta.periodEnd || '—'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              Xuất trực tiếp file PDF chuyên nghiệp từ Snapshot dữ liệu chung. Số liệu, kỳ báo cáo và chỉ số KPI khớp 100% với Dashboard!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Mở Báo Cáo & Tải PDF</span>
            </button>
          </div>
        </section>

        {/* Thẻ Cảnh Báo Nếu Có Snapshot Tổng Kỳ Nhận Từ Ảnh */}
        {summarySnapshot && (
          <section className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    Snapshot Báo Cáo Tổng Kỳ (Từ Ảnh Chụp)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold">
                    {summarySnapshot.period_start} đến {summarySnapshot.period_end}
                  </span>
                </div>
                <p className="text-slate-300 mt-0.5 font-mono">
                  Chi phí: {formatVND(summarySnapshot.total_spend)} • Reach: {summarySnapshot.total_reach.toLocaleString()} • Clicks: {summarySnapshot.total_clicks.toLocaleString()} • Đơn: {summarySnapshot.total_orders} • CTR: {formatPercent((summarySnapshot.total_clicks / summarySnapshot.total_reach) * 100)} • CPC: {formatVND(summarySnapshot.total_spend / summarySnapshot.total_clicks)} • CPA: {formatVND(summarySnapshot.total_spend / summarySnapshot.total_orders)}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSummarySnapshot(null); showToast('Đã xóa Snapshot Tổng Kỳ.', 'info'); }}
              className="text-xs text-slate-400 hover:text-rose-400 underline self-end sm:self-auto"
            >
              Gỡ bỏ snapshot này
            </button>
          </section>
        )}

        {/* 7 Thẻ KPI Tổng Hợp (KpiStatsGrid) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Chỉ Số KPI Toàn Kỳ (Lõi Tính Toán Dùng Chung K1)</span>
            </h2>
            <span className="text-xs text-slate-500">
              Tổng cộng {snapshot.meta.totalDays} ngày hoạt động
            </span>
          </div>

          <KpiStatsGrid snapshot={snapshot} />
        </section>

        {/* Bảng Dữ Liệu Chi Tiết (DataTable) */}
        <section className="pt-2">
          <DataTable
            records={snapshot.dailyRecords}
            onAddSingle={handleAddSingle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onOpenMultiModal={() => setIsMultiModalOpen(true)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          AdPulse Mini KPI Dashboard • Đề 7, Bảng B • Phụ trách bởi Thanh Dũng (Data, KpiEngine, LocalStorage, Import & PDF Export)
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Xuất PDF trực tiếp từ Snapshot chung • Đối chiếu khớp 100% với Dashboard • Chữ Việt sắc nét không lỗi font
        </p>
      </footer>

      {/* Modal 1: Nhập Tay Nhiều Dòng */}
      <MultiRowEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        onSave={(rows) => handleBatchSave(rows, 'nhập tay')}
        existingDates={records.map(r => r.date)}
      />

      {/* Modal 2: Nhập File Excel / CSV & Text Copy */}
      <FileImportModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onConfirmImport={(rows) => handleBatchSave(rows, 'từ file/text')}
        existingDates={records.map(r => r.date)}
      />

      {/* Modal 3: Nhập Ảnh Chụp OCR */}
      <ImageImportModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onConfirmDailyImport={(rows) => handleBatchSave(rows, 'từ ảnh OCR')}
        onConfirmSummaryImport={handleSaveSummarySnapshot}
      />

      {/* Modal 4: Xuất Báo Cáo PDF Trực Tiếp (BƯỚC 4) */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        snapshot={snapshot}
      />

      {/* Modal Xử Lý Trùng Lặp Ngày */}
      <DuplicateResolutionModal
        isOpen={duplicateModal.isOpen}
        duplicateDates={duplicateModal.dates}
        onMerge={handleMergeDuplicates}
        onOverwrite={handleOverwriteDuplicates}
        onCancel={() => setDuplicateModal({ isOpen: false, dates: [] })}
      />

      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default App;
