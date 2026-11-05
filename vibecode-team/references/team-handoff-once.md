**Gói giao việc một lần cho cả nhóm — Dashboard KPI Facebook Ads đề 7, bảng B**

Ngày 05/11/2026 (Asia/Saigon). Người dùng giao **một lần theo mảng trách nhiệm**; mỗi người theo mảng của mình từ chuẩn bị → code → kiểm thử → PR → sửa sau review. Không phải đợi cả ba làm xong rồi mới ghép, và không cần người dùng gửi một nhiệm vụ mới cho từng bước. Lịch 06–09/11: 4 giờ/người/ngày theo `delivery-plan.md`. Đây là gói giao việc; spec, thiết kế responsive và contract sẽ được chốt trong repo trước khi code các phần phụ thuộc.

**Thông điệp chung gửi cả ba người**

> Nhóm dùng **một GitHub repo chung**, mỗi người làm nhánh/PR nhỏ cho mảng mình, không làm ba app riêng. Đọc `product-strategy.md`, `delivery-plan.md`, `execution-plan.md` và gói này. Trước khi code phụ thuộc, cả nhóm thống nhất contract dữ liệu/KPI/snapshot và spec/thiết kế responsive được duyệt; khi tài liệu chuẩn được cập nhật trên nhánh chính thì tiếp tục cùng nhiệm vụ đã nhận, không cần chờ giao lại. Mỗi PR có bằng chứng chạy thật, giải thích lựa chọn và phần AI hỗ trợ; reviewer khác owner kiểm tra. Báo sớm phần không đạt, không tự cắt yêu cầu. Mã 9Router VPS sẽ được cấp sau, để trống cấu hình và không đưa secret lên GitHub.

**Thanh Dũng — chủ mảng dữ liệu, nhập và PDF**

- Làm trọn mảng: dữ liệu theo ngày, nhập tay nhiều dòng, Excel/CSV, text copy, ảnh trong phạm vi hỗ trợ; xem trước/sửa/xác nhận, tránh trùng, localStorage; một lớp tính CTR/CPC/chi phí mỗi đơn; PDF từ snapshot chung.
- Ngay khi nhận việc: chuẩn bị bộ dữ liệu đã ẩn thông tin (bình thường, thiếu/sai, biên), công thức và nghĩa trường; mở PR tài liệu để Lộc và Trịnh Khoa review. Sau khi contract/spec/design được duyệt, tiếp tục code trong cùng mảng.
- Bàn giao: PR nhỏ theo đường nhập tay/KPI trước, rồi từng nguồn nhập và PDF; dữ liệu mẫu và kết quả kỳ vọng; hướng dẫn thử; danh sách kiểu ảnh/file chưa hỗ trợ.
- Đạt khi: luồng nhập tay + localStorage + KPI đúng đề chạy; cùng bộ số tham chiếu cho kết quả chính xác; ảnh/file/text không tự lưu trường mơ hồ; PDF mở được và cùng kỳ/số với dashboard. Lộc review căn cứ AI, Trịnh Khoa review thao tác và PDF.

**Trịnh Khoa — chủ mảng UX, dashboard, text và PPTX**

- Làm trọn mảng: giao diện tối giản responsive; Tổng quan, Phân tích, Báo cáo dùng chung bộ lọc/KPI; biểu đồ reach/chi phí/đơn theo ngày; báo cáo text copy và PPTX từ cùng snapshot.
- Ngay khi nhận việc: phác luồng desktop/tablet/mobile và trạng thái rỗng/lỗi/chờ; đề xuất trường snapshot báo cáo, mở PR tài liệu cho Thanh Dũng và Lộc review. Sau khi thiết kế/spec được duyệt, tiếp tục code trong cùng mảng.
- Bàn giao: PR nhỏ cho khung UI/bộ lọc, KPI/biểu đồ, text, PPTX và responsive; ca dùng thử mobile/desktop; file PPTX mẫu mở được.
- Đạt khi: người mới tự nhập → đọc số → copy báo cáo được; ba góc nhìn cùng kỳ/số; nhãn/đơn vị rõ; text và PPTX cùng snapshot, chọn xuất trực tiếp không cần xuất định dạng khác trước. Thanh Dũng review đúng KPI, Lộc review tích hợp/AI trên UI.

