**Plan chiến lược sản phẩm — đã chốt**

Phiên bản 0.1.0 · Bối cảnh 04/11/2026 · Đề 7, bảng B – Kinh tế.

Trạng thái: người dùng đã chốt Plan chiến lược ngày 05/11/2026 sau khi duyệt từng nhóm và bản tổng kết cuối tại strategy-final-review.md. Plan kế hoạch hiện có bản đề xuất và phản biện lần đầu tại delivery-plan.md và delivery-plan-review.md; Plan thực thi có bản phân gói dự thảo tại execution-plan.md; chưa có spec, thiết kế hoặc build được duyệt. Tài liệu này vẫn là nguồn quyết định chiến lược.

**Đã được người dùng duyệt ngày 05/11/2026**

- Người dùng chính và công việc: người trực tiếp chạy Ads trong nhóm marketing nhỏ; cập nhật số, phát hiện biến động, chọn việc cần kiểm tra và gửi báo cáo. Cấp trên, khách hàng, đồng nghiệp nhận bản tóm tắt có căn cứ; bản thi chưa cần tài khoản riêng cho mọi vai trò.
- Giá trị trước mắt: **nhập dễ, dễ hiểu, chỉ cần phần cơ bản**. Phần “biết việc tiếp theo”, hành động và báo cáo nâng cao được giữ trong nhu cầu phát triển, chưa lấy làm lời hứa ưu tiên ngang với hai giá trị đầu.
- Luồng chính: nhập dữ liệu → xem trước/sửa chỗ mơ hồ → xem KPI/xu hướng → kiểm tra căn cứ gợi ý → copy báo cáo. Không bắt khai phễu, website/inbox hoặc mục tiêu để xem số cơ bản.
- Phạm vi: hoàn chỉnh năm yêu cầu BTC trước, đồng thời triển khai các yêu cầu mở rộng khi không làm chậm luồng BTC. Giữ toàn bộ nội dung mở rộng đã nêu; phần nào thiếu hoặc chưa làm phải ghi rõ cho người dùng, không tự xóa khỏi danh mục.
- Nhập liệu: nhập tay nhiều dòng là nền bắt buộc; làm Excel/CSV và text copy sớm để giảm thao tác; làm ảnh chụp song song nhưng chỉ hỗ trợ những dạng đọc được, luôn cho xem trước và sửa trước khi lưu. Bản thi có thể chưa hỗ trợ mọi kiểu ảnh; phải ghi rõ giới hạn và phần còn thiếu.
- Dashboard: ba góc nhìn Tổng quan, Phân tích, Báo cáo dùng chung dữ liệu và bộ lọc. Bản cơ bản tập trung KPI và biểu đồ đúng đề; so sánh sâu bổ sung sau.
- Báo cáo: người dùng ưu tiên text và PDF nhưng yêu cầu khi đã nhập dữ liệu đầy đủ thì có thể chọn xuất bất kỳ định dạng đã nêu: text, PDF, HTML email hoặc slide. Không coi định dạng khác là tính năng chỉ được mở sau khi xuất text. Nếu có trở ngại về chất lượng hoặc thời gian phải báo ngay, nêu phương án và phần thiếu; không âm thầm bỏ định dạng.
- Đường AI đã duyệt: dữ liệu nhập được người dùng xem trước/xác nhận → tính KPI bằng logic chung → backend app gửi dữ liệu/KPI/phạm vi và phần thiếu qua 9Router sẵn có tới Codex để nhận phân tích/gợi ý có căn cứ. Cuộc trò chuyện Codex hiện tại không tự nhận dữ liệu từ app. Gemini API là dự phòng; khả năng endpoint/model và truy cập từ deploy chưa được kiểm chứng.
- Đầu ra đã duyệt: slide là file PPTX tải về; HTML email có xem trước, copy hoặc tải HTML. Chưa tự gửi email/Zalo. Cả bốn định dạng text, PDF, HTML email, PPTX được chọn trực tiếp từ cùng một snapshot báo cáo khi dữ liệu đầy đủ.
- Chatbot bản cơ bản đã duyệt: hỏi KPI, xu hướng và so sánh trên dữ liệu đã xác nhận; câu trả lời nêu kỳ/bộ lọc và số liệu làm căn cứ. Câu hỏi rộng hoặc thiếu tiêu chí được hỏi lại ngắn. Độ mở rộng ngoài các nhóm câu hỏi này chưa chốt.
- Demo/deploy đã duyệt: cần link online; dữ liệu bản thi lưu localStorage riêng trên từng trình duyệt, không cần tài khoản hay dữ liệu nhiều người dùng chung. Nhà cung cấp hosting cụ thể sẽ chọn trong Plan kế hoạch theo khả năng gọi 9Router hiện có trên VPS và xuất bốn định dạng báo cáo.
- Thông tin mới từ người dùng: 9Router hiện có chạy trên VPS; thầy sẽ cấp mã/thông tin truy cập sau. Lập kế hoạch với chỗ cấu hình để trống, không ghi mã giả như đã hoạt động và không cài lại router. Kết nối từ backend online đến VPS vẫn cần kiểm thử khi được cấp thông tin thật.
- Nguyên tắc UX/dữ liệu/AI: tối giản kiểu Apple, rõ nhãn/đơn vị, responsive desktop/tablet/mobile; một lớp tính KPI; ô thiếu khác 0; ảnh tổng kỳ không biến thành dữ liệu ngày; AI có căn cứ và nói rõ khi chưa đủ căn cứ.

