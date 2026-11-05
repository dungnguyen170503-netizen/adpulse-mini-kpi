**Hướng dẫn chia việc cho nhóm — 05/11/2026**

Phiếu giao hiện hành để gửi **một lần** cho cả nhóm là `team-handoff-once.md`. Tài liệu này giữ KPI nghiệm thu và cách rà soát chi tiết để tham chiếu; không cần giao lại từng bước.

Tài liệu này giúp người dùng giao hướng trách nhiệm và việc chuẩn bị. Phân công hiện tại đã được người dùng chốt; Plan kế hoạch đã có bản đề xuất và phản biện lần đầu ở `delivery-plan.md`/`delivery-plan-review.md`; spec, thiết kế và phiếu module chưa được lập/duyệt. Chưa giao code các phần phụ thuộc vào contract hoặc giao diện chi tiết.

**Plan kế hoạch là gì, làm lúc nào?**

Plan kế hoạch được lập **trước khi cả nhóm build**, không đợi ba người làm xong. Bản hiện tại chốt đề xuất thứ tự các luồng việc, phụ thuộc, trách nhiệm tích hợp, mốc kiểm chứng, rủi ro và cách xử lý nếu thiếu thời gian. Sau khi phản biện kế hoạch còn có Plan thực thi chi tiết, spec, thiết kế responsive và bộ contract/baseline GitHub; đến khi đó mới phát phiếu module để code. Việc chuẩn bị ngay bên dưới giúp kiểm chứng giả định của Plan, chưa phải nghiệm thu tính năng.

**Mục tiêu chung cần gửi cho cả ba người**

App dashboard Facebook Ads đề 7, bảng B. Hoàn chỉnh năm yêu cầu BTC trước; làm các mở rộng đã ghi song song khi khả thi và báo ngay phần còn thiếu. Cần link online, dữ liệu lưu localStorage riêng trên từng trình duyệt. AI lấy dữ liệu đã xác nhận và KPI chung, gọi Codex qua 9Router hiện có trên VPS; thông tin truy cập được cấp sau, không đưa mã vào repo hoặc chat. Gemini API dự phòng. Bốn cách nhập: tay, Excel/CSV, text copy, ảnh. Ba góc nhìn: Tổng quan, Phân tích, Báo cáo. Bốn đầu ra chọn trực tiếp từ cùng snapshot: text, PDF, HTML email, PPTX. Chatbot cơ bản hỏi KPI, xu hướng, so sánh có căn cứ. UX tối giản, responsive.

**Phân công và việc chuẩn bị ngay**

| Người | Chịu trách nhiệm | Chuẩn bị trước Plan/spec | Kết quả khi đến bước build |
|---|---|---|---|
| Thanh Dũng | Nhập tay/Excel/CSV/text/ảnh; xem trước/sửa/lưu; công thức KPI; xuất PDF | Tập hợp mẫu dữ liệu đã ẩn thông tin riêng, ví dụ thiếu/sai/trùng; đề xuất từ điển cột và công thức cần công bố | Dữ liệu đã xác nhận và KPI có một nguồn chuẩn; nhập nhiều dòng, localStorage, PDF dùng snapshot chung |
| Trịnh Khoa | UX responsive; Tổng quan/Phân tích/Báo cáo; text và PPTX | Phác thảo câu hỏi mỗi góc nhìn trả lời, thứ tự nội dung mobile, cấu trúc tóm tắt báo cáo | Dashboard/biểu đồ và hai định dạng xuất dùng đúng KPI/bộ lọc/snapshot; có trạng thái rỗng/lỗi/chờ |
| Lộc | Codex qua 9Router/Gemini; AI gợi ý, chatbot, HTML email; điều phối tích hợp | Liệt kê đầu vào AI cần từ KPI/snapshot, đầu ra có căn cứ, tình huống router lỗi; chuẩn bị danh sách kiểm chứng endpoint VPS khi được cấp | AI nhận xét và ba gợi ý, chatbot cơ bản, HTML email; kiểm tra luồng liên module và bản demo online |

**Yêu cầu và KPI nghiệm thu theo gói — áp dụng khi đến bước build**

