import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    mapLeaveTypeToFormData,
    LEAVE_TYPE_INITIAL_VALUES,
    STATUS_OPTIONS,
} from '@/Services/leaveTypeService';

export default function LeaveTypeFormModal({
    isOpen,
    onClose,
    editing,
    onSuccess,
}) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(LEAVE_TYPE_INITIAL_VALUES);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setFormData(
            editing
                ? mapLeaveTypeToFormData(editing)
                : { ...LEAVE_TYPE_INITIAL_VALUES }
        );

        setErrors({});
    }, [editing, isOpen]);


    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

 
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEdit
            ? route('hrm.leave-types.update', editing.id)
            : route('hrm.leave-types.store');

        const method = isEdit ? 'put' : 'post';

        const payload = {
            ...formData,
            is_paid: Boolean(formData.is_paid),
            is_carried_forward: Boolean(formData.is_carried_forward),
        };

        router[method](url, payload, {
            preserveScroll: true,

            onSuccess: () => {
                onSuccess();
            },

            onError: (validationErrors) => {
                setErrors(validationErrors);
            },
        });
    };


    const handleClose = () => {
        setFormData({ ...LEAVE_TYPE_INITIAL_VALUES });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Leave Type' : 'Add Leave Type'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="name"
                        label="Leave Type Name"
                        value={formData.name}
                        onChange={(value) => handleChange('name', value)}
                        error={errors.name}
                        required
                        placeholder="e.g., Annual Leave"
                    />

                    <FormInput
                        name="code"
                        label="Code"
                        value={formData.code}
                        onChange={(value) => handleChange('code', value)}
                        error={errors.code}
                        required
                        placeholder="e.g., AL"
                    />
                </div>

           
                <FormInput
                    name="days_allowed"
                    label="Days Allowed"
                    type="number"
                    value={formData.days_allowed}
                    onChange={(value) => handleChange('days_allowed', value)}
                    error={errors.days_allowed}
                    required
                />

        
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_paid"
                            checked={Boolean(formData.is_paid)}
                            onChange={(e) =>
                                handleChange('is_paid', e.target.checked)
                            }
                            className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />

                        <label
                            htmlFor="is_paid"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Is Paid Leave?
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_carried_forward"
                            checked={Boolean(formData.is_carried_forward)}
                            onChange={(e) =>
                                handleChange('is_carried_forward', e.target.checked)
                            }
                            className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />

                        <label
                            htmlFor="is_carried_forward"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Carry Forward?
                        </label>
                    </div>
                </div>

            
                <FormInput
                    name="description"
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(value) => handleChange('description', value)}
                    error={errors.description}
                    rows={2}
                />

      
         
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" variant="primary">
                        <Save className="w-4 h-4 mr-1.5" />
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
