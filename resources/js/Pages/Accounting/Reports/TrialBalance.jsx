import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { FileBarChart, Search, Download, CheckCircle, AlertTriangle } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';

export default function TrialBalance({ reportData, grandTotalDebit, grandTotalCredit }) {
    const [search, setSearch] = useState('');

    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Trial Balance', href: route('accounting.reports.trial-balance') },
    ];

    const filteredData = reportData.filter((row) =>
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.code?.toLowerCase().includes(search.toLowerCase())
    );

    const isBalanced = Math.abs(grandTotalDebit - grandTotalCredit) < 0.01;

    const typeLabels = {
        asset: 'Asset',
        liability: 'Liability',
        equity: 'Equity',
        income: 'Income',
        expense: 'Expense',
    };

    return (
        <AppLayout title="Trial Balance">
            <Head title="Trial Balance" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Accounting" subTitle="Trial Balance" breadcrumbItems={breadcrumbItems} />
                    <Button variant="secondary" size="md">
                        <Download className="w-4 h-4 mr-1.5" /> Export to Excel
                    </Button>
                </div>

            
                <div className={`rounded-lg p-4 flex items-center gap-3 border ${
                    isBalanced 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                    {isBalanced ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <div>
                        <p className={`text-sm font-bold ${isBalanced ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isBalanced ? 'Trial Balance is Perfectly Balanced!' : 'Trial Balance is NOT Balanced!'}
                        </p>
                        <p className={`text-xs mt-1 ${isBalanced ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {isBalanced 
                                ? 'Total Debit and Total Credit match exactly.' 
                                : `Difference: Rs. ${Math.abs(grandTotalDebit - grandTotalCredit).toFixed(2)}. Please check your posted journal entries.`
                            }
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by account name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th text-left w-24">Code</th>
                                    <th className="table-th text-left">Account Name</th>
                                    <th className="table-th text-left w-32">Type</th>
                                    <th className="table-th text-right w-40">Debit (Rs.)</th>
                                    <th className="table-th text-right w-40">Credit (Rs.)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredData.length > 0 ? (
                                    filteredData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td font-mono text-gray-600 dark:text-gray-300">{row.code}</td>
                                            <td className="table-td font-medium text-gray-900 dark:text-white">{row.name}</td>
                                            <td className="table-td">
                                                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                                                    {typeLabels[row.type] || row.type}
                                                </span>
                                            </td>
                                            <td className="table-td text-right font-medium text-gray-900 dark:text-white">
                                                {row.debit > 0 ? row.debit.toFixed(2) : '-'}
                                            </td>
                                            <td className="table-td text-right font-medium text-gray-900 dark:text-white">
                                                {row.credit > 0 ? row.credit.toFixed(2) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FileBarChart className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No posted journal entries found to generate a report.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-slate-900 font-bold border-t-2 border-gray-300 dark:border-slate-600">
                                <tr>
                                    <td colSpan="3" className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                        GRAND TOTAL:
                                    </td>
                                    <td className={`px-4 py-3 text-right ${!isBalanced ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {grandTotalDebit.toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-3 text-right ${!isBalanced ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {grandTotalCredit.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}