import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Building2, Plus, Pencil, Trash2, Search, X, Phone, Mail } from 'lucide-react';

export default function BranchesIndex({ branches }) {
    const branchList = Array.isArray(branches) ? branches : (branches?.data || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const breadcrumbItems = [
        { label: 'System', href: route('dashboard') },
        { label: 'Branches', href: route('branches.index') },
    ];

    const statuses = [...new Set(branchList.map(b => b.status))];

    const filteredBranches = branchList.filter(branch => {
        const matchesSearch = 
            branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.phone?.includes(searchTerm);
        
        const matchesStatus = !filterStatus || branch.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleReset = () => {
        setSearchTerm('');
        setFilterStatus('');
    };

    const handleStatusToggle = (branchId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        router.post(route('branches.status', branchId), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (branchId, branchName) => {
        if (confirm(`Are you sure you want to delete "${branchName}"?`)) {
            router.delete(route('branches.destroy', branchId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Branches">
            <Head title="Branch Management" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <Breadcrumb title="System Management" subTitle="Branches" breadcrumbItems={breadcrumbItems} />

                    <Link href={route('branches.create')}>
                        <Button variant="primary" size="sm">
                            <Plus className="w-4 h-4 mr-1.5" /> Create New
                        </Button>
                    </Link>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, code, or phone..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" 
                            />
                        </div>

                        <div className="relative">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)} 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm appearance-none cursor-pointer"
                            >
                                <option value="">All Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <Button variant="secondary" size="sm" onClick={handleReset} className="w-full">
                            <X className="w-4 h-4 mr-1.5" /> Reset
                        </Button>
                        
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">Branch</th>
                                    <th className="table-th">Organization</th>
                                    <th className="table-th">Contact</th>
                                    <th className="table-th">Type</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{branch.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{branch.district}, {branch.province}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {branch.organization?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5" /> {branch.phone}
                                            </div>
                                            {branch.email && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                                                    <Mail className="w-3 h-3" /> {branch.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="table-td">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${
                                                branch.branch_type === 'head_office' 
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                            }`}>
                                                {branch.branch_type === 'head_office' ? 'Head Office' : 'Branch'}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <button 
                                                onClick={() => handleStatusToggle(branch.id, branch.status)} 
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${branch.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${branch.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Link href={route('branches.edit', branch.id)}>
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDelete(branch.id, branch.name)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBranches.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No branches found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}