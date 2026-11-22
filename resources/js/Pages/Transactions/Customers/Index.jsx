import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, Users, DollarSign } from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import CustomerTable from './CustomerTable';
import CustomerFormModal from './FormModal';

export default function CustomersIndex({ customers }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const customerList = Array.isArray(customers) ? customers : [];

    const breadcrumbItems = [
        { label: 'Transactions', href: '#' },
        { label: 'Customers', href: route('transactions.customers.index') },
    ];

    const filteredCustomers = customerList.filter((customer) => {
        const searchTerm = search.toLowerCase();
        return (
            customer.name?.toLowerCase().includes(searchTerm) ||
            customer.code?.toLowerCase().includes(searchTerm) ||
            customer.phone?.includes(searchTerm)
        );
    });

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(route('transactions.customers.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleStatus = (id, status) => {
        const newStatus = status === 'active' ? 'inactive' : 'active';
        router.post(
            route('transactions.customers.status', id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleEdit = (customer) => {
        setEditing(customer);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditing(null);
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

    return (
        <AppLayout title="Customers">
            <Head title="Customer Management" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb
                        title="Transactions"
                        subTitle="Customers"
                        breadcrumbItems={breadcrumbItems}
                    />

                    <Button variant="primary" size="md" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create Customer
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, code, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm"
                        />
                    </div>
                </div>

                <CustomerTable
                    customers={filteredCustomers}
                    onStatusChange={handleStatus}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            </div>

            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editing={editing}
                onSuccess={handleSuccess}
            />
        </AppLayout>
    );
}