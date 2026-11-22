import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Shield, Plus, Pencil, Trash2, Search, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RolesIndex({ roles }) {
    const roleList = roles?.data || roles || [];
    const [searchTerm, setSearchTerm] = useState('');

    const breadcrumbItems = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Roles', href: route('roles.index') },
    ];

    const filteredRoles = roleList.filter(role => 
        role.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (roleId, roleName, isSystem) => {
        if (isSystem) {
            toast.error('System roles cannot be deleted.', { icon: '🛑' });
            return;
        }
        if (confirm(`Are you sure you want to delete "${roleName}"?`)) {
            router.delete(route('roles.destroy', roleId), {
                preserveScroll: true,
                onSuccess: () => toast.success('Role deleted successfully'),
                onError: (errors) => toast.error(Object.values(errors)[0] || 'Failed to delete role', { icon: '❌' })
            });
        }
    };

    return (
        <AppLayout title="Roles">
            <Head title="Role Management" />
            <div className="space-y-3">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="System Management" subTitle="Roles" breadcrumbItems={breadcrumbItems} />
                    <Link href={route('roles.create')}>
                        <Button variant="primary" size="sm">
                            <Plus className="w-4 h-4 mr-1.5" /> Create New Role
                        </Button>
                    </Link>
                </div>


                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by role name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" 
                        />
                    </div>
                </div>


                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Role Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Guard</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Permissions</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredRoles.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                                                {role.is_system && (
                                                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">System</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 capitalize">{role.guard_name}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                                                <Key className="w-3 h-3 mr-1" />
                                                {role.permissions?.length || 0} Permissions
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                {role.is_system ? (
                                                    <span className="p-1.5 text-gray-400 cursor-not-allowed" title="System roles cannot be modified">
                                                        <Shield className="w-3.5 h-3.5" />
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Link href={route('roles.edit', role.id)}>
                                                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => handleDelete(role.id, role.name, role.is_system)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}