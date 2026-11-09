# Cấu Trúc Dữ Liệu Bản Ghi Tổng Kỳ (Period Summary Spec) — Gửi Trịnh Khoa

**Người gửi:** Nguyễn Thanh Dũng (Lead Data / KPI SSOT)  
**Người nhận:** Trịnh Khoa (UX / Dashboard Lead)  
**Ngày bàn giao:** 08/11/2026 • Đề 7, Bảng B  
**Mục đích:** Bàn giao cấu trúc dữ liệu `PeriodSummaryRecord` và bộ số mẫu trích xuất từ ảnh OCR để Khoa phát triển giao diện hiển thị tổng kỳ song song.

---

## 1. Nguyên Tắc Thiết Kế (C1 Contract & Data Ethics)

1. **Không tạo ngày giả mạo (Zero Hallucination):** Khi người dùng tải lên ảnh chụp báo cáo Meta Ads chỉ có số tổng cả kỳ (Summary Widget), hệ thống **tuyệt đối không chia đều cho $N$ ngày** để tạo các bản ghi theo ngày ảo.
2. **Lưu trữ độc lập:** Bản ghi được lưu dưới dạng `PeriodSummaryRecord` trong `CampaignReportSnapshot.summaryRecord`.
3. **Hiển thị trực quan:** Cung cấp sẵn `imageSourceUrl` (URL/DataURL của ảnh gốc) và `imageFileName` để Khoa có thể hiển thị ảnh chụp gốc cạnh bảng số liệu tổng trên giao diện Dashboard hoặc Báo cáo.

---

## 2. TypeScript Interface (`src/types/campaign.ts`)

```typescript
export interface PeriodSummaryRecord {
  id: string;               // Định danh bản ghi, ví dụ: "summary_1731067200000"
  period_start: string;     // Ngày bắt đầu kỳ (YYYY-MM-DD), ví dụ: "2026-11-01"
  period_end: string;       // Ngày kết thúc kỳ (YYYY-MM-DD), ví dụ: "2026-11-07"
  total_spend: number;      // Tổng chi phí quảng cáo cả kỳ (VNĐ)
  total_reach: number;      // Tổng lượt tiếp cận cả kỳ (Reach)
  total_clicks: number;     // Tổng lượt click cả kỳ
  total_orders: number;     // Tổng số đơn hàng cả kỳ
  is_aggregate_only: true;  // Cờ khẳng định chỉ có số tổng hợp, không có bóc tách theo ngày
  imageSourceUrl?: string;  // Đường dẫn hoặc blob URL của ảnh chụp gốc (để Khoa render ảnh)
  imageFileName?: string;   // Tên file ảnh (để hiển thị tooltip hoặc tiêu đề)
  notes?: string;           // Ghi chú nguồn gốc OCR
}
```

---

## 3. Bộ Số Mẫu Thực Tế (Fixture Sample)

Khoa có thể import hoặc dùng bộ số mẫu JSON này để dựng giao diện:

```json
{
  "id": "summary_1731067200000_sample",
  "period_start": "2026-11-01",
  "period_end": "2026-11-07",
  "total_spend": 3500000,
  "total_reach": 50000,
  "total_clicks": 1500,
  "total_orders": 50,
  "is_aggregate_only": true,
  "imageSourceUrl": "docs/evidence/fixtures/summary-ads.png",
  "imageFileName": "summary-ads.png",
  "notes": "Trích xuất OCR Meta Ads Overview (Độ tin cậy: 91%)"
}
```

### Các chỉ số KPI dẫn xuất tương ứng (Khoa dùng `kpiEngine.ts` để format):
- **CTR Kỳ:** $(1.500 / 50.000) \times 100\% = \mathbf{3.00\%}$
- **CPC Kỳ:** $3.500.000 / 1.500 = \mathbf{2.333\text{ đ}}$
- **CPA Kỳ:** $3.500.000 / 50 = \mathbf{70.000\text{ đ}}$
- **CVR Kỳ:** $(50 / 1.500) \times 100\% = \mathbf{3.33\%}$

---

## 4. Gợi Ý Giao Diện Cho Khoa (UI Recommendations)

1. **Hiển thị Badge Tổng Kỳ:** Khi `snapshot.summaryRecord` tồn tại, hiển thị huy hiệu: `Báo cáo ảnh tổng kỳ (01/11 - 07/11)` trên góc phải header.
2. **Khung Ảnh Đối Chiếu (Side-by-side):** Nếu có `imageSourceUrl`, cho phép người dùng bấm "Xem ảnh gốc đã đối chiếu" dạng modal lightbox hoặc accordion.
3. **Biểu Đồ Xu Hướng:** Do ảnh chỉ có số tổng kỳ, tab "Phân tích biểu đồ xu hướng ngày" nên hiển thị thông báo thân thiện:  
   *"Dữ liệu hiện tại là bản ghi tổng kỳ trích xuất từ ảnh chụp, không có chi tiết từng ngày. Vui lòng nạp bảng theo ngày nếu cần xem biểu đồ đường xu hướng."*
