# PR: Spec/Thiết kế (C2, C4) + Ba góc nhìn dashboard, biểu đồ theo ngày, báo cáo Text & PPTX (U1, K2, R1, R4)

**Người gửi (Owner):** Trịnh Khoa (UX responsive, 3 góc nhìn dashboard, biểu đồ theo ngày, báo cáo Text, slide PPTX)
**Người nhận (Reviewers):** Thanh Dũng (KPI/dữ liệu/PDF), Lộc (điều phối, AI, Chatbot, HTML email)
**Nhánh làm việc:** `khoa/u1-dashboard-text-pptx` · **Dựa trên:** `dung/r2-pdf-export` (PR #2, head `bce218f`)
**Nhánh tài liệu tách riêng (nếu cần review chỉ docs):** `khoa/c2-c4-spec` (dựa trên `codex/plan-handoff`)
**Base đề xuất:** `dung/r2-pdf-export` (để diff chỉ hiện phần của Khoa), hoặc đổi sang `codex/plan-handoff` sau khi PR #2 được merge. **Không tự merge.**

> [!IMPORTANT]
> Spec/thiết kế (`docs/khoa/*`) chưa được nhóm/thầy duyệt chính thức. Bản code này được dựng theo yêu cầu của Lộc ("khi phần của các bạn có kết quả để xem, hãy đẩy lên nhánh riêng và gửi mình link PR") để cả nhóm có bản chạy thật, file Text/PPTX mẫu và schema Input/Output kiểm tra ghép nối.

---

## 1. CÁCH CHẠY & DỮ LIỆU MẪU

```bash
git fetch origin
git switch khoa/u1-dashboard-text-pptx
npm install
npm run dev        # Mở http://localhost:5173
npm run build      # Kiểm tra build production
```

- **Ba bộ dữ liệu mẫu C1 trên thanh trên cùng:** `Bộ 1` (5 ngày chuẩn), `Bộ 2` (thiếu Reach ngày 01/11, Clicks > Reach ngày 04/11), `Bộ 3` (0 click/0 đơn ngày 01/11, tạm dừng toàn 0 ngày 02/11, 2 dòng trùng ngày 03/11).
- **Tạo ca thiếu ngày trong kỳ:** bấm `Bộ 1`, ở bảng tab `Tổng quan` xóa dòng `03/11/2026`, rồi chuyển sang `Phân tích` và `Báo cáo`.
- **Chạy lại kịch bản kiểm thử trình duyệt tự động (17 kiểm tra trên Edge):**
  Khi `npm run dev` đang chạy tại `http://localhost:5173`, chạy `node docs/khoa/evidence/e2e.cjs docs/khoa/evidence` (cần `playwright-core` và `pizzip`).

---

## 2. ẢNH CHẠY THẬT & FILE MẪU TRONG REPO

### A. File báo cáo Text & PPTX mẫu (`docs/khoa/samples/`)
- Báo cáo Text mẫu: `docs/khoa/samples/sample-report-khoa.txt` (và các bản đối chiếu `docs/khoa/evidence/bo1-report-text.txt`, `bo2-report-text.txt`, `bo3-report-text.txt`).
- File Slide PPTX mẫu thật: `docs/khoa/samples/sample-report-khoa.pptx` (4 slide 16:9, mở bằng Microsoft PowerPoint thật không lỗi, giữ nguyên dấu tiếng Việt).

### B. Ảnh chứng cứ chạy thật (`docs/khoa/evidence/`)
| Nhóm | File ảnh trong `docs/khoa/evidence/` | Nội dung kiểm chứng |
|---|---|---|
| **Desktop 1440px (ca thiếu ngày 03/11)** | `desktop-overview.png`, `desktop-analysis.png`, `desktop-report.png`, `desktop-report-stale.png` | 3 tab Tổng quan / Phân tích / Báo cáo; biểu đồ ngắt đoạn tại ngày thiếu `03/11` (không vẽ về 0); banner báo cáo cũ khi đổi kỳ/dữ liệu |
| **Desktop 1440px (Bộ 2 & Bộ 3)** | `desktop-bo2-analysis.png`, `desktop-bo3-analysis.png` | Bộ 2 hiện cảnh báo `Reach = 0` và `Clicks > Reach`; Bộ 3 hiện `3/3 ngày có dữ liệu`, ngày tạm dừng `02/11` vẽ tại 0, cảnh báo `0 click`, `chưa có đơn`, `ngày trùng lặp 03/11` |
| **Tablet 834px** | `tablet-overview.png`, `tablet-analysis.png`, `tablet-report.png` | 3 góc nhìn trên kích thước tablet 834×1112, không tràn ngang |
| **Mobile 390px** | `mobile-overview.png`, `mobile-analysis.png`, `mobile-report.png` | Thanh tab cố định dưới đáy, nút `Sao chép` cố định ở màn Báo cáo, không tràn ngang |
| **Slide PPTX mở bằng PowerPoint thật** | `pptx-slide1.png`, `pptx-slide2.png`, `pptx-slide3.png`, `pptx-slide4.png` | 4 slide xuất trực tiếp từ Microsoft PowerPoint: Tiêu đề & kỳ, 7 thẻ KPI, bảng theo ngày (`03/11` ghi `Không có dữ liệu`), lưu ý dữ liệu |

### C. Tài liệu Spec & Thiết kế Stitch (`docs/khoa/`)
- `docs/khoa/user-flow.md`, `docs/khoa/report-snapshot-contract.md`, `docs/khoa/screen-spec.md`, `docs/khoa/design-review.md`, `docs/khoa/c1-crosscheck.md` và 13 ảnh mockup Stitch trong `docs/khoa/design/`.

---

## 3. ĐỐI CHIẾU SỐ LIỆU VỚI BẢNG TÍNH TAY & PDF CỦA DŨNG

| Bộ dữ liệu | Kỳ & số ngày | Số liệu trên Dashboard / Text / PPTX của Khoa | Kết quả đối chiếu với `kpiEngine` & PDF Dũng |
|---|---|---|---|
| **Bộ 1 (Chuẩn, 5 ngày)** | `01/11/2026 – 05/11/2026 (5/5 ngày có dữ liệu)` | Chi phí `2.970.000 đ` · Reach `49.500` · Click `1.460` · Đơn `60` · CTR `2.95%` · CPC `2.034 đ` · CPA `49.500 đ` | **Khớp 100%** với bảng tính tay C1 và `vibecode-team/assets/sample-report-thanh-dung.pdf` |
| **Bộ 1 bỏ ngày `03/11`** | `01/11/2026 – 05/11/2026 (4/5 ngày có dữ liệu)` | Chi phí `2.370.000 đ` · Reach `39.500` · Click `1.140` · Đơn `48` · CTR `2.89%` · CPC `2.079 đ` · CPA `49.375 đ` · Ghi chú thiếu `03/11/2026` | **Khớp 100%** giữa Dashboard, Text, PPTX; biểu đồ để trống `03/11`, bảng slide 3 ghi `Không có dữ liệu` |
| **Bộ 2 (Lỗi/Thiếu)** | `01/11/2026 – 04/11/2026 (4/4 ngày có dữ liệu)` | Chi phí `950.000 đ` · Reach `11.000` · Click `1.470` · Đơn `17` · CTR `13.36%` · CPC `646 đ` · CPA `55.882 đ` · Cảnh báo `01/11 Reach = 0` và `04/11 Clicks > Reach` | **Khớp 100%**, không sinh `NaN`/`Infinity` |
| **Bộ 3 (Biên/Số 0/Trùng)** | `01/11/2026 – 03/11/2026 (3/3 ngày có dữ liệu, 4 dòng bản ghi)` | Chi phí `650.000 đ` · Reach `13.000` · Click `100` · Đơn `3` · CTR `0.77%` · CPC `6.500 đ` · CPA `216.667 đ` · Cảnh báo `01/11 (0 click, chưa có đơn)`, `02/11 (tạm dừng = 0)`, `03/11 (2 dòng trùng)` | **Khớp 100%**, không sinh `NaN`/`Infinity` |

---

## 4. PHẦN ĐÃ XONG, CHƯA XONG & LỖI ĐÃ BIẾT

### A. Đã xong (17/17 kiểm tra tự động PASS — xem `docs/khoa/evidence/results.json`)
- **Ba góc nhìn (`Tổng quan`, `Phân tích`, `Báo cáo`)** dùng chung một bộ lọc kỳ (`Toàn bộ dữ liệu`, `7 ngày gần nhất` tính lùi từ ngày dữ liệu mới nhất, `Tùy chọn` từ–đến) và cùng một `CampaignReportSnapshot`.
- **Ba biểu đồ theo ngày (`Reach`, `Chi phí`, `Số đơn`)**: đọc từ `snapshot.dailyRecords`, có câu hỏi gợi mở và đơn vị trục. Ngày không có dòng bản ghi trả về `null` (khoảng trống, `spanGaps: false`), **không vẽ về 0**; ngày có dòng nhập tường minh toàn `0` (như `02/11` ở Bộ 3) vẽ đúng tại `0`.
- **Xuất báo cáo Text trực tiếp (`R1`)**: xem trước, sao chép 1 chạm trên cả desktop và nút cố định cuối màn hình mobile.
- **Xuất slide PPTX trực tiếp (`R4`)**: tải file `.pptx` 4 slide 16:9 trực tiếp từ snapshot mà không cần xuất Text trước; mở bằng PowerPoint thật.
- **Đóng băng snapshot báo cáo (`C2`)**: lưu ở `App.tsx`, giữ nguyên khi chuyển tab; khi dữ liệu hoặc bộ lọc kỳ thay đổi thì hiện banner cảnh báo `Dữ liệu đã thay đổi sau khi tạo báo cáo` + nút `Cập nhật báo cáo`. Nút mở PDF từ tab Báo cáo nhận đúng snapshot đã đóng băng.

### B. Chưa xong (ghi rõ trung thực)
1. **Định dạng HTML Email (`R3`)** và **Nhận xét/3 gợi ý AI + Chatbot (`A1`, `A2`)**: thuộc gói việc của Lộc, hiện thẻ HTML Email để trạng thái khóa (`chưa làm`) và mục AI trong báo cáo ghi rõ `Chưa có gợi ý AI trong bản này (phần AI do Lộc tích hợp)`.
2. **Giao diện sáng kiểu Apple trên Stitch**: code hiện tại giữ theme tối (`slate-950`) của nhánh Dũng để đồng nhất với các modal Nhập liệu/PDF của Dũng; bộ ảnh Stitch (`docs/khoa/design/`) còn thiếu một số màn tablet/mobile phụ (đã liệt kê trong `docs/khoa/design-review.md`).
3. **Biểu đồ trong file PPTX**: slide 3 hiện trình bày bảng số liệu theo ngày (tối đa 12 ngày đầu của kỳ, có ghi chú nếu dài hơn), chưa nhúng biểu đồ ảnh vào slide.
4. **Thiết bị di động vật lý**: đã kiểm thử tự động trên Microsoft Edge giả lập kích thước 390×844 và 834×1112, chưa chụp trên điện thoại vật lý riêng.

### C. Lỗi đã phát hiện và xử lý trong quá trình chạy thử
1. **Lỗi chọn kỳ `Tùy chọn` chỉ điền 1 đầu ngày**: ban đầu nếu chỉ điền ngày `Từ` mà chưa điền ngày `Đến` thì bộ lọc bỏ qua; đã sửa trong `resolvePeriod` để lấy biên dữ liệu cho đầu còn trống.
2. **Lỗi hiển thị `4/3 ngày có dữ liệu` ở Bộ 3**: do `snapshot.meta.totalDays` của Dũng đếm số dòng (`4` dòng vì ngày `03/11` có 2 dòng trùng) thay vì số ngày lịch có dữ liệu (`3` ngày); đã sửa trong `buildDailySeries` để đếm theo ngày duy nhất (`3/3 ngày có dữ liệu, 4 dòng bản ghi`).
3. **Lỗi thiếu cảnh báo dòng lẻ ở Bộ 2 và Bộ 3 trong báo cáo**: `snapshot.dataIntegrity.warnings` của Dũng chỉ chứa cảnh báo trùng ngày; đã bổ sung `collectDataNotes(snapshot)` đọc thêm `warningMessage` có sẵn trên từng dòng `snapshot.dailyRecords` (không tính lại KPI).
4. **Lỗi cắt khung biểu đồ Chart.js trên lưới 3 cột desktop**: đã thêm `min-w-0` cho thẻ biểu đồ và tắt animation khi dựng để biểu đồ hiển thị đủ các ngày ngay lập tức.

---

## 5. DỮ LIỆU NHẬN VÀO & TRẢ RA (ĐỂ LỘC DÙNG CODEX KIỂM TRA GHÉP NỐI)

### A. Dữ liệu Khoa nhận vào (Input)
Khoa dùng **nguyên vẹn** kiểu `DailyAdRecord` và `CampaignReportSnapshot` trong `src/types/campaign.ts` của Dũng (không sửa `kpiEngine.ts`, không tính KPI riêng):
```ts
// Bộ lọc kỳ dùng chung cho cả 3 góc nhìn (src/report/reportModel.ts)
export type PeriodPreset = 'all' | 'last7' | 'custom';
export interface PeriodFilter {
  preset: PeriodPreset;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

// Trong src/App.tsx: lọc bản ghi theo kỳ rồi gọi thẳng hàm SSOT của Dũng
const snap: CampaignReportSnapshot = calculatePeriodAggregates(filterRecords(records, periodFilter));
```

### B. Dữ liệu Khoa trả ra (Output)
```ts
// 1. Trục ngày liên tục cho biểu đồ & bảng (src/report/reportModel.ts)
export interface DayPoint {
  date: string;          // YYYY-MM-DD
  label: string;         // dd/mm
  hasRecord: boolean;    // false = ngày không có dòng dữ liệu
  reach: number | null;  // null khi hasRecord=false (để trống trên biểu đồ, KHÔNG vẽ 0)
  spend: number | null;
  orders: number | null;
}
buildDailySeries(snapshot: CampaignReportSnapshot): {
  points: DayPoint[];
  missingDates: string[];
  daysWithData: number;
  daysInRange: number;
}

// 2. Ghi chú dữ liệu tổng hợp từ snapshot & mã phiên bản phát hiện báo cáo cũ
collectDataNotes(snapshot: CampaignReportSnapshot): string[];
dataVersionOf(snapshot: CampaignReportSnapshot): string;

// 3. Xuất báo cáo Text (src/report/textReport.ts) và PPTX (src/report/pptxReport.ts)
buildTextReport(snapshot: CampaignReportSnapshot, dataVersion: string): string;
downloadPptx(snapshot: CampaignReportSnapshot, dataVersion: string): Promise<string>;
```

### C. Chỗ cần thống nhất với Dũng & Lộc (chi tiết tại `docs/khoa/c1-crosscheck.md`)
1. **Ghép AI của Lộc vào Snapshot (`C3`)**: hiện `CampaignReportSnapshot` trong `src/types/campaign.ts` chưa có trường `ai`. Khi Lộc thêm `ai?: { status, source, summary, suggestions }`, `buildTextReport` và `downloadPptx` của Khoa sẽ đọc thẳng từ `snapshot.ai` để thay dòng placeholder ở mục `4. GỢI Ý AI`.
2. **Phân biệt trống (`null`) với `0` ở cấp trường trong `DailyAdRecord`**: hiện `DailyAdRecord` của Dũng khai báo `spend/reach/clicks/orders: number` và `kpiEngine.ts` ép `Number(x) || 0` (ví dụ Bộ 2 dòng `01/11` để `reach: 0` để biểu diễn thiếu Reach, làm `ctr.formatted` ra `'0.00%'` dù `ctr.value === null`). Cần nhóm chốt có giữ cách biểu diễn này hay cho phép `null` cho ô trống.
3. **File PDF mẫu tĩnh của Dũng (`vibecode-team/assets/sample-report-thanh-dung.pdf`)**: số liệu khớp 100% với Bộ 1, nhưng file PDF mẫu tĩnh xuất từ `scripts/verify-r2-pdf.js` đang dùng chữ Việt không dấu, trong khi xuất PDF trên giao diện (`PdfExportModal.tsx` dùng `html2canvas`) thì có đủ dấu tiếng Việt.

---

## 6. HAI QUYẾT ĐỊNH THIẾT KẾ CHÍNH & KIỂM SOÁT AI

1. **Đóng băng snapshot báo cáo ở cấp `App` và hiện banner khi dữ liệu/kỳ thay đổi:**
   - *Lý do:* Đảm bảo khi người dùng đang xem/xuất báo cáo ở cả 4 định dạng (Text, PPTX, PDF, HTML email), mọi định dạng đều đọc từ cùng một `snapshotId` và `dataVersion`, không bị lệch số nếu dữ liệu nền vừa đổi.
   - *Đánh đổi:* Người dùng cần bấm `Cập nhật báo cáo` khi đổi bộ lọc kỳ hoặc nạp dữ liệu mới.
2. **Tách biệt "ngày không có bản ghi" (`null` → ngắt đoạn biểu đồ) với "ngày tạm dừng có bản ghi bằng 0" (`0` → vẽ tại điểm 0):**
   - *Lý do:* Tuân thủ quy tắc không biến ngày thiếu dữ liệu thành `0` gây méo xu hướng (ví dụ ngày `03/11` bị thiếu), đồng thời vẫn vẽ đúng ngày chiến dịch tạm dừng có nhập số `0` (như ngày `02/11` trong Bộ 3).
   - *Đánh đổi:* Cần dựng trục ngày liên tục `from..to` trong `buildDailySeries` trước khi đưa vào Chart.js và bảng slide PPTX.
3. **Phần AI hỗ trợ & phần tự kiểm chứng:** AI hỗ trợ viết code component, hàm xuất PPTX và script kiểm thử trình duyệt; Khoa kiểm tra lại công thức/số liệu trên cả 3 bộ dữ liệu mẫu, mở file `.pptx` trong PowerPoint thật và đối chiếu từng ảnh chụp.
