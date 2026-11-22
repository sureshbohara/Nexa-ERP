export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const CUSTOMER_INITIAL_VALUES = {
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    company_name: '',
    address: '',
    credit_limit: '',
    opening_balance: '',
    status: 'active',
};

export const mapCustomerToFormData = (customer) => ({
    name: customer?.name || '',
    code: customer?.code || '',
    contact_person: customer?.contact_person || '',
    phone: customer?.phone || '',
    alternate_phone: customer?.alternate_phone || '',
    email: customer?.email || '',
    company_name: customer?.company_name || '',
    address: customer?.address || '',
    credit_limit: customer?.credit_limit || '',
    opening_balance: customer?.opening_balance || '',
    status: customer?.status || 'active',
});