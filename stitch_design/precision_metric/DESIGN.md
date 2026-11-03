---
name: Precision Metric
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#00423c'
  on-tertiary: '#ffffff'
  tertiary-container: '#005c54'
  on-tertiary-container: '#69d6c9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  metric-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  metric-compact:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes an authentic, mission-critical workspace tailored for growth marketers, performance media buyers, and analytics engineers managing high-spend campaigns. The visual persona reflects industrial precision, absolute data integrity, and high-density legibility inspired by modern financial and infrastructure tooling. 

The aesthetic adheres to **Technical Modernism**—anchored by structural grid alignments, tight baseline rhythm, purposeful micro-borders, and high-utility data density. It purposefully eschews decorative AI gradients, glowing neon highlights, exaggerated pill containers, and arbitrary ornamentation. Every visual token serves visual hierarchy, transactional clarity, and rapid scan rates across complex datasets, currency formats (VND / USD), and multichannel attribution models.

## Colors

The palette enforces a clear division between administrative superstructure and dynamic data presentation.

### Chromatic Structure & Surfaces
- **Header Shell (`#0F172A`)**: High-contrast command bar anchored by a hairline bottom border (`#1E293B`) and pure white functional typography.
- **Canvas Base (`#F8FAFC`)**: A cool, low-fatigue slate gray canvas providing optical contrast against white data cards.
- **Surface Tiles (`#FFFFFF`)**: Pure white containers structured with hairline boundaries (`#E2E8F0`).
- **Surface Muted (`#F1F5F9`)**: Neutral fill for table headers, segmented control tracks, and code/ID chips.

### Interactive Accents
- **Primary Indigo (`#4338CA`, Hover: `#3730A3`, Active Tint: `#EEF2FF`)**: Directs primary system workflows, interactive CTA buttons, and selected states.
- **Secondary Sky (`#0284C7`, Hover: `#0369A1`)**: Dedicated to comparative metric overlays, attribution channels, and secondary data vectors.
- **Tertiary Teal (`#0D9488`)**: Utilized for organic reach, conversion tracking milestones, and auxiliary telemetry channels.

### Semantic Triage
- **Success (`#16A34A`, Tint Surface: `#DCFCE7`, Border: `#86EFAC`)**: Positive ROI, active campaigns, ROAS improvements.
- **Warning (`#D97706`, Tint Surface: `#FEF3C7`, Border: `#FDE68A`)**: Budget cap alerts, bidding saturation, tracking anomalies.
- **Danger (`#DC2626`, Tint Surface: `#FEE2E2`, Border: `#FCA5A5`)**: Rejected creatives, pixel downtime, budget burn overdraft.

### Content Hierarchy
- **Text Primary (`#0F172A`)**: High-legibility deep slate for primary metrics, titles, and table contents.
- **Text Secondary (`#475569`)**: Balanced medium slate for secondary descriptions and interactive states.
- **Text Muted (`#64748B`)**: Subdued slate for field labels, table headers, metadata timestamps, and units.

## Typography

The type stack is executed entirely in Inter, calibrated to handle Vietnamese diacritics without clipping vertical line boundaries (`line-height` maintained at 1.35x or higher for all baseline text).

### Tabular Formatting
All numeric instances—including currency symbols (₫, $), percentage deltas, CTR, CPC, and conversion counts—must apply strict OpenType features: `font-feature-settings: "tnum" 1, "cv05" 1, "cv11" 1` alongside `font-variant-numeric: tabular-nums`. This prevents layout shifts during live data polling and ensures decimal alignment across data grid columns.

### Text Styling Roles
- **Metric Displays (`metric-display`, `metric-compact`)**: Reserved strictly for KPI values and summary delta metrics.
- **Micro Captions (`caption`)**: Rendered in uppercase with tracking (`+0.04em`) for table headers, column classifications, and meta groupings.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid, optimized for high data density with standard 8px/4px spatial rhythms.

### Grid & Canvas Structure
- **Breakpoints**: Mobile (`< 768px`, 4 columns, `margin-mobile: 1rem`), Tablet (`768px - 1024px`, 8 columns, `margin: 1.5rem`), Desktop (`> 1024px`, 12 columns, `margin: 1.5rem`, max-width `1600px`).
- **Gutters**: Default `gutter: 1rem` (16px) across desktop modules; `gutter-compact: 0.5rem` (8px) within metric groupings and inline control ribbons.
- **Section Rhythm**: Inter-card blocks stack with `1.5rem` gaps. Micro-elements inside metric cards employ `space-xs` (4px) and `space-sm` (8px) gaps.

### Reflow Rules
KPI metric clusters collapse from a 4-column row (Desktop) to a 2x2 grid (Tablet) and a stacked 1-column list (Mobile). Data tables retain strict horizontal overflow with pinned left columns on viewport reduction, rather than breaking cellular layout integrity.

