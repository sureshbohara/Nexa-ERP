export const TRANSACTION_TYPES = [
    { value: 'deposit', label: 'Deposit (Money In)' },
    { value: 'withdrawal', label: 'Withdrawal (Money Out)' },
];

export const TRANSACTION_INITIAL_VALUES = {
    bank_account_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    type: 'deposit',
    amount: '',
    reference_no: '',
    description: '',
};

export const mapTransactionToFormData = (txn) => ({
    bank_account_id: txn?.bank_account_id ? String(txn.bank_account_id) : '',
    transaction_date: txn?.transaction_date ? String(txn.transaction_date).split('T')[0] : new Date().toISOString().split('T')[0],
    type: txn?.type || 'deposit',
    amount: txn?.amount || '',
    reference_no: txn?.reference_no || '',
    description: txn?.description || '',
});