import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { BRAND_INITIAL_VALUES, mapBrandToFormData } from '@/Services/brandService';

export function useBrandForm(brand, isEdit = false) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(brand?.logo_url || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ...(isEdit ? mapBrandToFormData(brand) : BRAND_INITIAL_VALUES),
        ...(isEdit ? { _method: 'PUT' } : {}),
    });

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? route('inventory.brands.update', brand.id)
            : route('inventory.brands.store');

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { if (!isEdit) reset(); },
        });
    };

    return { data, setData, processing, errors, reset, previewImage, fileInputRef, handleImageChange, submit };
}