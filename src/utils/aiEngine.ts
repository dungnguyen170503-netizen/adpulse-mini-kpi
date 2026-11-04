import { CampaignRecord, AIAnalysisResult, AIRecommendation } from '../types/campaign';
import { calculateAggregates, calculateRecordMetrics } from './calculations';
import { formatCurrency, formatPercent } from './formatters';

export function analyzeCampaignWithAI(records: CampaignRecord[]): AIAnalysisResult {
  if (!records || records.length === 0) {
    return {
      trendStatus: 'neutral',
      trendTitle: 'Chưa có đủ dữ liệu để phân tích',
      trendSummary: 'Hãy nhập ít nhất 2 ngày dữ liệu chiến dịch để AI quét và phân tích xu hướng chuyên sâu.',
      keyDrivers: ['Chờ dữ liệu nhập liệu từ Marketer'],
      recommendations: [
        {
          id: 1,
          category: 'Budget & Bid',
          title: 'Khởi tạo ngân sách thử nghiệm',
          description: 'Bắt đầu với ngân sách nhỏ (300k - 500k/ngày) để máy học tối ưu phân phối.',
          impact: 'Quick Win',
          actionStep: 'Nhập dữ liệu 3-5 ngày đầu tiên để xem phản ứng thị trường.'
        },
        {
          id: 2,
          category: 'Creative',
          title: 'Chuẩn bị từ 3-5 mẫu quảng cáo (Creatives)',
          description: 'Đa dạng hóa góc tiếp cận (Pain point, Testimonial, Bóc hộp) trước khi chạy.',
          impact: 'High',
          actionStep: 'Tạo sẵn 3 hook video đầu 3 giây để test CTR.'
        },
        {
          id: 3,
          category: 'Funnel / CRO',
          title: 'Kiểm tra Pixel và mã đo lường',
          description: 'Đảm bảo sự kiện Mua hàng (Purchase) được ghi nhận chính xác 1:1.',
          impact: 'High',
          actionStep: 'Test đặt thử đơn hàng trên website/landing page.'
        }
      ],
      metricsAssessment: {
        ctrEvaluation: { status: 'average', text: 'Chưa có dữ liệu' },
        cpcEvaluation: { status: 'average', text: 'Chưa có dữ liệu' },
        cpaEvaluation: { status: 'average', text: 'Chưa có dữ liệu' }
      }
    };
  }

  // Sắp xếp theo ngày tăng dần
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const calculatedList = sorted.map(calculateRecordMetrics);
  const agg = calculateAggregates(sorted);

  // Phân tích chỉ số tổng quan
  const avgCtr = agg.avgCtr;
  const avgCpc = agg.avgCpc;
  const avgCpa = agg.avgCpa;
  const avgCvr = agg.avgCvr;

  // Đánh giá CTR (Benchmark trung bình ngành e-commerce ~1.5% - 2.5%)
  let ctrStatus: 'good' | 'average' | 'poor' = 'average';
  let ctrText = '';
  if (avgCtr >= 2.5) {
    ctrStatus = 'good';
    ctrText = `CTR xuất sắc (${formatPercent(avgCtr)}). Nội dung & hình ảnh quảng cáo rất cuốn hút người xem.`;
  } else if (avgCtr >= 1.2) {
    ctrStatus = 'average';
    ctrText = `CTR ở mức trung bình (${formatPercent(avgCtr)}). Nội dung ổn định nhưng chưa có điểm bứt phá mạnh.`;
  } else {
    ctrStatus = 'poor';
    ctrText = `CTR thấp cảnh báo (${formatPercent(avgCtr)}). Hook quảng cáo yếu hoặc sai tệp mục tiêu ban đầu.`;
  }

  // Đánh giá CPC
  let cpcStatus: 'good' | 'average' | 'poor' = 'average';
  let cpcText = '';
  if (avgCpc <= 1500) {
    cpcStatus = 'good';
    cpcText = `CPC tối ưu (${formatCurrency(avgCpc)}/click). Chi phí tiếp cận click rất rẻ so với mặt bằng chung.`;
  } else if (avgCpc <= 3500) {
    cpcStatus = 'average';
    cpcText = `CPC ở mức chấp nhận được (${formatCurrency(avgCpc)}/click).`;
  } else {
    cpcStatus = 'poor';
    cpcText = `CPC khá cao (${formatCurrency(avgCpc)}/click). Cần mở rộng tệp hoặc giảm độ cạnh tranh đối tượng.`;
  }

  // Đánh giá CPA
  let cpaStatus: 'good' | 'average' | 'poor' = 'average';
  let cpaText = '';
  if (avgCpa <= 80000 && agg.totalOrders > 0) {
    cpaStatus = 'good';
    cpaText = `CPA rất lý tưởng (${formatCurrency(avgCpa)}/đơn). Biên độ lợi nhuận ròng được bảo toàn tốt.`;
  } else if (avgCpa <= 150000 && agg.totalOrders > 0) {
    cpaStatus = 'average';
    cpaText = `CPA trung bình (${formatCurrency(avgCpa)}/đơn). Cần kiểm soát chặt giá trị đơn hàng trung bình (AOV).`;
  } else {
    cpaStatus = 'poor';
    cpaText = agg.totalOrders === 0 
      ? `Chưa có đơn hàng nào phát sinh dù đã chi ${formatCurrency(agg.totalSpend)}. Cần dừng để rà soát phễu!` 
      : `CPA cao (${formatCurrency(avgCpa)}/đơn). Nguy cơ lãng phí ngân sách hoặc tỷ lệ chốt thấp.`;
  }

  // Phân tích xu hướng biến động (So sánh 3 ngày cuối vs giai đoạn trước)
  const isMultiDay = sorted.length >= 3;
  let trendStatus: 'positive' | 'warning' | 'critical' | 'neutral' = 'neutral';
  let trendTitle = 'Chiến dịch đang vận hành ổn định';
  let trendSummary = '';
  const keyDrivers: string[] = [];

  if (isMultiDay) {
    const recent = calculatedList.slice(-3);
    const prior = calculatedList.slice(0, -3);

    const recentSpend = recent.reduce((s, r) => s + r.spend, 0);
    const recentOrders = recent.reduce((s, r) => s + r.orders, 0);
    const recentCpa = recentOrders > 0 ? recentSpend / recentOrders : 9999999;
    const recentCtr = recent.reduce((s, r) => s + r.click, 0) / Math.max(1, recent.reduce((s, r) => s + r.reach, 0)) * 100;

    const priorSpend = prior.reduce((s, r) => s + r.spend, 0);
    const priorOrders = prior.reduce((s, r) => s + r.orders, 0);
    const priorCpa = priorOrders > 0 ? priorSpend / priorOrders : (recentOrders > 0 ? recentCpa : 0);
    const priorCtr = prior.reduce((s, r) => s + r.click, 0) / Math.max(1, prior.reduce((s, r) => s + r.reach, 0)) * 100;

    const cpaChange = priorCpa > 0 ? ((recentCpa - priorCpa) / priorCpa) * 100 : 0;
    const ctrChange = priorCtr > 0 ? ((recentCtr - priorCtr) / priorCtr) * 100 : 0;
    const spendChange = priorSpend > 0 ? ((recentSpend - priorSpend) / priorSpend) * 100 : 0;

    // Logic chẩn đoán
    if (recentOrders === 0 && recentSpend > 500000) {
      trendStatus = 'critical';
      trendTitle = 'Cảnh báo nghiêm trọng: Đốt ngân sách nhưng không ra đơn';
      trendSummary = `Trong 3 ngày gần nhất, bạn đã chi ${formatCurrency(recentSpend)} nhưng thu về 0 đơn hàng. Tỷ lệ chuyển đổi bị nghẽn hoàn toàn.`;
      keyDrivers.push('Tỷ lệ chuyển đổi đơn hàng rơi xuống 0%');
      keyDrivers.push(`Đã tiêu hao ${formatCurrency(recentSpend)} mà không có điểm sinh lời`);
      keyDrivers.push('Nguy cơ cao lỗi cổng thanh toán, lỗi form đặt hàng hoặc offer không hấp dẫn');
    } else if (cpaChange > 25 && ctrChange < -10) {
      trendStatus = 'warning';
      trendTitle = 'Xu hướng giảm hiệu quả: Dấu hiệu bão hòa quảng cáo (Ad Fatigue)';
      trendSummary = `Chi phí trên mỗi đơn (CPA) trong 3 ngày gần đây tăng vọt ${Math.round(cpaChange)}%, đồng thời CTR sụt giảm ${Math.abs(Math.round(ctrChange))}%. Người xem đã bắt đầu nhờn nội dung quảng cáo hiện tại.`;
      keyDrivers.push(`CPA gần đây tăng từ ${formatCurrency(priorCpa)} lên ${formatCurrency(recentCpa)}/đơn (+${Math.round(cpaChange)}%)`);
      keyDrivers.push(`CTR có xu hướng giảm sút (${formatPercent(recentCtr)} so với ${formatPercent(priorCtr)} giai đoạn trước)`);
      keyDrivers.push('Độ tươi mới của bài quảng cáo bị suy giảm');
    } else if (cpaChange < -5 && recentOrders >= (priorOrders / Math.max(1, prior.length)) * 3) {
      trendStatus = 'positive';
      trendTitle = 'Xu hướng tăng trưởng mạnh mẽ: Tối ưu hiệu quả chi phí';
      trendSummary = `Chiến dịch đang đi vào điểm rơi tối ưu! CPA giảm ${Math.abs(Math.round(cpaChange))}% trong khi lượng đơn hàng giữ đà tăng trưởng đều đặn. Máy học phân phối chuẩn xác vào tệp khách hàng tiềm năng cao.`;
      keyDrivers.push(`CPA tối ưu về mức ${formatCurrency(recentCpa)}/đơn (giảm ${Math.abs(Math.round(cpaChange))}%)`);
      keyDrivers.push(`Ghi nhận tổng ${agg.totalOrders} đơn hàng với tỷ lệ chuyển đổi CVR đạt ${formatPercent(avgCvr)}`);
      keyDrivers.push('CTR và CPC duy trì ở dải an toàn, biên lợi nhuận tích cực');
    } else if (spendChange > 40 && recentOrders > 0) {
      trendStatus = 'positive';
      trendTitle = 'Chiến dịch đang trong giai đoạn Mở rộng (Scale Up)';
      trendSummary = `Ngân sách được tăng thêm ${Math.round(spendChange)}%, lượng tiếp cận và đơn hàng tăng trưởng tương ứng. Cần giám sát chặt chỉ số CPA trần để tránh tăng chi phí đột biến.`;
      keyDrivers.push(`Quy mô tiếp cận đạt ${agg.totalReach.toLocaleString('vi-VN')} người`);
      keyDrivers.push(`CPA hiện tại đang giữ ở mức ${formatCurrency(recentCpa)}/đơn`);
      keyDrivers.push('Sẵn sàng cho việc phân tách nhóm thử nghiệm');
    } else {
      trendStatus = 'neutral';
      trendTitle = 'Hiệu suất vận hành giữ nhịp ổn định';
      trendSummary = `Các chỉ số CTR (${formatPercent(avgCtr)}), CPC (${formatCurrency(avgCpc)}) và CPA (${formatCurrency(avgCpa)}) dao động trong biên độ cho phép, chưa xuất hiện biến động tiêu cực bất thường.`;
      keyDrivers.push(`Tổng chi phí: ${formatCurrency(agg.totalSpend)} mang về ${agg.totalOrders} đơn hàng`);
      keyDrivers.push(`CTR trung bình đạt ${formatPercent(avgCtr)}`);
      keyDrivers.push(`Chi phí trên mỗi lượt nhấp: ${formatCurrency(avgCpc)}`);
    }
  } else {
    trendStatus = 'neutral';
    trendTitle = 'Dữ liệu đang tiếp tục được ghi nhận';
    trendSummary = `Đã ghi nhận ${agg.daysCount} ngày dữ liệu. Hãy tiếp tục duy trì và theo dõi từ 3-7 ngày để AI nhận diện chu kỳ chuyển đổi đầy đủ.`;
    keyDrivers.push(`Tổng chi: ${formatCurrency(agg.totalSpend)} - Tiếp cận: ${agg.totalReach.toLocaleString('vi-VN')} người`);
    keyDrivers.push(`CTR hiện tại: ${formatPercent(avgCtr)} | CPA: ${formatCurrency(avgCpa)}`);
  }

  // TẠO CHÍNH XÁC 03 GỢI Ý CẢI THIỆN CHIẾN DỊCH (Actionable Recommendations)
  const recommendations: AIRecommendation[] = [];

  // Gợi ý 1: Về Creative / Hook
  if (avgCtr < 2.0 || trendStatus === 'warning') {
    recommendations.push({
      id: 1,
      category: 'Creative',
      title: 'Làm mới Content & Thay đổi 3 Giây Đầu (Hook Refresh)',
      description: 'CTR đang có dấu hiệu đi xuống hoặc dưới chuẩn ngành. Hãy thử nghiệm ngay 3 mẫu video/ảnh mới nhấn vào nỗi đau cụ thể (Pain-point) hoặc dẫn chứng khách hàng thật (Social Proof).',
      impact: 'High',
      actionStep: 'Tạo 3 biến thể hook mở đầu mới và tắt các adset có tần suất (frequency) > 2.5.'
    });
  } else {
    recommendations.push({
      id: 1,
      category: 'Creative',
      title: 'Nhân bản mẫu Ads chiến thắng sang định dạng Reels & Story',
      description: `Mẫu quảng cáo hiện tại đang đạt CTR tốt (${formatPercent(avgCtr)}). Hãy cắt ngắn thành dạng 15s dọc (9:16) để tận dụng vị trí hiển thị giá rẻ trên Reels và TikTok.`,
      impact: 'Quick Win',
      actionStep: 'Xuất bản thêm 2 phiên bản vertical 9:16 giữ nguyên âm thanh và thông điệp cốt lõi.'
    });
  }

  // Gợi ý 2: Về Audience & Budget Bidding
  if (trendStatus === 'warning' || avgCpa > 120000) {
    recommendations.push({
      id: 2,
      category: 'Budget & Bid',
      title: 'Thiết lập Ngưỡng Chi Phí Trần (Cost Cap) & Mở rộng Tệp Đối Tượng',
      description: 'CPA đang có xu hướng đội giá. Tránh dùng thầu tự động không giới hạn (Highest Volume); hãy đặt Cost Cap bằng 1.1x CPA kỳ vọng để ép AI nền tảng tìm tệp người mua rẻ hơn.',
      impact: 'High',
      actionStep: 'Tạo tệp Lookalike 2% - 3% từ danh sách khách đã mua và đặt Cost Cap khống chế giá thầu.'
    });
  } else {
    recommendations.push({
      id: 2,
      category: 'Audience',
      title: 'Mở rộng quy mô ngân sách 15% - 20% mỗi 48 giờ',
      description: `Hiệu quả CPA đang rất tốt (${formatCurrency(avgCpa)}/đơn). Đây là thời điểm vàng để scale ngân sách một cách nhịp nhàng mà không làm vỡ máy học của Ads Manager.`,
      impact: 'High',
      actionStep: 'Tăng ngân sách chiến dịch vào đầu khung giờ 00:00 sáng với biên độ tối đa 20%.'
    });
  }

  // Gợi ý 3: Về Conversion Rate & Offer (CRO / Funnel)
  if (avgCvr < 2.5 || agg.totalOrders < 15) {
    recommendations.push({
      id: 3,
      category: 'Funnel / CRO',
      title: 'Thêm Ưu Đãi Giới Hạn & Đơn Giản Hóa Form Đặt Hàng',
      description: 'Lượt click vào nhiều nhưng tỷ lệ chốt đơn còn thấp. Cần bổ sung đòn bẩy tâm lý: Miễn phí vận chuyển cho đơn hôm nay, quà tặng giới hạn, và rút gọn form xuống chỉ còn 3 trường (Tên, SĐT, Địa chỉ).',
      impact: 'Quick Win',
      actionStep: 'Bật đồng hồ đếm ngược Flash Sale trên trang đích và kiểm tra tốc độ tải trang mobile < 2.5s.'
    });
  } else {
    recommendations.push({
      id: 3,
      category: 'Funnel / CRO',
      title: 'Triển khai Chiến lược Bán thêm (Upsell / Order Bump)',
      description: 'Khách hàng có tỷ lệ mua rất tốt. Hãy thêm lựa chọn Mua 2 tặng 1 hoặc mua combo kèm phụ kiện ngay tại bước giỏ hàng để gia tăng giá trị đơn trung bình (AOV).',
      impact: 'Quick Win',
      actionStep: 'Cài đặt Order Bump giảm giá 30% cho sản phẩm kèm theo ngay dưới nút Xác nhận đặt hàng.'
    });
  }

  return {
    trendStatus,
    trendTitle,
    trendSummary,
    keyDrivers,
    recommendations,
    metricsAssessment: {
      ctrEvaluation: { status: ctrStatus, text: ctrText },
      cpcEvaluation: { status: cpcStatus, text: cpcText },
      cpaEvaluation: { status: cpaStatus, text: cpaText }
    }
  };
}
