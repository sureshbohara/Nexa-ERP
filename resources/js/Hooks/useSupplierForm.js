import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { 
    SUPPLIER_INITIAL_VALUES, 
    mapSupplierToFormData 
} from '@/Services/supplierService';

export function useSupplierForm(supplier, isEdit = false, onSuccessCallback) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapSupplierToFormData(supplier) : SUPPLIER_INITIAL_VALUES
    );


    useEffect(() => {
        if (isEdit && supplier) {
            const mappedData = mapSupplierToFormData(supplier);
            Object.keys(mappedData).forEach(key => {
                setData(key, mappedData[key]);
            });
        } else {
            Object.keys(SUPPLIER_INITIAL_VALUES).forEach(key => {
                setData(key, SUPPLIER_INITIAL_VALUES[key]);
            });
        }
    }, [supplier, isEdit, setData]);

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit 
            ? route('transactions.suppliers.update', supplier.id) 
            : route('transactions.suppliers.store');
        
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) {
                    Object.keys(SUPPLIER_INITIAL_VALUES).forEach(key => {
                        setData(key, SUPPLIER_INITIAL_VALUES[key]);
                    });
                }
                if (onSuccessCallback) {
                    onSuccessCallback();
                }
            },
        };

   
        isEdit ? put(url, data, options) : post(url, data, options);
    };

    return {
        data, setData, processing, errors, reset,
        submit,
    };
}