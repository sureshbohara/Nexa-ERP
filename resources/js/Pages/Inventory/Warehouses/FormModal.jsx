import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import { mapWarehouseToFormData } from '@/Services/warehouseService';

const initialFormData = {
    name: '',
    code: '',
    branch_id: '',
    address: '',
    manager_name: '',
    phone: '',
    email: '',
    status: 'active',
};

export default function WarehouseFormModal({
    isOpen,
    onClose,
    editing,
    branches,
    onSuccess,
}) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        if (editing) {
            const mapped = mapWarehouseToFormData(editing);
            setFormData(mapped);
        } else {
            setFormData({ ...initialFormData });
        }
        setErrors({});
    }, [editing, isOpen, branches]); 

    const branchOptions = [
        { value: '', label: '-- Select Branch --' },
        ...(branches || []).map((branch) => ({
            value: String(branch.id),
            label: branch.name,
        })),
    ];

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);

        const url = isEdit
            ? route('inventory.warehouses.update', editing.id)
            : route('inventory.warehouses.store');

        const payload = { ...formData };
        if (isEdit) {
            payload._method = 'PUT';
        }

        router.post(url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onSuccess();
            },
            onError: (validationErrors) => {
                setProcessing(false);
                setErrors(validationErrors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        setFormData({ ...initialFormData });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Warehouse' : 'Create Warehouse'}
            size="lg"
        >
         
            <form 
                key={editing?.id || 'new-warehouse'} 
                onSubmit={handleSubmit} 
                className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="name"
                        label="Warehouse Name"
                        value={formData.name}
                        onChange={(value) => handleChange('name', value)}
                        error={errors.name}
                        required
                        placeholder="e.g., Main Warehouse"
                    />
                    <FormInput
                        name="code"
                        label="Warehouse Code"
                        value={formData.code}
                        onChange={(value) => handleChange('code', value)}
                        error={errors.code}
                        required
                        placeholder="e.g., WH-001"
                    />
                    <FormInput
                        name="branch_id"
                        label="Branch"
                        type="select"
                        value={formData.branch_id}
                        onChange={(value) => handleChange('branch_id', value)}
                        error={errors.branch_id}
                        options={branchOptions}
                    />
                    <FormInput
                        name="manager_name"
                        label="Manager Name"
                        value={formData.manager_name}
                        onChange={(value) => handleChange('manager_name', value)}
                        error={errors.manager_name}
                        placeholder="e.g., Ram Bahadur"
                    />
                    <FormInput
                        name="phone"
                        label="Phone"
                        value={formData.phone}
                        onChange={(value) => handleChange('phone', value)}
                        error={errors.phone}
                        placeholder="98XXXXXXXX"
                    />
                    <FormInput
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(value) => handleChange('email', value)}
                        error={errors.email}
                        placeholder="warehouse@example.com"
                    />
                </div>

                <FormInput
                    name="address"
                    label="Address"
                    type="textarea"
                    value={formData.address}
                    onChange={(value) => handleChange('address', value)}
                    error={errors.address}
                    rows={2}
                />

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}