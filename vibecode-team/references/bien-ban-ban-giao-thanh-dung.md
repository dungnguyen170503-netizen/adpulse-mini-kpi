# BIÊN BẢN BÀN GIAO KỸ THUẬT & NGHIỆM THU TÍCH HỢP TOÀN DIỆN
### Dự án: AdPulse Mini KPI Dashboard • Đề 7, Bảng B (Vibe Coding Hackathon 06–09/11/2026)

* **Thời gian lập:** 20:15 - Chủ Nhật, ngày 08/11/2026  
* **Người bàn giao:** **Nguyễn Thanh Dũng** (Lead Kiến Trúc Dữ Liệu & Web Solutions — 15 năm kinh nghiệm)  
* **Người tiếp nhận:**  
  * **Trịnh Khoa** (UX / Dashboard Lead — phụ trách Dashboard 3 góc nhìn, Biểu đồ ngày, Báo cáo Text & PPTX)  
  * **Ngô Tài Lộc** (Integration & AI Lead — phụ trách Máy chủ AI Gemini, Chatbot, Báo cáo HTML, CI/CD E2E)  
* **Kho lưu trữ:** `https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi`  
* **Liên kết Pull Request:**  
  * **PR #4 (Mới nhất):** [https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/pull/4](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/pull/4) (`codex/dung-data-ocr-fix` $\rightarrow$ `codex/loc-ai-integration`)  
  * **PR #2 (Nền tảng):** [https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/pull/2](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/pull/2) (`dung/r2-pdf-export` $\rightarrow$ `codex/plan-handoff`)

---

## 1. TỔNG QUAN HẠNG MỤC BÀN GIAO CỦA THANH DŨNG

Tôi xác nhận đã hoàn thành 100% toàn bộ phạm vi công việc được nhóm phân công và các yêu cầu bổ sung của đợt hoàn thiện cuối cùng:

| STT | Phân hệ / Mô-đun | Trạng thái | Tệp mã nguồn cốt lõi | Mô tả bàn giao |
|:---:|---|:---:|---|---|
| **1** | **Khế ước & Số học C1** | Hoàn tất | `vibecode-team/references/c1-data-kpi-contract.md` | Định nghĩa từ điển dữ liệu, công thức CTR/CPC/CPA/CVR, 3 bộ số thử tính tay |
| **2** | **Lõi tính KPI SSOT (K1)** | Hoàn tất | `src/utils/kpiEngine.ts` | Single Source of Truth, chuẩn hóa chia 0 ra `—` và `zero_division`, xử lý `missing_data` |
| **3** | **Nhập tay & LocalStorage (D1)** | Hoàn tất | `src/components/MultiRowEntryModal.tsx`<br>`src/utils/storage.ts` | Nhập nhiều dòng có live KPI, lưu LocalStorage, xử lý trùng lặp ngày tường minh |
| **4** | **Nhập File Excel/CSV/Text (D2)** | Hoàn tất | `src/utils/fileParser.ts`<br>`src/components/FileImportModal.tsx` | Nhận diện phân cách `, ; \t`, chuẩn hóa tiền tệ/ngày tháng, quy trình 3 bước (Upload $\rightarrow$ Map $\rightarrow$ Preview) |
| **5** | **OCR Pixel Thật Meta Ads (D3)** | Hoàn tất | `src/utils/imageParser.ts`<br>`src/components/ImageImportModal.tsx` | Trích xuất pixel thật bằng Tesseract.js; xem trước đối chiếu ảnh gốc; sửa ô mờ trước khi lưu |
| **6** | **Xuất PDF Điều Hành (R2)** | Hoàn tất | `src/utils/pdfGenerator.ts`<br>`src/components/PdfExportModal.tsx` | Render Retina 2x sắc nét tiếng Việt, A4 quốc tế, tích hợp in nhận xét và 3 gợi ý AI |
| **7** | **Bản vá 2 lỗi dữ liệu** | Hoàn tất | `src/App.tsx`<br>`src/utils/storage.ts`<br>`src/components/DataTable.tsx` | Fix triệt để lỗi bấm Hủy khi trùng ngày và lỗi reload phục hồi dữ liệu mẫu |
| **8** | **Khế ước Tổng Kỳ cho Khoa** | Hoàn tất | `vibecode-team/references/period-summary-spec-for-khoa.md` | Interface `PeriodSummaryRecord` kèm bộ số mẫu và `imageSourceUrl` để Khoa dựng UI song song |

---

## 2. CHI TIẾT 2 BẢN VÁ DỮ LIỆU TRỌNG YẾU (DÀNH CHO LỘC & KHOA REVIEW)

