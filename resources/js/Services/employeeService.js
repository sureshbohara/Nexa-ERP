export const EMPLOYEE_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'resigned', label: 'Resigned' },
];

export const EMPLOYEE_INITIAL_VALUES = {
    user_id: '',
    employee_code: '',
    department_id: '',
    branch_id: '',
    salary_structure_id: '',
    designation: '',
    date_of_joining: '',
    status: 'active',
};

export const mapEmployeeToFormData = (emp) => ({
    user_id: emp?.user_id ? String(emp.user_id) : '',
    employee_code: emp?.employee_code || '',
    department_id: emp?.department_id ? String(emp.department_id) : '',
    branch_id: emp?.branch_id ? String(emp.branch_id) : '',
    salary_structure_id: emp?.salary_structure_id ? String(emp.salary_structure_id) : '',
    designation: emp?.designation || '',
    date_of_joining: emp?.date_of_joining ? String(emp.date_of_joining).split('T')[0] : '',
    status: emp?.status || 'active',
});