# Thiết kế UI/UX (Stitch) — ghi chú review (Trịnh Khoa)

Trạng thái: **mockup chờ duyệt**. Đây là thiết kế, không phải app chạy thật. Ảnh trong thư mục `design/`, phong cách trong `design/DESIGN.md`.

## Ảnh đã có

| Màn | Desktop | Tablet | Mobile |
|---|---|---|---|
| S1 Trống | ✔ | – | ✔ |
| S2 Nhập nhiều dòng | ✔ | – | ✔ |
| S3 Xem trước + lỗi/thiếu | ✔ | – | ✔ |
| S4 Đang xử lý | ✔ | – | – |
| S5 Tổng quan | ✔ | ✔ | ✔ |
| S6 Phân tích | ✔ | – | – |
| S7 Gợi ý AI | ✔ | – | – |
| S8 AI lỗi | ✔ | – | – |
| S9 Báo cáo | ✔ | – | – |

## Phần chưa đạt
- Thiếu tablet cho S1–S4, S6–S9 và mobile cho S4, S6–S9 (hết thời gian). Bố cục các kích thước này sẽ suy ra từ quy tắc trong `user-flow.md` mục 4 và cần duyệt lại khi code.
- Ảnh S5 desktop trong thư mục là bản xuất trước khi chỉnh số; bản Stitch hiện tại đã sửa số nhưng chưa xuất lại.

## Số liệu trong mockup
Toàn bộ số là **số minh họa do Stitch sinh ra**, chưa đồng nhất giữa các màn (ví dụ Tổng quan 342 đơn, Phân tích 302 đơn; thẻ chi phí/đơn ở Tổng quan ghi "không tính được – 0 click" dù có click). Khi code, mọi màn đọc cùng một snapshot (`report-snapshot-contract.md`) nên không có số riêng.

## Phần Stitch tự thêm — **không làm**
ROAS, đồng bộ Meta API/Graph API, Pixel, Top 3 chiến dịch, creative dẫn đầu, mục tiêu/ngân sách, tên cửa hàng và ID tài khoản, nút xuất XLSX/Excel, dòng mã hóa AES/tên node, Slack/Telegram, lịch sử xuất báo cáo, tùy chỉnh cột. Các mục này ngoài contract và phạm vi đã duyệt; đề xuất hành động kiểu "Tăng 15% ngân sách" thay bằng gợi ý có căn cứ và cách kiểm tra.

## Phần giữ lại (khớp spec)
- Ngày thiếu hiện khoảng trống, không vẽ 0 (S6).
- Ghi chú "Reach là tổng các ngày, không phải người duy nhất cả kỳ" (S5).
- AI lỗi vẫn giữ KPI và biểu đồ, có nút thử lại và nhãn quy tắc thủ công (S8).
- Bốn định dạng xuất Text/PDF/HTML email/PPTX, nút Sao chép, Tải PPTX, snapshot ở chân trang (S9).
- Mobile có tab dưới, thẻ xếp dọc.

## Lỗi giao diện đã biết
Logo ảnh bị lỗi ở nhiều màn; nhãn ngày bị đè ở biểu đồ Tổng quan. Sẽ dùng logo chữ khi code.
