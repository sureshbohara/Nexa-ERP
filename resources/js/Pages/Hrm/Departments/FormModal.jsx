import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { Save } from 'lucide-react';
import { mapDepartmentToFormData, DEPARTMENT_INITIAL_VALUES } from '@/Services/departmentService';

export default function DepartmentFormModal({ isOpen, onClose, editing, users, onSuccess }) {
    const isEdit = !!editing;
    const [formData, setFormData] = useState(DEPARTMENT_INITIAL_VALUES);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editing) setFormData(mapDepartmentToFormData(editing));
        else setFormData(DEPARTMENT_INITIAL_VALUES);
        setErrors({});
    }, [editing, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('hrm.departments.update', editing.id) : route('hrm.departments.store');
        const method = isEdit ? 'put' : 'post';

        const payload = {
            ...formData,
            head_user_id: formData.head_user_id === '' ? null : formData.head_user_id,
        };

        router[method](url, payload, {
            preserveScroll: true,
            onSuccess: () => onSuccess(),
            onError: (err) => setErrors(err),
        });
    };

    const handleClose = () => {
        setFormData(DEPARTMENT_INITIAL_VALUES);
        setErrors({});
        onClose();
    };

    const userOptions = [{ value: '', label: '-- Select Head --' }, ...(users || []).map(u => ({ value: String(u.id), label: `${u.first_name} ${u.last_name}` }))];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Department' : 'Create Department'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="name" label="Department Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required placeholder="e.g., Human Resources" />
                    <FormInput name="code" label="Department Code" value={formData.code} onChange={(v) => setFormData({ ...formData, code: v })} error={errors.code} required placeholder="e.g., HR" />
                </div>
                
                <FormInput name="head_user_id" label="Department Head" type="select" value={formData.head_user_id} onChange={(v) => setFormData({ ...formData, head_user_id: v })} options={userOptions} />
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