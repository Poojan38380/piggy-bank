# Frontend Implementation Plan — Fenmo Expense Tracker

> Stack: **Next.js 16.2** · **TypeScript** · **Prisma + MongoDB** · **Tailwind CSS v4** · **Google Stitch MCP**  
> Approach: **Frontend-first** (beautiful, functional UI with mock data → wire to backend later)  
> Date: May 1, 2026

---

## Overview

This plan delivers the **best possible frontend** for the expense tracker before touching the backend. We build the full UI shell with mock data, all interaction states, and pixel-perfect design — then in a separate phase, wire real Prisma/MongoDB API routes underneath.

The project already has:
- ✅ Next.js 16.2 (App Router), TypeScript, Tailwind CSS v4
- ✅ Prisma client (`lib/prisma.ts`) with MongoDB (`prisma/schema.prisma`)
- ✅ Stitch MCP connected
- ✅ `app/` directory scaffold (bare `page.tsx`, `layout.tsx`, `globals.css`)

---

## Decisions Needed From You

### 1. Design Direction
Which aesthetic direction do you prefer?

- **Option A — "Paper Ledger"**: Warm cream/off-white, ink-dark text, editorial serif for amounts. Trustworthy, anti-fintech, newspaper-ish density.
- **Option B — "Midnight Finance"**: Near-black surface, frosted glass cards, copper/amber accent for amounts. Premium dark mode.
- **Option C — "Soft Utility"**: Cool stone-gray palette, forest-green accent, tight grid. Linear/Notion productivity vibes.

### 2. Category Strategy
- **Fixed presets only**: Food, Travel, Bills, Shopping, Health, Entertainment, Education, Other
- **Presets + custom**: Show presets with a "+ Custom" pill that reveals a text input

### 3. Layout
- **Single column**: Header → Summary → Form CTA → Filters → List (mobile-first, simple)
- **Split panel**: Left = sticky summary + form; Right = scrollable filter + list (desktop-first, rich)

---

## Architecture Summary

### Already in place
| Item | Status |
|------|--------|
| Next.js 16.2 App Router | ✅ |
| TypeScript | ✅ |
| Tailwind CSS v4 | ✅ |
| Prisma + MongoDB (`@prisma/client` 6.19) | ✅ |
| `lib/prisma.ts` singleton | ✅ |
| `prisma/schema.prisma` with `Expense` model | ✅ |
| `idempotencyKey @unique` field | ✅ |

### To be added
```bash
pnpm add zod date-fns
```

---

## File Structure (Target)

```
fenmo-assignment/
├── app/
│   ├── layout.tsx              ← Update: fonts, metadata, SEO
│   ├── page.tsx                ← Replace: full page assembly
│   ├── globals.css             ← Replace: design system tokens
│   └── api/
│       └── expenses/
│           ├── route.ts        ← NEW: GET + POST (Phase 2)
│           └── categories/
│               └── route.ts    ← NEW: GET categories (Phase 2)
├── components/
│   ├── ui/                     ← NEW: Button, Input, Select, Badge, Skeleton, Toast
│   ├── AppHeader.tsx           ← NEW
│   ├── SummaryStrip.tsx        ← NEW
│   ├── ExpenseForm.tsx         ← NEW
│   ├── ExpenseFilters.tsx      ← NEW
│   ├── ExpenseList.tsx         ← NEW
│   └── CategoryBadge.tsx       ← NEW
├── hooks/
│   ├── useExpenses.ts          ← NEW
│   └── useCategories.ts        ← NEW
├── lib/
│   ├── prisma.ts               ← Already exists ✅
│   ├── categories.ts           ← NEW
│   ├── money.ts                ← NEW
│   ├── validations.ts          ← NEW
│   └── mock-data.ts            ← NEW (removed after backend phase)
├── types/
│   └── index.ts                ← NEW
└── DESIGN.md                   ← NEW (from Stitch MCP)
```

---

## Execution Phases

### Phase 0 — Stitch MCP Design Extraction (30 min)
1. Verify Stitch project accessible: `"List my Stitch projects"`
2. Extract design tokens → `DESIGN.md` + update `globals.css`
3. Fallback if Stitch unavailable: design directly from PERPLEX roadmap aesthetic guidance

