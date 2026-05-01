# PiggyBank V2 — Implementation Plan

> **Stack:** Next.js 16.2 · TypeScript · Prisma + MongoDB · Tailwind CSS v4 · NextAuth v5 · Recharts  
> **Brand:** Fenmo AI · "Quiet Luxury Fintech"  
> **Date:** May 1, 2026  
> **Status:** APPROVED — Ready for execution

---

## Decisions — LOCKED ✅

| Decision | Choice |
|----------|--------|
| Auth provider | NextAuth v5 (Auth.js) with Google OAuth |
| Login flow | Dedicated `/login` page, `/dashboard` redirects there if unauth |
| User profile | Avatar + name + sign-out in top nav |
| Charts library | Recharts |
| Chart placement | Key charts on `/dashboard`, full analytics on `/analytics` |
| All 3 chart types | Donut (category) + Area (trend) + Bar (monthly) |
| Time range selector | Yes — 7d / 30d / All time |
| Emoji picker | Curated grid (~50 popular emojis) |
| Category delete | Only if zero transactions reference it |
| Max custom categories | 20 per user |
| Dashboard layout | Full redesign — top-nav + tabbed views |
| Amount input | Numbers-only with max 2 decimal places |

---

## Phase 0 — Bug Fixes (Before Any New Features)

All 10 verified bugs from the code review. These are fixed first because some (like auth, schema changes) block later phases.

### BUG-1: SummaryCard Hero Amount Wrong Font
**File:** `components/app/SummaryCard.tsx`  
**Fix:** Change `text-amount-hero` class in `globals.css` from `font-family: var(--font-display)` to `font-family: var(--font-mono)`. The hero amount MUST use IBM Plex Mono per DESIGN.md Rule #5.

### BUG-2: `toPaise()` Null Returns 500 Instead of 400
**File:** `app/api/expenses/route.ts`  
**Fix:** Before `prisma.expense.create()`, check `if (paise === null)` and return `NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })` instead of throwing.

### BUG-3: Schema Duplication
**File:** `lib/validations.ts`  
**Fix:** Define `expenseFormSchema` as `createExpenseSchema.omit({ idempotencyKey: true })`. Delete the duplicated regex/refine chains.

### BUG-4: Dynamic Tailwind Class Names
**File:** `components/app/ExpenseList.tsx`  
**Fix:** Use a static lookup array: `const DELAY_CLASSES = ['', 'delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5']` and index into it.

### BUG-5: .env Credentials Exposure
**Action:** Verify `.gitignore` covers `.env`. Update `.example.env` with all required keys (including upcoming auth keys). Add a comment warning.

### BUG-6: Custom `useId` Shadowing React's Built-in
**Files:** `components/ui/Input.tsx`, `components/ui/Select.tsx`  
**Fix:** Replace custom `useId` with `React.useId()` from React 18+. Remove module-level `_idCounter`.

