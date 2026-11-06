---
name: Cupertino Precision Analytics
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#414753'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cbb'
  primary: '#0059b5'
  on-primary: '#ffffff'
  primary-container: '#0071e3'
  on-primary-container: '#fcfbff'
  inverse-primary: '#abc7ff'
  secondary: '#005ab3'
  on-secondary: '#ffffff'
  secondary-container: '#0073e0'
  on-secondary-container: '#fefcff'
  tertiary: '#006473'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f92'
  on-tertiary-container: '#f3fcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aac7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#00468d'
  tertiary-fixed: '#a5eeff'
  tertiary-fixed-dim: '#61d6ee'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-metric-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  title-section:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  title-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-medium:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-compact:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-pill:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  caption-micro:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 13px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an analytical interface informed by Apple's Human Interface Guidelines, tailored specifically for Vietnamese media buyers, performance marketers, and growth executives. The brand voice balances quiet precision with effortless legibility: data takes center stage without visual clutter or sensory overload. 

The aesthetic is ultra-minimalist and functional. High-frequency advertising metrics—such as chi phí trên mỗi lượt kết quả (CPR), lợi tức chi tiêu quảng cáo (ROAS), and giá mỗi nghìn lần hiển thị (CPM)—are presented with absolute typographic clarity. The interface relies on pure white cards resting on soft, airy canvases, razor-sharp 1px neutral borders, micro-blur translucent navigation elements, and an iconic electric blue primary action color. Every interaction feels fluid, immediate, and tactfully understated.

## Colors

The palette embraces Apple's restrained daylight chromatic model. It features a stark separation between the structural foundation and active data elements:

- **Canvas Foundation**: The global background employs `#F8FAFC`, paired with pure `#FFFFFF` for primary content cards and structural containers.
- **Primary Brand Accent (`#0071E3`)**: Used sparingly for critical primary interactions, key state toggles, and high-priority filters. A softer tint (`rgba(0, 113, 227, 0.08)`) serves as the hover and active pill selection highlight.
- **Secondary Accent (`#0A84FF`)**: Reserved for live telemetry indicators, secondary line chart series, and active segmented controls.
- **Data Status Tokens**:
  - *Tích cực (Positive/Trend Up)*: Deep Emerald `#059669` text over an ultra-soft `#ECFDF5` pill background.
  - *Tiêu cực (Negative/Trend Down)*: Crimson Rose `#E11D48` text over a soft `#FFF1F2` background.
  - *Trung tính (Neutral/Stagnant)*: Muted Slate `#64748B` text over `#F1F5F9`.
- **Text & Neutral Hierarchy**:
  - `Text Primary`: `#1D1D1F` (deep graphite black, avoiding harsh `#000000`).
  - `Text Secondary`: `#6E6E73` (subtle secondary metadata and unit descriptors).
  - `Text Tertiary`: `#86868B` (helper labels, disabled states, and timestamps).
  - `Hairline Borders`: `#E5E7EB` on desktop tables; `#F1F5F9` for internal card dividers.

## Typography

The typography leverages `Plus Jakarta Sans` for its clarity, geometric balance, and clean diacritic rendering in Vietnamese text (tổ hợp dấu tiếng Việt như ễ, ặ, ứ, ồ). It delivers an aesthetic close to Apple's San Francisco system typography while ensuring cross-platform consistency.

- **Tabular Numerals**: Apply `font-feature-settings: "tnum" 1` across all performance metrics, monetary values (₫ / VND), and percentage indicators to avoid horizontal shifts during real-time data polling.
- **Diacritic Clearance**: Line-height tokens carry proportional vertical rhythm (`1.3` to `1.5`) to prevent stacked Vietnamese tone marks from clipping against upper row borders or card bounds.
- **Negative Letter Spacing**: Large metric values and headlines use subtle negative tracking (`-0.01em` to `-0.03em`) to mimic Cupertino's dense, high-end display typography.

## Layout & Spacing

The system enforces a flexible grid grounded on an 8-point base module, prioritizing breathing room around critical metrics:

- **Desktop (12 Columns, max-width 1440px)**: 12-column layout with `2rem` outer margins and `1.25rem` gutters. Metric cards span 3 columns (4 cards per row) or 4 columns (3 cards per row) for campaign drill-downs.
- **Tablet (8 Columns, 768px – 1024px)**: 8-column layout with `1.5rem` outer canvas padding. Metric cards span 4 columns (2 cards per row).
- **Mobile (< 768px)**: 4-column layout reflowing metric tiles into 2-column micro-cards or full-width vertical stacks with `1rem` outer canvas margins.
- **Vertical Spacing Rhythm**: Dashboard sections maintain `2rem` spacing between widget groups, while internal card components maintain `1rem` or `1.5rem` internal padding to ensure cards feel lightweight and uncluttered.

