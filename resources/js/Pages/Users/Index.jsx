import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Search, Plus, Pencil, Trash2, CheckCircle, XCircle, User as UserIcon } from 'lucide-react';

export default function UserIndex({ users }) {
    const list = Array.isArray(users) ? users : [];
    const [search, setSearch] = useState('');


    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return list;
        
        return list.filter(user => 
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.username?.toLowerCase().includes(term) ||
            user.role?.name?.toLowerCase().includes(term)
        );
    }, [list, search]);


    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete user "${name}"?`)) {
            router.delete(route('users.destroy', id), {
                preserveScroll: true,
            });
        }
    };


    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        router.post(route('users.status', id), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Users">
            <Head title="User Management" />
            
            <div className="space-y-3">
          
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb 
                        title="System" 
                        subTitle="Users" 
                        breadcrumbItems={[
                            { label: 'System', href: route('dashboard') }, 
                            { label: 'Users', href: route('users.index') }
                        ]} 
                    />
                    <Link href={route('users.create')}>
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" /> Add New User
                        </Button>
                    </Link>
                </div>

            
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search by name, email, username or role..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all" 
                        />
                    </div>
                </div>

        
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th">User</th>
                                    <th className="table-th">Username</th>
                                    <th className="table-th">Role</th>
                                    <th className="table-th">Organization</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                               
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.first_name} className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-600" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                                                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                     
                                        <td className="table-td text-sm text-gray-600 dark:text-gray-300 font-mono">
                                            {user.username || '—'}
                                        </td>

                                 
                                        <td className="table-td">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {user.role?.name || 'No Role'}
                                            </span>
                                        </td>

                               
                                        <td className="table-td text-sm text-gray-600 dark:text-gray-300">
                                            {user.organization?.name || '—'}
                                        </td>

                         
                                        <td className="table-td">
                                            <button 
                                                onClick={() => handleStatusToggle(user.id, user.status)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                                                    user.status === 'active' ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                    user.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                            </button>
                                        </td>

                                  
                                        <td className="table-td text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={route('users.edit', user.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                   
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                <UserIcon className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No users found</p>
                                                <p className="text-xs mt-1">Try adjusting your search or add a new user.</p>
                                            </div>
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