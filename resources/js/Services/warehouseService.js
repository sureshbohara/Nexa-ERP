export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const WAREHOUSE_INITIAL_VALUES = {
    name: '',
    code: '',
    branch_id: '',
    address: '',
    manager_name: '',
    phone: '',
    email: '',
    status: 'active',
};

export const mapWarehouseToFormData = (warehouse) => ({
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    branch_id: warehouse?.branch_id ? String(warehouse.branch_id) : '',
    address: warehouse?.address || '',
    manager_name: warehouse?.manager_name || '',
    phone: warehouse?.phone || '',
    email: warehouse?.email || '',
    status: warehouse?.status || 'active',
});