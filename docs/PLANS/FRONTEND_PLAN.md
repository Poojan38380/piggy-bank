# Frontend Implementation Plan — PiggyBank by Fenmo

> Stack: **Next.js 16.2** · **TypeScript** · **Prisma + MongoDB** · **Tailwind CSS v4** · **Google Stitch MCP**  
> App Name: **PiggyBank** | Brand: **Fenmo AI** (fenmo.ai)  
> Approach: **Frontend-first** → mock data → backend wiring  
> Date: May 1, 2026

---

## Decisions — LOCKED ✅

| Decision | Choice |
|----------|--------|
| Design direction | Fenmo AI brand — navy/teal/mono, "quiet luxury fintech" |
| App name | **PiggyBank** |
| Categories | Presets (8) + custom text input |
| Layout | Split panel (desktop) + single column (mobile) |
| Landing page | YES — full marketing landing page |
| Font stack | Work Sans · IBM Plex Sans · IBM Plex Mono |
| Accent color | `#1A7F71` Fenmo teal |

---

## Brand Design System — Fenmo AI

### Colors (extracted from fenmo.ai live site)
```
--color-navy:       #16163F   /* hero text, primary headings */
--color-charcoal:   #282626   /* CTA buttons, primary action */
--color-teal:       #1A7F71   /* accent, logo, success, active */
--color-teal-soft:  #C0DBD4   /* card fills, skeleton, pills */
--color-body:       #324158   /* body text, secondary labels */
--color-bg:         #FAFAF9   /* page background */
--color-surface:    #FFFFFF   /* card surface */
--color-bg-panel:   #F5F5F3   /* right panel background */
--color-error:      #C0392B   /* inline error state */
--gradient-hero:    linear-gradient(135deg, #C0DBD4 0%, #E8D5E8 100%)
```

### Typography
```
--font-display:  'Work Sans'     → headings, hero, card titles
--font-body:     'IBM Plex Sans' → body copy, descriptions, labels
--font-mono:     'IBM Plex Mono' → amounts, buttons, tags, filters, data
```

### Component Tokens
```
--radius-button: 10px
--radius-card:   20px
--radius-hero:   40px
--shadow-card:   0 2px 8px rgba(22, 22, 63, 0.06)
--shadow-hover:  0 6px 20px rgba(22, 22, 63, 0.10)
```

---

## File Structure (Target)

```
fenmo-assignment/
├── app/
│   ├── layout.tsx              ← Update: fonts, metadata, SEO
│   ├── page.tsx                ← LANDING PAGE (marketing)
│   ├── dashboard/
│   │   └── page.tsx            ← SPLIT PANEL APP (main tracker)
│   ├── globals.css             ← Full Fenmo design system tokens
│   └── api/
│       └── expenses/
│           ├── route.ts        ← GET + POST (Phase 2)
│           └── categories/
│               └── route.ts    ← GET categories (Phase 2)
├── components/
│   ├── ui/                     ← Primitives: Button, Input, Select, Badge, Skeleton, Toast
│   ├── landing/                ← Landing-specific sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   └── LandingCTA.tsx
│   ├── app/                    ← Dashboard-specific components
│   │   ├── AppHeader.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseFilters.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseCard.tsx
│   │   └── CategoryBadge.tsx
│   └── shared/
│       └── FenmoFooter.tsx
├── hooks/
│   ├── useExpenses.ts
│   └── useCategories.ts
├── lib/
│   ├── prisma.ts               ← Exists ✅
│   ├── categories.ts
│   ├── money.ts
│   ├── validations.ts
│   └── mock-data.ts            ← Removed after backend phase
├── types/
│   └── index.ts
└── DESIGN.md                   ← From Stitch MCP
```

---

## Execution Phases

### Phase 0 — Stitch MCP Design Extraction
See `docs/PLANS/STITCH_PROMPT.md` for the exact prompt to paste into Stitch.

1. In agent chat: `"List my Stitch projects"` → confirm project accessible
2. Paste the full prompt from `STITCH_PROMPT.md` into Stitch → generate all 4 screens
3. Run Stitch MCP to extract tokens → `DESIGN.md` + update `globals.css`

**Fallback**: If Stitch unavailable, use the brand tokens above directly.

---

### Phase 1 — Foundation Setup (20 min)
```bash
pnpm add zod date-fns
```
- `types/index.ts` — Expense, ExpenseFilters, ApiResponse, ExpenseMeta
- `lib/categories.ts` — PRESET_CATEGORIES + custom category handling
- `lib/money.ts` — rupeesToPaise, paiseToRupees, formatCurrency, sumPaise
- `lib/validations.ts` — Zod schemas (shared frontend/backend)
- `lib/mock-data.ts` — 10 hardcoded mock expenses across 5 categories
- `app/globals.css` — Full Fenmo design system (CSS custom properties)
- `app/layout.tsx` — Google Fonts: Work Sans + IBM Plex Sans + IBM Plex Mono

