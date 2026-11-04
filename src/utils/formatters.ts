/**
 * Format tiền tệ VNĐ (ví dụ: 1.250.000 ₫)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format số nguyên có dấu chấm ngăn cách hàng nghìn (ví dụ: 15.420)
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}

/**
 * Format số gọn (Compact: 1.2k, 3.5M)
 */
export function formatCompact(value: number): string {
  if (isNaN(value)) return '0';
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'k';
  return value.toString();
}

/**
 * Format phần trăm (ví dụ: 2.34%)
 */
export function formatPercent(value: number, decimals = 2): string {
  if (isNaN(value) || value === null || value === undefined) return '0.00%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format ngày DD/MM/YYYY
 */
export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Format ngày hiển thị ngắn gọn cho nhãn biểu đồ (DD/MM)
 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}
