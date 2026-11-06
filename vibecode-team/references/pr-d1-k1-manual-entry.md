# PULL REQUEST: [D1 & K1] Nhập Tay Nhiều Dòng, Xem Trước/Sửa, Lưu LocalStorage & Lớp KPI Dùng Chung
**Nhánh nguồn:** `dung/d1-manual-entry-kpi`  
**Nhánh đích:** `dung/c1-data-kpi-contract` (hoặc `codex/plan-handoff`)  
**Người phụ trách (Owner):** Nguyễn Thanh Dũng  
**Người đánh giá (Reviewers):** Trịnh Khoa (UX/Dashboard), Lộc (AI/Lead)  
**Tiêu chuẩn rà soát:** Tuân thủ `assets/templates/pr-review-ai.md`

---

## PHẦN OWNER ĐIỀN (Thanh Dũng)

### 1. Module/phiếu việc và baseline/contract đang dùng
- **Mã gói việc:** `D1 · Nhập tay/lưu` và `K1 · Lớp KPI` theo `execution-plan.md` và `dung-khoa-start-guide.md`.
- **Baseline Git:** Commit `14639a9` trên nhánh `dung/c1-data-kpi-contract` (đã kế thừa toàn bộ Contract C1).

### 2. Vấn đề người dùng được giải quyết; phạm vi đã làm và phần chưa làm
- **Vấn đề giải quyết:** Marketer cần nhập số liệu nhiều ngày cùng lúc một cách nhanh chóng, thấy ngay chỉ số KPI được tính toán xem trước, không bị mất dữ liệu khi F5 tải lại trang, và hệ thống xử lý thông minh các trường hợp nhập trùng ngày hoặc mẫu số bằng 0.
- **Phạm vi đã làm:**
  - Xây dựng modal nhập liệu nhiều dòng (`MultiRowEntryModal`) có bảng lưới (grid) hỗ trợ thêm dòng đơn, tự động sinh 7 ngày kế tiếp, xóa dòng.
  - Tính năng **Live Preview**: Tự động tính toán xem trước CTR, CPC, CPA cho từng dòng ngay khi người dùng đang gõ phím.
  - Lõi kiểm tra tính hợp lệ (`validation.ts`): Bắt lỗi số âm, chữ trong ô tiền, ngày không đúng định dạng `YYYY-MM-DD`, cảnh báo $Clicks > Reach$.
  - Cơ chế phát hiện và xử lý trùng lặp ngày (`DuplicateResolutionModal`): Cung cấp 2 tùy chọn minh bạch là **"Gộp chỉ số (Sum Merge)"** hoặc **"Ghi đè (Overwrite)"**.
  - Tầng lưu trữ bền vững (`storage.ts`): Tự động đồng bộ vào `localStorage` với key `adpulse_campaign_records_v1`, có ghi nhận thời điểm lưu (`lastSavedAt`).
  - Lõi tính toán KPI dùng chung (`kpiEngine.ts`): Tính toán chính xác tuyệt đối CTR, CPC, CPA, CVR cho từng ngày và toàn kỳ (Weighted Aggregates), xử lý mẫu số 0 ra `null` (hiển thị `N/A`), không bao giờ sinh ra `0đ` hay `Infinity`.
  - Giao diện 7 thẻ KPI (`KpiStatsGrid`) và Bảng số liệu chi tiết (`DataTable`) có thanh nhập nhanh 1 dòng và hỗ trợ sửa trực tiếp (Inline Edit).
  - Tích hợp 3 nút nạp nhanh 3 Bộ dữ liệu kiểm thử chuẩn của C1 để reviewer kiểm chứng ngay tại chỗ.
- **Phần chưa làm (Kế hoạch các bước sau):**
  - Chưa làm nạp file Excel (.xlsx), CSV, và Clipboard Text Copy (Bước 3 / Gói `D2`).
  - Chưa làm nhận diện ảnh chụp báo cáo OCR (Bước 3 / Gói `D3`).
  - Chưa làm xuất file PDF trực tiếp (Bước 4 / Gói `R2`).

### 3. Hai quyết định chính do tôi chọn, lý do và đánh đổi
1. **Quyết định 1 — Live KPI Preview & Inline Validation ngay trong Modal nhập:**
   - *Lý do:* Marketer thường dán hoặc gõ nhiều ngày liền. Nếu để người dùng bấm Lưu rồi mới báo lỗi thì trải nghiệm rất ức chế. Việc tính xem trước CTR/CPC/CPA tức thì giúp họ nhận ra ngay nếu gõ nhầm một số 0 (ví dụ gõ 3,000,000 đ thành 300,000 đ).
   - *Đánh đổi:* Phải tính toán liên tục (`useMemo` trên `draftRows`), tuy nhiên dữ liệu batch thường dưới 100 dòng nên không ảnh hưởng hiệu năng.
