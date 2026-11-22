import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { 
    CUSTOMER_INITIAL_VALUES, 
    mapCustomerToFormData 
} from '@/Services/customerService';

export function useCustomerForm(customer, isEdit = false, onSuccessCallback) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapCustomerToFormData(customer) : CUSTOMER_INITIAL_VALUES
    );

 
    useEffect(() => {
        if (isEdit && customer) {
            const mappedData = mapCustomerToFormData(customer);
            Object.keys(mappedData).forEach(key => {
                setData(key, mappedData[key]);
            });
        } else {
            Object.keys(CUSTOMER_INITIAL_VALUES).forEach(key => {
                setData(key, CUSTOMER_INITIAL_VALUES[key]);
            });
        }
    }, [customer, isEdit, setData]);

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit 
            ? route('transactions.customers.update', customer.id) 
            : route('transactions.customers.store');
        
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) {
                    Object.keys(CUSTOMER_INITIAL_VALUES).forEach(key => {
                        setData(key, CUSTOMER_INITIAL_VALUES[key]);
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