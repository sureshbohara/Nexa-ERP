import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, Landmark, Pencil, Trash2 } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import BankAccountFormModal from './FormModal';

export default function BankAccountsIndex({ bankAccounts }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const list = Array.isArray(bankAccounts) ? bankAccounts : [];

    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Bank Accounts', href: route('accounting.bank-accounts.index') },
    ];

    const filtered = list.filter((a) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
        a.account_number?.includes(search)
    );

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(route('accounting.bank-accounts.destroy', id), { preserveScroll: true });
        }
    };

    const handleStatus = (id, status) => {
        router.post(
            route('accounting.bank-accounts.status', id),
            { status: status === 'active' ? 'inactive' : 'active' },
            { preserveScroll: true }
        );
    };

    const handleEdit = (acc) => { setEditing(acc); setIsModalOpen(true); };
    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const typeColors = {
        current: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        savings: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        fixed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        loan: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <AppLayout title="Bank Accounts">
            <Head title="Bank Accounts" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Accounting" subTitle="Bank Accounts" breadcrumbItems={breadcrumbItems} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Create Bank Account
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by bank name, account name, or number..."
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
                                    <th className="table-th">Account Name</th>
                                    <th className="table-th">Bank Name</th>
                                    <th className="table-th">Account Number</th>
                                    <th className="table-th">Type</th>
                                    <th className="table-th">Opening Balance</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.length > 0 ? (
                                    filtered.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td font-medium text-gray-900 dark:text-white">{a.name}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300">{a.bank_name}</td>
                                            <td className="table-td font-mono text-sm text-gray-600 dark:text-gray-300">{a.account_number}</td>
                                            <td className="table-td">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[a.account_type] || 'bg-gray-100'}`}>
                                                    {a.account_type?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="table-td font-semibold text-gray-900 dark:text-white">
                                                Rs. {Number(a.opening_balance || 0).toFixed(2)}
                                            </td>
                                            <td className="table-td">
                                                <button
                                                    onClick={() => handleStatus(a.id, a.status)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        a.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${a.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="table-td text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => handleEdit(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(a.id, a.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <Landmark className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No bank accounts found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <BankAccountFormModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                editing={editing} 
                onSuccess={handleSuccess} 
            />
        </AppLayout>
    );
}