## PR docs: C2 snapshot, C4 luồng và spec màn hình (Trịnh Khoa)

**Base:** `codex/plan-handoff` (chưa merge vào main). **Chưa có code app.**

### Việc đã làm
- `docs/khoa/user-flow.md`: luồng, bộ lọc kỳ, trạng thái, responsive
- `docs/khoa/report-snapshot-contract.md`: snapshot chung cho text/PDF/HTML/PPTX/AI (contractVersion 0.1-draft)
- `docs/khoa/screen-spec.md`: 9 màn hình, prompt Stitch

### Chưa làm / chưa đạt
- Chưa đối chiếu C1 của Dũng (chưa có trên repo)
- Thiết kế Stitch chưa xong, chưa được duyệt
- Chưa chạy thật vì chưa có code

### Hai quyết định chính
1. Snapshot bất biến, dữ liệu đổi thì tạo snapshot mới + banner. Đánh đổi: tốn thêm một bước cập nhật, nhưng không gửi báo cáo lệch mà không biết.
2. Thiếu = `null`, khác 0. Đánh đổi: biểu đồ phải xử lý khoảng trống.

### AI đã hỗ trợ
Soạn nháp cấu trúc và prompt Stitch; tôi đã đọc và tự giải thích được các quy tắc.

### Ca lỗi/biên (trên giấy)
0 click → CPC `not_computable`, hiển thị "Không tính được". Ngày thiếu → `null`.

### Cần review
- Dũng: CTR click/reach hay click/impressions; tên trường khớp C1 không
- Lộc: khối `ai` khớp C3 không; công nghệ giao diện đề xuất HTML/CSS/JS thuần
- Bảng câu hỏi ở cuối `report-snapshot-contract.md`
