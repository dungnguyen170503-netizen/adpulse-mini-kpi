**Bản rà soát cuối Plan chiến lược — 05/11/2026**

Trạng thái: **Plan chiến lược đã được người dùng chốt ngày 05/11/2026** sau khi rà soát từng nhóm; lời xác nhận cuối: “làm đi” đối với bản tổng kết này. Đây không phải Plan kế hoạch, spec, thiết kế hoặc lệnh build.

| Nhóm quyết định | Nội dung chiến lược đã duyệt |
|---|---|
| Người dùng và việc chính | Người trực tiếp chạy Facebook Ads trong nhóm marketing nhỏ nhập/cập nhật số, thấy biến động, kiểm tra việc cần làm và gửi báo cáo. Cấp trên/khách hàng/đồng nghiệp nhận bản tóm tắt có căn cứ; không bắt tài khoản riêng trong bản thi. |
| Giá trị và luồng | Trước mắt “nhập dễ, dễ hiểu, phần cơ bản”. Luồng: nhập → xem trước/sửa → KPI/xu hướng → xem căn cứ gợi ý → copy/xuất báo cáo. Website/inbox không phải lựa chọn bắt buộc. |
| Phạm vi | Làm đủ năm chức năng BTC trước; mở rộng song song khi khả thi và giữ mọi nhu cầu đã nêu trong danh mục. Nhập tay nhiều dòng bắt buộc; Excel/CSV và text copy sớm; ảnh chụp song song trong phạm vi đọc được, luôn cho xác nhận. Tổng quan/Phân tích/Báo cáo dùng chung dữ liệu và bộ lọc. |
| AI và chatbot | App tính KPI bằng logic xác định từ dữ liệu đã xác nhận. Backend gửi số liệu, phạm vi và điểm thiếu qua 9Router trên VPS đến Codex để phân tích xu hướng và đưa ba gợi ý có căn cứ/hành động/cách kiểm tra; Gemini API dự phòng. Chatbot cơ bản trả KPI, xu hướng, so sánh có kỳ/căn cứ và hỏi lại khi thiếu tiêu chí. |
| Báo cáo | Text để copy gửi Zalo và PDF được ưu tiên chất lượng. Khi dữ liệu đầy đủ, người dùng chọn trực tiếp text, PDF, HTML email (xem trước/copy/tải) hoặc PPTX tải về; cả bốn dùng cùng snapshot. Chưa tự gửi qua Zalo/email. Nếu định dạng nào gặp trở ngại, báo ngay lỗi, tác động và phương án; không tự xóa yêu cầu. |
| UX và đúng dữ liệu | Tối giản kiểu Apple, dễ hiểu, desktop/tablet/mobile; nhãn, đơn vị, trạng thái rõ. Không đổi thiếu thành 0, không suy ảnh tổng kỳ thành ngày, không để AI tự tạo KPI hoặc khẳng định nguyên nhân khi chưa đủ căn cứ. |
| Demo, dữ liệu và nhóm | Cần link online; dữ liệu lưu localStorage riêng trên từng trình duyệt, không cần dữ liệu dùng chung. Lộc: AI/router/chatbot/HTML email/tích hợp; Thanh Dũng: nhập/KPI/PDF; Trịnh Khoa: UX/dashboard/text/PPTX. Mỗi phần phải có bằng chứng chạy thật và reviewer kiểm tra khả năng giải thích, kể cả khi dùng AI. |

**Đã đối chiếu BTC ngày 05/11/2026**

Đề 7 yêu cầu năm chức năng: nhập nhiều dòng theo ngày và localStorage, biểu đồ reach/chi phí/đơn, CTR/CPC/chi phí mỗi đơn, AI nhận xét xu hướng và ba gợi ý, báo cáo text. Công thức do đội định nghĩa/công bố; không cần Meta Ads API. Bảng B tối thiểu ba ca kiểm tra; link online là lựa chọn của người dùng, BTC cũng cho phép chạy từ source. Hạn công khai: 23:59 ngày 09/11/2026 giờ Việt Nam. Nguồn: https://vibecoding.info.vn/de-bai ; https://vibecoding.info.vn/tieu-chi-cham-thi ; https://vibecoding.info.vn/bai-viet/yeu-cau-dau-ra-va-huong-dan-nop-bai-vibe-coding-2026 . Chưa kiểm tra thông báo riêng trong tài khoản đội thi.

**Chuyển sang Plan kế hoạch mới giải quyết**

- Chọn hosting cụ thể và kiểm chứng backend online gọi được 9Router VPS. Thầy sẽ cấp thông tin truy cập sau; giữ cấu hình trống, không cài lại router và không ghi mã vào repo/chat.
- Ước lượng khối lượng/thứ tự và mốc kiểm chứng khi chưa biết giờ tham gia thực tế; cân bằng lại việc nếu cần, không giả định thế mạnh từng người.
- Xác định dữ liệu thử đã ẩn thông tin, GitHub remote/quyền, độ sâu phần mở rộng ngoài bản cơ bản, ngân sách Gemini và xử lý nếu một định dạng không đạt trước hạn.
- Sau Plan kế hoạch còn phản biện kế hoạch, Plan thực thi, spec, thiết kế responsive, đóng gói/đồng bộ GitHub rồi mới giao module để build theo workflow.

**Bước kế tiếp:** Sau khi chốt chiến lược, người dùng đã cho tiếp tục; bản Plan kế hoạch và phản biện lần đầu nằm tại delivery-plan.md và delivery-plan-review.md. Việc chốt chiến lược không tự cho phép thiết kế hoặc build.
