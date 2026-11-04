import React, { useState, useEffect } from 'react';
import { CampaignRecord, ReportFormat } from '../types/campaign';
import { generateReportText } from '../utils/reportGenerator';
import confetti from 'canvas-confetti';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  UserCheck, 
  Briefcase, 
  Terminal, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CampaignRecord[];
  onTriggerToast: (msg: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  records,
  onTriggerToast,
}) => {
  const [format, setFormat] = useState<ReportFormat>('boss');
  const [reportContent, setReportContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReportContent(generateReportText(records, format));
      setIsCopied(false);
    }
  }, [isOpen, format, records]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportContent);
      setIsCopied(true);
      onTriggerToast('✅ Đã sao chép báo cáo vào bộ nhớ tạm (Clipboard)! Sẵn sàng dán vào Zalo/Email.');

      // Bắn pháo hoa ăn mừng (Delightful UI)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Không thể copy:', err);
      onTriggerToast('⚠️ Lỗi quyền truy cập clipboard.');
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Bao_cao_KPI_${format}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
    onTriggerToast('📥 Đã tải file báo cáo text thành công!');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Báo Cáo Hiệu Quả Chiến Dịch - AdPulse</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; line-height: 1.6; white-space: pre-wrap; color: #1e293b; }
            h1 { font-size: 18px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>BÁO CÁO HIỆU QUẢ CHIẾN DỊCH QUẢNG CÁO</h1>
          <div>${reportContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Xuất Báo Cáo Tóm Tắt Dạng Text</h3>
              <p className="text-xs text-slate-400">Định dạng chuẩn hóa chuyên nghiệp sẵn sàng copy gửi Sếp hoặc Khách hàng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Selector */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Văn mẫu:</span>
          
          <button
            onClick={() => setFormat('boss')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'boss'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Bản Gửi Sếp (Executive)</span>
          </button>

          <button
            onClick={() => setFormat('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'client'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Bản Gửi Khách Hàng (Agency)</span>
          </button>

          <button
            onClick={() => setFormat('technical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'technical'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Bản Kỹ Thuật (Media Buyer)</span>
          </button>

          <button
            onClick={() => setFormat('quick-summary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'quick-summary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Zalo / Slack Nhanh</span>
          </button>
        </div>

        {/* Text Area Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">
              * Bạn có thể chỉnh sửa trực tiếp nội dung văn bản dưới đây trước khi bấm Copy:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {reportContent.length} ký tự
            </span>
          </div>

          <textarea
            rows={14}
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            className="w-full flex-1 p-4 rounded-xl font-mono text-xs leading-relaxed bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 selection:bg-indigo-600/30"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tải file .TXT</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>In / Lưu PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl text-white transition-all transform active:scale-95 shadow-lg ${
                isCopied
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-600/30'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Đã Copy Xong!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  <span>Copy Báo Cáo Gửi Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
