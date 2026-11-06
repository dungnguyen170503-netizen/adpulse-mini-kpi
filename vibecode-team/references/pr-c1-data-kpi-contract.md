# PULL REQUEST: [C1] Contract Dữ Liệu, Công Thức KPI & 3 Bộ Số Tham Chiếu
**Nhánh nguồn:** `dung/c1-data-kpi-contract`  
**Nhánh đích:** `codex/plan-handoff`  
**Người tạo (Owner):** Nguyễn Thanh Dũng (Data, Import, Core KPI Engine, PDF Export)  
**Người đánh giá (Reviewers):** Trịnh Khoa, Lộc  
**Tài liệu kèm theo:** `vibecode-team/references/c1-data-kpi-contract.md`

---

## PHẦN OWNER ĐIỀN (Thanh Dũng)

### 1. Module/phiếu việc và baseline/contract đang dùng
- **Mã gói việc:** Gói `C1 · Dữ liệu/KPI` theo `execution-plan.md` và `dung-khoa-start-guide.md`.
- **Baseline Git:** Branch `codex/plan-handoff` tại commit `05b7a47063cdb5f966fa9faf2102c8734dcfbddb`.

### 2. Vấn đề người dùng được giải quyết; phạm vi đã làm và phần chưa làm
- **Vấn đề giải quyết:** Marketer chạy Facebook Ads cần một hệ thống đo lường chính xác, không bị sai lệch số liệu khi tổng hợp ngày, không bị lỗi chia cho 0 khi chưa có click/đơn, và có sự thống nhất 100% giữa Dashboard, AI, và PDF.
- **Phạm vi đã làm:**
  - Hoàn thiện Từ điển trường dữ liệu (`DailyAdRecord`, `PeriodSummaryRecord`).
  - Định nghĩa tường minh công thức CTR, CPC, CPA (chi phí/đơn), CVR và quy tắc tính tổng kỳ (Weighted Sum).
  - Soạn thảo và tính tay chi tiết 3 bộ dữ liệu thử nghiệm: (1) Chuẩn e-commerce 5 ngày; (2) Dữ liệu bẩn/thiếu/bất thường; (3) Trường hợp biên: 0 click, 0 đơn, ngày trùng lặp, ảnh chụp chỉ có số tổng kỳ.
  - Thiết lập Snapshot Interface dùng chung (`CampaignReportSnapshot`) để Khoa (Dashboard) và Lộc (AI) tích hợp không gây xung đột.
  - Xác định 6 quyết định kỹ thuật/nghiệp vụ cần Khoa và Lộc chốt duyệt.
- **Phần chưa làm (Tuân thủ Workflow):**
  - Chưa code các module phụ thuộc (`D1` Nhập tay/localStorage, `D2` File/Text, `D3` OCR Ảnh, `K1` Core Engine, `R2` PDF) trước khi Khoa và Lộc duyệt contract này và thiết kế giao diện được thông qua.

### 3. Hai quyết định chính do tôi chọn, lý do và đánh đổi
1. **Quyết định 1 — Xử lý mẫu số bằng 0 (CPC khi Click = 0, CPA khi Order = 0):**
   - *Lựa chọn:* Trả về `null` trong JSON và hiển thị badge `N/A` (kèm tooltip giải thích lý do) trên UI và PDF. Tuyệt đối không để `0đ` hoặc để chương trình sinh ra `Infinity` / `NaN`.
   - *Lý do:* Một chiến dịch tiêu 500,000đ mà được 0 click thì chi phí mỗi click không thể bằng 0đ (0đ nghĩa là click miễn phí, hoàn toàn sai lệch thực tế tài chính).
   - *Đánh đổi:* Phải xây dựng helper format kiểu dữ liệu linh hoạt, xử lý cả số và chuỗi cảnh báo.
2. **Quyết định 2 — Không suy diễn dữ liệu ngày từ ảnh chỉ có tổng kỳ:**
   - *Lựa chọn:* Khi ảnh chụp OCR chỉ có số tổng cả kỳ (ví dụ: 7 ngày tiêu 3.5tr, 50 đơn), hệ thống lưu dưới dạng `PeriodSummaryRecord`, tính KPI tổng kỳ chuẩn xác nhưng tắt biểu đồ đường xu hướng ngày và hiển thị ghi chú minh bạch.
   - *Lý do:* Giữ tính trung thực của dữ liệu (Data Integrity). Chia đều cho 7 ngày là bịa đặt dữ liệu (hallucinated data), dẫn tới AI nhận xét sai xu hướng đỉnh/đáy.
   - *Đánh đổi:* Người dùng chỉ nạp ảnh tổng sẽ không xem được biểu đồ biến thiên theo ngày.

