export const PAYMENT_STATUS_OPTIONS = [
    { value: 'due', label: 'Due' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
];

export const SALE_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const DELIVERY_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const SALE_INITIAL_VALUES = {
    customer_id: '',
    warehouse_id: '',
    reference_no: '',
    sale_date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    shipping_charge: 0,
    total_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    payment_status: 'due',
    delivery_status: 'pending',
    status: 'pending',
    notes: '',
    payment_account_id: '',
    items: [{ product_id: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }],
};

export const mapSaleToFormData = (sale) => ({
    customer_id: sale?.customer_id ? String(sale.customer_id) : '',
    warehouse_id: sale?.warehouse_id ? String(sale.warehouse_id) : '',
    reference_no: sale?.reference_no || '',
    sale_date: sale?.sale_date ? String(sale.sale_date).split('T')[0] : new Date().toISOString().split('T')[0],
    subtotal: sale?.subtotal ?? 0,
    tax_amount: sale?.tax_amount ?? 0,
    discount_amount: sale?.discount_amount ?? 0,
    shipping_charge: sale?.shipping_charge ?? 0,
    total_amount: sale?.total_amount ?? 0,
    paid_amount: sale?.paid_amount ?? 0,
    due_amount: sale?.due_amount ?? 0,
    payment_status: sale?.payment_status || 'due',
    delivery_status: sale?.delivery_status || 'pending',
    status: sale?.status || 'pending',
    notes: sale?.notes || '',
    payment_account_id: sale?.payment_account_id ? String(sale.payment_account_id) : '', 
    items: sale?.items?.length > 0
        ? sale.items.map(i => ({
              product_id: i.product_id ? String(i.product_id) : '',
              quantity: i.quantity ?? 1,
              unit_price: i.unit_price ?? 0,
              tax_rate: i.tax_rate ?? 0,
              discount: i.discount ?? 0,
              total: i.total ?? 0,
          }))
        : [{ product_id: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }],
});