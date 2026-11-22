import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import DepartmentFormModal from './FormModal';
import { Building2, Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function DepartmentsIndex({ departments, users }) {
    const list = Array.isArray(departments) ? departments : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const filtered = list.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.code?.toLowerCase().includes(search.toLowerCase()));

    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleEdit = (dept) => { setEditing(dept); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const handleDelete = (id, name) => {
        if (confirm(`Delete "${name}"?`)) router.delete(route('hrm.departments.destroy', id), { preserveScroll: true });
    };

    const handleStatus = (id, status) => {
        router.post(route('hrm.departments.status', id), { status: status === 'active' ? 'inactive' : 'active' }, { preserveScroll: true });
    };

    return (
        <AppLayout title="Departments">
            <Head title="Department Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="HRM" subTitle="Departments" breadcrumbItems={[{ label: 'HRM', href: '#' }, { label: 'Departments', href: route('hrm.departments.index') }]} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Create Department
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search department..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Code</th>
                                    <th className="table-th">Name</th>
                                    <th className="table-th">Head</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td font-mono text-gray-600 dark:text-gray-300">{d.code}</td>
                                        <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-emerald-600" /> {d.name}
                                        </td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{d.head ? `${d.head.first_name} ${d.head.last_name}` : '-'}</td>
                                        <td className="table-td">
                                            <button onClick={() => handleStatus(d.id, d.status)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${d.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${d.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button onClick={() => handleEdit(d)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(d.id, d.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No departments found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <DepartmentFormModal isOpen={isModalOpen} onClose={handleClose} editing={editing} users={users} onSuccess={handleSuccess} />
        </AppLayout>
    );
}