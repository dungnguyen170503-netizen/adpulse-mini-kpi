**Plan kế hoạch — Dashboard KPI Facebook Ads, đề 7 bảng B**

Ngày lập: 05/11/2026 (Asia/Saigon). Trạng thái: **Plan kế hoạch đã phản biện lần đầu, lịch 4 giờ/người/ngày được người dùng xác nhận**; các mốc vẫn cần kiểm chứng thực tế, chưa phải Plan thực thi chi tiết, spec, thiết kế hay lệnh build. Nguồn chiến lược đã chốt: `product-strategy.md` và `strategy-final-review.md`. Không đổi các quyết định sản phẩm đã duyệt trong tài liệu này.

**1. Cơ sở và giả định**

- BTC công khai hạn 23:59 ngày 09/11/2026, giờ Việt Nam. Đề 7 có năm chức năng: nhập nhiều dòng/ngày và localStorage; biểu đồ reach/chi phí/đơn; CTR/CPC/chi phí mỗi đơn; AI nhận xét và ba gợi ý; báo cáo text. Bảng B cần ít nhất ba ca kiểm tra (bình thường, thiếu/sai, biên). Hồ sơ gồm source ZIP/README, video tối đa hai phút, minh chứng AI tối đa một trang và tối đa năm ảnh/đoạn hội thoại. Nguồn đã kiểm tra ngày 05/11: https://vibecoding.info.vn/de-bai ; https://vibecoding.info.vn/tieu-chi-cham-thi ; https://vibecoding.info.vn/bai-viet/yeu-cau-dau-ra-va-huong-dan-nop-bai-vibe-coding-2026 . Chưa có thông báo riêng của đội từ cổng đăng nhập.
- Người dùng muốn link online; dữ liệu chỉ lưu localStorage riêng trên mỗi trình duyệt. Không đưa Supabase/tài khoản dùng chung vào bản thi. 9Router đã có trên VPS, thầy cấp thông tin sau. Codex qua router là nguồn AI chính; Gemini API dự phòng. Không ghi secret hoặc giả rằng kết nối thật đã đạt.
- Người dùng xác nhận **mỗi người có 4 giờ/ngày**. Lịch tính từ 06 đến 09/11, bốn ngày × ba người × bốn giờ = **tối đa 48 giờ công gộp** trước hạn; không cộng ngày 05 vì lúc lập lịch đã là buổi tối. Chưa ấn định ca sáng/chiều và chưa có báo cáo hoàn thành thực tế từ từng người.
- Bản nộp mục tiêu giữ bốn nguồn nhập (tay, Excel/CSV, text copy, ảnh có xác nhận), ba góc nhìn, AI ba gợi ý có căn cứ, chatbot cơ bản và bốn đầu ra text/PDF/HTML email/PPTX từ một snapshot. BTC là đường ưu tiên số một; mở rộng làm song song theo contract chung. Nếu rủi ro khiến bất kỳ nhu cầu nào không đạt, báo người dùng ngay với bằng chứng và lựa chọn; không tự xóa.

**2. Mảng việc, thứ tự và phụ thuộc**

