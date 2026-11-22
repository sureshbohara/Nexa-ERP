import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    Plus,
    Pencil,
    Trash2,
    Search,
} from 'lucide-react';

import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import HolidayFormModal from './FormModal';

export default function HolidaysIndex({ holidays }) {
    const list = Array.isArray(holidays) ? holidays : [];

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);


    const filteredHolidays = list.filter((holiday) =>
        holiday.name?.toLowerCase().includes(search.toLowerCase())
    );


    const handleCreate = () => {
        setEditing(null);
        setIsModalOpen(true);
    };

    const handleEdit = (holiday) => {
        setEditing(holiday);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleSuccess = () => {
        handleClose();
    };


    const handleDelete = (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        router.delete(route('hrm.holidays.destroy', id), {
            preserveScroll: true,
        });
    };


    const handleStatusToggle = (holiday) => {
        const status = holiday.status === 'active'
            ? 'inactive'
            : 'active';

        router.post(
            route('hrm.holidays.status', holiday.id),
            { status },
            { preserveScroll: true }
        );
    };

    return (
        <AppLayout title="Holidays">
            <Head title="Holiday Management" />

            <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Breadcrumb
                        title="HRM"
                        subTitle="Holidays"
                        breadcrumbItems={[
                            { label: 'HRM', href: '#' },
                            {
                                label: 'Holidays',
                                href: route('hrm.holidays.index'),
                            },
                        ]}
                    />

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleCreate}
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Holiday
                    </Button>
                </div>

            
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search holiday..."
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
                                    <th className="table-th">Name</th>
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Recurring</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredHolidays.length > 0 ? (
                                    filteredHolidays.map((holiday) => (
                                        <tr
                                            key={holiday.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                                        >
                                            <td className="table-td font-medium text-gray-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    {holiday.name}
                                                </div>
                                            </td>

                                            <td className="table-td text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                {holiday.date}
                                            </td>

                                            <td className="table-td text-gray-600 dark:text-gray-300">
                                                {holiday.is_recurring ? 'Yes' : 'No'}
                                            </td>

                                            <td className="table-td">
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={holiday.status === 'active'}
                                                    aria-label={`Toggle ${holiday.name} status`}
                                                    onClick={() => handleStatusToggle(holiday)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        holiday.status === 'active'
                                                            ? 'bg-emerald-600'
                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                            holiday.status === 'active'
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
                                                        onClick={() => handleEdit(holiday)}
                                                        aria-label={`Edit ${holiday.name}`}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(holiday.id, holiday.name)}
                                                        aria-label={`Delete ${holiday.name}`}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No holidays found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            <HolidayFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editing={editing}
                onSuccess={handleSuccess}
            />
        </AppLayout>
    );
}
