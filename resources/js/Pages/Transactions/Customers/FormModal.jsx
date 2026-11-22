import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { mapCustomerToFormData } from '@/Services/customerService';

const INITIAL_VALUES = {
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    company_name: '',
    address: '',
    credit_limit: '',
    opening_balance: '',
    status: 'active',
};

export default function CustomerFormModal({ isOpen, onClose, editing, onSuccess }) {
    const isEdit = !!editing;
    
    const [formData, setFormData] = useState({ ...INITIAL_VALUES });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (editing) {
            setFormData(mapCustomerToFormData(editing));
        } else {
            setFormData({ ...INITIAL_VALUES });
        }
        setErrors({});
    }, [editing, isOpen]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        setErrors({});

        const url = isEdit
            ? route('transactions.customers.update', editing.id)
            : route('transactions.customers.store');

        const payload = { ...formData };
        if (isEdit) {
            payload._method = 'PUT';
        }

        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onSuccess();
            },
            onError: (validationErrors) => {
                setProcessing(false);
                setErrors(validationErrors);
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        setFormData({ ...INITIAL_VALUES });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Customer' : 'Create Customer'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="name"
                        label="Customer Name"
                        value={formData.name}
                        onChange={(v) => handleChange('name', v)}
                        error={errors.name}
                        required
                        placeholder="e.g., XYZ Pvt Ltd"
                    />
                    <FormInput
                        name="code"
                        label="Customer Code"
                        value={formData.code}
                        onChange={(v) => handleChange('code', v)}
                        error={errors.code}
                        required
                        placeholder="e.g., CUS-001"
                    />
                    <FormInput
                        name="contact_person"
                        label="Contact Person"
                        value={formData.contact_person}
                        onChange={(v) => handleChange('contact_person', v)}
                        error={errors.contact_person}
                        placeholder="Full Name"
                    />
                    <FormInput
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(v) => handleChange('phone', v)}
                        error={errors.phone}
                        required
                        placeholder="98XXXXXXXX"
                    />
                    <FormInput
                        name="alternate_phone"
                        label="Alternate Phone"
                        value={formData.alternate_phone}
                        onChange={(v) => handleChange('alternate_phone', v)}
                        error={errors.alternate_phone}
                        placeholder="98XXXXXXXX"
                    />
                    <FormInput
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(v) => handleChange('email', v)}
                        error={errors.email}
                        placeholder="customer@example.com"
                    />
                    <FormInput
                        name="company_name"
                        label="Company Name"
                        value={formData.company_name}
                        onChange={(v) => handleChange('company_name', v)}
                        error={errors.company_name}
                        placeholder="Registered Company Name"
                    />
                    <FormInput
                        name="credit_limit"
                        label="Credit Limit (Rs.)"
                        type="number"
                        value={formData.credit_limit}
                        onChange={(v) => handleChange('credit_limit', v)}
                        error={errors.credit_limit}
                        placeholder="0.00"
                    />
                    <FormInput
                        name="opening_balance"
                        label="Opening Balance (Rs.)"
                        type="number"
                        value={formData.opening_balance}
                        onChange={(v) => handleChange('opening_balance', v)}
                        error={errors.opening_balance}
                        placeholder="0.00"
                    />
                    <FormInput
                            name="address"
                            label="Address"
                            type="text"
                            value={formData.address}
                            onChange={(v) => handleChange('address', v)}
                            error={errors.address}
                            rows={2}
                            placeholder="Full address..."
                        />
                    
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                    >
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}