| Luồng | Ưu tiên và owner/reviewer dự kiến | Đầu ra kiểm chứng | Phụ thuộc chính |
|---|---|---|---|
| A. Dữ liệu chuẩn và bộ kiểm chứng | P0 · Thanh Dũng; Lộc review AI, Trịnh Khoa review hiển thị | Từ điển dữ liệu/công thức/kỳ; mẫu bình thường, thiếu/sai, biên đã ẩn thông tin; kết quả KPI kỳ vọng; contract snapshot | Bắt đầu ngay sau Plan, cần duyệt trong spec trước code phụ thuộc |
| B. Nhập, xác nhận, lưu, KPI | P0 nhập tay/localStorage/KPI; P1 Excel/CSV/text/ảnh · Thanh Dũng; Trịnh Khoa review thao tác | Nhập nhiều dòng, xem trước/sửa/trùng/thiếu, lưu lại, biểu đồ dùng được số chuẩn; phạm vi ảnh hỗ trợ công bố rõ | A; UX nhập/sửa từ C; model ảnh qua router nếu dùng phải kiểm chứng riêng |
| C. Dashboard và UX responsive | P0 Tổng quan, biểu đồ, báo cáo text; P1 Phân tích sâu và trải nghiệm mở rộng · Trịnh Khoa; Thanh Dũng review chỉ số | Ba góc nhìn dùng cùng bộ lọc/KPI; nhãn/đơn vị/trạng thái rõ trên desktop/tablet/mobile; text copy được | A; dữ liệu từ B; spec và thiết kế responsive được chốt trước build |
| D. AI và chatbot | P0 nhận xét xu hướng + ba gợi ý; P1 chatbot cơ bản · Lộc; Thanh Dũng review căn cứ/KPI | Kết quả AI có nguồn số, phạm vi, giới hạn, hành động và cách kiểm tra; chatbot hỏi KPI/xu hướng/so sánh và hỏi lại khi thiếu tiêu chí; lỗi AI không làm hỏng KPI | A; backend adapter/9Router VPS; Gemini fallback; UI chỗ hiển thị từ C |
| E. Báo cáo bốn định dạng | P0 text · Trịnh Khoa; P1 PDF · Thanh Dũng, HTML email · Lộc, PPTX · Trịnh Khoa; reviewer chéo | Từ **cùng snapshot**, người dùng chọn trực tiếp text/PDF/HTML/PPTX; mỗi đầu ra giữ đúng kỳ, KPI, ghi chú dữ liệu và mở được bằng công cụ phù hợp | A + B + C cho snapshot/luồng; D cho phần nhận xét nếu có; báo cáo số liệu cơ bản vẫn chạy khi AI lỗi |
| F. Online, tích hợp và hồ sơ | P0 · Lộc điều phối; hai người còn lại review phần mình | Link online hoạt động; kiểm tra router thật khi được cấp mã; source ZIP/README, video, minh chứng AI, tối thiểu ba ca thử và bàn giao | A–E; quyền repo/hosting; thông tin VPS khi có; điều kiện nộp BTC |

P0/P1 ở đây là **thứ tự giải quyết và kiểm chứng**, không cho phép bỏ P1 đã được người dùng yêu cầu. Không khóa bản PDF/HTML/PPTX sau thao tác xuất text; bốn bộ xuất cùng đọc một snapshot.

**3. Đường phụ thuộc và trách nhiệm tích hợp**

`Từ điển dữ liệu + công thức + bộ số tham chiếu` → `nhập/xác nhận/localStorage` → `KPI/bộ lọc/snapshot` → song song `dashboard`, `AI/chatbot`, `bốn trình bày báo cáo` → `tích hợp online + kiểm thử + hồ sơ`.

Một contract ghi rõ ngày/kỳ, nguồn, đơn vị tiền tệ, loại kết quả, số thiếu, số 0, phạm vi ảnh, bộ lọc và version snapshot. Thanh Dũng chịu trách nhiệm tính KPI và dữ liệu chuẩn; Trịnh Khoa nhận số đã tính để hiển thị, không tính lại; Lộc gửi số đó qua backend tới AI, không để model tự tạo KPI. Lộc quản lý ghép nhánh, cấu hình online và checklist release; thay đổi contract cần Thanh Dũng và người bị ảnh hưởng review. Bộ xuất PDF/HTML/PPTX do ba người khác nhau làm nhưng kiểm bằng cùng một bộ số tham chiếu.

**4. Mốc kiểm chứng đề xuất theo hạn công khai**

**Phân bổ 4 giờ/người/ngày (mức thời gian đã được người dùng xác nhận; đầu việc là lịch đề xuất):**

