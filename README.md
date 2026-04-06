# FinTrack Pro — Finance Dashboard

A modern, interactive finance dashboard built with React, Zustand, and Recharts. Designed for clarity, usability, and visual polish.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v8+

### Installation & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 | Component model, hooks, fast reconciliation |
| State | Zustand + persist middleware | Simple, scalable, localStorage persistence |
| Charts | Recharts | Composable, responsive SVG charts |
| Bundler | Vite | Fast HMR, optimised production builds |
| Fonts | Outfit + JetBrains Mono | Modern UI font + monospaced numbers |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation, role switcher, balance widget
│   ├── SummaryCard.jsx      # Reusable metric card with trend indicator
│   ├── TransactionTable.jsx # Sortable table with admin edit/delete
│   └── TransactionModal.jsx # Add/edit transaction modal with validation
├── pages/
│   ├── Dashboard.jsx        # Overview: cards, area chart, pie, recent activity
│   ├── Transactions.jsx     # Full table with filters, search, export
│   └── Insights.jsx         # Analytics: category bars, 3-month comparison, savings
├── store/
│   └── store.js             # Zustand store — all state + derived selectors
├── data/
│   └── mockData.js          # 40 realistic transactions + 7-month trend data
├── styles.css               # Global CSS variables, animations, responsive rules
└── App.jsx                  # Root layout, top bar, page routing
```

---

## ✨ Features

### Dashboard Overview
- **4 Summary Cards**: Net Balance, Total Income, Total Expenses, Savings Rate — each with trend % badge and animated progress bar
- **Cash Flow Trend**: 7-month area chart (Income vs Expenses) with gradient fills
- **Spending Mix**: Donut chart with category legend for April 2026
- **Recent Activity**: Last 5 transactions with emoji category icons
- **Monthly Income**: Bar chart comparing 7 months of income performance

### Transactions
- **40 realistic transactions** across 3 months (Feb–Apr 2026) with descriptions, categories, amounts
- **Live search** across description, category, and amount
- **Filter by**: Type (income/expense), Category (10 options), Month
- **Sort by** any column (date, description, category, type, amount) — toggle asc/desc
- **Export**: CSV and JSON download of filtered results
- **Empty state**: Friendly message when no results match filters

### Insights & Analytics
- **Highlight cards**: Top spending category, savings rate %, month-over-month expense change
- **Horizontal bar chart**: All-time spending by category (sorted)
- **3-Month line chart**: Feb vs Mar vs Apr income and expense comparison
- **Category breakdown**: Animated progress bars with percentage of total
- **Savings trend**: Monthly net savings bar chart
- **Key observations**: Auto-generated text insights from the data

### Role-Based UI (RBAC)
Switch roles using the toggle in the sidebar footer:

| Feature | Viewer | Admin |
|---|---|---|
| View all data & charts | ✅ | ✅ |
| Add new transaction | ❌ | ✅ |
| Edit existing transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Filter, search, export | ✅ | ✅ |

### State Management
All state lives in a single Zustand store (`src/store/store.js`):
- `transactions[]` — array of all transaction objects
- `role` — current user role (`viewer` | `admin`)
- `filterType`, `filterCategory`, `filterMonth`, `searchQuery` — active filter state
- `sortBy`, `sortDir` — sort column and direction
- `getFiltered()` — derived selector combining all filters + sort
- `addTransaction`, `editTransaction`, `deleteTransaction` — CRUD actions
- **Persisted to localStorage** via Zustand's `persist` middleware — data survives page refreshes

### UX Details
- **Smooth animations**: `fadeUp` stagger on page load, bar-grow on progress bars, hover lift on cards
- **Empty states**: Handled gracefully with icon + message
- **Form validation**: Required fields, numeric check on amount, visual error messages
- **Responsive**: Sidebar collapses on mobile, grids reflow
- **Consistent design tokens**: All colors, radii, transitions via CSS variables
- **Confirmation dialog**: Delete requires confirmation to prevent accidents

---

## 🎨 Design Decisions

- **Dark theme only** — fintech apps live in dark mode; reduces eye strain for frequent users
- **JetBrains Mono for numbers** — monospaced font prevents layout shift as values change and improves scannability
- **4-card summary row** — added Savings Rate as a fourth card because it's a key financial health metric not in the original spec, but highly relevant
- **Horizontal bars in Insights** — easier to read category names vs vertical bars with rotated labels
- **Gradient accent pair** (teal #22d3a0 + blue #3b82f6) — complementary, professional, avoids the clichéd purple-on-white fintech look

---

## 📝 Assumptions Made

- Currency is INR (₹); all amounts are integers
- "Monthly" scope defaults to April 2026 (current month in the mock data)
- Role switching is frontend-only (no auth); intended purely for UI demonstration
- No backend required — all data is static mock data with localStorage persistence

