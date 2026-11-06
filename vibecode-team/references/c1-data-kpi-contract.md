# BẢN ĐẶC TẢ CONTRACT DỮ LIỆU & CÔNG THỨC KPI (C1)
**Dự án:** Dashboard KPI Chiến Dịch Mini Facebook Ads — Đề 7, Bảng B  
**Phụ trách (Owner):** Nguyễn Thanh Dũng (Data, Import, Core KPI Engine, PDF Export)  
**Người duyệt (Reviewers):** Trịnh Khoa (UX, Dashboard, Text/PPTX), Lộc (AI, Chatbot, HTML Email, Integration)  
**Nhánh Git:** `dung/c1-data-kpi-contract`  
**Baseline commit:** `05b7a47063cdb5f966fa9faf2102c8734dcfbddb` (trên `codex/plan-handoff`)  
**Ngày lập:** 06/11/2026 (Asia/Saigon)  
**Trạng thái:** Chờ review & duyệt từ Khoa và Lộc (Chưa code module phụ thuộc)

---

## 1. BỐI CẢNH & NGUYÊN TẮC THIẾT KẾ DỮ LIỆU (15 NĂM KINH NGHIỆM)

Trong vai trò chuyên gia kiến trúc dữ liệu và thiết kế sản phẩm số, hệ thống đo lường hiệu quả quảng cáo (AdTech Dashboard) cần tuân thủ 4 nguyên tắc sống còn:

1. **Single Source of Truth (SSOT):** Chỉ tồn tại **MỘT** module tính toán KPI duy nhất (`calculateDailyMetrics` và `calculatePeriodMetrics`). Dashboard của Khoa, AI Copilot của Lộc, Chatbot, và Engine xuất PDF của Dũng đều nhận cùng một snapshot kết quả. Tuyệt đối cấm các component tự tính toán lại bằng công thức riêng.
2. **Minh bạch số học & Phân biệt Trạng thái (Determinism & State Clarity):**
   - Số `0` là một giá trị đo lường có thực (ví dụ: ngày đó thực sự có 0 lượt click hoặc 0 đơn hàng).
   - Giá trị `null` / `undefined` là trạng thái "Không có dữ liệu" hoặc "Mẫu số không hợp lệ" (ví dụ: chưa nhập Reach hoặc Click = 0 khi tính CPC).
   - Tuyệt đối không biến `null` thành `0` hoặc ngược lại, vì `CPC = 0đ` làm người dùng tưởng được nhấp chuột miễn phí!
3. **Trung thực trong số liệu Meta Ads (Ad Metrics Integrity):**
   - Chỉ số **Reach** là số người tiếp cận duy nhất (Unique Users). Khi cộng dồn Reach theo ngày ($\sum Reach_i$), ta chỉ thu được **"Tổng lượt tiếp cận theo ngày"**, không thể đại diện cho Reach độc bản của cả chiến dịch nếu không có cơ chế khử trùng lặp (de-duplication). Nhãn báo cáo phải phản ánh chính xác điều này.
4. **Không suy diễn dữ liệu ảo (No Hallucinated Granularity):**
   - Khi người dùng cung cấp ảnh chụp chỉ có số tổng kỳ (ví dụ: 7 ngày tiêu 5 triệu, 70 đơn), hệ thống ghi nhận dạng `PeriodSnapshotRecord`. Tuyệt đối không tự ý chia đều cho 7 ngày để sinh dữ liệu ngày giả.

---

## 2. TỪ ĐIỂN TRƯỜNG DỮ LIỆU (DATA DICTIONARY CONTRACT)

### 2.1. Bản ghi dữ liệu theo ngày (`DailyAdRecord`)

| Tên trường (Key) | Kiểu dữ liệu | Bắt buộc? | Đơn vị / Định dạng | Miền giá trị | Ý nghĩa & Quy tắc kiểm tra |
|---|---|---|---|---|---|
| `id` | `string` | Có | UUID v4 hoặc timestamp | Không trùng | Định danh duy nhất cho từng dòng dữ liệu |
| `date` | `string` | Có | `YYYY-MM-DD` (ISO 8601) | Ngày hợp lệ, không vượt quá hôm nay | Ngày ghi nhận số liệu quảng cáo |
| `campaign_name` | `string` | Không | Chuỗi ký tự (UTF-8) | Tối đa 120 ký tự | Tên chiến dịch / nhóm quảng cáo (Mặc định: "Chiến dịch chung") |
| `spend` | `number` | Có | VNĐ (Đồng) | $\ge 0$, số nguyên | Chi phí thực tế đã chi tiêu trong ngày |
| `reach` | `number` | Có | Người (People) | $\ge 0$, số nguyên | Số người tiếp cận được trong ngày theo báo cáo Ads Manager |
| `clicks` | `number` | Có | Lượt click | $\ge 0$, số nguyên | Số lượt nhấp (Link Clicks hoặc All Clicks theo nguồn nhập) |
| `orders` | `number` | Có | Đơn hàng | $\ge 0$, số nguyên | Số đơn hàng ghi nhận thành công từ quảng cáo trong ngày |
| `source_type` | `enum` | Có | Chuỗi định danh | `'manual' \| 'excel_csv' \| 'text_copy' \| 'image_ocr'` | Nguồn dữ liệu tạo ra bản ghi |
| `status` | `enum` | Có | Chuỗi trạng thái | `'valid' \| 'warning' \| 'draft'` | Trạng thái dữ liệu (`draft`: chưa xác nhận, `warning`: có bất thường, `valid`: đã kiểm tra) |
| `notes` | `string` | Không | Chuỗi ký tự | Tối đa 255 ký tự | Ghi chú người dùng (ví dụ: đổi creative, tăng ngân sách) |

### 2.2. Bản ghi tổng hợp theo kỳ (`PeriodSummaryRecord` - Dùng cho Ảnh chụp tổng kỳ)

| Tên trường (Key) | Kiểu dữ liệu | Bắt buộc? | Đơn vị / Định dạng | Ý nghĩa & Quy tắc |
|---|---|---|---|---|
| `id` | `string` | Có | UUID v4 | Định danh snapshot |
| `period_start` | `string` | Có | `YYYY-MM-DD` | Ngày bắt đầu kỳ báo cáo |
| `period_end` | `string` | Có | `YYYY-MM-DD` | Ngày kết thúc kỳ báo cáo |
| `total_spend` | `number` | Có | VNĐ | Tổng chi phí cả kỳ |
| `total_reach` | `number` | Có | Người | Tổng reach cả kỳ (do Meta Ads báo cáo trực tiếp trong ảnh) |
| `total_clicks` | `number` | Có | Lượt click | Tổng số click cả kỳ |
| `total_orders` | `number` | Có | Đơn hàng | Tổng đơn hàng cả kỳ |
| `is_aggregate_only` | `boolean` | Có | `true` | Đánh dấu bản ghi chỉ có tổng kỳ, không có chi tiết ngày |

---

## 3. CÔNG THỨC KPI & QUY TẮC XỬ LÝ SỐ HỌC (KPI FORMULAS & ARITHMETIC RULES)

### 3.1. Danh mục công thức KPI

