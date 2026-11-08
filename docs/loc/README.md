# Bản tích hợp của Lộc — 08/11/2026

Nhánh `codex/loc-ai-integration` dựa trên `origin/khoa/u1-dashboard-text-pptx` (PR #3, `0c65060`), đã bao gồm `origin/dung/r2-pdf-export` (PR #2). Không merge hay sửa nhánh của hai bạn trên GitHub.

## Chạy trên máy

Yêu cầu Node.js 22+ và npm. Trong thư mục repo:

```sh
npm install
# Máy mới: copy .env.example thành .env.local, điền khóa ở máy chủ.
npm run dev
```

Mở http://127.0.0.1:5173. Một lệnh khởi động Vite và API ở `127.0.0.1:3001`. `.env.local` không được Git theo dõi. Không đặt khóa trong biến `VITE_*` hoặc mã frontend. `npm run preview` chỉ xem bản frontend, không tự chạy API.

Chọn Bộ 1/2/3 → Báo cáo → Cập nhật báo cáo nếu thấy cảnh báo → Tạo nhận xét và 3 gợi ý. Mở mục hỏi KPI để chat. Chọn Text/PDF/HTML/PPTX để xuất trực tiếp. HTML có xem trước, copy mã và tải file; không tự gửi email. Đổi dữ liệu/kỳ không tự thay báo cáo đã đóng băng; bấm Cập nhật báo cáo sẽ bỏ AI cũ để tạo lại.

## Contract C3 và quyết định tích hợp

- `POST /api/ai/analyze`: `{ snapshot: CampaignReportSnapshot }` → `AiAnalysis`, gắn vào `snapshot.ai`.
- `POST /api/ai/chat`: `{ snapshot, question, history?: {role,content}[] }` → `{ answer, source, model, snapshotId }`.
- `GET /api/health`: chỉ trạng thái cấu hình và tên model, không trả key.
- `AiAnalysis`: `status:'ready'`, `source`, `model`, `generatedAt`, `snapshotId`, `dataVersion`, `summary`, đúng 3 `suggestions[{title,evidence,limitation,action,verification}]`. Schema thực thi tại `server/ai.ts`, type dùng chung tại `src/types/campaign.ts`.
- Server xác thực ngày/số và tính lại KPI bằng chính engine của Dũng; không tin KPI gửi từ trình duyệt. Prompt chỉ chứa số của snapshot đang chọn và cảnh báo, không gửi khóa qua frontend. AI không tự có quyền đọc dữ liệu khác.
- Gemini gọi trực tiếp, chưa qua 9Router. `GEMINI_MODEL=gemini-3.1-flash-lite` đã gọi thật thành công. Model thử ban đầu `gemini-3.8-flash` timeout; không dùng làm mặc định.
- Timeout 90 giây, không tự retry tốn hạn mức, tối đa 2 yêu cầu đồng thời. Lỗi trả thông báo an toàn; KPI và báo cáo không bị chặn. Chưa có xác thực người dùng: server chỉ bind loopback, bản này dành cho chạy máy cá nhân; chưa triển khai online.
- **Ô trống khác 0:** giữ bản nháp trống/sai, không cho lưu cho tới khi sửa. `DailyAdRecord` đã lưu tiếp tục dùng số hữu hạn không âm để tương thích Dũng/Khoa; chưa đổi toàn bộ schema lưu trữ sang nullable. Khi số liệu thiếu ở bản nháp, KPI là `null`, `missing_data`, hiển thị `—`; chia 0 là `null`, `zero_division`, không in `0.00%`. Số 0 phải nhập rõ. Bộ 2 cũ vẫn giữ `reach:0`, không suy đoán lại ô trống của dữ liệu đã lưu.
- **Ngày và bản ghi:** `meta.totalDays` là số ngày duy nhất. Bộ 3 có 3 ngày, 4 bản ghi. Biên kỳ tùy chọn được giữ trong snapshot để ngày thiếu đầu/cuối cũng xuất hiện là khoảng trống.
- Text, HTML và PDF dùng nguyên nhận xét từ `snapshot.ai`; PPTX giữ 4 slide KPI và thêm 4 slide khi có AI (nhận xét + mỗi gợi ý một slide).

Hai lựa chọn chính: dùng AI SDK phía máy chủ để khóa không đi vào bundle, đổi lại phải chạy thêm API; giữ snapshot đóng băng của Khoa để bốn báo cáo cùng phiên bản, đổi lại cần cập nhật báo cáo khi đổi dữ liệu.

## Kiểm chứng

```sh
npm run typecheck
npm test
npm run build
# Khi npm run dev đang chạy:
node docs/khoa/evidence/e2e.cjs docs/loc/evidence/regression
node scripts/verify-loc-ui.cjs
npx tsx scripts/verify-live-ai.ts
node scripts/verify-live-browser.cjs
```

- 8 kiểm tra tự động: số liệu 3 bộ, chia 0, ngày trùng/thiếu, ô trống, ngày sai, KPI bị giả mạo, schema 3 gợi ý, escape HTML.
- 21 kiểm tra trình duyệt kế thừa của Khoa: dashboard, kỳ, Text, PPTX, clipboard, 1440/834/390px, không lỗi console.
- 8 kiểm tra UI mới dùng **fixture**, không được gọi là bằng chứng AI thật: `evidence/ui-results.json`. File `sample-report-with-ai-fixture.pptx` và `sample-report.html` chứa dữ liệu kiểm thử.
- AI thật: `evidence/live-ai.json` (HTTP 200, 3 gợi ý); `evidence/live-browser.json` (trình duyệt → API → Gemini, chat thật, tải PDF); `live-browser-ai.png` và `live-report.pdf`.

AI hỗ trợ lập trình/kiểm thử; không tự khẳng định nhận xét AI luôn đúng. Người dùng cần đối chiếu căn cứ trước quyết định ngân sách.

## Giới hạn phát hiện từ bản bàn giao

1. OCR của Dũng là mô phỏng theo tên file, chưa đọc pixel ảnh. Đã thêm cảnh báo rõ trên modal; không coi là OCR thật hoàn tất. Không tự thay dữ liệu ảnh thành dữ liệu đáng tin.
2. Snapshot ảnh tổng kỳ vẫn được lưu riêng, chưa trở thành nguồn độc lập cho toàn bộ dashboard/AI/bốn báo cáo; luồng đã kiểm chứng ở đây dùng bản ghi theo ngày.
3. Chưa có 9Router và chưa deploy online. Nhánh tích hợp được bàn giao riêng để review. Trạng thái merge của PR #2 và #3 theo GitHub.
4. Bộ thư viện kế thừa có cảnh báo npm audit (3 mức high khi cài); bundle production còn lớn. Chưa thực hiện nâng cấp phá vỡ tương thích trong lần ghép này.
5. Chính sách cộng bản ghi trùng vẫn cần người nhập xác nhận; không đổi quy tắc nghiệp vụ cũ thành tự loại trùng.
