**Hai vòng phản biện — mô phỏng các bên liên quan**

Ngày 04/11/2026. Đây là lập luận nhập vai dựa trên bối cảnh dự án, chưa phải phỏng vấn người thật. Mục tiêu là sửa chiến lược trước khi chuyển sang kế hoạch. Kết luận giám đốc sản phẩm là đề xuất để người dùng duyệt.

**Vòng 1 — App có giải quyết đúng công việc không?**

| Vai trò | Phản biện | Cải thiện đề xuất | Đánh đổi |
|---|---|---|---|
| Người trực tiếp chạy Ads | “Ads Manager đã có bảng và biểu đồ. Tôi có lý do gì để nhập thêm vào đây?” | Tập trung ba việc: gom dữ liệu đang có nhanh; chỉ ra mục cần chú ý; chuyển thành nhận xét/báo cáo dùng được ngay. Dùng một luồng tiếp nhận file/text/ảnh, ghi nhớ cách nhận cột trong phạm vi phù hợp. | Không cạnh tranh bằng số lượng biểu đồ hoặc tái tạo toàn bộ Ads Manager. |
| Người trực tiếp chạy Ads | “Muốn xem số mà phải khai ngành hàng, phễu, KPI và chốt đơn thì tôi bỏ.” | Cho nhập/xem ngay. Chỉ hỏi trường mơ hồ cần để tránh hiểu sai; mục tiêu và ngân sách bổ sung khi muốn đánh giá đạt/chưa đạt. | Chưa có mục tiêu thì chỉ mô tả xu hướng, chưa chấm tốt/xấu. |
| Người trực tiếp chạy Ads | “AI nói tối ưu target hoặc cải thiện content thì tôi vẫn phải tự nghĩ toàn bộ.” | Mỗi gợi ý gắn quan sát, giả thuyết, hành động nhỏ và cách kiểm tra. Có nút xem căn cứ. | Không hứa chẩn đoán chính xác nguyên nhân từ dữ liệu tổng hợp. |
| Cấp trên | “Nhiều số nhưng cuối cùng tôi phải quyết định gì?” | Tóm tắt mức chi, kết quả, so mục tiêu nếu có, điểm chưa chắc và quyết định cần duyệt. | Không đặt CTR cao ngang với kết quả kinh doanh khi mục tiêu là đơn hàng. |
| Khách hàng | “Số này khác báo cáo tuần trước; ai đảm bảo không chọn kỳ đẹp để báo cáo?” | Ghi kỳ so sánh, nguồn, thời điểm chốt dữ liệu và nội dung sửa sau đó. Báo cáo cũ giữ nguyên snapshot. | Không biến mỗi báo cáo thành dashboard thay đổi liên tục. |
| Đồng nghiệp content/design | “Tôi cần biết sửa phần nào và vì sao, không cần thêm một dashboard.” | Có thể copy một brief thử nghiệm từ gợi ý: mục tiêu, giả thuyết, phần thay đổi, cách đánh giá. | Chỉ tạo brief có căn cứ; không biến app thành công cụ tạo nội dung toàn diện. |
| Đồng nghiệp marketing | “Nếu thêm task, chat, duyệt việc thì đội lại phải quản lý thêm một công cụ.” | Ghi chú thay đổi/việc tiếp theo ở mức gọn; dùng copy để chuyển sang kênh làm việc hiện tại. | Chưa xây Kanban, lịch dự án hoặc chat nhóm riêng. |

**Bản điều chỉnh sau vòng 1**

Định vị thành dashboard hỗ trợ đọc số liệu và báo cáo, với người chạy Ads là người dùng chính. Tổng quan, Phân tích và Báo cáo dùng chung bộ lọc. AI là lớp trợ giúp có căn cứ; không bắt người dùng đi qua chatbot để sử dụng app. Dữ liệu có thể nhập ngay, bối cảnh thêm dần. Một quyết định luôn truy về được số liệu đã xác nhận.

**Vòng 2 — Thử bản đã sửa bằng tình huống khó**

