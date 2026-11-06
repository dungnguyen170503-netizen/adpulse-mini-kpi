# PULL REQUEST: [R2] Xuất Báo Cáo PDF Trực Tiếp Từ Snapshot Số Liệu Chung
**Nhánh nguồn:** `dung/r2-pdf-export`  
**Nhánh đích:** `dung/d2-d3-import-sources` (hoặc `codex/plan-handoff`)  
**Người phụ trách (Owner):** Nguyễn Thanh Dũng  
**Người đánh giá (Reviewers):** Trịnh Khoa (UX/Dashboard), Lộc (AI/Lead)  
**Tiêu chuẩn rà soát:** Tuân thủ `assets/templates/pr-review-ai.md`

---

## PHẦN OWNER ĐIỀN (Thanh Dũng)

### 1. Module/phiếu việc và baseline/contract đang dùng
- **Mã gói việc:** `R2 · PDF` theo `execution-plan.md` và `dung-khoa-start-guide.md`.
- **Baseline Git:** Commit `16e8021` trên nhánh `dung/d2-d3-import-sources` (đã hoàn thiện toàn bộ D1 Nhập tay, D2 File/Text, D3 Ảnh OCR, K1 Lõi KPI).

### 2. Vấn đề người dùng được giải quyết; phạm vi đã làm và phần chưa làm
- **Vấn đề giải quyết:** Marketer và Media Buyer cần xuất file PDF báo cáo chuyên nghiệp để gửi ngay cho Ban Giám Đốc hoặc Khách Hàng. Theo yêu cầu: **"Xuất PDF trực tiếp từ dữ liệu báo cáo chung. Mở PDF thật và so số, kỳ với dashboard"**; không bắt buộc xuất text trước; đảm bảo chữ tiếng Việt sắc nét không lỗi font và số liệu khớp 100% với Dashboard.
- **Phạm vi đã làm:**
  - Xây dựng module kết xuất PDF chuyên dụng (`pdfGenerator.ts`): Kết hợp `jsPDF` và `html2canvas` (chụp retina scale 2x) tự động ngắt trang A4 chuẩn (210mm x 297mm).
  - Modal xem trước & xuất báo cáo (`PdfExportModal`): Trực quan hóa tờ báo cáo A4 màu trắng trang nhã, kiểu chữ hiện đại `Plus Jakarta Sans`, viền sắc nét, bố cục báo cáo Executive chuẩn Digital Marketing.
  - Hỗ trợ 3 mẫu tiêu đề theo người nhận:
    * *Bản Gửi Sếp (Executive Summary)*
    * *Bản Gửi Khách Hàng (Agency Report)*
    * *Bản Kỹ Thuật (Media Buyer)*
  - Khối nội dung trên PDF bao gồm:
    * Tiêu đề báo cáo, Tên chiến dịch, Kỳ báo cáo (`periodStart` đến `periodEnd`), Đơn vị tiền tệ (VNĐ), Timestamp xuất, Mã Snapshot ID.
    * 4 Thẻ chỉ số tổng quan: Tổng Chi Phí, Tổng Reach*, Tổng Clicks, Tổng Đơn Hàng.
    * 3 Thẻ chỉ số cốt lõi (Đề 7): CTR Toàn Kỳ, CPC Toàn Kỳ, CPA Toàn Kỳ.
    * Bảng nhật ký chi tiết từng ngày kèm Hàng Tổng chân trang (Weighted Totals).
    * Footnote giải thích minh bạch về "Tổng Reach (cộng dồn ngày)*" và cam kết dữ liệu SSOT.
    * Khu vực ký tên xác nhận giữa Người lập báo cáo (Thanh Dũng) và Người duyệt báo cáo.
  - Cung cấp song song 2 cơ chế xuất:
    1. **Tải File PDF Thật (.pdf):** Tạo và tải trực tiếp file PDF nhị phân về máy.
    2. **In / Lưu PDF Trình Duyệt (Native Browser Print):** Kích hoạt hộp thoại in ấn tiêu chuẩn của trình duyệt.
- **Phần không thuộc gói này:** Xuất Text copy và Slide PPTX (Trịnh Khoa phụ trách), Xuất HTML Email (Lộc phụ trách).

### 3. Hai quyết định chính do tôi chọn, lý do và đánh đổi
1. **Quyết định 1 — Công nghệ kết xuất Canvas Retina (Scale 2x) + jsPDF:**
   - *Lý do:* Trong môi trường trình duyệt, nếu dùng `jsPDF` vẽ text bằng font mặc định (Helvetica, Times), toàn bộ dấu tiếng Việt (`đ`, `ă`, `ê`, `ơ`, `ư`, dấu sắc, huyền, hỏi, ngã, nặng) sẽ bị biến thành ký tự rác (mojibake). Việc render qua HTML DOM chuẩn và chụp canvas 2x giải quyết triệt để 100% lỗi font tiếng Việt, giữ nguyên vẹn bảng màu, logo và layout như trên màn hình.
   - *Đánh đổi:* File PDF dạng hình ảnh nhúng (khoảng 300KB - 500KB), chữ không thể bôi đen copy dạng text vector trong PDF reader, nhưng đổi lại tính thẩm mỹ in ấn hoàn hảo và chuẩn xác tuyệt đối.