### Phase 1 — Shared Utilities (20 min)
- `pnpm add zod date-fns`
- Create `types/index.ts` — Expense, ExpenseFilters, ApiResponse, ExpenseMeta
- Create `lib/categories.ts` — PRESET_CATEGORIES array
- Create `lib/money.ts` — rupeesToPaise, paiseToRupees, formatCurrency, sumPaise
- Create `lib/validations.ts` — Zod schemas (shared frontend/backend)
- Create `lib/mock-data.ts` — 8–10 hardcoded mock expenses for visual dev

### Phase 2 — Data Hooks (30 min)
- `hooks/useExpenses.ts` — fetch, filter, sort, URL param sync
- `hooks/useCategories.ts` — fetch distinct categories

### Phase 3 — Primitive UI Components (45 min)
- `components/ui/button.tsx` — primary/ghost/destructive + loading state
- `components/ui/input.tsx` — label + error + helper
- `components/ui/select.tsx` — styled native select
- `components/ui/badge.tsx` — color badge
- `components/ui/skeleton.tsx` — shimmer animation
- `components/ui/toast.tsx` — error/success notification

### Phase 4 — Feature Components (90 min)
- `components/AppHeader.tsx`
- `components/SummaryStrip.tsx` — animated total number
- `components/CategoryBadge.tsx` — deterministic color per category
- `components/ExpenseForm.tsx` — full form with idempotency + Zod validation
- `components/ExpenseFilters.tsx` — category + sort + URL sync
- `components/ExpenseList.tsx` — cards + skeleton + empty + error states

### Phase 5 — Page Assembly (30 min)
- Replace `app/page.tsx` with full composition
- Update `app/layout.tsx` — fonts, metadata, SEO

### Phase 6 — Polish (30 min)
- Visual review against DESIGN.md
- Animation timing refinement
- Mobile responsiveness check

### Phase 7 — Backend API Routes (60 min)
- `app/api/expenses/route.ts` — GET + POST with Prisma + idempotency
- `app/api/expenses/categories/route.ts` — GET distinct categories

### Phase 8 — Wire Frontend to Backend (20 min)
- Remove `lib/mock-data.ts`
- Switch hooks from mock to real API
- Test all interactions end-to-end

### Phase 9 — Tests + README (45 min)
- Money utils unit tests (Vitest)
- API integration test for idempotent create
- Update README with architectural decisions

---

## Key Technical Decisions

### Money Handling
- Store as **integer paise** (₹1 = 100 paise) — already in Prisma schema (`amount Int`)
- Display via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- Never use JavaScript floats for money math

### Idempotency
- `crypto.randomUUID()` generated when form mounts
- Same key preserved across retries (network error path)
- New key generated only on successful submission
- `idempotencyKey @unique` in Prisma schema enforces server-side deduplication

### State Architecture
- **Filter state** → URL search params (survives refresh, shareable)
- **Form state** → `useState` (local)
- **Data** → native `fetch` + `useEffect` + `useState` (no SWR/TanStack)

### Design System
- Tailwind CSS v4 with CSS custom properties
- All tokens defined in `:root` in `globals.css`
- No inline styles, no arbitrary Tailwind values — only design token classes

---

## Stitch MCP Prompt (Phase 0)

```
Use the Stitch MCP to fetch my [PROJECT_NAME] project.

Extract:
- Full color palette (all tokens)
- Typography: font families, sizes, weights, line heights
- Spacing system
- Border radius values
- Shadow values
- Component styles: buttons, inputs, cards, badges

Generate:
1. A DESIGN.md file in the root directory documenting all extracted values
2. Update app/globals.css to map these values to CSS custom properties
   following Tailwind v4 @theme inline convention
```

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Float drift in money | Integer paise everywhere; format only at display layer |
| Duplicate expense on retry | UUID idempotency key + Prisma `@unique` + catch duplicate error |
| Filter state lost on refresh | URL search params as source of truth |
| Overdesigned UI hurts trust | Follow PERPLEX principle: calm, legible, never flashy |
| Stitch MCP unavailable | Design fallback defined in this plan |

---

*Created: May 1, 2026 — pending user approval on 3 design decisions above*