| Ngày | Thanh Dũng · dữ liệu/KPI/PDF | Trịnh Khoa · UX/dashboard/text/PPTX | Lộc · AI/chatbot/HTML/tích hợp | Cổng kiểm chứng cuối ngày |
|---|---|---|---|---|
| 06/11 · 4 giờ/người | Từ điển dữ liệu, công thức, bộ số mẫu; spec nhập/sửa/lưu và snapshot | Luồng ba góc nhìn, trạng thái và thiết kế responsive thiết yếu; spec text/PPTX | Contract AI, ba gợi ý/chatbot, cấu hình router VPS để trống; tiêu chí hosting và tích hợp | Plan thực thi/spec/thiết kế/contract được review theo workflow; nếu chưa đủ thì chưa giao code phụ thuộc |
| 07/11 · 4 giờ/người | Nhập tay nhiều dòng, localStorage, KPI, ca thiếu/sai | Dashboard KPI và ba biểu đồ ngày, bộ lọc, text copy và mobile cơ bản | Backend adapter, AI nhận xét/ba gợi ý, kết nối phần hiển thị và bản online thử | Luồng năm yêu cầu BTC chạy trên bản thử; phản hồi giả lập nếu có được gắn nhãn, chưa tính là AI thật |
| 08/11 · 4 giờ/người | Excel/CSV, text copy, ảnh có xem trước/sửa; PDF theo snapshot | Hoàn thiện ba góc nhìn, PPTX theo snapshot, kiểm tra responsive | Chatbot cơ bản, HTML email, thử 9Router VPS nếu có mã/Gemini dự phòng, ghép bản online | Bốn nguồn nhập và bốn loại báo cáo có ca thử riêng; ghi rõ mục nào chưa đạt và báo người dùng ngay |
| 09/11 · 4 giờ/người | Sửa lỗi nhập/KPI/PDF, ghi kết quả ca thử thiếu/sai/biên và phần README dữ liệu/công thức | Sửa lỗi giao diện/text/PPTX, quay video tối đa hai phút và kiểm tra link trên thiết bị khác | Kiểm tra AI thật/fallback và link online; ghép README/minh chứng AI/source ZIP, điều phối nộp | Chạy lại luồng đầu-cuối và quyền mở link; chốt hồ sơ, nộp trước 23:59 giờ Việt Nam |

Phân bổ này dành **12 giờ/người cho chuẩn bị, build và tích hợp 06–08**, rồi 4 giờ/người ngày 09 cho sửa lỗi/hồ sơ. Khối lượng của bốn cách nhập, bốn định dạng xuất, AI và chatbot có thể vượt 48 giờ công gộp; đây là **rủi ro đỏ**, không được ghi là cam kết hoàn thành tất cả. Kết quả kiểm chứng cuối 07 và 08 quyết định có cần xin người dùng thêm sức người/thời gian hoặc điều chỉnh phạm vi. Không tự cắt một nhu cầu đã chốt.

| Mốc | Bằng chứng cần có để đi tiếp | Nếu chưa đạt |
|---|---|---|
| 05/11: Plan và phản biện | Plan được soi về tải việc, phụ thuộc, điểm nghẽn; người dùng đã xác nhận 4 giờ/người/ngày | Không cộng bốn giờ ngày 05 vào năng lực còn lại |
| 06/11: Plan thực thi/spec/thiết kế responsive/baseline | Contract dữ liệu/KPI/snapshot và ca tham chiếu được cả nhóm hiểu; luồng và trạng thái màn hình thiết yếu được duyệt; quyết định hosting theo khả năng backend, export và cấu hình VPS; repo có baseline. Nếu thiết kế chi tiết chưa đạt, chưa gọi là đã qua cổng thiết kế | Chưa giao phần code phụ thuộc; báo người dùng nếu khó giữ đủ phạm vi trước hạn |
| 07/11: Luồng BTC trên bản thử và các nhánh mở rộng | Nhập tay → lưu → biểu đồ/KPI → ba gợi ý → copy text chạy trên bản thử; Excel/CSV/text, ảnh, chatbot và các bộ xuất có bằng chứng tiến độ riêng; adapter router có cấu hình trống và contract rõ. Nếu gợi ý dùng phản hồi giả lập trong dev, ghi rõ **chưa nghiệm thu AI thật** | Ưu tiên sửa đường BTC; báo ngay phần mở rộng gặp lỗi cụ thể, không ẩn khỏi danh mục |
| 08/11: Tích hợp online | Link online, localStorage, bốn định dạng xuất và các nguồn nhập được thử; router VPS thật được thử nếu có mã, fallback được kiểm tra; ba ca BTC ghi kết quả thực tế | Nếu chưa có mã VPS, ghi rõ trạng thái chưa kiểm chứng; dùng Gemini dự phòng theo cấu hình đã duyệt nếu sẵn sàng, không giả kết quả Codex |
| 09/11: Khóa hồ sơ và nộp trước 23:59 | Source ZIP/README, link online, video tối đa 2 phút, minh chứng AI tối đa 1 trang/5 ảnh, bảng kiểm thử, quyền truy cập link được kiểm tra trên thiết bị khác; thời gian nộp được xác nhận | Báo người dùng trước hạn về phần chưa đạt; không sửa tính năng sau hạn trái thể lệ |

