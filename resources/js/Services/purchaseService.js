export const PAYMENT_STATUS_OPTIONS = [
    { value: 'due', label: 'Due' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
];

export const PURCHASE_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const createEmptyItem = () => ({
    product_id: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0,
    discount: 0,
    total: 0,
});

export const PURCHASE_INITIAL_VALUES = {
    supplier_id: '',
    warehouse_id: '',
    reference_no: '',
    purchase_date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    shipping_charge: 0,
    total_amount: 0,
    paid_amount: 0,
    payment_status: 'due',
    status: 'pending',
    notes: '',
    payment_account_id: '', 
    items: [createEmptyItem()],
};

export const mapPurchaseToFormData = (purchase) => ({
    supplier_id: purchase?.supplier_id ? String(purchase.supplier_id) : '',
    warehouse_id: purchase?.warehouse_id ? String(purchase.warehouse_id) : '',
    reference_no: purchase?.reference_no || '',
    purchase_date: purchase?.purchase_date 
        ? String(purchase.purchase_date).split('T')[0] 
        : new Date().toISOString().split('T')[0],
    subtotal: purchase?.subtotal ?? 0,
    tax_amount: purchase?.tax_amount ?? 0,
    discount_amount: purchase?.discount_amount ?? 0,
    shipping_charge: purchase?.shipping_charge ?? 0,
    total_amount: purchase?.total_amount ?? 0,
    paid_amount: purchase?.paid_amount ?? 0,
    payment_status: purchase?.payment_status || 'due',
    status: purchase?.status || 'pending',
    notes: purchase?.notes || '',
    payment_account_id: purchase?.payment_account_id ? String(purchase.payment_account_id) : '', 
    items: purchase?.items?.length > 0
        ? purchase.items.map(item => ({
            product_id: item.product_id ? String(item.product_id) : '',
            quantity: item.quantity ?? 1,
            unit_price: item.unit_price ?? 0,
            tax_rate: item.tax_rate ?? 0,
            discount: item.discount ?? 0,
            total: item.total ?? 0,
        }))
        : [createEmptyItem()],
});