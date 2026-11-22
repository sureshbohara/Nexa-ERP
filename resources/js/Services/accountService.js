export const ACCOUNT_TYPES = [
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
];

export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const ACCOUNT_INITIAL_VALUES = {
    code: '',
    name: '',
    type: 'asset',
    sub_type: '',
    parent_id: '',
    description: '',
    status: 'active',
};

export const mapAccountToFormData = (account) => ({
    code: account?.code || '',
    name: account?.name || '',
    type: account?.type || 'asset',
    sub_type: account?.sub_type || '',
    parent_id: account?.parent_id ? String(account.parent_id) : '',
    description: account?.description || '',
    status: account?.status || 'active',
});