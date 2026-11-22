import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { CreditCard, Plus, Pencil, Trash2, Search, CheckCircle } from 'lucide-react';

export default function SubscriptionPaymentsIndex({ payments, subscriptions, invoices, gateways }) {
    const list = Array.isArray(payments) ? payments : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        organization_id: '', subscription_id: '', subscription_invoice_id: '', payment_gateway_id: '',
        amount: 0, currency: 'NPR', payment_method: 'cash', transaction_id: '', payment_date: new Date().toISOString().split('T')[0], status: 'pending', notes: ''
    });
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return list.filter(p => p.transaction_id?.toLowerCase().includes(term) || p.invoice?.invoice_no?.toLowerCase().includes(term));
    }, [list, search]);

    const handleOpen = (p = null) => {
        setEditing(p);
        setFormData(p ? {
            organization_id: p.organization_id, subscription_id: p.subscription_id, subscription_invoice_id: p.subscription_invoice_id || '',
            payment_gateway_id: p.payment_gateway_id || '', amount: p.amount, currency: p.currency, payment_method: p.payment_method,
            transaction_id: p.transaction_id || '', payment_date: p.payment_date, status: p.status, notes: p.notes || ''
        } : { organization_id: '', subscription_id: '', subscription_invoice_id: '', payment_gateway_id: '', amount: 0, currency: 'NPR', payment_method: 'cash', transaction_id: '', payment_date: new Date().toISOString().split('T')[0], status: 'pending', notes: '' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing ? route('saas.subscription-payments.update', editing.id) : route('saas.subscription-payments.store');
        const method = editing ? 'put' : 'post';
        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => setIsModalOpen(false),
            onError: (err) => setErrors(err),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this payment record?')) router.delete(route('saas.subscription-payments.destroy', id), { preserveScroll: true });
    };

    const handleVerify = (p) => {
        if (confirm('Mark this payment as verified (Paid)?')) {
            router.put(route('saas.subscription-payments.update', p.id), { ...p, status: 'paid' }, { preserveScroll: true });
        }
    };

    const invOptions = [{ value: '', label: '-- Select Invoice (Optional) --' }, ...(invoices || []).map(i => ({ value: String(i.id), label: `${i.invoice_no} (Due: Rs. ${(i.total_amount - i.paid_amount).toFixed(2)})` }))];
    const gatewayOptions = [{ value: '', label: '-- Select Gateway (Optional) --' }, ...(gateways || []).map(g => ({ value: String(g.id), label: g.name }))];
    const methodOptions = [{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'esewa', label: 'eSewa' }, { value: 'khalti', label: 'Khalti' }, { value: 'stripe', label: 'Stripe' }, { value: 'other', label: 'Other' }];
    const statusOptions = [{ value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }, { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' }];

    return (
        <AppLayout title="Subscription Payments">
            <Head title="Subscription Payments" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="SaaS Management" subTitle="Payments" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Payments', href: route('saas.subscription-payments.index') }]} />
                    <Button variant="primary" size="md" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-1.5" /> Record Payment</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search transaction ID or invoice..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Date</th>
                                <th className="table-th">Invoice</th>
                                <th className="table-th">Method / Gateway</th>
                                <th className="table-th">Transaction ID</th>
                                <th className="table-th text-right">Amount</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((p) => {
                                const statusColors = { pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800', failed: 'bg-red-100 text-red-800', refunded: 'bg-gray-100 text-gray-800' };
                                return (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td text-gray-600 dark:text-gray-300">{p.payment_date}</td>
                                        <td className="table-td font-medium text-gray-900 dark:text-white">{p.invoice?.invoice_no || 'N/A'}</td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{p.gateway?.name || p.payment_method}</td>
                                        <td className="table-td font-mono text-xs text-gray-500">{p.transaction_id || '—'}</td>
                                        <td className="table-td text-right font-semibold text-emerald-600">Rs. {parseFloat(p.amount || 0).toFixed(2)}</td>
                                        <td className="table-td"><span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColors[p.status] || 'bg-gray-100'}`}>{p.status}</span></td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                {p.status === 'pending' && (
                                                    <button onClick={() => handleVerify(p)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded border border-green-200 dark:border-green-800" title="Verify & Mark Paid"><CheckCircle className="w-3.5 h-3.5" /></button>
                                                )}
                                                <button onClick={() => handleOpen(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No payments found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Payment' : 'Record Payment'} size="md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="subscription_invoice_id" label="Link to Invoice" type="select" value={formData.subscription_invoice_id} onChange={(v) => setFormData({...formData, subscription_invoice_id: v})} options={invOptions} />
                        <FormInput name="payment_gateway_id" label="Payment Gateway" type="select" value={formData.payment_gateway_id} onChange={(v) => setFormData({...formData, payment_gateway_id: v})} options={gatewayOptions} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput name="amount" label="Amount" type="number" step="0.01" value={formData.amount} onChange={(v) => setFormData({...formData, amount: v})} error={errors.amount} required />
                        <FormInput name="currency" label="Currency" value={formData.currency} onChange={(v) => setFormData({...formData, currency: v})} required />
                        <FormInput name="payment_date" label="Payment Date" type="date" value={formData.payment_date} onChange={(v) => setFormData({...formData, payment_date: v})} error={errors.payment_date} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="payment_method" label="Payment Method" type="select" value={formData.payment_method} onChange={(v) => setFormData({...formData, payment_method: v})} options={methodOptions} required />
                        <FormInput name="status" label="Status" type="select" value={formData.status} onChange={(v) => setFormData({...formData, status: v})} options={statusOptions} required />
                    </div>
                    <FormInput name="transaction_id" label="Transaction ID / Reference" value={formData.transaction_id} onChange={(v) => setFormData({...formData, transaction_id: v})} />
                    <FormInput name="notes" label="Notes" type="textarea" rows={2} value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} />
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary"><CreditCard className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Record'}</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}