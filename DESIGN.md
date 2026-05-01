# DESIGN.md — PiggyBank Design System
> Source: Google Stitch MCP · Project: "PiggyBank by Fenmo"  
> Brand: Fenmo AI (fenmo.ai) · Philosophy: "Quiet Luxury Fintech"  
> Generated: 2026-05-01 · DO NOT manually override — update via Stitch MCP

---

## Font Stack

| Role | Family | Usage |
|------|--------|-------|
| **Display** | `Work Sans` | H1–H3 headings, hero text, card titles |
| **Body** | `Inter` | Body copy, descriptions, labels, UI text |
| **Mono / Data** | `IBM Plex Mono` | **All rupee amounts**, buttons, filter labels, tags, totals — NON-NEGOTIABLE |

```css
--font-display: 'Work Sans', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'IBM Plex Mono', monospace;
```

---

## Color Palette

### Fenmo Brand Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | `#16163F` | Primary dark — hero headings, primary-container |
| `--color-charcoal` | `#282626` | Primary CTA buttons, primary action |
| `--color-teal` | `#1A7F71` | Brand accent — logo, success, active states |
| `--color-teal-soft` | `#C0DBD4` | Card fills, skeleton base, category pills, chips |
| `--color-body` | `#324158` | Body text, secondary labels |
| `--color-bg` | `#FAFAF9` | Page background (warm off-white) |
| `--color-surface` | `#FFFFFF` | Card surface |
| `--color-bg-panel` | `#F5F5F3` | Right panel / secondary bg |
| `--color-error` | `#C0392B` | Error states (muted, not loud) |
| `--color-success` | `#1A7F71` | Same as teal — success = on-brand |

### Stitch Material Tokens (complete)

```
surface:                  #f9f9ff
surface-dim:              #cbdbf8
surface-bright:           #f9f9ff
surface-container-lowest: #ffffff
surface-container-low:    #f0f3ff
surface-container:        #e7eeff
surface-container-high:   #dee9ff
surface-container-highest:#d4e3ff
on-surface:               #0c1c31
on-surface-variant:       #47464e
inverse-surface:          #223147
inverse-on-surface:       #ebf1ff
outline:                  #77767f
outline-variant:          #c8c5cf
primary:                  #000000
on-primary:               #ffffff
primary-container:        #16163f
on-primary-container:     #807faf
secondary:                #006b5e
on-secondary:             #ffffff
secondary-container:      #99f3e2
on-secondary-container:   #007164
error:                    #ba1a1a
on-error:                 #ffffff
error-container:          #ffdad6
on-error-container:       #93000a
background:               #f9f9ff
on-background:            #0c1c31
```

### Gradient
```
--gradient-hero: linear-gradient(135deg, #C0DBD4 0%, #E8D5E8 100%)
```
> Used exclusively for Hero cards (total balance), feature backgrounds, and high-impact moments.

---

## Typography Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|--------|------|--------|-------------|----------------|
| `--type-h1` | Work Sans | 40px | 700 | 1.2 | -0.02em |
| `--type-h2` | Work Sans | 32px | 700 | 1.2 | — |
| `--type-h3` | Work Sans | 24px | 700 | 1.3 | — |
| `--type-body-lg` | Inter | 18px | 400 | 1.6 | — |
| `--type-body-md` | Inter | 16px | 400 | 1.6 | — |
| `--type-body-sm` | Inter | 14px | 500 | 1.5 | — |
| `--type-data` | Inter | 16px | 600 | 1 | 0.02em |
| `--type-label` | Inter | 12px | 600 | 1 | 0.05em |
| `--type-amount` | **IBM Plex Mono** | contextual | 600–700 | 1 | 0 |

> **Rule**: Every ₹ amount on screen — summary cards, expense rows, totals — MUST use `IBM Plex Mono`.

---

