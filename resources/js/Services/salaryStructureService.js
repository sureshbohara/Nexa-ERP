export const SALARY_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const SALARY_INITIAL_VALUES = {
    name: '',
    code: '',
    basic_salary: 0,
    house_rent_allowance: 0,
    transport_allowance: 0,
    medical_allowance: 0,
    other_allowance: 0,
    provident_fund: 0,
    tax_deduction: 0,
    other_deduction: 0,
    description: '',
    status: 'active',
};

export const mapSalaryStructureToFormData = (structure) => ({
    name: structure?.name || '',
    code: structure?.code || '',
    basic_salary: structure?.basic_salary ?? 0,
    house_rent_allowance: structure?.house_rent_allowance ?? 0,
    transport_allowance: structure?.transport_allowance ?? 0,
    medical_allowance: structure?.medical_allowance ?? 0,
    other_allowance: structure?.other_allowance ?? 0,
    provident_fund: structure?.provident_fund ?? 0,
    tax_deduction: structure?.tax_deduction ?? 0,
    other_deduction: structure?.other_deduction ?? 0,
    description: structure?.description || '',
    status: structure?.status || 'active',
});