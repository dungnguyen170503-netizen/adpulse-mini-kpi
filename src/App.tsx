import React, { useState, useEffect, useMemo } from 'react';
import { DailyAdRecord, CampaignReportSnapshot } from './types/campaign';
import {
  saveCampaignData,
  loadCampaignData,
  clearCampaignData,
  getLastSavedTimestamp
} from './utils/storage';
import { calculatePeriodAggregates } from './utils/kpiEngine';
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
  ArrowRight
} from 'lucide-react';

export const App: React.FC = () => {
  // 1. Khởi tạo state từ LocalStorage (hoặc nạp mặc định nếu rỗng)
  const [records, setRecords] = useState<DailyAdRecord[]>(() => {
    const saved = loadCampaignData();
    if (saved && saved.length > 0) {
      return saved;
    }
    // Lần đầu vào app, nạp dữ liệu chuẩn
    return DEFAULT_CAMPAIGN_DATA;
  });

  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => getLastSavedTimestamp());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Modal xử lý trùng ngày
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    dates: string[];
    pendingRows?: DailyAdRecord[];
  }>({ isOpen: false, dates: [] });

  // 2. Đồng bộ bền vững vào LocalStorage khi records thay đổi
  useEffect(() => {
    saveCampaignData(records);
    setLastSavedAt(new Date().toISOString());
  }, [records]);

  // 3. Tính toán toàn bộ chỉ số qua Lõi KPI Chung (Single Source of Truth)
  const snapshot: CampaignReportSnapshot = useMemo(() => {
    return calculatePeriodAggregates(records);
  }, [records]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Handlers CRUD
  const handleAddSingle = (record: DailyAdRecord) => {
    // Kiểm tra xem ngày có bị trùng không
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

  // Lưu batch từ Modal nhiều dòng
  const handleBatchSave = (newRows: DailyAdRecord[]) => {
    const combined = [...records, ...newRows];
    const duplicates = findDuplicateDates(combined);
    const duplicateDates = Object.keys(duplicates);

    if (duplicateDates.length > 0) {
      // Mở modal hỏi gộp hay ghi đè
      setDuplicateModal({
        isOpen: true,
        dates: duplicateDates,
        pendingRows: newRows
      });
      return;
    }

    setRecords(combined.sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Đã lưu thành công ${newRows.length} ngày số liệu vào LocalStorage!`, 'success');
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
    showToast(`Đã nạp ${name} (${dataset.length} ngày) vào hệ thống!`, 'info');
  };

  // Thử nghiệm tải lại trang để chứng minh tính bền vững
  const handleReloadPage = () => {
    showToast('Đang tải lại trang web...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Xóa toàn bộ
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu trong LocalStorage?')) {
      setRecords([]);
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
        onLoadDataset1={() => handleLoadDataset(DATASET_1_NORMAL, 'Bộ 1: Chuẩn mực E-Commerce')}
        onLoadDataset2={() => handleLoadDataset(DATASET_2_DIRTY, 'Bộ 2: Dữ liệu Lỗi/Thiếu')}
        onLoadDataset3={() => handleLoadDataset(DATASET_3_EDGE, 'Bộ 3: Trường hợp Biên & Số 0')}
        onReloadPage={handleReloadPage}
        onClearAll={handleClearAll}
        onOpenMultiModal={() => setIsMultiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Banner Trạng Thái Module D1 & K1 */}
        <section className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BƯỚC 2: NHẬP TAY • LOCALSTORAGE • KPI CHUNG</span>
              </span>
              <span className="text-xs text-slate-400">
                Kỳ: {snapshot.meta.periodStart || '—'} đến {snapshot.meta.periodEnd || '—'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              Dữ liệu được lưu trữ trực tiếp vào <code className="text-emerald-400 font-mono">localStorage</code>. Hãy thử bấm nút <b>"Thử F5 Tải Lại"</b> trên thanh công cụ để xác minh dữ liệu không bị mất sau khi tải lại trang.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsMultiModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Mở Modal Nhập Nhiều Dòng</span>
            </button>
          </div>
        </section>

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
          AdPulse Mini KPI Dashboard • Đề 7, Bảng B • Phụ trách bởi Thanh Dũng (Data, KpiEngine, LocalStorage)
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Tuân thủ Contract C1 • Phân biệt rạch ròi giữa 0 và null • Weighted Period Aggregation
        </p>
      </footer>

      {/* Modal Nhập Nhiều Dòng */}
      <MultiRowEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        onSave={handleBatchSave}
        existingDates={records.map(r => r.date)}
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
