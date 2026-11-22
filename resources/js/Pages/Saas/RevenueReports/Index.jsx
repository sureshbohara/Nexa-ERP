import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import { DollarSign, TrendingUp, AlertCircle, CreditCard, Calendar } from 'lucide-react';

export default function RevenueReportsIndex({ summary, monthly_revenue, recent_payments }) {
    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout title="Revenue Reports">
            <Head title="Revenue Reports" />
            <div className="space-y-6">
                <Breadcrumb title="SaaS Management" subTitle="Revenue Reports" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Revenue', href: route('saas.revenue.index') }]} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><DollarSign className="w-6 h-6 text-blue-600" /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Invoiced</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.total_invoiced)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_collected)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pending / Unpaid</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.total_pending)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Revenue Breakdown</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Month</th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">Transactions</th>
                                        <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {monthly_revenue.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.month}</td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{row.transaction_count}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-emerald-600">{formatCurrency(row.total_amount)}</td>
                                        </tr>
                                    ))}
                                    {monthly_revenue.length === 0 && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">No revenue data available</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Successful Payments</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Invoice / Org</th>
                                        <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {recent_payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(payment.payment_date)}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white">{payment.invoice?.invoice_no || 'Direct Payment'}</div>
                                                <div className="text-xs text-gray-500">{payment.organization?.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                                        </tr>
                                    ))}
                                    {recent_payments.length === 0 && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">No recent payments</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}