import { Head } from '@inertiajs/react';
import { FileBarChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';

export default function ProfitLoss({ reportData, totalIncome, totalExpense, netProfit }) {
    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Profit & Loss', href: route('accounting.reports.profit-loss') },
    ];

    const isProfit = netProfit >= 0;

    return (
        <AppLayout title="Profit & Loss">
            <Head title="Profit & Loss Statement" />
            <div className="space-y-4">
                <Breadcrumb title="Accounting" subTitle="Profit & Loss Statement" breadcrumbItems={breadcrumbItems} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-emerald-600" />
                        <div>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Total Income</p>
                            <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Rs. {totalIncome.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                        <TrendingDown className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="text-xs text-red-700 dark:text-red-400 font-medium">Total Expense</p>
                            <p className="text-xl font-bold text-red-800 dark:text-red-300">Rs. {totalExpense.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className={`border rounded-lg p-4 flex items-center gap-3 ${isProfit ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
                        <DollarSign className={`w-8 h-8 ${isProfit ? 'text-blue-600' : 'text-orange-600'}`} />
                        <div>
                            <p className={`text-xs font-medium ${isProfit ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>Net {isProfit ? 'Profit' : 'Loss'}</p>
                            <p className={`text-xl font-bold ${isProfit ? 'text-blue-800 dark:text-blue-300' : 'text-orange-800 dark:text-orange-300'}`}>Rs. {Math.abs(netProfit).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Income Accounts</h3>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {reportData.income.length > 0 ? reportData.income.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{row.code} - {row.name}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">Rs. {row.amount.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-500">No income recorded</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Expense Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="font-semibold text-red-800 dark:text-red-300">Expense Accounts</h3>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {reportData.expense.length > 0 ? reportData.expense.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{row.code} - {row.name}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">Rs. {row.amount.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-500">No expenses recorded</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}