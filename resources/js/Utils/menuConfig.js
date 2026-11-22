import {
    LayoutDashboard, Package, Box, Layers, Tag, Scale, Building, Boxes, ArrowLeftRight,
    ShoppingCart, Truck, User, ShoppingBag, RefreshCcw, Receipt,
    DollarSign, GitBranch, Landmark, FileText, Wallet, TrendingUp, ClipboardList, BookOpen,
    Users, Building2, Banknote, CalendarCheck, CalendarOff, CalendarClock, Sun, MapPin, Bell, Settings,
    Cloud, Repeat, CreditCard, Plug, BarChart3, ScrollText, Shield
} from 'lucide-react';

export const menuItems = [
    {
        name: 'Dashboard',
        href: 'dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Inventory',
        icon: Package,
        permission: 'view_products',
        children: [
            { name: 'Products', href: 'inventory.products.index', icon: Box, permission: 'view_products' },
            { name: 'Categories', href: 'inventory.categories.index', icon: Layers, permission: 'view_categories' },
            { name: 'Brands', href: 'inventory.brands.index', icon: Tag, permission: 'view_brands' },
            { name: 'Units', href: 'inventory.units.index', icon: Scale, permission: 'view_units' },
            { name: 'Warehouses', href: 'inventory.warehouses.index', icon: Building, permission: 'view_warehouses' },
            { name: 'Product Stocks', href: 'inventory.stocks.index', icon: Boxes, permission: 'view_stocks' }, 
            { name: 'Stock Movements', href: 'inventory.stock-movements.index', icon: ArrowLeftRight, permission: 'view_stock' },
        ],
    },
    {
        name: 'Transactions',
        icon: ShoppingCart,
        permission: 'view_sales',
        children: [
            { name: 'Suppliers', href: 'transactions.suppliers.index', icon: Truck, permission: 'view_suppliers' },
            { name: 'Customers', href: 'transactions.customers.index', icon: User, permission: 'view_customers' },
            { name: 'Purchases', href: 'transactions.purchases.index', icon: ShoppingBag, permission: 'view_purchases' },
            { name: 'Purchase Returns', href: 'transactions.purchase-returns.index', icon: RefreshCcw, permission: 'view_purchases' }, 
            { name: 'Sales', href: 'transactions.sales.index', icon: Receipt, permission: 'view_sales' },
            { name: 'Sale Returns', href: 'transactions.sale-returns.index', icon: RefreshCcw, permission: 'view_sales' }, 
        ],
    },
    {
        name: 'Accounting',
        icon: DollarSign,
        permission: 'view_accounts',
        children: [
            { name: 'Chart of Accounts', href: 'accounting.accounts.index', icon: GitBranch, permission: 'view_accounts' },
            { name: 'Bank Accounts', href: 'accounting.bank-accounts.index', icon: Landmark, permission: 'view_bank_accounts' },
            { name: 'Bank Transactions', href: 'accounting.bank-transactions.index', icon: ArrowLeftRight, permission: 'view_bank_accounts' }, 
            { name: 'Journal Entries', href: 'accounting.journal-entries.index', icon: FileText, permission: 'view_journal_entries' },
            { name: 'Expenses', href: 'accounting.expenses.index', icon: Wallet, permission: 'view_expenses' },
            { name: 'Trial Balance', href: 'accounting.reports.trial-balance', icon: Scale, permission: 'view_accounts' }, 
            { name: 'Profit & Loss', href: 'accounting.reports.profit-loss', icon: TrendingUp, permission: 'view_accounts' }, 
            { name: 'Balance Sheet', href: 'accounting.reports.balance-sheet', icon: ClipboardList, permission: 'view_accounts' }, 
            { name: 'General Ledger', href: 'accounting.reports.general-ledger', icon: BookOpen, permission: 'view_accounts' }, 
        ],
    },
    {
        name: 'HRM',
        icon: Users,
        permission: 'view_employees',
        children: [
            { name: 'Departments', href: 'hrm.departments.index', icon: Building2, permission: 'view_departments' },
            { name: 'Employees', href: 'hrm.employees.index', icon: User, permission: 'view_employees' },
            { name: 'Salary Structures', href: 'hrm.salary-structures.index', icon: Banknote, permission: 'view_salary' },
            { name: 'Attendance', href: 'hrm.attendances.index', icon: CalendarCheck, permission: 'view_attendances' },
            { name: 'Leave Type', href: 'hrm.leave-types.index', icon: CalendarOff, permission: 'view_leave' },
            { name: 'Leave Applications', href: 'hrm.leave-applications.index', icon: CalendarClock, permission: 'view_employees' },
            { name: 'Holidays', href: 'hrm.holidays.index', icon: Sun, permission: 'view_employees' }, 
            { name: 'Payrolls', href: 'hrm.payrolls.index', icon: Wallet, permission: 'view_payrolls' },
            { name: 'Payslips', href: 'hrm.payslips.index', icon: Receipt, permission: 'view_payrolls' }, 
        ],
    },
    {
        name: 'System',
        icon: Settings,
        permission: 'view_users',
        children: [
            { name: 'Users', href: 'users.index', icon: Users, permission: 'view_users' },
            { name: 'Roles', href: 'roles.index', icon: Shield, permission: 'view_roles' },
            { name: 'Organizations', href: 'organizations.index', icon: Building, permission: 'view_organizations' },
            { name: 'Branches', href: 'branches.index', icon: MapPin, permission: 'view_branches' },
            { name: 'Notifications', href: 'notifications.index', icon: Bell, permission: 'view_notifications' },
            { name: 'Settings', href: 'settings.index', icon: Settings, permission: 'view_settings' },
        ],
    },
    {
        name: 'SaaS Management',
        icon: Cloud,
        permission: 'view_plans',
        children: [
            { name: 'Plans', href: 'plans.index', icon: Layers, permission: 'view_plans' },
            { name: 'Subscriptions', href: 'subscriptions.index', icon: Repeat, permission: 'view_subscriptions' },
            { name: 'Invoices', href: 'saas.subscription-invoices.index', icon: FileText, permission: 'view_subscriptions' }, 
            { name: 'Payments', href: 'saas.subscription-payments.index', icon: CreditCard, permission: 'view_subscriptions' },
            { name: 'Payment Gateways', href: 'saas.payment-gateways.index', icon: Plug, permission: 'view_payment_gateways' },
            { name: 'Revenue Reports', href: 'saas.revenue.index', icon: BarChart3, permission: 'view_revenue' },
            { name: 'Audit Logs', href: 'saas.audit-logs.index', icon: ScrollText, permission: 'view_audit_logs' },
        ],
    },
];


export const hasPermission = (permission, userPermissions, roleName) => {
 
    return true; 
};