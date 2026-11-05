---
name: vibecode-team
description: "Điều phối dự án Dashboard KPI Facebook Ads đề 7 của nhóm Lộc, Thanh Dũng, Trịnh Khoa: tiếp nối bối cảnh, phản biện, chốt chiến lược và kế hoạch, đặc tả, thiết kế responsive, bàn giao GitHub và build theo module. Dùng khi làm việc với Vibecode-Team hoặc tiếp tục dự án này."
metadata:
  version: "0.1.0"
---

**Vibecode-Team — cách làm việc chung của nhóm**

Hỗ trợ nhóm đi từ quyết định sản phẩm đến build có kiểm soát phạm vi. Trao đổi bằng tiếng Việt rõ ràng. Ưu tiên người trực tiếp chạy Facebook Ads; dùng góc nhìn cấp trên, khách hàng và đồng nghiệp marketing để phản biện, sau đó tổng hợp với vai trò giám đốc sản phẩm. Nhập vai là mô phỏng lập luận, không phải nghiên cứu phỏng vấn thực tế.

**Bắt đầu hoặc tiếp nối một phiên**

1. Đọc [project-state.json](project-state.json) và [bối cảnh](references/project-context.md). Xác định phiên bản, giai đoạn, quyết định đã duyệt và bước đang được giao. Chỉ đọc các tài liệu còn lại khi liên quan.
2. Nếu đang làm trong repository đã có tài liệu mới hơn, dùng đường dẫn nguồn chuẩn được ghi trong state; kiểm tra revision/commit và quyết định thực tế. Gói ZIP là ảnh chụp tại một thời điểm, không tự đồng bộ các phiên.
3. Ưu tiên chỉ dẫn mới nhất của người dùng. Không biến đề xuất của AI, việc tạo skill hoặc yêu cầu phản biện thành phê duyệt chiến lược. Nếu hai nguồn được coi là đã duyệt mâu thuẫn, nêu đúng điểm mâu thuẫn và hỏi phần ảnh hưởng; tiếp tục phần độc lập.
4. Nêu ngắn: đang ở giai đoạn nào, sẽ tạo/cập nhật đầu ra nào. Không yêu cầu người dùng kể lại bối cảnh đã có.

**Luồng đã được người dùng yêu cầu**

Chiến lược → Phản biện → Kế hoạch → Phản biện → Thực thi chi tiết → Spec giao diện và tính năng → Tham khảo mẫu thiết kế nếu cần → Thiết kế giao diện chi tiết responsive → Đóng gói/đồng bộ GitHub → Chia module và build.

Đọc [workflow](references/workflow.md) cho đầu ra, tiêu chí chuyển bước và cách phản biện. Tạo và hoàn thiện đầu ra trong bước được giao một cách chủ động. Không chuyển sang thiết kế/build khi người dùng chỉ đang yêu cầu chiến lược. Chỉ dẫn rõ như “chốt phương án này, sang kế hoạch” là đủ để chuyển bước; không hỏi lại cùng một phê duyệt. Có thể quay lại bước trước khi xuất hiện thay đổi ảnh hưởng, nhưng chỉ cập nhật phần liên quan.

**Định tuyến tài liệu**

| Nhu cầu | Tài liệu cần đọc |
|---|---|
| Tiếp tục chiến lược | [Hai vòng phản biện](references/strategy-review.md), [chiến lược đề xuất](references/product-strategy.md) |
| Viết/chỉnh kế hoạch, spec hoặc thiết kế | [Workflow](references/workflow.md) và tài liệu của bước trước đã được duyệt |
| GitHub, chia việc, build, tích hợp | [Phối hợp nhóm](references/team-build.md) và spec/module đang được giao |
| Cập nhật skill, đóng gói, đổi phiên | [Bàn giao và phiên bản](references/packaging-handoff.md) |
| Tạo phiếu module hoặc biên bản phiên | Mẫu trong [assets/templates](assets/templates) |

**Những điều phải giữ đúng trong dự án này**

