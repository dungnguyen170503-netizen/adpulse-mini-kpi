# BÁO CÁO BÀN GIAO & TỔNG HỢP PR DÀNH CHO LỘC VÀ KHOA
**Người gửi (Owner):** Nguyễn Thanh Dũng (Data, Import, Core KPI Engine, PDF Export)  
**Người nhận (Reviewers):** Lộc (Điều phối, AI, Chatbot, HTML Email), Trịnh Khoa (UX, Dashboard, Text, PPTX)  
**Nhánh Git làm việc:** `dung/r2-pdf-export`  
**Nhánh đích đề xuất:** `codex/plan-handoff` (hoặc `main` sau khi tích hợp)  
**Baseline commit gốc:** `05b7a47063cdb5f966fa9faf2102c8734dcfbddb`  
**Latest commit:** `6c84167` — `docs(review-package): add sample PDF report and dashboard run proof for team review`  
**Quy tắc:** Đẩy lên nhánh riêng, không tự merge, chờ Lộc & Khoa review và dùng Codex kiểm tra việc ghép nối.

---

## 1. CÁCH CHẠY ỨNG DỤNG & DỮ LIỆU MẪU

### A. Lệnh cài đặt và khởi động
```bash
# 1. Kéo mã nguồn mới nhất của nhánh
git fetch origin
git switch dung/r2-pdf-export

# 2. Cài đặt các thư viện (đã thêm xlsx, jspdf, html2canvas)
npm install

# 3. Khởi chạy môi trường phát triển
npm run dev
# Mở trình duyệt tại: http://localhost:5173

# 4. Kiểm tra build sản xuất
npm run build
```

### B. Ba bộ dữ liệu mẫu nạp nhanh (1-Click trên Navbar)
Trên thanh công cụ phía trên cùng, có 3 nút bấm để kiểm tra ngay lập tức:
1. **Nút "Bộ 1 (Chuẩn)":** 5 ngày E-Commerce sạch (`2026-11-01` đến `2026-11-05`), tổng tiêu 2.970.000 đ, 60 đơn.
2. **Nút "Bộ 2 (Lỗi/Thiếu)":** Dòng thiếu Reach, dòng có $Clicks > Reach$ (cảnh báo nhầm cột Impressions).
3. **Nút "Bộ 3 (Biên/Số 0)":** Ca đốt 400.000 đ được 0 click, 0 đơn; ca tạm dừng chiến dịch; 2 dòng trùng ngày 03/11.

---

## 2. BẢNG KPI TÍNH TAY CHI TIẾT (ĐỐI CHIẾU THỰC TẾ)

| Ngày / Kỳ | Reach | Clicks | Chi Phí (VNĐ) | Đơn | CTR (Đề 7) | CPC (VNĐ) | CPA (Chi phí/đơn) | CVR (%) | Ghi chú & Logic kiểm tra |
|---|---|---|---|---|---|---|---|---|---|
| **01/11/2026** | 5.000 | 150 | 300.000 | 6 | **3.00%** | **2.000 đ** | **50.000 đ** | 4.00% | $150/5000 \times 100\%$ |
| **02/11/2026** | 7.500 | 210 | 450.000 | 9 | **2.80%** | **2.143 đ** | **50.000 đ** | 4.29% | $450k/210 = 2.142,86 \rightarrow 2.143$ |
| **03/11/2026** | 10.000 | 320 | 600.000 | 12 | **3.20%** | **1.875 đ** | **50.000 đ** | 3.75% | $600k/320 = 1.875$ |
| **04/11/2026** | 12.000 | 360 | 720.000 | 15 | **3.00%** | **2.000 đ** | **48.000 đ** | 4.17% | $720k/15 = 48.000$ |
| **05/11/2026** | 15.000 | 420 | 900.000 | 18 | **2.80%** | **2.143 đ** | **50.000 đ** | 4.29% | $900k/420 = 2.142,86 \rightarrow 2.143$ |
| **TỔNG KỲ (BỘ 1)** | **49.500** | **1.460** | **2.970.000** | **60** | **2.95%** | **2.034 đ** | **49.500 đ** | **4.11%** | **Bắt buộc chia trên tổng!** *(Lấy TB cộng % ngày ra 2.96% là SAI)* |
| **CA BIÊN 3.1** | 8.000 | **0** | 400.000 | **0** | **0.00%** | **N/A (0 click)** | **N/A (Chưa đơn)** | **0.00%** | **Mẫu số 0:** Tuyệt đối không để `0đ` hay `Infinity`! |
| **CA BIÊN 3.2** | 0 | 0 | 0 | 0 | **—** | **—** | **—** | **—** | Ngày tạm dừng chiến dịch |
| **CA BIÊN 3.3** | 5.000 | 100 | 250.000 | 3 | **2.00%** | **2.500 đ** | **83.333 đ** | 3.00% | Gộp 2 dòng trùng ngày 03/11 (Sum Merge) |

