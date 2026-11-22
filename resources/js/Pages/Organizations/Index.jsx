import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Building2, Plus, Pencil, Trash2, Search, X, Phone, Mail } from 'lucide-react';

export default function OrganizationsIndex({ organizations }) {
    const orgList = Array.isArray(organizations) ? organizations : (organizations?.data || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const breadcrumbItems = [
        { label: 'System', href: route('dashboard') },
        { label: 'Organizations', href: route('organizations.index') },
    ];

    const statuses = [...new Set(orgList.map(o => o.status))];

    const filteredOrgs = orgList.filter(org => {
        const matchesSearch = 
            org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.phone?.includes(searchTerm);
        
        const matchesStatus = !filterStatus || org.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleReset = () => {
        setSearchTerm('');
        setFilterStatus('');
    };

    const handleStatusToggle = (orgId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        router.post(route('organizations.status', orgId), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (orgId, orgName) => {
        if (confirm(`Are you sure you want to delete "${orgName}"? This will affect all associated branches and users.`)) {
            router.delete(route('organizations.destroy', orgId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Organizations">
            <Head title="Organization Management" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="System Management" subTitle="Organizations" breadcrumbItems={breadcrumbItems} />
                    <Link href={route('organizations.create')}>
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
                                    <th className="table-th">Organization</th>
                                    <th className="table-th">Contact</th>
                                    <th className="table-th">Code</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredOrgs.map((org) => (
                                    <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                {org.logo_url ? (
                                                    <img src={org.logo_url} alt={org.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-slate-600" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{org.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{org.district}, {org.province}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5" /> {org.phone}
                                            </div>
                                            {org.email && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                                                    <Mail className="w-3 h-3" /> {org.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="table-td">
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {org.code}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <button 
                                                onClick={() => handleStatusToggle(org.id, org.status)} 
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${org.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${org.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Link href={route('organizations.edit', org.id)}>
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDelete(org.id, org.name)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrgs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No organizations found</p>
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