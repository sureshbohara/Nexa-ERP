import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { 
    RETURN_INITIAL_VALUES, 
    mapReturnToFormData 
} from '@/Services/purchaseReturnService';

export function usePurchaseReturnForm(purchaseReturn, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapReturnToFormData(purchaseReturn) : RETURN_INITIAL_VALUES
    );

    useEffect(() => {
        if (isEdit && purchaseReturn) {
            const mappedData = mapReturnToFormData(purchaseReturn);
            Object.keys(mappedData).forEach(key => {
                setData(key, mappedData[key]);
            });
        }
    }, [purchaseReturn, isEdit, setData]);

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
            ? route('transactions.purchase-returns.update', purchaseReturn.id)
            : route('transactions.purchase-returns.store');

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