# Detailed Plan: Bug Fixes & Tailwind Refactor

This plan addresses the technical bugs and design inconsistencies identified in the PiggyBank codebase, while transitioning all styling to Tailwind CSS v4.

## 1. Core Bug Fixes

- **Idempotency Stability**: Update `useCreateExpense.ts` to initialize the `idempotencyKey` lazily, preventing empty-string submissions during the initial mount phase.
- **API Response Wrapper**: Standardize all API route returns (`GET` and `POST`) to use the `ApiResponse<T>` interface.
- **Type Safety**: Remove `any` from `app/api/expenses/route.ts` and replace with Prisma's generated types.
- **Filtering Logic**: Fix the "all" category display logic in the dashboard to correctly show "Recent Expenses" instead of "Items in all".

## 2. Design System Alignment & Tailwind Refactor

We will replace all raw CSS and inline styles with Tailwind v4 classes to ensure consistency and maintainability.

- **Dashboard Layout**:
  - Convert `.dashboard-layout`, `.panel-left`, and `.panel-right` to Tailwind utilities.
  - Implement responsive behaviors using Tailwind breakpoints (`lg:flex-row`, etc.).
- **Summary Card (Hero)**:
  - Apply `radius-hero` (40px) and `gradient-hero`.
  - Use `font-display` (Work Sans) for the hero amount to match the premium spec.
- **Expense Card**:
  - Implement hover states with Tailwind (`hover:border-teal-600 hover:shadow-lg`).
  - Align layout to: `[Category Badge] [Description + Date] [Amount]`.
  - Remove emoji placeholders.
- **Expense Form**:
  - Refactor category pills to use Tailwind state variants (`active:bg-navy`).
  - Use `withArrow` prop in the `Button` component.

## 3. Implementation Schedule

1. **Foundation**: Update `globals.css` theme extensions and `ApiResponse` types.
2. **Backend**: Refactor API routes for type safety and response standardization.
3. **Hooks**: Fix idempotency key initialization.
4. **UI Components**: Refactor `SummaryCard`, `ExpenseCard`, and `ExpenseForm` to Tailwind.
5. **Pages**: Refactor `DashboardPage` layout and clean up legacy inline styles.
6. **Documentation**: Update `STATUS.md` and `FRONTEND_PLAN.md`.
