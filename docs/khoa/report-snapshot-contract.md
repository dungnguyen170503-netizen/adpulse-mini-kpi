# C2 · Snapshot báo cáo (Trịnh Khoa) — contractVersion 0.1-draft

Trạng thái: **nháp chờ Dũng (C1) và Lộc (C3) review**. Mọi định dạng xuất (text, PDF, HTML email, PPTX) và AI chỉ đọc snapshot này, **không tự tính KPI**. KPI do lớp tính chung của Dũng cung cấp.

## 1. Cấu trúc

```json
{
  "contractVersion": "0.1-draft",
  "snapshotId": "snap-20261108-153000",
  "createdAt": "2026-11-08T15:30:00+07:00",
  "dataVersion": "<hash dữ liệu đã xác nhận>",
  "period": { "from": "2026-11-01", "to": "2026-11-07", "label": "01/11–07/11/2026", "daysTotal": 7, "daysWithData": 6 },
  "filters": { "campaign": null, "currency": "VND" },
  "kpi": {
    "reach":  { "value": 12000, "unit": "người", "status": "ok", "note": "Tổng các ngày, KHÔNG phải người duy nhất cả kỳ" },
    "clicks": { "value": 480, "unit": "click", "status": "ok" },
    "spend":  { "value": 2400000, "unit": "VND", "status": "ok" },
    "orders": { "value": 12, "unit": "đơn", "status": "ok" },
    "ctr":    { "value": 0.04, "unit": "tỉ lệ", "status": "ok", "formula": "click/reach (theo đề)" },
    "cpc":    { "value": 5000, "unit": "VND/click", "status": "ok" },
    "costPerOrder": { "value": 200000, "unit": "VND/đơn", "status": "ok" }
  },
  "daily": [
    { "date": "2026-11-01", "reach": 1800, "clicks": 70, "spend": 350000, "orders": 2 },
    { "date": "2026-11-02", "reach": null, "clicks": null, "spend": null, "orders": null }
  ],
  "dataNotes": ["Thiếu dữ liệu ngày 02/11", "Ngày trùng 05/11 đã gộp theo xác nhận của người dùng"],
  "ai": {
    "status": "ok | pending | error | not_configured",
    "source": "9router-codex | gemini | rule-based | null",
    "trend": "...",
    "suggestions": [
      { "observation": "...", "limit": "...", "action": "...", "check": "..." }
    ],
    "errorMessage": null
  }
}
```

## 2. Quy tắc

1. `status` của KPI: `ok`, `missing`, `not_computable` (kèm `note` lý do, ví dụ 0 click → CPC không tính được).
2. Ô thiếu là `null`, khác với `0`. Biểu đồ không vẽ `null` thành 0 (ngắt đường/để trống).
3. CTR/CPC/chi phí mỗi đơn tính từ tổng tử/mẫu cùng kỳ, không trung bình tỉ lệ ngày.
4. `ai.source = "rule-based"` phải hiển thị nhãn "Quy tắc, không phải AI".
5. `ai.status != ok` không chặn xuất; báo cáo ghi "Chưa có gợi ý AI".

## 3. Khi dữ liệu thay đổi

- Snapshot **bất biến**. Sửa dữ liệu → `dataVersion` đổi → tạo snapshot mới.
- Báo cáo đang xem/đã xuất cũ hiển thị nhãn "Dựa trên dữ liệu lúc HH:mm dd/mm" và banner "Dữ liệu đã thay đổi – Cập nhật báo cáo".
- Chỉ lưu snapshot mới nhất trong localStorage (đơn giản cho bản thi). Mọi định dạng xuất tại một thời điểm dùng cùng một `snapshotId`; mỗi file xuất ghi `snapshotId` và `createdAt` ở chân trang.

## 4. Điểm cần nhóm duyệt

| # | Câu hỏi | Người chốt | Đề xuất |
|---|---|---|---|
| 1 | CTR = click/reach (theo đề) hay thêm click/impressions | Dũng (C1) | giữ click/reach, ghi công thức |
| 2 | Tên trường và kiểu `campaign`, `currency` có trong C1 không | Dũng | khớp C1; nếu thiếu thì để `null` |
| 3 | Contract AI (`ai.*`) khớp C3 không | Lộc | khớp C3 |
| 4 | Ai sở hữu file contract chung | Lộc điều phối | Khoa giữ file snapshot, Dũng giữ KPI |
| 5 | Công nghệ giao diện | cả nhóm | đề xuất: HTML/CSS/JS thuần, không cần build; PPTX bằng thư viện PptxGenJS |
| 6 | PR trỏ vào `codex/plan-handoff` | Lộc | đồng ý |