### BUG-7: "Transport" vs "Travel" Naming Mismatch
**Files:** `types/index.ts`, `lib/categories.ts`, `globals.css`, `DESIGN.md`  
**Fix:** Standardize on **"Transport"** everywhere (it's more accurate than "Travel" for an expense tracker). Update `DESIGN.md` and CSS variable names to match.

### BUG-8: Useless Suspense Boundary
**File:** `app/dashboard/page.tsx`  
**Fix:** Remove the `Suspense` wrapper. Add a proper `loading.tsx` to the dashboard route segment instead. Also add `error.tsx` for error boundaries.

### BUG-9: Empty Idempotency Key on SSR
**File:** `hooks/useCreateExpense.ts`  
**Fix:** Use `React.useId()` as a fallback seed, or initialize with a placeholder UUID that gets replaced on mount via `useEffect`.

### BUG-10: No Rate Limiting
**File:** `app/api/expenses/route.ts`  
**Fix:** Add a simple in-memory rate limiter (Map-based, per-IP, 30 requests/minute). For production, note that this should be replaced with Redis-based limiting or Vercel's built-in.

---

## Phase 1 — Auth Foundation (NextAuth v5 + Google OAuth)

This phase touches every layer. It must be done before any feature work because all data becomes user-scoped.

### 1.1 Dependencies
```bash
pnpm add next-auth@5 @auth/prisma-adapter
```

### 1.2 Prisma Schema Changes
**File:** `prisma/schema.prisma`

```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  expenses      Expense[]
  categories    Category[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Expense {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  amount         Int
  category       String
  description    String
  date           DateTime
  idempotencyKey String   @unique
  userId         String   @db.ObjectId
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId, category])
  @@index([userId, date])
}

model Category {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  emoji     String
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  isPreset  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@unique([userId, name])
  @@index([userId])
}
```

### 1.3 Auth Configuration
**[NEW] `lib/auth.ts`** — NextAuth config with:
- Google OAuth provider
- Prisma adapter for MongoDB
- Session strategy: `jwt` (for edge middleware compatibility)
- Callbacks: attach `userId` to session/token

**[NEW] `app/api/auth/[...nextauth]/route.ts`** — Auth API route handler

### 1.4 Middleware
**[NEW] `middleware.ts`** (project root)
- Protect `/dashboard` and `/analytics` routes
- Redirect unauthenticated users to `/login`
- Allow `/`, `/login`, `/api/auth/*` publicly

### 1.5 Login Page
**[NEW] `app/login/page.tsx`**
- Beautiful branded login page with Fenmo "quiet luxury" aesthetic
- PiggyBank logo, tagline, gradient background
- "Sign in with Google" button (charcoal CTA style)
- Redirect to `/dashboard` on success

### 1.6 API Route Updates
**ALL API routes** must:
1. Call `getServerSession(authOptions)` or equivalent
2. Extract `userId` from session
3. Add `userId` to all Prisma `where` clauses
4. Return 401 if no session

### 1.7 Environment Variables
**Update `.example.env`:**
```env
MONGO_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Phase 2 — Custom Categories with Emojis

### 2.1 Preset Categories (Seeded Per User)
On first login, seed the user's categories with presets:

| Category | Emoji | Color BG | Color Text |
|----------|-------|----------|------------|
| Food | 🍕 | `#FEF3C7` | `#92400E` |
| Transport | 🚌 | `#DBEAFE` | `#1E40AF` |
| Shopping | 🛒 | `#EDE9FE` | `#5B21B6` |
| Bills | 📄 | `#FCE7F3` | `#9D174D` |
| Health | 💊 | `#D1FAE5` | `#065F46` |
| Entertainment | 🎬 | `#FFE4E6` | `#9F1239` |
| Education | 📚 | `#E0F2FE` | `#0C4A6E` |
| Other | 📦 | `#F1F5F9` | `#475569` |

### 2.2 API Routes

**[NEW] `app/api/categories/route.ts`**
- `GET` — Returns user's categories (presets + custom), ordered presets-first
- `POST` — Create a custom category `{ name, emoji }`. Validate: max 20 custom per user, name unique per user, max 20 chars

**[NEW] `app/api/categories/[id]/route.ts`**
- `DELETE` — Delete a custom category. Guard: reject if any expense references it. Reject preset deletion.

### 2.3 Emoji Picker Component
**[NEW] `components/ui/EmojiPicker.tsx`**
- Curated grid of ~50 popular emojis organized by row (food, travel, objects, nature, activities, symbols)
- Click to select, highlight selected
- Compact popover or inline grid

### 2.4 Category Creation UI
**[NEW] `components/app/CreateCategoryModal.tsx`**
- Modal/drawer triggered by a "+" button in the category pill row
- Fields: emoji picker + category name input
- Live preview of the resulting badge
- Submit creates category, adds it to the local list immediately (optimistic)

### 2.5 Updated Components
- **`CategoryBadge`** — Show `emoji + name` (e.g., "🍕 Food")
- **`ExpenseForm`** — Category pills now show emojis, "+" pill opens modal
- **`ExpenseFilters`** — Dropdown options show emojis
- **`useCategories` hook** — Rewrite to fetch from new `/api/categories` endpoint, returns `Category[]` objects (not just strings)

---

## Phase 3 — Dashboard Full Redesign

### 3.1 New Layout Architecture

**Kill the 2-panel layout.** New structure:

```
┌─────────────────────────────────────────────┐
│  Top Nav (logo | nav links | user profile)  │
├─────────────────────────────────────────────┤
│  Dashboard Content (tabbed or page-based)   │
│                                             │
│  ┌─ Overview Tab ────────────────────────┐  │
│  │  [Summary Cards Row]                  │  │
│  │  [Mini Donut] [Spending Trend Area]   │  │
│  │  [Filters Bar]                        │  │
│  │  [Expense List]                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ Add Expense (slide-out or modal) ────┐  │
│  │  ExpenseForm                          │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 3.2 New/Modified Files

**[NEW] `components/app/TopNav.tsx`**
- Horizontal nav bar: PiggyBank logo (left), nav links (center: Dashboard, Analytics), user profile (right: avatar, name, sign out)
- Sticky top, blurred glass background
- Mobile: hamburger → slide-out menu

**[MODIFY] `app/dashboard/page.tsx`** — Complete rewrite
- Summary cards row: Total Spend, Transaction Count, Top Category, Avg/Day
- Charts section: Mini donut (left) + spending trend area (right)
- Filters + expense list below
- Floating "+" button (mobile) or "Add Expense" button (desktop) → opens modal

**[NEW] `components/app/AddExpenseModal.tsx`**
- ExpenseForm inside a modal/drawer
- Slide up from bottom on mobile, slide in from right on desktop
- Smooth open/close transitions

**[NEW] `app/dashboard/loading.tsx`** — Proper route-level loading skeleton  
**[NEW] `app/dashboard/error.tsx`** — Error boundary with retry button

### 3.3 Summary Cards
**[NEW] `components/app/StatCards.tsx`**
- 4 cards in a responsive grid:
  1. **Total Spent** — Hero amount, IBM Plex Mono, large
  2. **Transactions** — Count with trend indicator
  3. **Top Category** — Category badge + amount
  4. **Daily Average** — Computed from date range

### 3.4 Amount Input — Numbers Only
**[MODIFY] `components/ui/Input.tsx`**
- When `isAmount` is true:
  - `onKeyDown`: allow only `0-9`, `.`, Backspace, Tab, Arrow keys, Delete
  - Prevent second decimal point
  - Prevent more than 2 digits after decimal
  - `onPaste`: strip non-numeric characters, enforce format
  - `inputMode="decimal"` for mobile numeric keyboard

### 3.5 Expense List Improvements
**[MODIFY] `components/app/ExpenseList.tsx`**
- Formatted dates using `date-fns`: "Today", "Yesterday", "May 1"
- Emoji in category badge
- Delete button (trash icon, confirmation toast)
- Stagger animations with static class lookup

**[NEW] `app/api/expenses/[id]/route.ts`**
- `DELETE` — Delete an expense by ID. Verify ownership via `userId`.

### 3.6 Mobile Responsive
- Top nav collapses to hamburger
- Summary cards stack to 2x2 grid
- Charts stack vertically
- Floating "+" FAB for adding expenses
- Bottom sheet for expense form

---

## Phase 4 — Charts & Analytics

### 4.1 Dependencies
```bash
pnpm add recharts
```

### 4.2 Chart Components

**[NEW] `components/charts/CategoryDonut.tsx`**
- Recharts `PieChart` with donut hole
- Category colors from `CATEGORY_COLORS` map
- Center text: total amount
- Legend with emoji + category name + percentage
- Responsive container

**[NEW] `components/charts/SpendingTrend.tsx`**
- Recharts `AreaChart` with gradient fill
- X-axis: dates (formatted by time range)
- Y-axis: amount in rupees (formatted with INR formatter)
- Teal gradient fill, navy stroke
- Tooltip with formatted amounts

**[NEW] `components/charts/MonthlyBar.tsx`**
- Recharts `BarChart` comparing months
- X-axis: month names
- Y-axis: total spend
- Teal bars with navy hover

### 4.3 Analytics Page
**[NEW] `app/analytics/page.tsx`**
- Protected route (middleware)
- Time range selector: 7d / 30d / 90d / All Time
- Full-size donut chart
- Full-size spending trend
- Full-size monthly comparison bar
- Summary stats row

**[NEW] `app/analytics/loading.tsx`** — Loading skeleton  
**[NEW] `app/analytics/error.tsx`** — Error boundary

### 4.4 Analytics API
**[NEW] `app/api/analytics/route.ts`**
- `GET /api/analytics?range=7d|30d|90d|all`
- Returns:
  ```ts
  {
    categoryBreakdown: Array<{ category: string, emoji: string, total: number, count: number, percentage: number }>,
    dailyTrend: Array<{ date: string, total: number }>,
    monthlyTotals: Array<{ month: string, total: number }>,
    summary: { totalSpend: number, transactionCount: number, topCategory: string, avgPerDay: number }
  }
  ```
- All amounts in paise, formatted server-side

### 4.5 Dashboard Mini Charts
On the main `/dashboard`, show:
- Small donut chart (category breakdown) — 200x200px
- Compact area chart (last 7 days trend) — fills remaining width
- Both link to `/analytics` for full view

---

## Phase 5 — Polish & Improvements

### 5.1 Error Boundaries
**[NEW] `app/global-error.tsx`** — Root error boundary  
**[NEW] `app/dashboard/error.tsx`** — Dashboard error boundary  
**[NEW] `app/analytics/error.tsx`** — Analytics error boundary

### 5.2 Improved Empty States
- Dashboard with no expenses: illustration + "Log your first expense" CTA
- Analytics with no data: "Not enough data yet" message
- Category filter with no results: contextual message

### 5.3 Landing Page Updates
- Update CTA: "Start Tracking →" goes to `/dashboard` (auth middleware handles redirect)
- Update "No signup required" copy — now it requires Google login
- Add "Sign in" link to nav

### 5.4 Documentation Updates
- Update `DESIGN.md` — fix Transport/Travel, document emoji badges
- Update `STATUS.md` — reflect V2 state
- Update `README.md` — setup instructions including Google OAuth credentials
- Update `.example.env` — all required variables documented

### 5.5 Badge Component Cleanup
- Remove inline `style={{}}` from Badge.tsx
- Use the CSS classes already defined in globals.css OR generate deterministic color classes for custom categories

---

## File Change Summary

### New Files (18)
| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth v5 configuration |
| `app/api/auth/[...nextauth]/route.ts` | Auth API handler |
| `middleware.ts` | Route protection |
| `app/login/page.tsx` | Login page |
| `app/analytics/page.tsx` | Full analytics view |
| `app/analytics/loading.tsx` | Analytics loading state |
| `app/analytics/error.tsx` | Analytics error boundary |
| `app/dashboard/loading.tsx` | Dashboard loading state |
| `app/dashboard/error.tsx` | Dashboard error boundary |
| `app/global-error.tsx` | Root error boundary |
| `app/api/categories/route.ts` | Categories CRUD |
| `app/api/categories/[id]/route.ts` | Category delete |
| `app/api/expenses/[id]/route.ts` | Expense delete |
| `app/api/analytics/route.ts` | Analytics data |
| `components/app/TopNav.tsx` | New top navigation |
| `components/app/AddExpenseModal.tsx` | Expense form modal |
| `components/app/StatCards.tsx` | Summary stat cards |
| `components/app/CreateCategoryModal.tsx` | Category creation |
| `components/ui/EmojiPicker.tsx` | Emoji picker grid |
| `components/charts/CategoryDonut.tsx` | Donut chart |
| `components/charts/SpendingTrend.tsx` | Area chart |
| `components/charts/MonthlyBar.tsx` | Bar chart |

### Modified Files (15)
| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Add User, Account, Session, Category models; add userId to Expense |
| `app/api/expenses/route.ts` | Add auth guard, userId filtering, fix 500→400 bug |
| `app/api/expenses/categories/route.ts` | Rewrite to use Category model |
| `app/dashboard/page.tsx` | Complete redesign |
| `app/layout.tsx` | Add SessionProvider wrapper |
| `app/page.tsx` | Update CTAs for auth flow |
| `app/globals.css` | Fix text-amount-hero font, add modal/overlay styles |
| `lib/validations.ts` | DRY fix with .omit() |
| `lib/categories.ts` | Update to work with Category model + emojis |
| `hooks/useExpenses.ts` | Remove Suspense dependency, add delete support |
| `hooks/useCreateExpense.ts` | Fix SSR idempotency key |
| `hooks/useCategories.ts` | Rewrite for Category model |
| `components/ui/Input.tsx` | Numbers-only for amount, fix useId |
| `components/ui/Select.tsx` | Fix useId |
| `components/ui/Badge.tsx` | Add emoji support, remove inline styles |
| `components/app/ExpenseList.tsx` | Date formatting, delete button, fix dynamic classes |
| `components/app/ExpenseForm.tsx` | Emoji pills, "+" button, modal integration |
| `components/app/ExpenseFilters.tsx` | Emoji in dropdown options |
| `components/app/SummaryCard.tsx` | Fix font (or replace with StatCards) |
| `components/app/AppHeader.tsx` | Replace with TopNav |
| `components/landing/LandingNav.tsx` | Add "Sign in" link |
| `components/landing/LandingCTA.tsx` | Update copy for auth flow |
| `.example.env` | Add all required env vars |
| `package.json` | Add next-auth, recharts dependencies |

---

## Execution Order

```
Phase 0 (Bug Fixes)           → 1-2 hours
Phase 1 (Auth + Prisma)       → 3-4 hours
Phase 2 (Custom Categories)   → 2-3 hours
Phase 3 (Dashboard Redesign)  → 3-4 hours
Phase 4 (Charts & Analytics)  → 2-3 hours
Phase 5 (Polish)              → 1-2 hours
─────────────────────────────────────────
Total                         → ~14-18 hours
```

**Critical path:** Phase 0 → Phase 1 → (Phase 2 + Phase 3 in parallel) → Phase 4 → Phase 5

---

## Verification Plan

### Automated
- `pnpm build` — Ensure zero TypeScript errors
- `pnpm lint` — Ensure zero lint warnings

### Manual Testing
1. **Auth flow:** Landing → Dashboard → Redirect to Login → Google OAuth → Back to Dashboard
2. **Data isolation:** Log in as User A, create expense. Log in as User B, verify User B sees zero expenses.
3. **Category creation:** Create custom category with emoji, use it in expense, verify badge renders correctly.
4. **Category deletion:** Try deleting a category with expenses (should fail). Delete one without (should succeed).
5. **Charts:** Verify donut, area, and bar charts render with real data.
6. **Amount input:** Type letters (blocked), type numbers (allowed), type 3+ decimals (blocked).
7. **Mobile responsive:** Test at 375px, 768px, 1280px.
8. **Error states:** Kill MongoDB connection, verify error boundaries show.

---

*This plan is final. Execution begins on approval.*
