import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Bell, Check, Trash2, AlertCircle } from 'lucide-react';

export default function NotificationsIndex({ notifications, unreadCount }) {
    const list = Array.isArray(notifications) ? notifications : [];

    const handleMarkRead = (id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const handleMarkAllRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this notification?')) {
            router.delete(route('notifications.destroy', id), { preserveScroll: true });
        }
    };

    const priorityColors = {
        low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <AppLayout title="Notifications">
            <Head title="Notifications" />
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Breadcrumb title="System" subTitle="Notifications" breadcrumbItems={[{ label: 'System', href: '#' }, { label: 'Notifications', href: route('notifications.index') }]} />
                    {unreadCount > 0 && (
                        <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
                            <Check className="mr-1.5 h-4 w-4" /> Mark All as Read ({unreadCount})
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {list.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No notifications found.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                            {list.map((notif) => (
                                <li key={notif.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{notif.title}</h4>
                                                <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${priorityColors[notif.priority]}`}>{notif.priority}</span>
                                                {!notif.read_at && <span className="w-2 h-2 bg-blue-500 rounded-full" title="Unread"></span>}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{notif.message}</p>
                                            <span className="text-xs text-gray-400">{notif.created_at}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!notif.read_at && (
                                                <button onClick={() => handleMarkRead(notif.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Mark as read">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(notif.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}