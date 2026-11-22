export const ROLE_INITIAL_VALUES = {
    name: '',
    guard_name: 'web',
    permissions: [],
};

export const mapRoleToFormData = (role) => ({
    name: role?.name || '',
    guard_name: role?.guard_name || 'web',
    permissions: role?.permissions?.map(p => p.id) || [],
});