### 2.1. Bản vá Lỗi 1: Bấm "Hủy" khi trùng ngày vẫn bị thêm dòng
* **Hiện tượng cũ:** Khi nhập một dòng ngày đã có trong bảng, hộp thoại xác nhận hỏi có cộng dồn không. Nếu người dùng bấm `Hủy` (Cancel), mã nguồn vẫn rơi xuống hàm thêm dòng, làm phát sinh dòng trùng lặp và làm sai lệch tổng số.
* **Mã nguồn đã khắc phục:**
  * Tại `src/App.tsx` (hàm `handleAddSingle`), thêm `return` dứt khoát khi người dùng không xác nhận gộp, phát thông báo: *"Đã hủy thêm ngày. Số dòng và số tổng được giữ nguyên."*
  * Tại `src/components/DataTable.tsx` (hàm `saveEdit`), bổ sung kiểm tra trùng ngày khi sửa inline: chặn không cho đổi ngày sang ngày đã có sẵn trong danh sách.
  * Tại `DuplicateResolutionModal.tsx`, sự kiện `onCancel` đóng modal và giữ nguyên toàn vẹn dữ liệu cũ.

### 2.2. Bản vá Lỗi 2: Xóa hết rồi tải lại (Reload) thì dữ liệu mẫu xuất hiện lại
* **Hiện tượng cũ:** Khi người dùng bấm "Xóa hết dữ liệu", mảng dữ liệu về `[]`. Nhưng khi F5 tải lại trang, do kiểm tra `if (saved && saved.length > 0)` trả về false, hệ thống tự động gán lại `DEFAULT_CAMPAIGN_DATA`.
* **Mã nguồn đã khắc phục:**
  * Bổ sung cờ `adpulse_app_initialized_v1` trong `src/utils/storage.ts`.
  * **Lần đầu mở ứng dụng:** Cờ chưa có và storage là `null` $\rightarrow$ `loadCampaignData()` trả về `null` $\rightarrow$ App nạp dữ liệu mẫu ban đầu và bật cờ `true`.
  * **Người dùng đã xóa hết dữ liệu:** Lưu `[]` và giữ cờ `true` $\rightarrow$ Tải lại trang nhận diện được `[]`, giữ nguyên trạng thái trống sạch 100%, không hồi sinh dữ liệu mẫu.

---

## 3. BÀN GIAO MODULE OCR PIXEL ẢNH THẬT & NGUYÊN TẮC ĐẠO ĐỨC DỮ LIỆU

1. **Thay thế OCR mô phỏng:** Đã loại bỏ hoàn toàn việc gán số mẫu theo tên file. Thư viện `tesseract.js` đọc trực tiếp ma trận điểm ảnh từ `File`, `Blob` hoặc `Buffer`.
2. **Giao diện đối chiếu Side-by-side:** Ảnh chụp gốc được đặt bên trái, bảng nháp cho phép chỉnh sửa từng ô đặt bên phải.
3. **Phân biệt 2 chế độ nhận diện:**
   * **Bảng chi tiết theo ngày (`daily_rows`):** Nhận diện ngày `YYYY-MM-DD` và 4 chỉ số (Spend, Reach, Clicks, Orders). Các ô mờ/thiếu được tô viền vàng và xếp vào `uncertainFields` để người dùng điền bổ sung trước khi lưu.
   * **Ảnh báo cáo tổng kỳ (`period_summary`):** Bóc tách khoảng ngày `period_start` đến `period_end` và 4 số tổng cả kỳ.
4. **Nguyên tắc đạo đức dữ liệu (C1 Contract):**
   * Tuyệt đối **không chia đều số tổng cho $N$ ngày** để sinh dòng dữ liệu ảo.
   * Dữ liệu tổng kỳ được lưu độc lập vào `PeriodSummaryRecord`.

---

## 4. KHẾ ƯỚC DỮ LIỆU BÀN GIAO CHO KHOA & LỘC

### 4.1. Khế ước Bản Ghi Tổng Kỳ cho Trịnh Khoa (`PeriodSummaryRecord`)
Được định nghĩa tại `src/types/campaign.ts`:
```typescript
export interface PeriodSummaryRecord {
  id: string;               // Định danh bản ghi (ví dụ: "summary_1731067200000")
  period_start: string;     // Ngày bắt đầu kỳ (YYYY-MM-DD, ví dụ: "2026-11-01")
  period_end: string;       // Ngày kết thúc kỳ (YYYY-MM-DD, ví dụ: "2026-11-07")
  total_spend: number;      // Tổng chi phí quảng cáo cả kỳ (VNĐ)
  total_reach: number;      // Tổng lượt tiếp cận cả kỳ (Reach)
  total_clicks: number;     // Tổng lượt click cả kỳ
  total_orders: number;     // Tổng số đơn hàng cả kỳ
  is_aggregate_only: true;  // Cờ khẳng định chỉ có số tổng hợp
  imageSourceUrl?: string;  // Data URL hoặc đường dẫn ảnh chụp gốc (để Khoa render ảnh)
  imageFileName?: string;   // Tên file ảnh gốc
  notes?: string;           // Ghi chú nguồn gốc OCR
}
```

**Bộ dữ liệu mẫu thực tế cho Khoa test giao diện:**
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
*Chỉ số KPI dẫn xuất:* CTR = **3.00%**, CPC = **2.333 đ**, CPA = **70.000 đ**, CVR = **3.33%**.

