import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { 
    BANK_ACCOUNT_INITIAL_VALUES, 
    mapBankAccountToFormData, 
    BANK_ACCOUNT_TYPES, 
    STATUS_OPTIONS 
} from '@/Services/bankAccountService';

export default function BankAccountFormModal({ isOpen, onClose, editing, onSuccess }) {
    const isEdit = !!editing;

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapBankAccountToFormData(editing) : BANK_ACCOUNT_INITIAL_VALUES
    );

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editing) {
                const mapped = mapBankAccountToFormData(editing);
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
            ? route('accounting.bank-accounts.update', editing.id) 
            : route('accounting.bank-accounts.store');
        
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

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Bank Account' : 'Create Bank Account'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="name"
                        label="Account Name (e.g., Main Business Account)"
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        error={errors.name}
                        required
                        placeholder="e.g., Main Business Account"
                    />
                    <FormInput
                        name="bank_name"
                        label="Bank Name"
                        value={data.bank_name}
                        onChange={(v) => setData('bank_name', v)}
                        error={errors.bank_name}
                        required
                        placeholder="e.g., Nabil Bank"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="account_number"
                        label="Account Number"
                        value={data.account_number}
                        onChange={(v) => setData('account_number', v)}
                        error={errors.account_number}
                        required
                        placeholder="e.g., 0123456789"
                    />
                    <FormInput
                        name="account_type"
                        label="Account Type"
                        type="select"
                        value={data.account_type}
                        onChange={(v) => setData('account_type', v)}
                        error={errors.account_type}
                        options={BANK_ACCOUNT_TYPES}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="branch_name"
                        label="Branch Name"
                        value={data.branch_name}
                        onChange={(v) => setData('branch_name', v)}
                        error={errors.branch_name}
                        placeholder="e.g., Kathmandu Branch"
                    />
                    <FormInput
                        name="ifsc_code"
                        label="IFSC / Swift Code"
                        value={data.ifsc_code}
                        onChange={(v) => setData('ifsc_code', v)}
                        error={errors.ifsc_code}
                        placeholder="e.g., NABILNPKA"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="opening_balance"
                        label="Opening Balance (Rs.)"
                        type="number"
                        value={data.opening_balance}
                        onChange={(v) => setData('opening_balance', v)}
                        error={errors.opening_balance}
                        placeholder="0.00"
                    />
                  
                        <FormInput
                            name="status"
                            label="Status"
                            type="select"
                            value={data.status}
                            onChange={(v) => setData('status', v)}
                            error={errors.status}
                            options={STATUS_OPTIONS}
                            required
                        />
                
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}