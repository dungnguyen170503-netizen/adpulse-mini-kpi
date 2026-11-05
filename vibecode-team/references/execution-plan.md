**Plan thực thi chi tiết — bản phân gói để review**

Lập ngày 05/11/2026 (Asia/Saigon) sau Plan kế hoạch và phản biện lần đầu. Trạng thái: **đề xuất**, chưa có spec, thiết kế responsive hoặc Git baseline được chốt; chưa giao code. Nguồn: `product-strategy.md`, `delivery-plan.md`, `delivery-plan-review.md`. Người dùng xác nhận 4 giờ/người/ngày trong 06–09/11, tối đa 48 giờ công gộp. Các gói bên dưới là ranh giới giao việc; chưa thể gọi từng gói là vừa bốn giờ khi chưa có spec và phép thử.

**Cổng chung trước khi giao code phụ thuộc**

1. Chốt nghĩa các trường dữ liệu, đơn vị, loại kết quả, ngày/kỳ, công thức CTR/CPC/chi phí mỗi đơn, cách xử lý thiếu/0 và bộ số tham chiếu.
2. Chốt snapshot báo cáo với kỳ/bộ lọc/phiên bản dữ liệu và contract AI: đầu vào là KPI đã tính, đầu ra có căn cứ, lỗi/fallback rõ.
3. Chốt spec luồng nhập/sửa, ba góc nhìn, bốn định dạng xuất, chatbot cơ bản và trạng thái rỗng/lỗi/chờ; thiết kế desktop/tablet/mobile được người dùng duyệt theo workflow.
4. Có Git baseline và vùng sở hữu; mỗi phiếu module sau này điền đường dẫn file thật, owner/reviewer, contract version và ca thử. Chưa có repo thì không bịa tên file hay commit.

**Gói chuẩn bị/contract (làm trước phần phụ thuộc)**

| Mã | Owner → reviewer | Đầu ra và tiêu chí nghiệm thu | Phụ thuộc |
|---|---|---|---|
| C1 · Dữ liệu/KPI | Thanh Dũng → Lộc, Trịnh Khoa | Từ điển trường, công thức công bố, 3 bộ số bình thường/thiếu-sai/biên và kết quả kỳ vọng; giải thích reach tổng kỳ, kết quả không phải đơn, mẫu số 0 | Chiến lược/BTC |
| C2 · Snapshot/bộ lọc | Trịnh Khoa → Thanh Dũng, Lộc | Một định nghĩa kỳ/bộ lọc/snapshot dùng cho dashboard, AI, text/PDF/HTML/PPTX; chỉ rõ khi dữ liệu thay đổi thì báo cáo cũ giữ phiên bản nào | C1 |
| C3 · AI và online | Lộc → Thanh Dũng | Contract backend → 9Router VPS → Codex/Gemini, định dạng gợi ý và câu trả lời chatbot, lỗi/timeout; chỗ cấu hình trống, tiêu chí thử thật từ backend online | C1, C2; thông tin VPS đến sau |
| C4 · Luồng và thiết kế responsive | Trịnh Khoa → Thanh Dũng, Lộc | Spec thao tác và thiết kế ba kích thước cho nhập/sửa, ba góc nhìn, căn cứ AI, chọn bốn định dạng, trạng thái lỗi/rỗng/chờ; người dùng duyệt trước build | C1–C3 |

**Gói tính năng sau cổng spec/design**