| Chỉ số | Tên đầy đủ | Công thức toán học | Đơn vị hiển thị | Quy tắc mẫu số 0 & Giá trị biên |
|---|---|---|---|---|
| **CTR** | Click-Through Rate (Tỷ lệ nhấp) | $CTR = \left(\frac{Clicks}{Reach}\right) \times 100\%$ | `%` (2 chữ số thập phân, ví dụ `2.85%`) | Nếu $Reach = 0$ hoặc thiếu $\rightarrow$ trả về `null`. Hiển thị: `0.00%` (hoặc `—` nếu không có dữ liệu). |
| **CPC** | Cost Per Click (Chi phí mỗi nhấp) | $CPC = \frac{Spend}{Clicks}$ | `VNĐ/click` (Làm tròn số nguyên, ví dụ `2,143 đ`) | Nếu $Clicks = 0$:<br>• Nếu $Spend = 0 \rightarrow null$ (Hiển thị `—`).<br>• Nếu $Spend > 0 \rightarrow null$ (Hiển thị `N/A`, ghi chú: *0 click*). **Tuyệt đối không gán = 0đ hoặc Infinity!** |
| **CPA** | Cost Per Acquisition (Chi phí / Đơn hàng) | $CPA = \frac{Spend}{Orders}$ | `VNĐ/đơn` (Làm tròn số nguyên, ví dụ `49,500 đ`) | Nếu $Orders = 0$:<br>• Nếu $Spend = 0 \rightarrow null$ (Hiển thị `—`).<br>• Nếu $Spend > 0 \rightarrow null$ (Hiển thị `N/A`, ghi chú: *Chưa phát sinh đơn*). Cảnh báo AI: "Đốt ngân sách". |
| **CVR** *(Bổ trợ)* | Conversion Rate (Tỷ lệ chuyển đổi đơn) | $CVR = \left(\frac{Orders}{Clicks}\right) \times 100\%$ | `%` (2 chữ số thập phân, ví dụ `4.11%`) | Nếu $Clicks = 0 \rightarrow null$ (Hiển thị `0.00%`). |

### 3.2. Quy tắc tính toán toàn kỳ (Aggregated Period Metrics)

Khi tổng hợp một dải ngày ($N$ ngày từ ngày $1$ đến ngày $N$):
1. **Tổng Spend:** $Spend_{total} = \sum_{i=1}^{N} Spend_i$
2. **Tổng Clicks:** $Clicks_{total} = \sum_{i=1}^{N} Clicks_i$
3. **Tổng Orders:** $Orders_{total} = \sum_{i=1}^{N} Orders_i$
4. **Tổng Reach:** $Reach_{sum} = \sum_{i=1}^{N} Reach_i$.  
   *Nhãn hiển thị chuẩn trên UI và PDF:* **"Tổng Reach (cộng dồn ngày)*"** kèm chú thích: *"Số liệu là tổng lượt tiếp cận từng ngày, không phải số người tiếp cận duy nhất toàn chiến dịch"*.
5. **CTR Toàn kỳ (Weighted CTR):**
   $$CTR_{total} = \left(\frac{Clicks_{total}}{Reach_{sum}}\right) \times 100\%$$
   > ⚠️ **LƯU Ý CỐT LÕI:** KHÔNG ĐƯỢC tính CTR toàn kỳ bằng trung bình cộng số học của các % CTR từng ngày: $\frac{1}{N}\sum CTR_i$ vì quy mô Reach mỗi ngày khác nhau sẽ gây sai lệch trọng số!
6. **CPC Toàn kỳ:**
   $$CPC_{total} = \frac{Spend_{total}}{Clicks_{total}}$$
   *(KHÔNG lấy trung bình cộng CPC các ngày).*
7. **CPA Toàn kỳ:**
   $$CPA_{total} = \frac{Spend_{total}}{Orders_{total}}$$
   *(KHÔNG lấy trung bình cộng CPA các ngày).*

---

## 4. BA BỘ DỮ LIỆU THỬ NGHIỆM ĐÃ TÍNH TAY CHI TIẾT (REFERENCE TEST DATASETS)

### BỘ 1: Chuẩn mực E-Commerce (5 ngày vận hành bình thường)
- **Mục tiêu:** Kiểm tra độ chính xác số học trong điều kiện lý tưởng, số liệu sạch.
- **Tiền tệ:** VNĐ.

#### Dữ liệu đầu vào:
| Ngày (`date`) | Reach | Clicks | Chi phí (`spend`) | Đơn hàng (`orders`) |
|---|---|---|---|---|
| **2026-11-01** | 5,000 | 150 | 300,000 | 6 |
| **2026-11-02** | 7,500 | 210 | 450,000 | 9 |
| **2026-11-03** | 10,000 | 320 | 600,000 | 12 |
| **2026-11-04** | 12,000 | 360 | 720,000 | 15 |
| **2026-11-05** | 15,000 | 420 | 900,000 | 18 |

