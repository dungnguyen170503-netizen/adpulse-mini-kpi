import React, { useState } from 'react';
import { CampaignRecord } from '../types/campaign';
import { calculateRecordMetrics } from '../utils/calculations';
import { formatCurrency, formatNumber, formatPercent, formatDateVN } from '../utils/formatters';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Download, 
  Calendar, 
  Layers, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface DataTableProps {
  records: CampaignRecord[];
  onAddRecord: (record: CampaignRecord) => void;
  onUpdateRecord: (record: CampaignRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onOpenMultiEntry: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onClearAll,
  onExportCsv,
  onExportJson,
  onOpenMultiEntry,
}) => {
  // Trạng thái thêm dòng đơn
  const todayStr = new Date().toISOString().slice(0, 10);
  const [newDate, setNewDate] = useState(todayStr);
  const [newReach, setNewReach] = useState('');
  const [newClick, setNewClick] = useState('');
  const [newSpend, setNewSpend] = useState('');
  const [newOrders, setNewOrders] = useState('');
  const [formError, setFormError] = useState('');

  // Trạng thái sửa dòng inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<CampaignRecord>>({});

  // Sắp xếp ngày giảm dần (ngày mới nhất lên đầu để tiện theo dõi)
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newDate) {
      setFormError('Vui lòng chọn ngày.');
      return;
    }

    const reachVal = parseInt(newReach, 10) || 0;
    const clickVal = parseInt(newClick, 10) || 0;
    const spendVal = parseFloat(newSpend) || 0;
    const ordersVal = parseInt(newOrders, 10) || 0;

    if (reachVal < 0 || clickVal < 0 || spendVal < 0 || ordersVal < 0) {
      setFormError('Các chỉ số số liệu không được là số âm.');
      return;
    }

    if (clickVal > reachVal && reachVal > 0) {
      setFormError('Lượt click không thể lớn hơn lượt tiếp cận (Reach).');
      return;
    }

    const newRecord: CampaignRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: newDate,
      reach: reachVal,
      click: clickVal,
      spend: spendVal,
      orders: ordersVal,
    };

    onAddRecord(newRecord);

    // Reset form & tự động tăng lên ngày tiếp theo cho tiện nhập liên tiếp
    try {
      const d = new Date(newDate);
      d.setDate(d.getDate() + 1);
      setNewDate(d.toISOString().slice(0, 10));
    } catch {
      setNewDate(todayStr);
    }
    setNewReach('');
    setNewClick('');
    setNewSpend('');
    setNewOrders('');
  };

  const startEdit = (rec: CampaignRecord) => {
    setEditingId(rec.id);
    setEditValues({ ...rec });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = (id: string) => {
    if (!editValues) return;
    const updated: CampaignRecord = {
      id,
      date: editValues.date || todayStr,
      reach: Math.max(0, Number(editValues.reach) || 0),
      click: Math.max(0, Number(editValues.click) || 0),
      spend: Math.max(0, Number(editValues.spend) || 0),
      orders: Math.max(0, Number(editValues.orders) || 0),
    };
    onUpdateRecord(updated);
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl">
      {/* Tiêu đề & Nút thao tác bảng */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Nhật Ký Dữ Liệu Quảng Cáo
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tự động tính CTR, CPC, CPA và lưu trữ thời gian thực vào localStorage
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenMultiEntry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Thêm nhiều dòng</span>
          </button>

          <button
            onClick={onExportCsv}
            title="Xuất bảng số liệu ra file CSV mở bằng Excel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            title="Xuất file JSON sao lưu cấu trúc"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>

          {records.length > 0 && (
            <button
              onClick={onClearAll}
              title="Xóa trắng toàn bộ dữ liệu"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa hết</span>
            </button>
          )}
        </div>
      </div>

      {/* Form nhập dữ liệu đơn hàng ngày (Requirement 1: Form nhập số liệu theo ngày) */}
      <form onSubmit={handleQuickAdd} className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-400" />
            Thêm Nhanh Dòng Số Liệu Mới:
          </span>
          {formError && (
            <span className="text-rose-400 flex items-center gap-1 normal-case font-normal text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              {formError}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Ngày */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Ngày chạy</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Reach */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Reach (Tiếp cận)</label>
            <input
              type="number"
              min="0"
              placeholder="VD: 15000"
              value={newReach}
              onChange={(e) => setNewReach(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Click */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Click (Lượt nhấp)</label>
            <input
              type="number"
              min="0"
              placeholder="VD: 450"
              value={newClick}
              onChange={(e) => setNewClick(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Chi phí (VNĐ) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Chi phí (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="VD: 650000"
              value={newSpend}
              onChange={(e) => setNewSpend(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Đơn hàng */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Số đơn hàng</label>
            <input
              type="number"
              min="0"
              placeholder="VD: 10"
              value={newOrders}
              onChange={(e) => setNewOrders(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Nút Thêm */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Dòng</span>
            </button>
          </div>
        </div>
      </form>

      {/* Bảng hiển thị danh sách dòng & Tự động tính chỉ số (Requirement 1 & Requirement 3) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Ngày</th>
              <th className="py-3 px-4 text-right">Reach</th>
              <th className="py-3 px-4 text-right">Click</th>
              <th className="py-3 px-4 text-right">Chi Phí (VNĐ)</th>
              <th className="py-3 px-4 text-right">Đơn Hàng</th>
              <th className="py-3 px-4 text-right text-pink-400">CTR (%)</th>
              <th className="py-3 px-4 text-right text-purple-400">CPC (VNĐ)</th>
              <th className="py-3 px-4 text-right text-amber-400 font-bold">CPA / Đơn (VNĐ)</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  Chưa có dữ liệu ngày nào. Hãy thêm một dòng ở trên hoặc nạp dữ liệu mẫu!
                </td>
              </tr>
            ) : (
              sortedRecords.map((record) => {
                const isEditing = editingId === record.id;
                const calc = calculateRecordMetrics(record);

                if (isEditing) {
                  return (
                    <tr key={record.id} className="bg-indigo-950/20">
                      <td className="py-2.5 px-3">
                        <input
                          type="date"
                          value={editValues.date || ''}
                          onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={editValues.reach ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, reach: Number(e.target.value) })}
                          className="w-full px-2 py-1 text-xs text-right rounded bg-slate-900 border border-slate-700 text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={editValues.click ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, click: Number(e.target.value) })}
                          className="w-full px-2 py-1 text-xs text-right rounded bg-slate-900 border border-slate-700 text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={editValues.spend ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, spend: Number(e.target.value) })}
                          className="w-full px-2 py-1 text-xs text-right rounded bg-slate-900 border border-slate-700 text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={editValues.orders ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, orders: Number(e.target.value) })}
                          className="w-full px-2 py-1 text-xs text-right rounded bg-slate-900 border border-slate-700 text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 italic">Tự tính</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 italic">Tự tính</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 italic">Tự tính</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => saveEdit(record.id)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20"
                            title="Lưu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {formatDateVN(record.date)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {formatNumber(record.reach)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {formatNumber(record.click)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-200">
                      {formatCurrency(record.spend)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {formatNumber(record.orders)}
                    </td>
                    {/* Tự động tính các chỉ số: CTR, CPC, CPA */}
                    <td className="py-3 px-4 text-right text-pink-400 font-semibold">
                      {formatPercent(calc.ctr)}
                    </td>
                    <td className="py-3 px-4 text-right text-purple-300">
                      {formatCurrency(calc.cpc)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-300">
                      {formatCurrency(calc.cpa)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400">
                        <button
                          onClick={() => startEdit(record)}
                          className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                          title="Sửa dòng này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(record.id)}
                          className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
        </table>
      </div>
    </div>
  );
};
