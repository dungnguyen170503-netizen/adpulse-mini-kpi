# Giao việc để Dũng và Khoa bắt đầu

Ngày 05/11/2026. Repo chung: `https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi`. Tài liệu hiện ở nhánh `codex/plan-handoff`, chưa vào `main`. Mỗi người có 4 giờ/ngày trong 06–09/11. Đây là giao việc trọn gói; sau mỗi cổng review, tiếp tục phần mình mà không cần nhận nhiệm vụ mới.

## Cả hai làm trước

1. Clone repo bằng URL HTTPS **không gắn token**. Git sẽ hỏi tài khoản và PAT khi thao tác cần xác thực. Không chép PAT vào prompt AI, file, URL remote hoặc commit.
2. Chuyển sang nhánh tài liệu: `git fetch origin` rồi `git switch codex/plan-handoff` (nếu chưa có nhánh local: `git switch --track origin/codex/plan-handoff`). Đọc `vibecode-team/project-state.json`, `references/product-strategy.md`, `references/execution-plan.md`, `references/team-handoff-once.md`.
3. Chỉ lấy `main` làm đích PR sau khi nhánh tài liệu được review/merge. Nhánh `feature/ban-c-ai-report` là bản cũ để tham khảo, không gộp nguyên vào bài mới.
4. Bước đầu là **tài liệu contract và spec**, chưa tự xây hai app riêng hoặc code phần phụ thuộc khi contract, spec và thiết kế responsive chưa được duyệt. Ghi rõ giả định và câu hỏi cần chốt trong PR.
5. Mỗi người tạo nhánh riêng từ baseline mới nhất, commit phần mình, push nhánh, mở PR. PR ghi việc đã làm, cách thử, kết quả thực, ít nhất một ca lỗi/biên, hai quyết định tự giải thích được, phần AI đã hỗ trợ và phần tự kiểm tra. Dùng `assets/templates/pr-review-ai.md`.

## Thanh Dũng — dữ liệu, nhập liệu, KPI, PDF

### Thứ tự làm

1. **C1: Contract dữ liệu/KPI.** Viết từ điển trường: ngày, phạm vi chiến dịch, reach, click, chi phí, đơn, tiền tệ, nguồn/loại kết quả; phân biệt trống với 0. Chốt công thức CTR theo đề, CPC, chi phí/đơn, mẫu số 0, tổng nhiều ngày, reach không tự gọi là người duy nhất cả kỳ.
2. Tạo **3 bộ dữ liệu thử đã ẩn thông tin**: bình thường, thiếu/sai, biên (0 click/0 đơn, ngày trùng, tổng kỳ từ ảnh). Ghi số KPI kỳ vọng tính tay và lý do. PR tài liệu để Khoa và Lộc review. Cần thống nhất contract snapshot với Khoa trước khi code.
3. Sau khi spec/thiết kế được duyệt: nhập tay nhiều dòng → sửa/xác nhận → localStorage → một hàm tính KPI dùng chung. Chứng minh tải lại trang vẫn còn dữ liệu và dashboard/AI/báo cáo có thể dùng cùng kết quả.
4. Tiếp tục Excel/CSV và text copy: ánh xạ cột, bản xem trước, sửa chỗ mơ hồ, phát hiện trùng rồi mới lưu. Làm ảnh chụp theo khả năng đọc được: ảnh chỉ có tổng kỳ không biến thành các ngày giả; ghi rõ kiểu ảnh chưa hỗ trợ.
5. Xuất PDF **trực tiếp** từ snapshot báo cáo thống nhất, đối chiếu kỳ/số với dashboard. Mở file thật để kiểm tra chữ Việt, bố cục và số liệu.

**Nghiệm thu:** nhập tay và lưu lại chạy; KPI khớp 3 bộ tham chiếu; thiếu khác 0; nguồn nhập mơ hồ phải được sửa/xác nhận; PDF mở được và cùng kỳ/số. Khoa review thao tác/PDF; Lộc review dữ liệu dùng cho AI.

**Prompt bắt đầu cho Dũng (dán vào AI của bạn):**

