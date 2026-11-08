# Báo Cáo Hoàn Thiện UX/UI, Bố Cục Báo Cáo & Đồng Bộ Dữ Liệu Tổng Kỳ (Khoa)

- **Nhánh thực hiện**: `codex/khoa-ux-report-polish`
- **Nhánh đích (PR Target)**: `codex/loc-ai-integration` (đã fast-forward tích hợp `origin/codex/dung-data-ocr-fix` của Dũng)
- **Phạm vi**: Hoàn thiện luồng người dùng lần đầu tự dùng không cần hướng dẫn (`mở app → nhập → xem trước & sửa → xác nhận → chọn kỳ → xuất báo cáo cho sếp`), thiết kế lại bố cục tab `Báo cáo`, xử lý đầy đủ các trạng thái màn hình, kiểm thử responsive `390px` / `834px` / `1440px` và đồng bộ dữ liệu tổng kỳ (`PeriodSummaryRecord`) với Dũng trên Dashboard + 4 định dạng xuất (`Text`, `PDF`, `HTML`, `PPTX`).

---

## 1. Rà Soát & Tối Ưu Luồng Người Dùng Đầu Cuối

| Bước trong luồng | Thiết kế & Cải tiến UX đã hoàn thiện |
|---|---|
| **1. Mở ứng dụng lần đầu** | Sửa lỗi khởi tạo `useState` trong React StrictMode khiến màn hình lần đầu bị rỗng `0 đ`; gắn nhãn rõ ràng `Dữ liệu mẫu (Mặc định 10 ngày)` kèm thanh hướng dẫn 3 bước (`1. Nhập dữ liệu → 2. Chọn kỳ & xem KPI → 3. Sang tab Báo cáo để xuất gửi sếp`). |
| **2. Chọn cách nhập dữ liệu** | Gom toàn bộ 4 cách nhập dữ liệu thật dưới nút chính nổi bật **`Nhập dữ liệu`** (`1. Nhập tay nhiều ngày`, `2. Tải file Excel / CSV`, `3. Dán bảng từ Google Sheets / Zalo`, `4. Đọc ảnh chụp báo cáo (OCR)`). Tách riêng **`Dùng dữ liệu mẫu:`** (`Bộ 1 (Chuẩn)`, `Bộ 2 (Lỗi/Thiếu)`, `Bộ 3 (Biên/Trùng)`, `Ảnh tổng kỳ mẫu`) thành khu vực độc lập có nhãn màu hổ phách. |
| **3. Xem trước & Sửa lỗi ngay tại trường** | Trong `MultiRowEntryModal`, `DataTable`, `FileImportModal`, `ImageImportModal`: hiển thị thông báo lỗi kèm cách sửa ngay dưới ô nhập bị thiếu/sai (`role="alert"`, `aria-invalid="true"`), có xem trước KPI từng dòng (`CTR`, `CPC`, `CPA`) và nút **`Hoàn tác`** (`Undo`). Không tự điền `0` cho ô trống và không chặn bằng `window.alert` chung chung. |
| **4. Xác nhận lưu & Kiểm tra trùng ngày** | Khi phát hiện trùng ngày, mở `DuplicateResolutionModal` cho chọn `Gộp (Cộng dồn)` hoặc `Ghi đè`, hoặc `Hủy` mà không làm mất bản nháp đang nhập. |
| **5. Nhận biết Nguồn, Kỳ & Độ phủ dữ liệu** | Đặt dải 3 thẻ trạng thái nổi bật ngay đầu trang (`PeriodFilterBar`): **Nguồn đang xem**, **Kỳ báo cáo** (`DD/MM/YYYY – DD/MM/YYYY`) và **Độ phủ dữ liệu** (`X/Y ngày có dữ liệu` hoặc `Chỉ có tổng kỳ (7 ngày lịch, không tách ngày)`). |
| **6. Xuất báo cáo gửi sếp** | Tại tab `Báo cáo`: đưa 3 KPI điều hành quan trọng nhất (**Tổng chi phí**, **Số đơn hàng**, **Chi phí / đơn (CPA)**), bộ chọn 4 định dạng (`Text`, `PDF`, `HTML email`, `PPTX`) và khung xem trước/nút xuất lên **đầu tab**. Phần phân tích dài của AI (`Trợ lý AI · Gemini`) đặt bên dưới và thu gọn mặc định (`Mở rộng chi tiết AI` / `Thu gọn chi tiết AI`). |

