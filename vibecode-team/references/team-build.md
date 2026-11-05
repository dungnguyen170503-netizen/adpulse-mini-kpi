**Phối hợp nhóm khi đi vào kế hoạch, GitHub và build**

Đọc cùng state và các tài liệu được duyệt. Các quy tắc dưới đây là cơ chế phối hợp đề xuất; chưa gán owner thật hoặc tạo repository. Không cần đọc tài liệu này ở mọi lần trao đổi chiến lược.

**Một bộ bối cảnh chuẩn**

Khi có repository, chọn một đường dẫn tài liệu dự án làm nguồn chuẩn và ghi vào `repository.canonical_context_path`. Bộ tài liệu có chiến lược, kế hoạch, plan thực thi, spec, thiết kế, định nghĩa chỉ số, hợp đồng giao tiếp giữa module và quyết định thay đổi. Dùng commit/tag/revision thực tế để nhận biết phiên bản; không chỉ dựa vào ngày sửa file.

Skill được cài trên máy mỗi người là bản đóng gói. Trong repo, tài liệu mới đã được duyệt có thể đi trước gói đó. Trước khi build, so sánh baseline; nếu khác contract, cập nhật bối cảnh trước khi sửa phần phụ thuộc. Không coi một ZIP là hệ thống đồng bộ thời gian thực.

**Phân vai**

Mỗi module có một owner chịu trách nhiệm cuối cùng và một reviewer khác. Phân công hiện tại: Lộc phụ trách AI/router/chatbot/HTML email và tích hợp; Thanh Dũng phụ trách nhập/KPI/PDF; Trịnh Khoa phụ trách UX/dashboard/text/PPTX. Ranh giới module và reviewer cụ thể sẽ ghi trong Plan thực thi sau khi có spec/contract; điều chỉnh khối lượng khi có thông tin thời gian hoặc độ khó thực tế.

Lộc theo dõi tích hợp/release; mỗi người vẫn phải hiểu luồng chung để trả lời hỏi đáp cuộc thi. GitHub là nơi đồng bộ code/tài liệu; không dùng GitHub để ngầm quyết định rằng người dùng app phải có tài khoản hoặc chia sẻ dữ liệu.

**Tránh xung đột logic trước xung đột Git**

- Một định nghĩa chuẩn cho tên chỉ số, đơn vị, loại kết quả, tiền tệ, ngày/kỳ, trạng thái thiếu dữ liệu và cách tổng hợp.
- Một bộ dữ liệu tham chiếu và kết quả kỳ vọng. UI, chatbot và export cùng dùng để đối chiếu.
- Contract chỉ rõ đầu vào, đầu ra, lỗi, phiên bản và người chịu trách nhiệm. Chưa cần áp một schema/API cụ thể trước khi lập spec.
- Thay đổi contract cần mô tả bên nào bị ảnh hưởng và cách chuyển đổi. Không sửa nghĩa của trường rồi giữ nguyên tên để phần khác tiếp tục chạy với hiểu lầm.
- Có owner cho thành phần UI dùng chung, công thức, schema/migration, dependency lockfile và cấu hình deploy. Ai cần thay phải phối hợp với owner; không “sửa tiện” ngoài module.
- Khi thật sự dùng Supabase, các thay đổi database đi qua lịch sử thay đổi chung và review; không để ba người tùy ý sửa cùng database chính từ dashboard.

**Giao module**

Dùng [mẫu phiếu module](../assets/templates/module-brief.md). Mỗi phiếu cần đủ: mục tiêu người dùng, phạm vi/ngoài phạm vi, owner/reviewer, spec/design/contract và baseline, phụ thuộc, vùng file chịu trách nhiệm, tiêu chí nghiệm thu, cách kiểm tra, đầu ra PR. Chưa đủ contract thì có thể chuẩn bị phần độc lập; không tự đoán để code phần phụ thuộc. [Hướng dẫn chia việc](team-assignment-guide.md) ghi KPI nghiệm thu cho ba gói hiện tại.

Không yêu cầu cả nhóm dùng cùng công cụ AI. Khi giao cho AI, gửi đúng phiếu module và tài liệu đã chốt. Không yêu cầu AI viết lại app hoặc sửa mọi nơi để làm xong một module.

**GitHub và review**

Một nhánh ngắn theo công việc, PR nhỏ, mô tả hành vi thay đổi và cách kiểm chứng. Nhánh tạo bằng Codex mặc định có tiền tố `codex/` trừ khi repo/người dùng có quy ước khác. Không dùng một nhánh lâu dài cho mỗi người rồi ghép toàn bộ ở cuối.

Trước merge, kiểm tra code và hành vi trên preview hoặc local phù hợp. Dùng [mẫu rà soát PR và AI](../assets/templates/pr-review-ai.md): owner tự giải thích lựa chọn, minh chứng chạy thật và phần AI hỗ trợ; reviewer hỏi và kiểm tra lại. Không dùng công cụ đo tỷ lệ code do AI viết để kết luận đóng góp. Ưu tiên kiểm chứng ranh giới: import → KPI, bộ lọc → AI, dữ liệu đã sửa → báo cáo, lỗi router → dự phòng. Không viết test chỉ để khớp cách code đang được viết. Cấu hình CODEOWNERS/branch protection/checks theo khả năng gói GitHub; nếu chưa có, thực hiện review thủ công và ghi nhận, không tuyên bố tự động enforce.

Tách môi trường thử với bản demo chính. Preview app không tự đồng nghĩa database riêng. Không đưa secret, token Codex, file ảnh có thông tin riêng hoặc dữ liệu khách hàng thật vào gói/public repo. Chỉ giữ ví dụ đã ẩn thông tin và cấu hình mẫu không chứa khóa.

**Tích hợp AI**

Owner phần AI tích hợp 9Router sẵn có và Gemini API. UI gọi backend của app. Bên dữ liệu cung cấp snapshot/metric chuẩn, bên AI không tự tạo bộ tính khác. Chỉ định một nơi quản lý retry/fallback để không nhân số lần gọi; giới hạn quota/ngân sách ở phạm vi được người dùng chốt. Nếu model chính không hỗ trợ tác vụ ảnh, ghi rõ và định tuyến tác vụ phù hợp sau kiểm chứng; không suy khả năng từ tên model.

9Router hiện có chạy trên VPS và thông tin truy cập sẽ được thầy cấp sau. Giữ cấu hình kết nối trống trong tài liệu và repo; khi đến bước tích hợp, kiểm tra từ backend online ở môi trường đích. Không sửa/cài lại 9Router nếu chưa có yêu cầu riêng.

**Định nghĩa hoàn thành module**

Hành vi đáp ứng spec và thiết kế đã chốt; dữ liệu/công thức đúng; trạng thái lỗi/rỗng/chờ được xử lý; kiểm tra phù hợp đã chạy có kết quả; thay đổi contract được phản ánh ở tài liệu; không ảnh hưởng phần khác không chủ đích; có reviewer và đầu ra bàn giao. “Đã viết code” hoặc “build thành công” riêng lẻ chưa đủ để coi tính năng hoàn tất.

Sau khi tích hợp, đối chiếu luồng đầu-cuối và bộ hồ sơ dự thi. Đóng băng bản nộp theo thể lệ thực tế; mọi thay đổi sau hạn cần được xem xét theo quy định BTC, không tự sửa tính năng bài đã nộp.
