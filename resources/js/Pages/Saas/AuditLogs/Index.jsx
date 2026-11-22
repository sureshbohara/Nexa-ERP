import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import { Search, Activity, Eye, X } from 'lucide-react';
import Modal from '@/Components/UI/Modal';
import Button from '@/Components/UI/Button';

export default function AuditLogsIndex({ logs }) {
    const list = Array.isArray(logs) ? logs : [];
    const [search, setSearch] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    const filtered = list.filter(log => 
        log.user_name.toLowerCase().includes(search.toLowerCase()) ||
        log.event.toLowerCase().includes(search.toLowerCase()) ||
        log.auditable_type.toLowerCase().includes(search.toLowerCase())
    );

    const formatJson = (data) => {
        if (!data) return 'No changes recorded';
        try { return JSON.stringify(data, null, 2); } catch (e) { return String(data); }
    };

    return (
        <AppLayout title="Audit Logs">
            <Head title="Audit Logs" />
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Breadcrumb title="SaaS Management" subTitle="Audit Logs" breadcrumbItems={[{ label: 'SaaS', href: '#' }, { label: 'Audit Logs', href: route('saas.audit-logs.index') }]} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, event, or model..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead className="border-b border-gray-200 bg-emerald-50 dark:border-slate-700 dark:bg-emerald-900/20">
                                <tr>
                                    <th className="table-th">Date & Time</th>
                                    <th className="table-th">User</th>
                                    <th className="table-th">Event</th>
                                    <th className="table-th">Model</th>
                                    <th className="table-th">IP Address</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((log) => {
                                    const eventColors = { created: 'bg-green-100 text-green-800', updated: 'bg-blue-100 text-blue-800', deleted: 'bg-red-100 text-red-800' };
                                    return (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                                            <td className="table-td whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.created_at}</td>
                                            <td className="table-td">
                                                <div className="font-medium text-gray-900 dark:text-white">{log.user_name}</div>
                                                <div className="text-xs text-gray-500">{log.organization_name}</div>
                                            </td>
                                            <td className="table-td">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${eventColors[log.event] || 'bg-gray-100 text-gray-800'}`}>{log.event}</span>
                                            </td>
                                            <td className="table-td font-mono text-xs text-gray-600 dark:text-gray-300">{log.auditable_type} <span className="text-gray-400">#{log.auditable_id}</span></td>
                                            <td className="table-td text-sm text-gray-500">{log.ip_address || '—'}</td>
                                            <td className="table-td text-right">
                                                <button onClick={() => setSelectedLog(log)} className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                    <Eye className="mr-1 h-3.5 w-3.5" /> View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && <tr><td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500">No audit logs found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedLog && (
                <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Audit Log Details" size="lg">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-gray-500">Event</p><p className="font-semibold text-gray-900 dark:text-white capitalize">{selectedLog.event}</p></div>
                            <div><p className="text-gray-500">Target Model</p><p className="font-semibold text-gray-900 dark:text-white">{selectedLog.auditable_type} (ID: {selectedLog.auditable_id})</p></div>
                            <div><p className="text-gray-500">Performed By</p><p className="font-semibold text-gray-900 dark:text-white">{selectedLog.user_name}</p></div>
                            <div><p className="text-gray-500">IP Address</p><p className="font-semibold text-gray-900 dark:text-white">{selectedLog.ip_address || 'Unknown'}</p></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Old Values (Before)</p>
                                <pre className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg text-xs overflow-x-auto text-gray-800 dark:text-gray-200">{formatJson(selectedLog.old_values)}</pre>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Values (After)</p>
                                <pre className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg text-xs overflow-x-auto text-gray-800 dark:text-gray-200">{formatJson(selectedLog.new_values)}</pre>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
                            <Button variant="secondary" onClick={() => setSelectedLog(null)}>Close</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </AppLayout>
    );
}