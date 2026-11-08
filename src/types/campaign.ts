/**
 * DATA CONTRACT DEFINITION - MODULE C1, D1, D2, D3
 * Single Source of Truth for AdPulse KPI Dashboard
 */

export type SourceType = 'manual' | 'excel_csv' | 'text_copy' | 'image_ocr';
export type RecordStatus = 'valid' | 'warning' | 'draft' | 'invalid';

/**
 * Bản ghi dữ liệu theo ngày chuẩn Contract C1
 */
export interface DailyAdRecord {
  id: string;
  date: string;               // YYYY-MM-DD
  campaign_name?: string;     // Tên chiến dịch
  spend: number;              // Chi phí (VNĐ)
  reach: number;              // Lượt tiếp cận (Người)
  clicks: number;             // Lượt click
  orders: number;             // Số đơn hàng thành công
  source_type: SourceType;    // Nguồn dữ liệu
  status: RecordStatus;       // Trạng thái kiểm tra
  notes?: string;             // Ghi chú
}

/**
 * Trạng thái giá trị tính toán KPI
 */
export type MetricStatus = 'valid' | 'zero_division' | 'missing_data' | 'out_of_bounds';

export interface MetricValue<T> {
  value: T | null;
  formatted: string;
  status: MetricStatus;
  warningMessage?: string;
}

/**
 * Bộ chỉ số KPI đã được tính toán bởi Core Engine
 */
export interface CalculatedKPIs {
  ctr: MetricValue<number>;   // Tỷ lệ nhấp (%)
  cpc: MetricValue<number>;   // Chi phí mỗi nhấp (VNĐ)
  cpa: MetricValue<number>;   // Chi phí mỗi đơn (VNĐ)
  cvr: MetricValue<number>;   // Tỷ lệ chuyển đổi (%)
}

/**
 * Bản ghi theo ngày kèm theo các chỉ số KPI đã tính
 */
export interface CalculatedDailyRecord extends DailyAdRecord {
  kpis: CalculatedKPIs;
}

/**
 * Bản ghi tổng hợp kỳ (dành cho OCR ảnh chỉ có tổng kỳ)
 */
export interface PeriodSummaryRecord {
  id: string;
  period_start: string;
  period_end: string;
  total_spend: number;
  total_reach: number;
  total_clicks: number;
  total_orders: number;
  is_aggregate_only: true;
  notes?: string;
  imageSourceUrl?: string;
  imageFileName?: string;
}

/**
 * Snapshot Báo Cáo Hợp Nhất dùng chung (SSOT Contract C1 <-> C2)
 */
export interface AiAnalysis {
  status: 'ready'; source: string; model: string; generatedAt: string;
  snapshotId: string; dataVersion: string; summary: string;
  suggestions: { title: string; evidence: string; limitation: string; action: string; verification: string }[];
}
export interface CampaignReportSnapshot {
  ai?: AiAnalysis;
  meta: {
    snapshotId: string;
    generatedAt: string;         // ISO 8601 timestamp
    periodStart: string;         // YYYY-MM-DD
    periodEnd: string;           // YYYY-MM-DD
    totalDays: number;
    currency: 'VND';
    campaignName: string;
    hasDailyBreakdown: boolean;
  };
  totals: {
    spend: number;
    reachSum: number;            // Tổng lượt tiếp cận từng ngày cộng dồn
    clicks: number;
    orders: number;
  };
  kpis: CalculatedKPIs;          // KPI toàn kỳ (Weighted Aggregates)
  dailyRecords: CalculatedDailyRecord[];
  summaryRecord?: PeriodSummaryRecord; // Bản ghi tổng hợp nếu nạp từ ảnh tổng kỳ
  dataIntegrity: {
    isClean: boolean;
    missingFieldsCount: number;
    zeroDivisionCount: number;
    duplicateDatesResolved: number;
    warnings: string[];
  };
}

/**
 * Kết quả kiểm tra tính hợp lệ của dòng nhập
 */
export interface RowValidationResult {
  isValid: boolean;
  hasWarnings: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

/**
 * Ánh xạ cột từ File / Text sang các trường chuẩn của hệ thống
 */
export interface ColumnMapping {
  date: string;
  spend: string;
  reach: string;
  clicks: string;
  orders: string;
  campaign_name?: string;
  notes?: string;
}

/**
 * Kết quả phân tích thô của File / Clipboard Text
 */
export interface RawParseResult {
  headers: string[];
  rows: Record<string, any>[];
  suggestedMapping: ColumnMapping;
  fileName?: string;
  fileType: 'excel' | 'csv' | 'text_tsv';
}

/**
 * Dữ liệu bản nháp nhận diện từ Ảnh Chụp OCR
 */
export interface ImageOcrDraft {
  mode: 'daily_rows' | 'period_summary';
  imagePreviewUrl: string;
  fileName: string;
  confidenceScore: number; // 0 - 100
  periodSummary?: {
    period_start: string;
    period_end: string;
    total_spend: number;
    total_reach: number;
    total_clicks: number;
    total_orders: number;
  };
  dailyRows?: Partial<DailyAdRecord>[];
  ambiguities: string[]; // Các điểm mơ hồ cần người dùng chỉnh sửa trước khi lưu
  uncertainFields?: { rowIndex?: number; field: string; reason: string }[];
}
