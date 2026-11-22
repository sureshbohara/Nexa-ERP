import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Trash2, Eye, Wallet, Loader2 } from 'lucide-react';
import Button from '@/Components/UI/Button';
import { SALE_STATUS_OPTIONS, DELIVERY_STATUS_OPTIONS } from '@/Services/saleService';
import { useState } from 'react';

export default function SaleTable({ sales, onDelete, onAddPayment }) {
    const [loadingId, setLoadingId] = useState(null); 

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const paymentColors = {
        paid: 'bg-emerald-100 text-emerald-800',
        partial: 'bg-blue-100 text-blue-800',
        due: 'bg-red-100 text-red-800',
    };

 
    const handleStatusChange = (saleId, field, newValue) => {

        if (field === 'status' && newValue === 'completed') {
            if (!confirm('Are you sure? Completing this sale will deduct stock and finalize the invoice.')) {
                return; 
            }
        }

        setLoadingId(saleId); 

        router.patch(
            route('transactions.sales.update-field', saleId),
            { field: field, value: newValue },
            {
                preserveScroll: true,
                onSuccess: () => setLoadingId(null),
                onError: () => {
                    setLoadingId(null);
                    alert('Failed to update status. Please try again.');
                }
            }
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="table-th">Invoice No</th>
                            <th className="table-th">Customer</th>
                            <th className="table-th">Date</th>
                            <th className="table-th">Total</th>
                            <th className="table-th">Payment</th>
                            <th className="table-th">Delivery</th>
                            <th className="table-th">Status</th>
                            <th className="table-th text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {sales.length > 0 ? (
                            sales.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="table-td font-mono text-sm">{s.reference_no}</td>
                                    <td className="table-td">{s.customer?.name || '-'}</td>
                                    <td className="table-td">{s.sale_date}</td>
                                    <td className="table-td font-semibold">Rs. {Number(s.total_amount || 0).toFixed(2)}</td>
                                    
                                    <td className="table-td">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentColors[s.payment_status] || 'bg-gray-100'}`}>
                                            {s.payment_status?.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* 👇 Delivery Status Dropdown */}
                                    <td className="table-td">
                                        <select 
                                            value={s.delivery_status || 'pending'}
                                            onChange={(e) => handleStatusChange(s.id, 'delivery_status', e.target.value)}
                                            disabled={loadingId === s.id}
                                            className="text-xs border border-gray-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer disabled:opacity-50"
                                        >
                                            {DELIVERY_STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </td>

                                  
                                    <td className="table-td">
                                        <select 
                                            value={s.status || 'pending'}
                                            onChange={(e) => handleStatusChange(s.id, 'status', e.target.value)}
                                            disabled={loadingId === s.id}
                                            className={`text-xs font-semibold border rounded px-2 py-1 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer disabled:opacity-50 ${statusColors[s.status] || ''}`}
                                        >
                                            {SALE_STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {s.status !== 'cancelled' && s.payment_status !== 'paid' && (
                                                <button onClick={() => onAddPayment(s)} className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition">
                                                    <Wallet className="w-3.5 h-3.5 mr-1" /> Pay
                                                </button>
                                            )}
                                            <Link href={route('transactions.sales.edit', s.id)}>
                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDelete(s.id, s.reference_no)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No sales found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}