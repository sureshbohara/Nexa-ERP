export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const LEAVE_TYPE_INITIAL_VALUES = {
    name: '',
    code: '',
    days_allowed: 0,
    is_paid: true,
    is_carried_forward: false,
    description: '',
    status: 'active',
};

export const mapLeaveTypeToFormData = (lt) => ({
    name: lt?.name || '',
    code: lt?.code || '',
    days_allowed: lt?.days_allowed ?? 0,
    is_paid: lt?.is_paid ?? true,
    is_carried_forward: lt?.is_carried_forward ?? false,
    description: lt?.description || '',
    status: lt?.status || 'active',
});