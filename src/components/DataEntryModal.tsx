import React, { useState } from 'react';
import { CampaignRecord } from '../types/campaign';
import { 
  X, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  ClipboardCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchAdd: (records: CampaignRecord[]) => void;
}

interface RowDraft {
  id: string;
  date: string;
  reach: string;
  click: string;
  spend: string;
  orders: string;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({ isOpen, onClose, onBatchAdd }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'paste'>('grid');
  const [pasteContent, setPasteContent] = useState('');
  const [pasteError, setPasteError] = useState('');

  // Khởi tạo sẵn 3 dòng trống để nhập
  const createEmptyRow = (dateOffset: number): RowDraft => {
    const d = new Date();
    d.setDate(d.getDate() - (2 - dateOffset));
    return {
      id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: d.toISOString().slice(0, 10),
      reach: '',
      click: '',
      spend: '',
      orders: '',
    };
  };

  const [draftRows, setDraftRows] = useState<RowDraft[]>([
    createEmptyRow(0),
    createEmptyRow(1),
    createEmptyRow(2),
  ]);

  if (!isOpen) return null;

  const handleAddDraftRow = () => {
    const lastRow = draftRows[draftRows.length - 1];
    let nextDate = new Date().toISOString().slice(0, 10);
    if (lastRow && lastRow.date) {
      try {
        const d = new Date(lastRow.date);
        d.setDate(d.getDate() + 1);
        nextDate = d.toISOString().slice(0, 10);
      } catch {}
    }
    setDraftRows([
      ...draftRows,
      {
        id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: nextDate,
        reach: '',
        click: '',
        spend: '',
        orders: '',
      },
    ]);
  };

  const handleUpdateRow = (id: string, field: keyof RowDraft, val: string) => {
    setDraftRows(draftRows.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleRemoveDraftRow = (id: string) => {
    if (draftRows.length <= 1) return;
    setDraftRows(draftRows.filter(r => r.id !== id));
  };

  const handleSaveGrid = () => {
    const validRecords: CampaignRecord[] = [];
    for (const r of draftRows) {
      // Chỉ lấy các dòng có ít nhất một thông tin có nghĩa
      if (r.date && (r.reach || r.click || r.spend || r.orders)) {
        validRecords.push({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          date: r.date,
          reach: Math.max(0, parseInt(r.reach, 10) || 0),
          click: Math.max(0, parseInt(r.click, 10) || 0),
          spend: Math.max(0, parseFloat(r.spend) || 0),
          orders: Math.max(0, parseInt(r.orders, 10) || 0),
        });
      }
    }

    if (validRecords.length === 0) {
      alert('Vui lòng nhập ít nhất một dòng có số liệu.');
      return;
    }

    onBatchAdd(validRecords);
    onClose();
  };

  // Trình phân tích dán từ Excel / Google Sheets
  const handleParsePaste = () => {
    setPasteError('');
    if (!pasteContent.trim()) {
      setPasteError('Vui lòng dán dữ liệu bảng từ Excel vào ô bên dưới.');
      return;
    }

    const lines = pasteContent.trim().split(/\r?\n/);
    const parsed: CampaignRecord[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Hỗ trợ phân cách bởi tab (Excel) hoặc dấu phẩy hoặc chấm phẩy
      const parts = line.includes('\t') 
        ? line.split('\t') 
        : line.includes(',') 
        ? line.split(',') 
        : line.split(/\s+/);

      // Nếu là dòng tiêu đề (chứa chữ reach/click/ngày...), bỏ qua
      if (i === 0 && (line.toLowerCase().includes('ngày') || line.toLowerCase().includes('date') || line.toLowerCase().includes('reach'))) {
        continue;
      }

      // Giả định định dạng chuẩn: Ngày, Reach, Click, Chi phí, Đơn hàng
      if (parts.length >= 4) {
        let date = parts[0].trim();
        // Xử lý format ngày nếu dạng DD/MM/YYYY
        if (date.includes('/')) {
          const dp = date.split('/');
          if (dp.length === 3) {
            date = `${dp[2]}-${dp[1].padStart(2, '0')}-${dp[0].padStart(2, '0')}`;
          }
        }

        const reach = Math.max(0, parseInt(parts[1].replace(/[.,\s]/g, ''), 10) || 0);
        const click = Math.max(0, parseInt(parts[2].replace(/[.,\s]/g, ''), 10) || 0);
        const spend = Math.max(0, parseFloat(parts[3].replace(/[.,\s]/g, '')) || 0);
        const orders = parts.length >= 5 ? Math.max(0, parseInt(parts[4].replace(/[.,\s]/g, ''), 10) || 0) : 0;

        parsed.push({
          id: `rec-excel-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          date: date || new Date().toISOString().slice(0, 10),
          reach,
          click,
          spend,
          orders,
        });
      }
    }

    if (parsed.length === 0) {
      setPasteError('Không thể nhận diện được các cột. Vui lòng đảm bảo các cột theo thứ tự: Ngày, Reach, Click, Chi phí, Đơn hàng.');
      return;
    }

    onBatchAdd(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Nhập Liệu Hàng Loạt (Nhiều Dòng)</h3>
              <p className="text-xs text-slate-400">Thêm nhiều ngày số liệu hoặc dán trực tiếp từ file Excel/Google Sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 pb-0 flex items-center gap-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'grid'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Nhập Bảng Đa Dòng ({draftRows.length} dòng)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dán Nhanh Từ Excel / Google Sheets
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'grid' ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 uppercase font-semibold">
                      <th className="py-2.5 px-3">Ngày</th>
                      <th className="py-2.5 px-3">Reach</th>
                      <th className="py-2.5 px-3">Click</th>
                      <th className="py-2.5 px-3">Chi phí (VNĐ)</th>
                      <th className="py-2.5 px-3">Đơn hàng</th>
                      <th className="py-2.5 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {draftRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3">
                          <input
                            type="date"
                            value={row.date}
                            onChange={(e) => handleUpdateRow(row.id, 'date', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-slate-950 border border-slate-700 text-white"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Reach"
                            value={row.reach}
                            onChange={(e) => handleUpdateRow(row.id, 'reach', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-slate-950 border border-slate-700 text-white"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Click"
                            value={row.click}
                            onChange={(e) => handleUpdateRow(row.id, 'click', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-slate-950 border border-slate-700 text-white"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="Chi phí"
                            value={row.spend}
                            onChange={(e) => handleUpdateRow(row.id, 'spend', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-slate-950 border border-slate-700 text-white"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Đơn"
                            value={row.orders}
                            onChange={(e) => handleUpdateRow(row.id, 'orders', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-slate-950 border border-slate-700 text-white"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveDraftRow(row.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Xóa dòng"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleAddDraftRow}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm dòng tiếp theo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Cách dán từ Excel / Google Sheets:</span>
                  <p className="mt-1 text-slate-400">
                    Bôi đen và Copy các cột trong bảng tính theo thứ tự: <span className="text-cyan-300 font-mono">Ngày | Reach | Click | Chi phí | Số đơn hàng</span>, sau đó dán (Ctrl+V) vào ô dưới đây.
                  </p>
                </div>
              </div>

              <textarea
                rows={8}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Ví dụ dán từ Excel:&#10;2026-11-01&#9;15000&#9;450&#9;650000&#9;12&#10;2026-11-02&#9;18200&#9;520&#9;780000&#9;15&#10;2026-11-03&#9;21000&#9;610&#9;920000&#9;18"
                className="w-full font-mono text-xs p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />

              {pasteError && (
                <p className="text-xs text-rose-400 font-medium">{pasteError}</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={activeTab === 'grid' ? handleSaveGrid : handleParsePaste}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{activeTab === 'grid' ? 'Lưu Toàn Bộ Vào Dashboard' : 'Nhận Diện & Nhập Vào'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
