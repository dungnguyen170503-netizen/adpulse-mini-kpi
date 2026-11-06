# Đối chiếu C1 của Dũng (PR #2) với snapshot C2 của Khoa

Nguồn: PR #2 `dung/r2-pdf-export` (head `bce218f`), file `src/types/campaign.ts`, `src/utils/kpiEngine.ts`, `vibecode-team/references/c1-data-kpi-contract.md`. Trạng thái: **đề xuất của Khoa, chờ Dũng và Lộc xác nhận**.

## 1. Khớp
- CTR = click/reach × 100 (theo đề); CPC = chi phí/click; chi phí/đơn = chi phí/đơn.
- KPI kỳ tính trên tổng, không trung bình tỉ lệ ngày (CTR kỳ 2,95% chứ không phải 2,96%).
- Reach cộng dồn gọi là "tổng lượt tiếp cận theo ngày" (`reachSum`), không gọi là người duy nhất.
- Chia 0 trả `null` + trạng thái, không hiện 0đ/Infinity.
- Ảnh chỉ có tổng kỳ lưu riêng (`summaryRecord`), không chia thành ngày giả.
- Một snapshot dùng chung (`CampaignReportSnapshot`).

## 2. Lệch cần chốt

| # | Chủ đề | Dũng (code hiện có) | Khoa (nháp C2) | Đề xuất của Khoa |
|---|---|---|---|---|
| 1 | Hình dạng snapshot | `meta`, `totals`, `kpis`, `dailyRecords`, `dataIntegrity` | `period`, `kpi`, `daily`, `dataNotes` | **Dùng hình dạng của Dũng** (đã có code); Khoa chỉ đọc |
| 2 | Tên chỉ số | `cpa` | `costPerOrder` | Giữ `cpa`; UI hiển thị nhãn "Chi phí mỗi đơn" |
| 3 | Kiểu CTR | số phần trăm (`2.95`) | tỉ lệ (`0.0295`) | Giữ phần trăm; ghi rõ đơn vị trong contract |
| 4 | Trạng thái KPI | `valid / zero_division / missing_data / out_of_bounds` | `ok / missing / not_computable` | Dùng bộ của Dũng |
| 5 | Khối AI | **chưa có** | `ai{status, source, trend, suggestions}` | Thêm `ai` vào snapshot theo C3 của Lộc (cần Lộc chốt) |
| 6 | Phiên bản dữ liệu | chưa có `dataVersion`/hash | `dataVersion` | Thêm `dataVersion` để phát hiện báo cáo cũ (mục 3 file snapshot) |
| 7 | Đơn vị mỗi KPI | chỉ có `formatted` | `unit` | Giữ `formatted`; đủ cho text/PPTX |

## 3. Chỗ có thể sai số liệu (cần Dũng giải thích)

1. **Thiếu bị biến thành 0.** `DailyAdRecord` dùng `number` (không `null`) và `calculateDailyMetrics` đổi `Number(x) || 0`. Trái nguyên tắc "thiếu khác 0" mà chính C1 nêu. Ca D2.1 (thiếu Reach) sẽ ra `zero_division` thay vì `missing_data`.
2. **CTR khi Reach = 0:** giá trị `null` nhưng `formatted = '0.00%'`. Màn hình/PDF/PPTX nếu hiển thị `formatted` sẽ in 0,00%, lệch với tài liệu C1 (ghi "—") và với quy tắc null ≠ 0. Ca 3.2 trong script in ra `CTR=0.00%`.
3. **Ngày tạm dừng (3.2) vẽ ở mức 0** trong khi ngày không có dòng dữ liệu phải là khoảng trống. Đề xuất Khoa: *có dòng nhập tường minh toàn 0* → vẽ 0; *không có dòng* → khoảng trống. Cần Dũng xác nhận hai trường hợp này được phân biệt trong dữ liệu.
4. **Ca 3.3 gộp 2 dòng trùng ngày bằng cộng (Sum Merge).** Chiến lược nhóm: không cộng lặp hoặc ghi đè âm thầm; phân biệt bản giống hệt và bản cập nhật. Cần xác nhận việc gộp luôn qua màn hình xác nhận của người dùng (`DuplicateResolutionModal`) và không cộng khi hai dòng giống hệt.
5. **`scripts/verify-c1-math.js` tự viết lại công thức** thay vì import `kpiEngine.ts`, nên "khớp 100%" chứng minh số học trong script, chưa chứng minh engine thật. Khoa đã chạy script: toàn bộ khớp bảng tay (Bộ 1, ca 3.1, 3.2); chưa chạy engine thật.
6. Nhãn "reach: người" trên giao diện cần ghi chú "tổng các ngày" (xem mockup S5).

## 4. Quy trình
- PR #2 gồm khoảng 9.000 dòng code (React + Vite + Tailwind + TypeScript, nhập tay, Excel/CSV, ảnh, PDF) trong khi tài liệu nhóm quy định chưa code phần phụ thuộc trước khi contract/spec/thiết kế được duyệt. Cần Lộc (điều phối) quyết định chấp nhận hay yêu cầu tách PR.
- Stack giao diện là **React + Vite + Tailwind** (Dũng đã chọn). Khoa theo stack này; đề xuất "HTML/CSS/JS thuần" trong `report-snapshot-contract.md` mục 4 **không còn dùng**.
- PR có chứa `dung/r2-pdf-export` xếp chồng nhiều nhánh (C1, D1/K1, D2/D3, R2) trong một PR.

## 5. Việc của Khoa sau khi Dũng/Lộc trả lời
- Đọc `CampaignReportSnapshot` có sẵn để làm biểu đồ, 3 tab, text, PPTX; không tính KPI riêng.
- Chờ quyết định các mục 3.1–3.4 trước khi viết chuỗi hiển thị và xử lý khoảng trống trong biểu đồ.
