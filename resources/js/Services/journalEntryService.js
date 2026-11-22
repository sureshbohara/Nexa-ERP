export const JOURNAL_STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'posted', label: 'Posted' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const JOURNAL_INITIAL_VALUES = {
    reference_no: '',
    entry_date: new Date().toISOString().split('T')[0],
    status: 'draft',
    notes: '',
    items: [
        { account_id: '', description: '', debit: '', credit: '' },
        { account_id: '', description: '', debit: '', credit: '' }
    ],
};

export const mapJournalToFormData = (entry) => ({
    reference_no: entry?.reference_no || '',
    entry_date: entry?.entry_date ? String(entry.entry_date).split('T')[0] : new Date().toISOString().split('T')[0],
    status: entry?.status || 'draft',
    notes: entry?.notes || '',
    items: entry?.items?.length > 0 
        ? entry.items.map(i => ({
              account_id: i.account_id ? String(i.account_id) : '',
              description: i.description || '',
              debit: i.debit || '',
              credit: i.credit || '',
          }))
        : [
            { account_id: '', description: '', debit: '', credit: '' },
            { account_id: '', description: '', debit: '', credit: '' }
          ],
});