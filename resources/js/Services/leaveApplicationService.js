export const LEAVE_APP_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const LEAVE_APP_INITIAL_VALUES = {
    employee_id: '',
    leave_type_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'pending',
};

export const mapLeaveAppToFormData = (app) => ({
    employee_id: app?.employee_id ? String(app.employee_id) : '',
    leave_type_id: app?.leave_type_id ? String(app.leave_type_id) : '',
    start_date: app?.start_date ? String(app.start_date).split('T')[0] : new Date().toISOString().split('T')[0],
    end_date: app?.end_date ? String(app.end_date).split('T')[0] : new Date().toISOString().split('T')[0],
    reason: app?.reason || '',
    status: app?.status || 'pending',
});