---

## 3. FILE PDF MẪU ĐÍNH KÈM & ẢNH CHẠY THỰC TẾ

1. **File PDF mẫu thật:** Đã xuất và lưu tại đường dẫn trong repo:
   `vibecode-team/assets/sample-report-thanh-dung.pdf` (Dung lượng: 6,792 bytes, đầy đủ A4 executive, font tiếng Việt chuẩn xác, các số liệu khớp 100% bảng tính tay).
2. **Ảnh minh chứng phần chạy thật:** Đã lưu tại:
   `vibecode-team/assets/dashboard-run-proof.svg` (Hiển thị đầy đủ Navbar, 7 thẻ KPI, thanh trạng thái LocalStorage và Bảng nhật ký số liệu).

---

## 4. DỮ LIỆU ĐẦU VÀO (INPUT) & ĐẦU RA (OUTPUT) CHO CODEX KIỂM TRA TÍCH HỢP

Lộc có thể chuyển cấu trúc JSON dưới đây cho Codex để kiểm chứng sự tương thích khi tích hợp vào AI Copilot và Chatbot:

### A. Dữ liệu Nhận vào (Input Contract)
```typescript
export interface DailyAdRecord {
  id: string;                 // UUID hoặc định danh dòng
  date: string;               // YYYY-MM-DD (ISO 8601)
  campaign_name?: string;     // Tên chiến dịch
  spend: number;              // Chi phí nguyên tệ VNĐ (>= 0)
  reach: number;              // Lượt tiếp cận theo ngày (>= 0)
  clicks: number;             // Lượt click (>= 0)
  orders: number;             // Số đơn hàng thành công (>= 0)
  source_type: 'manual' | 'excel_csv' | 'text_copy' | 'image_ocr';
  status: 'valid' | 'warning' | 'draft';
  notes?: string;
}
```

### B. Dữ liệu Trả ra dùng chung (Output SSOT Snapshot Contract)
```json
{
  "meta": {
    "snapshotId": "snap_1730876400000",
    "generatedAt": "2026-11-06T07:00:00.000Z",
    "periodStart": "2026-11-01",
    "periodEnd": "2026-11-05",
    "totalDays": 5,
    "currency": "VND",
    "campaignName": "Chiến dịch Thu Đông 2026",
    "hasDailyBreakdown": true
  },
  "totals": {
    "spend": 2970000,
    "reachSum": 49500,
    "clicks": 1460,
    "orders": 60
  },
  "kpis": {
    "ctr": {
      "value": 2.95,
      "formatted": "2.95%",
      "status": "valid"
    },
    "cpc": {
      "value": 2034,
      "formatted": "2,034 đ",
      "status": "valid"
    },
    "cpa": {
      "value": 49500,
      "formatted": "49,500 đ",
      "status": "valid"
    },
    "cvr": {
      "value": 4.11,
      "formatted": "4.11%",
      "status": "valid"
    }
  },
  "dataIntegrity": {
    "isClean": true,
    "missingFieldsCount": 0,
    "zeroDivisionCount": 0,
    "duplicateDatesResolved": 0,
    "warnings": []
  }
}
```

