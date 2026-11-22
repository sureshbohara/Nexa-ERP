export const PAYROLL_STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'processed', label: 'Processed' },
    { value: 'paid', label: 'Paid' },
];

export const PAYMENT_STATUS_OPTIONS = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
];

export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Rs. 0.00';
    return `Rs. ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getMonthDateRange = (period) => {
    const [year, month] = period.split('-').map(Number);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    return { start_date: startDate, end_date: endDate };
};

export const getStatusClasses = (status) => {
    const classes = {
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        processed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};