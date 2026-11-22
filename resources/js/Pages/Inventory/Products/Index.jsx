import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import ProductTable from './ProductTable';
import VariantsModal from './VariantsModal'; 

export default function ProductsIndex({ products }) {
    const [search, setSearch] = useState('');
    const [variantProduct, setVariantProduct] = useState(null); 

    const productList = Array.isArray(products) ? products : [];

    const breadcrumbItems = [
        { label: 'Inventory', href: '#' },
        { label: 'Products', href: route('inventory.products.index') },
    ];

    const filteredProducts = productList.filter((product) => {
        const searchTerm = search.toLowerCase();
        return (
            product.name?.toLowerCase().includes(searchTerm) ||
            product.sku?.toLowerCase().includes(searchTerm) ||
            product.barcode?.toLowerCase().includes(searchTerm)
        );
    });

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(route('inventory.products.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleStatus = (id, status) => {
        const newStatus = status === 'active' ? 'inactive' : 'active';
        router.post(
            route('inventory.products.status', id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

  
    const handleManageVariants = (product) => {
        setVariantProduct(product);
    };

    return (
        <AppLayout title="Products">
            <Head title="Product Management" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb
                        title="Inventory"
                        subTitle="Products"
                        breadcrumbItems={breadcrumbItems}
                    />

                    <Link href={route('inventory.products.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Product
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or barcode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

                <ProductTable
                    products={filteredProducts}
                    onStatusChange={handleStatus}
                    onDelete={handleDelete}
                    onManageVariants={handleManageVariants} 
                />
            </div>

         
            <VariantsModal 
                product={variantProduct} 
                onClose={() => setVariantProduct(null)} 
            />
        </AppLayout>
    );
}