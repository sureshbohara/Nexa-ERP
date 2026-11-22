import { Head } from '@inertiajs/react';
import { FileBarChart, Building2, Scale, CheckCircle, AlertTriangle } from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';

export default function BalanceSheet({ reportData, totalAsset, totalLiabilityEquity }) {
    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Balance Sheet', href: route('accounting.reports.balance-sheet') },
    ];

    const isBalanced = Math.abs(totalAsset - totalLiabilityEquity) < 0.01;

    return (
        <AppLayout title="Balance Sheet">
            <Head title="Balance Sheet" />
            <div className="space-y-4">
                <Breadcrumb title="Accounting" subTitle="Balance Sheet" breadcrumbItems={breadcrumbItems} />

                <div className={`rounded-lg p-4 flex items-center gap-3 border ${isBalanced ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-red-50 dark:bg-red-900/20 border-red-200'}`}>
                    {isBalanced ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
                    <div>
                        <p className={`text-sm font-bold ${isBalanced ? 'text-emerald-800' : 'text-red-800'}`}>
                            {isBalanced ? 'Balance Sheet is Perfectly Balanced!' : 'Balance Sheet is NOT Balanced!'}
                        </p>
                        <p className={`text-xs ${isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
                            {isBalanced ? 'Total Assets equal Total Liabilities + Equity.' : `Difference: Rs. ${Math.abs(totalAsset - totalLiabilityEquity).toFixed(2)}`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Assets */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2"><Building2 className="w-4 h-4"/> Assets</h3>
                            <span className="font-bold text-blue-800 dark:text-blue-300">Rs. {totalAsset.toFixed(2)}</span>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {reportData.asset.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{row.code} - {row.name}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">Rs. {row.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Liabilities & Equity */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2"><Scale className="w-4 h-4"/> Liabilities & Equity</h3>
                            <span className="font-bold text-purple-800 dark:text-purple-300">Rs. {totalLiabilityEquity.toFixed(2)}</span>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {[...reportData.liability, ...reportData.equity].map((row, i) => (
                                    <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 ${row.code === 'NP' ? 'bg-yellow-50 dark:bg-yellow-900/10 font-semibold' : ''}`}>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{row.code} - {row.name}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">Rs. {row.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}