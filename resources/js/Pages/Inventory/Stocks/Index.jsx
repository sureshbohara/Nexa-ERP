import { Head, router } from '@inertiajs/react'; 
import { useMemo, useState } from 'react';

import AppLayout from '@/Components/Layouts/AppLayout';
import useStockForm from '@/Hooks/useStockForm';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';

import {
    STOCK_ADJUSTMENT_OPTIONS,
    filterStocks,
    formatStockDate,
    getStockStatus,
    getStockSummary,
} from '@/Services/stockService';

import { ArrowLeftRight, Package } from 'lucide-react';

export default function Index({ stocks = [], products = [], warehouses = [] }) {
    const [search, setSearch] = useState('');
    

    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [serialNumbers, setSerialNumbers] = useState('');

  
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferData, setTransferData] = useState({
        product_id: '',
        source_warehouse_id: '',
        destination_warehouse_id: '',
        quantity: '',
        notes: '',
    });
    const [transferErrors, setTransferErrors] = useState({});
    const [transferProcessing, setTransferProcessing] = useState(false);

    const { data, setData, processing, errors, submit, reset } = useStockForm();

    const summary = useMemo(() => getStockSummary(stocks), [stocks]);
    const filteredStocks = useMemo(() => filterStocks(stocks, search), [stocks, search]);

 
    const openAdjustModal = () => {
        reset();
        setSelectedProduct(null);
        setSerialNumbers('');
        setIsAdjustModalOpen(true);
    };

    const closeAdjustModal = () => {
        if (processing) return;
        reset();
        setSelectedProduct(null);
        setSerialNumbers('');
        setIsAdjustModalOpen(false);
    };

    const handleProductChange = (event) => {
        const productId = event.target.value;
        setData('product_id', productId);
        
        const product = products.find(p => p.id == productId);
        setSelectedProduct(product || null);
        
        if (!product?.has_batch) setData('batch_number', '');
        if (!product?.has_expiry) setData('expiry_date', '');
        setSerialNumbers('');
    };

    const handleAdjustSubmit = (event) => {
        event.preventDefault();

        if (selectedProduct?.has_serial_number && data.type === 'stock_in') {
            const enteredCount = serialNumbers.split('\n').filter(Boolean).length;
            const requiredCount = parseInt(data.quantity) || 0;
            
            if (enteredCount !== requiredCount) {
                alert(`Please enter exactly ${requiredCount} serial numbers.`);
                return;
            }
            
            const finalNotes = `${data.notes}\n\nSerial Numbers:\n${serialNumbers}`.trim();
            setData('notes', finalNotes);
        }

        submit(() => {
            setIsAdjustModalOpen(false);
        });
    };


    const openTransferModal = () => {
        setTransferData({
            product_id: '',
            source_warehouse_id: '',
            destination_warehouse_id: '',
            quantity: '',
            notes: '',
        });
        setTransferErrors({});
        setIsTransferModalOpen(true);
    };

    const closeTransferModal = () => {
        if (transferProcessing) return;
        setIsTransferModalOpen(false);
    };

    const handleTransferChange = (name, value) => {
        setTransferData((prev) => ({ ...prev, [name]: value }));
        if (transferErrors[name]) {
            setTransferErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleTransferSubmit = (event) => {
        event.preventDefault();
        if (transferProcessing) return;

        setTransferProcessing(true);
        setTransferErrors({});

        router.post(route('inventory.stocks.transfer'), transferData, {
            preserveScroll: true,
            onSuccess: () => {
                setTransferProcessing(false);
                setIsTransferModalOpen(false);
            },
            onError: (validationErrors) => {
                setTransferProcessing(false);
                setTransferErrors(validationErrors);
            },
        });
    };

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        { label: 'Stock', href: route('inventory.stocks.index') },
    ];

    return (
        <AppLayout>
            <Head title="Stock Management" />

            <div className="space-y-3">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <Breadcrumb title="Inventory" subTitle="Stock List" breadcrumbItems={breadcrumbItems} />
                    
                    <div className="flex gap-2">
                        <Button variant="primary" onClick={openAdjustModal}>
                            <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                            Adjust Stock
                        </Button>
                        <Button variant="secondary" onClick={openTransferModal}>
                            <Package className="w-4 h-4 mr-1.5" />
                            Transfer Stock
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard title="Total Quantity" value={summary.totalQuantity.toLocaleString()} description="Total units currently recorded" color="indigo" />
                    <SummaryCard title="In Stock" value={summary.inStock} description="Stock records above 10 units" color="green" />
                    <SummaryCard title="Low Stock" value={summary.lowStock} description="Stock records with 1–10 units" color="amber" />
                    <SummaryCard title="Out of Stock" value={summary.outOfStock} description="Stock records with zero units" color="red" />
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-900">Stock Overview</h2>
                            <p className="mt-1 text-sm text-gray-500">{filteredStocks.length} stock records found</p>
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search product, SKU, warehouse..."
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <TableHeading>Product</TableHeading>
                                    <TableHeading>Warehouse</TableHeading>
                                    <TableHeading>Batch Number</TableHeading>
                                    <TableHeading>Expiry Date</TableHeading>
                                    <TableHeading>Quantity</TableHeading>
                                    <TableHeading>Status</TableHeading>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredStocks.length > 0 ? (
                                    filteredStocks.map((stock) => {
                                        const status = getStockStatus(stock.quantity);
                                        return (
                                            <tr key={stock.id} className="transition hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-gray-900">{stock.product?.name || '—'}</div>
                                                    <div className="mt-1 text-xs text-gray-500">SKU: {stock.product?.sku || '—'}</div>
                                                </td>
                                                <td className="px-4 py-4 text-gray-600">{stock.warehouse?.name || '—'}</td>
                                                <td className="px-4 py-4 text-gray-600">{stock.batch_number || '—'}</td>
                                                <td className="px-4 py-4 text-gray-600">{formatStockDate(stock.expiry_date)}</td>
                                                <td className="px-4 py-4 font-semibold tabular-nums text-gray-900">
                                                    {Number(stock.quantity || 0).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <p className="font-medium text-gray-700">No stock records found</p>
                                            <p className="mt-1 text-sm text-gray-500">Try another search or add a stock adjustment.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {isAdjustModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeAdjustModal();
                    }}
                >
                    <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Adjust Stock</h2>
                                <p className="mt-1 text-sm text-gray-500">Add, remove, or correct inventory quantity.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAdjustModal}
                                disabled={processing}
                                className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAdjustSubmit}>
                            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                                <FormField label="Product" error={errors.product_id}>
                                    <select
                                        value={data.product_id}
                                        onChange={handleProductChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} {product.sku ? `(${product.sku})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Warehouse" error={errors.warehouse_id}>
                                    <select
                                        value={data.warehouse_id}
                                        onChange={(event) => setData('warehouse_id', event.target.value)}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select warehouse</option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Adjustment Type" error={errors.type}>
                                    <select
                                        value={data.type}
                                        onChange={(event) => setData('type', event.target.value)}
                                        className="form-input"
                                        required
                                    >
                                        {STOCK_ADJUSTMENT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {STOCK_ADJUSTMENT_OPTIONS.find((option) => option.value === data.type)?.description}
                                    </p>
                                </FormField>

                                <FormField label={data.type === 'adjustment' ? 'New Total Quantity' : 'Quantity'} error={errors.quantity}>
                                    <input
                                        type="number"
                                        min={data.type === 'adjustment' ? '0' : '1'}
                                        step="1"
                                        value={data.quantity}
                                        onChange={(event) => setData('quantity', event.target.value)}
                                        placeholder="Enter quantity"
                                        className="form-input"
                                        required
                                    />
                                </FormField>

                                {selectedProduct?.has_batch && (
                                    <FormField label="Batch Number" error={errors.batch_number}>
                                        <input
                                            type="text"
                                            value={data.batch_number}
                                            onChange={(event) => setData('batch_number', event.target.value)}
                                            placeholder="e.g., B-2024-01"
                                            className="form-input"
                                            required={data.type === 'stock_in'}
                                        />
                                    </FormField>
                                )}

                                {selectedProduct?.has_expiry && (
                                    <FormField label="Expiry Date" error={errors.expiry_date}>
                                        <input
                                            type="date"
                                            value={data.expiry_date}
                                            onChange={(event) => setData('expiry_date', event.target.value)}
                                            className="form-input"
                                            required={data.type === 'stock_in'}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </FormField>
                                )}

                                {selectedProduct?.has_serial_number && data.type === 'stock_in' && (
                                    <div className="sm:col-span-2">
                                        <FormField label="Serial Numbers" error={errors.serial_numbers}>
                                            <textarea
                                                rows="4"
                                                value={serialNumbers}
                                                onChange={(event) => setSerialNumbers(event.target.value)}
                                                placeholder={`Enter one serial number per line (${data.quantity || 0} required)`}
                                                className="form-input resize-none font-mono text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                {serialNumbers.split('\n').filter(Boolean).length} / {data.quantity || 0} entered
                                            </p>
                                        </FormField>
                                    </div>
                                )}

                                <div className="sm:col-span-2">
                                    <FormField label="Notes" error={errors.notes}>
                                        <textarea
                                            rows="3"
                                            value={data.notes}
                                            onChange={(event) => setData('notes', event.target.value)}
                                            placeholder="Add a note (optional)"
                                            className="form-input resize-none"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
                                <Button type="button" variant="secondary" onClick={closeAdjustModal} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Adjustment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

     
            <Modal
                isOpen={isTransferModalOpen}
                onClose={closeTransferModal}
                title="Transfer Stock Between Warehouses"
                size="lg"
            >
                <form onSubmit={handleTransferSubmit} className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> Stock will be deducted from the source warehouse and added to the destination warehouse. 
                        Both movements will be logged with the same reference ID.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            name="product_id"
                            label="Product"
                            type="select"
                            value={transferData.product_id}
                            onChange={(v) => handleTransferChange('product_id', v)}
                            error={transferErrors.product_id}
                            options={[
                                { value: '', label: '-- Select Product --' },
                                ...products.map(p => ({ 
                                    value: p.id, 
                                    label: `${p.name} (${p.sku || 'No SKU'})` 
                                }))
                            ]}
                            required
                        />

                        <FormInput
                            name="source_warehouse_id"
                            label="Source Warehouse (From)"
                            type="select"
                            value={transferData.source_warehouse_id}
                            onChange={(v) => handleTransferChange('source_warehouse_id', v)}
                            error={transferErrors.source_warehouse_id}
                            options={[
                                { value: '', label: '-- Select Source --' },
                                ...warehouses.map(w => ({ value: w.id, label: w.name }))
                            ]}
                            required
                        />

                        <FormInput
                            name="destination_warehouse_id"
                            label="Destination Warehouse (To)"
                            type="select"
                            value={transferData.destination_warehouse_id}
                            onChange={(v) => handleTransferChange('destination_warehouse_id', v)}
                            error={transferErrors.destination_warehouse_id}
                            options={[
                                { value: '', label: '-- Select Destination --' },
                                ...warehouses
                                    .filter(w => w.id != transferData.source_warehouse_id)
                                    .map(w => ({ value: w.id, label: w.name }))
                            ]}
                            required
                        />

                        <FormInput
                            name="quantity"
                            label="Quantity to Transfer"
                            type="number"
                            value={transferData.quantity}
                            onChange={(v) => handleTransferChange('quantity', v)}
                            error={transferErrors.quantity}
                            placeholder="0"
                            min="1"
                            required
                        />
                    </div>

                    <FormInput
                        name="notes"
                        label="Notes (Optional)"
                        type="textarea"
                        value={transferData.notes}
                        onChange={(v) => handleTransferChange('notes', v)}
                        error={transferErrors.notes}
                        rows={2}
                        placeholder="e.g., Monthly stock redistribution"
                    />

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={closeTransferModal} disabled={transferProcessing}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={transferProcessing}>
                            {transferProcessing ? (
                                <><ArrowLeftRight className="w-4 h-4 mr-1.5 animate-spin" /> Transferring...</>
                            ) : (
                                <><ArrowLeftRight className="w-4 h-4 mr-1.5" /> Transfer Stock</>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

function SummaryCard({ title, value, description, color }) {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-700',
        green: 'bg-green-50 text-green-700',
        amber: 'bg-amber-50 text-amber-700',
        red: 'bg-red-50 text-red-700',
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${colorClasses[color]}`}>{title}</span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
    );
}

function TableHeading({ children }) {
    return (
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            {children}
        </th>
    );
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}