#### Kết quả tính tay từng ngày:
- **2026-11-01:**
  - $CTR = (150 / 5,000) \times 100\% = \mathbf{3.00\%}$
  - $CPC = 300,000 / 150 = \mathbf{2,000\text{ đ}}$
  - $CPA = 300,000 / 6 = \mathbf{50,000\text{ đ}}$
  - $CVR = (6 / 150) \times 100\% = \mathbf{4.00\%}$
- **2026-11-02:**
  - $CTR = (210 / 7,500) \times 100\% = \mathbf{2.80\%}$
  - $CPC = 450,000 / 210 = 2,142.857... \rightarrow \mathbf{2,143\text{ đ}}$ (làm tròn)
  - $CPA = 450,000 / 9 = \mathbf{50,000\text{ đ}}$
  - $CVR = (9 / 210) \times 100\% = 4.2857... \rightarrow \mathbf{4.29\%}$
- **2026-11-03:**
  - $CTR = (320 / 10,000) \times 100\% = \mathbf{3.20\%}$
  - $CPC = 600,000 / 320 = \mathbf{1,875\text{ đ}}$
  - $CPA = 600,000 / 12 = \mathbf{50,000\text{ đ}}$
  - $CVR = (12 / 320) \times 100\% = \mathbf{3.75\%}$
- **2026-11-04:**
  - $CTR = (360 / 12,000) \times 100\% = \mathbf{3.00\%}$
  - $CPC = 720,000 / 360 = \mathbf{2,000\text{ đ}}$
  - $CPA = 720,000 / 15 = \mathbf{48,000\text{ đ}}$
  - $CVR = (15 / 360) \times 100\% = 4.1666... \rightarrow \mathbf{4.17\%}$
- **2026-11-05:**
  - $CTR = (420 / 15,000) \times 100\% = \mathbf{2.80\%}$
  - $CPC = 900,000 / 420 = 2,142.857... \rightarrow \mathbf{2,143\text{ đ}}$
  - $CPA = 900,000 / 18 = \mathbf{50,000\text{ đ}}$
  - $CVR = (18 / 420) \times 100\% = 4.2857... \rightarrow \mathbf{4.29\%}$

#### Kết quả tính tay toàn kỳ (5 ngày):
- **Tổng Spend:** $300,000 + 450,000 + 600,000 + 720,000 + 900,000 = \mathbf{2,970,000\text{ đ}}$
- **Tổng Reach (cộng dồn ngày):** $5,000 + 7,500 + 10,000 + 12,000 + 15,000 = \mathbf{49,500}$
- **Tổng Clicks:** $150 + 210 + 320 + 360 + 420 = \mathbf{1,460}$
- **Tổng Orders:** $6 + 9 + 12 + 15 + 18 = \mathbf{60}$
- **CTR Toàn kỳ:** $(1,460 / 49,500) \times 100\% = 2.94949... \rightarrow \mathbf{2.95\%}$
  *(Lưu ý: Nếu lấy trung bình cộng % CTR = $(3.00 + 2.80 + 3.20 + 3.00 + 2.80) / 5 = 2.96\%$. Sự lệch $0.01\%$ này khẳng định thuật toán SSOT bắt buộc chia tổng).*
- **CPC Toàn kỳ:** $2,970,000 / 1,460 = 2,034.246... \rightarrow \mathbf{2,034\text{ đ}}$
- **CPA Toàn kỳ:** $2,970,000 / 60 = \mathbf{49,500\text{ đ}}$
- **CVR Toàn kỳ:** $(60 / 1,460) \times 100\% = 4.1095... \rightarrow \mathbf{4.11\%}$

---

### BỘ 2: Dữ liệu Thiếu, Sai định dạng & Bất thường (Dirty / Incomplete Data)
- **Mục tiêu:** Kiểm tra khả năng bắt lỗi dữ liệu, thông báo inline và trạng thái an toàn trước khi lưu.

