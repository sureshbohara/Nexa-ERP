import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { CreditCard, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { GATEWAY_INITIAL_VALUES, mapGatewayToFormData } from '@/Services/gatewayService';

export default function PaymentGatewaysIndex({ gateways }) {
    const list = Array.isArray(gateways) ? gateways : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(GATEWAY_INITIAL_VALUES);
    const [errors, setErrors] = useState({});

    const filtered = list.filter(g => g.name?.toLowerCase().includes(search.toLowerCase()));

    const handleOpen = (g = null) => {
        setEditing(g);
        setFormData(g ? mapGatewayToFormData(g) : GATEWAY_INITIAL_VALUES);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing ? route('saas.payment-gateways.update', editing.id) : route('saas.payment-gateways.store');
        const method = editing ? 'put' : 'post';
        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => { setIsModalOpen(false); },
            onError: (err) => setErrors(err),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete "${name}"?`)) router.delete(route('saas.payment-gateways.destroy', id), { preserveScroll: true });
    };

    const handleStatus = (id, isActive) => {
        router.post(route('saas.payment-gateways.status', id), { status: isActive ? 'inactive' : 'active' }, { preserveScroll: true });
    };

    return (
        <AppLayout title="Payment Gateways">
            <Head title="Payment Gateways" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="SaaS Management" subTitle="Payment Gateways" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Gateways', href: route('saas.payment-gateways.index') }]} />
                    <Button variant="primary" size="md" onClick={() => handleOpen()}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Gateway
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search gateway..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Name</th>
                                <th className="table-th">Code</th>
                                <th className="table-th">Mode</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((g) => (
                                <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-emerald-600" /> {g.name}
                                    </td>
                                    <td className="table-td text-gray-600 dark:text-gray-300 uppercase">{g.code}</td>
                                    <td className="table-td">
                                        <span className={`px-2 py-1 text-xs rounded-full ${g.is_test_mode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {g.is_test_mode ? 'Test' : 'Live'}
                                        </span>
                                    </td>
                                    <td className="table-td">
                                        <button onClick={() => handleStatus(g.id, g.is_active)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${g.is_active ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${g.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => handleOpen(g)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(g.id, g.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No gateways found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Gateway' : 'Add Gateway'} size="md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput name="name" label="Gateway Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} error={errors.name} required placeholder="e.g., eSewa" />
                        <FormInput name="code" label="Code" value={formData.code} onChange={(v) => setFormData({...formData, code: v})} error={errors.code} required placeholder="e.g., esewa" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput name="sort_order" label="Sort Order" type="number" value={formData.sort_order} onChange={(v) => setFormData({...formData, sort_order: v})} />
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" id="is_test_mode" checked={formData.is_test_mode} onChange={(e) => setFormData({...formData, is_test_mode: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded" />
                            <label htmlFor="is_test_mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Mode</label>
                        </div>
                    </div>
                    {/* Credentials JSON Textarea can be added here if needed */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary"><CreditCard className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}