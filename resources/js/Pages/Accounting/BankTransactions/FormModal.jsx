import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { 
    TRANSACTION_INITIAL_VALUES, 
    mapTransactionToFormData, 
    TRANSACTION_TYPES 
} from '@/Services/bankTransactionService';

export default function BankTransactionFormModal({ isOpen, onClose, editing, bankAccounts, onSuccess }) {
    const isEdit = !!editing;

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapTransactionToFormData(editing) : TRANSACTION_INITIAL_VALUES
    );

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editing) {
                const mapped = mapTransactionToFormData(editing);
                Object.keys(mapped).forEach(key => setData(key, mapped[key]));
            } else {
                reset();
            }
        }
    }, [isOpen, isEdit, editing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        const url = isEdit 
            ? route('accounting.bank-transactions.update', editing.id) 
            : route('accounting.bank-transactions.store');
        
        const method = isEdit ? put : post;

        method(url, {
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
        onClose();
    };

    if (!isOpen) return null;

    const accountOptions = [
        { value: '', label: '-- Select Bank Account --' },
        ...bankAccounts.map(a => ({ 
            value: String(a.id), 
            label: `${a.name} (${a.account_number}) - Balance: Rs. ${Number(a.current_balance || 0).toFixed(2)}` 
        }))
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Transaction' : 'Add Bank Transaction'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    name="bank_account_id"
                    label="Bank Account"
                    type="select"
                    value={data.bank_account_id}
                    onChange={(v) => setData('bank_account_id', v)}
                    error={errors.bank_account_id}
                    options={accountOptions}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="type"
                        label="Transaction Type"
                        type="select"
                        value={data.type}
                        onChange={(v) => setData('type', v)}
                        error={errors.type}
                        options={TRANSACTION_TYPES}
                        required
                    />
                    <FormInput
                        name="transaction_date"
                        label="Transaction Date"
                        type="date"
                        value={data.transaction_date}
                        onChange={(v) => setData('transaction_date', v)}
                        error={errors.transaction_date}
                        required
                    />
                </div>

                <FormInput
                    name="amount"
                    label="Amount (Rs.)"
                    type="number"
                    value={data.amount}
                    onChange={(v) => setData('amount', v)}
                    error={errors.amount}
                    required
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
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
                    name="description"
                    label="Description"
                    type="textarea"
                    value={data.description}
                    onChange={(v) => setData('description', v)}
                    error={errors.description}
                    rows={2}
                    placeholder="Purpose of transaction..."
                />

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Save Transaction')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}