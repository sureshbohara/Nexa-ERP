export const RETURN_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const RETURN_INITIAL_VALUES = {
    supplier_id: '',
    purchase_id: '',
    warehouse_id: '',
    reference_no: '',
    return_date: new Date().toISOString().split('T')[0],
    tax_amount: 0,
    discount_amount: 0,
    status: 'pending',
    notes: '',
    items: [{ product_id: '', quantity: 1, unit_price: 0, total: 0 }],
};

export const mapReturnToFormData = (ret) => ({
    supplier_id: ret?.supplier_id || '',
    purchase_id: ret?.purchase_id || '',
    warehouse_id: ret?.warehouse_id || '',
    reference_no: ret?.reference_no || '',
    return_date: ret?.return_date 
        ? String(ret.return_date).split('T')[0] 
        : new Date().toISOString().split('T')[0],
    tax_amount: ret?.tax_amount || 0,
    discount_amount: ret?.discount_amount || 0,
    status: ret?.status || 'pending',
    notes: ret?.notes || '',
    items: ret?.items?.length > 0
        ? ret.items.map(i => ({
              product_id: i.product_id,
              quantity: i.quantity,
              unit_price: i.unit_price,
              total: i.total,
          }))
        : [{ product_id: '', quantity: 1, unit_price: 0, total: 0 }],
});