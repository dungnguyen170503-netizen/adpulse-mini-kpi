**Bối cảnh dự án — cập nhật 05/11/2026 (Asia/Saigon)**

**Đã được người dùng xác nhận**

- Nhóm Lộc, Thanh Dũng, Trịnh Khoa tham gia VIBE-CODING 2026, đề 7, bảng B – Kinh tế.
- Sản phẩm là dashboard quảng cáo Facebook Ads. Không mở rộng thành hệ thống bán hàng, CRM hoặc buộc chọn kênh chốt đơn để tiếp tục.
- Muốn nhập liệu dễ bằng ảnh chụp, Excel, text copy từ Ads và nhập tay; nhiều góc nhìn dashboard; AI đưa hành động cụ thể; chatbot tra cứu; báo cáo text/Zalo, PDF, HTML email, slide.
- Đây là các nhu cầu mong muốn. Thứ tự ưu tiên và phần nào có trong bản thi vẫn là đề xuất cần duyệt, không mặc định đã cắt bỏ các định dạng người dùng yêu cầu.
- UI/UX hiện đại, tối giản kiểu Apple; người mới hiểu cách dùng mà không cần đọc hướng dẫn; thiết kế chi tiết phải responsive.
- GitHub là công cụ phối hợp dự kiến. Vercel/Supabase/Cloudflare là các lựa chọn đã nêu, chưa chốt toàn bộ stack.
- 9Router đã cài sẵn, sẵn sàng dùng. App chỉ cần kết nối: Codex là nguồn ưu tiên để tận dụng tài khoản hiện có, Gemini API dự phòng. Không xây hoặc triển khai lại 9Router.
- Chốt chiến lược rồi mới đi xuống kế hoạch; hoàn thiện spec và thiết kế trước khi build. Workflow mới nhất nằm trong workflow.md.
- Skill tên hiển thị Vibecode-Team, mã gọi vibecode-team; sẽ cập nhật và đóng gói lại trước khi gửi cho thành viên cùng build.
- Người dùng đã duyệt: người trực tiếp chạy Ads là người dùng chính; ưu tiên giá trị trước mắt là nhập dễ, dễ hiểu và phần cơ bản. Luồng chính gồm nhập, xem trước/sửa, xem KPI/xu hướng, kiểm tra căn cứ gợi ý và copy báo cáo.
- Người dùng đã duyệt nguyên tắc UX/dữ liệu/AI trong product-strategy.md; hoàn chỉnh năm yêu cầu BTC trước nhưng vẫn thực hiện mở rộng song song khi khả thi. Phải giữ toàn bộ nhu cầu mở rộng trong danh mục và ghi rõ cho người dùng phần còn thiếu. Mức ưu tiên cụ thể của mỗi phần mở rộng chưa được duyệt.
- Người dùng đã duyệt thứ tự nhập: nhập tay nhiều dòng bắt buộc; Excel/CSV và text copy làm sớm; ảnh chụp làm song song trong phạm vi đọc được, có xem trước và sửa trước khi lưu. Ba góc nhìn Tổng quan, Phân tích, Báo cáo dùng chung dữ liệu/bộ lọc; bản cơ bản tập trung KPI và biểu đồ đúng đề, so sánh sâu để sau.
- Người dùng ưu tiên báo cáo text và PDF nhưng muốn khi nhập dữ liệu đầy đủ có thể chọn xuất text, PDF, HTML email hoặc slide, không cần xuất text trước. Đã duyệt dùng cùng snapshot báo cáo; slide là PPTX tải về, HTML email xem trước/copy/tải, chưa tự gửi Zalo/email. Nếu có trở ngại phải báo ngay và đề xuất phương án.
- Đã duyệt đường AI: dữ liệu app đã được người dùng xác nhận và KPI tính chung được backend gửi qua 9Router hiện có tới Codex để lấy phân tích/gợi ý có căn cứ, Gemini API dự phòng. Cuộc trò chuyện Codex này không tự nhận dữ liệu app. Endpoint/model/quota và khả năng truy cập từ nơi deploy chưa được kiểm chứng.
- Phân công hiện tại: Lộc phụ trách AI/router/chatbot/HTML email và tích hợp; Thanh Dũng phụ trách nhập/KPI/PDF; Trịnh Khoa phụ trách UX/dashboard/text/PPTX. Người dùng muốn ghi phân công bình thường; khi có thông tin mới sẽ cập nhật. Mỗi người có 4 giờ/ngày trong 06–09/11; thế mạnh cá nhân chưa rõ.
- Người dùng đã duyệt chatbot bản cơ bản: hỏi KPI, xu hướng và so sánh trên dữ liệu đã xác nhận; trả lời có kỳ/bộ lọc và số liệu căn cứ, hỏi lại ngắn nếu thiếu tiêu chí. Độ sâu ngoài phạm vi này chưa chốt.
- Người dùng chọn link online cho bản thi; dữ liệu chỉ cần localStorage riêng trên trình duyệt, không cần chia sẻ giữa nhiều người. Đã kiểm tra lại đề 7 ngày 05/11: localStorage là đúng yêu cầu BTC; link online là lựa chọn của người dùng, BTC cho phép online hoặc chạy từ source.
- 9Router hiện có chạy trên VPS; thầy sẽ cấp thông tin truy cập sau. App chỉ tích hợp, giữ cấu hình mẫu trống cho đến khi được cấp, rồi kiểm thử từ backend online. Không coi endpoint/model/quota đã được xác nhận.
- Plan chiến lược được người dùng chốt ngày 05/11/2026 sau bản tổng kết cuối trong strategy-final-review.md. Người dùng đã cho tiếp tục; Plan kế hoạch và phản biện lần đầu đã soạn ở delivery-plan.md và delivery-plan-review.md, Plan thực thi có bản phân gói dự thảo tại execution-plan.md. Rủi ro sức người/hosting/VPS còn mở; chưa có spec, thiết kế hoặc build.
- Người dùng cung cấp hai repo; sau khi kiểm tra, chọn [adpulse-mini-kpi](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi) làm repo chung, `main` tại commit `f1774a105f416fd4c16b9438f70e415085d5399c` là baseline mới. [APP-ADS](https://github.com/dungnguyen170503-netizen/APP-ADS) không được chọn để tránh hai nguồn chuẩn. `main` hiện chỉ có README. Nhánh `feature/ban-c-ai-report` chứa app/spec cũ không khớp một số quyết định đã duyệt, chỉ tham khảo. GitHub connector hiện báo `pull=true`, `push=false`; cần kiểm tra quyền ghi trước khi đồng bộ tài liệu.

**Ràng buộc cuộc thi đã đọc, cần kiểm tra lại khi lên lịch**

Đề yêu cầu nhập nhiều dòng theo ngày gồm reach, click, chi phí, đơn hàng, lưu localStorage; biểu đồ reach/chi phí/đơn; tính CTR/CPC/chi phí mỗi đơn; AI nhận xét xu hướng và ba gợi ý; xuất text. Không bắt buộc API quảng cáo. Công thức phải công bố. [Bộ đề](https://vibecoding.info.vn/de-bai)

Bảng B có các trọng số: chức năng 30, giá trị sử dụng 15, dùng AI để cải thiện 20, đúng nghiệp vụ 15, UX 10, kiểm thử 5, bàn giao 5. AI thật hoặc mock minh bạch đều được đánh giá theo chuẩn B. Backend phức tạp không phải yêu cầu. [Tiêu chí](https://vibecoding.info.vn/tieu-chi-cham-thi)

Hồ sơ gồm source ZIP/README, video tối đa hai phút, minh chứng AI tối đa một trang kèm tối đa năm ảnh/đoạn hội thoại; bảng B ít nhất ba ca kiểm tra. Không sửa tính năng sau hạn nộp. [Hướng dẫn nộp](https://vibecoding.info.vn/bai-viet/yeu-cau-dau-ra-va-huong-dan-nop-bai-vibe-coding-2026)

Hạn công khai đối chiếu lại ngày 05/11: 23:59 ngày 09/11/2026 giờ Việt Nam. Chưa xác minh thông báo riêng hoặc trạng thái xác thực của đội trong cổng đăng nhập. [Hướng dẫn nộp](https://vibecoding.info.vn/bai-viet/yeu-cau-dau-ra-va-huong-dan-nop-bai-vibe-coding-2026), [Tiêu chí](https://vibecoding.info.vn/tieu-chi-cham-thi)

**Nghiên cứu và giới hạn của bằng chứng**

Khảo sát AgencyAnalytics 2026 gồm 494 người làm agency, chủ yếu ở các thị trường nói tiếng Anh: đội nội bộ thiên về dashboard, khách hàng cần giải thích và báo cáo rõ. Dùng làm định hướng, không coi là khảo sát người chạy Ads Việt Nam. [Nguồn khảo sát](https://agencyanalytics.com/agency-benchmarks-2026)

Các lượt nhập vai của skill là mô phỏng phản biện. Chưa có phỏng vấn người dùng thật, đo thời gian sử dụng thật, benchmark OCR hoặc kiểm thử tài khoản 9Router.

**Chưa biết; không được tự khẳng định**

Thế mạnh cá nhân; ngành hàng; dữ liệu thực tế; quyền ghi repo của nhóm; hosting cuối cùng; thông tin truy cập/endpoint/model/khả năng đọc ảnh qua 9Router VPS; hạn mức tài khoản; ngân sách Gemini; độ sâu chatbot ngoài bản cơ bản. Không yêu cầu bí mật truy cập trong chat: về sau dùng cấu hình server hoặc kênh nhập secret được công cụ hỗ trợ.

**Nguồn kỹ thuật để tra lại khi tới bước thực hiện**

- [9Router](https://github.com/decolua/9router): tham khảo cách gọi gateway hiện có. Không lấy các tuyên bố “unlimited/free” làm cam kết cho tài khoản người dùng.
- [Gemini API](https://ai.google.dev/gemini-api/docs/openai): kiểm tra API, ảnh và đầu ra cấu trúc theo model thực sự dùng.
- [Codex authentication](https://learn.chatgpt.com/docs/auth): quyền truy cập gói và API cần được phân biệt; không mặc định quota vô hạn.
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners): khả năng áp dụng tùy gói và loại repo.
- [Vercel GitHub](https://vercel.com/docs/git/vercel-for-github), [Cloudflare preview](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Supabase deployment](https://supabase.com/docs/guides/deployment): kiểm tra điều kiện sử dụng khi chốt stack.

Skill không pin model, giá, phiên bản thư viện hoặc quota từ các trang này. Tra tài liệu hiện hành khi thực sự chọn hoặc tích hợp.