---

## 2. Thiết Kế Các Trạng Thái Màn Hình Bắt Buộc

1. **Chưa có dữ liệu (`Empty State`)**:
   - Khi người dùng bấm `Xóa dữ liệu`, hiển thị khung hướng dẫn trực quan `Chưa có số liệu chiến dịch` (`data-testid="empty-state-panel"`) chia rõ 2 lựa chọn: **Lựa chọn 1: Nhập số liệu chiến dịch của bạn** (4 nút lớn) và **Lựa chọn 2: Dùng dữ liệu mẫu**.
2. **Đang đọc file / Đang nhận diện ảnh OCR**:
   - Hiển thị trạng thái đang xử lý kèm nút **`Hủy đọc file`** (trong `FileImportModal`) và **`Hủy nhận diện`** (trong `ImageImportModal`) để người dùng chủ động dừng bất kỳ lúc nào.
3. **Lỗi có cách sửa cạnh trường cần sửa (`Inline Validation`)**:
   - Báo lỗi trực tiếp dưới ô thiếu/sai (ví dụ: `Thiếu Chi phí (nhập 0 nếu = 0)`, `Click > Reach`, `Chưa chọn cột ghép`).
4. **AI đang chờ & Lỗi AI không chặn báo cáo**:
   - Khi đang gọi Gemini API, hiển thị trạng thái chờ kèm nút **`Hủy chờ`** (`AbortController`). Nếu AI lỗi hoặc hết thời gian chờ, hiển thị cảnh báo kèm nút `Thử lại` và khẳng định rõ KPI cùng 4 định dạng xuất báo cáo vẫn hoạt động bình thường.
5. **Báo cáo cũ sau khi sửa dữ liệu hoặc đổi kỳ (`Stale Report Banner`)**:
   - Sau khi đã tạo/xem báo cáo, nếu người dùng sửa số liệu hoặc đổi kỳ lọc, hiển thị banner cảnh báo nổi bật (`data-testid="stale-report-banner"`) chỉ rõ:
     - **Bản báo cáo đang xem**: thuộc kỳ nào, nguồn nào.
     - **Dữ liệu/kỳ mới trên bảng**: thuộc kỳ nào, nguồn nào.
     - Nút **`Cập nhật báo cáo`** ngay bên cạnh để đồng bộ tức thì.

---

## 3. Phối Hợp Với Dũng Về Dữ Liệu Tổng Kỳ (`PeriodSummaryRecord`)

Thực hiện đúng hợp đồng `PeriodSummaryRecord` trong `vibecode-team/references/period-summary-spec-for-khoa.md`:
- Hàm `buildSnapshotFromSummary(summary)` trong `src/report/reportModel.ts` gọi trực tiếp `calculateDailyMetrics` từ `src/utils/kpiEngine.ts` của Dũng để tính KPI toàn kỳ, đồng thời giữ `dailyRecords: []` và `hasDailyBreakdown: false` (**tuyệt đối không tự chia đều ra các ngày giả**).
- Khi chọn ảnh tổng kỳ (`summary-ads.png` qua OCR hoặc nút `Ảnh tổng kỳ mẫu`), toàn bộ hệ thống hiển thị đồng nhất:
  - **Kỳ báo cáo**: `01/11/2026 – 07/11/2026` (`Chỉ có tổng kỳ (7 ngày lịch, không tách ngày)`).
  - **Nguồn dữ liệu**: `Ảnh chụp tổng kỳ OCR (summary-ads.png)`.
  - **Số liệu tổng & KPI**: Chi phí `3.500.000 đ` · Reach `50.000` · Click `1.500` · Số đơn `50` · CTR `3.00%` · CPC `2.333 đ` · Chi phí/đơn (CPA) `70.000 đ`.
  - **Tab Phân tích (`AnalysisView`)**: Hiển thị hộp giải thích rõ *“Vì sao biểu đồ theo ngày không có điểm dữ liệu?”* (do ảnh gốc chỉ có số tổng hợp cả kỳ, hệ thống không tự chia trung bình ra từng ngày ảo để tránh vẽ xu hướng giả) kèm bảng đối chiếu tổng kỳ.
  - **4 định dạng xuất (`Text`, `PDF`, `HTML email`, `PPTX`)**: Cùng đọc từ một `CampaignReportSnapshot`, khớp 100% kỳ, nguồn, KPI và lời giải thích tổng kỳ.

