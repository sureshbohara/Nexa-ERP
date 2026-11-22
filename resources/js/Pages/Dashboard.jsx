import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Package, DollarSign, AlertCircle, Briefcase, 
    ArrowUpRight, ArrowDownRight, CheckCircle2, 
    UserPlus, FileText, Edit3, Trash2 
} from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';

export default function Dashboard({ stats, monthlyRevenue, recentActivities }) {
    const formatCurrency = (amount) => 'NPR ' + Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

   
    const primaryStats = [
        { 
            name: 'Total Products', 
            value: stats?.products || 0, 
            subtitle: 'Across all warehouses', 
            icon: Package, 
            color: 'from-blue-500 to-blue-600', 
            trend: 'up', 
            trendValue: 'Active' 
        },
        { 
            name: 'Monthly Revenue', 
            value: formatCurrency(stats?.revenue), 
            subtitle: 'This month', 
            icon: DollarSign, 
            color: 'from-emerald-500 to-emerald-600', 
            trend: 'up', 
            trendValue: 'Sales' 
        },
        { 
            name: 'Pending Invoices', 
            value: stats?.pendingInvoicesCount || 0, 
            subtitle: `NPR ${Number(stats?.pendingInvoicesAmount || 0).toLocaleString()} outstanding`, 
            icon: AlertCircle, 
            color: 'from-amber-500 to-amber-600', 
            trend: 'down', 
            trendValue: 'Action needed' 
        },
        { 
            name: 'Active Subscriptions', 
            value: stats?.subscriptions || 0, 
            subtitle: 'SaaS tenants', 
            icon: Briefcase, 
            color: 'from-purple-500 to-purple-600', 
            trend: 'up', 
            trendValue: 'Running' 
        },
    ];

    const maxMonthlyAmount = Math.max(...(monthlyRevenue || []).map(m => Number(m.amount) || 0), 1);

 
    const criticalAlerts = [
        {
            title: 'Low Stock Items',
            value: stats?.lowStockProducts || 0,
            subtitle: 'Needs immediate restock',
            icon: AlertCircle,
            color: 'red',
            link: route('inventory.stocks.index'),
            linkText: 'View Stock',
        },
        {
            title: 'Expiring Soon',
            value: stats?.expiringSubscriptions || 0,
            subtitle: 'Within next 30 days',
            icon: Briefcase,
            color: 'amber',
            link: route('subscriptions.index'),
            linkText: 'Manage',
        },
        {
            title: 'Pending Leaves',
            value: stats?.pendingLeaves || 0,
            subtitle: 'Awaiting your approval',
            icon: FileText,
            color: 'blue',
            link: route('hrm.leave-applications.index'),
            linkText: 'Review',
        },
    ];

    const colorMap = {
        red: {
            border: 'border-red-200 dark:border-red-900/50',
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            hover: 'hover:text-red-700 dark:hover:text-red-300',
        },
        amber: {
            border: 'border-amber-200 dark:border-amber-900/50',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-600 dark:text-amber-400',
            hover: 'hover:text-amber-700 dark:hover:text-amber-300',
        },
        blue: {
            border: 'border-blue-200 dark:border-blue-900/50',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            hover: 'hover:text-blue-700 dark:hover:text-blue-300',
        },
    };

    const getActivityIcon = (iconName) => {
        switch(iconName) {
            case 'check': return CheckCircle2;
            case 'edit': return Edit3;
            case 'alert': return AlertCircle;
            case 'user': return UserPlus;
            default: return FileText;
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
            red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
            gray: 'bg-gray-50 dark:bg-gray-900/20 text-gray-500',
        };
        return colors[color] || colors.gray;
    };

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard - ERP SaaS" />
            <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your business today.</p>
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {primaryStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                        {stat.trendValue}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{stat.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.subtitle}</p>
                            </div>
                        );
                    })}
                </div>

         
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {criticalAlerts.map((alert, index) => {
                        const Icon = alert.icon;
                        const colors = colorMap[alert.color];
                        return (
                            <div key={index} className={`bg-white dark:bg-slate-800 rounded-xl border ${colors.border} p-5 flex items-center justify-between hover:shadow-md transition-all`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${colors.bg}`}>
                                        <Icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{alert.title}</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{alert.value}</h3>
                                        <p className={`text-xs ${colors.text} mt-1`}>{alert.subtitle}</p>
                                    </div>
                                </div>
                                <Link href={alert.link} className={`text-xs font-semibold ${colors.text} ${colors.hover}`}>
                                    {alert.linkText} &rarr;
                                </Link>
                            </div>
                        );
                    })}
                </div>

  
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Revenue</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 6 months overview</p>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="relative" style={{ height: '280px' }}>
                            <div className="absolute inset-0 flex items-end justify-between gap-3 pb-10">
                                {monthlyRevenue?.map((item, index) => {
                                    const amount = Number(item.amount) || 0;
                                    const heightPx = maxMonthlyAmount > 0 ? (amount / maxMonthlyAmount) * 200 : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                    {formatCurrency(amount)}
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                                {amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}
                                            </div>
                                            <div 
                                                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 rounded-t-lg transition-all cursor-pointer shadow-md" 
                                                style={{ height: `${Math.max(heightPx, 4)}px` }}
                                            ></div>
                                            <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-400">
                                                {item.month}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="absolute bottom-10 left-0 right-0 h-px bg-gray-200 dark:bg-slate-700"></div>
                        </div>
                    </div>

           
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Activity</h2>
                            <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Real-time
                            </span>
                        </div>
                        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                            {recentActivities?.map((activity) => {
                                const Icon = getActivityIcon(activity.icon);
                                const colorClass = getColorClasses(activity.color);
                                
                                return (
                                    <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg ${colorClass}`}>
                                        <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {activity.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

         
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href={route('inventory.products.create')} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-900/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-left transition-all group">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Add Product</h3>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">New inventory item</p>
                        </Link>
                        <Link href={route('transactions.sales.create')} className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-900/40 border border-green-200 dark:border-green-900/50 rounded-xl text-left transition-all group">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-green-900 dark:text-green-300 text-sm">New Sale</h3>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-1">Record a transaction</p>
                        </Link>
                        <Link href={route('accounting.expenses.index')} className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-900/40 border border-red-200 dark:border-red-900/50 rounded-xl text-left transition-all group">
                            <FileText className="w-6 h-6 text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-red-900 dark:text-red-300 text-sm">Add Expense</h3>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1">Record operational cost</p>
                        </Link>
                        <Link href={route('hrm.employees.index')} className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-900/40 border border-purple-200 dark:border-purple-900/50 rounded-xl text-left transition-all group">
                            <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-purple-900 dark:text-purple-300 text-sm">Manage HR</h3>
                            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Employees & Payroll</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}