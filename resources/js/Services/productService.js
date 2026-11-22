export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const PRODUCT_INITIAL_VALUES = {
    category_id: '',
    brand_id: '',
    unit_id: '',
    name: '',
    sku: '',
    barcode: '',
    description: '',
    image: null,
    purchase_price: '',
    selling_price: '',
    tax_rate: '',
    low_stock_threshold: '',
    has_variants: false,
    has_serial_number: false,
    has_batch: false,
    has_expiry: false,
    status: 'active',
};

export const mapProductToFormData = (product) => ({
    category_id: product?.category_id || '',
    brand_id: product?.brand_id || '',
    unit_id: product?.unit_id || '',
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    description: product?.description || '',
    image: null,
    purchase_price: product?.purchase_price || '',
    selling_price: product?.selling_price || '',
    tax_rate: product?.tax_rate || '',
    low_stock_threshold: product?.low_stock_threshold || '',
    has_variants: product?.has_variants || false,
    has_serial_number: product?.has_serial_number || false,
    has_batch: product?.has_batch || false,
    has_expiry: product?.has_expiry || false,
    status: product?.status || 'active',
});