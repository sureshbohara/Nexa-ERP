export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const HOLIDAY_INITIAL_VALUES = {
    name: '',
    date: '',
    description: '',
    is_recurring: false,
    status: 'active',
};

export const mapHolidayToFormData = (holiday) => ({
    name: holiday?.name ?? '',
    date: holiday?.date
        ? String(holiday.date).split('T')[0]
        : '',
    description: holiday?.description ?? '',
    is_recurring: holiday?.is_recurring ?? false,
    status: holiday?.status ?? 'active',
});
