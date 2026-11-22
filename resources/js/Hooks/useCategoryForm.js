import { useForm } from '@inertiajs/react';
import { CATEGORY_INITIAL_VALUES, mapCategoryToFormData } from '@/Services/categoryService';

export function useCategoryForm(category, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapCategoryToFormData(category) : CATEGORY_INITIAL_VALUES
    );

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('inventory.categories.update', category.id) : route('inventory.categories.store');
        const request = isEdit ? put : post;

        request(url, data, {
            preserveScroll: true,
            onSuccess: () => { if (!isEdit) reset(); }
        });
    };

    return { data, setData, processing, errors, reset, submit };
}