import { useForm } from '@inertiajs/react';
import { UNIT_INITIAL_VALUES, mapUnitToFormData } from '@/Services/unitService';

export function useUnitForm(unit, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapUnitToFormData(unit) : UNIT_INITIAL_VALUES
    );

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('inventory.units.update', unit.id) : route('inventory.units.store');
        
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