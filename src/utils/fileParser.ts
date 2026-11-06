/**
 * FILE (EXCEL / CSV) & TEXT COPY PARSER - MODULE D2
 */

import * as XLSX from 'xlsx';
import { ColumnMapping, DailyAdRecord, RawParseResult } from '../types/campaign';

/**
 * Chuẩn hóa số từ chuỗi có dấu phẩy, chấm, đơn vị tiền tệ
 */
export function normalizeNumber(val: any): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);

  // Xóa các ký tự tiền tệ: đ, VND, ₫, khoảng trắng, v.v.
  let str = String(val).trim().replace(/[₫đVNDvnd\s]/g, '');

  // Xử lý dấu phân cách hàng nghìn kiểu Việt Nam (ví dụ: 300.000 hoặc 300,000)
  // Nếu chuỗi có cả dấu chấm và phẩy: 1.234,56 hoặc 1,234.56
  if (str.includes('.') && str.includes(',')) {
    if (str.indexOf('.') < str.indexOf(',')) {
      // Dạng 1.234,56 -> bỏ chấm, thay phẩy thành chấm
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // Dạng 1,234.56 -> bỏ phẩy
      str = str.replace(/,/g, '');
    }
  } else if (str.includes('.')) {
    // Nếu chỉ có dấu chấm, ví dụ 300.000 (VND thường không có số lẻ thập phân)
    // Nếu có 3 chữ số sau chấm -> phân cách hàng nghìn
    const parts = str.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      str = str.replace(/\./g, '');
    }
  } else if (str.includes(',')) {
    const parts = str.split(',');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      str = str.replace(/,/g, '');
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num);
}

/**
 * Chuẩn hóa chuỗi ngày sang định dạng chuẩn YYYY-MM-DD
 */
export function normalizeDate(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];

  // Nếu là số serial ngày của Excel (ví dụ 45232)
  if (typeof val === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const dateObj = new Date(excelEpoch.getTime() + val * 86400000);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
  }

  const str = String(val).trim();

  // Dạng YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Dạng DD/MM/YYYY hoặc DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Dạng YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return str;
}

/**
 * Tự động gợi ý ánh xạ cột từ danh sách tiêu đề cột thực tế
 */
export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    date: '',
    spend: '',
    reach: '',
    clicks: '',
    orders: '',
    campaign_name: '',
    notes: ''
  };

  const lowerHeaders = headers.map(h => ({ original: h, lower: h.toLowerCase().trim() }));

  // 1. Date
  const datePatterns = ['ngày', 'date', 'day', 'thời gian', 'time', 'ngay'];
  const dateMatch = lowerHeaders.find(h => datePatterns.some(p => h.lower.includes(p)));
  if (dateMatch) mapping.date = dateMatch.original;

  // 2. Spend
  const spendPatterns = ['chi phí', 'spend', 'cost', 'tiền', 'số tiền', 'amount', 'ngân sách', 'chi phi'];
  const spendMatch = lowerHeaders.find(h => spendPatterns.some(p => h.lower.includes(p)));
  if (spendMatch) mapping.spend = spendMatch.original;

  // 3. Reach
  const reachPatterns = ['reach', 'tiếp cận', 'lượt tiếp cận', 'người tiếp cận', 'tiep can'];
  const reachMatch = lowerHeaders.find(h => reachPatterns.some(p => h.lower.includes(p)));
  if (reachMatch) mapping.reach = reachMatch.original;

  // 4. Clicks
  const clickPatterns = ['clicks', 'click', 'nhấp', 'lượt nhấp', 'lượt click', 'link clicks', 'nhap'];
  const clickMatch = lowerHeaders.find(h => clickPatterns.some(p => h.lower.includes(p)));
  if (clickMatch) mapping.clicks = clickMatch.original;

  // 5. Orders
  const orderPatterns = ['đơn hàng', 'đơn', 'orders', 'order', 'purchases', 'chuyển đổi', 'kết quả', 'don hang'];
  const orderMatch = lowerHeaders.find(h => orderPatterns.some(p => h.lower.includes(p)));
  if (orderMatch) mapping.orders = orderMatch.original;

  // 6. Campaign
  const campPatterns = ['chiến dịch', 'campaign', 'tên chiến dịch', 'chien dich'];
  const campMatch = lowerHeaders.find(h => campPatterns.some(p => h.lower.includes(p)));
  if (campMatch) mapping.campaign_name = campMatch.original;

  // 7. Notes
  const notePatterns = ['ghi chú', 'notes', 'note', 'ghi chu'];
  const noteMatch = lowerHeaders.find(h => notePatterns.some(p => h.lower.includes(p)));
  if (noteMatch) mapping.notes = noteMatch.original;

  return mapping;
}