---

## 4. Nhật Ký Kiểm Thử Người Dùng Mới (Usability Walkthrough) & Cách Khắc Phục

Chúng tôi đã thực hiện kịch bản đóng vai người dùng lần đầu chưa biết ứng dụng (tự mở app → xóa dữ liệu mẫu → tự nhập số liệu → sửa lỗi → chọn kỳ → sang tab Báo cáo xuất gửi sếp) và ghi nhận 4 điểm vướng thực tế, sau đó đã sửa triệt để:

| # | Điểm người dùng mới bị vướng khi tự thao tác | Nguyên nhân gốc | Giải pháp đã sửa trong code |
|---|---|---|---|
| 1 | Mở app lần đầu ở môi trường dev thấy màn hình báo `0 đ`, `0 ngày`, `Kỳ: Chưa có dữ liệu` dù chưa bấm xóa. | `useState` trong `App.tsx` gọi hàm phụ `markAppInitialized()` ngay trong thân khởi tạo; khi React 18 StrictMode gọi hàm khởi tạo lần 2, `loadCampaignData()` tưởng người dùng đã xóa dữ liệu nên trả về mảng rỗng `[]`. | Bỏ `markAppInitialized()` khỏi hàm khởi tạo `useState` thuần khiết; để `useEffect` lưu `saveCampaignData` đảm nhận đánh dấu khởi tạo. |
| 2 | Sau khi tự nhập số liệu mới ở tab `Tổng quan` rồi bấm sang tab `Báo cáo` lần đầu tiên, báo cáo lại hiện số của bộ dữ liệu cũ kèm cảnh báo "Dữ liệu đã thay đổi". | `frozenSnapshot` bị khóa cứng ngay từ lúc mở trang ở tab `Tổng quan` (trước cả khi người dùng mở tab `Báo cáo`). | Thêm cờ `hasCreatedReport`: trước khi người dùng mở tab `Báo cáo` lần đầu (hoặc tạo AI), tự động đồng bộ `snapshot` vào `frozenSnapshot`. Chỉ khóa bản báo cáo và hiện cảnh báo cũ **sau khi** người dùng đã tạo/xem báo cáo rồi mới quay lại sửa dữ liệu hoặc đổi kỳ. |
| 3 | Khi bấm mở hộp thoại `Nhập tay nhiều ngày`, có trường hợp React báo lỗi hook khiến hộp thoại không mở. | Trong `MultiRowEntryModal.tsx`, câu lệnh `if (!isOpen) return null;` đặt trước hook `useMemo` (`evaluatedRows`). | Đưa `if (!isOpen) return null;` xuống sau toàn bộ các hook (`useState`, `useMemo`) theo đúng quy tắc Rules of Hooks. |
| 4 | Trên điện thoại `390px`, bảng 10 cột phải cuộn ngang mới thấy được Số đơn và CPA của từng ngày; phần AI dài trong tab Báo cáo đẩy vùng xem trước xuống sâu. | Bảng chỉ có giao diện `table` rộng 10 cột; `AiPanel` trước đây đặt ở đầu tab `Báo cáo`. | Bổ sung chế độ thẻ tóm tắt theo ngày trên mobile (`md:hidden`) hiện ngay `Ngày`, `Chi phí`, `Số đơn`, `Chi phí/đơn`; đưa 3 KPI chính + nút xuất lên đầu tab `Báo cáo` và thu gọn chi tiết AI xuống dưới. |

---

## 5. Minh Chứng Ảnh Chụp Trước / Sau (390px, 834px, 1440px)

Toàn bộ ảnh chụp đối chiếu được lưu tại `docs/khoa/evidence/ux-polish/before/` và `docs/khoa/evidence/ux-polish/after/`:

