export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const BRAND_INITIAL_VALUES = {
    name: '',
    code: '',
    description: '',
    logo: null,
    status: 'active',
};

export const mapBrandToFormData = (brand) => ({
    name: brand?.name || '',
    code: brand?.code || '',
    description: brand?.description || '',
    logo: null,
    status: brand?.status || 'active',
});
