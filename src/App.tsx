import React, { useState, useEffect, useMemo } from 'react';
import { CampaignRecord } from './types/campaign';
import { loadCampaignData, saveCampaignData, clearCampaignData, exportToCsv, exportToJson } from './utils/storage';
import { calculateAggregates } from './utils/calculations';
import { analyzeCampaignWithAI } from './utils/aiEngine';
import { SAMPLE_CAMPAIGN_DATA } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { KpiStatsGrid } from './components/KpiStatsGrid';
import { ChartSection } from './components/ChartSection';
import { AiAdvisorCard } from './components/AiAdvisorCard';
import { DataTable } from './components/DataTable';
import { DataEntryModal } from './components/DataEntryModal';
import { ExportReportModal } from './components/ExportReportModal';
import { Toast } from './components/Toast';
import { 
  Sparkles, 
  Layers, 
  BarChart3, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Zap,
  HelpCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const [records, setRecords] = useState<CampaignRecord[]>(() => loadCampaignData());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMultiEntryOpen, setIsMultiEntryOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Đồng bộ localStorage khi records thay đổi
  useEffect(() => {
    saveCampaignData(records);
  }, [records]);

  // Cập nhật class 'dark' trên <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  // Tính toán các chỉ số tổng hợp
  const aggregates = useMemo(() => calculateAggregates(records), [records]);

  // Phân tích AI xu hướng & 03 gợi ý
  const aiAnalysis = useMemo(() => analyzeCampaignWithAI(records), [records]);

  // Handlers CRUD
  const handleAddRecord = (record: CampaignRecord) => {
    setRecords(prev => [...prev, record]);
    showToast(`✅ Đã thêm số liệu ngày ${record.date} thành công!`);
  };

  const handleUpdateRecord = (updated: CampaignRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    showToast(`✏️ Đã cập nhật số liệu ngày ${updated.date}!`);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast('🗑️ Đã xóa 1 dòng số liệu.');
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu? (Có thể bấm "Nạp Data Mẫu" để khôi phục lại bất kỳ lúc nào)')) {
      setRecords([]);
      clearCampaignData();
      showToast('🧹 Đã xóa toàn bộ dữ liệu.');
    }
  };

  const handleBatchAdd = (newRows: CampaignRecord[]) => {
    setRecords(prev => [...prev, ...newRows]);
    showToast(`🚀 Đã thêm thành công ${newRows.length} ngày số liệu!`);
  };

  const handleResetSampleData = () => {
    setRecords(SAMPLE_CAMPAIGN_DATA);
    showToast('✨ Đã nạp lại 10 ngày dữ liệu mẫu chuẩn Digital Marketing!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenMultiEntry={() => setIsMultiEntryOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onResetSampleData={handleResetSampleData}
        recordCount={records.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Vibe Coding & Giới thiệu bài thi */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-cyan-950/40 border border-indigo-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Đề 7: Dashboard KPI Chiến Dịch Mini • Vibe Coding</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Theo Dõi Hiệu Quả Quảng Cáo & Đọc Chỉ Số Tự Động
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Giải pháp thay thế bảng tính Excel phức tạp cho Marketer: Tự động tính toán <strong className="text-cyan-300">CTR, CPC, CPA</strong>, vẽ biểu đồ đường/cột trực quan, mô hình AI chẩn đoán xu hướng tăng/giảm và xuất báo cáo 1-click gửi Sếp hoặc Khách hàng.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setIsMultiEntryOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Nhập Dữ Liệu Nhiều Ngày</span>
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4" />
                <span>Xuất Báo Cáo Gửi Sếp</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1. KHỐI THẺ KPI CHÍNH (Requirement 3: Tự động tính CTR, CPC, CPA) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Tổng Quan Chỉ Số Chiến Dịch (Real-time KPI)
            </h2>
            <span className="text-xs text-slate-500">Tự động tính theo thời gian thực</span>
          </div>
          <KpiStatsGrid metrics={aggregates} />
        </section>

        {/* 2. KHỐI AI NHẬN XÉT XU HƯỚNG & 03 GỢI Ý (Requirement 4) */}
        <section>
          <AiAdvisorCard
            analysis={aiAnalysis}
            onRefreshAnalysis={() => {
              showToast('🔄 Đã làm mới phân tích dữ liệu AI!');
            }}
          />
        </section>

        {/* 3. KHỐI BIỂU ĐỒ TRỰC QUAN (Requirement 2: Biểu đồ đường/cột thể hiện reach, chi phí, đơn hàng theo ngày) */}
        <section>
          <ChartSection records={records} />
        </section>

        {/* 4. KHỐI BẢNG NHẬT KÝ & FORM NHẬP SỐ LIỆU THEO NGÀY (Requirement 1 & Requirement 3) */}
        <section>
          <DataTable
            records={records}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onExportCsv={() => exportToCsv(records)}
            onExportJson={() => exportToJson(records)}
            onOpenMultiEntry={() => setIsMultiEntryOpen(true)}
          />
        </section>

        {/* Footer Credit & Compliance Checklist */}
        <footer className="pt-8 pb-12 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
              V7
            </div>
            <span>Sản phẩm dự thi Vibe Coding - Đề 7: Dashboard KPI Chiến Dịch Mini</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1. Form nhập ngày & nhiều dòng (localStorage)
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2. Biểu đồ đường/cột
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3. Tính CTR, CPC, CPA
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 4. AI nhận xét & 3 gợi ý
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 5. Xuất báo cáo text
            </span>
          </div>
        </footer>
      </main>

      {/* Modal Nhập Nhiều Dòng / Excel */}
      <DataEntryModal
        isOpen={isMultiEntryOpen}
        onClose={() => setIsMultiEntryOpen(false)}
        onBatchAdd={handleBatchAdd}
      />

      {/* Modal Xuất Báo Cáo */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        records={records}
        onTriggerToast={showToast}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default App;
