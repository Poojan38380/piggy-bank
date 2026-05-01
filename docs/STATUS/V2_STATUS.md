# V2 Implementation Status — PiggyBank by Fenmo AI
**Last Updated:** May 1, 2026  
**Build Status:** ✅ Passing (exit code 0, zero TypeScript errors)  
**Current Phase:** Phase 0 Complete → Phase 1 Ready

---

## 📊 Overall V2 Progress

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| **Phase 0** | Bug Fixes | ✅ **COMPLETE** | All 10 bugs fixed, build clean |
| **Phase 1** | Auth (Google OAuth + Prisma) | 🔜 Next | Awaiting execution |
| **Phase 2** | Custom Categories + Emojis | 🔜 Pending | Depends on Phase 1 |
| **Phase 3** | Dashboard Full Redesign | 🔜 Pending | Depends on Phase 1 |
| **Phase 4** | Charts & Analytics | 🔜 Pending | Depends on Phase 3 |
| **Phase 5** | Polish & Improvements | 🔜 Pending | Final phase |

---

## ✅ Phase 0 — Bug Fixes (COMPLETE)

All 10 bugs identified in the code review have been fixed and verified via `pnpm build`.

### BUG-1: Hero Amount Wrong Font ✅ FIXED
- **File:** `app/globals.css`
- **Fix:** `.text-amount-hero` changed from `var(--font-display)` (Work Sans) to `var(--font-mono)` (IBM Plex Mono)
- **Rule:** DESIGN.md Rule #5 — "All rupee amounts → IBM Plex Mono — NON-NEGOTIABLE"

### BUG-2: toPaise() Null Returns HTTP 500 ✅ FIXED
- **File:** `app/api/expenses/route.ts`
- **Fix:** `toPaise(amount) === null` now returns `{ status: 400 }` with a structured error. No longer bubbles to the generic 500 handler.

### BUG-3: Schema Duplication (DRY Violation) ✅ FIXED
- **File:** `lib/validations.ts`
- **Fix:** `expenseFormSchema` is now derived via `createExpenseSchema.omit({ idempotencyKey: true })`. Single source of truth — no duplicated regex/refine chains.

### BUG-4: Dynamic Tailwind Class Names (Purge Risk) ✅ FIXED
- **File:** `components/app/ExpenseList.tsx`
- **Fix:** Replaced `` `delay-${n}` `` template literal with a static `STAGGER_DELAY[]` lookup array. JIT-safe.

### BUG-5: `.example.env` Missing Keys ✅ FIXED
- **File:** `.example.env`
- **Fix:** Added all required environment variables: `MONGO_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Each has a descriptive comment.

### BUG-6: Custom `useId` Shadowing React's Built-in ✅ FIXED
- **Files:** `components/ui/Input.tsx`, `components/ui/Select.tsx`
- **Fix:** Replaced module-level `_idCounter` + custom `useId()` with `React.useId()` from React 18+. SSR-safe, no hydration mismatches.

### BUG-7: "Transport" vs "Travel" Naming Mismatch ✅ FIXED
- **Files:** `types/index.ts`, `DESIGN.md`, `app/globals.css`
- **Fix:** Standardized on **"Transport"** everywhere. Updated `DESIGN.md` table, renamed `--badge-travel-*` → `--badge-transport-*` CSS variables and `.badge-travel` → `.badge-transport` class.

### BUG-8: Useless Suspense Boundary ✅ FIXED
- **Files:** `app/dashboard/page.tsx` *(rewritten)*, `app/dashboard/loading.tsx` *(new)*, `app/dashboard/error.tsx` *(new)*
- **Fix:** Removed `Suspense` wrapper (useEffect-based fetching never suspends). Added proper route-level `loading.tsx` (renders `DashboardSkeleton`) and `error.tsx` (styled error boundary with retry button).

### BUG-9: Empty Idempotency Key on SSR ✅ FIXED
- **File:** `hooks/useCreateExpense.ts`
- **Fix:** Replaced `useState(() => crypto.randomUUID() || "")` with `useEffect + useRef` pattern. Key is generated exactly once on client mount. Includes explicit guard: submission blocked if key is empty.

### BUG-10: No Rate Limiting on API Routes ✅ FIXED
- **File:** `app/api/expenses/route.ts`
- **Fix:** Added in-memory rate limiter (30 req/min per IP). Returns HTTP 429 when exceeded. Note: single-instance only — replace with Redis (Upstash) for multi-instance production.

---

## 🔜 Phase 1 — Auth Foundation (NEXT)

### What needs to happen:
1. `pnpm add next-auth@5 @auth/prisma-adapter`
2. Add `User`, `Account`, `Session`, `Category` models to `prisma/schema.prisma`
3. Create `lib/auth.ts` (NextAuth config with Google provider + Prisma adapter)
4. Create `app/api/auth/[...nextauth]/route.ts`
5. Create `middleware.ts` (protect `/dashboard` and `/analytics`)
6. Create `app/login/page.tsx` (beautiful branded login page)
7. Update ALL API routes to add session guard + `userId` filtering
8. Fill in `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in `.env`

### Prerequisites for Phase 1:
- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` obtained
- [ ] `NEXTAUTH_SECRET` generated (`openssl rand -base64 32`)

---

## 🏛️ Architecture & Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 16.2 (App Router) | ✅ |
| Styling | Tailwind CSS v4 | ✅ |
| Data Layer | Prisma + MongoDB | ✅ |
| Validation | Zod v4 | ✅ |
| Auth | NextAuth v5 (Google OAuth) | 🔜 Phase 1 |
| Charts | Recharts | 🔜 Phase 4 |
| Design | Fenmo AI "Quiet Luxury" | ✅ |

---

## 📋 V2 Feature Scope (Locked)

| Feature | Phase | Status |
|---------|-------|--------|
| Google OAuth login + dedicated `/login` page | 1 | 🔜 |
| User profile (avatar + sign out) in header | 1 | 🔜 |
| Data isolation per user | 1 | 🔜 |
| Custom categories with emoji | 2 | 🔜 |
| Emoji picker (curated 50-emoji grid) | 2 | 🔜 |
| Category deletion (only if no transactions) | 2 | 🔜 |
| Full dashboard redesign (top-nav + stat cards) | 3 | 🔜 |
| Numbers-only amount input | 3 | 🔜 |
| Expense delete | 3 | 🔜 |
| Formatted dates ("Today", "Yesterday") | 3 | 🔜 |
| Donut chart (category breakdown) | 4 | 🔜 |
| Area chart (spending trend) | 4 | 🔜 |
| Bar chart (monthly comparison) | 4 | 🔜 |
| `/analytics` full page + time range selector | 4 | 🔜 |
| Error boundaries everywhere | 5 | 🔜 |
| Empty state illustrations | 5 | 🔜 |
| Updated README with setup instructions | 5 | 🔜 |

---

*This document is a living artifact. Update after each phase completes.*
