export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const SUPPLIER_INITIAL_VALUES = {
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    company_name: '',
    address: '',
    opening_balance: '',
    status: 'active',
};

export const mapSupplierToFormData = (supplier) => ({
    name: supplier?.name || '',
    code: supplier?.code || '',
    contact_person: supplier?.contact_person || '',
    phone: supplier?.phone || '',
    alternate_phone: supplier?.alternate_phone || '',
    email: supplier?.email || '',
    company_name: supplier?.company_name || '',
    address: supplier?.address || '',
    opening_balance: supplier?.opening_balance || '',
    status: supplier?.status || 'active',
});