#### Dữ liệu đầu vào:
| Dòng | Ngày (`date`) | Reach | Clicks | Chi phí (`spend`) | Đơn hàng (`orders`) | Hiện tượng / Lỗi thực tế |
|---|---|---|---|---|---|---|
| **D2.1** | `2026-11-01` | *Trống (`null`)* | 80 | 250,000 | 4 | Marketer quên nhập cột Reach từ file CSV |
| **D2.2** | `2026-11-02` | 6,000 | 120 | `"ba trăm ngàn"` | 5 | Nhập text chữ vào trường số tiền |
| **D2.3** | `2026-11-03` | 4,000 | 70 | -100,000 | 2 | Nhập số âm (sai quy tắc miền giá trị) |
| **D2.4** | `2026-11-04` | 1,000 | 1,200 | 300,000 | 6 | Clicks (1,200) > Reach (1,000) (Nghi nhầm cột) |

#### Kết quả xử lý & Tính toán kỳ vọng:
- **D2.1 (Thiếu Reach):**
  - Trạng thái: `warning` (Thiếu dữ liệu).
  - $CTR = \mathbf{null}$ (UI hiển thị: `—`, tooltip: *"Thiếu chỉ số Reach để tính CTR"*).
  - $CPC = 250,000 / 80 = \mathbf{3,125\text{ đ}}$ (vẫn tính được vì đủ Spend & Clicks).
  - $CPA = 250,000 / 4 = \mathbf{62,500\text{ đ}}$.
- **D2.2 (Spend không phải số):**
  - Trạng thái: `invalid` (Lỗi kiểu dữ liệu).
  - Chặn lưu vào localStorage, highlight đỏ tại ô nhập liệu.
  - Nếu ở chế độ preview draft: $CPC = \mathbf{null}$, $CPA = \mathbf{null}$, $CTR = (120 / 6,000) \times 100\% = \mathbf{2.00\%}$.
- **D2.3 (Chi phí âm):**
  - Trạng thái: `invalid` (Số âm không hợp lệ).
  - Validation báo lỗi: *"Chi phí quảng cáo không thể là số âm"*. Chặn persist vào SSOT.
- **D2.4 (Clicks > Reach):**
  - Trạng thái: `warning` (Bất thường logic).
  - UI hiển thị cảnh báo màu vàng: *"Số lượt nhấp (1,200) lớn hơn lượt tiếp cận (1,000). Vui lòng kiểm tra bạn có dán nhầm cột Lượt hiển thị (Impressions) không?"*.
  - Nếu người dùng bấm "Xác nhận đúng":
    - $CTR = (1,200 / 1,000) \times 100\% = \mathbf{120.00\%}$.
    - $CPC = 300,000 / 1,200 = \mathbf{250\text{ đ}}$.
    - $CPA = 300,000 / 6 = \mathbf{50,000\text{ đ}}$.

---

### BỘ 3: Trường hợp Biên, Mẫu số 0, Ngày Trùng, và Ảnh chụp Tổng kỳ (Edge Cases & Boundaries)
- **Mục tiêu:** Đảm bảo hệ thống không bị crash, không render `NaN`, `Infinity`, và xử lý trọn vẹn tình huống thực tế.

#### Ca 3.1: Đốt ngân sách nhưng 0 Clicks, 0 Đơn (Mẫu số 0 tuyệt đối)
- **Dữ liệu:** Ngày `2026-11-01` | Reach: `8,000` | Clicks: `0` | Spend: `400,000 đ` | Orders: `0`.
- **Phân tích số học:**
  - $CTR = (0 / 8,000) \times 100\% = \mathbf{0.00\%}$ (Tử số = 0, mẫu số hợp lệ).
  - $CPC = 400,000 / 0 \rightarrow$ Phép chia cho 0. Kết quả trong JSON: $\mathbf{null}$.
    - Hiển thị trên Dashboard & PDF: `N/A` (Tag: *0 click*).
    - **Cấm:** Không hiển thị `0 đ` (sai bản chất) và không hiển thị `Infinity`.
  - $CPA = 400,000 / 0 \rightarrow$ Phép chia cho 0. Kết quả trong JSON: $\mathbf{null}$.
    - Hiển thị trên Dashboard & PDF: `N/A` (Tag: *Chưa có đơn*).
    - Cảnh báo chuyển cho AI Engine (Lộc): *"Đã chi 400,000 đ nhưng chưa phát sinh click hoặc đơn hàng — Cảnh báo kẹt phân phối hoặc lỗi link đích"*.

