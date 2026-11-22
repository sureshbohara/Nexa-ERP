export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
];

export const getInitialUserValues = () => ({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    designation: '',
    address: '',
    bio: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    organization_id: '',
    branch_id: '',
    status: 'active',
    image: null,
});

export const mapUserToFormData = (user) => ({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
    gender: user?.gender || 'male',
    date_of_birth: user?.date_of_birth || '',
    designation: user?.designation || '',
    address: user?.address || '',
    bio: user?.bio || '',
    password: '',
    password_confirmation: '',
    role_id: user?.role_id || '',
    organization_id: user?.organization_id || '',
    branch_id: user?.branch_id || '',
    status: user?.status || 'active',
    image: null,
});

export const validateImage = (file) => {
    if (!file) return { valid: false, message: 'No file selected' };
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: 'Only JPG, PNG, WEBP, or GIF allowed' };
    }
    if (file.size > 2 * 1024 * 1024) {
        return { valid: false, message: 'Image size must be less than 2MB' };
    }
    return { valid: true };
};