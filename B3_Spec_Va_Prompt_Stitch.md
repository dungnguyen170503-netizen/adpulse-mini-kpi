# BƯỚC 3: KẾ HOẠCH THỰC THI CHI TIẾT & ĐẶC TẢ SẢN PHẨM (SPECIFICATION)
**Dự án:** Dashboard KPI Chiến Dịch Mini (Đề 7)

---

## 1. Triết lý Thiết kế UI/UX: "Human-Crafted SaaS" (Khử "mùi AI" 100%)

Để giám khảo khi nhìn vào sản phẩm cảm nhận ngay đây là một phần mềm phân tích quảng cáo thực thụ do kỹ sư và Marketer có nghề xây dựng (như **Meta Ads Manager**, **Stripe**, **Plausible Analytics**), chúng ta áp dụng bộ quy chuẩn thiết kế sau:

> [!IMPORTANT]
> **5 Nguyên tắc "Khử mùi AI" (Anti-AI-Slop Rules):**
> 1. **Không dùng Gradient tím-hồng lòe loẹt:** Tuyệt đối bỏ kiểu chuyển màu tím-xanh-hồng hay icon lấp lánh `✨` tràn lan vốn là "đặc sản" của các web tạo tự động bằng AI.
> 2. **Tương phản Header Xanh Đen & Nền Trắng Xám Lạnh:** Thanh Header trên cùng dùng màu **Xanh Đen Sâu (`#0F172A`)** tạo cảm giác đầm chắc, đáng tin cậy; phần thân dưới dùng nền **Trắng Xám Lạnh (`#F8FAFC`)** và các khung dữ liệu màu **Trắng tinh (`#FFFFFF`)** để mắt người đọc số liệu cực kỳ êm.
> 3. **Viền sắc nét, bo góc vừa phải (`6px - 8px`):** Sử dụng đường viền mảnh `1px solid #E2E8F0` và bóng đổ cực nhẹ, tránh bo góc quá tròn (`24px`) làm giao diện giống đồ chơi.
> 4. **Chuẩn hóa con số tài chính (`tabular-nums`):** Mọi con số tiền tệ (`15.400.000 ₫`), phần trăm (`2,45%`), lượt Reach/Click đều dùng chữ số đồng độ rộng (tabular numerals) và **căn lề phải** trong bảng nhập liệu — đúng chuẩn phần mềm kế toán/quảng cáo chuyên nghiệp.
> 5. **Khu vực AI mang phong cách "Chẩn đoán Chuyên gia":** Thay vì vẽ khung chat AI màu mè, khu vực nhận xét được thiết kế như một **"Báo cáo Kiểm toán Chiến dịch (Campaign Audit)"** với chỉ báo Tăng/Giảm rõ ràng và 3 thẻ hành động cụ thể.

### Bảng màu chuẩn (Color Palette)
| Thành phần | Mã màu (Hex) | Vai trò sử dụng |
| :--- | :--- | :--- |
| **Top Header Background** | `#0F172A` (Slate 900) | Nền thanh điều hướng trên cùng (Xanh đen sâu, chữ trắng) |
| **App Background** | `#F8FAFC` (Slate 50) | Nền tổng thể của trang (Trắng xám nhẹ dịu mắt) |
| **Surface / Card** | `#FFFFFF` (Pure White) | Nền của các thẻ KPI, khung biểu đồ, bảng dữ liệu |
| **Border / Divider** | `#E2E8F0` (Slate 200) | Đường kẻ bảng và viền khung sắc nét |
| **Primary Accent (Indigo)** | `#4338CA` / `#4F46E5` | Màu nhấn chính cho nút bấm quan trọng, cột Chi phí/Đơn hàng |
| **Secondary Accent (Teal/Sky)** | `#0284C7` / `#0D9488` | Màu cho đường biểu đồ phụ và khu vực Chẩn đoán AI |
| **Text Primary / Secondary** | `#0F172A` / `#64748B` | Chữ tiêu đề/số liệu sắc nét và chữ chú thích phụ |
| **Semantic Status** | Xanh `#16A34A` / Cam `#D97706` / Đỏ `#DC2626` | Chỉ báo xu hướng Tốt / Cần lưu ý / Cảnh báo chi phí cao |

