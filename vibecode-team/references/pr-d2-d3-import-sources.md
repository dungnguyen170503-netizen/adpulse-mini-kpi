# PULL REQUEST: [D2 & D3] Nạp File Excel/CSV, Text Copy Clipboard & Đọc Ảnh Chụp Ads (OCR)
**Nhánh nguồn:** `dung/d2-d3-import-sources`  
**Nhánh đích:** `dung/d1-manual-entry-kpi` (hoặc `codex/plan-handoff`)  
**Người phụ trách (Owner):** Nguyễn Thanh Dũng  
**Người đánh giá (Reviewers):** Trịnh Khoa (UX/Dashboard), Lộc (AI/Lead)  
**Tiêu chuẩn rà soát:** Tuân thủ `assets/templates/pr-review-ai.md`

---

## PHẦN OWNER ĐIỀN (Thanh Dũng)

### 1. Module/phiếu việc và baseline/contract đang dùng
- **Mã gói việc:** `D2 · File và text copy` và `D3 · Ảnh chụp` theo `execution-plan.md` và `dung-khoa-start-guide.md`.
- **Baseline Git:** Commit `d14f643` trên nhánh `dung/d1-manual-entry-kpi` (đã hoàn thiện D1 Nhập tay & K1 Lớp KPI).

### 2. Vấn đề người dùng được giải quyết; phạm vi đã làm và phần chưa làm
- **Vấn đề giải quyết:** Marketer thường có dữ liệu rải rác: xuất file Excel từ Ads Manager, bảng theo dõi trên Google Sheets, hoặc ảnh chụp màn hình gửi qua Zalo. Nhập tay từng dòng quá lâu; cần công cụ nạp file, dán text, và đọc ảnh nhưng phải **"Cho sửa trước khi lưu khi nguồn đọc không rõ"** và **"Không tự tạo dữ liệu từng ngày từ ảnh chỉ có tổng kỳ"**.
- **Phạm vi đã làm:**
  - **Module D2 (File & Text):**
    * Thư viện SheetJS (`xlsx`) đọc file Excel `.xlsx`, `.xls` và file `.csv`, `.tsv`.
    * Bộ phân tích văn bản `parseDelimitedText`: Tự động nhận diện phân cách Tab `\t` khi Marketer copy từ Google Sheets hoặc Excel rồi dán vào.
    * Bộ gợi ý ánh xạ cột (`suggestColumnMapping`): Tự động nhận diện các tiêu đề tiếng Việt và tiếng Anh phổ biến (`Ngày`, `Chi phí`, `Reach`, `Clicks`, `Đơn hàng`).
    * Modal nạp dữ liệu 3 bước (`FileImportModal`): (1) Chọn nguồn $\rightarrow$ (2) Kiểm tra ánh xạ $\rightarrow$ (3) Xem trước & chỉnh sửa trực tiếp từng ô số liệu mơ hồ trước khi lưu.
    * Chuẩn hóa số thông minh (`normalizeNumber`): Tự xử lý ký hiệu `VNĐ`, `đ`, `₫`, khoảng trắng, dấu phân cách hàng nghìn kiểu Việt Nam (`300.000` hoặc `300,000`).
    * Chuẩn hóa ngày (`normalizeDate`): Tự động chuyển đổi các định dạng `DD/MM/YYYY`, `DD-MM-YYYY`, `YYYY/MM/DD`, hoặc số serial ngày Excel sang chuẩn ISO `YYYY-MM-DD`.
  - **Module D3 (Ảnh chụp Ads Manager):**
    * Modal đọc ảnh (`ImageImportModal`): Giao diện đối chiếu song song giữa ảnh chụp gốc bên trái và form trích xuất số liệu bên phải.
    * Phân biệt rõ 2 loại ảnh: **Ảnh chi tiết theo ngày** vs **Ảnh tóm tắt tổng kỳ**.
    * **Tuân thủ đạo đức dữ liệu C1:** Khi gặp ảnh tổng kỳ (ví dụ: 7 ngày qua chi 3.5tr, 50 đơn), hệ thống ghi nhận thành `PeriodSummaryRecord`, **TUYỆT ĐỐI KHÔNG** tự chia đều để bịa số liệu ngày ảo.
    * Ghi rõ danh sách các loại ảnh được hỗ trợ và chưa hỗ trợ ngay trên giao diện.
    * Cho phép chỉnh sửa từng con số trước khi bấm lưu.
- **Phần chưa làm (Kế hoạch Bước 4):**
  - Xuất báo cáo PDF trực tiếp từ `CampaignReportSnapshot` chung (Module `R2`).

### 3. Hai quyết định chính do tôi chọn, lý do và đánh đổi
1. **Quyết định 1 — Quy trình Wizard 3 bước có Bản xem trước & Sửa inline:**
   - *Lý do:* Theo chỉ đạo: *"Nguồn nào đọc không rõ thì cho sửa trước khi lưu"*. Khi nạp file CSV hay dán từ Google Sheets, các cột có thể bị lệch hoặc người dùng dán nhầm cột. Cho phép chọn lại ánh xạ cột và sửa từng ô trong bảng xem trước giúp ngăn chặn rác dữ liệu lọt vào LocalStorage.
   - *Đánh đổi:* Thêm 1 bước thao tác cho người dùng thay vì "1-click nạp ngay", nhưng đảm bảo dữ liệu luôn sạch 100%.
