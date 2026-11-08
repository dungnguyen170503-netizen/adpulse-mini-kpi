# Phản Hồi Kiến Trúc & Thống Nhất Tích Hợp (Dũng $\leftrightarrow$ Khoa $\leftrightarrow$ Lộc)

**Người phản hồi:** Nguyễn Thanh Dũng (Chuyên gia kiến trúc hệ thống dữ liệu, Web Lead 15 năm kinh nghiệm)  
**Tài liệu đối chiếu:** `docs/khoa/c1-crosscheck.md` (Khoa), `docs/loc/README.md` (Lộc), `tests/integration.test.ts`  
**Ngày lập:** 08/11/2026 • Đề 7, Bảng B (Vibe Coding Hackathon 06–09/11)  
**Trạng thái:** **ĐỒNG THUẬN KỸ THUẬT TOÀN DIỆN (100% Consensus)**

---

## 1. Đánh Giá Chung

Tôi hoan nghênh và đánh giá rất cao bản đối chiếu phản biện cực kỳ sắc sảo, cẩn trọng của Trịnh Khoa (`docs/khoa/c1-crosscheck.md`) cũng như năng lực tích hợp, kiểm thử và thiết kế máy chủ AI bài bản của Ngô Tài Lộc (`codex/loc-ai-integration`).

Với tư cách là người phụ trách tầng Dữ liệu, Lõi KPI Chung (SSOT) và Xuất PDF, tôi xác nhận: **Hệ thống AdPulse Mini KPI hiện đã đạt độ trưởng thành kiến trúc cao nhất**, toàn bộ 3 phân hệ (Dũng: Data/SSOT/PDF, Khoa: Dashboard 3-tab/Text/PPTX, Lộc: Gemini AI/Chat/HTML/E2E) đã khớp contract 100%.

Dưới đây là văn bản phản hồi chính thức từ tôi cho từng nội dung cần chốt.

---

## 2. Thống Nhất 7 Điểm Khác Biệt Giữa C1 (Dũng) và C2 (Khoa)

| # | Hạng mục | Quyết định kỹ thuật | Lý do & Giải pháp kiến trúc |
|---|---|---|---|
| **1** | **Hình dạng Snapshot** | **Sử dụng cấu trúc SSOT của Dũng** | Cấu trúc `CampaignReportSnapshot` (`meta`, `totals`, `kpis`, `dailyRecords`, `dataIntegrity`, `summaryRecord`) đã bao phủ toàn vẹn mọi khía cạnh số học và ngữ nghĩa. Khoa và Lộc tiêu thụ trực tiếp snapshot này. |
| **2** | **Tên chỉ số `cpa` vs `costPerOrder`** | **Giữ `cpa` trong schema, nhãn UI là "Chi phí mỗi đơn"** | `cpa` là chuẩn quốc tế trong Digital Marketing (Cost Per Acquisition / Cost Per Action). UI và Báo cáo ghi chú rõ ràng nhãn tiếng Việt để người dùng nghiệp vụ dễ hiểu. |
| **3** | **Định dạng CTR** | **Giữ số phần trăm thực tế (`2.95`)** | Tránh sai số dấu phẩy động JavaScript khi nhân chia nhiều lần; khớp chuẩn đề bài Đề 7 và hiển thị trực quan `2.95%`. |
| **4** | **Trạng thái KPI** | **Thống nhất bộ 4 trạng thái của Dũng** | Bộ trạng thái: `valid` (hợp lệ), `zero_division` (chia cho 0), `missing_data` (thiếu dữ liệu), `out_of_bounds` (vượt ngưỡng bất thường như Clicks > Reach). Đủ thông tin cho cả Dashboard, AI và cảnh báo rủi ro. |
| **5** | **Khối AI trong Snapshot** | **Bổ sung `ai?: AiAnalysis` theo C3 của Lộc** | Khi người dùng bấm tạo nhận xét AI, kết quả được gắn trực tiếp vào snapshot (`snapshot.ai`). Cả 4 định dạng xuất (PDF, Text, HTML, PPTX) đều đọc chung khối này. |
| **6** | **Phiên bản dữ liệu (`dataVersion`)** | **Bổ sung hàm băm `dataVersionOf(snapshot)`** | Tuyệt đối cần thiết. Giúp phát hiện ngay khi dữ liệu gốc bị sửa đổi nhưng báo cáo chưa được làm mới (tránh tình trạng số liệu báo cáo bị cũ / stale). |
| **7** | **Đơn vị mỗi KPI** | **Giữ chuỗi chuẩn hóa `formatted`** | Đã định dạng chuẩn theo định dạng tiền tệ và phần trăm Việt Nam (`vi-VN`: dấu chấm hàng nghìn `2.034 đ`, dấu phẩy thập phân `2,95%`). |

