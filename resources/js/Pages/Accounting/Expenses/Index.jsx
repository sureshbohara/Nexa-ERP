import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, DollarSign, Pencil, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import ExpenseFormModal from './FormModal';

export default function ExpensesIndex({ expenses, accounts, branches }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const expenseList = Array.isArray(expenses) ? expenses : [];

    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Expenses', href: route('accounting.expenses.index') },
    ];

    const filtered = expenseList.filter((e) =>
        e.reference_no?.toLowerCase().includes(search.toLowerCase()) ||
        e.account?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(route('accounting.expenses.destroy', id), { preserveScroll: true });
        }
    };

    const handleStatus = (id, status) => {
        const url = status === 'approved' ? 'accounting.expenses.approve' : 'accounting.expenses.reject';
        router.post(route(url, id), {}, { preserveScroll: true });
    };

    const handleEdit = (exp) => { setEditing(exp); setIsModalOpen(true); };
    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <AppLayout title="Expenses">
            <Head title="Expenses" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Accounting" subTitle="Expenses" breadcrumbItems={breadcrumbItems} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Expense
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by reference no or account..."
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
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Reference</th>
                                    <th className="table-th">Account</th>
                                    <th className="table-th">Payment Method</th>
                                    <th className="table-th text-right">Amount</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.length > 0 ? (
                                    filtered.map((e) => (
                                        <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td text-gray-600 dark:text-gray-300">{e.expense_date}</td>
                                            <td className="table-td font-medium text-gray-900 dark:text-white">
                                                {e.reference_no}
                                                {e.reference_document && (
                                                    <a href={`/storage/${e.reference_document}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline text-xs inline-flex items-center gap-1">
                                                        <FileText className="w-3 h-3" /> Receipt
                                                    </a>
                                                )}
                                            </td>
                                            <td className="table-td text-gray-600 dark:text-gray-300 text-sm">{e.account?.name}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300 capitalize">{e.payment_method?.replace('_', ' ')}</td>
                                            <td className="table-td text-right font-semibold text-gray-900 dark:text-white">
                                                Rs. {Number(e.total_amount || 0).toFixed(2)}
                                            </td>
                                            <td className="table-td">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[e.status] || 'bg-gray-100'}`}>
                                                    {e.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="table-td text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {e.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleStatus(e.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-green-200 dark:border-green-800" title="Approve">
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleStatus(e.id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800" title="Reject">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(e.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No expenses found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ExpenseFormModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                editing={editing} 
                accounts={accounts}
                branches={branches}
                onSuccess={handleSuccess} 
            />
        </AppLayout>
    );
}