
import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    PRODUCT_INITIAL_VALUES,
    mapProductToFormData
} from '@/Services/productService';

export function useProductForm(product, isEdit = false) {
    const fileInputRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(
        product?.image_url || null
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        ...(isEdit
            ? mapProductToFormData(product)
            : PRODUCT_INITIAL_VALUES),

        ...(isEdit ? { _method: 'PUT' } : {}),
    });

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(product?.image_url || null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const url = isEdit
            ? route('inventory.products.update', product.id)
            : route('inventory.products.store');

        post(url, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                if (!isEdit) {
                    reset();
                }
            },
        });
    };

    return {
        data,
        setData,
        processing,
        errors,
        reset,
        previewImage,
        fileInputRef,
        handleImageChange,
        removeImage,
        submit,
    };
}