**Chưa được duyệt/kiểm chứng ở bước kế hoạch:** độ sâu chatbot ngoài bản cơ bản, AI ngoài ba gợi ý BTC, nhà cung cấp hosting, endpoint/model/quota và kết nối thực từ backend online tới 9Router trên VPS. Thời gian thành viên chưa rõ; phân công hiện tại đã được ghi. Không cần dữ liệu dùng chung trong bản thi.

**1. Quyết định cốt lõi**

Xây một dashboard giúp người trực tiếp chạy Facebook Ads biến dữ liệu đang có thành bức tranh dễ hiểu, việc cần kiểm tra/cải thiện cụ thể và báo cáo có thể gửi ngay.

Giá trị ưu tiên trước mắt đã duyệt: “Nhập dễ — dễ hiểu.” Định hướng “biết việc tiếp theo” vẫn có trong luồng và yêu cầu AI của BTC, nhưng chiều sâu hành động là phần sẽ phát triển thêm theo nguồn lực.

Giá trị không phụ thuộc vào việc thay thế Ads Manager. App hữu ích ở khâu tiếp nhận dữ liệu, giải thích và giao tiếp kết quả. Chưa xây chức năng mua quảng cáo, sửa ngân sách thực tế, CRM hoặc quy trình chốt đơn. Website/inbox không phải lựa chọn bắt buộc khi bắt đầu.

**2. Người dùng và công việc ưu tiên**

Người dùng chính là người trực tiếp chạy Ads trong nhóm marketing nhỏ. Họ có số liệu dưới dạng bảng, file, ảnh hoặc nhập tay và cần xem nhanh biến động, đối chiếu trước khi quyết định, báo cáo định kỳ hoặc đột xuất.

Người dùng liên quan là trưởng nhóm/cấp trên, khách hàng và đồng nghiệp content/design/marketing. Nhu cầu của họ được phục vụ qua cách tóm tắt, bằng chứng, nội dung chuyển giao; chưa mặc định mỗi vai trò phải có tài khoản và hệ thống quyền riêng trong bản thi.

Tình huống chủ đạo: người chạy Ads cập nhật dữ liệu, phát hiện một biến động đáng chú ý, kiểm tra căn cứ, chọn việc tiếp theo và gửi tóm tắt cho người cần biết. Đây là giả thuyết để kiểm chứng bằng dùng thử, không phải tuyên bố đã khảo sát thị trường Việt Nam.

