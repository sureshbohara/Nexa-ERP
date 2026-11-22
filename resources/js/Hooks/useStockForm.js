
import { useForm } from '@inertiajs/react';

const INITIAL_VALUES = {
    product_id: '',
    warehouse_id: '',
    type: 'stock_in',
    quantity: '',
    batch_number: '',
    expiry_date: '',
    notes: '',
};

export default function useStockForm() {
    const form = useForm(INITIAL_VALUES);

    const submit = (onSuccess) => {
        form.post(route('inventory.stocks.adjust'), {
            preserveScroll: true,

            onSuccess: () => {
                form.reset();
                form.clearErrors();

                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            },
        });
    };

    const reset = () => {
        form.reset();
        form.clearErrors();
    };

    return {
        data: form.data,
        setData: form.setData,
        processing: form.processing,
        errors: form.errors,
        submit,
        reset,
    };
}
