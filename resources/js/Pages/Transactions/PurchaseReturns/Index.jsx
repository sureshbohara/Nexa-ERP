import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, RefreshCcw, Eye, Trash2 } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';

export default function PurchaseReturnsIndex({ returns }) {
    const [search, setSearch] = useState('');
    const returnList = Array.isArray(returns) ? returns : [];

    const breadcrumbItems = [
        { label: 'Transactions', href: '#' },
        { label: 'Purchase Returns', href: route('transactions.purchase-returns.index') },
    ];

    const filteredReturns = returnList.filter((r) => {
        const term = search.toLowerCase();
        return r.reference_no?.toLowerCase().includes(term) || r.supplier?.name?.toLowerCase().includes(term);
    });

    const handleDelete = (id, refNo) => {
        if (confirm(`Delete Purchase Return ${refNo}?`)) {
            router.delete(route('transactions.purchase-returns.destroy', id), { preserveScroll: true });
        }
    };

    const handleStatus = (id, currentStatus) => {
        let nextStatus = 'pending';
        if (currentStatus === 'pending') nextStatus = 'completed';
        else if (currentStatus === 'completed') nextStatus = 'cancelled';
        
        router.post(
            route('transactions.purchase-returns.status', id),
            { status: nextStatus },
            { preserveScroll: true }
        );
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <AppLayout title="Purchase Returns">
            <Head title="Purchase Returns" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Transactions" subTitle="Purchase Returns" breadcrumbItems={breadcrumbItems} />
                    <Link href={route('transactions.purchase-returns.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Return
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Reference No or Supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Reference No</th>
                                    <th className="table-th">Supplier</th>
                                    <th className="table-th">Original Purchase</th>
                                    <th className="table-th">Return Date</th>
                                    <th className="table-th">Total Amount</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredReturns.length > 0 ? (
                                    filteredReturns.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td font-mono text-sm text-gray-900 dark:text-white">{r.reference_no}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300">{r.supplier?.name || '-'}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300">{r.purchase?.reference_no || '-'}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300">{r.return_date}</td>
                                            <td className="table-td font-semibold text-gray-900 dark:text-white">Rs. {Number(r.total_amount || 0).toFixed(2)}</td>
                                            
                                            {/* 👇 Clickable Status Badge */}
                                            <td className="table-td">
                                                <button
                                                    onClick={() => handleStatus(r.id, r.status)}
                                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${statusColors[r.status] || 'bg-gray-100 text-gray-800'}`}
                                                    title="Click to change status (Pending → Completed → Cancelled)"
                                                >
                                                    {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                                </button>
                                            </td>

                                            <td className="table-td text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('transactions.purchase-returns.edit', r.id)}>
                                                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(r.id, r.reference_no)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <RefreshCcw className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No purchase returns found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}