import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Receipt, Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';

export default function SalaryStructuresIndex({ salaryStructures }) {
    const list = Array.isArray(salaryStructures) ? salaryStructures : [];
    const [search, setSearch] = useState('');

    const filtered = list.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.code?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id, name) => {
        if (confirm(`Delete "${name}"?`)) {
            router.delete(route('hrm.salary-structures.destroy', id), { preserveScroll: true });
        }
    };

    const handleStatus = (id, status) => {
        router.post(route('hrm.salary-structures.status', id), {
            status: status === 'active' ? 'inactive' : 'active'
        }, { preserveScroll: true });
    };

    return (
        <AppLayout title="Salary Structures">
            <Head title="Salary Structure Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="HRM" subTitle="Salary Structures" breadcrumbItems={[
                        { label: 'HRM', href: '#' },
                        { label: 'Salary Structures', href: route('hrm.salary-structures.index') }
                    ]} />
               
                    <Link href={route('hrm.salary-structures.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Structure
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search structure..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Code</th>
                                    <th className="table-th">Name</th>
                                    <th className="table-th text-right">Basic</th>
                                    <th className="table-th text-right">Allowances</th>
                                    <th className="table-th text-right">Deductions</th>
                                    <th className="table-th text-right">Net Salary</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td font-mono text-gray-600 dark:text-gray-300">{s.code}</td>
                                        <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <Receipt className="w-4 h-4 text-emerald-600" /> {s.name}
                                        </td>
                                        <td className="table-td text-right text-gray-600 dark:text-gray-300">Rs. {Number(s.basic_salary || 0).toFixed(2)}</td>
                                        <td className="table-td text-right text-emerald-600 font-medium">Rs. {Number(s.total_allowance || 0).toFixed(2)}</td>
                                        <td className="table-td text-right text-red-600 font-medium">Rs. {Number(s.total_deduction || 0).toFixed(2)}</td>
                                        <td className="table-td text-right font-bold text-gray-900 dark:text-white">Rs. {Number(s.net_salary || 0).toFixed(2)}</td>
                                        <td className="table-td">
                                            <button onClick={() => handleStatus(s.id, s.status)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${s.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Link href={route('hrm.salary-structures.edit', s.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Link>
                                                <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No salary structures found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}