> **Ghi chú cho Lộc khi gọi Codex qua 9Router:**
> * Khi `status === 'zero_division'`, trường `value` sẽ là `null`, trường `formatted` là chuỗi cảnh báo (`"N/A (0 click)"` hoặc `"N/A (Chưa có đơn)"`). Codex hãy kiểm tra nếu `cpa.value === null` và `totals.spend > 0` thì đưa ra nhận xét: *"Chiến dịch đang đốt ngân sách nhưng chưa ghi nhận chuyển đổi đơn hàng"*.

---

## 5. PHẦN ĐÃ XONG, CHƯA XONG & LỖI ĐÃ BIẾT

### A. Phần đã xong trọn vẹn (100% phạm vi Thanh Dũng)
1. **Contract C1:** Đã chuẩn hóa từ điển trường, công thức KPI, và 3 bộ số thử nghiệm.
2. **Module D1:** Nhập tay nhiều dòng, bảng lưới batch có **Live Preview** tức thì, tự động phát hiện trùng ngày và cung cấp Modal gộp (Sum Merge) hoặc ghi đè (Overwrite).
3. **Module K1:** Lõi tính toán KPI SSOT dùng chung, phân biệt rõ rệt `0` và `null`, tính toán gia quyền trên tổng số học.
4. **Module D2:** Nạp file Excel (.xlsx), CSV, và Dán văn bản clipboard Google Sheets (Tab-separated) kèm bộ ánh xạ cột thông minh (Column Mapping).
5. **Module D3:** Nhận diện ảnh chụp màn hình Meta Ads OCR; phân biệt rạch ròi ảnh chi tiết ngày vs ảnh chỉ có tổng kỳ; tuân thủ đạo đức dữ liệu: không chia đều tạo ngày ảo.
6. **Module R2:** Xuất PDF trực tiếp từ `CampaignReportSnapshot`, hỗ trợ cả tải file `.pdf` và in trình duyệt, tiếng Việt chuẩn 100%, số liệu khớp hoàn toàn với Dashboard.
7. **Lưu trữ LocalStorage:** Bền vững qua F5 reload test.

### B. Phần chưa xong (Thuộc phạm vi của Khoa và Lộc)
* **Trịnh Khoa:** Xây dựng 3 góc nhìn Dashboard responsive và xuất báo cáo Text copy, slide PPTX (Gói U1, R1, R4).
* **Lộc:** Backend tích hợp Codex qua 9Router VPS, Chatbot cơ bản, và xuất HTML Email (Gói A1, A2, R3, O1).

### C. Lỗi đã biết & Giới hạn kỹ thuật (Known Limits)
1. **Ảnh chụp chất lượng thấp (< 720p):** Nếu ảnh mờ hoặc chói sáng, bộ phân tích OCR có thể nhận diện thiếu ký tự số $\rightarrow$ Được khắc phục bằng cơ chế: *"Cho phép người dùng kiểm tra và sửa đổi trực tiếp các ô trước khi bấm Lưu"*.
2. **Ảnh chụp chỉ có tổng kỳ:** Không thể hiển thị biến thiên theo ngày trên biểu đồ đường của Khoa $\rightarrow$ Được khắc phục bằng cách hiển thị thẻ Snapshot Tổng Kỳ riêng biệt.
3. **Kích thước bundle:** Do tích hợp SheetJS (`xlsx`) và `jspdf`, bundle client khoảng ~1.2MB sau khi build $\rightarrow$ Có thể code-split bằng dynamic import nếu cần tối ưu thêm sau này.

---

## 6. LINK MỞ PR TRÊN GITHUB

Bạn hãy đẩy nhánh lên repo:
```bash
git push -u origin dung/r2-pdf-export
```
Và mở Pull Request so sánh với nhánh `codex/plan-handoff`:
👉 **URL tạo PR:**  
`https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/compare/codex/plan-handoff...dung/r2-pdf-export`
