**Workflow của Vibecode-Team**

Đây là trình tự người dùng yêu cầu. Phân biệt ba cấp độ: chiến lược quyết định làm gì/cho ai/vì sao; kế hoạch quyết định ưu tiên/phụ thuộc/nguồn lực; thực thi chi tiết xác định các gói việc có thể giao và nghiệm thu. Không gộp cả ba khi người dùng chỉ đang duyệt cấp đầu.

**Các giai đoạn và đầu ra**

| Bước | Đầu ra cần có | Điều kiện chuyển tiếp |
|---|---|---|
| 1. Plan chiến lược | Người dùng ưu tiên, vấn đề, định vị, kết quả mong muốn, phạm vi, nguyên tắc UX/AI/dữ liệu, đánh đổi | Đủ cụ thể để phản biện, chưa cần task code/schema |
| 2. Phản biện chiến lược | Hai vòng trong yêu cầu hiện tại: quan điểm các bên → bản điều chỉnh → stress-test → quyết định sản phẩm | Bản chiến lược đã sửa; người dùng chấp nhận hoặc chỉ đạo rõ sang kế hoạch |
| 3. Plan kế hoạch | Các luồng công việc, thứ tự/phụ thuộc, sức người, mốc kiểm chứng, phạm vi bản thi/mở rộng, phân vai đề xuất | Có cơ sở thời gian, tài nguyên; không giả số giờ hay năng lực thành viên |
| 4. Phản biện kế hoạch | Kiểm tra khả thi, điểm nghẽn, đường phụ thuộc, khối lượng AI/UI/dữ liệu, khả năng tích hợp/demo, phương án giảm phạm vi | Các rủi ro lớn có cách xử lý; số vòng theo yêu cầu, không tự áp hai vòng cho mọi lần sửa |
| 5. Plan thực thi chi tiết | Gói việc nhỏ, phụ thuộc, owner/reviewer dự kiến, file/phần mềm chịu tác động, tiêu chí nghiệm thu, cách kiểm tra | Các gói việc có ranh giới; không bắt đầu code ứng dụng chỉ vì task đã được liệt kê |
| 6. Spec tính năng và UI | Luồng, đầu vào/ra, validation, ý nghĩa chỉ số, bộ lọc, quyền, trạng thái, AI/fallback, export, yêu cầu responsive và accessibility | Có thể truy từ yêu cầu sang hành vi và tiêu chí nghiệm thu; cập nhật lại plan thực thi khi spec thay đổi |
| 7. Mẫu tham khảo, nếu cần | Một vài mẫu phù hợp với dashboard, giải thích chọn phần nào, nguồn và điều chỉnh | Người dùng xác định hướng thiết kế; bước này tùy chọn, không kéo dài tìm mẫu |
| 8. Thiết kế chi tiết responsive | Design system, màn hình và trạng thái theo spec, quy tắc desktop/tablet/mobile, thành phần dùng lại, bản mẫu xem được nếu môi trường hỗ trợ | Người dùng chốt thiết kế. Mockup/prototype phải được gọi đúng là thiết kế, không giả backend hoạt động |
| 9. Đóng gói và đồng bộ GitHub | Bộ plan/spec/design/context có phiên bản thống nhất, repo baseline, hợp đồng dữ liệu/API và quy tắc nhóm | Thực hiện nhắc cập nhật skill; kiểm tra remote/quyền thao tác trước khi push theo phạm vi người dùng giao |
| 10. Chia module và build | Phiếu module, owner/reviewer, branch/PR, kiểm tra và tích hợp theo phụ thuộc | Cùng baseline; phần chưa chốt phải được cô lập hoặc giải quyết trước khi code phụ thuộc |

Đầu ra các bước sau có thể làm lộ thiếu sót của bước trước. Cập nhật có dấu vết; không âm thầm thay chiến lược hoặc contract. Phê duyệt một bước không đồng nghĩa duyệt mọi đề xuất phụ; ghi đúng phần được duyệt. Khi người dùng đã nói “tiếp tục sang bước kế tiếp”, không xin lại một câu xác nhận hình thức.

**Cách phản biện có ích**

Với mỗi góc nhìn, nêu công việc họ cần làm, câu phản biện cụ thể, tình huống chứng minh, hậu quả, cải thiện và chi phí đánh đổi. Người chạy Ads được ưu tiên vì là người thao tác hằng ngày. Cấp trên/khách hàng đánh giá khả năng ra quyết định và tin cậy; đồng nghiệp đánh giá khả năng phối hợp. Nếu các yêu cầu mâu thuẫn, giám đốc sản phẩm chọn ưu tiên và giải thích.

Vòng hai phải thử bản đã sửa bằng tình huống khó, không lặp lại vòng một bằng lời khác. Không diễn vai thành bằng chứng thị trường. Nếu chưa có người dùng thật, đề xuất cách kiểm chứng ở bước kế hoạch.

**Spec và thiết kế cần chú ý**

- Chỉ rõ mỗi màn hình giải quyết câu hỏi nào, hành động chính là gì, dữ liệu đến từ đâu.
- Gồm trạng thái chưa có dữ liệu, có dữ liệu mẫu, đang xử lý, lỗi đọc, dữ liệu một phần, nguồn AI chậm/lỗi và sửa/hoàn tác.
- Responsive mô tả thứ tự nội dung và cách thao tác ở từng kích thước, không chỉ co giao diện desktop. Chốt breakpoint khi thiết kế, không tự lấy số cứng làm quyết định chiến lược.
- Thể hiện cách đọc bảng, lọc kỳ, chọn chiến dịch, mở căn cứ, copy báo cáo bằng bàn phím và trên mobile.
- Không giấu nhãn/đơn vị chỉ để làm giao diện đẹp. Màu tăng/giảm phụ thuộc ý nghĩa KPI.
- Mẫu tham khảo giúp chọn nhịp bố cục, kiểu chữ, mật độ dữ liệu; không sao chép logo/assets hoặc thêm tính năng chỉ vì mẫu có.

**Chốt phạm vi theo chất lượng**

Mỗi bước nên có điều kiện đủ để chuyển tiếp và danh sách điều chưa cần giải quyết. Chỉ đề xuất cắt tính năng khi có lý do về giá trị/phụ thuộc/thời gian; ghi phần bị hoãn để nhu cầu người dùng không mất khỏi bối cảnh. Không tự rút bỏ chatbot, ảnh, Excel hay định dạng xuất do khó làm mà không nêu đánh đổi.