---

## 2. Đặc tả Chi tiết Từng Khu Vực & Tính Năng (Functional Spec)

Giao diện tuân theo **Bố cục Dọc Toàn Cảnh (Vertical Flow)** gồm 4 tầng hiển thị chính và 1 Cửa sổ nổi (Popup Modal):

### Tầng 1: Thanh Header Nền Xanh Đen (`#0F172A`)
- **Bên trái:** Tên công cụ (VD: `AdMetrics Pro` hoặc `Campaign KPI Tracker`) + Ô nhập **Tên Chiến Dịch** có thể bấm vào sửa trực tiếp (VD: *"Chiến dịch Chạy Ads Tháng 11"* — tự lưu vào `localStorage`).
- **Ở giữa (Thanh nạp nhanh cho Giám khảo):** Cụm nút **"Dữ liệu mẫu"**:
  - `Kịch bản 1: Chiến dịch Tăng trưởng tốt` (7 ngày số liệu đẹp, đơn tăng đều, CPA giảm).
  - `Kịch bản 2: Chiến dịch Đốt tiền (Cần tối ưu)` (Chi phí tăng cao nhưng đơn hàng sụt giảm ở 3 ngày cuối).
  - `Kịch bản 3: Chiến dịch Bão hòa Creative` (Reach cao nhưng CTR tụt dốc qua từng ngày).
- **Bên phải:**
  - Nút **"Cấu hình AI"** (Tùy chọn bật/tắt hoặc nhập Gemini API Key nếu muốn dùng AI đám mây bên cạnh bộ chẩn đoán nội bộ).
  - Nút chính nổi bật **"Xuất báo cáo gửi Sếp"** (Màu Indigo sáng hoặc Trắng viền nổi bật) ➔ Khi bấm sẽ mở **Popup Modal Xuất Báo Cáo Text**.

### Tầng 2: Dãy Thẻ KPI Tổng Quan Toàn Chiến Dịch (6 Scorecards trên 1 hàng)
Tự động tổng hợp từ tất cả các dòng ngày đang có trong bảng:
1. **Tổng Chi Phí (Total Spend):** `Tổng(Chi phí)` (Định dạng: `12.500.000 ₫`) + Nhãn phụ: `CPM trung bình: (Tổng Chi phí / Tổng Reach) × 1.000`.
2. **Tổng Đơn Hàng (Total Orders):** `Tổng(Đơn hàng)` (Định dạng: `85 đơn`) + Nhãn phụ: `Trung bình X đơn/ngày`.
3. **Chi Phí / Đơn Hàng (CPA / CPO):** `Tổng Chi phí / Tổng Đơn hàng` (Định dạng: `147.058 ₫/đơn`). *(Nếu Tổng Đơn = 0 ➔ Hiển thị `0 ₫` kèm chú thích `Chưa có đơn`)*.
4. **Tỷ Lệ Nhấp (CTR %):** `(Tổng Click / Tổng Reach) × 100` (Định dạng: `2,35%`) + Nhãn phụ: `Tổng Reach: X | Tổng Click: Y`.
5. **Chi Phí Mỗi Click (CPC):** `Tổng Chi phí / Tổng Click` (Định dạng: `3.200 ₫/click`).
6. **Tỷ Lệ Chuyển Đổi (CR %):** `(Tổng Đơn hàng / Tổng Click) × 100` (Định dạng: `4,52%`) — Chỉ số giúp Marketer đọc ngay chất lượng Landing Page / Sale.

### Tầng 3: Khu Vực Phân Tích Biểu Đồ & Chẩn Đoán AI (Chia 2 cột: 65% Trái - 35% Phải)

