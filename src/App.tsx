import { AiPanel } from './components/AiPanel';
import React, { useState, useEffect, useMemo } from 'react';
import { DailyAdRecord, CampaignReportSnapshot, PeriodSummaryRecord } from './types/campaign';
import {
  saveCampaignData,
  loadCampaignData,
  clearCampaignData,
  getLastSavedTimestamp,
  markAppInitialized
} from './utils/storage';
import { calculatePeriodAggregates, formatVND } from './utils/kpiEngine';
import { mergeDuplicateRecords, findDuplicateDates } from './utils/validation';
import {
  DATASET_1_NORMAL,
  DATASET_2_DIRTY,
  DATASET_3_EDGE,
  DEFAULT_CAMPAIGN_DATA,
  SAMPLE_PERIOD_SUMMARY
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
import { PeriodFilterBar } from './components/PeriodFilterBar';
import { AnalysisView } from './components/AnalysisView';
import { ReportView } from './components/ReportView';
import {
  PeriodFilter,
  filterRecords,
  resolvePeriod,
  periodLabel,
  buildDailySeries,
  buildSnapshotFromSummary,
  dataVersionOf,
  sourceLabelOf,
  isSampleDataSnapshot,
  formatDateVN
} from './report/reportModel';
import {
  Sparkles,
  Layers,
  FileSpreadsheet,
  Image as ImageIcon,
  FileDown,
  ArrowRight,
  ClipboardPaste,
  FlaskConical,
  PlusCircle
} from 'lucide-react';

const SUMMARY_STORAGE_KEY = 'adpulse_summary_snapshot_v1';

export const App: React.FC = () => {
  // 1. Khởi tạo state dữ liệu theo ngày từ LocalStorage (hàm khởi tạo thuần khiết cho React StrictMode)
  const [records, setRecords] = useState<DailyAdRecord[]>(() => {
    const saved = loadCampaignData();
    if (saved !== null) return saved;
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
  const [fileModalDefaultTab, setFileModalDefaultTab] = useState<'file' | 'clipboard'>('file');
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
  type Tab = 'overview' | 'analysis' | 'report';
  const [tab, setTab] = useState<Tab>('overview');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({ preset: 'all' });
  const [pdfSnapshot, setPdfSnapshot] = useState<CampaignReportSnapshot | null>(null);

  const snapshot: CampaignReportSnapshot = useMemo(() => {
    // Khi người dùng chọn/nhập Ảnh tổng kỳ (PeriodSummaryRecord) làm nguồn dữ liệu:
    // dùng thẳng buildSnapshotFromSummary (gọi calculateDailyMetrics của Dũng) để Dashboard và 4 định dạng báo cáo cùng số.
    if (summarySnapshot && records.length === 0) {
      return buildSnapshotFromSummary(summarySnapshot);
    }
    const snap = calculatePeriodAggregates(filterRecords(records, periodFilter));
    const period = resolvePeriod(records, periodFilter);
    if (period) {
      snap.meta.periodStart = period.from;
      snap.meta.periodEnd = period.to;
    }
    if (summarySnapshot) {
      snap.summaryRecord = summarySnapshot;
    }
    return snap;
  }, [records, summarySnapshot, periodFilter]);

  const requestedPeriod = useMemo(() => resolvePeriod(records, periodFilter), [records, periodFilter]);
  const seriesInfo = useMemo(() => buildDailySeries(snapshot), [snapshot]);
  const [frozenSnapshot, setFrozenSnapshot] = useState<CampaignReportSnapshot>(() => snapshot);
  const [hasCreatedReport, setHasCreatedReport] = useState(false);

  // Trước khi người dùng mở tab Báo cáo lần đầu, tự động đồng bộ để sau khi nhập liệu + chọn kỳ xong
  // bấm sang Báo cáo là có ngay số vừa nhập. Sau khi đã tạo/mở báo cáo, giữ nguyên bản cũ và hiện cảnh báo khi đổi kỳ/dữ liệu.
  useEffect(() => {
    if (!hasCreatedReport && !frozenSnapshot.ai) {
      setFrozenSnapshot(snapshot);
    }
  }, [snapshot, hasCreatedReport, frozenSnapshot.ai]);

  useEffect(() => {
    if (tab === 'report') {
      setHasCreatedReport(true);
    }
  }, [tab]);

  const activeSourceLabel = useMemo(() => sourceLabelOf(snapshot), [snapshot]);
  const isSampleData = useMemo(() => isSampleDataSnapshot(snapshot), [snapshot]);
  const isSummaryOnly = !!summarySnapshot && records.length === 0;
  const isEmptyState = records.length === 0 && !summarySnapshot;

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const openFileImportWithTab = (tabMode: 'file' | 'clipboard' = 'file') => {
    setFileModalDefaultTab(tabMode);
    setIsFileModalOpen(true);
  };

  // Handlers CRUD
  const handleAddSingle = (record: DailyAdRecord) => {
    const existing = records.find(r => r.date === record.date);
    if (existing) {
      if (window.confirm(`Ngày ${record.date} đã tồn tại. Bạn có muốn cộng dồn số liệu vào ngày này không?`)) {
        const merged = mergeDuplicateRecords([...records, record]);
        setSummarySnapshot(null);
        setRecords(merged);
        showToast(`Đã gộp số liệu thành công cho ngày ${record.date}!`, 'success');
        return;
      }
    }

    setSummarySnapshot(null);
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

    setSummarySnapshot(null);
    setRecords(combined.sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Đã nạp thành công ${newRows.length} ngày ${sourceLabel} vào hệ thống!`, 'success');
  };

  // Lưu snapshot tổng kỳ từ Ảnh Chụp OCR — dùng làm nguồn chính cho cả Dashboard và 4 định dạng xuất
  const handleSaveSummarySnapshot = (summary: PeriodSummaryRecord) => {
    setRecords([]);
    setSummarySnapshot(summary);
    showToast(
      `Đã áp dụng số liệu Ảnh tổng kỳ (${formatDateVN(summary.period_start)} – ${formatDateVN(summary.period_end)}) cho toàn bộ Dashboard & Báo cáo!`,
      'success'
    );
  };

  // Xử lý gộp trùng lặp
  const handleMergeDuplicates = () => {
    if (!duplicateModal.pendingRows) return;
    const combined = [...records, ...duplicateModal.pendingRows];
    const merged = mergeDuplicateRecords(combined);
    setSummarySnapshot(null);
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
    setSummarySnapshot(null);
    setRecords(combined.sort((a, b) => a.date.localeCompare(b.date)));
    setDuplicateModal({ isOpen: false, dates: [] });
    showToast('Đã ghi đè số liệu các ngày trùng lặp thành công!', 'info');
  };

  // Nạp các bộ dữ liệu mẫu C1
  const handleLoadDataset = (dataset: DailyAdRecord[], name: string) => {
    setSummarySnapshot(null);
    setRecords(dataset);
    showToast(`Đã nạp ${name} (${dataset.length} dòng) vào hệ thống!`, 'info');
  };

  const handleLoadSampleSummary = () => {
    setRecords([]);
    setSummarySnapshot(SAMPLE_PERIOD_SUMMARY);
    showToast('Đã nạp mẫu Ảnh tổng kỳ (01/11/2026 – 07/11/2026) cho Dashboard và 4 định dạng báo cáo!', 'info');
  };

  const handleReloadPage = () => {
    showToast('Đang tải lại trang web...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu để bắt đầu từ màn trống?')) {
      setRecords([]);
      setSummarySnapshot(null);
      clearCampaignData();
      showToast('Đã xóa toàn bộ dữ liệu. Hãy chọn Nhập dữ liệu hoặc Dùng dữ liệu mẫu.', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        recordCount={records.length}
        lastSavedAt={lastSavedAt}
        hasSummarySnapshot={!!summarySnapshot}
        sourceLabel={activeSourceLabel}
        isSampleData={isSampleData}
        onLoadDataset1={() => handleLoadDataset(DATASET_1_NORMAL, 'Bộ 1: Chuẩn mực E-Commerce')}
        onLoadDataset2={() => handleLoadDataset(DATASET_2_DIRTY, 'Bộ 2: Dữ liệu Lỗi/Thiếu')}
        onLoadDataset3={() => handleLoadDataset(DATASET_3_EDGE, 'Bộ 3: Trường hợp Biên & Số 0')}
        onLoadSampleSummary={handleLoadSampleSummary}
        onReloadPage={handleReloadPage}
        onClearAll={handleClearAll}
        onOpenMultiModal={() => setIsMultiModalOpen(true)}
        onOpenFileImport={openFileImportWithTab}
        onOpenImageImport={() => setIsImageModalOpen(true)}
        onOpenPdfExport={() => setIsPdfModalOpen(true)}
      />

      {/* Tabs desktop/tablet (Khoa · U1) */}
      <nav aria-label="Góc nhìn" className="hidden md:block border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-1" role="tablist">
            {([['overview', 'Tổng quan'], ['analysis', 'Phân tích'], ['report', 'Báo cáo']] as const).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  tab === id ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 hidden lg:inline">
            Quy trình 3 bước: <b>1. Nhập dữ liệu</b> → <b>2. Chọn kỳ & xem KPI</b> → <b>3. Sang tab Báo cáo để xuất gửi sếp</b>
          </span>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 md:py-7 space-y-5 pb-24 md:pb-8">
        <PeriodFilterBar
          filter={periodFilter}
          onChange={setPeriodFilter}
          rangeLabel={periodLabel(snapshot, requestedPeriod)}
          daysWithData={seriesInfo.daysWithData}
          daysInRange={seriesInfo.daysInRange}
          sourceLabel={activeSourceLabel}
          isSummaryOnly={isSummaryOnly}
          summaryStart={summarySnapshot?.period_start}
          summaryEnd={summarySnapshot?.period_end}
          totalRecordRows={snapshot.dailyRecords.length}
        />

        {tab === 'analysis' && (
          <>
            <AnalysisView
              snapshot={snapshot}
              onOpenImport={() => setIsMultiModalOpen(true)}
              onLoadSampleDaily={() => handleLoadDataset(DATASET_1_NORMAL, 'Bộ 1: Chuẩn mực E-Commerce')}
            />
            <AiPanel
              key={snapshot.meta.snapshotId}
              snapshot={dataVersionOf(frozenSnapshot) === dataVersionOf(snapshot) ? { ...snapshot, ai: frozenSnapshot.ai } : snapshot}
              onReady={(ai) => setFrozenSnapshot({ ...snapshot, ai })}
              defaultCollapsed={true}
            />
          </>
        )}

        {tab === 'report' && (
          <ReportView
            current={snapshot}
            frozen={frozenSnapshot}
            onRefreshFrozen={() => setFrozenSnapshot(snapshot)}
            onAi={(ai) => setFrozenSnapshot(previous => previous.meta.snapshotId === ai.snapshotId ? { ...previous, ai } : previous)}
            onOpenPdf={(snap) => { setPdfSnapshot(snap); setIsPdfModalOpen(true); }}
            onToast={showToast}
          />
        )}

        {tab === 'overview' && (
          <>
            {/* Trạng thái Chưa có dữ liệu (S1 Empty State): hướng dẫn người mới bắt đầu ngay mà không cần ai chỉ */}
            {isEmptyState ? (
              <section
                aria-label="Trạng thái chưa có dữ liệu"
                data-testid="empty-state-panel"
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-dashed border-indigo-500/40 text-center space-y-5 shadow-xl"
              >
                <div className="max-w-xl mx-auto space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden />
                    <span>Bắt đầu sử dụng AdPulse</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Chưa có số liệu chiến dịch
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Chọn một cách <b>Nhập dữ liệu thật</b> bên dưới (bạn sẽ được xem trước và sửa lỗi trước khi lưu), hoặc bấm <b>Dùng dữ liệu mẫu</b> để trải nghiệm thử ngay.
                  </p>
                </div>

                {/* Cụm 1: Nhập dữ liệu thật */}
                <div className="max-w-3xl mx-auto space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Lựa chọn 1: Nhập số liệu chiến dịch của bạn
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsMultiModalOpen(true)}
                      className="min-h-[54px] p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-left shadow-lg shadow-indigo-600/20 flex items-center gap-3 transition-all"
                    >
                      <Layers className="w-5 h-5 flex-shrink-0" aria-hidden />
                      <div>
                        <div className="text-xs font-bold">Nhập tay nhiều ngày</div>
                        <div className="text-[11px] text-indigo-100">Gõ bảng trực tiếp</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => openFileImportWithTab('file')}
                      className="min-h-[54px] p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-left border border-slate-700 flex items-center gap-3 transition-all"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden />
                      <div>
                        <div className="text-xs font-bold">Tải file Excel / CSV</div>
                        <div className="text-[11px] text-slate-400">Tự động ghép cột</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => openFileImportWithTab('clipboard')}
                      className="min-h-[54px] p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-left border border-slate-700 flex items-center gap-3 transition-all"
                    >
                      <ClipboardPaste className="w-5 h-5 text-sky-400 flex-shrink-0" aria-hidden />
                      <div>
                        <div className="text-xs font-bold">Dán bảng Google Sheets</div>
                        <div className="text-[11px] text-slate-400">Copy & dán nhanh</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="min-h-[54px] p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-left border border-slate-700 flex items-center gap-3 transition-all"
                    >
                      <ImageIcon className="w-5 h-5 text-purple-400 flex-shrink-0" aria-hidden />
                      <div>
                        <div className="text-xs font-bold">Đọc ảnh chụp (OCR)</div>
                        <div className="text-[11px] text-slate-400">Bảng ngày / Tổng kỳ</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Cụm 2: Tách riêng Dùng dữ liệu mẫu */}
                <div className="max-w-2xl mx-auto pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5" aria-hidden />
                    <span>Lựa chọn 2: Dùng dữ liệu mẫu (có gắn nhãn mẫu rõ ràng)</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadDataset(DATASET_1_NORMAL, 'Bộ 1: Chuẩn mực E-Commerce')}
                      className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                    >
                      Nạp Bộ 1 (5 ngày chuẩn)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadDataset(DATASET_2_DIRTY, 'Bộ 2: Dữ liệu Lỗi/Thiếu')}
                      className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                    >
                      Nạp Bộ 2 (Dữ liệu thiếu/lỗi)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadDataset(DATASET_3_EDGE, 'Bộ 3: Trường hợp Biên & Số 0')}
                      className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                    >
                      Nạp Bộ 3 (Biên/Trùng ngày)
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSampleSummary}
                      className="min-h-[38px] px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-xs font-semibold text-purple-200 border border-purple-500/30"
                    >
                      Nạp mẫu Ảnh tổng kỳ
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              /* Thanh hướng dẫn nhanh & chuyển sang xuất báo cáo cho sếp khi đã có dữ liệu */
              <section className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isSampleData
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {isSampleData ? 'Đang xem Dữ liệu mẫu' : 'Đang xem Dữ liệu đã nhập'}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      Nguồn: {activeSourceLabel} • Kỳ: {formatDateVN(snapshot.meta.periodStart)} – {formatDateVN(snapshot.meta.periodEnd)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300">
                    {isSampleData
                      ? 'Bạn đang xem bộ số liệu mẫu để làm quen. Bấm "Nhập dữ liệu" ở trên để thay bằng số thật, hoặc bấm "Xem & Xuất báo cáo" để xuất gửi sếp.'
                      : 'Số liệu đã sẵn sàng. Bạn có thể kiểm tra KPI bên dưới rồi chuyển sang tab Báo cáo để xuất Text, PDF, HTML hoặc Slide PPTX gửi sếp.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab('report')}
                    className="min-h-[40px] px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
                  >
                    <span>Xem & Xuất báo cáo cho sếp</span>
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="min-h-[40px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-rose-600 text-slate-100 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <FileDown className="w-4 h-4 text-rose-400" aria-hidden />
                    <span>Mở Báo Cáo & Tải PDF</span>
                  </button>
                </div>
              </section>
            )}

            {/* Thẻ thông tin nếu đang xem Ảnh tổng kỳ (PeriodSummaryRecord) */}
            {summarySnapshot && (
              <section
                data-testid="period-summary-banner"
                className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        Đang dùng số liệu từ Ảnh chụp tổng kỳ ({formatDateVN(summarySnapshot.period_start)} – {formatDateVN(summarySnapshot.period_end)})
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold">
                        Đồng bộ Dashboard + Text/PDF/HTML/PPTX
                      </span>
                    </div>
                    <p className="text-slate-200 font-mono">
                      Chi phí: {formatVND(summarySnapshot.total_spend)} • Đơn: {summarySnapshot.total_orders} • CPA: {snapshot.kpis.cpa.formatted} • Reach: {summarySnapshot.total_reach.toLocaleString('vi-VN')} • Click: {summarySnapshot.total_clicks.toLocaleString('vi-VN')} • CTR: {snapshot.kpis.ctr.formatted} • CPC: {snapshot.kpis.cpc.formatted}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSummarySnapshot(null);
                    setRecords(DATASET_1_NORMAL);
                    showToast('Đã chuyển về dữ liệu mẫu theo ngày (Bộ 1).', 'info');
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-purple-200 border border-purple-500/30 self-start sm:self-auto flex-shrink-0"
                >
                  Chuyển sang bảng theo ngày
                </button>
              </section>
            )}

            {/* 7 Thẻ KPI Tổng Hợp (KpiStatsGrid) */}
            {!isEmptyState && (
              <section className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" aria-hidden />
                    <span>Chỉ Số KPI Toàn Kỳ (Lõi Tính Toán Dùng Chung K1)</span>
                  </h2>
                  <span className="text-xs text-slate-400">
                    {isSummaryOnly
                      ? `Nguồn: ${activeSourceLabel} (chỉ có tổng kỳ)`
                      : `Tổng cộng ${snapshot.meta.totalDays} ngày có dữ liệu`}
                  </span>
                </div>

                <KpiStatsGrid snapshot={snapshot} />
              </section>
            )}

            {/* Bảng Dữ Liệu Chi Tiết (DataTable) */}
            <section className="pt-2">
              <DataTable
                records={snapshot.dailyRecords}
                summaryRecord={summarySnapshot}
                onAddSingle={handleAddSingle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onOpenMultiModal={() => setIsMultiModalOpen(true)}
              />
            </section>
          </>
        )}
      </main>

      {/* Tab dưới cho mobile (Khoa · U1) */}
      <nav aria-label="Góc nhìn" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur border-t border-slate-800 grid grid-cols-3" role="tablist">
        {([['overview', 'Tổng quan'], ['analysis', 'Phân tích'], ['report', 'Báo cáo']] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-[48px] py-3 text-xs font-bold ${tab === id ? 'text-indigo-400 border-t-2 border-indigo-500' : 'text-slate-400'}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          AdPulse Mini KPI Dashboard • Đề 7, Bảng B • Dũng · Dữ liệu/PDF | Khoa · UX/Dashboard/Text/PPTX | Lộc · AI/Chat/HTML
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Xuất Text, PDF, HTML, PPTX trực tiếp từ Snapshot chung • Đối chiếu khớp 100% kỳ, nguồn và chỉ số KPI
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
        defaultTab={fileModalDefaultTab}
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

      {/* Modal 4: Xuất Báo Cáo PDF Trực Tiếp */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => { setIsPdfModalOpen(false); setPdfSnapshot(null); }}
        snapshot={pdfSnapshot ?? (dataVersionOf(frozenSnapshot) === dataVersionOf(snapshot) ? { ...snapshot, ai: frozenSnapshot.ai } : snapshot)}
      />

      {/* Modal Xử Lý Trùng Lặp Ngày */}
      <DuplicateResolutionModal
        isOpen={duplicateModal.isOpen}
        duplicateDates={duplicateModal.dates}
        onMerge={handleMergeDuplicates}
        onOverwrite={handleOverwriteDuplicates}
        onCancel={() => {
          setDuplicateModal({ isOpen: false, dates: [] });
          showToast('Đã hủy thao tác nạp trùng ngày. Dữ liệu và số tổng giữ nguyên.', 'info');
        }}
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
