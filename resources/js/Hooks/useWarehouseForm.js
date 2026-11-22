import { useForm } from '@inertiajs/react';
import { WAREHOUSE_INITIAL_VALUES, mapWarehouseToFormData } from '@/Services/warehouseService';

export function useWarehouseForm(warehouse, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapWarehouseToFormData(warehouse) : WAREHOUSE_INITIAL_VALUES
    );

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('inventory.warehouses.update', warehouse.id) : route('inventory.warehouses.store');
        
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
            },
        };

        isEdit ? put(url, options) : post(url, options);
    };

    return { data, setData, processing, errors, reset, submit };
}