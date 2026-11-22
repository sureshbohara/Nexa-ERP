import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, Upload, X } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { EXPENSE_INITIAL_VALUES, mapExpenseToFormData, EXPENSE_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/Services/expenseService';

export default function ExpenseFormModal({ isOpen, onClose, editing, accounts, branches, onSuccess }) {
    const isEdit = !!editing;
    const [fileName, setFileName] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapExpenseToFormData(editing) : EXPENSE_INITIAL_VALUES
    );

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editing) {
                const mapped = mapExpenseToFormData(editing);
                Object.keys(mapped).forEach(key => setData(key, mapped[key]));
                setFileName(editing.reference_document ? editing.reference_document.split('/').pop() : '');
            } else {
                reset();
                setFileName('');
            }
        }
    }, [isOpen, isEdit, editing]);

    useEffect(() => {
        const amount = parseFloat(data.amount) || 0;
        const tax = parseFloat(data.tax_amount) || 0;
        setData('total_amount', (amount + tax).toFixed(2));
    }, [data.amount, data.tax_amount]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('reference_document', file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        const url = isEdit ? route('accounting.expenses.update', editing.id) : route('accounting.expenses.store');
        const method = isEdit ? put : post;

        method(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setFileName('');
                if (onSuccess) onSuccess();
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        reset();
        setFileName('');
        onClose();
    };

    if (!isOpen) return null;

    const accountOptions = [{ value: '', label: '-- Select Expense Account --' }, ...accounts.map(a => ({ value: String(a.id), label: `${a.name} (${a.code})` }))];
    const branchOptions = [{ value: '', label: '-- Select Branch (Optional) --' }, ...branches.map(b => ({ value: String(b.id), label: b.name }))];
    
    // 👇 Payment Account Options (Only Asset type accounts like Cash/Bank)
    const paymentAccountOptions = [
        { value: '', label: '-- Select Payment Account (Cash/Bank) --' },
        ...accounts.filter(a => a.type === 'asset').map(a => ({ value: String(a.id), label: `${a.name} (${a.code})` }))
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Expense' : 'Add Expense'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="account_id" label="Expense Account" type="select" value={data.account_id} onChange={(v) => setData('account_id', v)} error={errors.account_id} options={accountOptions} required />
                    <FormInput name="branch_id" label="Branch" type="select" value={data.branch_id} onChange={(v) => setData('branch_id', v)} error={errors.branch_id} options={branchOptions} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="reference_no" label="Reference No" value={data.reference_no} onChange={(v) => setData('reference_no', v)} error={errors.reference_no} required placeholder="e.g., EXP-001" />
                    <FormInput name="expense_date" label="Expense Date" type="date" value={data.expense_date} onChange={(v) => setData('expense_date', v)} error={errors.expense_date} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput name="amount" label="Amount (Rs.)" type="number" value={data.amount} onChange={(v) => setData('amount', v)} error={errors.amount} required placeholder="0.00" />
                    <FormInput name="tax_amount" label="Tax Amount (Rs.)" type="number" value={data.tax_amount} onChange={(v) => setData('tax_amount', v)} error={errors.tax_amount} placeholder="0.00" />
                    <FormInput name="total_amount" label="Total Amount (Rs.)" type="number" value={data.total_amount} disabled className="bg-gray-100 dark:bg-slate-800 cursor-not-allowed" />
                </div>

                {/* 👇 Payment Account Dropdown Added Here */}
                <FormInput 
                    name="payment_account_id" 
                    label="Paid From (Account)" 
                    type="select" 
                    value={data.payment_account_id || ''} 
                    onChange={(v) => setData('payment_account_id', v)} 
                    error={errors.payment_account_id} 
                    options={paymentAccountOptions} 
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="payment_method" label="Payment Method" type="select" value={data.payment_method} onChange={(v) => setData('payment_method', v)} error={errors.payment_method} options={PAYMENT_METHOD_OPTIONS} required />
                    {!isEdit && (
                        <FormInput name="status" label="Status" type="select" value={data.status} onChange={(v) => setData('status', v)} error={errors.status} options={EXPENSE_STATUS_OPTIONS} required />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt / Document (Optional)</label>
                    <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                            <Upload className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{fileName || 'Choose PDF, JPG, or PNG'}</span>
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                        </label>
                        {fileName && (
                            <button type="button" onClick={() => { setData('reference_document', null); setFileName(''); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {errors.reference_document && <p className="text-xs text-red-500 mt-1">{errors.reference_document}</p>}
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                </div>

                <FormInput name="description" label="Description" type="textarea" value={data.description} onChange={(v) => setData('description', v)} error={errors.description} rows={2} placeholder="Purpose of expense..." />

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Save Expense')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}