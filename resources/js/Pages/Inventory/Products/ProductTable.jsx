import { Link } from '@inertiajs/react';
import { Package, Tag, Pencil, Trash2, Layers } from 'lucide-react';
import Button from '@/Components/UI/Button';

export default function ProductTable({ products, onStatusChange, onDelete, onManageVariants }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="table-th">Product</th>
                            <th className="table-th">Category</th>
                            <th className="table-th">Brand</th>
                            <th className="table-th">Unit</th>
                            <th className="table-th">Variants</th>
                            <th className="table-th">Price</th>
                            <th className="table-th">Status</th>
                            <th className="table-th text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <td className="table-td">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-slate-600"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {product.name}
                                                </div>

                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {product.sku || 'No SKU'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {product.category?.name || '-'}
                                    </td>

                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {product.brand?.name || '-'}
                                    </td>

                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {product.unit?.name || '-'}
                                    </td>

                                  
                                   <td className="table-td">
                                        {product.has_variants ? (
                                            <button
                                                type="button"
                                                onClick={() => onManageVariants(product)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 transition-colors"
                                                title="Manage Variants"
                                            >
                                                <Layers className="w-3.5 h-3.5" />

                                                {product.variants_count > 0
                                                    ? `${product.variants_count} Variants`
                                                    : '+ Add Variant'}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                None
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-td font-medium text-gray-900 dark:text-white">
                                        Rs. {Number(product.selling_price || 0).toFixed(2)}
                                    </td>

                                    <td className="table-td">
                                        <button
                                            type="button"
                                            onClick={() => onStatusChange(product.id, product.status)}
                                            aria-label={`Change ${product.name} status`}
                                            aria-pressed={product.status === 'active'}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                product.status === 'active'
                                                    ? 'bg-emerald-600'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                    product.status === 'active'
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </td>

                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Link href={route('inventory.products.edit', product.id)}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => onDelete(product.id, product.name)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8" 
                                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm">No products found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}