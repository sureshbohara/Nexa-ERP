import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    mapEmployeeToFormData,
    EMPLOYEE_INITIAL_VALUES,
} from '@/Services/employeeService';

export default function EmployeeFormModal({
    isOpen,
    onClose,
    editing,
    users,
    departments,
    branches,
    salaryStructures,
    onSuccess,
}) {
    const isEdit = Boolean(editing);

    const [formData, setFormData] = useState(
        EMPLOYEE_INITIAL_VALUES
    );

    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (editing) {
            setFormData(mapEmployeeToFormData(editing));
        } else {
            setFormData({ ...EMPLOYEE_INITIAL_VALUES });
        }

        setErrors({});
    }, [editing, isOpen]);

 
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setFormData({ ...EMPLOYEE_INITIAL_VALUES });
        setErrors({});
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEdit
            ? route('hrm.employees.update', editing.id)
            : route('hrm.employees.store');

        const method = isEdit ? 'put' : 'post';

        const payload = {
            ...formData,
            department_id: formData.department_id || null,
            branch_id: formData.branch_id || null,
            salary_structure_id: formData.salary_structure_id || null,
        };

        router[method](url, payload, {
            preserveScroll: true,

            onSuccess: () => {
                onSuccess();
            },

            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

 
    const userOptions = [
        {
            value: '',
            label: '-- Select User --',
        },
        ...(users || []).map((user) => ({
            value: String(user.id),
            label: `${user.first_name} ${user.last_name} (${user.email})`,
        })),
    ];

    const deptOptions = [
        {
            value: '',
            label: '-- Select Department --',
        },
        ...(departments || []).map((department) => ({
            value: String(department.id),
            label: department.name,
        })),
    ];

    const branchOptions = [
        {
            value: '',
            label: '-- Select Branch --',
        },
        ...(branches || []).map((branch) => ({
            value: String(branch.id),
            label: branch.name,
        })),
    ];

    const salaryOptions = [
        {
            value: '',
            label: '-- Select Salary Structure --',
        },
        ...(salaryStructures || []).map((salary) => ({
            value: String(salary.id),
            label: salary.name,
        })),
    ];

    if (!isOpen) {
        return null;
    }


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Employee' : 'Add Employee'}
            size="lg"
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
     

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="user_id"
                        label="Linked User"
                        type="select"
                        value={formData.user_id}
                        onChange={(value) => handleChange('user_id', value)}
                        options={userOptions}
                        required
                    />

                    <FormInput
                        name="employee_code"
                        label="Employee Code"
                        value={formData.employee_code}
                        onChange={(value) => handleChange('employee_code', value)}
                        error={errors.employee_code}
                        placeholder="e.g., EMP-001"
                        required
                    />
                </div>

          

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="department_id"
                        label="Department"
                        type="select"
                        value={formData.department_id}
                        onChange={(value) => handleChange('department_id', value)}
                        options={deptOptions}
                    />

                    <FormInput
                        name="branch_id"
                        label="Branch"
                        type="select"
                        value={formData.branch_id}
                        onChange={(value) => handleChange('branch_id', value)}
                        options={branchOptions}
                    />
                </div>

      

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        name="designation"
                        label="Designation"
                        value={formData.designation}
                        onChange={(value) => handleChange('designation', value)}
                        placeholder="e.g., Software Engineer"
                    />

                    <FormInput
                        name="salary_structure_id"
                        label="Salary Structure"
                        type="select"
                        value={formData.salary_structure_id}
                        onChange={(value) => handleChange('salary_structure_id', value)}
                        options={salaryOptions}
                    />
                </div>

              

                <FormInput
                    name="date_of_joining"
                    label="Date of Joining"
                    type="date"
                    value={formData.date_of_joining}
                    onChange={(value) => handleChange('date_of_joining', value)}
                />

          

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                    >
                        <Save className="w-4 h-4 mr-1.5" />

                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