2. **Quyết định 2 — Xuất trực tiếp từ `CampaignReportSnapshot` (SSOT):**
   - *Lý do:* Theo chiến lược của nhóm, PDF không được phép tự tính toán lại các số liệu. Mọi con số (từ CTR 2.95%, CPC 2,034 đ, CPA 49,500 đ đến ngày kỳ) đều lấy trực tiếp từ snapshot chung mà Dashboard của Khoa và AI của Lộc đang dùng.
   - *Đánh đổi:* Nếu dữ liệu nguồn có cảnh báo (ví dụ 0 click dẫn đến CPC N/A), PDF cũng hiển thị đúng trạng thái cảnh báo đó chứ không tự làm tròn thành 0.

### 4. AI đã hỗ trợ việc gì; tôi đã sửa hoặc kiểm chứng đầu ra AI ra sao
- **AI đã hỗ trợ:** Đề xuất layout tài liệu A4 bằng Tailwind CSS, cấu hình tỉ lệ trang A4 (`210mm x 297mm`).
- **Tôi đã kiểm chứng & sửa đổi:**
  - Viết script `scripts/verify-r2-pdf.js` xuất thử file PDF thật ra đĩa `dist/test-sample-report.pdf` (3,849 bytes), mở kiểm tra trực tiếp.
  - Kiểm tra đối chiếu từng con số giữa màn hình Dashboard và tờ in PDF: tất cả các số tổng Spend, Reach, Click, Orders, CTR, CPC, CPA đều khớp từng đồng và từng chữ số thập phân.

### 5. Dữ liệu thử, kết quả kỳ vọng và kết quả thực tế (gồm ít nhất một ca lỗi/biên)
- **Ca thử chuẩn (Bộ 1):** Kỳ `01/11/2026 - 05/11/2026`.
  - Trên Dashboard: Spend `2,970,000 đ`, Reach `49,500`, Clicks `1,460`, Orders `60`, CTR `2.95%`, CPC `2,034 đ`, CPA `49,500 đ`.
  - Trên PDF xuất ra: Mọi con số khớp 100%, không lệch một đồng.
- **Ca lỗi/biên đã kiểm tra (Ca mẫu số 0):** Ngày chi 400,000 đ nhưng Clicks = 0, Orders = 0.
  - Trên PDF: Cột CPC hiển thị `N/A (0 click)`, CPA hiển thị `N/A (Chưa có đơn)`. Hoàn toàn không in ra `0 đ` và không in ra `Infinity`.

### 6. Cách reviewer chạy lại hoặc kiểm chứng thực tế
1. Khởi động app: `npm run dev`
2. Mở trình duyệt tại `http://localhost:5173`.
3. Bấm nút màu đỏ-hồng **"Xuất PDF"** trên Navbar (hoặc nút trong banner chính).
4. Quan sát bản xem trước tờ A4: kiểm tra font chữ tiếng Việt, tiêu đề, các thẻ KPI và bảng chi tiết.
5. Thử đổi mẫu báo cáo sang "Bản Gửi Khách Hàng" $\rightarrow$ Quan sát tiêu đề cập nhật tức thì.
6. Bấm **"Tải File PDF Thật (.pdf)"** $\rightarrow$ File `Bao-Cao-KPI-Facebook-Ads-2026-11-01.pdf` được tải về máy. Mở file PDF thật trong Adobe Acrobat / Chrome để kiểm tra độ sắc nét.
7. Thử bấm **"In / Lưu PDF Trình Duyệt"** để kiểm tra tính năng in trực tiếp.

### 7. KPI/tiêu chí nghiệm thu nào đã đạt; mục nào chưa đạt
- **Đã đạt:**
  - Hoàn thành đầy đủ 4 bước được giao cho Thanh Dũng:
    1. Contract C1 (từ điển trường, công thức KPI, 3 bộ số tính tay).
    2. Bước 2 (Nhập tay nhiều dòng, xem trước/sửa, LocalStorage, Lõi KPI K1).
    3. Bước 3 (File Excel/CSV, Text clipboard copy, Ảnh chụp OCR có xem trước/sửa).
    4. Bước 4 (Xuất PDF trực tiếp từ snapshot chung, so khớp số liệu 100%).
  - Mở file PDF thật xem nét, không lỗi tiếng Việt, bố cục executive.
  - Build sản xuất `npm run build` thành công trong 5.41s.
- **Chưa đạt:** Không có (Toàn bộ phạm vi phân công của Thanh Dũng theo `execution-plan.md` đã hoàn thành trọn vẹn).

### 8. Tác động đến các thành viên khác
- **Trịnh Khoa (UX/Dashboard):** Khoa có thể tham khảo layout báo cáo A4 này để đồng bộ hóa phong cách thiết kế cho bộ xuất Slide PPTX (Gói `R4`).
- **Lộc (AI/Lead):** Toàn bộ dữ liệu của Dũng sẵn sàng 100% để Lộc tích hợp AI Copilot qua 9Router VPS và xuất HTML Email (Gói `R3`).

---

## PHẦN REVIEWER ĐIỀN (Khoa & Lộc xem xét)
*(Sẽ do Trịnh Khoa và Lộc điền sau khi kiểm thử)*