#### Cột Trái (65%): Biểu đồ Trực quan
- **Tab / Chuyển đổi góc nhìn biểu đồ chính (Biểu đồ Kết hợp Cột & Đường - 2 Trục Tung):**
  - *Chế độ 1 (Mặc định - Hiệu quả Kinh doanh):* Cột (Trục Y trái) = `Chi phí (VNĐ)` | Đường (Trục Y phải) = `Số đơn hàng`.
  - *Chế độ 2 (Độ phủ & Tương tác):* Cột (Trục Y trái) = `Reach` | Đường (Trục Y phải) = `Click` & `CTR (%)`.
  - *Chế độ 3 (Biến động Chi phí Đơn vị):* Đường `CPA (Chi phí/Đơn)` và `CPC` theo từng ngày.
- **Khung Phễu Chuyển Đổi (Marketing Funnel nằm gọn bên dưới hoặc cạnh biểu đồ):**
  - Hiển thị 3 thanh ngang thu hẹp dần:
    `100% Reach (VD: 150.000)` ➔ *(Chuyển đổi CTR: 2,4%)* ➔ `Click (3.600)` ➔ *(Chuyển đổi CR: 3,5%)* ➔ `Đơn hàng (126)`.

#### Cột Phải (35%): Nhận xét Xu hướng & 03 Gợi ý Cải thiện
- **Phần 1 — Nhận xét Xu hướng (Trend Diagnosis):**
  - Tự động chia dữ liệu làm 2 nửa (Nửa đầu kỳ vs. Nửa cuối kỳ) và so sánh ngày gần nhất với trung bình kỳ:
    - Nhận xét xu hướng **Chi phí**, **CTR**, và **CPA (Chi phí/đơn)** đang **Tăng (▲)** hay **Giảm (▼)** bao nhiêu phần trăm.
    - Chỉ đích danh **Ngày hiệu quả nhất** (CPA thấp nhất, nhiều đơn nhất) và **Ngày cảnh báo** (Chi phí cao nhất nhưng ít đơn).
- **Phần 2 — 03 Gợi ý Cải thiện Chiến dịch (3 Actionable Recommendations):**
  - Luôn hiển thị đúng **03 gợi ý cụ thể**, phân loại theo 3 khâu của phễu:
    1. **Khâu Thu hút (Reach ➔ Click / CTR):** Đánh giá nội dung quảng cáo (Ad Creative, Hook 3 giây đầu, Thumbnail, CTA).
    2. **Khâu Chi phí & Phân phối (CPC / CPM):** Đánh giá tệp đối tượng (Targeting), khung giờ phân phối và dấu hiệu bão hòa tần suất.
    3. **Khâu Chốt đơn (Click ➔ Đơn hàng / CR & CPA):** Đánh giá trang đích (Landing Page), kịch bản tư vấn tin nhắn (Inbox/Sale) hoặc ưu đãi (Offer) và đề xuất dịch chuyển ngân sách từ ngày/nhóm kém sang ngày/nhóm hiệu quả.

### Tầng 4: Bảng Nhập Liệu Nhiều Dòng & Quản Lý Dữ Liệu (Full-width 100% ở dưới)
- **Thanh công cụ bảng:**
  - Nút `+ Thêm 1 ngày` (tự động lấy ngày tiếp theo của dòng cuối cùng).
  - Nút `+ Thêm nhanh 5 ngày` (tạo sẵn 5 dòng ngày liên tiếp để nhập một mạch).
  - Nút `Xóa trắng dữ liệu` (có hỏi xác nhận để tránh bấm nhầm).
  - Trạng thái tự động: `"Đã lưu tự động vào bộ nhớ trình duyệt (localStorage)"`.
