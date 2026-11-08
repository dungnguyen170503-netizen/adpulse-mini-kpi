/**
 * VALIDATION & DATA INTEGRITY ENGINE - MODULE D1
 */

import { DailyAdRecord, RowValidationResult } from '../types/campaign';

/**
 * Kiểm tra tính hợp lệ của một dòng nhập liệu
 */
export function validateRow(row: Partial<DailyAdRecord>): RowValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // 1. Kiểm tra ngày (Date)
  if (!row.date || row.date.trim() === '') {
    errors.date = 'Ngày không được để trống';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row.date)) {
      errors.date = 'Định dạng ngày phải là YYYY-MM-DD';
    } else {
      const parsed = new Date(row.date);
      if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== row.date) {
        errors.date = 'Ngày không tồn tại hợp lệ';
      }
    }
  }

  // 2. Kiểm tra Chi phí (Spend)
  if (row.spend === undefined || row.spend === null || !Number.isFinite(Number(row.spend))) {
    errors.spend = 'Chi phí phải là số';
  } else if (Number(row.spend) < 0) {
    errors.spend = 'Chi phí không được là số âm';
  }

  // 3. Kiểm tra Lượt tiếp cận (Reach)
  if (row.reach === undefined || row.reach === null || !Number.isFinite(Number(row.reach))) {
    errors.reach = 'Reach phải là số';
  } else if (Number(row.reach) < 0) {
    errors.reach = 'Reach không được là số âm';
  }

  // 4. Kiểm tra Lượt click (Clicks)
  if (row.clicks === undefined || row.clicks === null || !Number.isFinite(Number(row.clicks))) {
    errors.clicks = 'Clicks phải là số';
  } else if (Number(row.clicks) < 0) {
    errors.clicks = 'Clicks không được là số âm';
  }

  // 5. Kiểm tra Đơn hàng (Orders)
  if (row.orders === undefined || row.orders === null || !Number.isFinite(Number(row.orders))) {
    errors.orders = 'Đơn hàng phải là số';
  } else if (Number(row.orders) < 0) {
    errors.orders = 'Đơn hàng không được là số âm';
  }

  // 6. Kiểm tra các cảnh báo nghiệp vụ (Business Warnings)
  const reach = Number(row.reach || 0);
  const clicks = Number(row.clicks || 0);
  const spend = Number(row.spend || 0);
  const orders = Number(row.orders || 0);

  if (clicks > reach && reach > 0) {
    warnings.clicks = `Clicks (${clicks.toLocaleString()}) lớn hơn Reach (${reach.toLocaleString()}). Hãy kiểm tra có nhầm cột Impressions không.`;
  }

  if (spend > 300000 && clicks > 30 && orders === 0) {
    warnings.orders = `Đã chi ${spend.toLocaleString('vi-VN')} đ nhưng 0 đơn hàng (Cảnh báo đốt ngân sách).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    hasWarnings: Object.keys(warnings).length > 0,
    errors,
    warnings
  };
}

/**
 * Tìm các ngày bị trùng lặp trong một danh sách bản ghi
 */
export function findDuplicateDates(records: Array<{ date: string }>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of records) {
    if (r.date) {
      counts[r.date] = (counts[r.date] || 0) + 1;
    }
  }

  const duplicates: Record<string, number> = {};
  for (const date in counts) {
    if (counts[date] > 1) {
      duplicates[date] = counts[date];
    }
  }
  return duplicates;
}

/**
 * Gộp các bản ghi có cùng ngày lại thành một bản ghi duy nhất (Sum Merge)
 */
export function mergeDuplicateRecords(records: DailyAdRecord[]): DailyAdRecord[] {
  const dateMap: Record<string, DailyAdRecord> = {};

  for (const record of records) {
    if (!dateMap[record.date]) {
      dateMap[record.date] = { ...record };
    } else {
      const existing = dateMap[record.date];
      existing.spend += Number(record.spend || 0);
      existing.reach += Number(record.reach || 0);
      existing.clicks += Number(record.clicks || 0);
      existing.orders += Number(record.orders || 0);
      existing.notes = [existing.notes, record.notes].filter(Boolean).join(' | ');
      existing.status = 'valid';
    }
  }

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}
