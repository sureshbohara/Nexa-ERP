import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { Save } from 'lucide-react';
import { mapUnitToFormData } from '@/Services/unitService';

export default function UnitFormModal({ isOpen, onClose, editing, onSuccess }) {
    const isEdit = !!editing;
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'active',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editing) {
            setFormData(mapUnitToFormData(editing));
        } else {
            setFormData({
                name: '',
                code: '',
                description: '',
                status: 'active',
            });
        }
        setErrors({});
    }, [editing, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('inventory.units.update', editing.id) : route('inventory.units.store');
        const method = isEdit ? 'put' : 'post';

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
            },
            onError: (err) => {
                setErrors(err);
            },
        };

        router[method](url, formData, options);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            code: '',
            description: '',
            status: 'active',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Unit' : 'Create Unit'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="name" label="Unit Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required placeholder="e.g., Kilogram" />
                    <FormInput name="code" label="Unit Code" value={formData.code} onChange={(v) => setFormData({ ...formData, code: v })} error={errors.code} required placeholder="e.g., KG" />
                </div>

                <FormInput name="description" label="Description" type="textarea" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} error={errors.description} rows={2} />


                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        <Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}