| Người | Yêu cầu phải giải quyết | KPI/Minh chứng để review |
|---|---|---|
| Thanh Dũng | Nhập tay nhiều dòng theo ngày; Excel/CSV, text copy, ảnh trong phạm vi hỗ trợ; xem trước, sửa, xác nhận, lưu localStorage; một lớp KPI chung; PDF từ snapshot báo cáo | Nhập tay và mở lại trình duyệt vẫn còn dữ liệu; mỗi nguồn nhập được thử với mẫu hợp lệ và mẫu lỗi/thiếu, không lưu âm thầm dữ liệu mơ hồ; reach/click/chi phí/đơn và CTR/CPC/chi phí mỗi đơn khớp 100% bộ số tham chiếu; thiếu khác 0, mẫu số 0 được giải thích; PDF dùng đúng kỳ và số KPI của snapshot. Ghi rõ kiểu ảnh/file chưa hỗ trợ. |
| Trịnh Khoa | Ba góc nhìn dùng cùng dữ liệu/bộ lọc; biểu đồ reach/chi phí/đơn theo ngày; UX desktop/tablet/mobile; xuất text và PPTX từ snapshot | Người mới hoàn thành luồng nhập → đọc KPI → copy text mà không cần hướng dẫn trong một lần dùng thử; cùng kỳ/bộ lọc cho cùng số ở các góc nhìn và đầu ra; biểu đồ đủ nhãn/đơn vị, không biến dữ liệu thiếu thành 0; mobile thao tác đọc/sửa/copy được; text và PPTX giữ đúng kỳ, số liệu, nguồn và ghi chú thiếu dữ liệu. Ghi kết quả dùng thử và lỗi sửa được. |
| Lộc | Backend gọi Codex qua 9Router VPS khi có thông tin thật, Gemini dự phòng; AI nhận xét + ba gợi ý có căn cứ; chatbot bản cơ bản; HTML email; tích hợp online | Với bộ số tham chiếu, ba gợi ý khác nhau đều có quan sát → giả thuyết/giới hạn → hành động → cách kiểm tra, không bịa số; chatbot trả KPI/xu hướng/so sánh có kỳ và căn cứ, hỏi lại khi thiếu tiêu chí; AI lỗi không làm mất dữ liệu hoặc chặn KPI/báo cáo cơ bản; HTML email cùng snapshot; kiểm tra một luồng đầu-cuối trên link online. Trước khi có mã VPS, chỉ chứng minh contract/fallback giả lập minh bạch, không đánh dấu tích hợp thật đã đạt. |

KPI cá nhân ở đây là **tiêu chí sản phẩm có thể kiểm tra**, không là tỷ lệ số dòng code hoặc số prompt AI. Bảng B còn yêu cầu tối thiểu ba ca kiểm thử toàn app (bình thường, nhập thiếu/sai, ca biên); ba gói phải cùng đóng góp và lưu kết quả thực tế. Nếu bất kỳ định dạng nhập/xuất nào chưa đạt, báo người dùng ngay kèm lỗi, tác động và phương án.

**Rà soát mức hiểu bài và việc dùng AI**

AI được phép hỗ trợ viết code, nhưng không dùng số prompt hoặc công cụ phát hiện AI để kết luận ai có làm việc hay không. Mỗi PR/module phải có:

1. Chủ phần việc tự mô tả bằng lời của mình: vấn đề người dùng, hai quyết định chính, vì sao chọn cách làm đó và một đánh đổi.
2. Bằng chứng chạy thật: ảnh/video ngắn hoặc bước tái hiện, bộ dữ liệu thử, kết quả kỳ vọng và kết quả thực tế; ít nhất một trường hợp lỗi/biên liên quan module.
3. Ghi AI đã giúp phần nào, nội dung nào người làm đã sửa/kiểm tra; không cần nộp toàn bộ hội thoại. Minh chứng chọn lọc này còn phục vụ hồ sơ cuộc thi.
4. Reviewer khác owner hỏi hai câu về dữ liệu/phụ thuộc/trường hợp lỗi và yêu cầu owner giải thích trực tiếp hoặc bằng ghi chú rõ ràng. Không giải thích được hoặc không có bằng chứng chạy thật thì trả PR để sửa, dù code chạy và AI báo thành công.
5. Khi chạm KPI, bộ lọc, snapshot hoặc contract, người chịu ảnh hưởng xác nhận các đầu ra vẫn khớp. Lộc theo dõi tích hợp; không một người tự duyệt PR của mình.

