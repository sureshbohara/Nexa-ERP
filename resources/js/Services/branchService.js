export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const BRANCH_TYPE_OPTIONS = [
    { value: 'head_office', label: 'Head Office' },
    { value: 'branch', label: 'Branch' },
];

export const BRANCH_INITIAL_VALUES = {
    organization_id: '',
    name: '',
    code: '',
    branch_type: 'branch',
    manager_name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    province: '',
    district: '',
    municipality: '',
    ward_number: '',
    address: '',
    status: 'active',
};

export const mapBranchToFormData = (branch) => ({
    organization_id: branch?.organization_id || '',
    name: branch?.name || '',
    code: branch?.code || '',
    branch_type: branch?.branch_type || 'branch',
    manager_name: branch?.manager_name || '',
    phone: branch?.phone || '',
    alternate_phone: branch?.alternate_phone || '',
    email: branch?.email || '',
    province: branch?.province || '',
    district: branch?.district || '',
    municipality: branch?.municipality || '',
    ward_number: branch?.ward_number || '',
    address: branch?.address || '',
    status: branch?.status || 'active',
});