export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const CATEGORY_INITIAL_VALUES = {
    name: '', 
    code: '', 
    description: '', 
    status: 'active',
    parent_id: '', 
};

export const mapCategoryToFormData = (cat) => ({
    name: cat?.name || '', 
    code: cat?.code || '', 
    description: cat?.description || '', 
    status: cat?.status || 'active',
    parent_id: cat?.parent_id || '', 
});