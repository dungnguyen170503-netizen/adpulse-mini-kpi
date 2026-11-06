# C4b · Spec màn hình và brief thiết kế (Trịnh Khoa)

Trạng thái: **bản nháp chờ duyệt**. Thiết kế làm trên Stitch; đây là mockup, không phải app chạy thật. Dữ liệu trong thiết kế là số minh họa.

## 1. Danh sách màn hình (mỗi màn có desktop / tablet / mobile)

| # | Màn hình | Câu hỏi nó trả lời | Hành động chính | Dữ liệu từ |
|---|---|---|---|---|
| S1 | Trống | Tôi bắt đầu thế nào? | Nhập số liệu / Dùng dữ liệu mẫu | – |
| S2 | Nhập nhiều dòng | Tôi nhập số liệu từng ngày ở đâu? | Thêm dòng, Lưu | Dũng (D1) |
| S3 | Xem trước + dữ liệu lỗi/thiếu | Dòng nào sai, sửa thế nào? | Sửa tại ô, Xác nhận, Hoàn tác | Dũng |
| S4 | Đang xử lý | App đang làm gì, mất bao lâu? | Hủy | – |
| S5 | Tổng quan | Kết quả kỳ này ra sao? | Đổi kỳ | snapshot.kpi |
| S6 | Phân tích | Xu hướng theo ngày thế nào? | Đọc biểu đồ + bảng | snapshot.daily |
| S7 | Gợi ý AI + căn cứ | AI khuyên gì, dựa trên số nào? | Xem căn cứ | snapshot.ai |
| S8 | AI lỗi | KPI còn dùng được không? | Thử lại | snapshot.ai.status |
| S9 | Báo cáo | Gửi sếp bằng cách nào? | Copy text, Tải PPTX, (PDF, HTML email) | snapshot |

## 2. Nguyên tắc thiết kế
- Tối giản kiểu Apple: nhiều khoảng trắng, chữ/số là chính, một nút chính mỗi màn.
- Nhãn, đơn vị, kỳ luôn hiện (ví dụ "Chi phí (VND)", "Kỳ 01/11–07/11").
- Tăng/giảm: mũi tên + chữ + màu. Tăng chi phí là xấu, tăng đơn là tốt, không dùng cùng một màu cho mọi "tăng".
- Ngày thiếu hiển thị rỗng/đứt đoạn trên biểu đồ, không vẽ về 0.
- Dữ liệu mẫu có nhãn "Dữ liệu mẫu" rõ ràng.
- Mobile: tab dưới (Tổng quan | Phân tích | Báo cáo), nút Copy cố định.

## 3. Prompt Stitch (dán từng cái)

**Prompt chung (dán đầu tiên để cố định phong cách):**
> Design a clean, minimal, Apple-like responsive web dashboard "AdPulse" for a Vietnamese marketer tracking Facebook Ads daily. UI language: Vietnamese. Light theme, generous whitespace, one accent color (blue), large readable numbers, system sans-serif font. Always show labels, units and the date range. Create desktop (1440), tablet (834) and mobile (390) versions.

**S1:** > Empty state screen. Headline "Chưa có số liệu". Primary button "Nhập số liệu", secondary "Dùng dữ liệu mẫu". Short hint under it.

**S2:** > Data entry screen: editable table with columns Ngày, Reach, Click, Chi phí (VND), Số đơn. Button "Thêm dòng", "Hoàn tác", primary "Lưu". Mobile: each row as a card.

**S3:** > Same table in preview state with 2 rows showing errors: a missing value (empty cell with orange outline and text "Thiếu số đơn") and a duplicate date warning. Inline edit, buttons "Xác nhận" and "Hoàn tác". Errors must not rely only on color.

**S4:** > Processing state: progress bar with text "Đang đọc file… 60%" and a Cancel button; below it a skeleton of the dashboard.

**S5:** > Overview tab. Top: tabs Tổng quan | Phân tích | Báo cáo and a period filter "01/11–07/11/2026 (6/7 ngày có dữ liệu)". Seven KPI cards: Reach, Click, Chi phí, Đơn, CTR, CPC, Chi phí/đơn, each with unit and trend arrow plus text vs previous period. One card shows "Không tính được – 0 click".

**S6:** > Analysis tab. Three charts by day: Reach (line), Chi phí (bar), Số đơn (bar). A missing day shows a gap, not zero. Detail table below with the same dates.

**S7:** > AI panel: a trend summary and exactly 3 suggestion cards, each with sections Quan sát (with numbers), Giới hạn, Việc làm tiếp, Cách kiểm tra. Badge showing the source of the analysis.

**S8:** > AI error state: KPI and charts remain visible; the suggestion area shows "Không lấy được gợi ý AI" with a "Thử lại" button, noting that KPI is not affected.

**S9:** > Report tab: four format options (Text, PDF, HTML email, PPTX) as cards, a text preview with a "Sao chép" button, a "Tải PPTX" button, footer "Snapshot lúc 15:30 08/11". A banner variant "Dữ liệu đã thay đổi – Cập nhật báo cáo".

## 4. Cần duyệt
1. Bộ 9 màn × 3 kích thước đủ chưa (người duyệt: thầy/nhóm).
2. Breakpoint chính thức: đề xuất 390 / 834 / 1440, chốt theo Stitch.
3. Thứ tự tab: Tổng quan → Phân tích → Báo cáo.
