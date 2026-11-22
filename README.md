# NextGen ERP SaaS Platform

A comprehensive, multi-tenant, and highly scalable SaaS ERP (Enterprise Resource Planning) system built with modern web technologies. Designed to manage Inventory, Accounting, HRM, Sales, Purchases, and SaaS Subscriptions seamlessly.

---

## 🛠️ Tech Stack

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React 18, Inertia.js, Tailwind CSS, Vite
- **Database:** MySQL / SQLite
- **Authentication:** Laravel Sanctum / Breeze
- **UI/UX:** Lucide React Icons, Dark/Light Mode Support, Responsive Design

---

## ✨ Key Features

### 📊 1. Smart Dashboard
- Real-time business analytics (Revenue, Pending Invoices, Active Subscriptions).
- Interactive Monthly Revenue Charts.
- Critical Alerts (Low Stock, Expiring Subscriptions, Pending Leaves).
- Live Activity Feed & Quick Action shortcuts.

### 📦 2. Inventory Management
- Product, Category, Brand, and Unit management.
- Multi-warehouse Stock Management.
- Real-time Stock Movements (In, Out, Transfer, Adjustment).
- Low Stock Threshold Alerts.

### 💼 3. Transactions (Sales & Purchases)
- Supplier & Customer Management with Credit Limits.
- Full Purchase & Sales Cycle (Quotation to Invoice).
- Purchase & Sale Returns handling.
- Partial & Full Payment tracking.

### 💰 4. Accounting & Finance
- Chart of Accounts (Assets, Liabilities, Equity, Income, Expenses).
- Bank Accounts & Bank Transaction Reconciliation.
- Double-entry Journal Entries.
- Automated Financial Reports: Trial Balance, Profit & Loss, Balance Sheet, General Ledger.

### 👥 5. Human Resource Management (HRM)
- Department & Employee Profile Management.
- Customizable Salary Structures.
- Daily Attendance Tracking (Present, Absent, Late, Leave, Half-day).
- Leave Types & Leave Application Approval Workflow.
- **Automated Payroll Processing** with Payslip Generation & Printable PDF views.

### ☁️ 6. SaaS Billing & Subscription Management
- Customizable Subscription Plans (Monthly/Yearly, Feature limits).
- Organization-wise Subscription Tracking.
- Automated Subscription Invoice Generation.
- Payment Recording (Cash, Bank, eSewa, Khalti, Stripe).
- Revenue Reports & Analytics.

### ⚙️ 7. System & Utilities
- **Multi-Tenancy:** Strict Organization & Branch-level data isolation (Global Scopes).
- **Role-Based Access Control (RBAC):** Granular permission management.
- **Global Search:** Lightning-fast `Cmd/Ctrl + K` search across all modules.
- **Audit Logs:** Track every create, update, and delete action with User, IP, and Timestamp.
- **Real-time Notifications:** System-wide alerts for expiring subscriptions and approvals.
- **File Attachments:** Centralized document management for any module.

---

## 🏗️ Architecture Highlights

- **Repository Pattern:** Clean separation of business logic and data access.
- **Form Requests:** Strict validation and authorization rules.
- **Global Scopes:** Automatic data filtering based on logged-in user's Organization/Branch.
- **Optimistic UI:** Fast, SPA-like experience using Inertia.js.

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sureshbohara/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME