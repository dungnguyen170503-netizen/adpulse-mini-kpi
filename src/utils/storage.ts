/**
 * LOCAL STORAGE PERSISTENCE LAYER - MODULE D1
 */

import { DailyAdRecord } from '../types/campaign';

const STORAGE_KEY = 'adpulse_campaign_records_v1';
const TIMESTAMP_KEY = 'adpulse_last_saved_at';

/**
 * Kiểm tra xem localStorage có sẵn sàng không
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lưu danh sách bản ghi vào LocalStorage
 */
export function saveCampaignData(records: DailyAdRecord[]): boolean {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage không khả dụng');
    return false;
  }

  try {
    const serialized = JSON.stringify(records);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu vào LocalStorage:', error);
    return false;
  }
}

/**
 * Tải danh sách bản ghi từ LocalStorage
 */
export function loadCampaignData(): DailyAdRecord[] {
  if (!isStorageAvailable()) return [];

  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Đảm bảo kiểu số hợp lệ khi parse lại từ JSON
    return parsed.map((item: any) => ({
      id: String(item.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
      date: String(item.date || ''),
      campaign_name: item.campaign_name ? String(item.campaign_name) : 'Chiến dịch chung',
      spend: Number(item.spend || 0),
      reach: Number(item.reach || 0),
      clicks: Number(item.clicks || item.click || 0),
      orders: Number(item.orders || 0),
      source_type: item.source_type || 'manual',
      status: item.status || 'valid',
      notes: item.notes || ''
    }));
  } catch (error) {
    console.error('Lỗi khi đọc từ LocalStorage:', error);
    return [];
  }
}

/**
 * Xóa sạch dữ liệu trong LocalStorage
 */
export function clearCampaignData(): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TIMESTAMP_KEY);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa LocalStorage:', error);
    return false;
  }
}

/**
 * Lấy thời điểm lưu gần nhất
 */
export function getLastSavedTimestamp(): string | null {
  if (!isStorageAvailable()) return null;
  return window.localStorage.getItem(TIMESTAMP_KEY);
}
