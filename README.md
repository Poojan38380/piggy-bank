# <img src="./public/logos/logo.png" height="32" valign="middle"> PiggyBank by Fenmo

> **Quiet Luxury Fintech.** Your money, clearly.

PiggyBank is a sophisticated personal finance application designed for clarity and calm. Built with a "quiet luxury" aesthetic, it strips away the noise of traditional fintech apps to provide a focused, high-performance experience for tracking and categorizing your spending.

---

## 📱 Visual Showcase

### Landing Page
![Landing Hero](./public/demo-images/landing-hero.png)
*Desktop and Mobile experience designed for conversion and clarity.*

<table width="100%">
  <tr>
    <td width="66%"><img src="./public/demo-images/landing-page-full-laptop.png" alt="Desktop Landing"></td>
    <td width="33%"><img src="./public/demo-images/landing-page-full-mobile.png" alt="Mobile Landing"></td>
  </tr>
</table>

### Dashboard & Analytics
*A calm, professional interface for your daily financial management.*

<table width="100%">
  <tr>
    <td width="66%"><img src="./public/demo-images/dashboard.png" alt="Desktop Dashboard"></td>
    <td width="33%"><img src="./public/demo-images/dashboard-full-mobile.png" alt="Mobile Dashboard"></td>
  </tr>
</table>

### Secure Access
<table width="100%">
  <tr>
    <td width="66%"><img src="./public/demo-images/login-page.png" alt="Desktop Login"></td>
    <td width="33%"><img src="./public/demo-images/login-page-mobile.png" alt="Mobile Login"></td>
  </tr>
</table>

---

## ✨ Key Features

- **⚡ Frictionless Entry**: Log expenses in seconds. The system categorizes your inputs instantly, keeping your focus unbroken.
- **🔇 Quiet Insights**: No loud alerts or complex dashboards. Just subtle, meaningful totals that appear exactly when you need them.
- **🛡️ Retry-safe by Design**: Every submission carries a unique idempotency key. Duplicate taps or flaky networks never create duplicate entries.
- **🧮 Zero Float Math**: All financial calculations are performed using integer math (paise) to ensure 100% precision across all transactions.
- **📱 Truly Responsive**: A premium experience across all devices, from high-end laptops to mobile phones.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Auth**: [Auth.js v5](https://authjs.dev/) (NextAuth Beta)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: Lucide React
- **Toast Notifications**: [Sonner](https://sonner.steventey.com/)

---

## 🎨 Design Philosophy

PiggyBank follows the **Fenmo AI Design System**, emphasizing:
- **Typography**: 
  - `Work Sans` for impact (Headings)
  - `Inter` for readability (Body)
  - `IBM Plex Mono` for **all currency amounts** (Non-negotiable)
- **Colors**: A warm, neutral palette with Teal (`#1A7F71`) as the primary accent.
- **Shapes**: Sophisticated 10px/20px/40px border radii (no pill-shaped CTAs).
- **Feel**: Fast, natural, and remarkably calm.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fenmo-assignment
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env` file based on `.example.env`:
   ```bash
   cp .example.env .env
   ```
   Fill in your `MONGO_URI`, `AUTH_SECRET`, and other provider keys.

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

---

## ✅ Accomplishments

- [x] **Brand Identity**: Integrated Fenmo AI logo and "Quiet Luxury" aesthetic.
- [x] **Landing Page**: High-conversion hero section and feature highlights.
- [x] **Authentication**: Secure Google/GitHub login flow via Auth.js.
- [x] **Dashboard**: Functional summary cards and expense listing.
- [x] **Expense Logging**: Intelligent categorization and idempotent submissions.
- [x] **SEO & Branding**: Metadata optimization and manifest configuration.
- [x] **Database Architecture**: Robust Prisma schema for Users, Categories, and Expenses.

---

Built with ❤️ by [Poojan38380](https://github.com/Poojan38380) for **Fenmo AI**.
