import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { 
    ORGANIZATION_INITIAL_VALUES, 
    mapOrganizationToFormData, 
    validateLogo 
} from '@/Services/organizationService';

export function useOrganizationForm(organization, isEdit = false) {
    const fileInputRef = useRef(null);
    const [previewLogo, setPreviewLogo] = useState(organization?.logo_url || null);

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapOrganizationToFormData(organization) : ORGANIZATION_INITIAL_VALUES
    );

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        const validation = validateLogo(file);

        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        setData('logo', file);
        setPreviewLogo(URL.createObjectURL(file));
    };

    const removeLogo = () => {
        setData('logo', null);
        setPreviewLogo(organization?.logo_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('organizations.update', organization.id) : route('organizations.store');
        const request = isEdit ? put : post;

        request(url, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
            },
        });
    };

    return {
        data, setData, processing, errors, reset,
        previewLogo, fileInputRef,
        handleLogoChange, removeLogo, submit,
    };
}