#### Ca 3.2: Ngày tạm dừng chiến dịch (Toàn bộ bằng 0)
- **Dữ liệu:** Ngày `2026-11-02` | Reach: `0` | Clicks: `0` | Spend: `0 đ` | Orders: `0`.
- **Kết quả tính:**
  - $CTR = \mathbf{null}$ (Hiển thị `—`).
  - $CPC = \mathbf{null}$ (Hiển thị `—`).
  - $CPA = \mathbf{null}$ (Hiển thị `—`).
  - Trạng thái hàng: *"Dừng hoạt động"*. Khi vẽ biểu đồ đường (Khoa): Vẽ điểm tại mức 0 (không gây gãy trục).

#### Ca 3.3: Trùng lặp ngày (Duplicate Dates)
- **Tình huống:** Người dùng nhập 2 dòng cùng ngày `2026-11-03`:
  - Dòng A: Reach `3,000`, Clicks `60`, Spend `150,000 đ`, Orders `2`.
  - Dòng B: Reach `2,000`, Clicks `40`, Spend `100,000 đ`, Orders `1`.
- **Xử lý UX/Data của Dũng:**
  - Phát hiện khóa ngày trùng lặp `date = 2026-11-03`.
  - Hiển thị hộp thoại Modal xác nhận trước khi lưu:
    1. **Tùy chọn 1 (Gộp - Recommended):** Hợp nhất 2 dòng thành 1 dòng đại diện cho ngày 03/11:
       - Reach: $3,000 + 2,000 = \mathbf{5,000}$
       - Clicks: $60 + 40 = \mathbf{100}$
       - Spend: $150,000 + 100,000 = \mathbf{250,000\text{ đ}}$
       - Orders: $2 + 1 = \mathbf{3}$
       - KPI gộp: $CTR = 2.00\%$, $CPC = 2,500\text{ đ}$, $CPA = 83,333\text{ đ}$.
    2. **Tùy chọn 2 (Ghi đè - Overwrite):** Lấy dòng mới nhất ghi đè dòng cũ.
    3. **Tùy chọn 3 (Hủy bỏ - Cancel):** Quay lại bảng sửa tay.

#### Ca 3.4: Nguồn ảnh chụp chỉ có tổng kỳ (Aggregate Image Import)
- **Tình huống:** Người dùng tải lên ảnh chụp màn hình Ads Manager tóm tắt:
  - Kỳ báo cáo: `01/11/2026 - 07/11/2026` (7 ngày).
  - Tổng Spend: `3,500,000 đ`.
  - Tổng Reach: `50,000`.
  - Tổng Clicks: `1,500`.
  - Tổng Orders: `50`.
  - **Không có dữ liệu bóc tách của từng ngày.**
- **Nguyên tắc xử lý của Dũng:**
  - **TUYỆT ĐỐI KHÔNG:** Tự chia đều $3,500,000 / 7 = 500,000\text{ đ/ngày}$ hay $50 / 7 = 7.14$ đơn/ngày để sinh ra 7 dòng ngày giả!
  - **XỬ LÝ ĐÚNG:** Lưu đối tượng `PeriodSummaryRecord`.
  - Tính KPI tổng hợp:
    - $CTR = (1,500 / 50,000) \times 100\% = \mathbf{3.00\%}$
    - $CPC = 3,500,000 / 1,500 = 2,333.33... \rightarrow \mathbf{2,333\text{ đ}}$
    - $CPA = 3,500,000 / 50 = \mathbf{70,000\text{ đ}}$
  - **Phối hợp với Khoa:** Trên Dashboard, các thẻ KPI hiển thị chính xác các số tổng trên; khu vực biểu đồ xu hướng hiển thị Placeholder thông minh: *"Dữ liệu từ ảnh chụp tổng kỳ không có biến thiên theo ngày. Vui lòng nhập dữ liệu theo ngày để xem biểu đồ đường/cột."*

