import { CampaignRecord } from '../types/campaign';
import { SAMPLE_CAMPAIGN_DATA } from '../data/sampleData';

const STORAGE_KEY = 'vibe_coding_campaign_kpi_v1';

export function loadCampaignData(): CampaignRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Tự động nạp dữ liệu mẫu ban đầu để dashboard luôn trực quan
      saveCampaignData(SAMPLE_CAMPAIGN_DATA);
      return SAMPLE_CAMPAIGN_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_CAMPAIGN_DATA;
  } catch (err) {
    console.error('Lỗi khi đọc dữ liệu từ localStorage:', err);
    return SAMPLE_CAMPAIGN_DATA;
  }
}

export function saveCampaignData(data: CampaignRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Lỗi khi ghi dữ liệu vào localStorage:', err);
  }
}

export function clearCampaignData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
  }
}

/**
 * Xuất dữ liệu ra file JSON
 */
export function exportToJson(data: CampaignRecord[]): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `kpi_campaign_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Xuất dữ liệu ra file CSV
 */
export function exportToCsv(data: CampaignRecord[]): void {
  const headers = ['Ngày', 'Reach', 'Click', 'Chi phí (VNĐ)', 'Đơn hàng'];
  const rows = data.map(r => [
    r.date,
    r.reach,
    r.click,
    r.spend,
    r.orders
  ]);

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `kpi_campaign_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