- **Cấu trúc cột trong Bảng (9 cột rộng rãi, rõ ràng):**
  1. `Ngày` (Date picker / Input ngày)
  2. `Reach` (Ô nhập số nguyên >= 0)
  3. `Click` (Ô nhập số nguyên >= 0, cảnh báo viền cam nếu nhập `Click > Reach`)
  4. `Chi phí (VNĐ)` (Ô nhập số tiền, hiển thị dấu phân cách hàng nghìn dễ nhìn)
  5. `Số đơn hàng` (Ô nhập số nguyên >= 0)
  6. `CTR (%)` *(Cột tự tính - Nền xám nhạt `#F8FAFC` để phân biệt với ô nhập)*
  7. `CPC (đ)` *(Cột tự tính)*
  8. `Chi phí/Đơn - CPA (đ)` *(Cột tự tính - Tô đậm, đổi màu xanh/đỏ theo hiệu quả)*
  9. `Thao tác` (Nút xóa dòng `×` hoặc nhân bản dòng)
- **Dòng Tổng Cộng (Summary Footer Row):** Nằm cố định ở đáy bảng, tính tổng Reach, Click, Chi phí, Đơn hàng và trung bình chuẩn của CTR, CPC, CPA.

### Cửa Sổ Nổi (Popup Modal): Xuất Báo Cáo Tóm Tắt Dạng Text
- Mở ra khi bấm nút **"Xuất báo cáo gửi Sếp"** trên Header.
- Có 3 nút chọn phong cách (Tabs):
  1. **Gửi Sếp Tổng (Ngắn gọn, tập trung kết quả tiền & đơn)**
  2. **Gửi Khách Hàng (Lịch sự, báo cáo tiến độ & đề xuất)**
  3. **Gửi Team Marketing (Chi tiết thông số phễu & hành động tối ưu)**
- Khung văn bản (Textarea) cho phép người dùng sửa thêm chữ nếu muốn + Nút **"Copy toàn bộ báo cáo"** (khi bấm hiện thông báo *"Đã copy vào bộ nhớ tạm!"*).

---

## 3. Bộ Prompt Thiết Kế Chuẩn Dành Cho Google Stitch

Bạn có thể copy **1 trong 2 bản Prompt (Tiếng Anh hoặc Tiếng Việt)** dưới đây dán thẳng vào **Stitch**. *(Gợi ý: Công cụ Stitch thường hiểu cấu trúc UI chuẩn xác nhất bằng bản Tiếng Anh, nhưng tôi đã cài câu lệnh yêu cầu toàn bộ chữ hiển thị trên giao diện phải bằng Tiếng Việt).*