| Mã | Owner → reviewer | Vùng trách nhiệm dự kiến; hoàn thành khi | Phụ thuộc |
|---|---|---|---|
| D1 · Nhập tay/lưu | Thanh Dũng → Trịnh Khoa | Nhập nhiều dòng theo ngày, sửa/hoàn tác, lưu/đọc lại localStorage; thử dữ liệu đúng, thiếu/sai và biên | C1, C4 |
| D2 · File và text copy | Thanh Dũng → Lộc | Excel/CSV và text tạo bản nháp có ánh xạ cột, xem trước/sửa/trùng trước khi xác nhận; ghi trường hợp không hỗ trợ | C1, D1 |
| D3 · Ảnh chụp | Thanh Dũng → Lộc | Ảnh trong phạm vi hỗ trợ tạo bản nháp, phân biệt tổng kỳ với dòng ngày, có xem trước/sửa; loại ảnh chưa hỗ trợ ghi rõ | C1, D1; khả năng đọc ảnh cần thử |
| K1 · Lớp KPI | Thanh Dũng → Lộc | CTR/CPC/chi phí mỗi đơn khớp bộ tham chiếu; thiếu/0 và kỳ được xử lý nhất quán; chỉ có một nơi tính | C1, D1 |
| K2 · Biểu đồ | Trịnh Khoa → Thanh Dũng | Reach/chi phí/đơn theo ngày, nhãn/đơn vị/kỳ rõ, không tô thiếu thành 0; đọc số từ K1, không tính KPI riêng | C4, K1 |
| U1 · Ba góc nhìn | Trịnh Khoa → Thanh Dũng | Tổng quan/Phân tích/Báo cáo dùng cùng bộ lọc/snapshot; responsive và trạng thái rỗng/lỗi/chờ; người mới hoàn thành luồng cơ bản | C2, C4, K1, K2 |
| A1 · Nhận xét và 3 gợi ý | Lộc → Thanh Dũng | Backend gọi nguồn AI thực khi có cấu hình; ba gợi ý khác nhau có số căn cứ, giới hạn, hành động, cách kiểm tra; lỗi AI không chặn KPI | C3, K1; 9Router VPS/Gemini thật khi nghiệm thu |
| A2 · Chatbot cơ bản | Lộc → Trịnh Khoa | Hỏi KPI/xu hướng/so sánh trên snapshot, nêu kỳ/căn cứ, hỏi lại khi thiếu tiêu chí; không mở dữ liệu khác | C2, C3, K1, U1 |
| R1 · Text | Trịnh Khoa → Thanh Dũng | Chọn xuất trực tiếp, copy được; kỳ/số/ghi chú khớp snapshot | C2, U1 |
| R2 · PDF | Thanh Dũng → Trịnh Khoa | Chọn xuất trực tiếp, file mở/đọc được; kỳ/số/ghi chú khớp snapshot | C2, U1 |
| R3 · HTML email | Lộc → Trịnh Khoa | Xem trước/copy/tải được; kỳ/số/ghi chú khớp snapshot, không cần xuất text trước | C2, U1 |
| R4 · PPTX | Trịnh Khoa → Lộc | Tải và mở được; kỳ/số/ghi chú khớp snapshot, không cần xuất text trước | C2, U1 |
| O1 · Online/tích hợp | Lộc → Thanh Dũng, Trịnh Khoa | Link online mở trên thiết bị khác; localStorage hoạt động riêng; từ môi trường online thử 9Router VPS khi có mã, fallback minh bạch; không có secret trong repo | D1–R4; hosting được chọn theo phép thử |
| Q1 · Kiểm thử/hồ sơ | Lộc điều phối; cả ba tạo minh chứng và review chéo | Tối thiểu 3 ca BTC có kết quả thực; đối chiếu cùng snapshot ở AI/dashboard/bốn đầu ra; README/source ZIP/video ≤2 phút/minh chứng AI ≤1 trang và ≤5 ảnh; kiểm tra link và quyền truy cập trước nộp | Các gói liên quan, O1 |

**Kiểm soát việc dùng AI và review**

Mỗi gói khi được phát thành phiếu module phải dùng `assets/templates/module-brief.md`; mỗi PR dùng `assets/templates/pr-review-ai.md`. Owner giải thích hai lựa chọn và đánh đổi, chỉ ra AI hỗ trợ phần nào và mình đã kiểm tra/sửa gì; có kết quả chạy thật và ít nhất một ca lỗi/biên. Reviewer khác owner hỏi lại dữ liệu, phụ thuộc và lỗi. Không giải thích được hoặc không có bằng chứng thực tế thì trả lại, không merge chỉ vì AI báo hoàn tất.

**Ranh giới thời gian và xử lý khi không đạt**

Các gói C1–C4 là cổng trước code phụ thuộc. Với tối đa 48 giờ công gộp, toàn bộ D1–Q1 có nguy cơ vượt năng lực; không tự nhận là khả thi chỉ vì đã chia người. Theo Plan kế hoạch, cuối 07/11 phải có luồng BTC trên bản thử, cuối 08/11 phải có kết quả thử riêng cho bốn nguồn nhập/bốn định dạng và trạng thái AI. Khi không đạt, Lộc báo người dùng mục chưa đạt, bằng chứng, tác động và lựa chọn thêm sức người/thời gian hoặc điều chỉnh phạm vi; không âm thầm bỏ yêu cầu. Bản thử dùng phản hồi giả lập không chứng minh AI thật đã tích hợp.

**Điều kiện để biến bản này thành phiếu giao build**

Spec và thiết kế responsive đã được duyệt; contract C1–C3 có phiên bản; GitHub remote/baseline và owner vùng dùng chung có thật; hosting/đường test online có phương án; bộ số tham chiếu có kết quả kỳ vọng; mỗi gói được chia nhỏ theo thời gian còn lại và có reviewer. Sau đó cập nhật/đóng gói Vibecode-Team cùng revision theo workflow rồi mới phát phiếu module. Bản này chưa cho phép tự khởi động build.
