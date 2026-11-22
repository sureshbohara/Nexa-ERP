import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, ShoppingCart } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import PurchaseTable from './PurchaseTable';
import PurchasePaymentModal from './PurchasePaymentModal';

export default function PurchasesIndex({ purchases }) {
    const [search, setSearch] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const purchaseList = Array.isArray(purchases) ? purchases : [];

    const breadcrumbItems = [
        { label: 'Transactions', href: '#' },
        { label: 'Purchases', href: route('transactions.purchases.index') },
    ];

    const filteredPurchases = purchaseList.filter((p) => {
        const term = search.toLowerCase();
        return (
            p.reference_no?.toLowerCase().includes(term) ||
            p.supplier?.name?.toLowerCase().includes(term)
        );
    });

    const handleDelete = (id, refNo) => {
        if (confirm(`Delete Purchase ${refNo}?`)) {
            router.delete(route('transactions.purchases.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const openPaymentModal = (purchase) => {
        setSelectedPurchase(purchase);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setSelectedPurchase(null);
    };

    return (
        <AppLayout title="Purchases">
            <Head title="Purchase Management" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb
                        title="Transactions"
                        subTitle="Purchases"
                        breadcrumbItems={breadcrumbItems}
                    />
                    <Link href={route('transactions.purchases.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Purchase
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Reference No or Supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

                <PurchaseTable
                    purchases={filteredPurchases}
                    onDelete={handleDelete}
                    onAddPayment={openPaymentModal}
                />
            </div>

         
            <PurchasePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                purchase={selectedPurchase}
                onSuccess={handlePaymentSuccess}
            />
        </AppLayout>
    );
}