---

## 3. Giải Trình & Chuẩn Hóa 6 Điểm Số Liệu Khoa Nêu

### 3.1. Ô trống khác số 0 (Missing Data $\ne$ Zero)
* **Khoa nêu:** `DailyAdRecord` dùng kiểu `number`, hàm đổi `Number(x) || 0` làm mất phân biệt giữa "chưa nhập" và "nhập số 0 thật".
* **Giải pháp đã thống nhất & hoàn thiện:**
  1. Ở tầng Nhập liệu / Bản nháp (Draft): Ô trống giữ nguyên `NaN`/rỗng, chặn không cho lưu cho tới khi người dùng nhập số hợp lệ hoặc sửa lỗi.
  2. Ở tầng `kpiEngine.ts`: Bổ sung kiểm tra tường minh `missing(...)`. Nếu trường dữ liệu bị `undefined`, `null` hoặc không hữu hạn, KPI lập tức trả về `status: 'missing_data'` và `formatted: '—'`, kèm cảnh báo `warningMessage: 'Thiếu hoặc sai số liệu; cần sửa trước khi lưu'`.

### 3.2. CTR khi Reach = 0
* **Khoa nêu:** Giá trị `null` nhưng chuỗi in ra là `0.00%`, gây hiểu lầm là có hiển thị nhưng không ai click.
* **Giải pháp đã thực hiện:**
  Đã sửa triệt để hàm `formatPercent` và các nhánh chia 0 trong `kpiEngine.ts`. Khi `reach <= 0` hoặc `clicks <= 0`, `formatted` trả về `'—'` (gạch ngang), `status: 'zero_division'`. Hoàn toàn loại bỏ chuỗi `0.00%` giả mạo.

### 3.3. Phân biệt Ngày Tạm Dừng (Số 0) vs Ngày Không Có Dữ Liệu (Khoảng trống)
* **Khoa nêu:** Ngày tạm dừng chiến dịch (toàn bộ 0) vẽ thế nào so với ngày thiếu bản ghi.
* **Giải pháp kiến trúc:**
  - **Ngày tạm dừng có bản ghi:** Nhập tường minh `{ reach: 0, spend: 0, clicks: 0, orders: 0 }` $\rightarrow$ Biểu đồ vẽ điểm giá trị = 0, thể hiện chiến dịch dừng chạy.
  - **Ngày thiếu không có dòng:** Biểu đồ vẽ điểm `null` (khoảng đứt gãy), bảng phân tích ghi chú: *"Thiếu dữ liệu ngày YYYY-MM-DD"*. Không tự động điền 0 vào ngày khuyết.

### 3.4. Cơ chế Gộp Trùng Ngày (Sum Merge)
* **Khoa nêu:** Cần xác nhận việc gộp luôn qua xác nhận của người dùng và không cộng lặp khi 2 bản ghi giống hệt.
* **Giải pháp kiến trúc:**
  Đã xây dựng component chuyên biệt `DuplicateResolutionModal.tsx`:
  - Khi phát hiện trùng ngày, modal hiển thị trực quan cho người dùng chọn:
    1. **Cộng dồn (Sum Merge):** Phù hợp khi người dùng chạy nhiều ad set / chiến dịch con trong cùng ngày.
    2. **Ghi đè (Overwrite / Keep Latest):** Phù hợp khi bản ghi sau là bản sửa đổi cập nhật cho bản ghi trước.
  - Tuyệt đối không tự ý cộng ngầm trong nền.

### 3.5. Kiểm chứng lõi thật bằng script
* **Khoa nêu:** `scripts/verify-c1-math.js` tự viết lại công thức, chưa chứng minh được hàm `kpiEngine.ts` thật.
* **Giải pháp:**
  Đã viết mới script `scripts/verify-c1-engine.ts` import trực tiếp `calculatePeriodAggregates` và `calculateDailyMetrics` từ `src/utils/kpiEngine.ts`.
  Kết quả chạy thật qua Node.js v22:
  ```
  => BỘ 1: KHỚP 100% VỚI BẢNG TÍNH TAY C1!
  => BỘ 2: KHỚP 100% VỚI BẢNG TÍNH TAY C1!
  => BỘ 3: TOÀN BỘ LOGIC BIÊN ĐÃ KHỚP CHÍNH XÁC VỚI SỰ ĐỒNG THUẬN KHOA - LỘC - DŨNG!
  ```

