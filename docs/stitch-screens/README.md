# Stitch Screen References

> Source: Google Stitch MCP — Project "PiggyBank by Fenmo"  
> Date: 2026-05-01  
> These files contain the raw HTML exported from Google Stitch for reference during implementation.

## Files

| File | Screen | Dimensions |
|------|--------|-----------|
| `dashboard.html` | Main App Dashboard (split panel) | 2560×2048 Desktop |
| `landing.html` | Landing Page | 2560×4374 Desktop |
| `mobile.html` | Mobile View | 780×1768 Mobile |

## Key Design Patterns Extracted

### Dashboard (`dashboard.html`)

**Layout:**
- `<aside>` — Left panel, `md:w-[40%]`, `bg-[#FAFAF9]`, sticky, `p-container-margin (48px)`
- `<main>` — Right panel, `md:w-[60%]`, `bg-[#F5F5F3]`

**Summary Card:**
```html
rounded-[20px] shadow-[0_2px_8px_rgba(22,22,63,0.06)] border-l-4 border-secondary p-lg
```
- Total label: `font-label-caps text-label-caps text-on-surface-variant uppercase`
- Amount: `font-h2 text-h2 text-primary-container` (₹12,450.00)

**Add Expense Form:**
- Amount input: `pl-12` (₹ prefix), `rounded-[10px]`, `focus:border-secondary focus:ring-1 focus:ring-secondary`
- Category: `rounded-full` pills — active = `bg-secondary-container text-on-secondary-container`
- Submit button: `bg-[#282626] rounded-[10px] font-data-display` + `arrow_forward` icon

**Expense Rows:**
```html
rounded-[20px] shadow-[0_2px_8px_rgba(22,22,63,0.06)] border-l-4 border-transparent
hover:border-secondary hover:-translate-y-1 transition-all duration-200
```
- Layout: icon circle | description + category badge + date | amount (right-aligned)
- Icon circle: `w-12 h-12 rounded-full bg-secondary-container/30 text-secondary`
- Category badge: `px-2 py-0.5 bg-surface-container rounded-sm font-label-caps text-[10px]`
- Amount: `font-data-display text-data-display text-primary-container`

**Filters:**
- Dropdown: `rounded-[10px] border border-outline-variant/20 font-body-sm`
- Sort: icon-only button, same radius

### Landing Page (`landing.html`)

**Hero:**
- Headline: `font-h1 text-h1 text-primary-container lg:text-[64px] lg:leading-[1.1]`
- Background gradient blob: `from-secondary-container to-surface-variant blur-[120px] rounded-full opacity-40`
- Primary CTA: `bg-primary text-on-primary font-label-caps uppercase px-lg py-[16px] rounded-xl`
- Stat pills: `bg-surface-container border border-outline-variant/50 rounded-full px-md py-sm`

**Feature Cards:**
```html
bg-secondary-container/30 backdrop-blur-sm rounded-[20px] p-lg border border-secondary-container/50
```

**How It Works steps:**
- Connecting line: `absolute h-[1px] bg-outline-variant/30`
- Step circles: `w-16 h-16 bg-surface-container-highest rounded-full`

### Mobile View (`mobile.html`)

**IBM Plex Mono usage confirmed on amounts:**
```html
font-['IBM_Plex_Mono'] font-bold text-on-surface  ← amounts in expense rows
font-['IBM_Plex_Mono'] text-[10px] uppercase       ← bottom nav labels
```

**Bottom nav:**
```html
bg-white/80 backdrop-blur-md rounded-t-[20px] border-t border-[#324158]/10
shadow-[0_-4px_12px_rgba(22,22,63,0.04)] fixed bottom-0
```
- Active tab: `bg-[#C0DBD4] text-[#16163F] rounded-[10px]`

**Summary card mobile:** `border-l-4 border-secondary-container`

**Add Expense accordion (collapsed by default):**
```html
rounded-[20px] shadow p-lg flex justify-between items-center cursor-pointer
```
With `add_circle` icon + `expand_more` chevron

## Tailwind Config (exact — use for mapping)

```js
colors: { /* all Stitch Material tokens — see DESIGN.md */ }
borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" }
spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px",
           gutter: "24px", "container-margin": "48px" }
fontFamily: { h1: ["Work Sans"], h2: ["Work Sans"], h3: ["Work Sans"],
              "body-md": ["Inter"], "body-sm": ["Inter"], "body-lg": ["Inter"],
              "label-caps": ["Inter"], "data-display": ["Inter"] }
```

> **Note:** IBM Plex Mono is referenced inline as `font-['IBM_Plex_Mono']` in the Stitch output  
> for amounts. In our Tailwind config this maps to `font-mono` via the `--font-mono` CSS variable.

## Implementation Notes

1. The Stitch output uses `font-data-display` for amounts in the desktop dashboard — we override this to `font-mono` (IBM Plex Mono) per the Fenmo brand rule.
2. `rounded-xl` in Stitch = `0.75rem` = effectively `12px`. Our button radius token is `10px` (closer to `rounded-[10px]` used inline).
3. The teal color `secondary` in Stitch = `#006b5e`, our brand token `--color-teal` = `#1A7F71`. These are close — use `#1A7F71` in React components.
4. `bg-primary` in Stitch = `#000000`. Our CTA uses `--color-charcoal` = `#282626` per brand guidelines.
