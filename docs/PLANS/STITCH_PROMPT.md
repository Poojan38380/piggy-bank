# Stitch Design Prompt — PiggyBank by Fenmo

## Context
Design a personal expense tracker web app called **"PiggyBank"** that is an internal tool built by the **Fenmo AI** team (fenmo.ai). It must feel like a natural extension of the Fenmo brand — same design language, same typographic identity, same professional-yet-intelligent aesthetic.

Fenmo is an AI co-worker platform for finance teams. Their brand is: **sleek, intelligent, autonomous, reliable, professional**. Their tagline philosophy: "no dashboards, clear outcomes." Apply the same ethos here — no clutter, clear numbers, purposeful interactions.

---

## Brand DNA to replicate exactly

### Color Palette
```
Primary Dark / Headings:    #16163F  (deep navy, used for hero text)
Primary Action / Button:    #282626  (near-black charcoal)
Teal Brand Accent:          #1A7F71  (Fenmo's signature teal — logo, highlights, active states)
Soft Teal / Card Fill:      #C0DBD4  (mint-teal, used for secondary cards, active tabs)
Body Text:                  #324158  (dark gray-blue, readable without harshness)
Background Primary:         #FAFAF9  (warm near-white)
Background Card:            #FFFFFF  (pure white)
Gradient Accent:            linear-gradient(135deg, #C0DBD4 0%, #E8D5E8 100%)  (mint → lavender, used on hero/feature backgrounds)
Error:                      #C0392B  (muted, not loud)
Success:                    #1A7F71  (same as teal — success = on-brand)
```

### Typography
```
Display / Hero headings:    Work Sans, 700 weight — geometric, authoritative
Body copy:                  IBM Plex Sans, 400–500 weight — clean, professional
Labels / Buttons / Data:    IBM Plex Mono, 600 weight — THIS IS THE KEY BRAND DIFFERENTIATOR
                            Use for: button text, amount displays, category tags, 
                            filter labels, totals, all numeric values
```

