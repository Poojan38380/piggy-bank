# Personal Finance Tracker Roadmap

Date: 2026-05-01

## 1. Project framing

Build a **small, production-like personal finance tracker** in Next.js that nails correctness, resilience, and clarity before feature breadth. The attached assignment emphasizes a narrow scope: create expenses, list them, filter by category, sort by date newest-first, show the total of the visible list, and behave correctly under retries, refreshes, slow networks, and duplicate submissions.

This roadmap is intentionally shaped around that evaluation criteria first, then layers a refined frontend approach using Google Stitch MCP with Antigravity for a distinctive, beautiful, clean UI.

## 2. Non-negotiable product goals

### Core outcome

A user should be able to:
- Add an expense with amount, category, description, and date.
- See previously added expenses.
- Filter by category.
- Sort by date descending.
- See the total for the currently visible results.

### Quality bar

The app should feel like a small real product, not a toy demo:
- Correct money handling.
- Retry-safe API behavior.
- Clear loading, success, and error states.
- No accidental duplicate expenses from repeated submits.
- Fast enough to feel instant on normal networks.
- Easy to understand without tutorial text.

### What “best small tool” means here

For this assignment, “best” does **not** mean many features. It means:
- Strong fundamentals.
- Very low confusion.
- Trustworthy calculations.
- Elegant UI hierarchy.
- Thoughtful empty/error/loading states.
- Great implementation choices under a timebox.

## 3. Recommended product scope

### Ship in v1

Keep the initial product scope tight:
- Expense creation form.
- Expense list.
- Category filter.
- Newest-first sort.
- Visible total.
- Basic validation.
- Idempotent create behavior.
- Lightweight summary strip.
- Responsive design.
- Accessible keyboard-friendly interactions.

### Explicitly defer

Do **not** add these before the core is excellent:
- Bank sync.
- Multi-user auth.
- Budgets and goals.
- Recurring expenses.
- OCR receipt scanning.
- AI insights.
- CSV import/export.
- Charts beyond one tiny optional summary view.
- Complex dashboard shells.

A polished narrow app will score better than a broad but fragile one.

## 4. Latest research takeaways influencing this plan

### Next.js direction

As of early 2026, Next.js 16.x is current, with 16.2 released in March 2026. The v16 cycle includes routing and navigation changes, Turbopack maturity, and current upgrade guidance from the App Router docs. For a new app, start on a current Next.js 16 App Router codebase rather than building against older 13/14-era assumptions. Source links to review during setup:
- https://nextjs.org/blog/next-16
- https://nextjs.org/blog/next-16-2
- https://nextjs.org/docs/app/guides/upgrading/version-16

### Finance UX direction

Recent finance UX writing still converges on a few principles that matter here even for a tiny app:
- Trust and transparency matter more than visual flash.
- Low-friction flows beat dense dashboards.
- Users value personalized clarity, but only if they stay in control.
- Surfaces should be calm and legible; the interface should never feel risky or ambiguous.

For this project, that means:
- Fewer visual elements.
- Strong typography hierarchy.
- Obvious totals and filters.
- Inline explanations only where they reduce risk.
- Never hide critical money values behind interactions.

### Resilient API behavior

Idempotency is a core finance-system pattern, not an optional enhancement. Recent guidance continues to emphasize the same principle: one user intent should be safe to retry without creating duplicates. Also, idempotency keys and unique constraints solve different problems, and using both is stronger than using only one.

### Data storage choice

SQLite remains an excellent fit for a small single-user or demo-grade tool because it is simple, durable, local, and easy to reason about. For money, avoid floating point storage. Store amount in the smallest currency unit as an integer (for INR, paise), and format it for display in the UI.

## 5. Best-fit architecture

## 5.1 Stack

Recommended stack:
- **Next.js 16 App Router**.
- **TypeScript**.
- **Tailwind CSS** or a small tokenized CSS system.
- **SQLite** with a thin ORM/query layer.
- **Drizzle ORM** recommended for clarity and schema control, though Prisma is acceptable.
- **Zod** for request validation.
- **React Hook Form** optional; plain controlled inputs are also fine.
- **TanStack Query** optional but useful if you want robust request lifecycle handling; not required for such a small app.
- **Vitest** and/or **Playwright** for a small test set.

