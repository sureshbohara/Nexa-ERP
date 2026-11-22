import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, ArrowLeftRight, Trash2, Pencil } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import BankTransactionFormModal from './FormModal';

export default function BankTransactionsIndex({ transactions, bankAccounts }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const txnList = Array.isArray(transactions) ? transactions : [];
    const accountsList = Array.isArray(bankAccounts) ? bankAccounts : [];

    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Bank Transactions', href: route('accounting.bank-transactions.index') },
    ];

    const filtered = txnList.filter((t) =>
        t.reference_no?.toLowerCase().includes(search.toLowerCase()) ||
        t.bank_account?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure? This will reverse the bank account balance.')) {
            router.delete(route('accounting.bank-transactions.destroy', id), { preserveScroll: true });
        }
    };

    const handleEdit = (txn) => {
        setEditing(txn);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditing(null);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    return (
        <AppLayout title="Bank Transactions">
            <Head title="Bank Transactions" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Accounting" subTitle="Bank Transactions" breadcrumbItems={breadcrumbItems} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Transaction
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by reference no or bank account..."
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
                                    <th className="table-th">Bank Account</th>
                                    <th className="table-th">Type</th>
                                    <th className="table-th">Reference</th>
                                    <th className="table-th text-right">Amount</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.length > 0 ? (
                                    filtered.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td text-gray-600 dark:text-gray-300">{t.transaction_date}</td>
                                            <td className="table-td font-medium text-gray-900 dark:text-white">
                                                {t.bank_account?.name}
                                                <div className="text-xs text-gray-500">{t.bank_account?.account_number}</div>
                                            </td>
                                            <td className="table-td">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    t.type === 'deposit' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                    {t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                                </span>
                                            </td>
                                            <td className="table-td text-gray-600 dark:text-gray-300 text-sm">{t.reference_no || '-'}</td>
                                            <td className={`table-td text-right font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'deposit' ? '+' : '-'} Rs. {Number(t.amount || 0).toFixed(2)}
                                            </td>
                                            <td className="table-td text-right">
                                                <div className="flex items-center justify-end gap-1">
                                             
                                                    <button onClick={() => handleEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <ArrowLeftRight className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        
            <BankTransactionFormModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                editing={editing}
                bankAccounts={accountsList}
                onSuccess={handleSuccess} 
            />
        </AppLayout>
    );
}