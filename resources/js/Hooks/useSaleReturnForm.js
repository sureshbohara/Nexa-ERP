import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { 
    SALE_RETURN_INITIAL_VALUES, 
    mapSaleReturnToFormData 
} from '@/Services/saleReturnService';

export function useSaleReturnForm(saleReturn, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapSaleReturnToFormData(saleReturn) : SALE_RETURN_INITIAL_VALUES
    );

    useEffect(() => {
        if (isEdit && saleReturn) {
            const mappedData = mapSaleReturnToFormData(saleReturn);
            Object.keys(mappedData).forEach(key => {
                setData(key, mappedData[key]);
            });
        }
    }, [saleReturn, isEdit, setData]);

    const addItem = () => {
        setData('items', [
            ...data.items,
            { product_id: '', quantity: 1, unit_price: 0, total: 0 }
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        setData(`items.${index}.${field}`, value);

        if (['quantity', 'unit_price'].includes(field)) {
            const item = data.items[index];
            const qty = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
            const price = parseFloat(field === 'unit_price' ? value : item.unit_price) || 0;
            setData(`items.${index}.total`, parseFloat((qty * price).toFixed(2)));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? route('transactions.sale-returns.update', saleReturn.id)
            : route('transactions.sale-returns.store');

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
            },
        };

        isEdit ? put(url, data, options) : post(url, data, options);
    };

    return {
        data, setData, processing, errors, reset,
        submit, addItem, removeItem, updateItem
    };
}