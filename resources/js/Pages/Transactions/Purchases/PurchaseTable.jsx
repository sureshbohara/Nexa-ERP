import { Link } from '@inertiajs/react';
import { ShoppingCart, Trash2, Eye, Wallet } from 'lucide-react';
import Button from '@/Components/UI/Button';

export default function PurchaseTable({ purchases, onDelete, onAddPayment }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentColors = {
        paid: 'bg-emerald-100 text-emerald-800',
        partial: 'bg-blue-100 text-blue-800',
        due: 'bg-red-100 text-red-800',
        overdue: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="table-th">Reference No</th>
                            <th className="table-th">Supplier</th>
                            <th className="table-th">Date</th>
                            <th className="table-th">Total Amount</th>
                            <th className="table-th">Status</th>
                            <th className="table-th">Payment</th>
                            <th className="table-th text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {purchases.length > 0 ? (
                            purchases.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="table-td font-mono text-sm text-gray-900 dark:text-white">{p.reference_no}</td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">{p.supplier?.name || '-'}</td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">{p.purchase_date}</td>
                                    <td className="table-td font-semibold text-gray-900 dark:text-white">Rs. {Number(p.total_amount || 0).toFixed(2)}</td>
                                    
                                    <td className="table-td">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[p.status] || 'bg-gray-100'}`}>
                                            {p.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    
                                    <td className="table-td">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentColors[p.payment_status] || 'bg-gray-100'}`}>
                                            {p.payment_status?.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {p.status !== 'cancelled' && p.payment_status !== 'paid' && (
                                                <button 
                                                    onClick={() => onAddPayment(p)}
                                                    className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded border border-emerald-200 dark:border-emerald-800 transition"
                                                    title="Add Payment"
                                                >
                                                    <Wallet className="w-3.5 h-3.5 mr-1" /> Pay
                                                </button>
                                            )}
                                            
                                            <Link href={route('transactions.purchases.edit', p.id)}>
                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                            
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50" onClick={() => onDelete(p.id, p.reference_no)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No purchases found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}