2. **Quyết định 2 — Tự động hỗ trợ Gộp chỉ số (Sum Merge) khi trùng ngày:**
   - *Lý do:* Trục hoành thời gian của biểu đồ (Khoa phụ trách) đòi hỏi mỗi ngày chỉ có 1 điểm dữ liệu duy nhất. Nếu cùng ngày 03/11 có 2 dòng (ví dụ chạy 2 Ad Set), việc gộp cộng dồn Spend, Reach, Clicks, Orders thành 1 dòng duy nhất giữ cho biểu đồ không bị gãy và số tổng kỳ không bị thiếu.
   - *Đánh đổi:* Dữ liệu bóc tách theo Ad Set bị gộp chung vào cấp Chiến dịch (đúng với phạm vi Đề 7).

### 4. AI đã hỗ trợ việc gì; tôi đã sửa hoặc kiểm chứng đầu ra AI ra sao
- **AI đã hỗ trợ:** Khởi tạo khung component React, Tailwind CSS styling cho modal và bảng.
- **Tôi đã kiểm chứng & sửa đổi:**
  - Sửa lỗi logic cốt lõi: Loại bỏ hoàn toàn việc gán `CPC = 0` hoặc `CPA = 0` khi click hoặc order bằng 0 (lỗi thường gặp trong các mẫu code cũ).
  - Viết script `scripts/verify-c1-math.js` chạy độc lập bằng Node.js để kiểm tra tính toán số học trên cả 3 bộ dữ liệu C1: kết quả khớp chính xác 100% đến từng con số và dấu thập phân.
  - Kiểm tra tính bền vững của `localStorage` bằng cách nạp dữ liệu, thực hiện F5 tải lại trang, xác nhận dữ liệu phục hồi nguyên vẹn.

### 5. Dữ liệu thử, kết quả kỳ vọng và kết quả thực tế (gồm ít nhất một ca lỗi/biên)
- **Ca thử chuẩn (Bộ 1 - 5 ngày E-Commerce):**
  - Dữ liệu: 1,460 clicks, 49,500 reach, 2,970,000 đ, 60 đơn.
  - Kết quả thực tế trên App: CTR = `2.95%`, CPC = `2,034 đ`, CPA = `49,500 đ`, CVR = `4.11%`. Khớp 100% bảng tính tay.
- **Ca thử biên / lỗi đã kiểm tra (Ca 3.1 & 3.3):**
  - Ca 3.1: Chi tiêu 400,000 đ nhưng Clicks = 0, Orders = 0.
    - Kết quả: CPC hiển thị `N/A (0 click)`, CPA hiển thị `N/A (Chưa có đơn)`. Không sinh ra `0 đ`, không sinh ra `Infinity`.
  - Ca 3.3: Nhập 2 dòng cùng ngày `2026-11-03`.
    - Kết quả: Hệ thống kích hoạt Modal cảnh báo trùng lặp, bấm "Gộp chỉ số (Merge)" lập tức tạo ra 1 dòng duy nhất có Spend = 250,000 đ, Reach = 5,000, Clicks = 100, Orders = 3.

### 6. Cách reviewer chạy lại hoặc kiểm chứng thực tế
1. Khởi động môi trường phát triển:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt tại `http://localhost:5173`.
3. Bấm **"Nhập Nhiều Dòng"** $\rightarrow$ Điền 3 dòng thử nghiệm $\rightarrow$ Quan sát cột "Xem Trước KPI" tự nhảy số $\rightarrow$ Bấm "Xác Nhận & Lưu".
4. Bấm nút **"Thử F5 Tải Lại"** trên Navbar $\rightarrow$ Quan sát bảng và thẻ KPI vẫn giữ nguyên số liệu đã lưu.
5. Bấm các nút "Bộ 1 (Chuẩn)", "Bộ 2 (Lỗi/Thiếu)", "Bộ 3 (Biên/Số 0)" để kiểm tra khả năng ứng phó các tình huống số học.

### 7. KPI/tiêu chí nghiệm thu nào đã đạt; mục nào chưa đạt
- **Đã đạt:**
  - Nhập tay nhiều dòng, xem trước, sửa inline, lưu localStorage bền vững.
  - Lõi KPI dùng chung (`kpiEngine.ts`) tính toán chính xác 100% theo C1 contract.
  - Xử lý mượt mà ca thiếu dữ liệu, ca mẫu số 0 và ngày trùng lặp.
  - Build sản xuất `npm run build` thành công 100% không cảnh báo lỗi type.
- **Chưa đạt:** Chưa mở rộng sang file Excel/CSV, ảnh OCR và xuất PDF (thuộc các bước tiếp theo 3 và 4).

### 8. Tác động đến các thành viên khác
- **Trịnh Khoa (UX/Dashboard):** Khoa có thể kết nối ngay các biểu đồ đường/cột và 3 góc nhìn vào hàm `calculatePeriodAggregates(records)` trong `kpiEngine.ts` để lấy dữ liệu chuẩn, không cần tự viết lại logic tính.
- **Lộc (AI Copilot):** Lộc có thể dùng trực tiếp `snapshot` được sinh ra từ `kpiEngine.ts` để làm payload gửi sang 9Router VPS cho Codex/Gemini phân tích.

---

## PHẦN REVIEWER ĐIỀN (Khoa & Lộc xem xét)
*(Sẽ do Trịnh Khoa và Lộc điền sau khi kiểm thử)*