/**
 * Phân tích file Excel (.xlsx, .xls)
 */
export async function parseExcelFile(file: File): Promise<RawParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('File Excel không có trang tính (Sheet) nào.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Chuyển sang mảng JSON các object
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    throw new Error('Trang tính trống, không có dữ liệu số liệu.');
  }

  const headers = Object.keys(rawRows[0]);
  const suggestedMapping = suggestColumnMapping(headers);

  return {
    headers,
    rows: rawRows,
    suggestedMapping,
    fileName: file.name,
    fileType: 'excel'
  };
}

/**
 * Phân tích chuỗi CSV hoặc TSV (Tab-separated từ Google Sheets / Excel copy)
 */
export function parseDelimitedText(text: string, fileName?: string): RawParseResult {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Nội dung văn bản trống.');
  }

  const lines = trimmed.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('Cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu.');
  }

  // Tự động nhận diện dấu phân cách: Tab '\t', Phẩy ',', hoặc Chấm phẩy ';'
  const firstLine = lines[0];
  let delimiter = '\t';
  if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(';') && (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) {
    delimiter = ';';
  } else if (firstLine.includes(',')) {
    delimiter = ',';
  }

  // Tách dòng có xử lý dấu ngoặc kép cơ bản
  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    return cells;
  };

  const headers = parseLine(lines[0]);
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rowObj: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      rowObj[h] = values[colIdx] ?? '';
    });
    rows.push(rowObj);
  }

  const suggestedMapping = suggestColumnMapping(headers);

  return {
    headers,
    rows,
    suggestedMapping,
    fileName: fileName || 'Dán từ clipboard',
    fileType: delimiter === '\t' ? 'text_tsv' : 'csv'
  };
}

/**
 * Chuyển đổi dữ liệu thô sang các bản ghi DailyAdRecord chuẩn dựa trên ánh xạ cột
 */
export function applyColumnMapping(
  rawRows: Record<string, any>[],
  mapping: ColumnMapping,
  sourceType: 'excel_csv' | 'text_copy' = 'excel_csv'
): DailyAdRecord[] {
  return rawRows.map((row, idx) => {
    const rawDate = mapping.date ? row[mapping.date] : '';
    const date = normalizeDate(rawDate);

    const spend = mapping.spend ? normalizeNumber(row[mapping.spend]) : 0;
    const reach = mapping.reach ? normalizeNumber(row[mapping.reach]) : 0;
    const clicks = mapping.clicks ? normalizeNumber(row[mapping.clicks]) : 0;
    const orders = mapping.orders ? normalizeNumber(row[mapping.orders]) : 0;

    const campaign_name = mapping.campaign_name && row[mapping.campaign_name]
      ? String(row[mapping.campaign_name]).trim()
      : 'Chiến dịch Facebook Ads';

    const notes = mapping.notes && row[mapping.notes]
      ? String(row[mapping.notes]).trim()
      : '';

    return {
      id: `import_${Date.now()}_${idx}`,
      date,
      campaign_name,
      spend,
      reach,
      clicks,
      orders,
      source_type: sourceType,
      status: (spend >= 0 && reach >= 0 && clicks >= 0 && orders >= 0 && date) ? 'valid' : 'warning',
      notes
    };
  });
}
