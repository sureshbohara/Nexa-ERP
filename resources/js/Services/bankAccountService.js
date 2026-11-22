export const BANK_ACCOUNT_TYPES = [
    { value: 'current', label: 'Current' },
    { value: 'savings', label: 'Savings' },
    { value: 'fixed', label: 'Fixed Deposit' },
    { value: 'loan', label: 'Loan' },
];

export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const BANK_ACCOUNT_INITIAL_VALUES = {
    name: '',
    bank_name: '',
    account_number: '',
    account_type: 'current',
    branch_name: '',
    ifsc_code: '',
    account_id: '',
    opening_balance: '',
    status: 'active',
};

export const mapBankAccountToFormData = (acc) => ({
    name: acc?.name || '',
    bank_name: acc?.bank_name || '',
    account_number: acc?.account_number || '',
    account_type: acc?.account_type || 'current',
    branch_name: acc?.branch_name || '',
    ifsc_code: acc?.ifsc_code || '',
    account_id: acc?.account_id ? String(acc.account_id) : '',
    opening_balance: acc?.opening_balance || '',
    status: acc?.status || 'active',
});