Dùng mẫu `assets/templates/pr-review-ai.md` cho từng PR khi đến bước build. Đây là cổng review trong quy trình nhóm, **không là tính năng giám sát người dùng trong app dashboard**.

**Ranh giới cần thống nhất trước khi code phụ thuộc**

1. Thanh Dũng đề xuất cấu trúc dữ liệu đã xác nhận, định nghĩa ngày/kỳ/tiền tệ/loại kết quả và công thức. Cả nhóm review; UI/AI/export không tính KPI riêng.
2. Trịnh Khoa và Lộc cùng Thanh Dũng chốt một snapshot báo cáo chuẩn. Text, PDF, HTML và PPTX chỉ trình bày cùng số liệu/phạm vi đó.
3. Lộc mô tả đầu vào/đầu ra của lớp AI. App gọi backend, backend gọi 9Router VPS; cấu hình truy cập để trống đến khi có thông tin thật. Lỗi AI không làm hỏng dữ liệu/KPI/xuất báo cáo cơ bản.
4. Trịnh Khoa mô tả luồng màn hình để Thanh Dũng đặt nhập/sửa và Lộc đặt gợi ý/chatbot đúng ngữ cảnh. Thiết kế chi tiết responsive sẽ chốt ở bước riêng.

**Cách phối hợp qua GitHub khi đến bước build**

- Một repository và một baseline chung; tài liệu chiến lược, Plan, spec, design và contract là nguồn chuẩn. Lộc theo dõi bản tích hợp, không tự sửa nghĩa KPI hoặc contract.
- Mỗi phiếu module ghi owner, reviewer khác owner, phụ thuộc, vùng file, tiêu chí nghiệm thu và cách kiểm tra. Dùng mẫu `assets/templates/module-brief.md` sau khi spec/contract/design đủ rõ.
- Mỗi người tạo nhánh ngắn theo việc, gửi PR nhỏ theo mẫu rà soát; reviewer kiểm tra cả hành vi, dữ liệu và khả năng giải thích quyết định. Đối chiếu các ranh giới nhập → KPI, KPI/bộ lọc → AI, snapshot → bốn định dạng, AI lỗi → fallback.
- Nếu một người cần sửa contract/chức năng dùng chung, báo tác động cho hai người còn lại trước khi ghép. Không để secret hoặc dữ liệu khách hàng thật trong repo.
- Trước khi giao build module, cập nhật/đóng gói Vibecode-Team cùng một revision và gửi cả nhóm theo workflow.

**Mẫu tin nhắn để người dùng gửi cả nhóm**

> Nhóm mình làm Dashboard KPI Facebook Ads đề 7, bảng B. Mình đã chốt chiến lược trong Vibecode-Team; phân công: Thanh Dũng phụ trách nhập dữ liệu/KPI/PDF, Trịnh Khoa phụ trách UX/dashboard/text/PPTX, Lộc phụ trách AI qua 9Router/chatbot/HTML email và tích hợp. Trước mắt mỗi người xem phần mình trong tài liệu và chuẩn bị câu hỏi, dữ liệu mẫu hoặc rủi ro. Cả nhóm sẽ dùng chung định nghĩa KPI, bộ lọc và snapshot báo cáo. Mình sẽ gửi Plan, spec, thiết kế và phiếu module cùng phiên bản trước khi giao build. Nếu thấy thiếu hoặc vướng, báo sớm để điều chỉnh; chưa tự quyết định thay contract chung.

**Còn chờ ở bước kế hoạch/thực hiện**

Chọn hosting cụ thể; GitHub remote/quyền; giờ tham gia thực tế; mẫu dữ liệu đã ẩn thông tin; endpoint/model/quota 9Router VPS và ngân sách Gemini; kiểm chứng bốn định dạng. Thông tin truy cập 9Router sẽ được cấp sau và chỉ nhập vào cấu hình bí mật phù hợp, không điền vào tài liệu này.
