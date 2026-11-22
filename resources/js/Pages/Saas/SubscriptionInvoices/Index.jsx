import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { FileText, Plus, Pencil, Trash2, Search, Download } from 'lucide-react';

export default function SubscriptionInvoicesIndex({ invoices, organizations, subscriptions }) {
    const list = Array.isArray(invoices) ? invoices : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        organization_id: '', subscription_id: '', invoice_no: '', invoice_date: '',
        due_date: '', subtotal: 0, tax_amount: 0, discount_amount: 0, total_amount: 0, status: 'unpaid', notes: ''
    });
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return list.filter(inv => inv.invoice_no?.toLowerCase().includes(term) || inv.organization?.name?.toLowerCase().includes(term));
    }, [list, search]);

    const handleOpen = (inv = null) => {
        setEditing(inv);
        setFormData(inv ? {
            organization_id: inv.organization_id, subscription_id: inv.subscription_id, invoice_no: inv.invoice_no,
            invoice_date: inv.invoice_date, due_date: inv.due_date, subtotal: inv.subtotal, tax_amount: inv.tax_amount,
            discount_amount: inv.discount_amount, total_amount: inv.total_amount, status: inv.status, notes: inv.notes || ''
        } : { organization_id: '', subscription_id: '', invoice_no: '', invoice_date: new Date().toISOString().split('T')[0],
              due_date: new Date().toISOString().split('T')[0], subtotal: 0, tax_amount: 0, discount_amount: 0, total_amount: 0, status: 'unpaid', notes: '' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing ? route('saas.subscription-invoices.update', editing.id) : route('saas.subscription-invoices.store');
        const method = editing ? 'put' : 'post';
        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => setIsModalOpen(false),
            onError: (err) => setErrors(err),
        });
    };

    const handleDelete = (id, no) => {
        if (confirm(`Delete invoice ${no}?`)) router.delete(route('saas.subscription-invoices.destroy', id), { preserveScroll: true });
    };

    const orgOptions = [{ value: '', label: '-- Select Organization --' }, ...(organizations || []).map(o => ({ value: String(o.id), label: o.name }))];
    const subOptions = [{ value: '', label: '-- Select Subscription --' }, ...(subscriptions || []).map(s => ({ value: String(s.id), label: s.plan_name || `Sub #${s.id}` }))];
    const statusOptions = [{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }, { value: 'void', label: 'Void' }];

    return (
        <AppLayout title="Subscription Invoices">
            <Head title="Subscription Invoices" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="SaaS Management" subTitle="Invoices" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Invoices', href: route('saas.subscription-invoices.index') }]} />
                    <Button variant="primary" size="md" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-1.5" /> Create Invoice</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search invoice no or organization..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Invoice No</th>
                                <th className="table-th">Organization</th>
                                <th className="table-th text-right">Total</th>
                                <th className="table-th text-right">Paid</th>
                                <th className="table-th text-right">Due</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((inv) => {
                                const due = (parseFloat(inv.total_amount || 0) - parseFloat(inv.paid_amount || 0)).toFixed(2);
                                const statusColors = { unpaid: 'bg-red-100 text-red-800', partial: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800', void: 'bg-gray-100 text-gray-800' };
                                return (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> {inv.invoice_no}</td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{inv.organization?.name || 'N/A'}</td>
                                        <td className="table-td text-right">Rs. {parseFloat(inv.total_amount || 0).toFixed(2)}</td>
                                        <td className="table-td text-right text-green-600">Rs. {parseFloat(inv.paid_amount || 0).toFixed(2)}</td>
                                        <td className="table-td text-right font-semibold text-red-600">Rs. {due}</td>
                                        <td className="table-td"><span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColors[inv.status] || 'bg-gray-100'}`}>{inv.status}</span></td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <a href={route('saas.subscription-invoices.pdf', inv.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800" title="Download PDF"><Download className="w-3.5 h-3.5" /></a>
                                                <button onClick={() => handleOpen(inv)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(inv.id, inv.invoice_no)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No invoices found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Invoice' : 'Create Invoice'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="organization_id" label="Organization" type="select" value={formData.organization_id} onChange={(v) => setFormData({...formData, organization_id: v})} options={orgOptions} error={errors.organization_id} required />
                        <FormInput name="subscription_id" label="Subscription" type="select" value={formData.subscription_id} onChange={(v) => setFormData({...formData, subscription_id: v})} options={subOptions} error={errors.subscription_id} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput name="invoice_no" label="Invoice No" value={formData.invoice_no} onChange={(v) => setFormData({...formData, invoice_no: v})} error={errors.invoice_no} required />
                        <FormInput name="invoice_date" label="Invoice Date" type="date" value={formData.invoice_date} onChange={(v) => setFormData({...formData, invoice_date: v})} error={errors.invoice_date} required />
                        <FormInput name="due_date" label="Due Date" type="date" value={formData.due_date} onChange={(v) => setFormData({...formData, due_date: v})} error={errors.due_date} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormInput name="subtotal" label="Subtotal" type="number" step="0.01" value={formData.subtotal} onChange={(v) => setFormData({...formData, subtotal: v})} error={errors.subtotal} required />
                        <FormInput name="tax_amount" label="Tax" type="number" step="0.01" value={formData.tax_amount} onChange={(v) => setFormData({...formData, tax_amount: v})} />
                        <FormInput name="discount_amount" label="Discount" type="number" step="0.01" value={formData.discount_amount} onChange={(v) => setFormData({...formData, discount_amount: v})} />
                        <FormInput name="total_amount" label="Total Amount" type="number" step="0.01" value={formData.total_amount} onChange={(v) => setFormData({...formData, total_amount: v})} error={errors.total_amount} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="status" label="Status" type="select" value={formData.status} onChange={(v) => setFormData({...formData, status: v})} options={statusOptions} required />
                        <FormInput name="notes" label="Notes" type="textarea" rows={2} value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary"><FileText className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}