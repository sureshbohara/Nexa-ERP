import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Receipt, Search, Eye } from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import { formatCurrency, formatDate, getStatusClasses } from '@/Services/payrollService';

export default function PayslipsIndex({ payslips = [] }) {
    const list = Array.isArray(payslips) ? payslips : [];
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return list.filter((p) => {
            const empName = [p.employee?.user?.first_name, p.employee?.user?.last_name].filter(Boolean).join(' ');
            const matchSearch = !term || [empName, p.employee?.employee_code, p.employee?.designation, p.pay_period, p.salary_structure?.name].some(v => String(v ?? '').toLowerCase().includes(term));
            return matchSearch && (statusFilter === 'all' || p.payment_status === statusFilter);
        });
    }, [list, search, statusFilter]);

    return (
        <AppLayout title="Payslips">
            <Head title="Payslips" />
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Breadcrumb title="HRM" subTitle="Payslips" breadcrumbItems={[{ label: 'HRM', href: '#' }, { label: 'Payslips', href: route('hrm.payslips.index') }]} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee, code, or period..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900" />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                            <option value="all">All payment statuses</option>
                            <option value="unpaid">Unpaid</option><option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="border-b border-gray-200 bg-emerald-50 dark:border-slate-700 dark:bg-emerald-900/20">
                                <tr>
                                    <th className="table-th">Period</th><th className="table-th">Employee</th><th className="table-th text-right">Gross Salary</th>
                                    <th className="table-th text-right">Total Deductions</th><th className="table-th text-right">Net Salary</th>
                                    <th className="table-th">Status</th><th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((p) => {
                                    const empName = [p.employee?.user?.first_name, p.employee?.user?.last_name].filter(Boolean).join(' ');
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                                            <td className="table-td whitespace-nowrap font-medium">{p.pay_period}</td>
                                            <td className="table-td min-w-[200px]">
                                                <div className="flex items-start gap-2">
                                                    <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{empName || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500">{p.employee?.employee_code ?? '—'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td text-right font-medium">{formatCurrency(p.gross_salary)}</td>
                                            <td className="table-td text-right text-red-600">{formatCurrency(p.total_deductions)}</td>
                                            <td className="table-td text-right font-bold text-emerald-600">{formatCurrency(p.net_salary)}</td>
                                            <td className="table-td"><span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusClasses(p.payment_status)}`}>{p.payment_status ?? 'unknown'}</span></td>
                                            <td className="table-td text-right">
                                                <a href={route('hrm.payslips.show', p.id)} className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                    <Eye className="mr-1 h-3.5 w-3.5" /> View
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-gray-500">No payslips found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}