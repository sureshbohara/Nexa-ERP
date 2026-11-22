import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import BrandFormModal from './FormModal';
import { Tag, Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function BrandsIndex({ brands = [] }) {
    const list = Array.isArray(brands) ? brands : [];

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        {
            label: 'Brands',
            href: route('inventory.brands.index'),
        },
    ];

    const filtered = list.filter((brand) =>
        brand.name?.toLowerCase().includes(search.toLowerCase()) ||
        brand.code?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setEditing(null);
        setIsModalOpen(true);
    };

    const handleEdit = (brand) => {
        setEditing(brand);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        router.delete(route('inventory.brands.destroy', id), {
            preserveScroll: true,
        });
    };

    const handleStatus = (id, status) => {
        router.post(
            route('inventory.brands.status', id),
            {
                status: status === 'active' ? 'inactive' : 'active',
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout title="Brands">
            <Head title="Brand Management" />

            <div className="space-y-3">

          
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb
                        title="Inventory"
                        subTitle="Brand List"
                        breadcrumbItems={breadcrumbItems}
                    />

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleCreate}
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create Brand
                    </Button>
                </div>

          
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search brand name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

           
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">

                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Brand</th>
                                    <th className="table-th">Code</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">

                                {filtered.map((brand) => (
                                    <tr
                                        key={brand.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                                    >

                               
                                        <td className="table-td">
                                            <div className="flex items-center gap-2">

                                                {brand.logo_url &&
                                                brand.logo_url !== '/default/noimage.png' ? (
                                                    <img
                                                        src={brand.logo_url}
                                                        alt={brand.name}
                                                        className="w-8 h-8 rounded object-cover border border-gray-200 dark:border-slate-600"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                        <Tag className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                )}

                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {brand.name}
                                                </span>
                                            </div>
                                        </td>

                                
                                        <td className="table-td text-gray-600 dark:text-gray-300">
                                            {brand.code || '-'}
                                        </td>

                            
                                        <td className="table-td">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatus(brand.id, brand.status)
                                                }
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    brand.status === 'active'
                                                        ? 'bg-emerald-600'
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                                title="Change status"
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                        brand.status === 'active'
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </td>

                             
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end gap-1">

                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(brand)}
                                                    title="Edit Brand"
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(brand.id, brand.name)
                                                    }
                                                    title="Delete Brand"
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            No brands found
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        
            <BrandFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editing={editing}
                onSuccess={handleSuccess}
            />

        </AppLayout>
    );
}