### Visual Language Rules
- Border radius: **10px** for buttons and inputs; **20px** for cards; **40px** for large hero cards
- Shadows: `0 2px 8px rgba(22, 22, 63, 0.06)` — subtle, not dramatic
- No heavy drop shadows or neon glows
- Backgrounds: layered — primary bg + card surface + soft gradient accents
- Buttons: never fully rounded (pill). Always `border-radius: 10px`
- Use `→` or `↗` arrows in primary CTA buttons (Fenmo's signature touch)
- Spacing: generous — 24px/32px/48px rhythm
- Grids: clean 12-column on desktop, 4-column on mobile

---

## App: PiggyBank

**Tagline**: "Your money, clearly."  
**Sub-tagline**: "Track every rupee. No spreadsheets. No confusion."  
**Logo**: Lowercase wordmark "piggybank." in Work Sans Bold, with a small teal `🐷` or coin icon to the left. Keep it minimal and professional — not cute/childish.

---

## Screens to Design

### SCREEN 1 — Landing Page (Full Page)

**Hero Section:**
- Navbar: "piggybank." logo left | "Powered by Fenmo AI ↗" badge right (in IBM Plex Mono, teal)
- Headline: "Your money, clearly." in Work Sans 700, #16163F, 64px
- Sub-headline: "Track every rupee with precision. Filter, sort, and understand your spending — no dashboards, just numbers." in IBM Plex Sans, #324158
- Two CTAs: Primary button "Start Tracking →" (#282626 bg, white IBM Plex Mono text, 10px radius) | Ghost button "See how it works" (border: #282626)
- Hero visual: a stylized split-panel mockup of the app — left panel shows an expense form, right panel shows expense cards. Use the mint-teal gradient as the hero background blob.
- Stat pills below hero: "₹0 float math" · "Retry-safe submissions" · "Instant filters" — in IBM Plex Mono, #1A7F71

**Features Section:**
- Section header: "Built for clarity, not complexity" (Work Sans 700, #16163F)
- 3 feature cards with soft teal (#C0DBD4) backgrounds, 20px radius:
  1. "Integer-precise money" — no float rounding ever
  2. "Retry-safe by design" — submit twice, create once  
  3. "Filter by category" — with URL-persistent state
- Each card: teal icon (↗ or similar) + title in Work Sans 600 + description in IBM Plex Sans

**How It Works Section:**
- 3-step flow with thin connecting lines (Fenmo's flow diagram pattern):
  1. Add expense → 2. Auto-categorized → 3. See totals instantly
- Background: mint-to-lavender gradient strip

**CTA Footer Section:**
- "Ready to track smarter?" headline
- "Start Tracking →" button
- Fenmo AI branding: "Built with Fenmo AI design system"

**Footer:**
- "piggybank." wordmark | "© 2026 PiggyBank — Powered by Fenmo AI"
- Links: Privacy · Terms

---

### SCREEN 2 — Main App Dashboard (Split Panel — Desktop)

**Layout: 2-column split**
- **Left Panel** (40% width, sticky, #FAFAF9 bg):
  - App header: "piggybank." wordmark + "← All expenses" link
  - Summary card (white, 20px radius, teal left-border accent):
    - "Total Spending" label (IBM Plex Mono, small, #1A7F71)
    - Amount: "₹12,450.00" in Work Sans 700, 48px, #16163F
    - Sub-text: "across 14 expenses this month" (IBM Plex Sans, #324158)
    - If filtered: "In Food · ₹3,200" (IBM Plex Mono, teal badge)
  - Divider
  - **Add Expense Form** (inline, not modal):
    - Title: "Add Expense" (Work Sans 600, #16163F)
    - Amount field: Large input with ₹ prefix (IBM Plex Mono, 32px amount text), #16163F
    - Category: Pill selector — show 8 preset pills + "+ Custom" pill that expands a text input
      - Pills use #C0DBD4 bg, active pill uses #1A7F71 bg + white text
    - Description: text input
    - Date: date picker, defaults to today
    - Submit button: "Add Expense →" full-width, #282626, IBM Plex Mono, 10px radius, with loading spinner state
    - Error state: red inline banner below button
    - Success: green flash + form reset

- **Right Panel** (60% width, scrollable, #F5F5F3 bg):
  - Sticky sub-header with filters:
    - Category dropdown (styled, 10px radius)
    - Sort toggle: "Newest First ↓" / "Oldest First ↑" (IBM Plex Mono, #324158)
  - Expense list as cards:
    - Each card: white, 20px radius, subtle shadow
    - Layout: [Category badge] [Description + date below in smaller text] [Amount right-aligned in IBM Plex Mono bold, #16163F]
    - Category badge: colored pill — 8 distinct muted earth-tones (no neons)
    - Date: "1 May 2026" in IBM Plex Sans, #324158, small
    - Hover state: slight lift + teal left-border appears
  - Empty state: centered, minimal illustration of a piggy bank outline + "No expenses yet. Add your first one above." in IBM Plex Sans

---

### SCREEN 3 — Loading & Skeleton States

- Expense list: 5 skeleton cards with shimmer animation (light gray → lighter gray)
- Summary amount: skeleton bar
- Submit button: spinner inside, text changes to "Saving..." (IBM Plex Mono)
- Use #C0DBD4 as skeleton base color (on-brand shimmering)

---

### SCREEN 4 — Mobile View (375px width)

**Single column, top-to-bottom:**
1. Sticky navbar: "piggybank." logo + hamburger/icon
2. Summary card: full width, teal left-border, amount prominent
3. "Add Expense" accordion — collapsed by default, tap to expand full form
4. Filter chips: horizontal scroll row (category pills)
5. Sort toggle button
6. Expense cards: full width, same card design as desktop

**Mobile form (expanded):**
- Amount input takes full width, large
- Category pills wrap to 2 rows
- Submit button: full width, sticky at bottom of form

---

## Design Constraints (critical — do NOT violate)

1. **Never** use purple/blue fintech gradients as primary backgrounds
2. **Never** fully round buttons (no pills on CTAs)
3. **Never** use Inter, Roboto, or Arial — only Work Sans, IBM Plex Sans, IBM Plex Mono
4. **Never** use neon colors or high-saturation effects
5. **Always** show amounts in IBM Plex Mono — this is non-negotiable
6. **Always** use teal (#1A7F71) as the accent, not blue
7. Keep it calm, professional, trustworthy — "quiet luxury fintech"
8. Amount hierarchy: rupee amount is ALWAYS the most visually prominent element in any expense card

---

## Tone
The design should feel like it was designed by the Fenmo AI product team as an internal tool they actually use. Professional. Precise. No decoration for decoration's sake. Every visual element earns its place.

---

*Use this prompt in Google Stitch to generate all 4 screens simultaneously.*
