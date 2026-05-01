# 💸 Expense Tracker — Build Roadmap
> Stack: Next.js 15 (App Router) · TypeScript · MongoDB Atlas · Tailwind CSS · Zod · Vercel  
> Design pipeline: Google Stitch → Stitch MCP → Antigravity IDE  
> Date: May 1, 2026 | Budget: 4–8 hours

---

## Table of Contents
1. [Architecture Decisions](#1-architecture-decisions)
2. [Folder Structure](#2-folder-structure)
3. [Data Model & MongoDB Schema](#3-data-model--mongodb-schema)
4. [API Design](#4-api-design)
5. [Phase 0 — Project Init & Stitch Design (45 min)](#5-phase-0--project-init--stitch-design-45-min)
6. [Phase 1 — Backend (1.5–2 hrs)](#6-phase-1--backend-15-2-hrs)
7. [Phase 2 — Frontend via Antigravity (2–3 hrs)](#7-phase-2--frontend-via-antigravity-2-3-hrs)
8. [Phase 3 — Nice-to-Haves (30–45 min)](#8-phase-3--nice-to-haves-30-45-min)
9. [Phase 4 — Test, Deploy & README (45 min)](#9-phase-4--test-deploy--readme-45-min)
10. [README Template](#10-readme-template)
11. [Edge Cases Checklist](#11-edge-cases-checklist)

---

## 1. Architecture Decisions

### Why MongoDB Atlas?
MongoDB Atlas free tier (M0) works perfectly with Vercel serverless functions. The driver connects per-request and Atlas handles connection pooling. No migration files needed, flexible schema during early iteration, and the native `Decimal128` type is available for precise money storage.

> **Connection tip:** Use a cached global connection singleton in `lib/mongodb.ts` — without it, every serverless invocation spawns a new connection and you'll exhaust Atlas's 500-connection limit fast.

### Money Handling — Integers, Not Floats
Store amounts as **integer paise** (1 rupee = 100 paise) in MongoDB. Accept decimal rupees from the API (`"amount": 149.99`), multiply by 100, `Math.round()`, store as `Number` (or `Decimal128` if you want extra safety). Display by dividing by 100. This eliminates classic float drift like `0.1 + 0.2 = 0.30000000000000004`.

```
User inputs → "₹149.99"
API receives → 149.99
Stored as    → 14999  (paise, integer)
Displayed as → ₹149.99
```

### Idempotency — The Key Engineering Requirement
The assignment explicitly states: *"The API should behave correctly even if the client retries the same request due to network issues or page reloads."* This means `POST /expenses` **must be idempotent**.

**Strategy:**
1. Client generates a `UUID v4` (`crypto.randomUUID()`) before the user clicks submit.
2. This UUID is sent as `idempotencyKey` in the request body.
3. The backend creates a **unique index** on `idempotencyKey` in MongoDB.
4. If a duplicate key is received (network retry), MongoDB throws a duplicate key error (code 11000). The server catches it, fetches and returns the existing document with `200 OK`.
5. Client receives the same expense both times — no double-entry.

```
User clicks submit
  → Client generates idempotencyKey = "uuid-abc-123"
  → POST /api/expenses { amount, category, ..., idempotencyKey }
  
Network drops → Client retries with same idempotencyKey
  → Server catches E11000 (duplicate key)
  → Server returns existing record (200 OK)
  → UI deduplicates by idempotencyKey before showing list
```

### Categories
- Presets are hardcoded in `lib/categories.ts` (shared between frontend and API validation).
- Custom categories are stored per-expense as a free-text string.
- The category field is just a `string` in MongoDB — no separate collection needed at this scale.

### State Management
No Redux. No Zustand. Use:
- **React state** (`useState`) for form fields
- **URL search params** for filter/sort state (so sharing a filtered URL works and browser back works)
- **SWR** or native `fetch` with revalidation for the expense list

### Deployment
Vercel with environment variables. The MongoDB connection string lives in `MONGODB_URI` env var — never in code.

---

## 2. Folder Structure

```
expense-tracker/
├── app/
│   ├── layout.tsx               # Root layout, font, metadata
│   ├── page.tsx                 # Main page — renders ExpenseShell
│   ├── globals.css              # Tailwind base + DESIGN.md tokens
│   └── api/
│       └── expenses/
│           └── route.ts         # GET + POST handlers
├── components/
│   ├── ExpenseForm.tsx          # Add expense form
│   ├── ExpenseList.tsx          # Table/list of expenses
│   ├── ExpenseFilters.tsx       # Category filter + sort controls
│   ├── TotalBanner.tsx          # "Total: ₹X" display
│   ├── CategoryBadge.tsx        # Colored badge per category
│   └── ui/                      # Primitive components (Button, Input, Select)
├── lib/
│   ├── mongodb.ts               # Connection singleton
│   ├── models/
│   │   └── Expense.ts           # Mongoose model + TypeScript type
│   ├── categories.ts            # Preset categories list
│   ├── validations.ts           # Zod schemas (shared)
│   └── utils.ts                 # formatCurrency, paiseToRupees, etc.
├── hooks/
│   └── useExpenses.ts           # Data fetching hook
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── DESIGN.md                    # Generated by Antigravity from Stitch (DO NOT EDIT manually)
├── README.md
├── .env.local                   # MONGODB_URI (gitignored)
└── .env.example                 # Safe to commit
```

---

## 3. Data Model & MongoDB Schema

### Mongoose Model (`lib/models/Expense.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  amount: number;          // integer paise (e.g., 14999 = ₹149.99)
  category: string;        // "Food" | "Travel" | ... | any custom string
  description: string;
  date: Date;              // The expense date (user-provided, NOT created_at)
  createdAt: Date;         // Auto-managed by Mongoose timestamps
  idempotencyKey: string;  // UUID v4 from client — unique index
}

const ExpenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,            // minimum 1 paise
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,       // ← THIS is what makes idempotency work
      index: true,
    },
  },
  {
    timestamps: true,     // adds createdAt, updatedAt automatically
  }
);

// Compound index for efficient filter+sort queries
ExpenseSchema.index({ category: 1, date: -1 });
ExpenseSchema.index({ date: -1 });

export const Expense =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
```

### MongoDB Connection Singleton (`lib/mongodb.ts`)

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Global cache prevents new connections on every hot reload / serverless invocation
declare global {
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global.mongooseConn ?? { conn: null, promise: null };
global.mongooseConn = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## 4. API Design

### `POST /api/expenses`

**Request body:**
```json
{
  "amount": 149.99,
  "category": "Food",
  "description": "Lunch at Sarafa",
  "date": "2026-05-01",
  "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Zod schema (shared with frontend):**
```typescript
// lib/validations.ts
import { z } from 'zod';
import { PRESET_CATEGORIES } from './categories';

export const createExpenseSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .max(10_000_000, 'Amount seems too large'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50)
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200)
    .trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  idempotencyKey: z
    .string()
    .uuid('idempotencyKey must be a valid UUID'),
});
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "amount": 14999,
    "amountDisplay": "₹149.99",
    "category": "Food",
    "description": "Lunch at Sarafa",
    "date": "2026-05-01T00:00:00.000Z",
    "idempotencyKey": "550e8400-...",
    "createdAt": "2026-05-01T10:30:00.000Z"
  }
}
```

**Duplicate (idempotent retry) response (200):**
```json
{
  "success": true,
  "data": { /* same existing document */ },
  "idempotent": true
}
```

**Validation error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [{ "field": "amount", "message": "Amount must be positive" }]
}
```

---

### `GET /api/expenses`

**Query params:**
| Param | Type | Example | Notes |
|---|---|---|---|
| `category` | string | `?category=Food` | optional filter |
| `sort_date_desc` | boolean | `?sort_date_desc=true` | default `true` |
| `limit` | number | `?limit=50` | default 100, max 500 |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "amount": 14999,
      "amountDisplay": "₹149.99",
      "category": "Food",
      "description": "Lunch at Sarafa",
      "date": "2026-05-01T00:00:00.000Z",
      "createdAt": "2026-05-01T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "visibleTotal": 14999,
    "visibleTotalDisplay": "₹149.99",
    "filteredBy": "Food"
  }
}
```

> **Note:** `visibleTotal` is the sum of all returned items (after filter), formatted as display. This powers the "Total: ₹X" banner without a separate API call.

---

### `GET /api/expenses/categories`

Returns all distinct categories used so far (for the filter dropdown):
```json
{
  "success": true,
  "data": {
    "presets": ["Food", "Travel", "Bills", "Shopping", "Health", "Entertainment", "Other"],
    "custom": ["Gym", "Chai"]
  }
}
```

---

## 5. Phase 0 — Project Init & Stitch Design (45 min)

### 5a. Stitch Design (20 min)

1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Use the **multi-screen generation** feature. In a single prompt, describe **all screens at once**:

```
Design a personal expense tracker web app with a clean, minimal, modern aesthetic.
Color palette: deep indigo primary (#4F46E5), white background, subtle warm gray for surfaces.
Typography: Inter font, high contrast.

Generate 4 screens:

Screen 1 — Main Dashboard
- Header with app name "Xpense" and a subtle logo
- A prominent "Add Expense" button (primary CTA)
- Filter bar: category dropdown + date sort toggle
- Total banner: "Showing ₹X across N expenses" in a pill/card
- Expense list as a clean card-per-row layout showing: category badge (color-coded), 
  description, date, and amount right-aligned
- Empty state illustration when no expenses exist

Screen 2 — Add Expense Form (slide-over panel or modal)
- Amount field (large, prominent, with ₹ prefix)
- Category: segmented control or pill selector showing presets + "+ Custom" option
- Description text input
- Date picker (defaults to today)
- Submit button with loading state
- Error state per field (inline, red)

Screen 3 — Loading / Submitting state
- Skeleton loaders for the expense list
- Spinner on the submit button

Screen 4 — Mobile view of Main Dashboard
- Same content, stacked layout, bottom sheet for form
```

3. Iterate once if needed. Export to **Figma** for reference AND **copy the API key** from Stitch Settings.

### 5b. Project Init (25 min)

```bash
npx create-next-app@latest expense-tracker \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir false \
  --import-alias "@/*"

cd expense-tracker

# Core dependencies
npm install mongoose zod uuid
npm install @types/uuid -D

# Optional but recommended
npm install clsx tailwind-merge
npm install date-fns   # for date formatting
```

Create `.env.local`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

Create `.env.example`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/expense-tracker
```

---

## 6. Phase 1 — Backend (1.5–2 hrs)

### Step 1: MongoDB connection singleton
Create `lib/mongodb.ts` — see the singleton code in [Section 3](#3-data-model--mongodb-schema).

### Step 2: Categories constants
```typescript
// lib/categories.ts
export const PRESET_CATEGORIES = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Health',
  'Entertainment',
  'Other',
] as const;

export type PresetCategory = (typeof PRESET_CATEGORIES)[number];
```

### Step 3: Mongoose model
Create `lib/models/Expense.ts` — see [Section 3](#3-data-model--mongodb-schema).

### Step 4: Utility functions
```typescript
// lib/utils.ts
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatCurrency(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(paiseToRupees(paise));
}
```

### Step 5: Zod validation schema
Create `lib/validations.ts` — see [Section 4](#4-api-design).

### Step 6: API Route (`app/api/expenses/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Expense } from '@/lib/models/Expense';
import { createExpenseSchema } from '@/lib/validations';
import { rupeesToPaise, formatCurrency } from '@/lib/utils';

// ---------- POST /api/expenses ----------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { amount, category, description, date, idempotencyKey } = parsed.data;

    await connectDB();

    try {
      const expense = await Expense.create({
        amount: rupeesToPaise(amount),
        category,
        description,
        date: new Date(date),
        idempotencyKey,
      });

      const doc = expense.toObject();
      return NextResponse.json(
        {
          success: true,
          data: { ...doc, amountDisplay: formatCurrency(doc.amount) },
        },
        { status: 201 }
      );
    } catch (err: any) {
      // MongoDB duplicate key = idempotent retry
      if (err.code === 11000) {
        const existing = await Expense.findOne({ idempotencyKey }).lean();
        if (!existing) throw err;
        return NextResponse.json({
          success: true,
          data: { ...existing, amountDisplay: formatCurrency(existing.amount as number) },
          idempotent: true,
        });
      }
      throw err;
    }
  } catch (err) {
    console.error('[POST /api/expenses]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ---------- GET /api/expenses ----------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sortDesc = searchParams.get('sort_date_desc') !== 'false'; // default true
    const limit = Math.min(Number(searchParams.get('limit') || 100), 500);

    const query: Record<string, any> = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .sort({ date: sortDesc ? -1 : 1 })
      .limit(limit)
      .lean();

    const visibleTotal = expenses.reduce((sum, e) => sum + (e.amount as number), 0);

    const data = expenses.map((e) => ({
      ...e,
      amountDisplay: formatCurrency(e.amount as number),
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: expenses.length,
        visibleTotal,
        visibleTotalDisplay: formatCurrency(visibleTotal),
        filteredBy: category || null,
      },
    });
  } catch (err) {
    console.error('[GET /api/expenses]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 7: Categories endpoint (`app/api/expenses/categories/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Expense } from '@/lib/models/Expense';
import { PRESET_CATEGORIES } from '@/lib/categories';

export async function GET() {
  await connectDB();
  const allDistinct: string[] = await Expense.distinct('category');
  const custom = allDistinct.filter((c) => !PRESET_CATEGORIES.includes(c as any));
  return NextResponse.json({
    success: true,
    data: { presets: [...PRESET_CATEGORIES], custom },
  });
}
```

### Backend Checklist
- [ ] MongoDB connects without errors (`npm run dev` → no connection error)
- [ ] `POST` returns 201 with correctly formatted amount
- [ ] Retry with same `idempotencyKey` returns 200 with `idempotent: true`
- [ ] `GET` returns sorted list
- [ ] `GET ?category=Food` returns only Food expenses
- [ ] `meta.visibleTotalDisplay` is correct

---

## 7. Phase 2 — Frontend via Antigravity (2–3 hrs)

### 7a. Connect Stitch MCP to Antigravity

1. Open **Antigravity IDE** → your project workspace
2. In Agent settings → MCP Servers → Search "Stitch" → Install
3. Paste your **Stitch API Key** when prompted
4. In the Antigravity agent chat, verify: `"List my Stitch projects"`
5. It should return your project name

### 7b. Extract Design DNA

In the Antigravity agent chat:

```
Use the Stitch MCP to fetch my [YOUR_PROJECT_NAME] project. 
Extract the full color palette, typography, spacing system, component styles, 
and border radius values. Generate a DESIGN.md file in my root directory 
and a globals.css that maps these values to CSS custom properties 
and Tailwind config extensions.
```

This gives you a `DESIGN.md` and wires up the design tokens.

### 7c. Scaffold Components

Use the Antigravity agent to build each component. Paste these prompts **one at a time**:

**Prompt 1 — Types**
```
Create types/index.ts with TypeScript interfaces for:
- Expense (matching our MongoDB model: _id, amount, amountDisplay, category, 
  description, date, createdAt, idempotencyKey)
- ExpenseFilters { category: string | null, sortDesc: boolean }
- ApiResponse<T> generic wrapper { success: boolean, data: T, error?: string }
```

**Prompt 2 — useExpenses hook**
```
Create hooks/useExpenses.ts. It should:
- Accept filters: ExpenseFilters
- Fetch GET /api/expenses with category and sort_date_desc query params
- Return { expenses, meta, isLoading, error, refetch }
- Handle loading and error states
- Use native fetch + useEffect + useState (no external library)
- Build query string only from non-null/undefined filters
```

**Prompt 3 — ExpenseForm component**
```
Create components/ExpenseForm.tsx using the design tokens from DESIGN.md. It should:
- Have fields: amount (₹ prefix, number input), category (pill selector — show 
  PRESET_CATEGORIES + "Custom" option that reveals a text input), 
  description (text), date (date input, default today)
- Generate idempotencyKey with crypto.randomUUID() when the component mounts.
  Regenerate it ONLY after a successful submission (not on every render or retry).
- Show per-field inline validation errors from Zod (run client-side before submit)
- On submit: set loading state, POST to /api/expenses, on success call onSuccess() 
  prop and reset form (generate new idempotencyKey for next submission)
- On network error: show toast/error banner, DO NOT reset idempotencyKey 
  (so retry sends same key = idempotent)
- Props: { onSuccess: () => void }
```

**Prompt 4 — ExpenseFilters component**
```
Create components/ExpenseFilters.tsx. It should:
- Accept props: filters: ExpenseFilters, onChange: (f: ExpenseFilters) => void, 
  categories: string[]
- Render a category dropdown (All + each category from API)
- Render a sort toggle button ("Newest First" / "Oldest First")
- Update URL search params on change (use next/navigation useRouter + useSearchParams)
  so filter state survives page refresh
- Read initial state from URL search params on mount
```

**Prompt 5 — TotalBanner component**
```
Create components/TotalBanner.tsx. It should:
- Accept props: total: string, count: number, filteredBy: string | null, isLoading: boolean
- Display: "Total: ₹X across N expenses" (or "in Food" if filtered)
- Show a skeleton loader when isLoading is true
- Style using DESIGN.md tokens — prominent, stands out but not distracting
```

**Prompt 6 — ExpenseList component**
```
Create components/ExpenseList.tsx. It should:
- Accept props: expenses: Expense[], isLoading: boolean, error: string | null
- Render a card per expense with: colored CategoryBadge, description, 
  date (formatted as "1 May 2026"), amount (right-aligned, bold)
- Show skeleton cards (5 of them) when isLoading is true
- Show an empty state illustration + "No expenses yet. Add your first one!" when empty
- Show an error state banner when error is truthy
- Animate in new expenses with a subtle fade-in (CSS transition)
```

**Prompt 7 — Main Page**
```
Update app/page.tsx to:
- Read initial filter values from URL search params (useSearchParams)
- Fetch categories from GET /api/expenses/categories on mount
- Use useExpenses hook with current filters
- Compose: header → TotalBanner → ExpenseFilters → ExpenseForm (in a 
  slide-over Sheet or collapsible section triggered by "Add Expense" button) 
  → ExpenseList
- On ExpenseForm onSuccess: call refetch() + close the form panel
- Handle the form panel open/close state with useState
```

### 7d. Vibe Check in Antigravity

After generation, in the Antigravity browser tab:
1. Open `localhost:3000`
2. Tell the agent: `"Compare this rendering against my Stitch design. List any visual discrepancies in spacing, color, or typography and fix them."`
3. Agent will do a visual diff and self-correct.

---

## 8. Phase 3 — Nice-to-Haves (30–45 min)

Only if time remains. Do **in this order** (highest value first):

### P1 — Input Validation (client-side)
- Negative amount → show "Amount must be positive"
- Empty date → show "Date is required"
- Amount > ₹10,00,000 → "That seems too high — double-check?"
- Already handled by Zod schema — just wire it to the form UI

### P2 — Error & Loading States in UI
- Network error on submit → red banner: "Couldn't save. Your data is safe — try again."
- Slow API (simulate with `await new Promise(r => setTimeout(r, 2000))`) → spinner on button, no duplicate submissions (disable button while loading)

### P3 — Category Total Summary
Add a summary row below filters:
```
Food: ₹2,450 · Travel: ₹8,200 · Bills: ₹3,100
```
A single aggregation query from MongoDB, or compute from the fetched list client-side.

### P4 — One Automated Test
```typescript
// __tests__/api/expenses.test.ts
// Test: submitting same idempotencyKey twice returns same document
// Test: amount is stored in paise, returned with amountDisplay
// Test: category filter works correctly
```
Use `vitest` or Jest with `mongodb-memory-server` for an in-memory MongoDB.

---

## 9. Phase 4 — Test, Deploy & README (45 min)

### Manual QA Checklist
- [ ] Add expense with ₹0.01 → should work (1 paise)
- [ ] Add expense with ₹0 → should fail with validation error
- [ ] Click submit twice fast → only one expense created
- [ ] Refresh page after submitting → expense still there, form is clean
- [ ] Filter by category → total updates correctly
- [ ] Sort toggle → list reverses
- [ ] Add custom category "Gym" → appears in dropdown next time
- [ ] Slow connection (Chrome DevTools → Throttling → Slow 3G) → loading states visible
- [ ] Mobile viewport → layout looks correct

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables via Vercel dashboard or CLI:
vercel env add MONGODB_URI
# Paste your Atlas connection string

# Redeploy with env vars
vercel --prod
```

**MongoDB Atlas network access:**
- In Atlas → Network Access → Add IP → `0.0.0.0/0` (allow all — fine for a demo project)

**Vercel settings to verify:**
- Framework preset: Next.js ✓
- Root directory: `./` ✓
- Node.js version: 20.x ✓

---

## 10. README Template

```markdown
# Xpense — Personal Expense Tracker

Live: https://your-app.vercel.app  
Repo: https://github.com/you/expense-tracker

## Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: MongoDB Atlas (M0 free tier)
- **Design**: Google Stitch → Stitch MCP → Antigravity IDE
- **Deployment**: Vercel

## Key Design Decisions

### Persistence: MongoDB Atlas
I chose MongoDB because it works naturally with Vercel's serverless model 
(no persistent connections required), the free M0 tier is sufficient for 
this scale, and the flexible schema allowed fast iteration. A global 
connection singleton prevents connection exhaustion on serverless.

### Money Storage: Integer Paise
Amounts are stored as integer paise (₹1 = 100 paise) to avoid floating-point 
precision issues (0.1 + 0.2 ≠ 0.3 in IEEE 754). The API accepts decimal rupees 
from the client and converts internally.

### Idempotency
The POST /expenses endpoint is idempotent. The client generates a UUID v4 
before each submission. MongoDB's unique index on idempotencyKey ensures that 
network retries or double-clicks never create duplicate entries — the server 
detects the duplicate key error and returns the existing record.

### Filter State in URL
Category and sort state are stored in URL search params, not component state. 
This means filters survive page refresh and are shareable via URL.

## Trade-offs Made for the Timebox

- **No authentication**: Single-user app. Adding auth (NextAuth + MongoDB adapter) 
  would add ~2 hours and was out of scope.
- **No pagination**: Capped at 500 results. Full pagination would add complexity 
  without adding value at this data scale.
- **Categories stored as strings**: A separate Category collection would enable 
  renaming/deleting categories but adds a join. Not worth it for this scope.

## What I Intentionally Did NOT Do

- No Redux / Zustand (React state is sufficient)
- No ORM migrations (MongoDB is schemaless; Mongoose handles it)
- No separate Docker setup (Atlas handles the database)

## Running Locally

```bash
git clone https://github.com/you/expense-tracker
cd expense-tracker
npm install
cp .env.example .env.local
# Fill in MONGODB_URI in .env.local
npm run dev
```

Open http://localhost:3000
```

---

## 11. Edge Cases Checklist

| Scenario | Handling |
|---|---|
| User clicks submit twice | Same `idempotencyKey` → idempotent → 1 expense created |
| User refreshes mid-submit | Same `idempotencyKey` regenerated from component state → safe |
| Network drops after POST sent | Client retries with same UUID → returns existing document |
| `amount = 0` | Zod rejects: `min(1 paise)` before DB |
| `amount = -50` | Zod rejects: `positive()` |
| `amount = 1_000_000_000` | Zod rejects: `max(10_000_000)` |
| Very long description | Mongoose `maxlength: 200` + Zod `.max(200)` |
| Category with special chars | Mongoose `trim: true`, Zod `.trim()` |
| Empty category | Zod `min(1)` rejects |
| Future date | Allowed — users can log future planned expenses |
| MongoDB down | API returns 500 with generic message (no internals leaked) |
| Atlas cold start latency | Connection singleton means only first request is slow |
| `sort_date_desc=false` | Works — `date: 1` sort applied |
| `?category=all` | Treated as no filter (query `{}`) |
| Custom category injection | Trim + maxlength prevents abuse; no SQL injection risk in MongoDB |

---

*Generated: May 1, 2026 | Budget: ~6.5 hrs total across all phases*