> Tôi là Thanh Dũng, phụ trách dữ liệu, nhập liệu, lớp KPI chung và PDF cho dự án Dashboard KPI Facebook Ads đề 7 bảng B. Repo: https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi . Hãy đọc nhánh `codex/plan-handoff`, trước hết là `vibecode-team/project-state.json`, `references/product-strategy.md`, `references/execution-plan.md`, `references/team-handoff-once.md` và `references/workflow.md`. Đừng dùng nhánh code cũ làm chuẩn. Nhiệm vụ đầu tiên của tôi là C1: đề xuất từ điển dữ liệu, công thức KPI và 3 bộ dữ liệu thử có kết quả tính tay (bình thường, thiếu/sai, biên). Hãy hỏi tôi giải thích các quyết định nghiệp vụ, chỉ ra chỗ thiếu căn cứ, rồi giúp soạn tài liệu để mở PR cho Khoa và Lộc review. Sau khi contract/spec/thiết kế được duyệt, tiếp tục cùng gói việc theo thứ tự: nhập tay/localStorage/KPI, Excel/CSV, text copy, ảnh có xem trước/sửa, PDF từ snapshot chung. Mỗi phần phải có thử nghiệm thực tế và ca lỗi; không tự đánh dấu hoàn thành chỉ vì AI tạo code. Không đưa token vào prompt, code hoặc Git remote.

## Trịnh Khoa — UX, dashboard, text, PPTX

### Thứ tự làm

1. **C2/C4: Snapshot và luồng.** Đọc C1 của Dũng khi có; đề xuất một định nghĩa kỳ, bộ lọc và snapshot báo cáo cho dashboard, AI và cả bốn định dạng xuất. Ghi rõ dữ liệu thay đổi thì báo cáo cũ/đang xem ứng xử thế nào.
2. Phác luồng người mới: nhập → xem trước/sửa → Tổng quan/Phân tích/Báo cáo → xem căn cứ AI → chọn xuất. Thiết kế trạng thái chưa có dữ liệu, sai/thiếu, đang đọc file, AI chậm/lỗi. Trình bày desktop/tablet/mobile; nhãn, đơn vị, kỳ và nút sửa phải rõ. PR tài liệu để Dũng và Lộc review; cần người dùng duyệt thiết kế trước code phụ thuộc.
3. Sau cổng duyệt: làm khung UI/bộ lọc và ba góc nhìn dùng **KPI của Dũng**, không tự tính công thức khác. Biểu đồ reach/chi phí/đơn theo ngày, không vẽ thiếu thành 0.
4. Làm báo cáo text copy trực tiếp và PPTX tải trực tiếp từ cùng snapshot với PDF/HTML. Không bắt xuất text trước. Kiểm tra file PPTX mở thật, chữ Việt và số/kỳ khớp dashboard.
5. Thử trên desktop và mobile: người mới có tự nhập, đọc KPI, chọn định dạng, copy text được không? Ghi lỗi và chỉnh UI.

**Nghiệm thu:** ba góc nhìn cùng kỳ/bộ lọc/số; biểu đồ đúng dữ liệu; giao diện responsive dễ hiểu; text và PPTX xuất trực tiếp, cùng snapshot; có bằng chứng thử desktop/mobile. Dũng review KPI; Lộc review chỗ ghép AI và xuất báo cáo.

**Prompt bắt đầu cho Khoa (dán vào AI của bạn):**

> Tôi là Trịnh Khoa, phụ trách UX responsive, ba góc nhìn dashboard, báo cáo text và PPTX cho dự án Dashboard KPI Facebook Ads đề 7 bảng B. Repo: https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi . Hãy đọc nhánh `codex/plan-handoff`, trước hết là `vibecode-team/project-state.json`, `references/product-strategy.md`, `references/execution-plan.md`, `references/team-handoff-once.md` và `references/workflow.md`. Đừng dùng nhánh code cũ làm chuẩn. Nhiệm vụ đầu tiên của tôi là C2/C4: đề xuất contract kỳ/bộ lọc/snapshot báo cáo và luồng desktop/tablet/mobile, gồm trạng thái rỗng/lỗi/chờ/sửa. Hãy đối chiếu C1 của Dũng khi có, hỏi tôi giải thích lựa chọn UX, chỉ ra xung đột với dữ liệu và giúp soạn PR tài liệu để Dũng/Lộc review. Sau khi spec/thiết kế được người dùng duyệt, tiếp tục cùng gói việc: khung UI, ba góc nhìn và biểu đồ dùng KPI chung, text copy, PPTX tải về, kiểm thử desktop/mobile. Mỗi phần cần bằng chứng chạy thật và ca lỗi. Không tự tính KPI riêng; không đưa token vào prompt, code hoặc Git remote.

## Cần báo người điều phối ngay

- Contract C1 của Dũng và snapshot C2 của Khoa không khớp.
- Ảnh/file không đọc được, PDF/PPTX sai số hoặc không mở được, thời gian vượt 4 giờ/ngày.
- Tính năng có vẻ xong nhưng không có kết quả thử thật; AI gợi ý hoặc code mà người phụ trách không giải thích được.

Lộc điều phối ghép PR, nhưng không tự đổi contract của Dũng/Khoa. Người dùng duyệt spec và thiết kế chi tiết ở cổng workflow trước khi build phần phụ thuộc.
