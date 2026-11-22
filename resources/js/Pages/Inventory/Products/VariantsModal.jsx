import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { Layers, Plus, Pencil, Trash2, Save, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VariantsModal({ product, onClose }) {
    const [variants, setVariants] = useState([]);
    const [editing, setEditing] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data, setData, processing, errors, reset, post, put } = useForm({
        product_id: product?.id || '',
        name: '',
        value: '',
        sku: '',
        additional_price: '',
        stock_quantity: '',
    });

 
    useEffect(() => {
        if (product) {
            setVariants(product.variants || []);
        } else {
            setVariants([]);
        }
    }, [product]);

  
    useEffect(() => {
        if (!product) {
            setIsFormOpen(false);
            setEditing(null);
            reset();
        }
    }, [product]);

 
    useEffect(() => {
        if (editing) {
            setData({
                product_id: product.id,
                name: editing.name,
                value: editing.value,
                sku: editing.sku || '',
                additional_price: editing.additional_price || '',
                stock_quantity: editing.stock_quantity || '',
            });
            setIsFormOpen(true);
        } else {
            setData({
                product_id: product?.id || '',
                name: '',
                value: '',
                sku: '',
                additional_price: '',
                stock_quantity: '',
            });
        }
    }, [editing, product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing 
            ? route('inventory.product-variants.update', editing.id)
            : route('inventory.product-variants.store');
        
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                setIsFormOpen(false);
                router.reload({ only: ['products'] });
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] || 'Failed to save variant');
            },
        };

        editing ? put(url, options) : post(url, options);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this variant?')) {
            router.delete(route('inventory.product-variants.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['products'] });
                },
            });
        }
    };

    const handleClose = () => {
        setEditing(null);
        setIsFormOpen(false);
        onClose();
    };

    if (!product) return null;

    return (
        <Modal 
            isOpen={!!product} 
            onClose={handleClose} 
            title={`Variants: ${product.name}`} 
            size="lg"
        >
            <div className="space-y-4">
                
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {variants.length} Variant(s)
                        </span>
                    </div>
                    {!isFormOpen && (
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => { setEditing(null); setIsFormOpen(true); }}
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Add Variant
                        </Button>
                    )}
                </div>

              
                {variants.length > 0 && !isFormOpen && (
                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Name</th>
                                    <th className="table-th">Value</th>
                                    <th className="table-th">SKU</th>
                                    <th className="table-th">Extra Price</th>
                                    <th className="table-th">Stock</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {variants.map((variant) => (
                                    <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td font-medium">{variant.name}</td>
                                        <td className="table-td">{variant.value}</td>
                                        <td className="table-td text-xs">{variant.sku || '-'}</td>
                                        <td className="table-td">Rs. {Number(variant.additional_price || 0).toFixed(2)}</td>
                                        <td className="table-td font-semibold">{variant.stock_quantity}</td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button 
                                                    onClick={() => setEditing(variant)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(variant.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

             
                {isFormOpen && (
                    <form 
                        onSubmit={handleSubmit} 
                        className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/50 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {editing ? 'Edit Variant' : 'Add New Variant'}
                            </h3>
                            <button 
                                type="button" 
                                onClick={() => { setIsFormOpen(false); setEditing(null); }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput 
                                name="name" 
                                label="Attribute Name" 
                                value={data.name} 
                                onChange={(v) => setData('name', v)} 
                                error={errors.name} 
                                placeholder="e.g., Color, Size" 
                                required 
                            />
                            <FormInput 
                                name="value" 
                                label="Attribute Value" 
                                value={data.value} 
                                onChange={(v) => setData('value', v)} 
                                error={errors.value} 
                                placeholder="e.g., Red, Large" 
                                required 
                            />
                            <FormInput 
                                name="sku" 
                                label="Variant SKU" 
                                value={data.sku} 
                                onChange={(v) => setData('sku', v)} 
                                error={errors.sku} 
                                placeholder="Optional" 
                            />
                            <FormInput 
                                name="additional_price" 
                                label="Extra Price (Rs.)" 
                                type="number" 
                                value={data.additional_price} 
                                onChange={(v) => setData('additional_price', v)} 
                                error={errors.additional_price} 
                                placeholder="0" 
                            />
                            <FormInput 
                                name="stock_quantity" 
                                label="Stock Quantity" 
                                type="number" 
                                value={data.stock_quantity} 
                                onChange={(v) => setData('stock_quantity', v)} 
                                error={errors.stock_quantity} 
                                placeholder="0" 
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => { setIsFormOpen(false); setEditing(null); }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={processing}>
                                {processing ? (
                                    <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-1.5" /> {editing ? 'Update' : 'Add'} Variant</>
                                )}
                            </Button>
                        </div>
                    </form>  
                )}

           
                {variants.length === 0 && !isFormOpen && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg">
                        <Layers className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm">No variants added yet.</p>
                        <p className="text-xs mt-1">Click "Add Variant" to create product variations like Size or Color.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}