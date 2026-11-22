import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { ACCOUNT_INITIAL_VALUES, mapAccountToFormData } from '@/Services/accountService';

export function useAccountForm(account, isEdit = false, onSuccessCallback) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapAccountToFormData(account) : ACCOUNT_INITIAL_VALUES
    );

    useEffect(() => {
        if (isEdit && account) {
            const mappedData = mapAccountToFormData(account);
            Object.keys(mappedData).forEach(key => setData(key, mappedData[key]));
        }
    }, [account, isEdit, setData]);

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit 
            ? route('accounting.accounts.update', account.id) 
            : route('accounting.accounts.store');
        
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
                if (onSuccessCallback) onSuccessCallback();
            },
        };

        isEdit ? put(url, data, options) : post(url, data, options);
    };

    return { data, setData, processing, errors, reset, submit };
}