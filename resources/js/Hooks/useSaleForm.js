import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { SALE_INITIAL_VALUES, mapSaleToFormData } from '@/Services/saleService';

export function useSaleForm(sale, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapSaleToFormData(sale) : SALE_INITIAL_VALUES
    );

    useEffect(() => {
        if (isEdit && sale) {
            const mappedData = mapSaleToFormData(sale);
            Object.keys(mappedData).forEach(key => setData(key, mappedData[key]));
        }
    }, [sale, isEdit, setData]);

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }]);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        setData(`items.${index}.${field}`, value);

        if (['quantity', 'unit_price', 'tax_rate', 'discount'].includes(field)) {
            const item = data.items[index];
            const qty = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
            const price = parseFloat(field === 'unit_price' ? value : item.unit_price) || 0;
            const tax = parseFloat(field === 'tax_rate' ? value : item.tax_rate) || 0;
            const disc = parseFloat(field === 'discount' ? value : item.discount) || 0;

            const baseAmount = qty * price;
            const taxAmount = baseAmount * tax / 100;
            const rowTotal = Math.max(0, baseAmount + taxAmount - disc);

            setData(`items.${index}.total`, rowTotal.toFixed(2));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('transactions.sales.update', sale.id) : route('transactions.sales.store');
        const options = { forceFormData: true, preserveScroll: true, onSuccess: () => { if (!isEdit) reset(); } };
        isEdit ? put(url, data, options) : post(url, data, options);
    };

    return { data, setData, processing, errors, reset, submit, addItem, removeItem, updateItem };
}