### 4.2. Khế ước Tích Hợp với Ngô Tài Lộc (`CampaignReportSnapshot`)
* Máy chủ AI của Lộc (`server/ai.ts`) tiêu thụ trực tiếp `snapshot` từ `kpiEngine.ts`.
* Khối `snapshot.ai` được truyền liền mạch vào `PdfExportModal.tsx`, tự động in báo cáo AI và 3 khuyến nghị hành động vào bản PDF xuất ra.

---

## 5. KẾT QUẢ KIỂM CHỨNG & BẰNG CHỨNG KỸ THUẬT

### 5.1. Kết quả chạy bộ Test tự động (`npm test`)
Toàn bộ **14/14 tests tự động PASS 100%**:
1. `Ca 1: Bấm Hủy khi trùng ngày -> Giữ nguyên số dòng và số tổng` (PASS)
2. `Ca 2: Phân biệt lần đầu mở app vs Đã xóa hết dữ liệu rồi tải lại trang` (PASS)
3. `Ca 3: Hai ảnh có số khác nhau -> OCR trích xuất ra các con số khác nhau từ pixel` (PASS)
4. `Ca 4: Đổi tên ảnh nhưng giữ nguyên nội dung -> OCR vẫn đọc đúng số` (PASS)
5. `Ca 5: Ảnh mờ / nhiễu -> Đánh dấu độ tin cậy thấp và ghi chú thiếu dữ liệu` (PASS)
6. `Ca 6: Ảnh chỉ có tổng kỳ -> Lưu period_summary, KHÔNG tạo bản ghi giả theo ngày` (PASS)
7. `Ô trống giữ ở bản nháp, không tự chuyển thành 0 hay ngày hôm nay` (PASS)
8. `Bộ 1: snapshot, server và báo cáo cùng KPI` (PASS)
9. `Bộ 2: snapshot, server và báo cáo cùng KPI` (PASS)
10. `Bộ 3: snapshot, server và báo cáo cùng KPI` (PASS)
11. `Chia 0 khác 0%; ngày trùng không tăng totalDays` (PASS)
12. `Ngày thiếu ở biên kỳ vẫn để trống` (PASS)
13. `Server bỏ qua KPI giả và không nhận số null/âm` (PASS)
14. `Đúng 3 gợi ý; HTML escape nội dung AI và Text cùng snapshot` (PASS)

### 5.2. Kiểm tra số học lõi thật
* Chạy `npx tsx scripts/verify-c1-engine.ts`: Khớp 100% bảng tính tay của cả 3 bộ dữ liệu C1.
* Chạy `npm run typecheck`: **0 lỗi** TypeScript.
* Chạy `npm run build`: Đóng gói production Vite thành công (`dist/index.html`).

---

## 6. HƯỚNG DẪN ĐỒNG ĐỘI CHẠY KIỂM CHỨNG TRÊN MÁY

```bash
# 1. Chuyển sang nhánh mới nhất của Dũng
git fetch origin codex/dung-data-ocr-fix
git checkout codex/dung-data-ocr-fix

# 2. Cài đặt các gói phụ thuộc (đã có tesseract.js)
npm install

# 3. Chạy toàn bộ 14 bài kiểm thử tự động
npm test

# 4. Kiểm tra TypeScript và Build
npm run typecheck
npm run build

# 5. Khởi động ứng dụng để trải nghiệm giao diện
npm run dev
# Mở trình duyệt tại: http://127.0.0.1:5173
```

---

## 7. GIỚI HẠN KỸ THUẬT & KHUYẾN NGHỊ BƯỚC TIẾP THEO

### 7.1. Giới hạn kỹ thuật minh bạch
* OCR hỗ trợ tối ưu ảnh thẳng góc, độ phân giải $\ge$ 720p. Chưa hỗ trợ ảnh nghiêng quá 30 độ, chữ viết tay, hoặc bảng có nhiều loại tiền tệ hỗn hợp (USD lẫn VNĐ).
* Nếu gặp ảnh mờ, giao diện sẽ đánh dấu ô mờ màu vàng để người dùng chủ động kiểm tra và nhập tay trước khi lưu.

### 7.2. Khuyến nghị cho Trịnh Khoa & Ngô Tài Lộc
1. **Khoa:** Sử dụng khế ước `PeriodSummaryRecord` tại `vibecode-team/references/period-summary-spec-for-khoa.md` để hoàn thiện phần hiển thị badge và xem ảnh gốc trên Dashboard.
2. **Lộc:** Tiến hành review và hợp nhất [Pull Request #4](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi/pull/4) vào nhánh `codex/loc-ai-integration`.
3. **Chốt bài nộp:** Sau khi tích hợp nhánh của Dũng, Lộc tạo Pull Request tổng hợp nhất từ `codex/loc-ai-integration` vào `codex/plan-handoff` (hoặc `main`) để nhóm sẵn sàng nghiệm thu và nộp bài thi Hackathon Đề 7, Bảng B.

---

**Đại diện bên bàn giao (Data / KPI / PDF Lead)**  
*(Đã ký điện tử)*  
**Nguyễn Thanh Dũng**
