# PR: Ba góc nhìn dashboard + biểu đồ theo ngày + báo cáo Text + PPTX (Khoa · U1, K2, R1, R4)

**Người gửi:** Trịnh Khoa (UX responsive, dashboard, text, PPTX)
**Reviewers:** Dũng (KPI/dữ liệu), Lộc (điều phối, AI, HTML email)
**Nhánh:** `khoa/u1-dashboard-text-pptx` · **Dựa trên:** `dung/r2-pdf-export` (PR #2, head `bce218f`)
**Base đề xuất:** `dung/r2-pdf-export` để diff chỉ có phần của Khoa; đổi base sang `codex/plan-handoff` sau khi PR #2 được duyệt/merge. **Không tự merge.**

> [!IMPORTANT]
> Chưa có xác nhận của nhóm/thầy về spec và thiết kế (xem `docs/khoa/*`). Code này làm trước theo yêu cầu "có kết quả để xem"; nếu nhóm không duyệt thiết kế thì cần sửa lại.

## 1. Cách chạy
```bash
git fetch origin
git switch khoa/u1-dashboard-text-pptx
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra build
```
Dữ liệu mẫu: dùng ba nút **Bộ 1 / Bộ 2 / Bộ 3** trên thanh trên cùng (của Dũng). Muốn thấy **ngày thiếu**: nạp Bộ 1 rồi xóa dòng 03/11 bằng bảng ở tab Tổng quan (ca đã chạy dưới đây bỏ 03/11).

Chạy lại kiểm thử trình duyệt (Edge, cần `playwright-core` và `pizzip` cài riêng ngoài repo):
`node docs/khoa/evidence/e2e.cjs <thư-mục-xuất>` khi `npm run dev` đang chạy.

## 2. Ảnh chạy thật (thư mục `docs/khoa/evidence/`)
| Ảnh | Nội dung |
|---|---|
| `desktop-overview.png`, `desktop-analysis.png`, `desktop-report.png`, `desktop-report-stale.png` | Ba tab desktop 1440px; banner báo cáo cũ |
| `mobile-overview.png`, `mobile-analysis.png`, `mobile-report.png` | Mobile 390px, tab dưới, nút Sao chép cố định |
| `pptx-slide1..4.png` | 4 slide xuất từ **PowerPoint thật** (mở file `.pptx` rồi xuất ảnh) |

Mẫu đầu ra: `docs/khoa/samples/sample-report-khoa.txt` và `sample-report-khoa.pptx`.

## 3. Đã xong / chưa xong / lỗi đã biết
**Đã xong (có chạy thật)**
- Ba tab Tổng quan / Phân tích / Báo cáo dùng chung **một bộ lọc kỳ** (Toàn bộ, 7 ngày gần nhất tính lùi từ ngày mới nhất, Tùy chọn từ–đến) và một snapshot.
- Ba biểu đồ reach / chi phí / đơn theo ngày, có nhãn đơn vị; **ngày không có dòng dữ liệu để khoảng trống, không vẽ 0**; ngày đó cũng hiện trong bảng ("Không có dữ liệu") và banner cảnh báo.
- Báo cáo **Text**: xem trước + nút Sao chép (cố định cuối màn hình trên mobile).
- Báo cáo **PPTX**: tải trực tiếp, không cần xuất text trước; 4 slide 16:9.
- Snapshot báo cáo bất biến: đổi kỳ/dữ liệu khi đang ở tab Báo cáo → banner "Dữ liệu đã thay đổi" + nút "Cập nhật báo cáo"; text/PPTX/PDF cùng dùng bản đã đóng băng.
- Không tính KPI riêng: mọi chỉ số lấy từ `snapshot.kpis[*].formatted` và `snapshot.totals` của `kpiEngine`.

**Chưa xong**
- **HTML email** (phần của Lộc): thẻ có trong giao diện nhưng bị khóa, ghi "chưa làm".
- **Gợi ý AI / chatbot**: snapshot của Dũng chưa có khối `ai`; text/PPTX ghi "chưa có gợi ý AI".
- Giao diện đang **tối (theo app của Dũng)**, chưa theo thiết kế Stitch sáng kiểu Apple; **tablet** chưa kiểm thử riêng.
- Biểu đồ PPTX: bản này dùng bảng theo ngày, chưa có biểu đồ trong slide.
- Chưa so khớp với `sample-report-thanh-dung.pdf` của Dũng bằng số tự động; chưa đo trên điện thoại thật (chỉ giả lập 390px bằng Edge).
- Chưa kiểm tra ca Bộ 2 (dữ liệu lỗi) và Bộ 3 (biên) qua giao diện; chỉ ca bỏ ngày 03/11.

**Lỗi/hạn chế đã biết**
1. Chuyển tab rồi quay lại Báo cáo sẽ tạo lại báo cáo từ dữ liệu hiện tại (banner chỉ hiện khi đổi dữ liệu/kỳ ngay trong tab Báo cáo).
2. Bảng theo ngày trên mobile cuộn ngang trong khung.
3. Slide 3 chỉ hiện 12 ngày đầu; kỳ dài hơn bị cắt (có ghi chú).
4. `totalDays` trong snapshot của Dũng là số dòng, không phải số ngày lịch; giao diện tự tính "x/y ngày có dữ liệu" từ trục ngày.
5. Đã sửa trong quá trình thử: chọn "Tùy chọn" mà chỉ đặt ngày Từ thì bộ lọc không có tác dụng (nay đầu còn lại lấy theo dữ liệu).

## 4. Ca lỗi/biên đã kiểm tra
Bộ 1 bỏ ngày 03/11 (4 ngày, 1 ngày thiếu). Kết quả mong đợi tính tay: chi phí 2.370.000 · reach 39.500 · click 1.140 · đơn 48 · CTR 1.140/39.500 = 2,89% · CPC 2.370.000/1.140 = 2.079 · chi phí/đơn 2.370.000/48 = 49.375.

| Kiểm tra | Kết quả |
|---|---|
| Text chứa kỳ 01/11–05/11, 5 số trên, ngày thiếu 03/11 | Đạt |
| Clipboard = nội dung xem trước (desktop, mobile) | Đạt |
| PPTX mở được trong PowerPoint, 4 slide, số/kỳ khớp, "Không có dữ liệu" ở 03/11, giữ dấu tiếng Việt | Đạt |
| 3 biểu đồ hiển thị, 03/11 là khoảng trống (xem `mobile-analysis.png`) | Đạt (nhìn ảnh) |
| Đổi kỳ ở tab Báo cáo → banner báo cáo cũ | Đạt |
| Mobile 390px không tràn ngang, nút Sao chép cố định | Đạt |
| Không có lỗi console/page | Đạt |
Kết quả đầy đủ: `docs/khoa/evidence/results.json`.

## 5. Dữ liệu nhận vào / trả ra (để Lộc nhờ Codex kiểm tra ghép nối)
**Nhận vào:** `CampaignReportSnapshot` đúng như `src/types/campaign.ts` của Dũng (không đổi), do `calculatePeriodAggregates(records)` tạo. Khoa chỉ thêm bước **lọc bản ghi theo kỳ trước khi đưa vào hàm của Dũng**:
```ts
interface PeriodFilter { preset: 'all' | 'last7' | 'custom'; from?: string; to?: string } // YYYY-MM-DD
// App.tsx: calculatePeriodAggregates(filterRecords(records, periodFilter))
```
Các trường snapshot được dùng: `meta.{snapshotId,generatedAt,periodStart,periodEnd,totalDays}`, `totals.{spend,reachSum,clicks,orders}`, `kpis.{ctr,cpc,cpa}.{formatted,warningMessage}`, `dailyRecords[]`, `dataIntegrity.warnings`, `summaryRecord?`.

**Trả ra:**
```ts
buildTextReport(snapshot, dataVersion): string          // src/report/textReport.ts
downloadPptx(snapshot, dataVersion): Promise<string>     // src/report/pptxReport.ts → tên file .pptx
buildDailySeries(snapshot): { points: DayPoint[]; missingDates: string[] }  // reach/spend/orders = null khi KHÔNG có dòng
dataVersionOf(snapshot): string                          // hash dữ liệu, dùng phát hiện báo cáo cũ
```
Quy ước hiển thị: ô không có dòng dữ liệu = `null` (khoảng trống). Một dòng nhập tường minh toàn 0 (ngày tạm dừng) vẽ đúng 0.

**Thay đổi chạm vùng chung:** `src/App.tsx` (thêm tab, bộ lọc, truyền snapshot đóng băng cho `PdfExportModal`), `package.json`/`package-lock.json` (thêm `pptxgenjs`). Không sửa `kpiEngine`, `types`, `storage`, `validation`.

## 6. Không khớp cần nhóm chốt (xem `docs/khoa/c1-crosscheck.md`)
- Engine đổi ô thiếu thành 0 (`Number(x)||0`) và CTR khi Reach = 0 có `formatted = '0.00%'` dù `value = null`.
- Ca 3.3 gộp dòng trùng bằng cộng; cần xác nhận luôn qua bước người dùng xác nhận.
- Snapshot chưa có khối `ai` và `dataVersion` (Khoa tạm tính `dataVersion` ở phía giao diện).
- PR #2 chứa code trước khi spec/thiết kế được duyệt; Lộc quyết định.

## 7. Hai quyết định chính và AI đã hỗ trợ
1. **Báo cáo đóng băng trong state của tab Báo cáo**, thay vì luôn đọc snapshot sống. Lợi: text/PPTX/PDF luôn cùng số, báo được khi dữ liệu đổi. Đánh đổi: thêm một bước bấm "Cập nhật báo cáo".
2. **Ngày không có dòng = khoảng trống, ngày có dòng toàn 0 = vẽ 0.** Lợi: không bịa số và vẫn thể hiện ngày tạm dừng. Đánh đổi: phụ thuộc việc dữ liệu nhập phân biệt được "không nhập" và "nhập 0".

AI hỗ trợ viết nháp component/hàm và script kiểm thử; Khoa đọc lại, chạy thật và tự giải thích hai quyết định trên.
