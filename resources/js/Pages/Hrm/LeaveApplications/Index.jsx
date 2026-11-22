import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import LeaveAppFormModal from './FormModal';
import { CalendarDays, Plus, Pencil, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

export default function LeaveApplicationsIndex({ applications, employees, leaveTypes }) {
    const list = Array.isArray(applications) ? applications : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const filtered = list.filter(a => 
        a.employee?.user?.first_name?.toLowerCase().includes(search.toLowerCase()) || 
        a.leave_type?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleEdit = (a) => { setEditing(a); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const handleDelete = (id) => {
        if (confirm('Delete this leave application?')) {
            router.delete(route('hrm.leave-applications.destroy', id), { preserveScroll: true });
        }
    };

    const handleApprove = (id) => {
        if (confirm('Approve this leave application?')) {
            router.post(route('hrm.leave-applications.approve', id), {}, { preserveScroll: true });
        }
    };

    const handleReject = (id) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            router.post(route('hrm.leave-applications.reject', id), { rejection_reason: reason }, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Leave Applications">
            <Head title="Leave Application Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="HRM" subTitle="Leave Applications" breadcrumbItems={[
                        { label: 'HRM', href: '#' }, 
                        { label: 'Leave Applications', href: route('hrm.leave-applications.index') }
                    ]} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Apply for Leave
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by employee or leave type..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Employee</th>
                                <th className="table-th">Leave Type</th>
                                <th className="table-th">Dates</th>
                                <th className="table-th text-right">Days</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-emerald-600" /> {a.employee?.user?.first_name} {a.employee?.user?.last_name}
                                    </td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">{a.leave_type?.name}</td>
                                    <td className="table-td text-gray-600 dark:text-gray-300 text-sm">{a.start_date} to {a.end_date}</td>
                                    <td className="table-td text-right font-medium text-gray-900 dark:text-white">{a.total_days}</td>
                                    <td className="table-td">
                                        <span className={`px-2 py-1 text-xs rounded-full ${a.status === 'approved' ? 'bg-green-100 text-green-800' : a.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {a.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            {a.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(a.id)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-green-200 dark:border-green-800" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleReject(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                                                </>
                                            )}
                                            <button onClick={() => handleEdit(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No leave applications found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <LeaveAppFormModal isOpen={isModalOpen} onClose={handleClose} editing={editing} employees={employees} leaveTypes={leaveTypes} onSuccess={handleSuccess} />
        </AppLayout>
    );
}