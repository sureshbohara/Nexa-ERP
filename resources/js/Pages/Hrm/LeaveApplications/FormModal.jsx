import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    mapLeaveAppToFormData,
    LEAVE_APP_INITIAL_VALUES,
    LEAVE_APP_STATUS_OPTIONS,
} from '@/Services/leaveApplicationService';

export default function LeaveAppFormModal({ isOpen, onClose, editing, employees, leaveTypes, onSuccess }) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(LEAVE_APP_INITIAL_VALUES);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(editing ? mapLeaveAppToFormData(editing) : { ...LEAVE_APP_INITIAL_VALUES });
        setErrors({});
    }, [editing, isOpen]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('hrm.leave-applications.update', editing.id) : route('hrm.leave-applications.store');
        const method = isEdit ? 'put' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => onSuccess(),
            onError: (validationErrors) => setErrors(validationErrors),
        });
    };

    const handleClose = () => {
        setFormData({ ...LEAVE_APP_INITIAL_VALUES });
        setErrors({});
        onClose();
    };

    const employeeOptions = [
        { value: '', label: '-- Select Employee --' },
        ...(employees ?? []).map((employee) => {
            const firstName = employee.user?.first_name || '';
            const lastName = employee.user?.last_name || '';
            const name = `${firstName} ${lastName}`.trim();
            const displayName = name || employee.employee_code || `Employee #${employee.id}`;
            
            return {
                value: String(employee.id),
                label: `${displayName} (${employee.employee_code || 'N/A'})`,
            };
        }),
    ];

    const leaveTypeOptions = [
        { value: '', label: '-- Select Leave Type --' },
        ...(leaveTypes ?? []).map((lt) => ({
            value: String(lt.id),
            label: lt.name,
        })),
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Leave Application' : 'Apply for Leave'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput name="employee_id" label="Employee" type="select" value={formData.employee_id} onChange={(value) => handleChange('employee_id', value)} options={employeeOptions} error={errors.employee_id} required />
                <FormInput name="leave_type_id" label="Leave Type" type="select" value={formData.leave_type_id} onChange={(value) => handleChange('leave_type_id', value)} options={leaveTypeOptions} error={errors.leave_type_id} required />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={(value) => handleChange('start_date', value)} error={errors.start_date} required />
                    <FormInput name="end_date" label="End Date" type="date" value={formData.end_date} onChange={(value) => handleChange('end_date', value)} error={errors.end_date} required />
                </div>

                <FormInput name="reason" label="Reason for Leave" type="textarea" value={formData.reason} onChange={(value) => handleChange('reason', value)} error={errors.reason} required rows={3} />

                {!isEdit && (
                    <FormInput name="status" label="Status" type="select" value={formData.status} onChange={(value) => handleChange('status', value)} options={LEAVE_APP_STATUS_OPTIONS} error={errors.status} required />
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        <Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Update' : 'Submit'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}