**Lộc — chủ mảng AI, chatbot, HTML email và tích hợp**

- Làm trọn mảng: backend app gọi Codex qua 9Router hiện có trên VPS, Gemini API dự phòng; AI nhận xét và ba gợi ý có căn cứ; chatbot hỏi KPI/xu hướng/so sánh; HTML email xem trước/copy/tải; điều phối ghép PR, link online và hồ sơ nộp.
- Ngay khi nhận việc: kiểm tra quyền của ba người trên repo chung `dungnguyen170503-netizen/adpulse-mini-kpi`; đề xuất contract AI và checklist hosting/router, mở PR tài liệu để Thanh Dũng/Trịnh Khoa review. Cấu hình router để trống đến khi thầy cấp. Sau khi contract/spec/design được duyệt, tiếp tục code trong cùng mảng.
- Bàn giao: PR adapter/backend, AI gợi ý, chatbot, HTML email, cấu hình deploy mẫu không chứa khóa; bằng chứng thử thật khi có mã VPS; bảng kết quả tích hợp và link online.
- Đạt khi: ba gợi ý khác nhau có số căn cứ, giả thuyết/giới hạn, hành động và cách kiểm tra; chatbot nêu kỳ/căn cứ và hỏi lại khi thiếu tiêu chí; AI lỗi không chặn KPI/báo cáo cơ bản; HTML cùng snapshot; link online chạy trên thiết bị khác. Nếu mã VPS chưa có, ghi rõ chưa kiểm chứng AI thật, không đánh dấu hoàn thành giả.

**Cách dùng GitHub để ghép công việc**

1. Dùng **[adpulse-mini-kpi](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi)** làm repo chung; không tạo repo khác. Nhánh chính là `main`, baseline `f1774a105f416fd4c16b9438f70e415085d5399c`. Lộc kiểm tra quyền của ba người. Nhánh `feature/ban-c-ai-report` là phiên bản cũ, chỉ tham khảo; không tự gộp vào `main` vì có quy ước KPI/AI khác chiến lược đã duyệt.
2. Tài liệu contract/spec/design được review và đưa lên nhánh chính trước phần code phụ thuộc. Mỗi người kéo phiên bản mới nhất, tạo nhánh ngắn cho một phần, mở PR về nhánh chính. Không gửi ba thư mục/app độc lập để cuối cùng mới chép vào một chỗ.
3. Owner không tự merge PR của mình. Review bằng `assets/templates/pr-review-ai.md`: owner nêu hai quyết định và đánh đổi, kết quả thử thực tế, trường hợp lỗi/biên và phần AI hỗ trợ; reviewer hỏi lại để kiểm tra hiểu bài. PR chạm contract/KPI/snapshot cần người chịu ảnh hưởng cùng xem.
4. Lộc ghép các PR đã review thành bản online thử, nhưng Thanh Dũng kiểm số KPI và Trịnh Khoa kiểm luồng/UI/export; ba người cùng chạy ít nhất ba ca BTC và hỗ trợ hồ sơ nộp. Gặp lỗi phạm vi, ảnh, router hoặc định dạng báo cáo thì báo người dùng ngay.

**GitHub chứa gì và không chứa gì**

GitHub chứa **source code, tài liệu, thiết kế đã duyệt, cấu hình mẫu không có secret, dữ liệu thử đã ẩn thông tin và kết quả kiểm thử**. Dữ liệu người dùng nhập trong app lưu bằng **localStorage của trình duyệt**, không tự xuất hiện trên GitHub và không tự đồng bộ giữa máy. Không push mã truy cập 9Router, khóa Gemini, ảnh khách hàng thật hoặc thông tin riêng.

**Điểm dừng chất lượng**

Giao một lần không có nghĩa cả ba được tự chọn schema/công thức/giao diện riêng. Sau PR tài liệu đầu tiên, nhóm thống nhất contract; sau spec và thiết kế responsive được duyệt, các nhánh code tiếp tục theo gói đã giao. Nếu mốc 06/11 chưa đủ tài liệu để code phần phụ thuộc, Lộc ghi phần vướng và báo người dùng; không coi AI sinh code nhanh là bằng chứng các phần sẽ ghép đúng.
