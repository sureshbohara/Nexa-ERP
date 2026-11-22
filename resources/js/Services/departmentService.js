export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const DEPARTMENT_INITIAL_VALUES = {
    name: '', code: '', description: '', head_user_id: '', status: 'active',
};

export const mapDepartmentToFormData = (dept) => ({
    name: dept?.name || '',
    code: dept?.code || '',
    description: dept?.description || '',
    head_user_id: dept?.head_user_id ? String(dept.head_user_id) : '',
    status: dept?.status || 'active',
});