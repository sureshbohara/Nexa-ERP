import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, Plus, Trash2, Save, Loader2, FileText, 
    RefreshCcw, Calculator, Info, CheckCircle2
} from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { usePurchaseReturnForm } from '@/Hooks/usePurchaseReturnForm';
import { RETURN_STATUS_OPTIONS } from '@/Services/purchaseReturnService';

export default function PurchaseReturnForm({
    purchaseReturn, suppliers, purchases, products, warehouses
}) {
    const isEdit = !!purchaseReturn;

    const {
        data, setData, processing, errors,
        submit, addItem, removeItem, updateItem
    } = usePurchaseReturnForm(purchaseReturn, isEdit);

    const supplierOptions = [
        { value: '', label: '-- Select Supplier --' },
        ...(suppliers || []).map(s => ({ value: s.id, label: s.name }))
    ];
    const purchaseOptions = [
        { value: '', label: '-- Select Original Purchase (Optional) --' },
        ...(purchases || []).map(p => ({ value: p.id, label: `${p.reference_no} (Rs. ${p.total_amount})` }))
    ];
    const productOptions = [
        { value: '', label: '-- Select Product --' },
        ...(products || []).map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }))
    ];
    const warehouseOptions = [
        { value: '', label: '-- Select Warehouse --' },
        ...(warehouses || []).map(w => ({ value: w.id, label: w.name }))
    ];

    const subtotal = data.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const taxAmount = parseFloat(data.tax_amount) || 0;
    const discountAmount = parseFloat(data.discount_amount) || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const inputClass = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition';

    return (
        <AppLayout title={isEdit ? 'Edit Purchase Return' : 'Create Purchase Return'}>
            <Head title={isEdit ? 'Edit Purchase Return' : 'Create Purchase Return'} />

            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Transactions" subTitle={isEdit ? 'Edit Purchase Return' : 'Create Purchase Return'} 
                        breadcrumbItems={[{ label: 'Transactions', href: '#' }, { label: 'Purchase Returns', href: route('transactions.purchase-returns.index') }]} 
                    />
                    <Link href={route('transactions.purchase-returns.index')}>
                        <Button variant="secondary" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back to List</Button>
                    </Link>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* LEFT SIDE */}
                        <div className="lg:col-span-2 space-y-5">
                            
                            {/* Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Quick Instructions</h3>
                                        <ul className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200">
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Select supplier and original purchase (optional)</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Add returned products with quantity and price</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Review totals and set return status on the right</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Details Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Return Details</h2>
                                            <p className="text-xs text-gray-500 mt-0.5">Enter supplier and return information</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput name="supplier_id" label="Supplier" type="select" value={data.supplier_id} onChange={(v) => setData('supplier_id', v)} error={errors.supplier_id} options={supplierOptions} required />
                                            <FormInput name="purchase_id" label="Original Purchase" type="select" value={data.purchase_id} onChange={(v) => setData('purchase_id', v)} error={errors.purchase_id} options={purchaseOptions} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormInput name="reference_no" label="Return Reference No" value={data.reference_no} onChange={(v) => setData('reference_no', v)} error={errors.reference_no} required placeholder="RET-001" />
                                            <FormInput name="return_date" label="Return Date" type="date" value={data.return_date} onChange={(v) => setData('return_date', v)} error={errors.return_date} required />
                                            <FormInput name="warehouse_id" label="Return to Warehouse" type="select" value={data.warehouse_id} onChange={(v) => setData('warehouse_id', v)} error={errors.warehouse_id} options={warehouseOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                                <RefreshCcw className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Return Items</h2>
                                                <p className="text-xs text-gray-500 mt-0.5">Products being returned</p>
                                            </div>
                                        </div>
                                        <Button type="button" variant="primary" size="sm" onClick={addItem}>
                                            <Plus className="w-4 h-4 mr-1.5" /> Add Item
                                        </Button>
                                    </div>

                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                                        <table className="w-full min-w-[650px] text-sm">
                                            <thead className="bg-gray-50 dark:bg-slate-900">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Product</th>
                                                    <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 w-20">Qty</th>
                                                    <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 w-28">Price</th>
                                                    <th className="px-3 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 w-28">Total</th>
                                                    <th className="px-3 py-3 text-center w-12">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                                {data.items.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50/70 dark:hover:bg-slate-700/30 transition">
                                                        <td className="px-3 py-3">
                                                            <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} className={inputClass}>
                                                                {productOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                            </select>
                                                            {errors[`items.${index}.product_id`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.product_id`]}</p>}
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className={inputClass} />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} className={inputClass} />
                                                        </td>
                                                        <td className="px-3 py-3 text-right font-semibold text-gray-800 dark:text-white">{Number(item.total || 0).toFixed(2)}</td>
                                                        <td className="px-3 py-3 text-center">
                                                            <button type="button" disabled={data.items.length === 1} onClick={() => removeItem(index)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
                                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                                        <span>Total Items: {data.items.length}</span>
                                        <span>Amount: Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-700">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30">
                                        <Calculator className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Return Summary</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Total details</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-4">
                                    <div className="flex justify-between text-sm pb-2 border-b border-gray-100 dark:border-slate-700">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">Rs. {subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormInput name="tax_amount" label="Tax Amount" type="number" value={data.tax_amount} onChange={(v) => setData('tax_amount', v)} error={errors.tax_amount} placeholder="0.00" />
                                        <FormInput name="discount_amount" label="Discount" type="number" value={data.discount_amount} onChange={(v) => setData('discount_amount', v)} error={errors.discount_amount} placeholder="0.00" />
                                    </div>

                                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-4">
                                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Total Return Amount</p>
                                        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Rs. {totalAmount.toFixed(2)}</h2>
                                    </div>

                                    <FormInput name="status" label="Return Status" type="select" value={data.status} onChange={(v) => setData('status', v)} error={errors.status} options={RETURN_STATUS_OPTIONS} required />
                                    
                                    <FormInput name="notes" label="Notes" type="textarea" value={data.notes} onChange={(v) => setData('notes', v)} error={errors.notes} rows={2} placeholder="Reason for return..." />

                                    <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                                        <Button type="submit" variant="primary" className="w-full justify-center" disabled={processing}>
                                            {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> {isEdit ? 'Update Return' : 'Create Return'}</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}