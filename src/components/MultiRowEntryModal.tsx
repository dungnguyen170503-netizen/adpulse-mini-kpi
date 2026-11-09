import React, { useState, useMemo } from 'react';
import { DailyAdRecord } from '../types/campaign';
import { calculateDailyMetrics } from '../utils/kpiEngine';
import { validateRow, findDuplicateDates } from '../utils/validation';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Layers,
  Undo2
} from 'lucide-react';

interface MultiRowEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (records: DailyAdRecord[]) => void;
  existingDates: string[];
}

interface DraftRow {
  id: string;
  date: string;
  spend: string;
  reach: string;
  clicks: string;
  orders: string;
  notes: string;
}

export const MultiRowEntryModal: React.FC<MultiRowEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingDates
}) => {
  const [rows, setRows] = useState<DraftRow[]>(() => {
    const today = new Date();
    return [0, 1, 2].map(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() - (2 - offset));
      return {
        id: `draft_${Date.now()}_${offset}`,
        date: d.toISOString().split('T')[0],
        spend: '300000',
        reach: '5000',
        clicks: '150',
        orders: '6',
        notes: ''
      };
    });
  });
  const [history, setHistory] = useState<DraftRow[][]>([]);

  const pushHistory = (current: DraftRow[]) => {
    setHistory(prev => [...prev.slice(-10), current.map(r => ({ ...r }))]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRows(previous);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleAddRow = () => {
    pushHistory(rows);
    let nextDate = new Date().toISOString().split('T')[0];
    if (rows.length > 0 && rows[rows.length - 1].date) {
      const last = new Date(rows[rows.length - 1].date);
      if (!isNaN(last.getTime())) {
        last.setDate(last.getDate() + 1);
        nextDate = last.toISOString().split('T')[0];
      }
    }

    setRows(prev => [
      ...prev,
      {
        id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        date: nextDate,
        spend: '',
        reach: '',
        clicks: '',
        orders: '',
        notes: ''
      }
    ]);
  };

  const handleAddWeek = () => {
    pushHistory(rows);
    const start = rows.length > 0 && rows[rows.length - 1].date
      ? new Date(rows[rows.length - 1].date)
      : new Date();

    const newRows: DraftRow[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      newRows.push({
        id: `draft_${Date.now()}_week_${i}`,
        date: d.toISOString().split('T')[0],
        spend: '',
        reach: '',
        clicks: '',
        orders: '',
        notes: ''
      });
    }
    setRows(prev => [...prev, ...newRows]);
  };

  const handleRowChange = (id: string, field: keyof DraftRow, value: string) => {
    pushHistory(rows);
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length === 1) return;
    pushHistory(rows);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const evaluatedRows = useMemo(() => {
    const duplicateCounts = findDuplicateDates(rows);

    return rows.map(row => {
      const record: Partial<DailyAdRecord> = {
        date: row.date,
        spend: row.spend.trim() === '' ? NaN : Number(row.spend),
        reach: row.reach.trim() === '' ? NaN : Number(row.reach),
        clicks: row.clicks.trim() === '' ? NaN : Number(row.clicks),
        orders: row.orders.trim() === '' ? NaN : Number(row.orders)
      };

      const val = validateRow(record);
      const isInternalDuplicate = duplicateCounts[row.date] > 1;
      const isExistingDuplicate = existingDates.includes(row.date);
      const kpis = calculateDailyMetrics(record as DailyAdRecord);

      return {
        ...row,
        validation: val,
        isInternalDuplicate,
        isExistingDuplicate,
        kpis,
        parsedRecord: {
          id: row.id,
          date: row.date,
          campaign_name: 'Chiến dịch Facebook Ads',
          spend: Number(record.spend),
          reach: Number(record.reach),
          clicks: Number(record.clicks),
          orders: Number(record.orders),
          source_type: 'manual' as const,
          status: val.isValid ? (val.hasWarnings ? 'warning' : 'valid') : 'invalid',
          notes: row.notes
        } as DailyAdRecord
      };
    });
  }, [rows, existingDates]);

  if (!isOpen) return null;

  const errorRowCount = evaluatedRows.filter(r => !r.validation.isValid).length;
  const hasErrors = errorRowCount > 0;
  const internalDuplicates = evaluatedRows.filter(r => r.isInternalDuplicate);

  const handleConfirmSave = () => {
    if (hasErrors) return;
    const recordsToSave = evaluatedRows.map(r => r.parsedRecord);
    onSave(recordsToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Nhập Số Liệu Nhiều Dòng (Batch Entry)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Nhập tay nhiều ngày cùng lúc • Xem trước KPI tức thì • Báo lỗi ngay cạnh ô cần sửa
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng hộp thoại nhập nhiều dòng"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Table Grid */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {internalDuplicates.length > 0 && (
            <div role="alert" className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Phát hiện ngày trùng lặp giữa các dòng nhập ({Array.from(new Set(internalDuplicates.map(d => d.date))).join(', ')}). Khi lưu hệ thống sẽ hỏi bạn muốn Gộp hay Ghi đè.
              </span>
            </div>
          )}

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-3 font-semibold">#</th>
                  <th className="py-3 px-3 font-semibold">Ngày (YYYY-MM-DD)</th>
                  <th className="py-3 px-3 font-semibold">Reach (Người)</th>
                  <th className="py-3 px-3 font-semibold">Clicks (Nhấp)</th>
                  <th className="py-3 px-3 font-semibold">Chi Phí (VNĐ)</th>
                  <th className="py-3 px-3 font-semibold">Đơn Hàng</th>
                  <th className="py-3 px-3 font-semibold bg-indigo-950/20 text-indigo-300">Xem Trước KPI</th>
                  <th className="py-3 px-3 font-semibold">Ghi Chú</th>
                  <th className="py-3 px-3 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {evaluatedRows.map((row, index) => {
                  const { validation, kpis, isInternalDuplicate, isExistingDuplicate } = row;
                  const hasErr = !validation.isValid;

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-800/40 transition-colors align-top ${
                        hasErr ? 'bg-rose-950/20' : isInternalDuplicate ? 'bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-500 font-sans">
                        {index + 1}
                      </td>

                      {/* Ngày */}
                      <td className="py-2.5 px-2">
                        <input
                          type="date"
                          aria-label={`Dòng ${index + 1} Ngày`}
                          aria-invalid={!!validation.errors.date}
                          value={row.date}
                          onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                          className={`w-36 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 ${
                            validation.errors.date
                              ? 'border-rose-500 focus:ring-rose-500'
                              : isInternalDuplicate
                              ? 'border-amber-500 text-amber-300'
                              : 'border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                        {validation.errors.date && (
                          <span role="alert" className="block text-[10px] text-rose-400 font-sans mt-1">
                            {validation.errors.date}
                          </span>
                        )}
                        {isExistingDuplicate && (
                          <span className="block text-[10px] text-amber-400 font-sans mt-0.5">
                            Ngày đã có (sẽ hỏi Gộp/Ghi đè)
                          </span>
                        )}
                      </td>

                      {/* Reach */}
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          aria-label={`Dòng ${index + 1} Reach`}
                          aria-invalid={!!validation.errors.reach}
                          placeholder="Nhập 0 nếu = 0"
                          min="0"
                          value={row.reach}
                          onChange={(e) => handleRowChange(row.id, 'reach', e.target.value)}
                          className={`w-24 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:ring-1 ${
                            validation.errors.reach
                              ? 'border-rose-500 focus:ring-rose-500'
                              : 'border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                        {validation.errors.reach && (
                          <span role="alert" className="block text-[10px] text-rose-400 font-sans mt-1">
                            Thiếu Reach (nhập 0 nếu = 0)
                          </span>
                        )}
                      </td>

                      {/* Clicks */}
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          aria-label={`Dòng ${index + 1} Clicks`}
                          aria-invalid={!!validation.errors.clicks}
                          placeholder="Nhập 0 nếu = 0"
                          min="0"
                          value={row.clicks}
                          onChange={(e) => handleRowChange(row.id, 'clicks', e.target.value)}
                          className={`w-20 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:ring-1 ${
                            validation.errors.clicks
                              ? 'border-rose-500 focus:ring-rose-500'
                              : 'border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                        {validation.errors.clicks && (
                          <span role="alert" className="block text-[10px] text-rose-400 font-sans mt-1">
                            Thiếu Click (nhập 0 nếu = 0)
                          </span>
                        )}
                        {validation.warnings.clicks && (
                          <span className="block text-[10px] text-amber-400 font-sans mt-1 max-w-[140px]">
                            Click &gt; Reach
                          </span>
                        )}
                      </td>

                      {/* Spend */}
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          aria-label={`Dòng ${index + 1} Chi phí`}
                          aria-invalid={!!validation.errors.spend}
                          placeholder="Nhập 0 nếu = 0"
                          min="0"
                          step="10000"
                          value={row.spend}
                          onChange={(e) => handleRowChange(row.id, 'spend', e.target.value)}
                          className={`w-32 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:ring-1 ${
                            validation.errors.spend
                              ? 'border-rose-500 focus:ring-rose-500'
                              : 'border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                        {validation.errors.spend && (
                          <span role="alert" className="block text-[10px] text-rose-400 font-sans mt-1">
                            Thiếu Chi phí (nhập 0 nếu = 0)
                          </span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          aria-label={`Dòng ${index + 1} Đơn hàng`}
                          aria-invalid={!!validation.errors.orders}
                          placeholder="Nhập 0 nếu = 0"
                          min="0"
                          value={row.orders}
                          onChange={(e) => handleRowChange(row.id, 'orders', e.target.value)}
                          className={`w-20 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:ring-1 ${
                            validation.errors.orders
                              ? 'border-rose-500 focus:ring-rose-500'
                              : 'border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                        {validation.errors.orders && (
                          <span role="alert" className="block text-[10px] text-rose-400 font-sans mt-1">
                            Thiếu Số đơn (nhập 0 nếu = 0)
                          </span>
                        )}
                      </td>

                      {/* Xem Trước KPI (Live Preview) */}
                      <td className="py-2.5 px-3 bg-indigo-950/10 font-sans">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400">CTR:</span>
                            <span className="font-semibold text-indigo-300 font-mono">
                              {kpis.ctr.formatted}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400">CPC:</span>
                            <span className={`font-semibold font-mono ${kpis.cpc.value === null ? 'text-amber-400' : 'text-slate-200'}`}>
                              {kpis.cpc.formatted}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400">CPA:</span>
                            <span className={`font-semibold font-mono ${kpis.cpa.value === null ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {kpis.cpa.formatted}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Ghi chú */}
                      <td className="py-2.5 px-2 font-sans">
                        <input
                          type="text"
                          aria-label={`Dòng ${index + 1} Ghi chú`}
                          placeholder="Ghi chú..."
                          value={row.notes}
                          onChange={(e) => handleRowChange(row.id, 'notes', e.target.value)}
                          className="w-36 bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Xóa dòng */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          disabled={rows.length === 1}
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Thanh công cụ thêm dòng & Hoàn tác */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Thêm 1 dòng</span>
              </button>
              <button
                type="button"
                onClick={handleAddWeek}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>+ Thêm 7 ngày</span>
              </button>
              <button
                type="button"
                disabled={history.length === 0}
                onClick={handleUndo}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Undo2 className="w-4 h-4 text-amber-400" />
                <span>Hoàn tác</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Đang có {rows.length} dòng nhập
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:px-8 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {hasErrors ? (
              <span role="alert" className="text-rose-400 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Còn {errorRowCount} dòng thiếu hoặc sai số liệu (hãy sửa các ô viền đỏ; nhập 0 nếu giá trị bằng 0)</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Dữ liệu hợp lệ, sẵn sàng xác nhận lưu vào hệ thống</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={hasErrors}
              onClick={handleConfirmSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận & Lưu ({rows.length} Dòng)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
