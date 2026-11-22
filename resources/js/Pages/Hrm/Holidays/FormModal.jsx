import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    mapHolidayToFormData,
    HOLIDAY_INITIAL_VALUES,
    STATUS_OPTIONS,
} from '@/Services/holidayService';

export default function HolidayFormModal({
    isOpen,
    onClose,
    editing,
    onSuccess,
}) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(HOLIDAY_INITIAL_VALUES);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(
            editing
                ? mapHolidayToFormData(editing)
                : { ...HOLIDAY_INITIAL_VALUES }
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
            ? route('hrm.holidays.update', editing.id)
            : route('hrm.holidays.store');

        const method = isEdit ? 'put' : 'post';

        const payload = {
            ...formData,
            is_recurring: Boolean(formData.is_recurring),
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
        setFormData({ ...HOLIDAY_INITIAL_VALUES });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Holiday' : 'Add Holiday'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    name="name"
                    label="Holiday Name"
                    value={formData.name}
                    onChange={(value) => handleChange('name', value)}
                    error={errors.name}
                    required
                    placeholder="e.g., Dashain"
                />

                <FormInput
                    name="date"
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(value) => handleChange('date', value)}
                    error={errors.date}
                    required
                />

                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="is_recurring"
                        checked={Boolean(formData.is_recurring)}
                        onChange={(e) =>
                            handleChange('is_recurring', e.target.checked)
                        }
                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />

                    <label
                        htmlFor="is_recurring"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Is Recurring (Yearly)?
                    </label>
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
