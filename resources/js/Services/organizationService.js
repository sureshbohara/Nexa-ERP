export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const ORGANIZATION_INITIAL_VALUES = {
    name: '',
    code: '',
    registration_number: '',
    pan_vat_number: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    website: '',
    province: '',
    district: '',
    municipality: '',
    ward_number: '',
    address: '',
    established_date: '',
    status: 'active',
    logo: null,
};

export const mapOrganizationToFormData = (org) => ({
    name: org?.name || '',
    code: org?.code || '',
    registration_number: org?.registration_number || '',
    pan_vat_number: org?.pan_vat_number || '',
    contact_person: org?.contact_person || '',
    phone: org?.phone || '',
    alternate_phone: org?.alternate_phone || '',
    email: org?.email || '',
    website: org?.website || '',
    province: org?.province || '',
    district: org?.district || '',
    municipality: org?.municipality || '',
    ward_number: org?.ward_number || '',
    address: org?.address || '',
    established_date: org?.established_date || '',
    status: org?.status || 'active',
    logo: null,
});

export const validateLogo = (file) => {
    if (!file) return { valid: false, message: 'No file selected' };
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: 'Only JPG, PNG, or WEBP allowed' };
    }
    if (file.size > 2 * 1024 * 1024) {
        return { valid: false, message: 'Logo size must be less than 2MB' };
    }
    return { valid: true };
};