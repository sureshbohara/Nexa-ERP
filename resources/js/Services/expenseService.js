export const EXPENSE_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export const PAYMENT_METHOD_OPTIONS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
    { value: 'other', label: 'Other' },
];

export const EXPENSE_INITIAL_VALUES = {
    account_id: '',
    branch_id: '',
    reference_no: '',
    expense_date: new Date().toISOString().split('T')[0],
    amount: '',
    tax_amount: '',
    total_amount: '',
    payment_method: 'cash',
    reference_document: null,
    description: '',
    status: 'pending',
};

export const mapExpenseToFormData = (exp) => ({
    account_id: exp?.account_id ? String(exp.account_id) : '',
    branch_id: exp?.branch_id ? String(exp.branch_id) : '',
    reference_no: exp?.reference_no || '',
    expense_date: exp?.expense_date ? String(exp.expense_date).split('T')[0] : new Date().toISOString().split('T')[0],
    amount: exp?.amount || '',
    tax_amount: exp?.tax_amount || '',
    total_amount: exp?.total_amount || '',
    payment_method: exp?.payment_method || 'cash',
    reference_document: null, // File reset on edit
    description: exp?.description || '',
    status: exp?.status || 'pending',
    existing_document: exp?.reference_document || null,
});