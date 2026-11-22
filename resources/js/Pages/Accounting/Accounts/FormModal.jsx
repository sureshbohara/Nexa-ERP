import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { 
    ACCOUNT_INITIAL_VALUES, 
    mapAccountToFormData, 
    ACCOUNT_TYPES, 
    STATUS_OPTIONS 
} from '@/Services/accountService';

export default function AccountFormModal({ isOpen, onClose, editing, accounts, onSuccess }) {
    const isEdit = !!editing;

    // 👇 Custom Hook हटाएर सिधै useForm प्रयोग गरियो (Brand Modal जस्तै)
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapAccountToFormData(editing) : ACCOUNT_INITIAL_VALUES
    );

    // Modal खुल्दा वा Edit गर्दा Data Reset/Load गर्ने
    useEffect(() => {
        if (isOpen) {
            if (isEdit && editing) {
                const mapped = mapAccountToFormData(editing);
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
            ? route('accounting.accounts.update', editing.id) 
            : route('accounting.accounts.store');
        
        const method = isEdit ? put : post;

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                // 👇 यहीँले Parent Component लाई Modal बन्द गर्न भन्छ
                if (onSuccess) onSuccess();
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        reset();
        onClose();
    };

    // Circular reference रोक्न current account लाई parent options बाट हटाउने
    const parentOptions = [
        { value: '', label: 'None (Root Account)' },
        ...(accounts || [])
            .filter(a => !isEdit || a.id !== editing?.id)
            .map(a => ({ value: String(a.id), label: `${a.name} (${a.code})` }))
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Account' : 'Create Account'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="code"
                        label="Account Code"
                        value={data.code}
                        onChange={(v) => setData('code', v)}
                        error={errors.code}
                        required
                        placeholder="e.g., 1001"
                    />
                    <FormInput
                        name="name"
                        label="Account Name"
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        error={errors.name}
                        required
                        placeholder="e.g., Cash in Hand"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="type"
                        label="Account Type"
                        type="select"
                        value={data.type}
                        onChange={(v) => setData('type', v)}
                        error={errors.type}
                        options={ACCOUNT_TYPES}
                        required
                    />
                    <FormInput
                        name="parent_id"
                        label="Parent Account"
                        type="select"
                        value={data.parent_id}
                        onChange={(v) => setData('parent_id', v)}
                        error={errors.parent_id}
                        options={parentOptions}
                    />
                </div>

                <FormInput
                    name="sub_type"
                    label="Sub Type (Optional)"
                    value={data.sub_type}
                    onChange={(v) => setData('sub_type', v)}
                    error={errors.sub_type}
                    placeholder="e.g., Current Asset"
                />

                <FormInput
                    name="description"
                    label="Description"
                    type="textarea"
                    value={data.description}
                    onChange={(v) => setData('description', v)}
                    error={errors.description}
                    rows={2}
                    placeholder="Brief description of the account..."
                />

                {!isEdit && (
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
                )}

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