## Elevation & Depth

Visual separation relies primarily on sharp micro-borders, tinted structural layers, and restrained, low-spread ambient shadows.

- **Level 0 (App Canvas)**: Flat `#F8FAFC` base layer.
- **Level 1 (Data Cards, Metric Tiles)**: Background `#FFFFFF`, bordered by `1px solid #E2E8F0`, ambient shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Hover Surfaces, Filter Bars)**: Background `#FFFFFF`, border `#CBD5E1`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Dropdowns, Popovers, Date Pickers)**: Background `#FFFFFF`, border `#CBD5E1`, shadow `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 4 (Modal Windows, Dialog Overlays)**: Surface `#FFFFFF`, border `#94A3B8`, backdrop `rgba(15, 23, 42, 0.60)`, shadow `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.

## Shapes

The design system enforces architectural corner radiuses, rejecting playful bubble geometry in favor of structured, utilitarian bounding boxes:

- **Cards & Data Panels**: `8px` (`0.5rem`).
- **Interactive Controls (Buttons, Inputs, Selectors)**: `6px` (`0.375rem`) for compact alignment with form field heights.
- **Tags, Status Badges, & Chips**: `4px` (`0.25rem`) to ensure high tabular density without vertical bloating.
- **Dividers & Focus Outlines**: Crisp `1px` lines; focus rings use an offset of `2px` with a `2px solid #4338CA` perimeter.

## Components

### Buttons
- **Primary**: Background `#4338CA`, text `#FFFFFF`, border `1px solid transparent`, height `36px` (`compact: 32px`), padding `0 14px`, font `label-md`. Hover: `#3730A3`. Active: `#312E81`. Focus: `2px` offset ring in `#4338CA`.
- **Secondary / Outline**: Background `#FFFFFF`, text `#0F172A`, border `1px solid #CBD5E1`, height `36px`, padding `0 14px`. Hover: background `#F8FAFC`, border `#94A3B8`.
- **Tertiary / Ghost**: Background transparent, text `#475569`, border `none`. Hover: background `#F1F5F9`, text `#0F172A`.

### KPI Metric Cards
- Container: Surface `#FFFFFF`, border `1px solid #E2E8F0`, radius `8px`, padding `16px`.
- Structure: 
  - Top row: Metric title (`label-sm`, `#64748B`) + context icon/action (`16px`, `#94A3B8`).
  - Middle: Primary value (`metric-display`, `#0F172A`, `tabular-nums`).
  - Bottom row: Trend badge (`label-sm`, semantic color) + comparative date baseline text (`body-sm`, `#64748B`).

### Status Badges & Metric Chips
- Height `22px`, radius `4px`, padding `0 6px`, font `label-sm`.
- **Success (Active / Tăng trưởng)**: Background `#DCFCE7`, text `#15803D`, border `1px solid #86EFAC`.
- **Warning (Tạm dừng / Giới hạn ngân sách)**: Background `#FEF3C7`, text `#B45309`, border `1px solid #FDE68A`.
- **Danger (Lỗi pixel / Vượt chi phí)**: Background `#FEE2E2`, text `#B91C1C`, border `1px solid #FCA5A5`.
- **Neutral (Bản nháp / Lưu trữ)**: Background `#F1F5F9`, text `#475569`, border `1px solid #E2E8F0`.

### Data Grid / Tables
- Table Container: Surface `#FFFFFF`, border `1px solid #E2E8F0`, radius `8px`, overflow hidden.
- Header: Background `#F8FAFC`, text `#64748B`, font `caption`, height `36px`, border bottom `1px solid #E2E8F0`, horizontal text alignment matching data (numbers right, labels left).
- Rows: Height `44px`, border bottom `1px solid #F1F5F9`, font `body-md`, hover background `#F8FAFC`.
- Cells: Tabular numbers applied to all metrics (CPC, CPA, CTR, Chi phí, Doanh thu).

### Inputs & Date Range Selectors
- Standard Input: Height `36px`, surface `#FFFFFF`, border `1px solid #CBD5E1`, radius `6px`, text `#0F172A`, font `body-md`, padding `0 10px`. Focus: border `#4338CA`, shadow `0 0 0 1px #4338CA`.
- Date Range Presets: Segmented control group, active tab background `#FFFFFF`, text `#0F172A`, shadow `0 1px 2px rgba(0,0,0,0.06)`, radius `4px`, container background `#F1F5F9` with `2px` padding.

### Checkboxes & Switch Toggles
- Checkbox: `16px x 16px`, radius `4px`, border `1px solid #CBD5E1`. Checked state: background `#4338CA`, border `#4338CA`, white inner check icon.
- Campaign Switch (Bật/Tắt): Track `36px x 20px`, radius `10px`, background `#CBD5E1`. Active state: background `#16A34A`. Thumb: `16px x 16px` white circle with `2px` translation margin.