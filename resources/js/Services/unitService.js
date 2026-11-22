export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const UNIT_INITIAL_VALUES = {
    name: '',
    code: '',
    description: '',
    status: 'active',
};

export const mapUnitToFormData = (unit) => ({
    name: unit?.name || '',
    code: unit?.code || '',
    description: unit?.description || '',
    status: unit?.status || 'active',
});