Các mốc 06–09/11 là **đích kiểm chứng rất gấp**. Người dùng đã xác nhận mỗi người có 4 giờ/ngày, nhưng chưa có kết quả hoàn thành thực tế hoặc ca làm cụ thể. Việc hoàn thiện Plan thực thi, spec, thiết kế responsive và baseline trong cùng ngày 06/11 có rủi ro cao; nếu cổng này không đạt, lịch build phải được phản biện lại. Không bỏ qua workflow để gọi bản chưa có spec là hoàn tất; không đặt việc nộp bài vào phút cuối ngày 09.

**5. Rủi ro và điều chỉnh phạm vi cần người dùng quyết định**

| Rủi ro/điểm kích hoạt | Cách xử lý trong kế hoạch | Điều phải báo người dùng |
|---|---|---|
| Không có mã 9Router VPS hoặc endpoint/model không hoạt động ở mốc thử online | Phát triển adapter với cấu hình trống và phản hồi mô phỏng được gắn nhãn trong test; khi có mã thử từ backend online. Gemini là dự phòng đã duyệt nếu cấu hình thật khả dụng | Nguồn AI nào thực sự chạy trong bản demo, giới hạn/quota/chi phí; không tuyên bố Codex đã hoạt động khi chưa kiểm thử |
| Ảnh chụp không đọc ổn định hoặc chỉ là tổng kỳ | Giới hạn kiểu ảnh được công bố, luôn cho xem trước/sửa, giữ đúng phạm vi tổng kỳ và đường nhập tay | Loại ảnh nào chưa đạt và tác động; xin quyết định nếu phải thu hẹp kiểu ảnh |
| Bốn định dạng xuất không khớp hoặc PPTX/PDF lỗi | Dùng snapshot chung, mẫu trình bày gọn, thử cùng bộ số và mở file thật | Định dạng lỗi, ví dụ cụ thể và phương án sửa; không âm thầm chỉ giữ text |
| Khối lượng/giờ thành viên không cân | Chia lại phần độc lập, review chéo và ghép sớm; không để một người tự ôm contract lẫn mọi định dạng | Phần nào chậm, ai có thể hỗ trợ, tác động đến mốc |
| Online app hoạt động nhưng dữ liệu chỉ có trên một trình duyệt | Giải thích localStorage riêng, chuẩn bị dữ liệu demo tách rõ; không dùng giả định chia sẻ dữ liệu | Chỉ hỏi lại nếu nhu cầu dùng chung thay đổi; không thêm Supabase mặc định |
| Đến 08/11 vẫn thiếu một chức năng BTC hoặc ca thử | Dừng mở rộng mới, sửa luồng BTC và hồ sơ trước; giữ danh sách mở rộng chưa đạt và báo ngay | Cần người dùng quyết định phương án nộp/phạm vi nếu không thể đáp ứng toàn bộ mục tiêu đã chốt |

Không tự chuyển AI thật thành mock trong bản nộp chỉ vì thiếu mã. BTC bảng B cho phép mock minh bạch, nhưng đó là phương án cần người dùng quyết định và phải ghi trên app/README. Không tự hứa tất cả phần mở rộng sẽ hoàn thiện trong thời gian chưa được xác minh.

**6. Rà soát đóng góp và chứng cứ**

Mỗi owner nhận tiêu chí nghiệm thu theo `team-assignment-guide.md`. Khi build, mỗi PR dùng `assets/templates/pr-review-ai.md`: giải thích hai quyết định và đánh đổi bằng lời của mình, dữ liệu thử/kết quả thực tế, phần AI hỗ trợ, một ca lỗi/biên, câu hỏi từ reviewer khác owner. Không dùng phần trăm code AI để đo đóng góp. Ba thành viên cùng đối chiếu ít nhất ba ca BTC và có thể giải thích luồng sản phẩm trong phần hỏi đáp.

**7. Điều kiện chuyển sang phản biện Plan kế hoạch**

Plan này đủ để phản biện khi các mảng P0/P1, phụ thuộc, owner/reviewer, mốc kiểm chứng, rủi ro router/ảnh/bốn định dạng, đường điều chỉnh phạm vi và đầu ra hồ sơ đã rõ. Phản biện phải thử: có đủ sức người trong thời gian còn lại không; mốc 06/11 cho spec/design có khả thi không; hợp đồng dữ liệu có đến đủ sớm cho ba nhánh; bản online có chứng cứ AI thật không; bốn định dạng có thật sự nhất quán không; ai có quyền dừng/đổi phạm vi. Sau phản biện, chỉ chuyển Plan thực thi chi tiết khi rủi ro lớn có chủ xử lý và giả định được ghi rõ. Không chuyển thẳng sang build.