## Elevation & Depth

Visual hierarchy relies on structural purity and ultra-subtle ambient diffusion rather than deep or dramatic drop shadows:

- **Surface Tier 0 (Canvas Base)**: `#F8FAFC`, flat, completely unshadowed.
- **Surface Tier 1 (Cards & Content Widgets)**: `#FFFFFF` encased in a crisp 1px hairline border (`#E5E7EB`). Supported by an ambient micro-shadow: `0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)`.
- **Surface Tier 2 (Hovered Cards & Interactive Tables)**: `0 8px 24px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)` with border transition to `#D1D5DB`.
- **Surface Tier 3 (Floating Bars, Dropdowns, Date-Pickers)**: Backdrop blur filter (`backdrop-filter: blur(20px) saturate(180%)`) over `rgba(255, 255, 255, 0.85)` with shadow `0 16px 32px rgba(0, 0, 0, 0.08)`.

## Shapes

The design system uses soft, continuous squircle-like corners characteristic of modern Apple hardware and software:

- **Containers & Dashboard Cards**: Configured with `rounded-xl` (`1rem` / 16px) or `rounded-2xl` (`1.25rem` / 20px) on outer dashboard containers for a modern, approachable feel.
- **Buttons & Input Controls**: Styled with `rounded-lg` (`0.625rem` / 10px) to balance friendly curves with precise tap boundaries.
- **Status Badges, Metric Trends & Segmented Controls**: Full pills (`rounded-full` / 9999px) to convey compact status and fluid clickability.

## Components

### Buttons
- **Primary Action (e.g., "Tạo chiến dịch", "Xuất báo cáo")**: Solid `#0071E3` fill, `#FFFFFF` text, `font-weight: 500`. On hover: `#0062C4`. Active state compresses slightly via `transform: scale(0.98)`.
- **Secondary Action**: Background `rgba(0, 113, 227, 0.08)`, text `#0071E3`. Borderless, clean, with hover state shifting to `rgba(0, 113, 227, 0.12)`.
- **Tertiary/Ghost**: Transparent fill, text `#1D1D1F`, border 1px solid `#E5E7EB`. Hover background `#F9FAFB`.

### Metric Trend Pills (Chỉ số Tăng trưởng)
- Trend indicators are styled as compact pills (`padding: 2px 8px`, `border-radius: 9999px`).
- **Tăng (Positive / Green)**: Text `#059669`, background `#ECFDF5`, accompanied by a sharp upward arrow icon (`↑ +18.4%`).
- **Giảm (Negative / Red)**: Text `#E11D48`, background `#FFF1F2`, accompanied by a downward arrow icon (`↓ -6.2%`).
- **Không đổi (Neutral)**: Text `#64748B`, background `#F1F5F9` (`→ 0.0%`).

### Segmented Controls (Bộ chọn khoảng thời gian)
- Replicates macOS/iOS segmented toggles (e.g., "Hôm nay", "7 ngày qua", "30 ngày qua", "Tháng này").
- Placed inside a `#F1F5F9` background container with `4px` padding. Active item features pure `#FFFFFF` background, subtle `0 1px 3px rgba(0, 0, 0, 0.08)` shadow, and `#1D1D1F` text. Inactive tabs use transparent backgrounds with `#6E6E73` text.

### Performance Metric Cards (Thẻ KPI)
- Card backgrounds are solid `#FFFFFF` with a `1px` solid `#E5E7EB` border.
- Layout order:
  1. Card label in `label-compact` uppercase/tracked typography (`#6E6E73`) alongside an optional info tooltip.
  2. Large numerical metric in `headline-metric` (`#1D1D1F`) with Vietnamese Dong suffix (`₫`) formatted clearly (e.g., `12.450.000 ₫`).
  3. Bottom row containing the trend pill and comparative timeframe label (e.g., `so với 7 ngày trước`).

### Form Inputs & Filters
- Clean inputs with border `1px solid #E5E7EB`, height `40px`, and font size `14px`.
- Focus state reveals a `0 0 0 3px rgba(0, 113, 227, 0.25)` halo with border color `#0071E3`.
- Placeholder text in `#86868B`.

### Tables (Bảng dữ liệu chiến dịch Facebook)
- Header rows feature a subtle background of `#F8FAFC` with bottom border `1px solid #E5E7EB`, text `label-compact` in `#6E6E73`.
- Cell rows are `48px` minimum height, pure `#FFFFFF`, separating rows with a single `1px solid #F1F5F9` divider.
- Hovering a row applies a clean background shift to `#F9FAFB`.
- Campaign status toggles use Apple-style binary toggle switches (active in `#0071E3`, inactive in `#E5E7EB`).