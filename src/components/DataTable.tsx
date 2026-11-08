import { validateRow } from '../utils/validation';
import React, { useState } from 'react';
import { DailyAdRecord, CalculatedDailyRecord } from '../types/campaign';
import { formatVND, formatPercent } from '../utils/kpiEngine';
import {
  Calendar,
  DollarSign,
  Users,
  MousePointerClick,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

interface DataTableProps {
  records: CalculatedDailyRecord[];
  onAddSingle: (record: DailyAdRecord) => void;
  onUpdate: (record: DailyAdRecord) => void;
  onDelete: (id: string) => void;
  onOpenMultiModal: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
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

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DailyAdRecord>>({});

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDate || [quickSpend, quickReach, quickClicks, quickOrders].some(v => v.trim() === '')) {
      alert('Vui lòng nhập ngày và đủ 4 ô số; nhập 0 nếu thực sự bằng 0.');
      return;
    }

    const newRec: DailyAdRecord = {
      id: `rec_${Date.now()}`,
      date: quickDate,
      campaign_name: 'Chiến dịch Facebook Ads',
      spend: Number(quickSpend) || 0,
      reach: Number(quickReach) || 0,
      clicks: Number(quickClicks) || 0,
      orders: Number(quickOrders) || 0,
      source_type: 'manual',
      status: 'valid',
      notes: quickNotes
    };

    if (!validateRow(newRec).isValid) { alert('Ngày hoặc số liệu không hợp lệ.'); return; }
    onAddSingle(newRec);

    // Reset quick inputs
    setQuickReach('');
    setQuickClicks('');
    setQuickSpend('');
    setQuickOrders('');
    setQuickNotes('');
  };

  const startEdit = (rec: CalculatedDailyRecord) => {
    setEditingId(rec.id);
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
  };

  const saveEdit = (id: string) => {
    const original = records.find(r => r.id === id);
    if (!original) return;

    const updated: DailyAdRecord = {
      ...original,
      date: editValues.date || original.date,
      reach: Number(editValues.reach ?? original.reach),
      clicks: Number(editValues.clicks ?? original.clicks),
      spend: Number(editValues.spend ?? original.spend),
      orders: Number(editValues.orders ?? original.orders),
      notes: editValues.notes ?? original.notes
    };

    if (!validateRow(updated).isValid) { alert('Vui lòng sửa các ô trống hoặc không hợp lệ.'); return; }
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
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Bảng Nhật Ký Số Liệu Chiến Dịch</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
              {records.length} ngày
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhập nhanh từng ngày hoặc mở modal nhập nhiều dòng để xem trước & kiểm tra lỗi
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMultiModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Layers className="w-4 h-4" />
          <span>Nhập Nhiều Dòng (Batch Entry)</span>
        </button>
      </div>

      {/* Form Nhập Nhanh 1 Dòng (Quick Inline Add) */}
      <form
        onSubmit={handleQuickAdd}
        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center gap-2 md:gap-3"
      >
        <div className="flex items-center gap-1.5 min-w-[130px]">
          <input
            type="date"
            value={quickDate}
            onChange={(e) => setQuickDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            title="Ngày ghi nhận"
          />
        </div>

        <div className="flex-1 min-w-[100px]">
          <input
            type="number"
            placeholder="Reach..."
            min="0"
            value={quickReach}
            onChange={(e) => setQuickReach(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
          />
        </div>

        <div className="flex-1 min-w-[90px]">
          <input
            type="number"
            placeholder="Clicks..."
            min="0"
            value={quickClicks}
            onChange={(e) => setQuickClicks(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
          />
        </div>

        <div className="flex-1 min-w-[120px]">
          <input
            type="number"
            placeholder="Chi phí (VNĐ)..."
            min="0"
            step="10000"
            value={quickSpend}
            onChange={(e) => setQuickSpend(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
          />
        </div>

        <div className="flex-1 min-w-[90px]">
          <input
            type="number"
            placeholder="Đơn..."
            min="0"
            value={quickOrders}
            onChange={(e) => setQuickOrders(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
          />
        </div>

        <div className="flex-1 min-w-[120px]">
          <input
            type="text"
            placeholder="Ghi chú chiến dịch..."
            value={quickNotes}
            onChange={(e) => setQuickNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm ngày</span>
        </button>
      </form>

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
                <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                  Chưa có dữ liệu nào. Hãy bấm <b>"Nhập Nhiều Dòng"</b> hoặc nạp bộ số mẫu ở thanh trên cùng!
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const isEditing = editingId === rec.id;

                if (isEditing) {
                  return (
                    <tr key={rec.id} className="bg-indigo-950/30">
                      <td className="py-2.5 px-3">
                        <input
                          type="date"
                          value={editValues.date || ''}
                          onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                          className="bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-mono text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={Number.isFinite(editValues.reach) ? editValues.reach : ""}
                          onChange={(e) => setEditValues({ ...editValues, reach: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className="w-20 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-mono text-white text-right"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={Number.isFinite(editValues.clicks) ? editValues.clicks : ""}
                          onChange={(e) => setEditValues({ ...editValues, clicks: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className="w-16 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-mono text-white text-right"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={Number.isFinite(editValues.spend) ? editValues.spend : ""}
                          onChange={(e) => setEditValues({ ...editValues, spend: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className="w-24 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-mono text-white text-right"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={Number.isFinite(editValues.orders) ? editValues.orders : ""}
                          onChange={(e) => setEditValues({ ...editValues, orders: e.target.value === '' ? NaN : Number(e.target.value) })}
                          className="w-16 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-mono text-white text-right"
                        />
                      </td>
                      <td colSpan={3} className="py-2.5 px-3 text-center text-slate-400 font-sans italic">
                        (Tự động tính lại sau khi lưu)
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={editValues.notes || ''}
                          onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                          className="w-28 bg-slate-900 border border-indigo-500 px-2 py-1 rounded text-xs font-sans text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => saveEdit(rec.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Lưu thay đổi"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
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

                    {/* CTR */}
                    <td className="py-2.5 px-3 text-right bg-indigo-950/10 font-semibold text-indigo-300">
                      {rec.kpis.ctr.formatted}
                    </td>

                    {/* CPC */}
                    <td className={`py-2.5 px-3 text-right bg-amber-950/10 font-semibold ${rec.kpis.cpc.value === null ? 'text-amber-400' : 'text-slate-200'}`}>
                      {rec.kpis.cpc.formatted}
                    </td>

                    {/* CPA */}
                    <td className={`py-2.5 px-3 text-right bg-emerald-950/10 font-semibold ${rec.kpis.cpa.value === null ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {rec.kpis.cpa.formatted}
                    </td>

                    {/* Ghi chú */}
                    <td className="py-2.5 px-3 font-sans text-slate-400 max-w-[150px] truncate" title={rec.notes}>
                      {rec.notes || '—'}
                    </td>

                    {/* Thao tác */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEdit(rec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Sửa dòng này"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
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