**3. Thứ tự ưu tiên khi có xung đột — còn cần chốt chi tiết**

Đã duyệt nguyên tắc hoàn chỉnh năm yêu cầu BTC trước và có thể làm mở rộng song song. Thứ tự đề xuất khi có xung đột: đúng dữ liệu và luồng đề bài → nhập dễ/dễ hiểu → gợi ý/báo cáo cơ bản dùng được → mở rộng chiều sâu và định dạng. Chưa coi đây là quyết định cắt bất kỳ nhu cầu mở rộng nào.

UI/UX là chất lượng xuyên suốt mọi mức ưu tiên. Không đợi cuối dự án mới làm dễ dùng; cũng không hy sinh nhãn, đơn vị và khả năng kiểm chứng để tạo vẻ tối giản.

**4. Danh mục phạm vi: giữ nguyên nhu cầu, chốt ưu tiên từng phần sau**

| Nhóm phạm vi | Nội dung | Trạng thái/cách xử lý |
|---|---|---|
| Nền tảng bài thi | Năm chức năng BTC; dữ liệu theo ngày; sửa/lưu localStorage; biểu đồ; công thức; nhận xét và ba gợi ý; copy text | Phải hoàn chỉnh; tham chiếu project-context.md cho yêu cầu nguồn |
| Khác biệt ưu tiên | Nhập Excel/CSV và text sớm; ảnh chụp song song trong phạm vi đọc được; xác nhận chỗ mơ hồ; tổng quan/phân tích/báo cáo dùng chung dữ liệu và bộ lọc | Thứ tự nhập và ba góc nhìn đã duyệt; không hứa mọi file/ảnh đều đọc được. Mức sâu của AI/báo cáo còn chờ duyệt |
| Mở rộng cần giữ trong phạm vi xuất | PDF ưu tiên cùng text; HTML email xem trước/copy/tải và PPTX tải về đều phải có đường chọn xuất trên dữ liệu đầy đủ | Đã duyệt định dạng; nếu có nguy cơ không hoàn thiện phải báo ngay để người dùng quyết định |
| Mở rộng còn cần chốt | Chatbot bản cơ bản hỏi KPI/xu hướng/so sánh đã duyệt; ghi chú thay đổi và hành động gọn | Đánh giá độ sâu ở bước kế hoạch; chưa tự xóa khỏi nhu cầu. Nhiều tài khoản dùng chung dữ liệu không cần cho bản thi |
| Ngoài phạm vi ban đầu | Tự đồng bộ Meta API, tự bật/tắt/sửa quảng cáo, đa kênh, CRM, task manager đầy đủ, tự gửi Zalo/email | Không đưa vào bản đầu nếu chưa có thay đổi mục tiêu rõ |

Nhu cầu bốn cách nhập và các định dạng báo cáo của người dùng được giữ trong danh mục. Người dùng đã yêu cầu làm BTC trước nhưng vẫn làm phần mở rộng song song khi khả thi. Thứ tự bốn cách nhập, ba góc nhìn, chatbot bản cơ bản và yêu cầu chọn một trong bốn định dạng báo cáo trên dữ liệu đầy đủ đã được duyệt. Độ sâu vượt bản cơ bản còn mở cho bước kế hoạch. Phần chưa hoàn thành phải xuất hiện trong danh sách thiếu/hoãn với lý do và bước tiếp theo, không biến mất khỏi tài liệu hay bản bàn giao.

**5. Chiến lược nhập liệu**

Một điểm tiếp nhận chung cho file, text, ảnh; thêm lối nhập tay nhiều dòng. Excel/CSV đọc cấu trúc trực tiếp, AI chỉ giúp ánh xạ hoặc hiểu ngữ nghĩa cần thiết. Ảnh và text được trích xuất thành dữ liệu nháp, chưa tự trở thành dữ liệu đã xác nhận.

Người dùng xem trước và chỉ phải xử lý nơi có vấn đề: trường thiếu, ngày không rõ, tiền tệ/định dạng số mơ hồ, “kết quả” chưa rõ loại, phần trùng hoặc bị sửa. Có thể sửa và hoàn tác lần nhập.