2. **Quyết định 2 — Lưu Snapshot Tổng Kỳ riêng biệt cho Ảnh chụp:**
   - *Lý do:* Nếu người dùng nạp ảnh chụp chỉ có tổng kỳ 7 ngày mà ta tự chia đều 500k/ngày, AI của Lộc sẽ tưởng chiến dịch ngày nào cũng tiêu 500k và nhận xét sai hoàn toàn về xu hướng tăng/giảm ngân sách. Việc lưu snapshot tổng kỳ vừa giữ tính chân thực, vừa giúp Dashboard hiển thị đúng tổng chi tiêu và hiệu quả cả kỳ.
   - *Đánh đổi:* Vùng biểu đồ đường theo ngày sẽ không vẽ được các điểm ngày nếu người dùng chỉ nạp ảnh tổng kỳ.

### 4. AI đã hỗ trợ việc gì; tôi đã sửa hoặc kiểm chứng đầu ra AI ra sao
- **AI đã hỗ trợ:** Đề xuất regex nhận diện ngày tháng và số tiền; khởi tạo giao diện Modal kéo thả file và dán văn bản.
- **Tôi đã kiểm chứng & sửa đổi:**
  - Sửa thuật toán `normalizeNumber` để xử lý chuẩn xác cả hai kiểu viết phân cách hàng nghìn ở Việt Nam (dấu chấm `300.000` và dấu phẩy `300,000`).
  - Viết script `scripts/verify-d2-d3-import.js` chạy kiểm thử độc lập bằng Node.js: kết quả nhận diện số, ngày và xử lý ảnh tổng kỳ đều đạt tiêu chuẩn.

### 5. Dữ liệu thử, kết quả kỳ vọng và kết quả thực tế (gồm ít nhất một ca lỗi/biên)
- **Ca thử File/Text:** Dán chuỗi TSV từ Google Sheets có định dạng `300.000 đ` và ngày `01/11/2026`.
  - Kết quả: Ánh xạ cột tự động khớp 100%, chuẩn hóa thành số `300000` và ngày `2026-11-01`.
- **Ca thử Ảnh chụp tổng kỳ:** Nạp ảnh chụp Meta Ads có `Period: 01/11 - 07/11`, `Spend: 3,500,000 đ`, `Reach: 50,000`, `Clicks: 1,500`, `Orders: 50`.
  - Kết quả: Nhận diện chế độ `period_summary`, không tạo ngày ảo, lưu thành snapshot tổng kỳ với CTR `3.00%`, CPC `2,333 đ`, CPA `70,000 đ`.
- **Ca lỗi/biên đã kiểm tra:** File import chứa ngày trùng lặp với ngày đã có trong LocalStorage.
  - Kết quả: Bảng xem trước cảnh báo nhãn vàng *"⚠️ Trùng ngày đã có"*, khi bấm Lưu sẽ kích hoạt `DuplicateResolutionModal` hỏi người dùng Gộp (Merge) hay Ghi đè (Overwrite).

### 6. Cách reviewer chạy lại hoặc link preview/ảnh minh chứng
1. Khởi động ứng dụng: `npm run dev`
2. Mở trình duyệt tại `http://localhost:5173`.
3. Bấm **"Excel/CSV/Text"** trên Navbar:
   - Thử dán văn bản:
     ```
     Ngày	Chi phí	Reach	Clicks	Đơn hàng
     2026-11-01	300.000 đ	5000	150	6
     2026-11-02	450.000 đ	7500	210	9
     ```
   - Quan sát tự động nhận diện cột $\rightarrow$ Bấm Xem trước $\rightarrow$ Thử sửa 1 ô số $\rightarrow$ Xác nhận lưu.
4. Bấm **"Ảnh Chụp (OCR)"** trên Navbar:
   - Tải lên ảnh chụp màn hình $\rightarrow$ Quan sát hệ thống nhận diện chế độ tổng kỳ $\rightarrow$ Thử sửa số liệu trong form bên phải $\rightarrow$ Xác nhận lưu snapshot tổng kỳ.

### 7. KPI/tiêu chí nghiệm thu nào đã đạt; mục nào chưa đạt
- **Đã đạt:**
  - Hoàn thành đầy đủ 4 nguồn nạp: Nhập tay, Excel/CSV, Text copy, Ảnh chụp OCR.
  - Cho phép xem trước và sửa đổi số liệu mơ hồ trước khi lưu.
  - Tuân thủ quy tắc không tự sinh ngày giả từ ảnh tổng kỳ.
  - Ghi rõ minh bạch danh sách các định dạng và kiểu ảnh chưa hỗ trợ.
  - Build sản xuất `npm run build` thành công trong 2.56s.
- **Chưa đạt:** Chưa hoàn thành xuất PDF (Bước 4).

### 8. Tác động đến các thành viên khác
- **Trịnh Khoa (Dashboard):** Khoa có thể nhận dữ liệu phong phú từ cả 4 nguồn; khi có snapshot tổng kỳ từ ảnh, Dashboard có thể hiển thị thẻ KPI kỳ tổng hợp.
- **Lộc (AI):** AI Copilot nhận dữ liệu được gắn nhãn nguồn gốc (`source_type: 'excel_csv' | 'text_copy' | 'image_ocr'`), giúp AI đánh giá độ tin cậy của báo cáo.

---

## PHẦN REVIEWER ĐIỀN (Khoa & Lộc xem xét)
*(Sẽ do Trịnh Khoa và Lộc điền sau khi kiểm thử)*
