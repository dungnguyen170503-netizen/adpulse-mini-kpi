/**
 * ==============================================================================
 * MODULE BẠN C: AI NHẬN XÉT XU HƯỚNG & XUẤT BÁO CÁO DẠNG TEXT
 * Đề 7: Dashboard KPI Chiến Dịch Quảng Cáo Mini (Vibe Coding)
 * Tác giả: Bạn C (Ngô Tài Lộc - Siêu Tốc Marketing / Kstudy)
 * ==============================================================================
 */

(function (window) {
  'use strict';

  const AIReportEngine = {
    /**
     * 1. PHÂN TÍCH XU HƯỚNG & ĐÁNH GIÁ SỨC KHỎE CHIẾN DỊCH (Yêu cầu 4)
     * @param {Object} stats - Dữ liệu thống kê đã được tính toán từ Bạn B
     * @param {Object} config - Ngưỡng mục tiêu (targetMaxCPA, targetMinCTR)
     */
    analyzeTrends(stats, config = {}) {
      const targetMaxCPA = config.targetMaxCPA || 200000;
      const targetMinCTR = config.targetMinCTR || 2.0;

      // Xử lý dữ liệu biên / dữ liệu rỗng
      if (!stats || !stats.rows || stats.rows.length === 0) {
        return {
          healthStatus: 'empty',
          healthLabel: 'Chưa có dữ liệu',
          healthBadgeClass: 'px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption border border-outline-variant',
          trends: [
            { icon: 'info', iconColor: 'text-on-surface-variant', text: 'Vui lòng nhập số liệu chiến dịch để AI phân tích xu hướng.' }
          ],
          recommendations: [
            { tag: 'Khởi tạo', text: 'Nhập ít nhất 3 ngày dữ liệu liên tiếp để AI nhận diện chu kỳ và quy luật biến động.' },
            { tag: 'Kiểm soát', text: 'Thiết lập ngưỡng CPA mục tiêu để kích hoạt hệ thống cảnh báo sớm.' },
            { tag: 'Theo dõi', text: 'Ghi chép chi phí và đơn hàng hàng ngày vào cùng một khung giờ đối soát.' }
          ]
        };
      }

      // Đánh giá sức khỏe tổng thể
      const isCpaOver = stats.avgCPA > targetMaxCPA && stats.totalOrders > 0;
      const isCtrLow = stats.avgCTR < targetMinCTR && stats.totalReach > 0;
      let healthStatus = 'good';
      let healthLabel = 'Sức khỏe: TỐT';
      let healthBadgeClass = 'px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-caption text-caption font-semibold border border-[#86EFAC]';

      if (isCpaOver) {
        healthStatus = 'danger';
        healthLabel = 'Sức khỏe: BÁO ĐỘNG CPA';
        healthBadgeClass = 'px-2 py-0.5 rounded bg-[#FEE2E2] text-[#B91C1C] font-caption text-caption font-semibold border border-[#FCA5A5]';
      } else if (isCtrLow) {
        healthStatus = 'warning';
        healthLabel = 'Sức khỏe: CẦN TỐI ƯU CTR';
        healthBadgeClass = 'px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-caption text-caption font-semibold border border-[#FDE68A]';
      }

      // Phân tích hướng biến động (nửa đầu kỳ vs nửa cuối kỳ)
      const spendDir = stats.spendTrendPct >= 0 ? 'Tăng' : 'Giảm';
      const ordersDir = stats.ordersTrendPct >= 0 ? 'tăng' : 'giảm';
      const spendSign = stats.spendTrendPct >= 0 ? '+' : '';
      const ordersSign = stats.ordersTrendPct >= 0 ? '+' : '';

      const bestDayText = stats.bestDay
        ? `Ngày hiệu quả nhất là <strong>${stats.bestDay.date}</strong> đạt <strong>${stats.bestDay.orders} đơn</strong> với CPA tối ưu <strong>${this.formatCurrency(stats.bestDay.cpa)}</strong>.`
        : 'Chưa ghi nhận ngày phát sinh đơn hàng tối ưu.';

      const warningText = stats.worstDay && stats.worstDay.cpa > targetMaxCPA
        ? `<strong>Cảnh báo đốt tiền:</strong> Ngày <strong>${stats.worstDay.date}</strong> CPA tăng vọt lên <strong>${this.formatCurrency(stats.worstDay.cpa)}</strong>, vượt ngưỡng an toàn.`
        : stats.highestCPCDay
          ? `<strong>Lưu ý:</strong> Ngày <strong>${stats.highestCPCDay.date}</strong> có giá Click cao nhất (${this.formatCurrency(stats.highestCPCDay.cpc)}) với CTR đạt ${this.formatPercent(stats.highestCPCDay.ctr)}.`
          : 'Chi phí trên từng tương tác đang giữ ở mức cân bằng.';

      const trends = [
        {
          icon: stats.ordersTrendPct >= 0 ? 'trending_up' : 'trending_down',
          iconColor: stats.ordersTrendPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]',
          text: `<strong>Chi phí & Đơn hàng:</strong> Ngân sách ${spendDir.toLowerCase()} <strong>${spendSign}${stats.spendTrendPct.toFixed(1)}%</strong> ở nửa cuối chu kỳ, sản lượng đơn ${ordersDir} <strong>${ordersSign}${stats.ordersTrendPct.toFixed(1)}%</strong>.`
        },
        {
          icon: stats.cpaTrendPct <= 0 ? 'verified' : 'error',
          iconColor: stats.cpaTrendPct <= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]',
          text: `<strong>Hiệu quả CPA:</strong> Dao động từ <strong>${this.formatCurrency(stats.firstCPA)}</strong> sang <strong>${this.formatCurrency(stats.secondCPA)}</strong>. ${bestDayText}`
        },
        {
          icon: 'warning',
          iconColor: isCpaOver ? 'text-[#B91C1C]' : 'text-[#B45309]',
          text: warningText
        }
      ];

      // Đúng 03 Gợi ý cải thiện chiến dịch
      const recommendations = this.generate3Recommendations(stats, { targetMaxCPA, targetMinCTR });

      return {
        healthStatus,
        healthLabel,
        healthBadgeClass,
        trends,
        recommendations
      };
    },

    /**
     * TẠO ĐÚNG 03 GỢI Ý CẢI THIỆN CHIẾN DỊCH THỰC CHIẾN
     */
    generate3Recommendations(stats, { targetMaxCPA, targetMinCTR }) {
      const recs = [];

      // Gợi ý 1: Về Creative & Nội dung quảng cáo (Dựa vào CTR)
      if (stats.avgCTR < targetMinCTR || stats.ctrDiff < -0.2) {
        recs.push({
          tag: 'Ưu tiên 1 - Creative & Content',
          tagClass: 'bg-[#FEE2E2] text-[#B91C1C]',
          text: `CTR trung bình đang thấp (<strong>${this.formatPercent(stats.avgCTR)}</strong>). Cần thay mới <strong>Video Hook 3 giây đầu</strong>, thử nghiệm định dạng Carousel và tắt các mẫu ảnh tĩnh có CTR dưới 1.5% để giảm giá Click.`
        });
      } else {
        recs.push({
          tag: 'Ưu tiên 1 - Creative Thắng',
          tagClass: 'bg-[#DCFCE7] text-[#15803D]',
          text: `Mẫu quảng cáo ngày <strong>${stats.bestDay ? stats.bestDay.date : 'đỉnh'}</strong> đang phân phối rất tốt (CTR đạt <strong>${stats.bestDay ? this.formatPercent(stats.bestDay.ctr) : 'cao'}</strong>). Hãy nhân bản định dạng này sang 2 nhóm đối tượng Lookalike tương tự.`
        });
      }

      // Gợi ý 2: Về Phân bổ Ngân sách & Đấu thầu (Dựa vào CPA)
      if (stats.avgCPA > targetMaxCPA) {
        recs.push({
          tag: 'Ưu tiên 2 - Kiểm soát Ngân sách',
          tagClass: 'bg-[#FEE2E2] text-[#B91C1C]',
          text: `CPA trung bình (<strong>${this.formatCurrency(stats.avgCPA)}</strong>) vượt trần ${this.formatCurrency(targetMaxCPA)}. Cần giảm 25% ngân sách ở các nhóm quảng cáo có chi phí trên 500k mà không phát sinh đơn, đồng thời bật quy tắc tự động tắt nhóm lỗ.`
        });
      } else {
        recs.push({
          tag: 'Ưu tiên 2 - Tăng tốc Ngân sách',
          tagClass: 'bg-[#E0E7FF] text-[#3730A3]',
          text: `CPA đang rất tốt (<strong>${this.formatCurrency(stats.avgCPA)}</strong> so với trần ${this.formatCurrency(targetMaxCPA)}). Đề xuất tăng 15 - 20% ngân sách tổng thể vào các khung giờ vàng (19h - 22h) để mở rộng quy mô đơn hàng.`
        });
      }

      // Gợi ý 3: Về Tỷ lệ Chốt đơn & Tối ưu Trang đích (Dựa vào CR)
      const crVal = stats.avgCR || 0;
      if (crVal < 1.5) {
        recs.push({
          tag: 'Ưu tiên 3 - Tối ưu Tỷ lệ Chốt (CR)',
          tagClass: 'bg-[#FEF3C7] text-[#B45309]',
          text: `Tỷ lệ chuyển đổi từ Click ra Đơn hiện đạt <strong>${this.formatPercent(crVal)}</strong>. Cần kiểm tra tốc độ tải trang đích trên di động, rút gọn form đặt hàng xuống còn 3 trường cơ bản và thêm bằng chứng xã hội (feedback, đánh giá).`
        });
      } else {
        recs.push({
          tag: 'Ưu tiên 3 - Nâng giá trị giỏ hàng',
          tagClass: 'bg-[#DCFCE7] text-[#15803D]',
          text: `Tỷ lệ chốt ổn định ở mức <strong>${this.formatPercent(crVal)}</strong>. Triển khai gói combo hoặc quà tặng kèm để tăng giá trị trung bình trên một đơn (AOV), giúp tối đa hóa lợi nhuận trên chi phí quảng cáo.`
        });
      }

      return recs;
    },

    /**
     * 2. XUẤT VĂN BẢN BÁO CÁO TÓM TẮT DẠNG TEXT (Yêu cầu 5)
     * Hỗ trợ 3 phong cách: 'boss' (Gửi Sếp), 'client' (Gửi Khách hàng), 'team' (Kỹ thuật nội bộ)
     */
    generateExportText(stats, tone = 'boss', campaignName = 'Chiến dịch Quảng Cáo', config = {}) {
      const targetMaxCPA = config.targetMaxCPA || 200000;
      const dateRangeText = stats.dateRangeText || '7 ngày gần nhất';
      const kpiStatus = stats.avgCPA <= targetMaxCPA
        ? `Đạt KPI (Mục tiêu < ${this.formatNumber(targetMaxCPA)} đ)`
        : `Vượt trần KPI ${this.formatNumber(targetMaxCPA)} đ - Đang xử lý tối ưu`;

      const bestDayStr = stats.bestDay
        ? `${stats.bestDay.date} (${stats.bestDay.orders} đơn, CPA ${this.formatNumber(stats.bestDay.cpa)} đ)`
        : 'Chưa có';

      if (tone === 'boss') {
        return `📊 BÁO CÁO NHANH HIỆU QUẢ QUẢNG CÁO (${dateRangeText})
Chiến dịch: ${campaignName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SỐ LIỆU TÀI CHÍNH & KẾT QUẢ:
• Tổng ngân sách đã chi: ${this.formatNumber(stats.totalSpend)} VNĐ
• Tổng đơn hàng thu về: ${this.formatNumber(stats.totalOrders)} đơn (TB: ${stats.avgOrdersPerDay ? stats.avgOrdersPerDay.toFixed(1) : 0} đơn/ngày)
• Chi phí trung bình / Đơn (CPA): ${this.formatNumber(stats.avgCPA)} VNĐ (${kpiStatus})

2. HIỆU SUẤT VẬN HÀNH:
• Tiếp cận (Reach): ${this.formatNumber(stats.totalReach)} | Lượt Click: ${this.formatNumber(stats.totalClick)}
• Tỷ lệ nhấp (CTR): ${this.formatPercent(stats.avgCTR)} | Giá Click (CPC): ${this.formatNumber(stats.avgCPC)} VNĐ
• Tỷ lệ chuyển đổi Click -> Đơn (CR): ${this.formatPercent(stats.avgCR)}

3. ĐÁNH GIÁ & ĐỀ XUẤT HÀNH ĐỘNG:
• Ngày đạt phong độ tốt nhất: ${bestDayStr}.
• Đề xuất: Tập trung tăng ngân sách vào mẫu quảng cáo thắng, kiểm soát chặt CPA và duy trì mục tiêu đơn hàng trong chu kỳ kế tiếp.`;
      }

      if (tone === 'client') {
        return `Kính gửi Quý Khách hàng,
Đội ngũ vận hành xin gửi báo cáo tổng kết hiệu quả chiến dịch "${campaignName}" chu kỳ ${dateRangeText}:

1. KẾT QUẢ CHUYỂN ĐỔI & ĐẦU TƯ:
• Tổng ngân sách chiến dịch đã đầu tư: ${this.formatNumber(stats.totalSpend)} VNĐ
• Tổng số đơn hàng trực tiếp ghi nhận: ${this.formatNumber(stats.totalOrders)} đơn
• Chi phí trung bình để mang về một đơn hàng (CPA): ${this.formatNumber(stats.avgCPA)} VNĐ (${kpiStatus})

2. CHỈ SỐ TIẾP CẬN THƯƠNG HIỆU:
• Lượt người dùng tiếp cận (Reach): ${this.formatNumber(stats.totalReach)} lượt
• Lượt người dùng bấm quan tâm (Click): ${this.formatNumber(stats.totalClick)} lượt
• Tỷ lệ tương tác nhấp quảng cáo (CTR): ${this.formatPercent(stats.avgCTR)}

3. KẾ HOẠCH TỐI ƯU TUẦN TIẾP THEO:
• Nhân rộng mẫu thông điệp đạt hiệu quả cao nhất vào ngày ${bestDayStr}.
• Tinh chỉnh trang đích và kịch bản chăm sóc khách để gia tăng tỷ lệ chốt đơn và tối ưu chi phí quảng cáo.`;
      }

      // tone === 'team'
      return `[BÁO CÁO KỸ THUẬT MEDIA BUYING] - ${campaignName.toUpperCase()}
Chu kỳ: ${dateRangeText} (${stats.count || 0} ngày)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PHỄU DỮ LIỆU ĐẦU CUỐI:
- Spend: ${this.formatNumber(stats.totalSpend)} đ (CPM: ${this.formatNumber(stats.avgCPM)} đ)
- Reach: ${this.formatNumber(stats.totalReach)} | Click: ${this.formatNumber(stats.totalClick)}
- CTR: ${this.formatPercent(stats.avgCTR)} | CPC: ${this.formatNumber(stats.avgCPC)} đ
- Orders: ${this.formatNumber(stats.totalOrders)} đơn | CR: ${this.formatPercent(stats.avgCR)}
- CPA thực tế: ${this.formatNumber(stats.avgCPA)} đ | Mục tiêu: < ${this.formatNumber(targetMaxCPA)} đ
- Ngày Peak tối ưu: ${bestDayStr}

2. 03 ACTION ITEMS TRIỂN KHAI NGAY:
[1] Creative: Giữ nguyên góc tiếp cận của mẫu ngày ${stats.bestDay ? stats.bestDay.date : 'Peak'}, sản xuất thêm 2 biến thể video 3s đầu.
[2] Budget: Dịch chuyển 20% ngân sách sang khung 19h-22h, tắt ngay ad sets CPA > ${this.formatNumber(targetMaxCPA)} đ.
[3] Landing Page: Đẩy tốc độ tải trang di động dưới 2s để cải thiện CR từ ${this.formatPercent(stats.avgCR)} lên mốc > 2.0%.`;
    },

    /**
     * 3. RENDER VÀO GIAO DIỆN (DOM)
     */
    renderToUI(stats, config = {}) {
      const analysis = this.analyzeTrends(stats, config);

      // Render Badge Sức khỏe
      const healthBadge = document.getElementById('ai-health-badge');
      if (healthBadge) {
        healthBadge.className = analysis.healthBadgeClass;
        healthBadge.textContent = analysis.healthLabel;
      }

      // Render Danh sách xu hướng
      const trendList = document.getElementById('ai-trend-list');
      if (trendList) {
        trendList.innerHTML = analysis.trends.map(t => `
          <li class="flex items-start gap-2">
            <span class="material-symbols-outlined ${t.iconColor} text-[16px] shrink-0 mt-0.5">${t.icon}</span>
            <span>${t.text}</span>
          </li>
        `).join('');
      }

      // Render 03 Gợi ý
      const recContainer = document.getElementById('ai-recommendations-list');
      if (recContainer) {
        recContainer.innerHTML = analysis.recommendations.map(r => `
          <div class="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${r.tagClass || 'bg-primary/10 text-primary'}">${r.tag}</span>
            <p class="font-body-sm text-body-sm text-on-surface leading-snug">${r.text}</p>
          </div>
        `).join('');
      }

      // Render Text trong Modal Báo cáo
      const tone = window.appState ? window.appState.reportTone : 'boss';
      const campaignName = window.appState ? window.appState.campaignName : 'Chiến dịch Quảng Cáo';
      const textContent = this.generateExportText(stats, tone, campaignName, config);
      const textarea = document.getElementById('report-text-content');
      if (textarea) {
        textarea.value = textContent;
      }
    },

    /**
     * 4. HÀM SAO CHÉP VĂN BẢN VÀO CLIPBOARD (1-Click Copy)
     */
    copyReport() {
      const textarea = document.getElementById('report-text-content');
      if (!textarea) return;
      textarea.select();
      navigator.clipboard.writeText(textarea.value).then(() => {
        const btn = document.getElementById('copy-btn');
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">done_all</span><span>Đã sao chép!</span>';
          btn.classList.add('bg-[#15803D]');
          setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('bg-[#15803D]');
          }, 2000);
        }
        if (typeof window.showGlobalToast === 'function') {
          window.showGlobalToast('Đã sao chép báo cáo vào bộ nhớ tạm (Clipboard)!');
        } else {
          alert('Đã sao chép báo cáo vào bộ nhớ tạm!');
        }
      });
    },

    // TIỆN ÍCH FORMAT
    formatNumber(val) {
      if (!val || isNaN(val)) return '0';
      return Math.round(val).toLocaleString('vi-VN');
    },

    formatCurrency(val) {
      return this.formatNumber(val) + ' đ';
    },

    formatPercent(val) {
      if (val === undefined || val === null || isNaN(val)) return '0,0%';
      return val.toFixed(1).replace('.', ',') + '%';
    }
  };

  // Đăng ký toàn cục
  window.AIReportEngine = AIReportEngine;
  window.copyReportToClipboard = () => AIReportEngine.copyReport();

})(window);