---

## 5. CONTRACT SNAPSHOT BÁO CÁO DÙNG CHUNG (C1 $\leftrightarrow$ C2 $\leftrightarrow$ C3)

Để Trịnh Khoa (Dashboard, Text, PPTX) và Lộc (AI, HTML Email) có thể sử dụng trực tiếp kết quả của Dũng mà không gây xung đột, ta chuẩn hóa Contract TypeScript sau:

```typescript
/**
 * Trạng thái giá trị tính toán
 */
export type MetricValue<T> = {
  value: T | null;          // Giá trị số hoặc null nếu không tính được
  formatted: string;        // Chuỗi đã format chuẩn VNĐ hoặc % (ví dụ: "2,143 đ", "3.00%", "N/A")
  status: 'valid' | 'zero_division' | 'missing_data' | 'out_of_bounds';
  warningMessage?: string;  // Thông báo giải thích khi status != 'valid'
};

/**
 * Chỉ số KPI được tính toán cho 1 thực thể (1 ngày hoặc 1 kỳ)
 */
export interface CalculatedKPIs {
  ctr: MetricValue<number>;     // Tỷ lệ nhấp (%)
  cpc: MetricValue<number>;     // Chi phí mỗi nhấp (VNĐ)
  cpa: MetricValue<number>;     // Chi phí mỗi đơn (VNĐ)
  cvr: MetricValue<number>;     // Tỷ lệ chuyển đổi (%)
}

/**
 * Snapshot Báo cáo Hợp nhất - Single Source of Truth
 */
export interface CampaignReportSnapshot {
  meta: {
    snapshotId: string;
    generatedAt: string;         // ISO 8601 timestamp
    periodStart: string;         // YYYY-MM-DD
    periodEnd: string;           // YYYY-MM-DD
    totalDays: number;
    currency: 'VND';
    campaignName: string;
    hasDailyBreakdown: boolean;  // true nếu có chi tiết từng ngày, false nếu chỉ có tổng kỳ
  };
  totals: {
    spend: number;
    reachSum: number;            // Tổng lượt tiếp cận từng ngày cộng dồn
    clicks: number;
    orders: number;
  };
  kpis: CalculatedKPIs;          // KPI toàn kỳ đã được Dũng tính sẵn
  dailyRecords: Array<{
    date: string;
    spend: number;
    reach: number;
    clicks: number;
    orders: number;
    kpis: CalculatedKPIs;
    status: 'valid' | 'warning';
    notes?: string;
  }>;
  dataIntegrity: {
    isClean: boolean;
    missingFieldsCount: number;
    zeroDivisionCount: number;
    duplicateDatesResolved: number;
  };
}
```

---

## 6. SÁU QUYẾT ĐỊNH CẦN KHOA VÀ LỘC DUYỆT TRƯỚC KHI CODE

