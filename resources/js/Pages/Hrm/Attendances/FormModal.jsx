import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    mapAttendanceToFormData,
    ATTENDANCE_INITIAL_VALUES,
    ATTENDANCE_STATUS_OPTIONS,
} from '@/Services/attendanceService';

export default function AttendanceFormModal({
    isOpen,
    onClose,
    editing,
    employees,
    onSuccess,
}) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(ATTENDANCE_INITIAL_VALUES);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(
            editing
                ? mapAttendanceToFormData(editing)
                : { ...ATTENDANCE_INITIAL_VALUES }
        );
        setErrors({});
    }, [editing, isOpen]);

     useEffect(() => {
        if (formData.check_in && formData.check_out) {
            const inParts = formData.check_in.split(':');
            const outParts = formData.check_out.split(':');
            
            if (inParts.length >= 2 && outParts.length >= 2) {
                const inMinutes = (parseInt(inParts[0]) * 60) + parseInt(inParts[1]);
                const outMinutes = (parseInt(outParts[0]) * 60) + parseInt(outParts[1]);
                const diff = outMinutes - inMinutes;
                
                if (diff > 0) {
                    const hours = (diff / 60).toFixed(2);
                    setFormData((prev) => ({ ...prev, working_hours: hours }));
                } else {
                    setFormData((prev) => ({ ...prev, working_hours: 0 }));
                }
            }
        }
    }, [formData.check_in, formData.check_out]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
  
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

        const url = isEdit
            ? route('hrm.attendances.update', editing.id)
            : route('hrm.attendances.store');

        const method = isEdit ? 'put' : 'post';

        router[method](url, formData, {
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
        setFormData({ ...ATTENDANCE_INITIAL_VALUES });
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

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Attendance' : 'Mark Attendance'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    name="employee_id"
                    label="Employee"
                    type="select"
                    value={formData.employee_id}
                    onChange={(value) => handleChange('employee_id', value)}
                    options={employeeOptions}
                    error={errors.employee_id}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="attendance_date"
                        label="Date"
                        type="date"
                        value={formData.attendance_date}
                        onChange={(value) => handleChange('attendance_date', value)}
                        error={errors.attendance_date}
                        required
                    />

                    <FormInput
                        name="status"
                        label="Status"
                        type="select"
                        value={formData.status}
                        onChange={(value) => handleChange('status', value)}
                        options={ATTENDANCE_STATUS_OPTIONS}
                        error={errors.status}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        name="check_in"
                        label="Check In"
                        type="time"
                        value={formData.check_in}
                        onChange={(value) => handleChange('check_in', value)}
                        error={errors.check_in}
                    />

                    <FormInput
                        name="check_out"
                        label="Check Out"
                        type="time"
                        value={formData.check_out}
                        onChange={(value) => handleChange('check_out', value)}
                        error={errors.check_out}
                    />

                    <FormInput
                        name="working_hours"
                        label="Working Hours"
                        type="number"
                        step="0.01"
                        value={formData.working_hours}
                        onChange={(value) => handleChange('working_hours', value)}
                        error={errors.working_hours}
                        placeholder="auto"
                    />
                </div>

                <FormInput
                    name="notes"
                    label="Notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={(value) => handleChange('notes', value)}
                    error={errors.notes}
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
                        {isEdit ? 'Update' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}