### 4. AI đã hỗ trợ việc gì; tôi đã sửa hoặc kiểm chứng đầu ra AI ra sao
- **AI đã hỗ trợ:** Đề xuất khung sườn bảng từ điển dữ liệu, gợi ý cấu trúc TypeScript interface cho Snapshot.
- **Tôi đã sửa & kiểm chứng:**
  - Tự tay tính toán lại toàn bộ 3 bộ số thử nghiệm bằng giấy bút và máy tính bỏ túi, đối chiếu từng phép tính (đặc biệt là so sánh sự sai lệch giữa việc lấy trung bình cộng CTR ngày vs lấy tổng Clicks chia tổng Reach: 2.96% vs 2.95%).
  - Bác bỏ đề xuất ban đầu của AI về việc tự động chia đều ngân sách cho các ngày khi đọc ảnh tổng kỳ.
  - Siết chặt quy tắc phân biệt giữa `null` (không có dữ liệu) và `0` (số đo bằng không).

### 5. Dữ liệu thử, kết quả kỳ vọng và kết quả thực tế (gồm ít nhất một ca lỗi/biên)
- **Ca 1 (Chuẩn):** 5 ngày đạt 1,460 clicks / 49,500 reach / 2,970,000 đ / 60 đơn.
  - Kỳ vọng & Thực tế tính tay: $CTR = 2.95\%$, $CPC = 2,034\text{ đ}$, $CPA = 49,500\text{ đ}$, $CVR = 4.11\%$. Khớp tuyệt đối.
- **Ca 2 (Lỗi thiếu/sai):** Dòng thiếu Reach, dòng chữ trong ô tiền, chi phí âm, $Clicks > Reach$.
  - Kỳ vọng: Validation chặn lưu dòng lỗi định dạng, cho phép tính các metric độc lập còn lại (ví dụ thiếu Reach thì không tính được CTR nhưng vẫn tính được CPC/CPA).
- **Ca 3 (Biên - Mẫu số 0 & Ngày trùng):** Ngày tiêu 400,000đ được 0 click, 0 đơn; Ngày 03/11 bị trùng 2 dòng.
  - Kỳ vọng: $CPC = null$, $CPA = null$, hiển thị "N/A (0 click)". Ngày trùng hiển thị cảnh báo và cung cấp modal Gộp chỉ số.

### 6. Cách reviewer chạy lại hoặc link preview/ảnh minh chứng
- Đọc tài liệu chi tiết tại: `vibecode-team/references/c1-data-kpi-contract.md`.
- Kiểm tra bảng tính tay và tính hợp lý của 6 câu hỏi cần duyệt tại Mục 6 của tài liệu.

### 7. KPI/tiêu chí nghiệm thu nào đã đạt; mục nào chưa đạt và vì sao
- **Đã đạt:** Hoàn thành trọn vẹn đặc tả C1, từ điển trường, công thức KPI chuẩn, 3 bộ số kiểm thử có kết quả tính tay, snapshot interface.
- **Chưa đạt:** Chưa có code thực tế (vì theo quy trình workflow của nhóm, cần Khoa và Lộc chốt duyệt contract trước khi bắt đầu code các phần phụ thuộc).

### 8. Tác động đến dữ liệu, KPI, bộ lọc, snapshot, API/contract, cấu hình hoặc định dạng báo cáo
- Tạo ra hợp đồng dữ liệu chuẩn `CampaignReportSnapshot` làm mốc tham chiếu duy nhất cho:
  - Trịnh Khoa: Xây dựng bộ lọc, vẽ biểu đồ, xuất báo cáo Text và slide PPTX.
  - Lộc: Tiếp nhận dữ liệu đầu vào cho AI Copilot và xuất HTML Email.
  - Thanh Dũng: Xây dựng tầng nhập liệu, lưu localStorage và xuất PDF.

### 9. Rủi ro hoặc việc cần người khác phối hợp
- Cần Trịnh Khoa xác nhận giao diện UI khi gặp ca Mẫu số 0 (`N/A`) và nhãn hiển thị của "Tổng Reach (cộng dồn ngày)*".
- Cần Lộc xác nhận cấu trúc `CampaignReportSnapshot` đã đầy đủ các trường mà mô hình Codex / Gemini qua 9Router cần để tạo ra 3 gợi ý chiến thuật chưa.

---

## PHẦN REVIEWER ĐIỀN (Khoa & Lộc xem xét)

*(Sẽ do Trịnh Khoa và Lộc điền sau khi review PR này trên GitHub)*