### 3.6. Nhãn Reach trên Giao Diện và Báo Cáo
* Thống nhất đặt tên hiển thị: **"Tổng Lượt Tiếp Cận (cộng dồn ngày)*"** (`reachSum`).
* Chú thích chân trang bắt buộc: *\*Tổng lượt tiếp cận được cộng dồn theo ngày. Do không có định danh người dùng ẩn danh (User ID) để khử trùng lặp, chỉ số này phản ánh tổng tiếp cận ngày chứ không đại diện cho người duy nhất trong toàn kỳ.*

---

## 4. Giải Trình Về Module Nhận Diện Ảnh (OCR) & Giới Hạn Nghiệp Vụ

Lộc nhận xét trong `docs/loc/README.md`: OCR hiện tại phân tích theo mẫu nhận diện Meta Ads, chưa đọc pixel ảnh thực tế.
Tôi giải trình và làm rõ giới hạn này:
1. **Tính trung thực kỹ thuật:** Trong phạm vi cuộc thi Hackathon 4 giờ/ngày, tích hợp mô hình thị giác máy tính cục bộ nặng (như Tesseract đầy đủ có từ điển tiếng Việt) vào trình duyệt sẽ làm phình bundle lên hơn 15MB và gây nghẽn hiệu năng trên máy yếu.
2. **Quy trình an toàn cho người dùng:** Module ảnh được thiết kế theo luồng **Draft-First (Xem trước & Sửa)**:
   - Ảnh chụp được hiển thị cạnh bên (Side-by-side) với bảng số liệu trích xuất.
   - Người dùng bắt buộc phải đối chiếu bằng mắt và sửa các ô sai lệch trước khi bấm "Lưu".
   - Đã thêm cảnh báo nổi bật màu hổ phách: *"OCR hiện là bản demo hỗ trợ nhận diện mẫu. Vui lòng đối chiếu với ảnh gốc trước khi lưu."*
3. **Đạo đức dữ liệu:** Khi ảnh chỉ chứa số tổng kỳ (`period_summary`), hệ thống kiên quyết **không sinh dữ liệu ngày giả** bằng cách chia đều. Dữ liệu này được lưu riêng vào `PeriodSummaryRecord`.

---

## 5. Tích Hợp PDF Export Với Báo Cáo AI & Biểu Đồ

1. **Khối AI trong PDF:** Tự động in đầy đủ nội dung Nhận xét xu hướng và 3 Khuyến nghị hành động (kèm Căn cứ, Giới hạn, Hành động và Cách đo lường) từ `snapshot.ai`.
2. **Đồng bộ phiên bản:** Chỉ xuất PDF khi dữ liệu hợp lệ và phiên bản snapshot đang hiển thị khớp với báo cáo đóng băng (`frozenSnapshot`).
3. **Chất lượng in ấn:** Sử dụng cơ chế Render Canvas Retina 2x kết hợp jsPDF A4 chuẩn quốc tế, đảm bảo phông chữ tiếng Việt có dấu sắc nét 100%, không bị vỡ hạt hay lỗi mã hóa UTF-8.

---

## 6. Kết Luận & Đề Xuất Bước Kế Tiếp

- **Về mã nguồn:** Bộ code trên `codex/loc-ai-integration` đã hoàn thiện và bao hàm đầy đủ toàn bộ thành quả của cả Dũng (PR #2), Khoa (PR #3) và Lộc.
- **Về kiểm thử:** 8 bài test tự động (`npm test`), kiểm tra TypeScript (`npm run typecheck`), và quy trình build (`npm run build`) đều thành công 100% với 0 lỗi.
- **Hành động khuyến nghị:**
  Nhóm có thể tiến hành phê duyệt PR #2 và PR #3, hoặc hợp nhất nhánh `codex/loc-ai-integration` vào nhánh handoff chung `codex/plan-handoff` để chuẩn bị sản phẩm hoàn chỉnh nhất sẵn sàng cho bài thi Vibe Coding Đề 7, Bảng B.
