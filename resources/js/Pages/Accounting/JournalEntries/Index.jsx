import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, FileText, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import JournalEntryFormModal from './FormModal';

export default function JournalEntriesIndex({ journalEntries, accounts }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const entryList = Array.isArray(journalEntries) ? journalEntries : [];

    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'Journal Entries', href: route('accounting.journal-entries.index') },
    ];

    const filtered = entryList.filter((e) =>
        e.reference_no?.toLowerCase().includes(search.toLowerCase()) ||
        e.notes?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure? Posted entries cannot be deleted.')) {
            router.delete(route('accounting.journal-entries.destroy', id), { preserveScroll: true });
        }
    };

    const handleAction = (id, action) => {
        router.post(route(`accounting.journal-entries.${action}`, id), {}, { preserveScroll: true });
    };

    const handleEdit = (entry) => { setEditing(entry); setIsModalOpen(true); };
    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        posted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <AppLayout title="Journal Entries">
            <Head title="Journal Entries" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Accounting" subTitle="Journal Entries" breadcrumbItems={breadcrumbItems} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Journal Entry
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by reference no or notes..."
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
                                    <th className="table-th">Total Debit</th>
                                    <th className="table-th">Total Credit</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.length > 0 ? (
                                    filtered.map((e) => (
                                        <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="table-td text-gray-600 dark:text-gray-300">{e.entry_date}</td>
                                            <td className="table-td font-medium text-gray-900 dark:text-white">{e.reference_no}</td>
                                            <td className="table-td font-semibold text-gray-900 dark:text-white">Rs. {Number(e.total_debit || 0).toFixed(2)}</td>
                                            <td className="table-td font-semibold text-gray-900 dark:text-white">Rs. {Number(e.total_credit || 0).toFixed(2)}</td>
                                            <td className="table-td">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[e.status] || 'bg-gray-100'}`}>
                                                    {e.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="table-td text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {e.status === 'draft' && (
                                                        <>
                                                            <button onClick={() => handleAction(e.id, 'post')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-green-200 dark:border-green-800" title="Post">
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleAction(e.id, 'cancel')} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800" title="Cancel">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleEdit(e)} disabled={e.status === 'posted'} className={`p-1.5 rounded border ${e.status === 'posted' ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(e.id)} disabled={e.status === 'posted'} className={`p-1.5 rounded border ${e.status === 'posted' ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No journal entries found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <JournalEntryFormModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                editing={editing} 
                accounts={accounts}
                onSuccess={handleSuccess} 
            />
        </AppLayout>
    );
}