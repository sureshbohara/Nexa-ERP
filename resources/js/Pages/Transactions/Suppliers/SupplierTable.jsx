import { Users, Pencil, Trash2, DollarSign } from 'lucide-react';
import Button from '@/Components/UI/Button';

export default function SupplierTable({ suppliers, onStatusChange, onDelete, onEdit }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="table-th">Supplier</th>
                            <th className="table-th">Contact Person</th>
                            <th className="table-th">Phone</th>
                            <th className="table-th">Due Amount</th>
                            <th className="table-th">Status</th>
                            <th className="table-th text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <td className="table-td">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>

                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {supplier.name}
                                                </div>

                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {supplier.code}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {supplier.contact_person || '-'}
                                    </td>

                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {supplier.phone}
                                    </td>

                                    <td className="table-td font-semibold text-red-600 flex items-center gap-1">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        {Number(supplier.due_amount || 0).toFixed(2)}
                                    </td>

                                    <td className="table-td">
                                        <button
                                            type="button"
                                            onClick={() => onStatusChange(supplier.id, supplier.status)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                supplier.status === 'active'
                                                    ? 'bg-emerald-600'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                    supplier.status === 'active'
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </td>

                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                onClick={() => onEdit(supplier)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => onDelete(supplier.id, supplier.name)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm">No suppliers found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}