Lưu được xuất xứ và phạm vi dữ liệu. Một ảnh tổng kỳ chỉ được dùng ở mức tổng kỳ; bảng theo ngày mới hỗ trợ xu hướng ngày. Ảnh chụp một phần không mặc định là toàn bộ chiến dịch. Khi nhập lại, phân biệt bản giống hệt với bản cập nhật; không cộng lặp hoặc ghi đè âm thầm.

**6. Cách tổ chức dashboard**

Ba góc nhìn cùng dữ liệu, chiến dịch và khoảng thời gian:

- Tổng quan: KPI cơ bản và điểm cần chú ý; các lớp mục tiêu/trạng thái dữ liệu có thể bổ sung theo khả năng.
- Phân tích: biểu đồ ngày đúng đề, bảng chi tiết và căn cứ; so sánh sâu bổ sung sau.
- Báo cáo: tóm tắt text để copy theo dữ liệu/bộ lọc đang xem; định dạng và mức diễn giải nâng cao tiếp tục duyệt.

Chatbot và thẻ gợi ý là trợ giúp theo ngữ cảnh, không là cổng bắt buộc để đọc KPI. Không thiết kế nhiều dashboard tách biệt theo vai trò khiến bộ lọc/công thức lệch nhau. Mức ưu tiên vấn đề phải có lý do; không tạo điểm sức khỏe tổng hợp thiếu cơ sở.

**7. Chuẩn đúng nghiệp vụ**

| Chủ đề | Quyết định sản phẩm đề xuất |
|---|---|
| CTR | Công bố click đang là loại nào. Với dữ liệu tối thiểu của đề, ghi rõ “CTR theo đề: click/reach”. Khi có impressions phù hợp, hiện CTR theo hiển thị riêng; không trộn hai công thức. |
| Reach | Reach theo ngày có thể vẽ; không cộng các ngày rồi gọi tổng là số người duy nhất của kỳ. Chỉ dùng reach cả kỳ khi nguồn cung cấp đúng phạm vi đó. |
| CPC/CPO | Tính từ tổng tử số/mẫu số cùng phạm vi, không trung bình đơn giản các tỷ lệ ngày. |
| Thiếu/0 | Ô thiếu khác 0; mẫu số 0 hoặc thiếu thì có trạng thái không tính được và giải thích. |
| Kết quả | Không coi tin nhắn/lead là đơn hàng. Giữ loại kết quả và nguồn ghi nhận. |
| So kỳ | So kỳ tương đương, chỉ rõ ngày chưa hoàn chỉnh hoặc thiếu; không gọi thiếu dòng dữ liệu là sụt hiệu suất. |
| Gộp dữ liệu | Không cộng cả cấp cha và cấp con; không trộn tiền tệ hoặc nguồn đơn không tương thích. |
| Kết luận kinh doanh | Không suy lợi nhuận từ chi phí/đơn. Không suy nguyên nhân chắc chắn từ tương quan. |

