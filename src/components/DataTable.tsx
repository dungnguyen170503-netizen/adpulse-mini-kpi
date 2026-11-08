import { validateRow } from '../utils/validation';
import React, { useState } from 'react';
import { DailyAdRecord, CalculatedDailyRecord, PeriodSummaryRecord } from '../types/campaign';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import { formatDateVN } from '../report/reportModel';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface DataTableProps {
  records: CalculatedDailyRecord[];
  summaryRecord?: PeriodSummaryRecord | null;
  onAddSingle: (record: DailyAdRecord) => void;
  onUpdate: (record: DailyAdRecord) => void;
  onDelete: (id: string) => void;
  onOpenMultiModal: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  summaryRecord,
  onAddSingle,
  onUpdate,
  onDelete,
  onOpenMultiModal
}) => {
  // Quick Single Row Add state
  const [quickDate, setQuickDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quickReach, setQuickReach] = useState('');
  const [quickClicks, setQuickClicks] = useState('');
  const [quickSpend, setQuickSpend] = useState('');
  const [quickOrders, setQuickOrders] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [quickErrors, setQuickErrors] = useState<Record<string, string>>({});

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DailyAdRecord>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!quickDate) errs.date = 'Chọn ngày (YYYY-MM-DD)';
    if (quickReach.trim() === '' || Number(quickReach) < 0 || !Number.isFinite(Number(quickReach))) {
      errs.reach = 'Nhập Reach ≥ 0 (nhập 0 nếu bằng 0)';
    }
    if (quickClicks.trim() === '' || Number(quickClicks) < 0 || !Number.isFinite(Number(quickClicks))) {
      errs.clicks = 'Nhập Click ≥ 0 (nhập 0 nếu bằng 0)';
    }
    if (quickSpend.trim() === '' || Number(quickSpend) < 0 || !Number.isFinite(Number(quickSpend))) {
      errs.spend = 'Nhập Chi phí ≥ 0 (nhập 0 nếu bằng 0)';
    }
    if (quickOrders.trim() === '' || Number(quickOrders) < 0 || !Number.isFinite(Number(quickOrders))) {
      errs.orders = 'Nhập Số đơn ≥ 0 (nhập 0 nếu bằng 0)';
    }

    if (Object.keys(errs).length > 0) {
      setQuickErrors(errs);
      return;
    }

    const newRec: DailyAdRecord = {
      id: `rec_${Date.now()}`,
      date: quickDate,
      campaign_name: 'Chiến dịch Facebook Ads',
      spend: Number(quickSpend),
      reach: Number(quickReach),
      clicks: Number(quickClicks),
      orders: Number(quickOrders),
      source_type: 'manual',
      status: 'valid',
      notes: quickNotes
    };

    const val = validateRow(newRec);
    if (!val.isValid) {
      setQuickErrors(val.errors);
      return;
    }

    setQuickErrors({});
    onAddSingle(newRec);

    setQuickReach('');
    setQuickClicks('');
    setQuickSpend('');
    setQuickOrders('');
    setQuickNotes('');
  };

  const startEdit = (rec: CalculatedDailyRecord) => {
    setEditingId(rec.id);
    setEditErrors({});
    setEditValues({
      date: rec.date,
      reach: rec.reach,
      clicks: rec.clicks,
      spend: rec.spend,
      orders: rec.orders,
      notes: rec.notes
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
    setEditErrors({});
  };

  const saveEdit = (id: string) => {
    const original = records.find(r => r.id === id);
    if (!original) return;

    const targetDate = editValues.date ?? original.date;
    const updated: DailyAdRecord = {
      ...original,
      date: targetDate,
      reach: editValues.reach !== undefined ? Number(editValues.reach) : original.reach,
      clicks: editValues.clicks !== undefined ? Number(editValues.clicks) : original.clicks,
      spend: editValues.spend !== undefined ? Number(editValues.spend) : original.spend,
      orders: editValues.orders !== undefined ? Number(editValues.orders) : original.orders,
      notes: editValues.notes ?? original.notes
    };

    const val = validateRow(updated);
    const errs: Record<string, string> = { ...val.errors };
    if (records.some(r => r.id !== id && r.date === targetDate)) {
      errs.date = `Ngày ${targetDate} đã có. Hãy sửa dòng ngày đó hoặc chọn ngày khác.`;
    }

    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }

    setEditErrors({});
    onUpdate(updated);
    setEditingId(null);
    setEditValues({});
  };

  // Tính tổng hàng chân trang
  const totals = records.reduce(
    (acc, r) => ({
      spend: acc.spend + (r.spend || 0),
      reach: acc.reach + (r.reach || 0),
      clicks: acc.clicks + (r.clicks || 0),
      orders: acc.orders + (r.orders || 0)
    }),
    { spend: 0, reach: 0, clicks: 0, orders: 0 }
  );

  const totalCtr = totals.reach > 0 ? (totals.clicks / totals.reach) * 100 : 0;
  const totalCpc = totals.clicks > 0 ? Math.round(totals.spend / totals.clicks) : null;
  const totalCpa = totals.orders > 0 ? Math.round(totals.spend / totals.orders) : null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-4">
      {/* Header Bảng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
            <span>Bảng Nhật Ký Số Liệu Chiến Dịch</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
              {records.length > 0 ? `${records.length} dòng ngày` : summaryRecord ? 'Chế độ Tổng kỳ' : '0 ngày'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Thêm nhanh 1 ngày tại chỗ, bấm biểu tượng bút chì để sửa dòng, hoặc mở Nhập nhiều dòng để kiểm tra hàng loạt.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMultiModal}
          className="min-h-[40px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Layers className="w-4 h-4" aria-hidden />
          <span>Nhập Nhiều Dòng (Batch Entry)</span>
        </button>
      </div>

      {/* Form Nhập Nhanh 1 Dòng (Quick Inline Add) kèm báo lỗi ngay cạnh trường cần sửa */}
      <form
        onSubmit={handleQuickAdd}
        noValidate
        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 items-start">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ngày</label>
            <input
              type="date"
              aria-label="Ngày thêm nhanh"
              aria-invalid={!!quickErrors.date}
              value={quickDate}
              onChange={(e) => { setQuickDate(e.target.value); setQuickErrors(prev => ({ ...prev, date: '' })); }}
              className={`min-h-[38px] w-full bg-slate-900 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-2 ${
                quickErrors.date ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {quickErrors.date && <p role="alert" className="text-[11px] text-rose-400 mt-1">{quickErrors.date}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Reach (người)</label>
            <input
              type="number"
              aria-label="Reach thêm nhanh"
              aria-invalid={!!quickErrors.reach}
              placeholder="VD: 5000"
              min="0"
              value={quickReach}
              onChange={(e) => { setQuickReach(e.target.value); setQuickErrors(prev => ({ ...prev, reach: '' })); }}
              className={`min-h-[38px] w-full bg-slate-900 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 text-right focus:outline-none focus:ring-2 ${
                quickErrors.reach ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {quickErrors.reach && <p role="alert" className="text-[11px] text-rose-400 mt-1">{quickErrors.reach}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Click</label>
            <input
              type="number"
              aria-label="Click thêm nhanh"
              aria-invalid={!!quickErrors.clicks}
              placeholder="VD: 150"
              min="0"
              value={quickClicks}
              onChange={(e) => { setQuickClicks(e.target.value); setQuickErrors(prev => ({ ...prev, clicks: '' })); }}
              className={`min-h-[38px] w-full bg-slate-900 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 text-right focus:outline-none focus:ring-2 ${
                quickErrors.clicks ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {quickErrors.clicks && <p role="alert" className="text-[11px] text-rose-400 mt-1">{quickErrors.clicks}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chi phí (VND)</label>
            <input
              type="number"
              aria-label="Chi phí thêm nhanh"
              aria-invalid={!!quickErrors.spend}
              placeholder="VD: 300000"
              min="0"
              step="10000"
              value={quickSpend}
              onChange={(e) => { setQuickSpend(e.target.value); setQuickErrors(prev => ({ ...prev, spend: '' })); }}
              className={`min-h-[38px] w-full bg-slate-900 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 text-right focus:outline-none focus:ring-2 ${
                quickErrors.spend ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {quickErrors.spend && <p role="alert" className="text-[11px] text-rose-400 mt-1">{quickErrors.spend}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Số đơn</label>
            <input
              type="number"
              aria-label="Số đơn thêm nhanh"
              aria-invalid={!!quickErrors.orders}
              placeholder="VD: 6"
              min="0"
              value={quickOrders}
              onChange={(e) => { setQuickOrders(e.target.value); setQuickErrors(prev => ({ ...prev, orders: '' })); }}
              className={`min-h-[38px] w-full bg-slate-900 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 text-right focus:outline-none focus:ring-2 ${
                quickErrors.orders ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {quickErrors.orders && <p role="alert" className="text-[11px] text-rose-400 mt-1">{quickErrors.orders}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ghi chú</label>
            <input
              type="text"
              aria-label="Ghi chú thêm nhanh"
              placeholder="Tùy chọn..."
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              className="min-h-[38px] w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-end pt-0 sm:pt-5">
            <button
              type="submit"
              className="min-h-[38px] w-full px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              <span>Thêm ngày</span>
            </button>
          </div>
        </div>
      </form>

      {/* Chế độ xem dạng thẻ gọn trên điện thoại (< md) để không phải cuộn ngang mới đọc được số chính */}
      {records.length > 0 && (
        <div className="md:hidden space-y-2" aria-label="Danh sách ngày trên điện thoại">
          <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
            <span> Tóm tắt từng ngày (vuốt bảng bên dưới để xem đầy đủ 10 cột)</span>
            <span>{records.length} dòng</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
            {records.map(rec => (
              <div key={`m-card-${rec.id}`} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">{formatDateVN(rec.date)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(rec)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(rec.id)}
                      className="px-2 py-1 rounded bg-slate-800 text-rose-300 hover:text-rose-200 text-[11px]"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block">Chi phí</span>
                    <span className="font-mono font-bold text-white">{formatVND(rec.spend)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Số đơn</span>
                    <span className="font-mono font-bold text-emerald-400">{rec.orders} đơn</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Chi phí/đơn</span>
                    <span className="font-mono font-bold text-indigo-300">{rec.kpis.cpa.formatted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bảng Hiển Thị Dữ Liệu */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-sans">
              <th className="py-3 px-3 font-semibold">Ngày</th>
              <th className="py-3 px-3 font-semibold text-right">Reach</th>
              <th className="py-3 px-3 font-semibold text-right">Clicks</th>
              <th className="py-3 px-3 font-semibold text-right">Chi Phí (VNĐ)</th>
              <th className="py-3 px-3 font-semibold text-right">Đơn Hàng</th>
              <th className="py-3 px-3 font-semibold text-right bg-indigo-950/20 text-indigo-300">CTR</th>
              <th className="py-3 px-3 font-semibold text-right bg-amber-950/20 text-amber-300">CPC</th>
              <th className="py-3 px-3 font-semibold text-right bg-emerald-950/20 text-emerald-300">CPA (Đơn)</th>
              <th className="py-3 px-3 font-semibold">Ghi Chú</th>
              <th className="py-3 px-3 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 px-4 text-center text-slate-400 font-sans">
                  {summaryRecord ? (
                    <div className="space-y-1">
                      <div className="font-bold text-purple-300 flex items-center justify-center gap-1.5">
                        <ImageIcon className="w-4 h-4" aria-hidden />
                        <span>Đang hiển thị Bản ghi Tổng kỳ từ ảnh chụp ({formatDateVN(summaryRecord.period_start)} – {formatDateVN(summaryRecord.period_end)})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Ảnh tổng kỳ chỉ chứa số tổng của cả kỳ (Chi phí: <b>{formatVND(summaryRecord.total_spend)}</b> · Đơn: <b>{summaryRecord.total_orders}</b>), không tách thành các dòng ngày giả. Bạn có thể thêm ngày mới ở trên nếu muốn chuyển sang bảng theo ngày.
                      </p>
                    </div>
                  ) : (
                    <span>
                      Chưa có dòng dữ liệu theo ngày. Hãy bấm <b>"Nhập dữ liệu"</b> hoặc chọn một <b>"Dữ liệu mẫu"</b> ở thanh trên cùng!
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const isEditing = editingId === rec.id;

                if (isEditing) {
                  return (
                    <tr key={rec.id} className="bg-indigo-950/30 align-top">
                      <td className="py-2.5 px-3">
                        <input
                          type="date"
                          aria-label="Sửa ngày"
                          aria-invalid={!!editErrors.date}
                          value={editValues.date || ''}
                          onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                          className={`bg-slate-900 border px-2 py-1 rounded text-xs font-mono text-white ${
                            editErrors.date ? 'border-rose-500' : 'border-indigo-500'
                          }`}
                        />
                        {editErrors.date && <p role="alert" className="text-[10px] font-sans text-rose-400 mt-1">{editErrors.date}</p>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          aria-label="Sửa Reach"
                          aria-invalid={!!editErrors.reach}
                          value={Number.isFinite(editValues.reach) ? editValues.reach : ''}
                          onChange={(e) => setEditValues({ ...editValues, reach: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className={`w-20 bg-slate-900 border px-2 py-1 rounded text-xs font-mono text-white text-right ${
                            editErrors.reach ? 'border-rose-500' : 'border-indigo-500'
                          }`}
                        />
                        {editErrors.reach && <p role="alert" className="text-[10px] font-sans text-rose-400 mt-1">{editErrors.reach}</p>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          aria-label="Sửa Clicks"
                          aria-invalid={!!editErrors.clicks}
                          value={Number.isFinite(editValues.clicks) ? editValues.clicks : ''}
                          onChange={(e) => setEditValues({ ...editValues, clicks: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className={`w-16 bg-slate-900 border px-2 py-1 rounded text-xs font-mono text-white text-right ${
                            editErrors.clicks ? 'border-rose-500' : 'border-indigo-500'
                          }`}
                        />
                        {editErrors.clicks && <p role="alert" className="text-[10px] font-sans text-rose-400 mt-1">{editErrors.clicks}</p>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          aria-label="Sửa Chi phí"
                          aria-invalid={!!editErrors.spend}
                          value={Number.isFinite(editValues.spend) ? editValues.spend : ''}
                          onChange={(e) => setEditValues({ ...editValues, spend: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className={`w-24 bg-slate-900 border px-2 py-1 rounded text-xs font-mono text-white text-right ${
                            editErrors.spend ? 'border-rose-500' : 'border-indigo-500'
                          }`}
                        />
                        {editErrors.spend && <p role="alert" className="text-[10px] font-sans text-rose-400 mt-1">{editErrors.spend}</p>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          aria-label="Sửa Số đơn"
                          aria-invalid={!!editErrors.orders}
                          value={Number.isFinite(editValues.orders) ? editValues.orders : ''}
                          onChange={(e) => setEditValues({ ...editValues, orders: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className={`w-16 bg-slate-900 border px-2 py-1 rounded text-xs font-mono text-white text-right ${
                            editErrors.orders ? 'border-rose-500' : 'border-indigo-500'
                          }`}
                        />
                        {editErrors.orders && <p role="alert" className="text-[10px] font-sans text-rose-400 mt-1">{editErrors.orders}</p>}
                      </td>
                      <td colSpan={3} className="py-2.5 px-3 text-center text-slate-400 font-sans italic">
                        (Tự động tính lại sau khi lưu)
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          aria-label="Sửa Ghi chú"
                          value={editValues.notes || ''}
                          onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                          className="w-28 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-sans text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => saveEdit(rec.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Lưu thay đổi"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"
                            title="Hủy"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {rec.date}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {rec.reach.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {rec.clicks.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-white font-semibold">
                      {formatVND(rec.spend)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                      {rec.orders.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right bg-indigo-950/10 font-semibold text-indigo-300">
                      {rec.kpis.ctr.formatted}
                    </td>
                    <td className={`py-2.5 px-3 text-right bg-amber-950/10 font-semibold ${rec.kpis.cpc.value === null ? 'text-amber-400' : 'text-slate-200'}`}>
                      {rec.kpis.cpc.formatted}
                    </td>
                    <td className={`py-2.5 px-3 text-right bg-emerald-950/10 font-semibold ${rec.kpis.cpa.value === null ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {rec.kpis.cpa.formatted}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 max-w-[150px] truncate" title={rec.notes}>
                      {rec.notes || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(rec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Sửa dòng này"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(rec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Hàng Tổng Cộng (Summary Footer) */}
          {records.length > 0 && (
            <tfoot className="bg-slate-950 text-slate-200 font-mono border-t-2 border-slate-700 font-bold">
              <tr>
                <td className="py-3 px-3 uppercase text-indigo-400 font-sans">
                  Tổng Cộng ({records.length}N)
                </td>
                <td className="py-3 px-3 text-right text-blue-300">
                  {totals.reach.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 px-3 text-right text-amber-300">
                  {totals.clicks.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 px-3 text-right text-white">
                  {formatVND(totals.spend)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400">
                  {totals.orders.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 px-3 text-right text-indigo-300 bg-indigo-950/30">
                  {formatPercent(totalCtr)}
                </td>
                <td className="py-3 px-3 text-right text-amber-300 bg-amber-950/30">
                  {formatVND(totalCpc)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-300 bg-emerald-950/30">
                  {formatVND(totalCpa)}
                </td>
                <td colSpan={2} className="py-3 px-3 text-xs font-sans text-slate-400">
                  *Tính gia quyền trên tổng
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
