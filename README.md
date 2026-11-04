# AdPulse - Dashboard KPI Chiến Dịch Mini (Vibe Coding - Đề 7)

> **Bối cảnh:** Marketer cần theo dõi hiệu quả quảng cáo mỗi ngày nhưng không phải ai cũng rành Excel.  
> **Sản phẩm:** Dashboard nhập liệu trực quan, tự động tính toán chỉ số KPI, vẽ biểu đồ đường/cột, AI nhận xét xu hướng và xuất báo cáo 1-click copy gửi Sếp/Khách hàng.

---

## 🎯 5 Yêu Cầu Chức Năng Đã Hoàn Thành Trọn Vẹn

| # | Yêu Cầu | Hiện Thực & Điểm Nổi Bật |
|---|---|---|
| **1** | **Form nhập số liệu theo ngày** | • Nhập Reach, Click, Chi phí (VNĐ), Số đơn hàng.<br>• Hỗ trợ nhập trực tiếp từng dòng hoặc mở **Modal nhập nhiều dòng (Batch entry)**.<br>• **Đặc biệt: Hỗ trợ Dán trực tiếp từ bảng tính Excel / Google Sheets** (tự động nhận diện tab-separated values).<br>• Lưu trữ bền vững vào `localStorage`, có sẵn dữ liệu mẫu 10 ngày chuẩn Digital Marketing. |
| **2** | **Vẽ biểu đồ đường/cột** | • Tích hợp Chart.js với khả năng hiển thị mượt mà.<br>• Đa chế độ: **Đơn hàng & Chi phí** (Dual-axis), **Reach & Clicks**, **Chỉ số chất lượng (CTR & CPA)**.<br>• Hỗ trợ chuyển đổi nhanh: **Biểu đồ Cột (Bar)**, **Biểu đồ Đường (Line)**, và **Hỗn hợp (Combo)**. |
| **3** | **Tự động tính các chỉ số KPI** | • **CTR** = (Click / Reach) × 100%<br>• **CPC** = Chi phí / Click (VNĐ)<br>• **CPA** = Chi phí / Đơn hàng (VNĐ)<br>• **CVR** = (Đơn hàng / Click) × 100%<br>• Hệ thống thẻ thống kê tổng quan với so sánh tỷ lệ % tăng/giảm so với chu kỳ trước. |
| **4** | **AI nhận xét xu hướng & 03 gợi ý** | • Mô hình phân tích heuristic nhận diện các trạng thái: *Tăng trưởng tích cực (Scale Up)*, *Bão hòa quảng cáo (Ad Fatigue)*, *Cảnh báo đốt ngân sách*, hoặc *Vận hành ổn định*.<br>• Đánh giá chất lượng 3 chỉ số: CTR (Hook nội dung), CPC (Đấu thầu), CPA (Lợi nhuận đơn).<br>• **Chính xác 03 gợi ý hành động chiến thuật cụ thể**: Creative Hook Refresh, Audience & Cost Cap, CRO & Funnel Boost. |
| **5** | **Nút xuất báo cáo tóm tắt dạng text** | • 4 Template chuyên nghiệp: **Bản gửi Sếp (Executive)**, **Bản gửi Khách hàng (Agency)**, **Bản Kỹ thuật (Media Buyer)**, **Gửi nhanh Zalo/Slack**.<br>• Chỉnh sửa trực tiếp trước khi copy.<br>• **1-Click Copy vào Clipboard** kèm pháo hoa Confetti và Toast thông báo.<br>• Hỗ trợ tải file `.txt` và in / lưu PDF. |

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Data Visualization:** Chart.js, React-ChartJS-2
- **Data Persistence:** LocalStorage với Auto-seed & Schema Migration
- **Delight Effects:** Canvas-Confetti

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Khởi chạy môi trường phát triển (Development)
```bash
npm install
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 2. Build bản sản xuất (Production Build)
```bash
npm run build
npm run preview
```
Bản build tĩnh tối ưu hóa nằm gọn trong thư mục `dist/`.

---

## 💡 Hướng Dẫn Sử Dụng Nhanh Cho Marketer
1. **Trải nghiệm ngay trong 1 giây:** Bấm nút **"Nạp Data Mẫu"** trên thanh Navbar để nạp 10 ngày dữ liệu chiến dịch e-Commerce thực tế.
2. **Nhập thêm dữ liệu:**
   - Dùng thanh nhập nhanh ở đầu bảng dữ liệu để thêm từng ngày.
   - Hoặc bấm **"Nhập Nhiều Dòng / Excel"** để dán toàn bộ bảng từ Excel vào.
3. **Xem biểu đồ:** Chuyển đổi giữa các tab xem Đơn & Chi phí, Reach & Click hoặc CTR & CPA.
4. **Đọc nhận xét AI:** Xem ngay thẻ **AI Growth Copilot** để biết chiến dịch đang tăng hay giảm và 3 việc cần làm hôm nay.
5. **Gửi báo cáo:** Bấm nút màu gradient **"Xuất Báo Cáo"** -> Chọn mẫu "Bản Gửi Sếp" -> Bấm **"Copy Báo Cáo Gửi Ngay"** và dán vào Zalo/Email.
