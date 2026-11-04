import { CampaignRecord, ReportFormat } from '../types/campaign';
import { calculateAggregates } from './calculations';
import { formatCurrency, formatPercent, formatDateVN } from './formatters';
import { analyzeCampaignWithAI } from './aiEngine';

export function generateReportText(records: CampaignRecord[], format: ReportFormat = 'boss'): string {
  if (!records || records.length === 0) {
    return 'Chưa có dữ liệu chiến dịch để xuất báo cáo.';
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const agg = calculateAggregates(sorted);
  const ai = analyzeCampaignWithAI(sorted);
  const startDate = formatDateVN(sorted[0].date);
  const endDate = formatDateVN(sorted[sorted.length - 1].date);
  const today = formatDateVN(new Date().toISOString().slice(0, 10));

  if (format === 'boss') {
    return `📌 [BÁO CÁO NHANH GỬI SẾP] HIỆU QUẢ CHIẾN DỊCH QUẢNG CÁO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Giai đoạn: ${startDate} - ${endDate} (${agg.daysCount} ngày chạy)
⏰ Thời gian xuất: ${today}

💰 KẾT QUẢ TỔNG QUAN:
• Tổng ngân sách đã chi: ${formatCurrency(agg.totalSpend)}
• Tổng số đơn hàng: ${agg.totalOrders} đơn
• Chi phí trung bình / đơn (CPA): ${formatCurrency(agg.avgCpa)} / đơn
• Tỷ lệ chuyển đổi đơn (CVR): ${formatPercent(agg.avgCvr)}
• Tổng lượt tiếp cận (Reach): ${agg.totalReach.toLocaleString('vi-VN')} người
• Lượt click quan tâm: ${agg.totalClick.toLocaleString('vi-VN')} clicks

🎯 ĐÁNH GIÁ CỦA AI & TEAM MARKETING:
• Trạng thái: ${ai.trendTitle}
• Nhận xét: ${ai.trendSummary}

🚀 03 ĐỀ XUẤT HÀNH ĐỘNG TUẦN TIẾP THEO:
1. ${ai.recommendations[0]?.title}: ${ai.recommendations[0]?.actionStep}
2. ${ai.recommendations[1]?.title}: ${ai.recommendations[1]?.actionStep}
3. ${ai.recommendations[2]?.title}: ${ai.recommendations[2]?.actionStep}

👉 Ý kiến đề xuất: Tiếp tục duy trì và tối ưu theo 3 hạng mục trên. Xin ý kiến chỉ đạo của Sếp!`;
  }

  if (format === 'client') {
    return `📊 BÁO CÁO HIỆU QUẢ CHIẾN DỊCH QUẢNG CÁO - KÍNH GỬI QUÝ ĐỐI TÁC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kính gửi: Quý Ban Lãnh Đạo / Đối Tác
Agency xin gửi báo cáo cập nhật tiến độ chiến dịch định kỳ:

1. THỜI GIAN THEO DÕI:
• Từ ngày: ${startDate} đến ngày ${endDate} (Tổng cộng: ${agg.daysCount} ngày hoạt động)

2. BẢNG CHỈ SỐ KPI CHÍNH (KEY METRICS):
• Chi phí quảng cáo: ${formatCurrency(agg.totalSpend)}
• Lượt tiếp cận khách hàng tiềm năng: ${agg.totalReach.toLocaleString('vi-VN')} lượt
• Lượt truy cập quảng cáo (Clicks): ${agg.totalClick.toLocaleString('vi-VN')} clicks
• Tỷ lệ nhấp (CTR): ${formatPercent(agg.avgCtr)}
• Chi phí trên mỗi lượt nhấp (CPC): ${formatCurrency(agg.avgCpc)}
• Tổng đơn hàng ghi nhận: ${agg.totalOrders} đơn
• Chi phí trên mỗi đơn hàng (CPA): ${formatCurrency(agg.avgCpa)}

3. PHÂN TÍCH CHUYÊN MÔN TỪ AI & CHUYÊN VIÊN MEDIA:
• Xu hướng chung: ${ai.trendTitle}
• Đánh giá chi tiết: ${ai.trendSummary}
• Đánh giá nội dung (CTR): ${ai.metricsAssessment.ctrEvaluation.text}
• Đánh giá chi phí đơn (CPA): ${ai.metricsAssessment.cpaEvaluation.text}

4. KẾ HOẠCH TỐI ƯU GIAI ĐOẠN TIẾP THEO:
[1] ${ai.recommendations[0]?.title}:
    ➜ ${ai.recommendations[0]?.description}
[2] ${ai.recommendations[1]?.title}:
    ➜ ${ai.recommendations[1]?.description}
[3] ${ai.recommendations[2]?.title}:
    ➜ ${ai.recommendations[2]?.description}

Mọi thắc mắc và đóng góp ý kiến, Quý khách vui lòng phản hồi lại email/tin nhắn này.
Trân trọng cảm ơn sự đồng hành của Quý Đối Tác!`;
  }

  if (format === 'technical') {
    return `⚡ [MEDIA BUYER OPS LOG] CAMPAIGN PERFORMANCE REPORT
==================================================
Date Range: ${startDate} -> ${endDate} | Days: ${agg.daysCount}
Last Updated: ${today}

[CORE METRICS]
• Total Spend : ${formatCurrency(agg.totalSpend)}
• Total Reach : ${agg.totalReach.toLocaleString('vi-VN')}
• Total Clicks: ${agg.totalClick.toLocaleString('vi-VN')}
• Total Orders: ${agg.totalOrders}
• Blended CTR : ${formatPercent(agg.avgCtr)}
• Blended CPC : ${formatCurrency(agg.avgCpc)}
• Blended CPA : ${formatCurrency(agg.avgCpa)}
• Blended CVR : ${formatPercent(agg.avgCvr)}

[DIAGNOSTICS & SYSTEM SIGNALS]
• Health Status : ${ai.trendStatus.toUpperCase()}
• Trend Engine  : ${ai.trendTitle}
• Summary       : ${ai.trendSummary}

[ACTION PLAN SPRINT]
1. ${ai.recommendations[0]?.category} -> ${ai.recommendations[0]?.title} (${ai.recommendations[0]?.actionStep})
2. ${ai.recommendations[1]?.category} -> ${ai.recommendations[1]?.title} (${ai.recommendations[1]?.actionStep})
3. ${ai.recommendations[2]?.category} -> ${ai.recommendations[2]?.title} (${ai.recommendations[2]?.actionStep})
==================================================`;
  }

  // Quick summary for Zalo/Telegram
  return `📢 Cập nhật nhanh KPI (${startDate} - ${endDate}):
- Chi tiêu: ${formatCurrency(agg.totalSpend)}
- Đơn hàng: ${agg.totalOrders} đơn (CPA: ${formatCurrency(agg.avgCpa)})
- CTR: ${formatPercent(agg.avgCtr)} | CPC: ${formatCurrency(agg.avgCpc)}
- Xu hướng: ${ai.trendTitle}
👉 Đề xuất: ${ai.recommendations[0]?.actionStep}`;
}
