**Bàn giao phiên và phát hành skill cho nhóm**

Gói hiện tại là 0.1.0, chứa bối cảnh và chiến lược đề xuất sau hai vòng phản biện. Chưa phải bản đủ điều kiện build module. Không có tài khoản, secret, app hoặc dịch vụ 9Router trong gói.

**Dùng ở phiên mới**

Nếu skill đã được cài và công cụ nhận diện, gọi `$vibecode-team`. Nếu chưa cài, yêu cầu AI đọc `vibecode-team/SKILL.md` trong thư mục đã giải nén, sau đó đọc state và các reference được dẫn. Với môi trường ChatGPT không hỗ trợ cài skill kiểu Codex, đưa tài liệu vào phiên hoặc Project theo tính năng môi trường có; không hứa chỉ tải ZIP lên là tự cài/nhớ ở mọi phiên.

Lời mở phiên chiến lược:

> Dùng Vibecode-Team. Đọc SKILL.md, project-state.json, project-context.md, strategy-review.md và product-strategy.md. Bản chiến lược hiện là đề xuất sau hai vòng phản biện, chưa được tôi duyệt. Giúp tôi chốt các quyết định còn mở; khi tôi đồng ý mới chuyển sang Plan kế hoạch. 9Router đã cài sẵn, chỉ kết nối app. Không thiết kế hoặc build app ở bước này.

Lời mở phiên đã được cho phép sang kế hoạch:

> Dùng Vibecode-Team và bản chiến lược tôi đã chốt. Đối chiếu trạng thái/phê duyệt trong tài liệu rồi lập Plan kế hoạch theo workflow của nhóm; ghi rõ nguồn lực còn thiếu và các phụ thuộc. Chưa build. Nếu tài liệu chưa có bằng chứng bản chiến lược đã chốt, nêu đúng phần thiếu thay vì tự nhận đã duyệt.

**Cập nhật bối cảnh có kiểm soát**

Sau mỗi quyết định quan trọng, cập nhật tài liệu chịu trách nhiệm và state: nội dung, nguồn quyết định, trạng thái, ngày, phiên bản, tác động lên bước sau. Phân biệt confirmed/proposed/open/superseded. Không sao chép nguyên chat dài vào skill; lưu phần thay đổi quyết định và liên kết artifact.

`skill_version` dùng phiên bản tăng dần cho gói phát hành; `context_revision` nhận biết nội dung dự án. Đổi workflow/contract có ảnh hưởng cần ghi tác động và cập nhật bên phụ thuộc. Không tự hạ trạng thái toàn bộ dự án vì một sửa nhỏ; chỉ đánh dấu phần cần duyệt lại.

Trước khi kết thúc, dùng [mẫu bàn giao](../assets/templates/session-handoff.md). Người dùng không phải nhớ việc đã quyết định ở phiên nào.

**Mốc nhắc trước khi build module**

Khi thiết kế responsive đã duyệt và chuẩn bị đóng gói GitHub, hoặc người dùng nói bắt đầu chia module/build, nhắc cập nhật skill theo lời nhắc trong SKILL.md. Ghi `reminder_delivered_for_revision` khi đã nhắc trong phiên. Nếu bản đã phát hành cho build khớp revision hiện hành thì không nhắc lại. Khi contract/design thay đổi sau đó, đánh dấu gói cũ không còn khớp và nhắc cập nhật phần ảnh hưởng.

Lời nhắc chỉ hoạt động khi một phiên đang đọc/dùng skill. Không phải lịch hẹn, không chạy nền, không tự gửi cho thành viên.

**Gói cho cả nhóm trước build cần chứa**

- Bản chiến lược/kế hoạch/plan thực thi/spec đã được duyệt, cùng trạng thái và nguồn xác nhận.
- Design system, thiết kế responsive và trạng thái màn hình được duyệt; link nếu artifact không thể gói trực tiếp, đã kiểm tra quyền đọc.
- Từ điển chỉ số, contract giữa module, dữ liệu mẫu đã ẩn thông tin riêng và kết quả kỳ vọng.
- Owner/reviewer/module boundaries, phụ thuộc và điều kiện tích hợp; quy ước GitHub.
- Repository URL, baseline commit/tag và vị trí tài liệu chuẩn; không tự chế commit/tag chưa tồn tại.
- Cấu hình cần có bằng tên biến và hướng dẫn cấu hình, không chứa giá trị bí mật.
- Phần việc còn mở, giới hạn đã biết, quyết định mới và việc phiên sau phải tiếp tục.

Nếu thiếu phần trên, có thể đóng gói dưới trạng thái draft để thảo luận; không đánh dấu `ready_for_module_build` chỉ vì đã tạo được ZIP.

**Tạo ZIP có thể kiểm tra lại**

Dùng Python 3 với script đi kèm:

```text
python -X utf8 scripts/package_skill.py --output ../Vibecode-Team-v0.1.0.zip
python -X utf8 scripts/package_skill.py --verify ../Vibecode-Team-v0.1.0.zip
```

Chạy từ thư mục skill; thay phiên bản tên ZIP theo `project-state.json`. Script chỉ dùng thư viện chuẩn Python, tự xác định thư mục skill, không tải mạng, không cài đặt, không sửa ứng dụng, không ghi đè ZIP đã có. Manifest trong ZIP ghi version/revision và SHA-256 từng file để phát hiện sai lệch khi chuyển gói; checksum không thay thế xác thực người phát hành.

Trước đóng gói: kiểm tra link/tài liệu, rà thông tin riêng và secret, xác nhận source of truth, chạy validator skill nếu môi trường có. Script đóng gói không thay review nội dung hoặc kiểm thử app. Không nhét thư mục repository/node_modules/database/token của 9Router vào gói.

Người dùng chủ động gửi cùng ZIP cho ba thành viên. Chỉ ghi `shared_by_user=true` khi có xác nhận đã gửi, không suy từ việc tạo gói. Khi nhận, mỗi người kiểm tra phiên bản và baseline trước khi bắt đầu. Các thay đổi mới quay về repo/tài liệu chuẩn và PR; không tự phát hành ba bản skill khác nhau như ba nguồn chuẩn.