## Spacing Scale

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-xxl` | 48px |
| `--gutter` | 24px |
| `--container-margin` | 48px |
| `--container-max` | 1440px |

---

## Border Radius

| Token | Value | Used For |
|-------|-------|----------|
| `--radius-sm` | 4px | Chips, small badges |
| `--radius-input` | 10px | **Buttons**, input fields, select |
| `--radius-card` | 20px | **Standard content cards**, expense rows |
| `--radius-hero` | 40px | **Hero/summary cards**, large features |
| `--radius-full` | 9999px | Status pills, loading indicators |

> **Rule**: No pill buttons. CTAs always use `10px` radius.

---

## Elevation & Shadows

| Level | Surface | Shadow |
|-------|---------|--------|
| Level 0 — Background | `#FAFAF9` | none |
| Level 1 — Cards | `#FFFFFF` | `0 2px 8px rgba(22, 22, 63, 0.06)` |
| Level 2 — Hover/Focus | `#FFFFFF` | `0 6px 20px rgba(22, 22, 63, 0.10)` |
| Level 3 — Modals/Overlays | `#FFFFFF` | `0 8px 24px rgba(22, 22, 63, 0.08)` |

```css
--shadow-card:  0 2px 8px rgba(22, 22, 63, 0.06);
--shadow-hover: 0 6px 20px rgba(22, 22, 63, 0.10);
--shadow-modal: 0 8px 24px rgba(22, 22, 63, 0.08);
```

---

## Component Specifications

### Buttons
- **Primary**: `background: #282626`, `color: #fff`, `border-radius: 10px`, `font: IBM Plex Mono 600`
- **Secondary/Ghost**: `border: 1px solid #16163F`, `color: #16163F`, `border-radius: 10px`
- **Teal Soft**: `background: #C0DBD4`, `color: #16163F`, `border-radius: 10px`
- Text: append `→` to primary CTAs (Fenmo signature)
- Hover: color shift only — no shadow change
- Loading: spinner inside button, text changes to `"Saving..."` in IBM Plex Mono
- **NEVER use pill shape** (border-radius: 9999px) on CTA buttons

### Input Fields
- `border-radius: 10px`
- `border: 1px solid rgba(50, 65, 88, 0.20)` (--color-body at 20% opacity)
- Focus: `border-color: #1A7F71` + `box-shadow: 0 0 0 3px rgba(26, 127, 113, 0.10)`
- Amount input: large `IBM Plex Mono` text with `₹` prefix

### Cards — Expense Rows
- `border-radius: 20px`
- `background: #FFFFFF`
- `box-shadow: var(--shadow-card)`
- Hover: `box-shadow: var(--shadow-hover)` + teal left-border `3px solid #1A7F71`
- Layout: `[Category Badge] [Description + date below] [Amount right-aligned]`

### Summary / Hero Card
- `border-radius: 40px`
- `background: var(--gradient-hero)`
- Left accent border: `4px solid #1A7F71`
- Amount: `Work Sans 700 48px #16163F`
- Label: `IBM Plex Mono small #1A7F71`

### Category Badges

| Category | Background | Text |
|----------|-----------|------|
| Food | `#FEF3C7` | `#92400E` |
| Transport | `#DBEAFE` | `#1E40AF` |
| Bills | `#FCE7F3` | `#9D174D` |
| Shopping | `#EDE9FE` | `#5B21B6` |
| Health | `#D1FAE5` | `#065F46` |
| Entertainment | `#FFE4E6` | `#9F1239` |
| Education | `#E0F2FE` | `#0C4A6E` |
| Other | `#F1F5F9` | `#475569` |

- `border-radius: 4px` (sm)
- `font: IBM Plex Mono 600 12px`
- `padding: 4px 8px`

### Skeleton Loader
- Base color: `#C0DBD4` (--color-teal-soft)
- Animation: shimmer from `#C0DBD4` → `#E8F5F2`
- `border-radius`: matches the element being replaced

### Data Tables
- No heavy borders
- Row divider: `1px solid rgba(50, 65, 88, 0.10)`
- Cell padding: `16px` vertical
- Header: `Inter 600 12px` uppercase

---

## Design Constraints (CRITICAL — never violate)

1. ❌ No purple/blue fintech gradients as primary backgrounds
2. ❌ No pill-shaped CTA buttons (`border-radius: 9999px` forbidden on buttons)
3. ❌ No neon colors or high-saturation effects
4. ❌ No heavy drop shadows or glow effects
5. ✅ All rupee amounts → `IBM Plex Mono` always
6. ✅ Teal `#1A7F71` as the single accent color
7. ✅ Calm, professional, trustworthy — "quiet luxury fintech" aesthetic
8. ✅ Amount is ALWAYS the most visually prominent element in expense cards
9. ✅ `→` arrow in primary CTA button text (Fenmo signature)
10. ✅ Generous spacing: 24/32/48px rhythm
