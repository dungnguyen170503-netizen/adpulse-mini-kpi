/**
 * LOCAL STORAGE PERSISTENCE LAYER - MODULE D1
 */

import { DailyAdRecord } from '../types/campaign';

const STORAGE_KEY = 'adpulse_campaign_records_v1';
const TIMESTAMP_KEY = 'adpulse_last_saved_at';
const INITIALIZED_FLAG_KEY = 'adpulse_app_initialized_v1';

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
 * Kiểm tra xem app đã từng được mở / khởi tạo hay chưa
 */
export function isAppInitialized(): boolean {
  if (!isStorageAvailable()) return false;
  return window.localStorage.getItem(INITIALIZED_FLAG_KEY) === 'true';
}

/**
 * Đánh dấu app đã được khởi tạo
 */
export function markAppInitialized(): void {
  if (!isStorageAvailable()) return;
  window.localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
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
    window.localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu vào LocalStorage:', error);
    return false;
  }
}

/**
 * Tải danh sách bản ghi từ LocalStorage
 * Trả về null nếu là lần đầu tiên mở ứng dụng (chưa từng lưu hay xóa gì).
 * Trả về [] nếu người dùng đã từng khởi tạo nhưng đã xóa sạch dữ liệu.
 */
export function loadCampaignData(): DailyAdRecord[] | null {
  if (!isStorageAvailable()) return null;

  try {
    const isInit = window.localStorage.getItem(INITIALIZED_FLAG_KEY);
    const data = window.localStorage.getItem(STORAGE_KEY);

    // Lần đầu mở app: chưa có cờ initialized và chưa có key trong storage
    if (!isInit && data === null) {
      return null;
    }

    // Đã khởi tạo nhưng data rỗng hoặc là '[]': người dùng đã xóa hết dữ liệu
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Đảm bảo kiểu số hợp lệ khi parse lại từ JSON
    return parsed.map((item: any) => ({
      id: String(item.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
      date: String(item.date || ''),
      campaign_name: item.campaign_name ? String(item.campaign_name) : 'Chiến dịch chung',
      spend: Number(item.spend ?? 0),
      reach: Number(item.reach ?? 0),
      clicks: Number(item.clicks ?? item.click ?? 0),
      orders: Number(item.orders ?? 0),
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
 * Giữ cờ INITIALIZED_FLAG_KEY = 'true' và lưu mảng rỗng []
 * để khi reload trang, hệ thống hiểu là người dùng đã xóa hết và KHÔNG tự động phục hồi dữ liệu mẫu.
 */
export function clearCampaignData(): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
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