| Tình huống và người chất vấn | Điểm bản điều chỉnh vẫn có thể thất bại | Quyết định sửa tiếp |
|---|---|---|
| Người chạy Ads dán lại file hôm qua nhưng Meta đã cập nhật số đơn | Chỉ chặn trùng sẽ bỏ mất bản cập nhật; cộng thêm sẽ nhân đôi chi phí | Phát hiện phần trùng và khác; cho chọn giữ/cập nhật dữ liệu cùng phạm vi. Không ghi đè âm thầm; có nguồn và lịch sử thay đổi. |
| Người chạy Ads đưa ảnh tổng bảy ngày, hoặc bảng chỉ chụp vài dòng | Đồ thị ngày và so sánh toàn chiến dịch có vẻ đúng nhưng thiếu cơ sở | Giữ đúng độ chi tiết và phần dữ liệu được chụp. Không tự tách tổng thành ngày, không coi các dòng nhìn thấy là toàn bộ tài khoản. |
| Cấp trên hỏi lúc 10 giờ sáng vì sao hôm nay kém hôm qua | So một ngày chưa kết thúc với một ngày đủ tạo cảnh báo sai | Mặc định ưu tiên kỳ đủ dữ liệu; đánh dấu kỳ chưa hoàn chỉnh và giải thích so sánh. |
| Người chạy Ads có chiến dịch A một đơn rất rẻ, chiến dịch B nhiều đơn ổn định | Xếp A “tốt nhất” theo CPA thấp dễ dẫn đến tăng tiền sai | Hiện số đơn đi kèm tỷ lệ, độ phủ ngày và khả năng so sánh. Không tự đề xuất tăng tiền chỉ vì một mẫu nhỏ. |
| Khách hàng gửi bảng “Results” là tin nhắn nhưng app gọi đó là đơn | CPO và báo cáo sai ý nghĩa ngay cả khi tính toán đúng | Yêu cầu xác nhận loại kết quả khi không rõ; giữ đơn hàng của đề là trường riêng, không tự đổi tin nhắn thành đơn. |
| Đồng nghiệp hỏi “tại sao bảo creative kém khi chưa có dữ liệu từng quảng cáo?” | AI đang biến tương quan cấp chiến dịch thành kết luận nguyên nhân | Gợi ý kiểm tra hoặc xin thêm dữ liệu; không gán lỗi cho content/target/website từ bốn cột. |
| Khách hàng mở PDF sau khi dữ liệu đã sửa | PDF cũ và dashboard mới bất đồng gây mất tin cậy | Mỗi báo cáo có phạm vi và phiên bản dữ liệu; có thể tái tạo bản đã gửi. |
| Người chạy Ads hỏi chatbot “chiến dịch nào tốt nhất?” | “Tốt nhất” thiếu mục tiêu; khác kết quả/nguồn dữ liệu không thể xếp chung | Hỏi ngắn tiêu chí hoặc dùng tiêu chí đã chọn và nói rõ. Chat mở đúng bảng chứng minh. |
| Trong demo, chính 9Router mất kết nối | Gemini nằm trong router cũng không cứu được | Backend có đường gọi Gemini độc lập, giới hạn thử lại; bảng và KPI vẫn hoạt động khi cả hai nguồn AI lỗi. |
| Cấp trên dùng app mà vô tình tiêu hết quota Codex cho công việc của chủ tài khoản | Mục tiêu tiết kiệm chi phí thất bại dù chưa trả tiền API | Có giới hạn tần suất, tái sử dụng kết quả theo phiên bản dữ liệu và phạm vi; có kiểm soát chi Gemini. Không hứa quota vô hạn. |
| Nhóm build UI, AI và export tách nhau | Cùng dữ liệu nhưng ba cách tính/ba kỳ lọc khác nhau | Một hợp đồng chỉ số và một lớp tính dùng chung; mọi đầu ra nhận cùng snapshot dữ liệu. |

**Kết luận của giám đốc sản phẩm**

Giữ bốn năng lực chính: nhập liệu có kiểm chứng, đọc số liệu nhanh, hỗ trợ hành động, báo cáo nhất quán. Chọn ít góc nhìn theo công việc. Đầu tư độ đúng và khả năng giải thích trước khả năng tùy biến. Bổ sung tính năng chỉ khi giảm thao tác hoặc giúp quyết định rõ hơn; trì hoãn các hệ thống nghiệp vụ riêng. Chưa cho AI trực tiếp sửa chiến dịch quảng cáo.

Chấp nhận một đánh đổi rõ: AI có thể nói “chưa đủ căn cứ” và chỉ dẫn kiểm tra. Một sản phẩm đáng tin vẫn có giá trị ngay khi AI không đưa ra được kết luận cuối cùng. Chuyển các quyết định này thành bản chiến lược tại product-strategy.md; chưa coi đó là phê duyệt của người dùng.