- Đây là app dashboard quảng cáo: nhập dữ liệu, xem KPI, AI phân tích/hỏi đáp, xuất báo cáo. Website/inbox chỉ là ngữ cảnh tùy chọn để hiểu chỉ số; không bắt chọn quy trình bán hàng, không tự mở rộng thành CRM.
- Người dùng đã có 9Router cài sẵn và sẵn sàng dùng. Chỉ tích hợp app với dịch vụ đó; không cài, build, thay router hoặc lấy token tài khoản từ máy. Nguồn chính theo lựa chọn của người dùng là Codex qua 9Router; Gemini API là dự phòng. Endpoint/model/quota thực tế chưa được kiểm chứng ở thời điểm đóng gói.
- KPI tính bằng logic xác định dùng chung. AI giải thích/đề xuất, không tạo ra số liệu gốc hoặc tính một bộ KPI khác. Không suy diễn ảnh tổng kỳ thành dữ liệu từng ngày; không đổi ô thiếu thành 0.
- Người dùng đề cao phong cách hiện đại tối giản kiểu Apple và UX tự hiểu. Thiết kế phải bao gồm mobile/tablet/desktop, trạng thái lỗi/rỗng/chờ và khả năng sửa dữ liệu.
- Nhóm có Lộc, Thanh Dũng, Trịnh Khoa. Gói trách nhiệm đã được người dùng giao trong `project-state.json`; mỗi người có 4 giờ/ngày trong 06–09/11. Không suy ra thế mạnh hoặc quyền quản lý từ thứ tự tên. Lộc điều phối tích hợp theo phân công, không tự đổi contract.
- Không hứa GitHub hoặc skill loại bỏ hoàn toàn xung đột. Dùng quy ước dữ liệu, một chủ sở hữu mỗi module, review và đối chiếu đầu ra để hạn chế xung đột logic.
- Thể lệ và ngày hạn là thông tin có thời điểm. Đọc nguồn BTC trước khi dùng chúng để lên lịch trong một phiên mới. Ghi rõ khác biệt giữa yêu cầu BTC, lựa chọn người dùng, đề xuất sản phẩm và điều chưa biết.

**Nhắc cập nhật skill đúng mốc**

Khi thiết kế responsive đã được chốt và chuẩn bị đồng bộ GitHub/chia module, hoặc người dùng yêu cầu bắt đầu build từng tính năng, đọc trạng thái `team_release` và nhắc:

“Đã đến mốc cập nhật Vibecode-Team trước khi cả nhóm build. Cần chốt bản kế hoạch, spec, thiết kế responsive, hợp đồng dữ liệu/API, chủ sở hữu module và phiên bản GitHub; sau đó đóng gói cùng một bản skill để gửi Lộc, Thanh Dũng, Trịnh Khoa.”

Đây là lời nhắc theo ngữ cảnh khi skill được dùng, không phải thông báo chạy nền. Không tự tạo automation hoặc gửi tin cho thành viên. Nếu gói đã cập nhật và khớp revision hiện tại, không lặp lại lời nhắc. Không dừng việc chuẩn bị độc lập chỉ để đợi lời nhắc được xác nhận; không giao build phụ thuộc vào spec/contract chưa chốt.

**Kết thúc phiên**

Cập nhật các file trạng thái trong phạm vi được phép, hoặc cung cấp bản cập nhật nếu môi trường chỉ đọc. Ghi nội dung đã làm, quyết định do ai xác nhận, điều còn mở, artifact mới nhất, bước kế tiếp và trạng thái nhắc đóng gói. Dùng [mẫu bàn giao](assets/templates/session-handoff.md). Khi đề xuất đã hoàn chỉnh, chỉ hỏi quyết định cụ thể còn thiếu; nếu cần dừng do quy trình, giải thích đây là trình tự người dùng đã yêu cầu và dẫn tài liệu liên quan.

Không tự push, deploy hay gửi gói cho người khác chỉ vì đang dùng skill. Khi người dùng đã giao rõ các thao tác đó trong bước hiện tại, thực hiện trong phạm vi đã cho phép và không xin xác nhận lặp lại. Không yêu cầu mọi thành viên có cùng công cụ AI; nếu môi trường không hỗ trợ skill tự động, có thể đọc SKILL.md và các tài liệu đi kèm theo đường dẫn.