### Bản 1: Prompt Tiếng Anh (Khuyên dùng trên Stitch để ra bố cục sắc nét nhất)
```text
Design a clean, realistic, human-crafted B2B SaaS desktop web application for a Marketing Campaign KPI Dashboard (in Vietnamese language UI). 
IMPORTANT STYLE RULES: Avoid generic AI-generated aesthetics—NO purple-pink gradients, NO glowing neon, NO excessive rounded corners, NO sparkle icons everywhere. Make it look like an authentic, precision-engineered analytics product built by senior engineers (inspired by Stripe Dashboard, Plausible Analytics, and Meta Ads Manager).

COLOR PALETTE & TYPOGRAPHY:
- Top Navigation Header: Deep Slate Navy (#0F172A) with crisp white text.
- Main Page Background: Cool Light Gray (#F8FAFC).
- Cards & Containers: Pure White (#FFFFFF) with subtle 1px solid borders (#E2E8F0), slight border-radius (8px), and minimal shadow.
- Primary Accent: Professional Indigo (#4338CA) and Sky Blue (#0284C7) for charts and buttons.
- Typography: Inter font, sharp dark slate text (#0F172A), muted gray labels (#64748B), and strict tabular numbers (right-aligned in tables) for currency (VNĐ) and percentages.

VERTICAL LAYOUT STRUCTURE (4 TIERS + 1 MODAL):
1. TOP HEADER (#0F172A):
   - Left: App title "AdPulse Mini" and editable campaign name "Chiến dịch Quảng cáo Tháng 11".
   - Center: Segmented quick-load buttons "Nạp dữ liệu mẫu: Tăng trưởng tốt | Đốt tiền | Bão hòa".
   - Right: Primary action button "Xuất báo cáo gửi Sếp" (triggers a popup modal).

2. KPI SCORECARDS ROW (6 equal cards in a single row):
   - Tổng Chi Phí (18.500.000 ₫, subtext: CPM 45.000 ₫)
   - Tổng Đơn Hàng (142 đơn, subtext: TB 20,2 đơn/ngày)
   - Chi Phí / Đơn - CPA (130.281 ₫, badge: -12% tốt hơn kỳ trước)
   - CTR Trung Bình (2,48%, subtext: 10.180 clicks / 410.000 reach)
   - CPC Trung Bình (1.817 ₫/click)
   - Tỷ Lệ Chuyển Đổi CR (1,39% từ Click ra Đơn)

3. MIDDLE ANALYTICS SECTION (2-Column Grid: 65% Left, 35% Right):
   - Left Column (65%): 
     * Dual-axis Combo Chart (Bar chart for Daily Spend in VNĐ + Line chart for Daily Orders & Reach over 7 days) with filter tabs ("Chi phí & Đơn hàng", "Reach & Click", "Biến động CPA").
     * Compact horizontal Marketing Conversion Funnel bar below the chart showing: Reach (410.000) -> Click (10.180 - CTR 2.48%) -> Đơn hàng (142 - CR 1.39%).
   - Right Column (35%): "Chẩn đoán Xu hướng & Gợi ý Tối ưu" (Structured like an expert marketing audit card, NOT a chatbot):
     * Trend Summary Box: Bullet points showing Spend trend, CTR trend, and highlighting Best Performing Day vs Highest CPA Day.
     * 03 Actionable Recommendations numbered 01, 02, 03 with clear tags ("Tối ưu Creative", "Phân bổ Ngân sách", "Tối ưu Chốt đơn").

4. BOTTOM MULTI-ROW DATA INPUT TABLE (100% Full Width):
   - Header bar with title "Bảng Nhập Liệu Theo Ngày (Tự động lưu localStorage)" and buttons: "+ Thêm 1 ngày", "+ Thêm nhanh 7 ngày", "Xóa tất cả".
   - Clean spreadsheet-like editable table with columns: Ngày | Reach (input) | Click (input) | Chi phí VNĐ (input) | Số đơn hàng (input) | CTR % (auto-calculated, shaded bg) | CPC (auto) | Chi phí/Đơn CPA (auto, bold) | Xóa.
   - Footer total summary row.

5. POPUP MODAL (Overlay preview or secondary screen):
   - Title: "Xuất Báo Cáo Tóm Tắt (Copy gửi Sếp / Khách hàng)"
   - Tone selector tabs: "Gửi Sếp Tổng" | "Gửi Khách Hàng" | "Gửi Team Ads"
   - Monospace/clean text preview box containing formatted Vietnamese campaign summary report and a prominent "Copy Báo Cáo" button.
```

