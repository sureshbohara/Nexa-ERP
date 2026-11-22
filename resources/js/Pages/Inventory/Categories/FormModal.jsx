import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { Save, Loader2 } from 'lucide-react';
import { CATEGORY_INITIAL_VALUES, STATUS_OPTIONS, mapCategoryToFormData } from '@/Services/categoryService';

export default function CategoryFormModal({ isOpen, onClose, editing, parentOptions, onSuccess }) {
    const isEdit = !!editing;

    const { data, setData, processing, errors, reset, post, put } = useForm(CATEGORY_INITIAL_VALUES);

    useEffect(() => {
        if (editing) setData(mapCategoryToFormData(editing));
        else reset();
    }, [editing, isOpen]);

    const availableParents = (parentOptions || []).filter(c => c.id !== (editing?.id || 0));

    const parentSelectOptions = [
        { value: '', label: '-- None (Top Level Category) --' },
        ...availableParents.map(c => ({ value: c.id, label: c.name })),
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEdit
            ? route('inventory.categories.update', editing.id)
            : route('inventory.categories.store');

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess(); 
            },
        };

        isEdit ? put(url, options) : post(url, options);
    };

    const handleClose = () => {
        reset();
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Category' : 'Create Category'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="name" label="Category Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} required placeholder="e.g., Electronics" />
                    <FormInput name="code" label="Category Code" value={data.code} onChange={(v) => setData('code', v)} error={errors.code} placeholder="e.g., CAT-01" />
                </div>

                <FormInput name="description" label="Description" type="textarea" value={data.description} onChange={(v) => setData('description', v)} error={errors.description} rows={2} />

                <FormInput name="parent_id" label="Parent Category" type="select" value={data.parent_id} onChange={(v) => setData('parent_id', v)} error={errors.parent_id} options={parentSelectOptions} />


                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? (
                            <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Update' : 'Create'}</>
                        )}
                    </Button>
                </div>
                
            </form>
        </Modal>
    );
}