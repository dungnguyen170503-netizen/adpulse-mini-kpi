export interface CampaignRecord {
  id: string;
  date: string;       // YYYY-MM-DD
  reach: number;      // Số người tiếp cận
  click: number;      // Số lượt click
  spend: number;      // Chi phí (VNĐ)
  orders: number;     // Số đơn hàng thành công
}

export interface CalculatedCampaignRecord extends CampaignRecord {
  ctr: number;        // Click-Through Rate (%) = (click / reach) * 100
  cpc: number;        // Cost Per Click (VNĐ) = spend / click
  cpa: number;        // Cost Per Order / Acquisition (VNĐ) = spend / orders
  cvr: number;        // Conversion Rate (%) = (orders / click) * 100
}

export interface MetricComparison {
  spendChangePct: number;
  reachChangePct: number;
  clickChangePct: number;
  ordersChangePct: number;
  ctrChangePct: number;
  cpcChangePct: number;
  cpaChangePct: number;
}

export interface AggregatedMetrics {
  totalSpend: number;
  totalReach: number;
  totalClick: number;
  totalOrders: number;
  avgCtr: number;
  avgCpc: number;
  avgCpa: number;
  avgCvr: number;
  daysCount: number;
  comparison?: MetricComparison;
}

export interface AIRecommendation {
  id: number;
  title: string;
  category: 'Creative' | 'Audience' | 'Budget & Bid' | 'Funnel / CRO';
  description: string;
  impact: 'High' | 'Medium' | 'Quick Win';
  actionStep: string;
}

export interface AIAnalysisResult {
  trendStatus: 'positive' | 'warning' | 'critical' | 'neutral';
  trendTitle: string;
  trendSummary: string;
  keyDrivers: string[];
  recommendations: AIRecommendation[];
  metricsAssessment: {
    ctrEvaluation: { status: 'good' | 'average' | 'poor'; text: string };
    cpcEvaluation: { status: 'good' | 'average' | 'poor'; text: string };
    cpaEvaluation: { status: 'good' | 'average' | 'poor'; text: string };
  };
}

export type ReportFormat = 'boss' | 'client' | 'technical' | 'quick-summary';
