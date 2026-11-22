import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, ShoppingCart } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import SaleTable from './SaleTable';
import SalePaymentModal from './SalePaymentModal';

export default function SalesIndex({ sales }) {
    const [search, setSearch] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const saleList = Array.isArray(sales) ? sales : [];

    const breadcrumbItems = [
        { label: 'Transactions', href: '#' },
        { label: 'Sales', href: route('transactions.sales.index') },
    ];

    const filteredSales = saleList.filter((s) => {
        const term = search.toLowerCase();
        return s.reference_no?.toLowerCase().includes(term) || s.customer?.name?.toLowerCase().includes(term);
    });

    const handleDelete = (id, refNo) => {
        if (confirm(`Delete Sale ${refNo}?`)) {
            router.delete(route('transactions.sales.destroy', id), { preserveScroll: true });
        }
    };

    const openPaymentModal = (sale) => {
        setSelectedSale(sale);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setSelectedSale(null);
    };

    return (
        <AppLayout title="Sales">
            <Head title="Sales Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="Transactions" subTitle="Sales" breadcrumbItems={breadcrumbItems} />
                    <Link href={route('transactions.sales.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Sale
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by Invoice No or Customer..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" 
                        />
                    </div>
                </div>

                {/* Sale Table Component */}
                <SaleTable 
                    sales={filteredSales} 
                    onDelete={handleDelete} 
                    onAddPayment={openPaymentModal} 
                />
            </div>

            {/* Payment Modal Component */}
            <SalePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                sale={selectedSale}
                onSuccess={handlePaymentSuccess}
            />
        </AppLayout>
    );
}