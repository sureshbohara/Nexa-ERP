import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { Package, Plus, Pencil, Trash2, Search, Star } from 'lucide-react';

export default function PlansIndex({ plans }) {
    const list = Array.isArray(plans) ? plans : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', price: 0, billing_cycle: 'monthly', features: '', is_active: true });
    const [errors, setErrors] = useState({});

    const filtered = list.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.code?.toLowerCase().includes(search.toLowerCase()));

    const handleOpen = (plan = null) => {
        setEditing(plan);
        setFormData(plan ? {
            name: plan.name, code: plan.code, price: plan.price, billing_cycle: plan.billing_cycle,
            features: typeof plan.features === 'object' ? JSON.stringify(plan.features, null, 2) : (plan.features || ''),
            is_active: plan.is_active
        } : { name: '', code: '', price: 0, billing_cycle: 'monthly', features: '', is_active: true });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleClose = () => { setIsModalOpen(false); setEditing(null); setErrors({}); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing ? route('plans.update', editing.id) : route('plans.store');
        const method = editing ? 'put' : 'post';
        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onError: (err) => setErrors(err),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete plan "${name}"?`)) router.delete(route('plans.destroy', id), { preserveScroll: true });
    };

    const handleStatus = (id, isActive) => {
        router.post(route('plans.status', id), { status: isActive ? 'inactive' : 'active' }, { preserveScroll: true });
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <AppLayout title="Plans">
            <Head title="Subscription Plans" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="SaaS Management" subTitle="Plans" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Plans', href: route('plans.index') }]} />
                    <Button variant="primary" size="md" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-1.5" /> Add Plan</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search plans..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Plan</th>
                                <th className="table-th">Code</th>
                                <th className="table-th text-right">Price</th>
                                <th className="table-th">Billing</th>
                                <th className="table-th text-center">Active Subs</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((plan) => (
                                <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Package className="w-4 h-4 text-emerald-600" /> {plan.name}
                                    </td>
                                    <td className="table-td font-mono text-xs text-gray-600 dark:text-gray-300 uppercase">{plan.code}</td>
                                    <td className="table-td text-right font-semibold text-emerald-600">{formatCurrency(plan.price)}</td>
                                    <td className="table-td capitalize">{plan.billing_cycle}</td>
                                    <td className="table-td text-center">{plan.subscriptions_count || 0}</td>
                                    <td className="table-td">
                                        <button onClick={() => handleStatus(plan.id, plan.is_active)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${plan.is_active ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${plan.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => handleOpen(plan)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(plan.id, plan.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No plans found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleClose} title={editing ? 'Edit Plan' : 'Add Plan'} size="md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="name" label="Plan Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} error={errors.name} required placeholder="e.g., Enterprise ERP" />
                        <FormInput name="code" label="Plan Code" value={formData.code} onChange={(v) => setFormData({...formData, code: v})} error={errors.code} required placeholder="e.g., ENTERPRISE" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="price" label="Price" type="number" step="0.01" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} error={errors.price} required />
                        <FormInput name="billing_cycle" label="Billing Cycle" type="select" value={formData.billing_cycle} onChange={(v) => setFormData({...formData, billing_cycle: v})} options={[{value:'monthly', label:'Monthly'}, {value:'yearly', label:'Yearly'}]} required />
                    </div>
                    <FormInput name="features" label="Features (JSON Format)" type="textarea" rows={4} value={formData.features} onChange={(v) => setFormData({...formData, features: v})} placeholder={'{"max_users": 50, "modules": ["inventory", "hrm"]}'} />
                    
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded" />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan is Active</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="primary"><Package className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}