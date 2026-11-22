import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import WarehouseFormModal from './FormModal';
import { Warehouse as WarehouseIcon, Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function WarehousesIndex({ warehouses, branches }) {
    const list = Array.isArray(warehouses) ? warehouses : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        { label: 'Warehouses', href: route('inventory.warehouses.index') },
    ];

    const filtered = list.filter(w => w.name?.toLowerCase().includes(search.toLowerCase()));

    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleEdit = (warehouse) => { setEditing(warehouse); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const handleDelete = (id, name) => {
        if (confirm(`Delete "${name}"?`)) {
            router.delete(route('inventory.warehouses.destroy', id), { preserveScroll: true });
        }
    };

    const handleStatus = (id, status) => {
        router.post(route('inventory.warehouses.status', id), {
            status: status === 'active' ? 'inactive' : 'active'
        }, { preserveScroll: true });
    };

    return (
        <AppLayout title="Warehouses">
            <Head title="Warehouse Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Inventory" subTitle="Warehouse List" breadcrumbItems={breadcrumbItems} />
                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" /> Create Warehouse
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Name</th>
                                    <th className="table-th">Branch</th>
                                    <th className="table-th">Manager</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((w) => (
                                    <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <WarehouseIcon className="w-4 h-4 text-emerald-600" />
                                            <div>
                                                <div>{w.name}</div>
                                                <div className="text-xs text-gray-500">{w.code}</div>
                                            </div>
                                        </td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{w.branch?.name || '-'}</td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{w.manager_name || '-'}</td>
                                        <td className="table-td">
                                            <button onClick={() => handleStatus(w.id, w.status)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${w.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${w.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button onClick={() => handleEdit(w)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(w.id, w.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No warehouses found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <WarehouseFormModal isOpen={isModalOpen} onClose={handleClose} editing={editing} branches={branches} onSuccess={handleSuccess} />
        </AppLayout>
    );
}