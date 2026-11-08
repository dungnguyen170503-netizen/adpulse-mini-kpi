# AdPulse Mini KPI

Dashboard KPI Facebook Ads — VIBE-CODING 2026, đề 7, bảng B – Kinh tế.

## Bản ghép chạy trên máy (Lộc)

Đã ghép phần Dũng + Khoa và bổ sung Gemini AI, chatbot, HTML email. Xem [hướng dẫn chạy, contract và minh chứng](docs/loc/README.md).

```sh
npm install
npm run dev
```

Mở http://127.0.0.1:5173. Máy mới cần cấu hình `.env.local` theo `.env.example`. Khóa chỉ nằm phía máy chủ.

## Trạng thái kế hoạch gốc

Plan chiến lược đã được duyệt. Plan kế hoạch đã có bản dự thảo và phản biện lần đầu; Plan thực thi mới ở mức phân gói. Spec, thiết kế responsive và app chưa được build trên nhánh chính. [Trạng thái Vibecode-Team](vibecode-team/project-state.json) là điểm bắt đầu cho phiên làm việc tiếp theo.

## Tài liệu nhóm

- [Chiến lược đã chốt](vibecode-team/references/product-strategy.md)
- [Plan kế hoạch](vibecode-team/references/delivery-plan.md) và [phản biện](vibecode-team/references/delivery-plan-review.md)
- [Phân gói thực thi](vibecode-team/references/execution-plan.md)
- [Gói giao việc một lần cho ba thành viên](vibecode-team/references/team-handoff-once.md)
- [Workflow và cổng chuyển bước](vibecode-team/references/workflow.md)

Nhóm làm chung trong repo này bằng nhánh và pull request. Nhánh `feature/ban-c-ai-report` là sản phẩm cũ để tham khảo; các công thức và đường AI trong đó cần đối chiếu với chiến lược đã duyệt trước khi tái sử dụng. Mã kết nối 9Router/Gemini sẽ được cấp và cấu hình về sau; không đưa secret vào repo.