### Why this stack fits

It keeps the project:
- Small.
- Typed end to end.
- Easy to demo locally.
- Easy to deploy.
- Easy to explain in README.

## 5.2 Rendering model

Use a hybrid split:
- Server-render the initial page shell and first expense list fetch.
- Use client components only where interaction is needed: form, filter controls, optimistic/interactive states.
- Keep data access centralized in route handlers or a dedicated service layer.

This gives a stable first render without overcomplicating the app.

## 5.3 Suggested folder structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    api/
      expenses/
        route.ts
  components/
    expense-form.tsx
    expense-list.tsx
    expense-row.tsx
    expense-filters.tsx
    summary-strip.tsx
    shell/
      app-header.tsx
      app-shell.tsx
  db/
    schema.ts
    client.ts
  lib/
    money.ts
    dates.ts
    idempotency.ts
    validation.ts
    expenses.ts
    categories.ts
  styles/
    globals.css
  tests/
    unit/
    integration/
    e2e/
```

## 6. Data model design

### Expenses table

Minimum fields:
- `id`: string/uuid.
- `amount_paise`: integer, not float.
- `category`: text.
- `description`: text.
- `expense_date`: ISO date only, user-entered transaction date.
- `created_at`: timestamp, server-generated.

### Idempotency table

Add a second table to support retry-safe creation:
- `idempotency_key`: unique text.
- `request_hash`: text.
- `expense_id`: foreign key to expenses.
- `created_at`: timestamp.

### Why split these concerns

This lets you safely answer duplicate POST retries:
- Same key + same request body => return existing created expense.
- Same key + different request body => reject with conflict.

That is exactly the sort of “real-world conditions” behavior the assignment hints at.

## 7. Money handling rules

Money correctness is one of the most important scoring areas.

### Rules

- Never store money as JavaScript float in the database.
- Convert input like `123.45` rupees to integer paise before insert.
- Sum using integers only.
- Format output with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- Reject negative values.
- Reject zero if your UX intends “expense” to mean actual spend; otherwise explicitly allow zero and explain why.
- Limit precision to 2 decimal places.

### Utility contract

Create a `money.ts` module with:
- `parseMoneyInputToMinorUnits(input: string): number | Result`
- `formatMinorUnits(amountPaise: number): string`
- `sumMinorUnits(items: number[]): number`

### Edge cases to test

- `12`
- `12.3`
- `12.30`
- `0`
- `-10`
- `0012.50`
- `12.345`
- empty string
- very large amount

## 8. API design

## 8.1 POST /api/expenses

Request body:
```json
{
  "amount": "123.45",
  "category": "Food",
  "description": "Lunch",
  "date": "2026-05-01"
}
```

Headers:
- `Idempotency-Key: <uuid>`

Behavior:
1. Validate request body with Zod.
2. Normalize values.
3. Hash the normalized request body.
4. Check idempotency table.
5. If key exists:
   - same hash => return original created record with 200 or 201-by-policy.
   - different hash => return 409 conflict.
6. If key does not exist:
   - create expense in a transaction.
   - store idempotency record.
   - return created expense.

Response shape:
```json
{
  "expense": {
    "id": "...",
    "amountPaise": 12345,
    "amountFormatted": "₹123.45",
    "category": "Food",
    "description": "Lunch",
    "date": "2026-05-01",
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
}
```

## 8.2 GET /api/expenses

Supported query params:
- `category`
- `sort=date_desc`

Recommended extension even if not externally exposed:
- Always sort by `expense_date DESC, created_at DESC`.

Response shape:
```json
{
  "items": [...],
  "totalVisiblePaise": 45670,
  "totalVisibleFormatted": "₹456.70"
}
```

### Why compute total on the server too

Even if the UI can sum locally, a server-computed total improves trust and keeps business logic consistent.

## 9. UX strategy for the “best small tool”

The best finance tracker UI for this scope should feel:
- Calm.
- Premium.
- Trustworthy.
- Frictionless.
- Extremely readable.

### UX principles

- One obvious primary task: add expense.
- One obvious secondary task: scan and understand spending.
- Keep total visible at all times on desktop and near the top on mobile.
- Minimize text labels that don’t change behavior.
- Let hierarchy do the work: amount first, then category, then description, then date metadata.
- Design for empty, loading, retrying, and error states from the beginning.

## 10. Frontend concept using Google Stitch MCP + Antigravity

Because you plan to use **Google Stitch MCP with Antigravity**, treat the UI generation workflow as a creative accelerator, not a product-decisions engine. Use it to explore layout systems, motion polish, and visual differentiation, but lock correctness, IA, data display rules, and state behavior yourself.

### Proposed visual direction

A strong direction for this app:
- Quiet luxury meets utility.
- Soft neutral base with one disciplined accent color.
- Clear card surfaces, almost paper-like.
- Strong numeric typography for amounts.
- Subtle motion, never “fintech neon.”
- Dense enough to feel useful, not crowded.

### Design constraints to give Stitch/Antigravity

Use prompts and guardrails like these:
- Design for trust, not hype.
- Avoid purple/blue fintech gradients.
- Avoid generic SaaS feature-card layouts.
- Optimize for amount readability and low cognitive load.
- Use one dominant action button only.
- Make filters feel lightweight and obvious.
- Make the total prominent but not loud.
- Support mobile first.
- Prefer asymmetry in shell composition, symmetry in tabular/list content.
- Use subtle delight only in transitions and empty states.

### UI regions

Recommended single-page structure:
1. Header with product name and tiny context line.
2. Summary strip with visible total and current filter state.
3. Add expense card/form.
4. Filter + sort controls.
5. Expense list.
6. Empty state or error state when relevant.

## 11. Screen-by-screen roadmap

## 11.1 Main page

This is the whole app.

Layout idea:
- Desktop: 12-column grid; left side form/summary, right side expense feed.
- Mobile: summary -> form -> controls -> list.

Critical elements:
- Current visible total.
- Filter chip or select.
- Sort control fixed to newest first by default.
- Add expense CTA.
- List count.

## 11.2 Empty state

When there are no expenses:
- Show a welcoming illustration or minimal visual motif.
- Explain the first action in one sentence.
- Keep the form available immediately.

Example message:
- “Start by adding your first expense. The total and category filters will update automatically.”

## 11.3 Loading states

Use skeletons for:
- Expense list.
- Summary total.

Do not skeleton the whole page after first load. Preserve layout to avoid jumpiness.

## 11.4 Error states

Need at least three distinct user-facing cases:
- Create failed before confirmation.
- Duplicate request conflict due to reused key with changed payload.
- List fetch failed.

Each should explain what happened in plain language.

## 12. Interaction details

### Expense form fields

Recommended controls:
- Amount: text input with numeric keyboard and helper formatting.
- Category: select or combobox with a small curated set for v1.
- Description: plain text input.
- Date: native date input.

### Suggested categories for v1

Keep the list small and believable:
- Food
- Transport
- Shopping
- Bills
- Health
- Entertainment
- Education
- Travel
- Other

### Submission UX

On submit:
- Disable submit button.
- Show inline pending state.
- Keep the generated idempotency key stable for retries of that same intent.
- On success, reset form and immediately refresh or append result.
- On timeout, let user retry safely with the same key.

### Filtering UX

Recommended pattern:
- Category select with “All categories” default.
- Sort fixed to newest first, but still visible so the reviewer sees it exists.

## 13. Technical implementation phases

## Phase 0 — Clarify before coding

Before implementation, answer these open product questions instead of assuming:
1. Should the tool be **expense-only**, or do you also want income later in the same architecture?
2. Should v1 be **single-currency INR-only**, or do you want the domain model future-safe for multi-currency?
3. Do you want **local-only persistence** for the assignment, or a deploy-ready hosted DB path too?
4. Is the visual target more **calm premium**, **editorial**, or **playful modern**?
5. Should category values be fixed in code for the assignment, or user-creatable?
6. Do you want **one-page simplicity**, or a slightly richer shell with a history/insights panel?
7. Will Google Stitch MCP + Antigravity generate mostly **layout ideas**, or do you want it writing production-ready component code too?

These decisions affect the final roadmap details and the prompt strategy for the frontend generator.

## Phase 1 — Foundation

Tasks:
- Create Next.js 16 app with TypeScript and App Router.
- Set up linting/formatting.
- Add SQLite + ORM.
- Create schema and migrations.
- Add seed/dev helpers if useful.
- Define design tokens.
- Build shared utilities: money, dates, validation.

Exit criteria:
- App runs locally.
- DB initializes cleanly.
- Core utilities are tested.

## Phase 2 — Data and API

Tasks:
- Implement `POST /api/expenses`.
- Implement `GET /api/expenses`.
- Add idempotency handling.
- Add normalization layer.
- Add typed response mappers.
- Add basic integration tests.

Exit criteria:
- Duplicate submit with same key does not duplicate expense.
- Filter and sort work correctly.
- Totals are accurate.

## Phase 3 — Core UI

Tasks:
- Build page shell.
- Build summary strip.
- Build add-expense form.
- Build filters.
- Build expense list.
- Add loading, empty, and error states.
- Add accessible focus states and keyboard flows.

Exit criteria:
- Full acceptance criteria satisfied in UI.
- Refresh after submit still shows persisted data.
- Slow API response still feels understandable.

## Phase 4 — Polish and trust layer

Tasks:
- Improve feedback copy.
- Add subtle motion.
- Tighten spacing/typography.
- Improve amount formatting.
- Add small category summary if time allows.
- Add toasts only for non-critical secondary confirmation.

Exit criteria:
- Interface looks intentional and premium.
- No confusing state transitions.
- No overdesigned fintech clichés.

## Phase 5 — Tests and README

Tasks:
- Add unit tests for money parsing/formatting.
- Add one API integration test for idempotent create.
- Add one UI/e2e happy path.
- Write README with design decisions, trade-offs, and intentionally omitted features.

Exit criteria:
- Reviewer can understand architectural choices quickly.
- Core correctness is demonstrable.

## 14. Detailed engineering checklist

### Backend checklist

- [ ] SQLite schema created.
- [ ] Expense table uses integer minor units.
- [ ] Idempotency table created with unique key.
- [ ] Zod validation covers all inputs.
- [ ] POST route uses transaction.
- [ ] Request hash stored and compared.
- [ ] GET route supports category filter.
- [ ] GET route sorts newest first.
- [ ] Visible total returned.
- [ ] Errors use stable JSON shape.

### Frontend checklist

- [ ] Mobile-first responsive shell.
- [ ] Add expense form complete.
- [ ] Submit disables while pending.
- [ ] Retry-safe submission flow.
- [ ] Filter control works.
- [ ] Sort visible and correct.
- [ ] Visible total shown prominently.
- [ ] Empty state designed.
- [ ] Loading state designed.
- [ ] Error state designed.
- [ ] Accessible labels and focus states.

### Quality checklist

- [ ] No float math for stored money.
- [ ] No duplicate creation on retries.
- [ ] Date handling consistent between client and server.
- [ ] Refresh does not lose persisted expenses.
- [ ] Code is easy to explain.
- [ ] README explains trade-offs.

## 15. Testing plan

### Unit tests

Must-have unit tests:
- Money parsing.
- Money formatting.
- Request normalization.
- Request hash consistency.

### Integration tests

Must-have API tests:
- Create expense success.
- Create same request twice with same idempotency key => one expense only.
- Create with same key but different payload => 409.
- List filtered by category.
- List sorted newest first.
- Total equals sum of visible expenses.

### End-to-end tests

Recommended minimal e2e cases:
- User adds expense and sees it in list with updated total.
- User double-clicks submit or retries due to delay and still gets one record.
- User filters by category and total updates correctly.

## 16. Design system guidance

### Visual tokens

Recommended visual language:
- Background: warm neutral or soft cool-gray.
- Surface: subtle layered cards.
- Accent: one restrained green, teal, or ink-blue.
- Error: muted red, not saturated alert red.
- Success: gentle green only where needed.

### Typography

Use typography to distinguish data priority:
- Amounts: tabular numerals, semibold or bold.
- Labels: small but readable.
- Body: highly legible sans.
- Metadata: quieter secondary tone.

### Motion

Use motion sparingly:
- Button state transitions.
- List item insertion fade/slide.
- Summary total number transition.
- Skeleton shimmer.

Avoid:
- Big hero animations.
- Finance-dashboard parallax.
- Decorative glow effects.

## 17. Prompting plan for Google Stitch MCP + Antigravity

Use a staged prompting workflow instead of one giant prompt.

### Prompt 1 — product shell exploration

Ask for:
- 3 radically different layout directions for a small finance tracker.
- One calm premium concept.
- One editorial concept.
- One soft futuristic but trustworthy concept.
- All optimized for clarity, expense entry, visible total, filters, and mobile ergonomics.

### Prompt 2 — convergence

Pick one direction and ask it to refine:
- Improve scanability of the expense list.
- Make the add-expense flow obvious.
- Make total and filters visible without clutter.
- Remove generic fintech styling.

### Prompt 3 — component system

Ask for production-oriented components:
- Summary strip.
- Expense form.
- Filter controls.
- Expense row/list.
- Empty state.
- Error state.
- Loading skeleton.

### Prompt 4 — implementation pass

Only after structure is locked:
- Generate Next.js/Tailwind component code aligned to your design tokens.
- Preserve your API contracts and state rules.
- Do not invent business logic.

## 18. Nice-to-have features that actually help

If time remains after the core is excellent, prioritize in this order:

1. **Category subtotal pills** for visible results.
2. **Small monthly grouping labels** in the list.
3. **Last submission recovery UX** for network timeout ambiguity.
4. **Tiny insights card** such as “Top category this month”.
5. **CSV export** only if everything else is already solid.

Do not add big charts before these. For a small tracker, numbers and list clarity usually beat chart density.

## 19. Suggested README points

Your README should explain:
- Why SQLite was chosen.
- Why amount is stored in minor units.
- How idempotency is implemented.
- Why the feature scope stayed intentionally small.
- Which edge cases were prioritized.
- Which enhancements were intentionally skipped due to the timebox.

## 20. Risk register

Main implementation risks:

- **Using floats for money** -> causes rounding issues.
- **No idempotency** -> duplicate expenses on retries/double submits.
- **Ambiguous date semantics** -> timezone bugs.
- **Overdesigned UI** -> looks flashy but hurts trust.
- **Too many features** -> weaker core quality.
- **Client-only state assumptions** -> refresh/reload breaks expectations.

Mitigations:
- Integer minor units.
- Idempotency-key workflow.
- Store plain expense date separately from timestamps.
- Minimal, trust-oriented visual system.
- Ruthless scope control.
- Persistent DB-backed source of truth.

## 21. Recommended final product thesis

The strongest version of this project is:

> A one-page, beautifully crafted, retry-safe expense tracker built with Next.js 16, SQLite, integer-based money handling, and an idempotent expense creation API, with a calm premium UI generated and refined through Google Stitch MCP + Antigravity.

That thesis is simple, defensible, and aligned with the assignment’s evaluation criteria.

## 22. Clarification questions

Answer these before coding so the implementation roadmap can be finalized accurately:

1. Do you want the roadmap optimized strictly for **this assignment submission**, or for a tool that can evolve into your real personal finance product after the assignment?
2. Should the first version support **INR only**, or should the architecture be multi-currency ready from day one?
3. Do you want to use **SQLite locally** for simplicity, or would you prefer a deploy-ready hosted database path in the roadmap too?
4. For the visual direction, which is closer to your taste: **calm premium**, **editorial minimalist**, or **slightly futuristic**?
5. Should categories be **fixed predefined values** in v1, or **user-defined**?
6. Do you want the roadmap to include a **detailed file-by-file implementation plan** next, or keep it at product/architecture level?

## 23. Strong recommendation

If you want the best chance of both impressing reviewers and building something genuinely good, optimize for this order:

1. Correctness.
2. Retry safety.
3. Clarity.
4. Tasteful UI.
5. Small delightful touches.
6. Extra features.

That ordering is what will make the tool feel serious.