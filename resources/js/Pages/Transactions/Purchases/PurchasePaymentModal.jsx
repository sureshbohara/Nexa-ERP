import { useForm } from '@inertiajs/react';
import { Save, Loader2, Wallet, History } from 'lucide-react';
import { useState } from 'react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

const PAYMENT_METHOD_OPTIONS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
    { value: 'other', label: 'Other' },
];

export default function PurchasePaymentModal({ isOpen, onClose, purchase, onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_method: 'cash',
        reference_no: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [showHistory, setShowHistory] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!purchase?.id) return;

        post(route('transactions.purchases.payment', purchase.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        reset();
        setShowHistory(false);
        onClose();
    };

    if (!isOpen || !purchase) return null;

    const totalAmount = Number(purchase.total_amount || 0);
    const paidAmount = Number(purchase.paid_amount || 0);
    const dueAmount = Math.max(0, totalAmount - paidAmount);
    
  
    const payments = purchase.payments || [];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add Payment" size="lg"> 
            <form onSubmit={handleSubmit} className="space-y-4">
                
              
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                <span className="font-medium">Supplier:</span> {purchase.supplier?.name || '-'}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                                <span className="font-medium">Reference:</span> {purchase.reference_no}
                            </p>
                            <div className="flex gap-4 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                                <div>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500">Total</p>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        Rs. {totalAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500">Paid</p>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        Rs. {paidAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-red-600 dark:text-red-400">Due</p>
                                    <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                        Rs. {dueAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              
                {payments.length > 0 && (
                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            <span className="flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Payment History ({payments.length})
                            </span>
                            <span className="text-xs text-gray-500">
                                {showHistory ? 'Hide' : 'Show'}
                            </span>
                        </button>

                        {showHistory && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Date</th>
                                            <th className="px-4 py-2">Method</th>
                                            <th className="px-4 py-2">Reference</th>
                                            <th className="px-4 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                        {payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                    {new Date(p.payment_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 capitalize">
                                                    {p.payment_method.replace('_', ' ')}
                                                </td>
                                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                                    {p.reference_no || '-'}
                                                </td>
                                                <td className="px-4 py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Rs. {Number(p.amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

     
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <FormInput
                        name="amount"
                        label="Payment Amount (Rs.)"
                        type="number"
                        value={data.amount}
                        onChange={(v) => setData('amount', v)}
                        error={errors.amount}
                        required
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                    />

                    <FormInput
                        name="payment_method"
                        label="Payment Method"
                        type="select"
                        value={data.payment_method}
                        onChange={(v) => setData('payment_method', v)}
                        error={errors.payment_method}
                        options={PAYMENT_METHOD_OPTIONS}
                        required
                    />

                    <FormInput
                        name="reference_no"
                        label="Reference / Cheque No"
                        value={data.reference_no}
                        onChange={(v) => setData('reference_no', v)}
                        error={errors.reference_no}
                        placeholder="Optional"
                    />

                    <FormInput
                        name="payment_date"
                        label="Payment Date"
                        type="date"
                        value={data.payment_date}
                        onChange={(v) => setData('payment_date', v)}
                        error={errors.payment_date}
                        required
                    />
                </div>

                <FormInput
                    name="notes"
                    label="Notes"
                    type="textarea"
                    value={data.notes}
                    onChange={(v) => setData('notes', v)}
                    error={errors.notes}
                    rows={2}
                    placeholder="Optional notes..."
                />

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? (
                            <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-1.5" /> Save Payment</>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}