---

### Phase 2 — Hooks (30 min)
- `hooks/useExpenses.ts` — fetch with filter/sort params, URL param sync
- `hooks/useCategories.ts` — fetch distinct categories, merge with presets

---

### Phase 3 — Primitive UI Components (45 min)

| Component | Key Notes |
|-----------|-----------|
| `ui/Button` | Variants: primary (charcoal), ghost, teal. Loading state. 10px radius. Arrow `→` in text. |
| `ui/Input` | With label + error + helper. ₹ prefix variant for amount. |
| `ui/Select` | Styled native select. 10px radius. |
| `ui/Badge` | Category badge. 8 earth-tone presets. IBM Plex Mono text. |
| `ui/Skeleton` | Shimmer using `--color-teal-soft` as base. |
| `ui/Toast` | Error/success. Slides in from top-right. |

---

### Phase 4 — Landing Page (60 min)
`app/page.tsx` + `components/landing/`

**Sections:**
1. **Navbar** — "piggybank." logo + "Powered by Fenmo AI ↗" badge right
2. **Hero** — 64px Work Sans headline + sub-text + 2 CTAs + app split-panel mockup visual + stat pills
3. **Features** — 3 teal-soft cards with key differentiators
4. **How It Works** — 3-step flow with connecting lines
5. **CTA Strip** — gradient background, final conversion section
6. **Footer** — minimal, Fenmo-branded

---

### Phase 5 — App Dashboard (90 min)
`app/dashboard/page.tsx` + `components/app/`

**Left Panel (40%, sticky):**
- `AppHeader` — "piggybank." wordmark
- `SummaryCard` — Total in Work Sans 700 48px, teal left-border, filtered state variant
- `ExpenseForm` — Amount (large mono), category pills + "+ Custom" input reveal, description, date, submit CTA

**Right Panel (60%, scrollable):**
- `ExpenseFilters` — category dropdown + sort toggle, URL param sync
- `ExpenseList` — cards with skeleton/empty/error states
- `ExpenseCard` — CategoryBadge | description + date | **amount** (IBM Plex Mono, right-aligned)

**Mobile (responsive collapse):**
- Single column: Summary → Add Expense accordion → Filters → List

---

### Phase 6 — Visual Polish (30 min)
- Verify against DESIGN.md tokens
- Animation: card fade-in, skeleton shimmer, button press, summary number transition
- Mobile breakpoint test (375px, 768px, 1280px)
- Accessibility: focus rings (teal outline), aria-labels, keyboard nav

---

### Phase 7 — Backend API Routes (60 min)
- `app/api/expenses/route.ts`
  - `GET`: filter by category, sort, Prisma query, compute visible total
  - `POST`: Zod validate → Prisma upsert on idempotencyKey → return formatted expense
- `app/api/expenses/categories/route.ts`
  - `GET`: Prisma `findMany` distinct categories

---

### Phase 8 — Wire Frontend to Backend (20 min)
- Remove `lib/mock-data.ts`
- Switch `useExpenses` + `useCategories` from mock to real fetch
- Test all interactions end-to-end

---

### Phase 9 — Tests + README (45 min)
- Money utils unit tests
- API integration test for idempotent create
- Update `README.md` with design decisions, architecture, trade-offs

---

## Key Technical Rules (non-negotiable)

| Rule | Implementation |
|------|---------------|
| Integer paise for money | `amount Int` in Prisma schema ✅ |
| Idempotency | `idempotencyKey @unique` in schema ✅ · `crypto.randomUUID()` on form mount |
| Filter state | URL search params (`useSearchParams`, `useRouter`) |
| No float math | All sums via `sumPaise(items)` utility |
| Retry-safe | Preserve UUID on network error, regenerate only on success |
| Amounts: IBM Plex Mono | ALWAYS. Every rupee amount uses font-mono |
| pnpm only | Never `npm install` — project uses `pnpm@10.30.3` |

---

## Category Colors (deterministic, 8 presets)

| Category | Background | Text |
|----------|-----------|------|
| Food | `#FEF3C7` | `#92400E` |
| Travel | `#DBEAFE` | `#1E40AF` |
| Bills | `#FCE7F3` | `#9D174D` |
| Shopping | `#EDE9FE` | `#5B21B6` |
| Health | `#D1FAE5` | `#065F46` |
| Entertainment | `#FFE4E6` | `#9F1239` |
| Education | `#E0F2FE` | `#0C4A6E` |
| Other | `#F1F5F9` | `#475569` |

---

*Updated: May 1, 2026 — All design decisions locked. Ready for execution.*
