import { aiReportText } from '../report/aiReport';
import React, { useRef, useState } from 'react';
import { CampaignReportSnapshot } from '../types/campaign';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import { downloadPdfFromElement, printReportDirectly } from '../utils/pdfGenerator';
import {
  X,
  FileDown,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: CampaignReportSnapshot;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  snapshot
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [reportTitle, setReportTitle] = useState('BÁO CÁO HIỆU QUẢ CHIẾN DỊCH FACEBOOK ADS');
  const [recipientType, setRecipientType] = useState<'boss' | 'client' | 'internal'>('boss');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!isOpen) return null;

  const { meta, totals, kpis, dailyRecords, summaryRecord, dataIntegrity } = snapshot;

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    setExportProgress(10);

    try {
      const fileName = `Bao-Cao-KPI-Facebook-Ads-${meta.periodStart || 'snapshot'}.pdf`;
      await downloadPdfFromElement(reportRef.current, fileName, (p) => setExportProgress(p));
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
      alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử dùng nút "In / Lưu PDF Trình Duyệt".');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="p-4 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <FileDown className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Xuất Báo Cáo PDF Trực Tiếp (Executive PDF Report)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Xuất trực tiếp từ Snapshot chung • Đối chiếu khớp 100% với Dashboard • Chữ Việt sắc nét không lỗi font
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Cấu Hình Nhanh */}
        <div className="p-4 px-6 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Mẫu báo cáo:</span>
              <select
                value={recipientType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setRecipientType(val);
                  if (val === 'boss') setReportTitle('BÁO CÁO TỔNG QUAN HIỆU QUẢ CHIẾN DỊCH (GỬI BAN GIÁM ĐỐC)');
                  if (val === 'client') setReportTitle('BÁO CÁO ĐO LƯỜNG HIỆU QUẢ QUẢNG CÁO (GỬI KHÁCH HÀNG)');
                  if (val === 'internal') setReportTitle('BÁO CÁO KỸ THUẬT VẬN HÀNH CHIẾN DỊCH (MEDIA BUYER)');
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="boss">Bản Gửi Sếp (Executive Summary)</option>
                <option value="client">Bản Gửi Khách Hàng (Agency Report)</option>
                <option value="internal">Bản Kỹ Thuật (Media Buyer)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Tiêu đề:</span>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Browser Print (Fallback cực kỳ đáng tin cậy) */}
            <button
              type="button"
              onClick={printReportDirectly}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Mở hộp thoại In / Lưu PDF của trình duyệt"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>In / Lưu PDF Trình Duyệt</span>
            </button>

            {/* Nút Tải Trực Tiếp File PDF */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-rose-600/25 flex items-center gap-1.5 transition-all"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xuất ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải File PDF Thật (.pdf)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body: Khung Xem Trước Bản In A4 (Printable Sheet) */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-slate-950 flex justify-center">
          {/* Tờ A4 Báo Cáo Chuẩn (Trắng, chữ đen/xanh đậm chuyên nghiệp) */}
          <div
            ref={reportRef}
            className="w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm print:m-0 print:p-6 print:shadow-none space-y-6 text-sm font-sans"
            style={{ minHeight: '1100px' }}
          >
            {/* Header Báo Cáo */}
            <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest block mb-1">
                  ADPULSE PERFORMANCE REPORT • ĐỀ 7 BẢNG B
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
                  {reportTitle}
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Chiến dịch: <b>{meta.campaignName}</b> • Đơn vị tiền tệ: <b>VNĐ</b>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Kỳ báo cáo: <span className="font-mono text-indigo-900 font-bold">{meta.periodStart || '—'}</span> đến <span className="font-mono text-indigo-900 font-bold">{meta.periodEnd || '—'}</span>
                </p>
                <p>Tổng số ngày: <b>{meta.totalDays} ngày</b></p>
                <p className="text-[10px] text-slate-400 font-mono">Snapshot ID: {meta.snapshotId}</p>
                <p className="text-[10px] text-slate-400">Xuất lúc: {new Date(meta.generatedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            {/* Khối Thẻ Tổng Hợp Hiệu Quả (Executive Summary Cards) */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Chi Phí</span>
                <div className="text-lg font-black text-slate-950 font-mono mt-1">
                  {formatVND(totals.spend)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Reach*</span>
                <div className="text-lg font-black text-blue-900 font-mono mt-1">
                  {totals.reachSum.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Clicks</span>
                <div className="text-lg font-black text-amber-900 font-mono mt-1">
                  {totals.clicks.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Đơn Hàng</span>
                <div className="text-lg font-black text-emerald-800 font-mono mt-1">
                  {totals.orders.toLocaleString('vi-VN')} đơn
                </div>
              </div>
            </div>

            {/* Khối 3 Chỉ Số KPI Cốt Lõi (Theo Đề 7 & C1 Contract) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">CTR Toàn Kỳ (Click-Through Rate)</span>
                <div className="text-2xl font-black text-indigo-950 font-mono mt-1">
                  {kpis.ctr.formatted}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Tổng Clicks / Tổng Reach</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CPC Toàn Kỳ (Cost Per Click)</span>
                <div className="text-2xl font-black text-amber-950 font-mono mt-1">
                  {kpis.cpc.formatted}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Tổng Chi Phí / Tổng Clicks</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">CPA Toàn Kỳ (Chi Phí / Đơn)</span>
                <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                  {kpis.cpa.formatted}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Tổng Chi Phí / Tổng Đơn Hàng</span>
              </div>
            </div>

            {/* Nếu có Snapshot từ ảnh tổng kỳ */}
            {summaryRecord && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950">
                <p className="font-bold">Ghi nhận Snapshot Tổng Kỳ (Từ Ảnh Chụp Ads):</p>
                <p className="mt-0.5">
                  Kỳ: {summaryRecord.period_start} - {summaryRecord.period_end} • Chi phí: {formatVND(summaryRecord.total_spend)} • Reach: {summaryRecord.total_reach.toLocaleString()} • Clicks: {summaryRecord.total_clicks.toLocaleString()} • Đơn: {summaryRecord.total_orders} (Bảo toàn dữ liệu thực, không chia nhỏ ngày giả).
                </p>
              </div>
            )}

            {/* Bảng Chi Tiết Từng Ngày */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Chi Tiết Hiệu Quả Từng Ngày
              </h3>

              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold">
                    <th className="py-2 px-2.5">Ngày</th>
                    <th className="py-2 px-2.5 text-right">Reach</th>
                    <th className="py-2 px-2.5 text-right">Clicks</th>
                    <th className="py-2 px-2.5 text-right">Chi Phí (VNĐ)</th>
                    <th className="py-2 px-2.5 text-right">Đơn Hàng</th>
                    <th className="py-2 px-2.5 text-right">CTR</th>
                    <th className="py-2 px-2.5 text-right">CPC</th>
                    <th className="py-2 px-2.5 text-right">CPA (Đơn)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {dailyRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-4 text-center text-slate-500 font-sans">
                        Không có dữ liệu chi tiết theo ngày.
                      </td>
                    </tr>
                  ) : (
                    dailyRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900">{r.date}</td>
                        <td className="py-1.5 px-2.5 text-right">{r.reach.toLocaleString('vi-VN')}</td>
                        <td className="py-1.5 px-2.5 text-right">{r.clicks.toLocaleString('vi-VN')}</td>
                        <td className="py-1.5 px-2.5 text-right font-bold">{formatVND(r.spend)}</td>
                        <td className="py-1.5 px-2.5 text-right text-emerald-800 font-bold">{r.orders}</td>
                        <td className="py-1.5 px-2.5 text-right text-indigo-900">{r.kpis.ctr.formatted}</td>
                        <td className="py-1.5 px-2.5 text-right text-amber-900">{r.kpis.cpc.formatted}</td>
                        <td className="py-1.5 px-2.5 text-right text-emerald-900">{r.kpis.cpa.formatted}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {dailyRecords.length > 0 && (
                  <tfoot className="bg-slate-100 border-t-2 border-slate-400 font-bold font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-2.5 uppercase font-sans text-slate-900">Tổng Toàn Kỳ</td>
                      <td className="py-2 px-2.5 text-right text-blue-900">{totals.reachSum.toLocaleString('vi-VN')}</td>
                      <td className="py-2 px-2.5 text-right text-amber-900">{totals.clicks.toLocaleString('vi-VN')}</td>
                      <td className="py-2 px-2.5 text-right text-slate-950 font-black">{formatVND(totals.spend)}</td>
                      <td className="py-2 px-2.5 text-right text-emerald-800">{totals.orders.toLocaleString('vi-VN')}</td>
                      <td className="py-2 px-2.5 text-right text-indigo-900">{kpis.ctr.formatted}</td>
                      <td className="py-2 px-2.5 text-right text-amber-900">{kpis.cpc.formatted}</td>
                      <td className="py-2 px-2.5 text-right text-emerald-900">{kpis.cpa.formatted}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Chú thích & Cam Kết Dữ Liệu (Footnotes & Audit) */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p>
                <b>*Ghi chú về Tổng Reach:</b> Số liệu Reach ở đây là tổng lượt tiếp cận tích luỹ theo ngày cộng dồn, không đại diện cho số người tiếp cận duy nhất (Unique Reach) của toàn chiến dịch do có trùng lặp người xem giữa các ngày.
              </p>
              <p>
                <b>Công thức tính toán:</b> CTR = (Clicks / Reach) × 100% • CPC = Chi phí / Clicks • CPA = Chi phí / Đơn hàng. Toàn bộ chỉ số kỳ được tính toán gia quyền trên tổng số học, tuân thủ nghiêm ngặt Contract C1 của hệ thống AdPulse.
              </p>
            </div>

            <section className="pt-4 text-xs whitespace-pre-wrap text-slate-700"><h3 className="font-bold mb-2">Nhận xét và gợi ý AI</h3>{aiReportText(snapshot)}</section>
            {/* Chữ ký xác nhận */}
            <div className="pt-8 flex items-center justify-between text-xs text-slate-700">
              <div className="text-center">
                <p className="font-bold">Người Lập Báo Cáo</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Nguyễn Thanh Dũng</p>
                <div className="h-12 flex items-end justify-center font-serif italic text-indigo-900">
                  (Đã xác thực SSOT)
                </div>
              </div>

              <div className="text-center">
                <p className="font-bold">Người Duyệt Báo Cáo</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Trưởng Nhóm / Khách Hàng</p>
                <div className="h-12 flex items-end justify-center text-slate-400">
                  (Ký và ghi rõ họ tên)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:px-8 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Số liệu trên PDF khớp 100% với Snapshot Dashboard</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
