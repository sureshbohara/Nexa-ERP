import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { useProductForm } from '@/Hooks/useProductForm';
import { STATUS_OPTIONS } from '@/Services/productService';
import { Package, Save, Loader2, ArrowLeft, Camera, X, AlertCircle, Info } from 'lucide-react';

export default function ProductForm({ product, dropdownData }) {
    const isEdit = !!product;
    const {
        data, setData, processing, errors,
        previewImage, fileInputRef,
        handleImageChange, removeImage, submit
    } = useProductForm(product, isEdit);

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        { label: 'Products', href: route('inventory.products.index') },
    ];

    const categoryOptions = [
        { value: '', label: '-- Select Category --' },
        ...(dropdownData?.categories?.map(c => ({ value: c.id, label: c.name })) || [])
    ];

    const brandOptions = [
        { value: '', label: '-- Select Brand --' },
        ...(dropdownData?.brands?.map(b => ({ value: b.id, label: b.name })) || [])
    ];

    const unitOptions = [
        { value: '', label: '-- Select Unit --' },
        ...(dropdownData?.units?.map(u => ({ value: u.id, label: u.name })) || [])
    ];


    const hasAnyFlag = data.has_variants || data.has_serial_number || data.has_batch || data.has_expiry;

    return (
        <AppLayout title={isEdit ? 'Edit Product' : 'Create Product'}>
            <Head title={isEdit ? 'Edit Product' : 'Create Product'} />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Breadcrumb
                        title="Inventory"
                        subTitle={isEdit ? 'Edit Product' : 'Create Product'}
                        breadcrumbItems={breadcrumbItems}
                    />
                    <Link href={route('inventory.products.index')}>

                        <Button variant="secondary" size="md">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>

                    </Link>
                </div>
                
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Product Details
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput name="name" label="Product Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} required placeholder="e.g., iPhone 15 Pro" />
                                    <FormInput name="sku" label="SKU" value={data.sku} onChange={(v) => setData('sku', v)} error={errors.sku} required placeholder="e.g., IP15P-256" />
                                    <FormInput name="barcode" label="Barcode" value={data.barcode} onChange={(v) => setData('barcode', v)} error={errors.barcode} placeholder="e.g., 123456789" />
                                    <FormInput name="category_id" label="Category" type="select" value={data.category_id} onChange={(v) => setData('category_id', v)} error={errors.category_id} options={categoryOptions} />
                                    <FormInput name="brand_id" label="Brand" type="select" value={data.brand_id} onChange={(v) => setData('brand_id', v)} error={errors.brand_id} options={brandOptions} />
                                    <FormInput name="unit_id" label="Unit" type="select" value={data.unit_id} onChange={(v) => setData('unit_id', v)} error={errors.unit_id} options={unitOptions} required />
                                    <FormInput name="purchase_price" label="Purchase Price" type="number" value={data.purchase_price} onChange={(v) => setData('purchase_price', v)} error={errors.purchase_price} required placeholder="0.00" />
                                    <FormInput name="selling_price" label="Selling Price" type="number" value={data.selling_price} onChange={(v) => setData('selling_price', v)} error={errors.selling_price} required placeholder="0.00" />
                                    
                                    <div className="md:col-span-2">
                                        <FormInput name="description" label="Description" type="textarea" value={data.description} onChange={(v) => setData('description', v)} error={errors.description} rows={3} placeholder="Product details..." />
                                    </div>

                                   
                                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-slate-700 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.has_variants}
                                                onChange={(e) => setData('has_variants', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-slate-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Variants</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.has_serial_number}
                                                onChange={(e) => setData('has_serial_number', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-slate-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Serial Number</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.has_batch}
                                                onChange={(e) => setData('has_batch', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-slate-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Batch Number</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.has_expiry}
                                                onChange={(e) => setData('has_expiry', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-slate-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Expiry Date</span>
                                        </label>
                                    </div>

                                 
                                    {hasAnyFlag && (
                                        <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-2">
                                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4" /> Tracking Requirements
                                            </h4>
                                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                                {data.has_variants && (
                                                    <li>• Product Table मा "Add Variant" button देखिनेछ</li>
                                                )}
                                                {data.has_serial_number && (
                                                    <li>• Stock In गर्दा प्रत्येक unit को Serial Number input गर्नुपर्नेछ</li>
                                                )}
                                                {data.has_batch && (
                                                    <li>• Stock In/Out गर्दा Batch Number अनिवार्य हुनेछ</li>
                                                )}
                                                {data.has_expiry && (
                                                    <li>• Stock In गर्दा Expiry Date अनिवार्य, Sale मा expired stock block हुनेछ</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                       
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sticky top-24 space-y-6">
                                
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Product Image
                                    </h2>
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Camera className="w-4 h-4" /> Choose File
                                        </button>
                                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />
                                        
                                        {previewImage ? (
                                            <div className="relative group">
                                                <img src={previewImage} alt="Preview" className="w-full h-48 object-contain rounded-lg border-2 border-emerald-200 dark:border-emerald-800 bg-gray-50 dark:bg-slate-900" />
                                                <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 bg-gray-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">No image uploaded</p>
                                                </div>
                                            </div>
                                        )}
                                        {errors.image && (
                                            <p className="text-xs text-red-500 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" /> {errors.image}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or WEBP. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <FormInput name="tax_rate" label="Tax Rate (%)" type="number" value={data.tax_rate} onChange={(v) => setData('tax_rate', v)} error={errors.tax_rate} placeholder="e.g., 13" />
                                    <FormInput name="low_stock_threshold" label="Low Stock Threshold" type="number" value={data.low_stock_threshold} onChange={(v) => setData('low_stock_threshold', v)} error={errors.low_stock_threshold} placeholder="e.g., 10" />
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <Button type="submit" isLoading={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3">
                                        {processing ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
                                        ) : (
                                            <><Save className="w-5 h-5 mr-2" /> {isEdit ? 'Update Product' : 'Create Product'}</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}