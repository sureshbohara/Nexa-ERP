export const ATTENDANCE_STATUS_OPTIONS = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'leave', label: 'Leave' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'half_day', label: 'Half Day' },
];

export const ATTENDANCE_INITIAL_VALUES = {
    employee_id: '',
    attendance_date: new Date().toISOString().split('T')[0],
    check_in: '',
    check_out: '',
    status: 'present',
    working_hours: 0,
    notes: '',
};

export const mapAttendanceToFormData = (att) => ({
    employee_id: att?.employee_id ? String(att.employee_id) : '',
    attendance_date: att?.attendance_date ? String(att.attendance_date).split('T')[0] : new Date().toISOString().split('T')[0],
    check_in: att?.check_in ? String(att.check_in).substring(11, 16) : '',
    check_out: att?.check_out ? String(att.check_out).substring(11, 16) : '',
    status: att?.status || 'present',
    working_hours: att?.working_hours ?? 0,
    notes: att?.notes || '',
});