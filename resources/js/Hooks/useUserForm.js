import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { getInitialUserValues, mapUserToFormData, validateImage } from '@/Services/userService';

export function useUserForm(user, isEdit = false) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(user?.image_url || null);

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapUserToFormData(user) : getInitialUserValues()
    );

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        const validation = validateImage(file);

        if (!validation.valid) {
    
            toast.error(validation.message);
            return;
        }

        setData('image', file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(user?.image_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const submitData = { ...data };
        if (isEdit && !submitData.password) {
            delete submitData.password;
            delete submitData.password_confirmation;
        }

        const url = isEdit ? route('users.update', user.id) : route('users.store');
        const request = isEdit ? put : post;

        request(url, submitData, {
            forceFormData: true, 
            preserveScroll: true,
            onSuccess: () => {
                reset('password', 'password_confirmation', 'image');
                if (!isEdit) {
                    reset(); 
                }
            },
 
        });
    };

    return {
        data, setData, processing, errors, reset,
        previewImage, fileInputRef,
        handleImageChange, removeImage, submit,
    };
}