| Màn hình / Trạng thái | Trước khi tối ưu (`before/`) | Sau khi tối ưu (`after/`) |
|---|---|---|
| **Tổng quan Desktop (1440px)** | `docs/khoa/evidence/ux-polish/before/overview-1440.png` | `docs/khoa/evidence/ux-polish/after/overview-1440.png` |
| **Tổng quan Tablet (834px)** | `docs/khoa/evidence/ux-polish/before/overview-834.png` | `docs/khoa/evidence/ux-polish/after/overview-834.png` |
| **Tổng quan Mobile (390px)** | `docs/khoa/evidence/ux-polish/before/overview-390.png` | `docs/khoa/evidence/ux-polish/after/overview-390.png` |
| **Báo cáo Desktop (1440px)** | `docs/khoa/evidence/ux-polish/before/report-1440.png` | `docs/khoa/evidence/ux-polish/after/report-1440.png` |
| **Báo cáo Tablet (834px)** | `docs/khoa/evidence/ux-polish/before/report-834.png` | `docs/khoa/evidence/ux-polish/after/report-834.png` |
| **Báo cáo Mobile (390px)** | `docs/khoa/evidence/ux-polish/before/report-390.png` | `docs/khoa/evidence/ux-polish/after/report-390.png` |
| **Cảnh báo báo cáo cũ khi đổi kỳ/dữ liệu** | `docs/khoa/evidence/ux-polish/before/report-stale-1440.png` | `docs/khoa/evidence/ux-polish/after/report-stale-1440.png` |
| **Trạng thái chưa có dữ liệu (Empty State)** | `docs/khoa/evidence/ux-polish/before/empty-1440.png` | `docs/khoa/evidence/ux-polish/after/empty-1440.png` |
| **Menu gom 4 cách nhập & tách dữ liệu mẫu** | *(4 nút rời trên thanh công cụ)* | `docs/khoa/evidence/ux-polish/after/input-menu-1440.png` |
| **Báo lỗi ngay cạnh trường cần sửa + Hoàn tác** | *(Chưa có Hoàn tác)* | `docs/khoa/evidence/ux-polish/after/inline-errors-1440.png` |
| **Ảnh tổng kỳ — Tổng quan (1440px)** | *(Chưa đồng bộ sang Báo cáo)* | `docs/khoa/evidence/ux-polish/after/summary-overview-1440.png` |
| **Ảnh tổng kỳ — Phân tích giải thích biểu đồ** | *(Chỉ báo chưa có dữ liệu)* | `docs/khoa/evidence/ux-polish/after/summary-analysis-1440.png` |
| **Ảnh tổng kỳ — Báo cáo & 4 định dạng xuất** | *(Chưa nhận `PeriodSummaryRecord`)* | `docs/khoa/evidence/ux-polish/after/summary-report-1440.png` |

---

## 6. Kết Quả Kiểm Thử Tự Động

1. `npm run typecheck`: **PASS** (0 lỗi TypeScript).
2. `npm test`: **15/15 PASS** (6 ca OCR/storage của Dũng + 8 ca tích hợp KPI/AI của Khoa & Lộc + 1 ca mới kiểm tra đồng bộ `PeriodSummaryRecord` giữa Dashboard, Server, Text, HTML).
3. `node scripts/verify-khoa-ux-polish.cjs`: **29/29 PASS** (kiểm tra responsive `1440px`/`834px`/`390px` không tràn ngang, gom menu nhập liệu, tách dữ liệu mẫu, phím `Escape`, hiển thị nguồn/kỳ/số ngày, Empty State, lỗi cạnh trường cần sửa, nút Hoàn tác, bố cục tab Báo cáo đưa 3 KPI chính lên đầu, thu gọn AI, nút Hủy chờ AI, cảnh báo báo cáo cũ sau khi đổi kỳ, và đồng bộ `PeriodSummaryRecord` trên Tổng quan + Phân tích + Text/HTML/PPTX/PDF).
4. `node docs/khoa/evidence/e2e.cjs docs/loc/evidence/regression`: **21/21 PASS**.
5. `node scripts/verify-loc-ui.cjs`: **8/8 PASS**.
6. `npm run build`: **PASS**.