| # | Vấn đề nghiệp vụ & kỹ thuật | Đề xuất của Thanh Dũng (Chuyên gia) | Lý do & Đánh đổi | Phản hồi của Khoa / Lộc |
|---|---|---|---|---|
| **Q1** | **Cách hiển thị khi mẫu số = 0 (Clicks = 0 khi tính CPC, Orders = 0 khi tính CPA)** | Trong JSON trả về `null`. Trên UI và PDF hiển thị nhãn `N/A` (kèm chú thích *0 click* hoặc *Chưa có đơn*). Tuyệt đối không để `0đ` hoặc `Infinity`. | • **Lý do:** Tránh ngộ nhận là quảng cáo được click miễn phí; tránh crash biểu đồ số học.<br>• **Đánh đổi:** Cần viết format helper xử lý chuỗi thay vì in thẳng biến số. | *Chờ Khoa & Lộc xác nhận* |
| **Q2** | **Công thức CTR theo đề vs Meta chuẩn** | Tuân thủ công thức Đề 7: $CTR = (Clicks / Reach) \times 100\%$. Thêm footnote giải thích trên giao diện và PDF. | • **Lý do:** Bám sát thang chấm của Ban giám khảo Đề 7.<br>• **Đánh đổi:** Marketer quen dùng $CTR = Clicks / Impressions$ có thể thắc mắc, nên footnote là bắt buộc. | *Chờ Khoa & Lộc xác nhận* |
| **Q3** | **Tên nhãn Reach toàn kỳ** | Đặt tên nhãn trên Dashboard, PDF, Slide là: **"Tổng Reach (cộng dồn ngày)*"** thay vì "Reach duy nhất cả kỳ". | • **Lý do:** Trung thực về bản chất dữ liệu Meta Ads (không có khử trùng user ID ở cấp ngày).<br>• **Đánh đổi:** Nhãn dài hơn một chút, cần thiết kế responsive linh hoạt. | *Chờ Khoa xác nhận UX* |
| **Q4** | **Xử lý ngày trùng lặp (Duplicate Dates)** | Mặc định cảnh báo và khuyến nghị nút **"Gộp chỉ số (Sum Merge)"** thành 1 ngày duy nhất. | • **Lý do:** Giữ cho trục thời gian của biểu đồ (Khoa) luôn tuyến tính, không bị gãy đa giá trị cùng 1 ngày.<br>• **Đánh đổi:** Người dùng nếu chạy 2 chiến dịch khác nhau sẽ bị gộp chung trừ khi bổ sung cột Campaign ID. | *Chờ Khoa xác nhận UI* |
| **Q5** | **Xử lý Ảnh chụp chỉ có tổng kỳ** | Lưu thành `PeriodSummaryRecord`, không tự sinh số ngày ảo. Tắt biểu đồ đường, chỉ hiển thị thẻ KPI tổng. | • **Lý do:** Giữ đạo đức dữ liệu, không bịa số liệu chi tiết giả tạo.<br>• **Đánh đổi:** Biểu đồ ngày sẽ không vẽ được nếu người dùng chỉ nạp ảnh tổng kỳ. | *Chờ Lộc & Khoa xác nhận* |
| **Q6** | **Thống nhất Snapshot Interface (Mục 5)** | Dũng cam kết cung cấp đúng cấu trúc `CampaignReportSnapshot`. Khoa và Lộc chỉ đọc từ snapshot này. | • **Lý do:** Đảm bảo tính nhất quán 100% giữa Dashboard, AI, PDF, PPTX và Email.<br>• **Đánh đổi:** Phải hoàn thành tầng tính toán và validate trước khi các bạn ráp UI/AI. | *Chờ Khoa & Lộc ký hợp đồng* |

---

## 7. KẾ HOẠCH BÀN GIAO TIẾP THEO CỦA THANH DŨNG (SAU KHI ĐƯỢC DUYỆT)

Sau khi Khoa và Lộc review và duyệt tài liệu C1 này, Thanh Dũng sẽ tiến hành theo đúng 4 bước đã được phân công:
1. **Module D1 & K1 (06/11 - 07/11):** Xây dựng form nhập tay nhiều dòng, bảng preview & inline edit, lưu trữ bền vững `localStorage`, và lõi tính toán KPI dùng chung (`kpiEngine.ts`). Chạy thử nghiệm và kiểm tra persistence khi F5 tải lại trang.
2. **Module D2 (07/11 - 08/11):** Thêm tính năng import file Excel (.xlsx), CSV và Text copy (clipboard TSV/CSV) kèm bản đồ ánh xạ cột (Column Mapper) thông minh.
3. **Module D3 (08/11):** Tích hợp đọc ảnh chụp báo cáo trong phạm vi khả thi, có modal xem trước/chỉnh sửa trước khi lưu, xử lý minh bạch ảnh tổng kỳ.
4. **Module R2 (08/11 - 09/11):** Xây dựng module xuất PDF trực tiếp từ `CampaignReportSnapshot` chuẩn, kiểm thử mở file PDF thật trên thiết bị, đối chiếu số liệu và tiếng Việt không lỗi font.
