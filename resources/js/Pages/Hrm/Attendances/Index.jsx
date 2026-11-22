import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import AttendanceFormModal from './FormModal';
import { Calendar, Plus, Pencil, Trash2, Search, FileBarChart } from 'lucide-react';

export default function AttendancesIndex({ attendances, employees }) {
    const list = Array.isArray(attendances) ? attendances : [];
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const filtered = list.filter(a => 
        a.employee?.user?.first_name?.toLowerCase().includes(search.toLowerCase()) || 
        a.attendance_date?.includes(search)
    );

    const handleCreate = () => { setEditing(null); setIsModalOpen(true); };
    const handleEdit = (a) => { setEditing(a); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditing(null); };
    const handleSuccess = () => { setIsModalOpen(false); setEditing(null); };

    const handleDelete = (id) => {
        if (confirm('Delete this attendance record?')) {
            router.delete(route('hrm.attendances.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Attendances">
            <Head title="Attendance Management" />
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb title="HRM" subTitle="Attendances" breadcrumbItems={[
                        { label: 'HRM', href: '#' }, 
                        { label: 'Attendances', href: route('hrm.attendances.index') }
                    ]} />
                    
                    <div className="flex gap-2">
        
                        <Link href={route('hrm.attendances.report')}>
                            <Button variant="secondary" size="md">
                                <FileBarChart className="w-4 h-4 mr-1.5" /> View Report
                            </Button>
                        </Link>
                        
                        <Button variant="primary" size="md" onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-1.5" /> Mark Attendance
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                    <div className="relative max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by employee name or date..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white outline-none text-sm" 
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="table-th">Date</th>
                                <th className="table-th">Employee</th>
                                <th className="table-th">Status</th>
                                <th className="table-th">Check In</th>
                                <th className="table-th">Check Out</th>
                                <th className="table-th text-right">Hours</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="table-td text-gray-600 dark:text-gray-300">{a.attendance_date}</td>
                                    <td className="table-td font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-600" /> 
                                        {a.employee?.user?.first_name} {a.employee?.user?.last_name}
                                    </td>
                                    <td className="table-td">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            a.status === 'present' ? 'bg-green-100 text-green-800' : 
                                            a.status === 'absent' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {a.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {a.check_in ? a.check_in.substring(11, 16) : '-'}
                                    </td>
                                    <td className="table-td text-gray-600 dark:text-gray-300">
                                        {a.check_out ? a.check_out.substring(11, 16) : '-'}
                                    </td>
                                    <td className="table-td text-right font-medium text-gray-900 dark:text-white">
                                        {a.working_hours ? `${a.working_hours} hrs` : '-'}
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button 
                                                onClick={() => handleEdit(a)} 
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(a.id)} 
                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        No attendance records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <AttendanceFormModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                editing={editing} 
                employees={employees} 
                onSuccess={handleSuccess} 
            />
        </AppLayout>
    );
}