### Bản 2: Prompt Tiếng Việt (Nếu bạn muốn nhập bằng tiếng Việt trên Stitch)
```text
Thiết kế giao diện ứng dụng web Desktop cho "Dashboard KPI Chiến Dịch Quảng Cáo Mini".
YÊU CẦU PHONG CÁCH: Thiết kế chân thực như phần mềm SaaS chuyên nghiệp do kỹ sư code (lấy cảm hứng từ Stripe Dashboard và Meta Ads Manager). Tuyệt đối KHÔNG dùng phong cách AI màu mè: không dùng gradient tím hồng, không bo góc quá tròn, không lạm dụng icon lấp lánh.

MÀU SẮC & CHỮ VIẾT:
- Thanh Header trên cùng: Nền Xanh Đen Sâu (#0F172A), chữ trắng sắc nét.
- Nền trang chính: Trắng xám lạnh (#F8FAFC).
- Các khung thẻ (Card): Trắng tinh (#FFFFFF), viền mảnh 1px (#E2E8F0), bo góc 8px.
- Điểm nhấn: Xanh Indigo đậm (#4338CA) và Xanh Lam (#0284C7).

BỐ CỤC DỌC TOÀN CẢNH (4 TẦNG + 1 POPUP):
1. Thanh Header (#0F172A): Bên trái là tên ứng dụng và tên chiến dịch; ở giữa là 3 nút nạp dữ liệu mẫu; bên phải là nút nổi bật "Xuất báo cáo gửi Sếp".
2. Hàng 6 Thẻ KPI Tổng quan: Tổng Chi Phí, Tổng Đơn Hàng, Chi Phí/Đơn (CPA), CTR (%), CPC (đ), và Tỷ lệ chuyển đổi CR (%).
3. Khu vực Phân tích (Chia 2 cột 65% - 35%):
   - Cột trái (65%): Biểu đồ kết hợp Cột & Đường theo ngày (Reach, Chi phí, Đơn hàng) + Thanh Phễu chuyển đổi (Reach -> Click -> Đơn hàng).
   - Cột phải (35%): Khung "Phân tích Xu hướng & 03 Gợi ý Cải thiện Chiến dịch" trình bày dạng thẻ kiểm toán chuyên nghiệp (Nhận xét xu hướng Tăng/Giảm và 3 mục khuyến nghị đánh số 01, 02, 03).
4. Bảng Nhập Liệu Nhiều Dòng (Full-width ở dưới cùng): Có nút "+ Thêm 1 ngày", "+ Thêm 7 ngày". Các cột: Ngày, Reach, Click, Chi phí, Số đơn hàng (ô nhập liệu) và các cột tự động tính: CTR, CPC, Chi phí/Đơn (nền xám nhạt), kèm dòng Tổng cộng ở đáy bảng.
5. Cửa sổ nổi (Popup Modal) Xuất Báo Cáo Text: Có 3 tab chọn giọng văn (Gửi Sếp / Gửi Khách / Gửi Team), khung xem trước văn bản báo cáo và nút "Copy báo cáo 1-Click".
```

---

## 4. Kế hoạch Thực thi Kỹ thuật (Roadmap Bước 4 ➔ Bước 7)

1. **Bước 4 (Thiết kế Mockup HTML & Kết hợp thiết kế từ Stitch):**
   - Bạn có thể tạo thiết kế trên Stitch từ Prompt trên và gửi ảnh/file HTML tải về cho tôi, **HOẶC** tôi sẽ dựng ngay bản Mockup HTML/CSS chuẩn xác theo đúng Spec này để bạn xem trực tiếp trên trình duyệt.
2. **Bước 5 (Xây dựng ứng dụng hoàn chỉnh):**
   - Lập trình toàn bộ logic: Nhập liệu nhiều dòng, lưu/đọc `localStorage`, tự động tính KPI chống lỗi chia cho 0, vẽ biểu đồ tương tác (Chart.js / Recharts), bộ chẩn đoán xu hướng & 3 gợi ý cải thiện, cùng Popup xuất báo cáo 3 phong cách.
3. **Bước 6 (Kiểm thử, Báo lỗi & Phản biện):**
   - Test các trường hợp biên (nhập số 0, chỉ có 1 ngày dữ liệu, số tiền hàng trăm triệu, kiểm tra độ chuẩn xác của công thức CTR/CPC/CPA và trải nghiệm trên cả màn hình máy tính lẫn điện thoại).
4. **Bước 7 (Triển khai lên Vercel):**
   - Đóng gói và deploy lên Vercel có link public chạy mượt mà để nộp bài dự thi.
