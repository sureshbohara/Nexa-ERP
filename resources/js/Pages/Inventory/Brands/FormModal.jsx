import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

import {
    Save,
    Image as ImageIcon,
    X,
} from 'lucide-react';

import { mapBrandToFormData } from '@/Services/brandService';

const INITIAL_VALUES = {
    name: '',
    code: '',
    description: '',
    logo: null,
    status: 'active',
};

export default function BrandFormModal({
    isOpen,
    onClose,
    editing,
    onSuccess,
}) {
    const isEdit = !!editing;

    const [formData, setFormData] = useState({ ...INITIAL_VALUES });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (editing) {
            setFormData(mapBrandToFormData(editing));
            setPreview(editing.logo_url || null);
        } else {
            setFormData({ ...INITIAL_VALUES });
            setPreview(null);
        }

        setErrors({});
    }, [editing, isOpen]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                logo: 'Logo size must be less than 2MB.',
            }));

            e.target.value = '';
            return;
        }

        setErrors((prev) => ({
            ...prev,
            logo: null,
        }));

        handleChange('logo', file);

        setPreview(URL.createObjectURL(file));
    };

    const removeLogo = () => {
        handleChange('logo', null);

        // Keep existing logo when editing.
        setPreview(editing?.logo_url || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (processing) return;

        setProcessing(true);
        setErrors({});

        const url = isEdit
            ? route('inventory.brands.update', editing.id)
            : route('inventory.brands.store');

        const payload = {
            ...formData,
        };

        if (isEdit) {
            payload._method = 'PUT';
        }

        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                onSuccess();
            },

            onError: (validationErrors) => {
                setErrors(validationErrors);
            },

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleClose = () => {
        if (processing) return;

        setFormData({ ...INITIAL_VALUES });
        setPreview(null);
        setErrors({});

        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Brand' : 'Create Brand'}
            size="md"
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

     
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormInput
                        name="name"
                        label="Brand Name"
                        value={formData.name}
                        onChange={(value) =>
                            handleChange('name', value)
                        }
                        error={errors.name}
                        required
                        placeholder="e.g., Samsung"
                    />

                    <FormInput
                        name="code"
                        label="Brand Code"
                        value={formData.code}
                        onChange={(value) =>
                            handleChange('code', value)
                        }
                        error={errors.code}
                        placeholder="e.g., BR-001"
                    />

                </div>

            
                <FormInput
                    name="description"
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(value) =>
                        handleChange('description', value)
                    }
                    error={errors.description}
                    rows={2}
                />

           
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Brand Logo
                    </label>

                    <div className="relative w-full h-32 bg-gray-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">

                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Brand Preview"
                                    className="w-full h-full object-contain p-2"
                                />

                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded z-10"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                    Upload Brand Logo
                                </span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />

                    </div>

                    {errors.logo && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.logo}
                        </p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, SVG. Maximum 2MB.
                    </p>
                </div>

       
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                    >
                        <Save className="w-4 h-4 mr-1.5" />

                        {processing
                            ? 'Saving...'
                            : isEdit
                                ? 'Update Brand'
                                : 'Create Brand'}
                    </Button>

                </div>

            </form>
        </Modal>
    );
}