Định nghĩa CTR thông thường dựa trên impressions; các loại click và nguồn báo cáo phải được đối chiếu khi nhập. [Định nghĩa CTR](https://support.google.com/google-ads/answer/2615875?hl=en), [Tài liệu dữ liệu Meta của Cuttable](https://intercom.help/cuttable/en/articles/13298247-ad-insights-understanding-your-metrics)

**8. Chiến lược AI**

Một bộ dữ liệu đã xác nhận và một lớp tính KPI phục vụ dashboard, AI, chatbot và báo cáo. AI nhận kết quả tính toán, phạm vi, thông tin thiếu và bối cảnh mục tiêu khi có. Không để từng màn hình hoặc provider tự tính lại theo cách riêng.

Ba gợi ý của đề phải cụ thể và khác nhau. Cấu trúc: quan sát có số liệu → giả thuyết/giới hạn → bước làm tiếp → cách kiểm tra → người phối hợp nếu người dùng đã xác định. Khi thiếu căn cứ, hành động đúng có thể là bổ sung hoặc kiểm chứng dữ liệu. Không ép AI đưa ba lời khuyên tối ưu quảng cáo bịa đặt.

Ví dụ minh họa: chi phí tăng, click tăng nhưng đơn giảm giữa hai kỳ tương đương. Kết luận chắc là biến động các chỉ số. Hành động có thể là kiểm tra nguồn ghi nhận đơn và thay đổi chiến dịch trong kỳ; chưa đủ để khẳng định nội dung kém. Không tự chuyển giả thuyết thành lệnh tắt quảng cáo.

Chatbot giới hạn vào dữ liệu người dùng có quyền xem, nêu kỳ/tiêu chí và dẫn đến bảng chứng minh. Câu “tốt nhất” cần tiêu chí. Một lần phân tích có thể dùng lại trong báo cáo nếu dữ liệu, mục tiêu, phạm vi và phiên bản phân tích không đổi. Không tái dùng kết quả giữa khách hàng/dataset khác nhau chỉ vì số tổng giống nhau.

Bản cơ bản của chatbot đã được người dùng duyệt: trả lời về KPI, xu hướng và so sánh trên dữ liệu đã xác nhận, chỉ rõ kỳ/bộ lọc và số liệu căn cứ; hỏi lại ngắn khi câu hỏi thiếu tiêu chí. Phạm vi câu hỏi mở rộng sẽ được quyết định theo khả năng ở Plan kế hoạch.

**9. Kết nối AI theo quyết định đã có**

Đường dữ liệu đã duyệt: dữ liệu nhập tay/file/text/ảnh → người dùng xác nhận → lớp tính KPI xác định → gói số liệu/phạm vi/thiếu sót gửi từ backend của app qua 9Router sẵn có trên VPS → Codex ưu tiên trả nhận xét và gợi ý → app kiểm tra, hiển thị căn cứ. Codex trong cuộc trò chuyện này không tự nhận được dữ liệu của app; app phải gửi yêu cầu qua endpoint/model mà 9Router hiện có cung cấp. Thầy sẽ cấp thông tin truy cập sau; trước đó giữ cấu hình trống và kiểm thử bằng ranh giới giả lập minh bạch, không tuyên bố tích hợp thật đã chạy.

Gemini API là dự phòng. Đề xuất đường gọi Gemini trực tiếp từ backend để cả trường hợp router không truy cập được vẫn có nguồn thay thế. Một lớp điều phối chịu trách nhiệm giới hạn thử lại, thời gian chờ và chi phí; tránh router và app cùng thử nhiều vòng. Không gửi đồng thời hai provider để rồi trả tiền gấp đôi khi không cần.

Chỉ tích hợp dịch vụ sẵn có. Chưa xác minh endpoint có thể gọi từ môi trường deploy, tên model, ảnh, đầu ra cấu trúc, quota và chi phí thực tế. Các mục này là đầu vào kế hoạch tích hợp, không phải lý do cài lại router. Khóa chỉ ở server.

Tính toán, biểu đồ, nhập tay và báo cáo số liệu cơ bản hoạt động khi AI lỗi. Nếu có diễn giải bằng quy tắc trong phương án dự phòng, ghi đúng là quy tắc, không giả là câu trả lời AI đang hoạt động. Không hứa dùng gói Codex sẽ không bao giờ phát sinh chi phí hoặc không ảnh hưởng hạn mức cá nhân.

**10. Báo cáo và phối hợp công việc**

Nội dung chuẩn: kỳ/phạm vi → mục tiêu nếu có → số liệu → điểm cần chú ý → điều chưa đủ căn cứ → việc tiếp theo → quyết định cần duyệt nếu có.

Người dùng đã ưu tiên text ngắn phù hợp copy sang Zalo và PDF, đồng thời yêu cầu khi có dữ liệu đầy đủ thì có thể chọn xuất text, PDF, HTML email hoặc slide. Dùng **một snapshot báo cáo chuẩn** gồm số KPI, kỳ/phạm vi, ghi chú dữ liệu và nhận xét đã kiểm tra; bốn bộ trình bày độc lập tạo các định dạng từ cùng snapshot. Không buộc xuất text trước mới được PDF/HTML/slide. Slide đã chốt là file PPTX tải về; HTML email đã chốt có xem trước, copy hoặc tải HTML. Chưa tự gửi Zalo/email. Nếu không kịp hoặc có lỗi định dạng, báo người dùng ngay với phương án, không âm thầm chỉ để lại text.

Báo cáo có timestamp và snapshot dữ liệu để giải thích khác biệt sau cập nhật. Chọn cách diễn đạt cho nội bộ/cấp trên/khách hàng không tự tạo quyền truy cập; nếu có link chia sẻ hoặc nhiều tài khoản, quyền phải được thiết kế riêng. Không tự gửi nội dung ra kênh giao tiếp.

Ghi chú “đã đổi ngân sách/ưu đãi/creative” và việc tiếp theo có thể giúp phối hợp; giữ gọn. Brief cho content là nội dung chuyển giao, không trở thành hệ thống quản trị task hoặc sản xuất nội dung khác.

**11. Nguyên tắc UX**

Vào app là thấy cách thêm số liệu hoặc xem dữ liệu mẫu. Dữ liệu mẫu tách rõ. Ưu tiên chữ/số và thứ bậc thông tin; một hành động chính rõ ràng; thông tin nâng cao mở khi cần. Không bắt nhập mục tiêu/ngành hàng để xem dữ liệu cơ bản.

Mỗi biểu đồ trả lời một câu hỏi. Nhãn, đơn vị, kỳ và trạng thái dữ liệu đủ rõ. Người dùng có đường sửa và hoàn tác. Hiện tiến trình đọc file và AI; không giữ người dùng trước một biểu tượng chờ vô hạn.

Desktop phục vụ bảng và phân tích; mobile phục vụ đọc nhanh, đưa ảnh vào, sửa trường cần thiết và copy báo cáo. Tablet cũng có bố cục cụ thể trong thiết kế. Có focus bàn phím, nhãn cho nút và trạng thái không dựa riêng vào màu. Chưa chốt font, palette, breakpoint, layout hoặc thư viện ở tài liệu chiến lược này.

**12. Cách kiểm chứng giá trị**

Các tiêu chí sau là mục tiêu đề xuất, chưa phải số đo đã đạt:

- Người dùng mới tự hoàn thành nhập dữ liệu, sửa một điểm mơ hồ và copy báo cáo mà không cần người hướng dẫn.
- Cùng dữ liệu/kỳ/công thức cho cùng số KPI ở dashboard, chatbot và báo cáo; bộ dữ liệu tham chiếu phải khớp hoàn toàn kết quả tính xác định.
- Những số không xác định không bị tự điền; lỗi dữ liệu được giải thích tại chỗ có thể sửa.
- Cả ba gợi ý có căn cứ, hành động và cách kiểm tra; không có kết luận nguyên nhân vượt dữ liệu.
- AI lỗi không làm mất dữ liệu hoặc vô hiệu luồng KPI.
- So thời gian hoàn thành công việc trước/sau bằng dùng thử; đo baseline rồi chốt mục tiêu thời gian ở bước kế hoạch. Không cam kết tăng ROAS hoặc giảm CPA khi chưa có bằng chứng.

**13. Chiến lược phối hợp và công nghệ**

Một repository chung, nhánh theo công việc, PR nhỏ và preview khi nền tảng hỗ trợ. Một từ điển dữ liệu/công thức và một contract dùng chung trước khi ba người code các phần phụ thuộc. Một owner và reviewer cho mỗi module; contract/schema/thành phần dùng chung có chủ sở hữu rõ.

Repo chung đã kiểm tra là [dungnguyen170503-netizen/adpulse-mini-kpi](https://github.com/dungnguyen170503-netizen/adpulse-mini-kpi), baseline `main` tại `f1774a105f416fd4c16b9438f70e415085d5399c`. Nhánh `feature/ban-c-ai-report` là bản cũ để tham khảo, không dùng làm nguồn chuẩn mới vì một số công thức và đường AI khác quyết định ở đây.

Phân công hiện tại của nhóm:

| Người | Gói trách nhiệm | Điểm phối hợp |
|---|---|---|
| Lộc | Kết nối Codex qua 9Router/Gemini dự phòng; AI gợi ý và chatbot; bộ xuất HTML email; điều phối tích hợp/release | Trách nhiệm tích hợp không phải quyền tự ý đổi contract; cần review của hai người còn lại |
| Trịnh Khoa | UX responsive và ba góc nhìn dashboard; luồng báo cáo, xuất text và PPTX | Ba góc nhìn phải dùng KPI và snapshot chung, không tính số riêng |
| Thanh Dũng | Nhập tay, Excel/CSV, text, ảnh; xem trước/sửa, lưu dữ liệu và lớp KPI chung; bộ xuất PDF | Bốn cách nhập có độ khó khác nhau; phải kiểm tra khối lượng với mẫu dữ liệu thực |

Mỗi người tích hợp phần mình với contract chung. Lộc theo dõi bản tích hợp/release; Thanh Dũng và Trịnh Khoa review các thay đổi chạm dữ liệu/KPI hoặc giao diện chung. Khi có cập nhật về thời gian hoặc khối lượng, điều chỉnh đầu việc để giữ cân bằng. Owner/reviewer từng module và mốc bàn giao thuộc Plan kế hoạch sau khi chiến lược được chốt.

Người dùng yêu cầu mỗi thành viên tự hiểu và chịu trách nhiệm phần mình dù có dùng AI hỗ trợ. Khi đến bước build, mỗi PR phải có lý do lựa chọn, bằng chứng chạy thật, cách xử lý lỗi và reviewer khác owner kiểm tra khả năng giải thích. Không dùng tỷ lệ code do AI viết làm thước đo đóng góp; tiêu chí cụ thể nằm trong team-assignment-guide.md và mẫu pr-review-ai.md.

GitHub phục vụ cộng tác phát triển. Người dùng đã chốt **link online** và **localStorage riêng trên mỗi trình duyệt**, không cần nhiều tài khoản dùng chung dữ liệu; không đưa Supabase vào bản thi chỉ vì app có link online. Nhà cung cấp hosting được chọn ở Plan kế hoạch theo khả năng chạy app, xuất file và kết nối an toàn tới 9Router hiện có trên VPS; Vercel/Cloudflare vẫn là phương án xem xét, chưa chốt. Thông tin kết nối sẽ được cấp sau và để trống trong bản kế hoạch/cấu hình mẫu. Khi có thông tin thật phải kiểm thử từ backend online; Gemini API là dự phòng đã duyệt nhưng không âm thầm thay nguồn AI chính của bản online.

**14. Chuyển sang Plan kế hoạch**

Plan chiến lược đã được người dùng chốt, gồm mục tiêu link online và localStorage riêng. Người dùng đã cho tiếp tục sang Plan kế hoạch; bản đề xuất và phản biện lần đầu nằm tại delivery-plan.md và delivery-plan-review.md. Đã kiểm tra lại đề và hạn công khai ngày 05/11/2026. Thời gian thành viên chưa rõ nên kế hoạch dùng mốc kiểm chứng và giả định ghi rõ, không bịa số giờ. Không biến thiếu endpoint/secret thành yêu cầu cung cấp ngay ở bước này.

Đầu ra kế hoạch phải bám workflow người dùng đã chọn. Khi đến mốc trước build module, cập nhật skill theo spec/design/contract/repo baseline thực tế, đóng gói bản mới và nhắc người dùng gửi cùng phiên bản cho cả nhóm. Gói 0.1.0 hiện tại là nền thảo luận, chưa phải gói triển khai module.
