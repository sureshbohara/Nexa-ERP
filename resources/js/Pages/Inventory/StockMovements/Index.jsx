import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeftRight, User } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';

export default function StockMovementsIndex({ movements, products }) {
  
    const [filters, setFilters] = useState({ product_id: '', type: '' });

   
    const movementList = movements?.data || movements || [];
    
    const typeColors = {
        stock_in: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        stock_out: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        adjustment: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        transfer: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        { label: 'Stock Movements', href: route('inventory.stock-movements.index') },
    ];

 
    const filteredMovements = useMemo(() => {
        return movementList.filter((m) => {
            const matchProduct = !filters.product_id || String(m.product_id) === String(filters.product_id);
            const matchType = !filters.type || m.type === filters.type;
            return matchProduct && matchType;
        });
    }, [movementList, filters]);


    const formatReferenceId = (refId) => {
        if (!refId) return '-';
        return refId.length > 8 ? `${refId.substring(0, 8)}...` : refId;
    };

    const formatQuantity = (type, quantity) => {
        const sign = type === 'stock_out' ? '-' : '+';
        const colorClass = type === 'stock_out' ? 'text-red-600' : 'text-emerald-600';
        return <span className={`font-bold ${colorClass}`}>{sign}{quantity}</span>;
    };

    return (
        <AppLayout title="Stock Movements">
            <Head title="Stock Movements" />
            
            <div className="space-y-4">
                {/* Header & Breadcrumb */}
                <Breadcrumb
                    title="Inventory"
                    subTitle="Stock Movements"
                    breadcrumbItems={breadcrumbItems}
                />

           
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <FormInput 
                                name="product_id" 
                                label="Filter by Product" 
                                type="select" 
                                value={filters.product_id} 
                                onChange={(v) => setFilters({ ...filters, product_id: v })} 
                                options={[
                                    { value: '', label: 'All Products' }, 
                                    ...products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }))
                                ]} 
                            />
                        </div>
                        <div className="flex-1">
                            <FormInput 
                                name="type" 
                                label="Filter by Type" 
                                type="select" 
                                value={filters.type} 
                                onChange={(v) => setFilters({ ...filters, type: v })} 
                                options={[
                                    { value: '', label: 'All Types' }, 
                                    { value: 'stock_in', label: 'Stock In' }, 
                                    { value: 'stock_out', label: 'Stock Out' }, 
                                    { value: 'adjustment', label: 'Adjustment' },
                                    { value: 'transfer', label: 'Transfer' }
                                ]} 
                            />
                        </div>
                    </div>
                </div>

              
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Ref ID</th>
                                    <th className="table-th">Date & Time</th>
                                    <th className="table-th">Product</th>
                                    <th className="table-th">Warehouse</th>
                                    <th className="table-th">Type</th>
                                    <th className="table-th">Quantity</th>
                                    <th className="table-th">User</th>
                                    <th className="table-th">Notes</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredMovements.length > 0 ? (
                                    filteredMovements.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            
                                     
                                            <td className="table-td text-xs font-mono text-gray-500" title={m.reference_id || ''}>
                                                {formatReferenceId(m.reference_id)}
                                            </td>

                                    
                                            <td className="table-td text-xs whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                {new Date(m.created_at).toLocaleString()}
                                            </td>

                                        
                                            <td className="table-td">
                                                <div className="font-medium text-gray-900 dark:text-white">{m.product?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{m.product?.sku || 'No SKU'}</div>
                                            </td>

                                       
                                            <td className="table-td text-gray-600 dark:text-gray-300">
                                                {m.warehouse?.name || '-'}
                                            </td>

                                          
                                            <td className="table-td">
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${typeColors[m.type] || 'bg-gray-100 text-gray-800'}`}>
                                                    {m.type.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>

                                      
                                            <td className="table-td">
                                                {formatQuantity(m.type, m.quantity)}
                                            </td>

                                   
                                            <td className="table-td text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> 
                                                {m.user ? `${m.user.first_name} ${m.user.last_name}` : 'System'}
                                            </td>

                                            
                                            <td className="table-td text-xs text-gray-500 max-w-[200px] truncate" title={m.notes || ''}>
                                                {m.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium">No stock movements found</p>
                                            <p className="text-xs mt-1">Try changing your filters above</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}