import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { Briefcase, Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function SubscriptionsIndex({ subscriptions, organizations, plans }) {
    const list = Array.isArray(subscriptions) ? subscriptions : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ organization_id: '', plan_id: '', start_date: '', end_date: '', status: 'trial' });
    const [errors, setErrors] = useState({});

    const filtered = list.filter(s => s.organization?.name?.toLowerCase().includes(search.toLowerCase()) || s.plan?.name?.toLowerCase().includes(search.toLowerCase()));

    const handleOpen = (sub = null) => {
        setEditing(sub);
        setFormData(sub ? {
            organization_id: String(sub.organization_id),
            plan_id: String(sub.plan_id),
            start_date: sub.start_date,
            end_date: sub.end_date,
            status: sub.status
        } : { organization_id: '', plan_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '', status: 'trial' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleClose = () => { setIsModalOpen(false); setEditing(null); setErrors({}); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing ? route('subscriptions.update', editing.id) : route('subscriptions.store');
        const method = editing ? 'put' : 'post';
        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onError: (err) => setErrors(err),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this subscription?')) router.delete(route('subscriptions.destroy', id), { preserveScroll: true });
    };

    const handleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'cancelled' : 'active';
        if (confirm(`Change status to ${newStatus}?`)) {
            router.post(route('subscriptions.status', id), { status: newStatus }, { preserveScroll: true });
        }
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '—';
    const statusColors = { active: 'bg-green-100 text-green-800', expired: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800', trial: 'bg-blue-100 text-blue-800' };

    const orgOptions = [{ value: '', label: '-- Select Organization --' }, ...(organizations || []).map(o => ({ value: String(o.id), label: o.name }))];
    const planOptions = [{ value: '', label: '-- Select Plan --' }, ...(plans || []).map(p => ({ value: String(p.id), label: `${p.name} (Rs. ${p.price}/${p.billing_cycle})` }))];
    const statusOptions = [{ value: 'active', label: 'Active' }, { value: 'trial', label: 'Trial' }, { value: 'expired', label: 'Expired' }, { value: 'cancelled', label: 'Cancelled' }];

    return (
        <AppLayout title="Subscriptions">
            <Head title="Subscriptions" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="SaaS Management" subTitle="Subscriptions" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Subscriptions', href: route('subscriptions.index') }]} />
                    <Button variant="primary" size="md" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-1.5" /> Add Subscription</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by org or plan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Organization</th>
                                <th className="table-th">Plan</th>
                                <th className="table-th">Duration</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-emerald-600" /> {sub.organization?.name || 'N/A'}
                                    </td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">{sub.plan?.name || 'N/A'}</td>
                                    <td className="table-td text-xs text-gray-600 dark:text-gray-300">{formatDate(sub.start_date)} → {formatDate(sub.end_date)}</td>
                                    <td className="table-td">
                                        <button onClick={() => handleStatus(sub.id, sub.status)} className={`px-2 py-1 text-xs rounded-full capitalize ${statusColors[sub.status] || 'bg-gray-100'}`}>
                                            {sub.status}
                                        </button>
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => handleOpen(sub)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No subscriptions found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleClose} title={editing ? 'Edit Subscription' : 'Add Subscription'} size="md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput name="organization_id" label="Organization" type="select" value={formData.organization_id} onChange={(v) => setFormData({...formData, organization_id: v})} options={orgOptions} error={errors.organization_id} required />
                    <FormInput name="plan_id" label="Plan" type="select" value={formData.plan_id} onChange={(v) => setFormData({...formData, plan_id: v})} options={planOptions} error={errors.plan_id} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={(v) => setFormData({...formData, start_date: v})} error={errors.start_date} required />
                        <FormInput name="end_date" label="End Date" type="date" value={formData.end_date} onChange={(v) => setFormData({...formData, end_date: v})} error={errors.end_date} required />
                    </div>
                    <FormInput name="status" label="Status" type="select" value={formData.status} onChange={(v) => setFormData({...formData, status: v})} options={statusOptions} required />

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="primary"><Briefcase className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}