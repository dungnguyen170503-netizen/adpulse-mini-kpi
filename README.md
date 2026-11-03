# AdPulse Mini — Dashboard KPI Chiến Dịch Quảng Cáo Tự Động (Đề 7)

> **Bài dự thi Vibe Coding — Đề 7: Dashboard KPI chiến dịch mini**  
> Giải pháp theo dõi, tính toán chỉ số tự động, trực quan hóa phễu chuyển đổi và kiểm toán hiệu suất AI dành cho Marketer.

---

## 🎯 Tính năng hoàn thiện theo Đề bài & Mở rộng

1. **Bảng nhập số liệu nhiều dòng & Tự động lưu `localStorage`:**
   - Hỗ trợ nhập và chỉnh sửa trực tiếp nhiều ngày (`Ngày`, `Reach`, `Click`, `Chi phí VNĐ`, `Số đơn hàng`).
   - Hỗ trợ `+ Thêm 1 ngày`, `+ Thêm nhanh 7 ngày`, `Xóa dòng`, `Xóa trắng` và **3 Kịch bản dữ liệu mẫu 1-Click** (*Tăng trưởng tốt*, *Đốt tiền*, *Bão hòa*) giúp trải nghiệm chấm bài tức thì.
2. **Tự động tính toán hệ thống chỉ số Marketing:**
   - Tự động tính `CTR (%)`, `CPC (đ)`, `Chi phí trên mỗi đơn hàng - CPA (đ)` cho từng ngày và toàn chu kỳ.
   - Mở rộng tự động chỉ số `CR (%)` (Tỷ lệ chốt đơn từ Click) và `CPM (đ)` (Chi phí mỗi 1.000 lượt tiếp cận).
3. **Biểu đồ Đường / Cột kép & Phễu chuyển đổi (Conversion Funnel):**
   - Biểu đồ kết hợp 2 trục tung (Cột + Đường) giải quyết triệt để độ lệch đơn vị giữa Chi phí (triệu đồng) và Đơn hàng (chục đơn).
   - Hỗ trợ 3 góc nhìn: `Chi phí & Đơn hàng`, `Reach & Click`, `Biến động CPA & CPC`.
   - Trực quan hóa Phễu chuyển đổi 3 tầng: `Reach` ➔ `Click` ➔ `Đơn hàng`.
4. **Kiểm toán Hiệu suất AI — Nhận xét xu hướng & 03 Gợi ý cải thiện:**
   - Tự động đối soát nửa đầu kỳ vs. nửa cuối kỳ để nhận diện xu hướng Tăng/Giảm của Chi phí, Đơn hàng, CPA và CTR.
   - Đánh dấu ngày hiệu quả nhất (`★`) và cảnh báo ngày vượt trần CPA.
   - Đưa ra **03 Khuyến nghị hành động** cụ thể theo 3 trụ cột: *Tối ưu Creative*, *Phân bổ Ngân sách*, và *Tối ưu Chốt đơn / Landing Page*.
5. **Xuất báo cáo tóm tắt dạng Text (1-Click Copy gửi Sếp / Khách hàng):**
   - Hỗ trợ 3 phong cách giọng văn: **Gửi Sếp Tổng (Ngắn gọn)**, **Gửi Khách Hàng (Agency)**, **Gửi Team Marketing (Chi tiết)**.
   - Cho phép chỉnh sửa trực tiếp và sao chép vào Clipboard chỉ với 1 chạm để dán ngay vào Zalo, Slack, Telegram hoặc Email.
6. **Hệ sinh thái 4 Màn hình UI/UX (Precision Metric Design System):**
   - **Tab 1:** Tổng quan hiệu suất (Dashboard KPI Chiến dịch).
   - **Tab 2:** Kênh Facebook & Google Ads (So sánh đa kênh & điều phối ngân sách).
   - **Tab 3:** Cấu hình Ngân sách & KPI (Thiết lập ngưỡng CPA trần, CTR sàn & quy tắc cảnh báo).
   - **Tab 4:** Nhật ký tối ưu (Lịch sử tác động & đối soát trước/sau tối ưu).

---

## 📁 Cấu trúc thư mục

```text
├── index.html                  # Ứng dụng Web hoàn chỉnh (tích hợp cả 4 màn hình & bộ máy tính toán)
├── app.js                      # Logic tính KPI, vẽ biểu đồ động SVG, AI chẩn đoán & localStorage
├── stitch_design/              # Bộ thiết kế UI/UX gốc từ Google Stitch (4 màn hình HTML + PNG + DESIGN.md)
├── B2_Ke_Hoach_Chien_Luoc.md   # Tài liệu Bước 2: Kế hoạch chiến lược & Sơ đồ luồng
└── B3_Spec_Va_Prompt_Stitch.md # Tài liệu Bước 3: Đặc tả kỹ thuật & Prompt thiết kế
```
