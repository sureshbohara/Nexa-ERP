import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

export default function AttendanceReport({ summary, month }) {
    const [selectedMonth, setSelectedMonth] = useState(month || new Date().toISOString().slice(0, 7));

    const handleGenerate = (e) => {
        e.preventDefault();
        router.get(route('hrm.attendances.report'), { month: selectedMonth }, { preserveState: true });
    };


    const totals = summary.reduce((acc, curr) => {
        acc.present += curr.present;
        acc.absent += curr.absent;
        acc.late += curr.late;
        acc.leave += curr.leave;
        acc.hours += curr.total_working_hours;
        return acc;
    }, { present: 0, absent: 0, late: 0, leave: 0, hours: 0 });

    return (
        <AppLayout title="Attendance Report">
            <Head title="Monthly Attendance Report" />
            <div className="space-y-6">
                

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Breadcrumb title="HRM" subTitle="Attendance Report" breadcrumbItems={[
                        { label: 'HRM', href: '#' },
                        { label: 'Attendances', href: route('hrm.attendances.index') },
                        { label: 'Report', href: route('hrm.attendances.report') }
                    ]} />
                    
                    <form onSubmit={handleGenerate} className="flex gap-2">
                        <input 
                            type="month" 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                        <Button type="submit" variant="primary" size="sm">
                            <Calendar className="w-4 h-4 mr-1.5" /> Generate
                        </Button>
                    </form>
                </div>

              
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                        <div><p className="text-xs text-gray-500">Total Present</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totals.present}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><XCircle className="w-5 h-5 text-red-600" /></div>
                        <div><p className="text-xs text-gray-500">Total Absent</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totals.absent}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><AlertCircle className="w-5 h-5 text-yellow-600" /></div>
                        <div><p className="text-xs text-gray-500">Total Late</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totals.late}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                        <div><p className="text-xs text-gray-500">Total Leave</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totals.leave}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div>
                        <div><p className="text-xs text-gray-500">Total Hours</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totals.hours}</p></div>
                    </div>
                </div>

       
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Detailed Report for {selectedMonth}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Employee</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">Present</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">Absent</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">Late</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">Leave</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Total Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {summary.length > 0 ? summary.map((emp, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900 dark:text-white">{emp.employee_name}</div>
                                            <div className="text-xs text-gray-500">{emp.employee_code}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-green-600 font-medium">{emp.present}</td>
                                        <td className="px-4 py-3 text-center text-red-600 font-medium">{emp.absent}</td>
                                        <td className="px-4 py-3 text-center text-yellow-600 font-medium">{emp.late}</td>
                                        <td className="px-4 py-3 text-center text-blue-600 font-medium">{emp.leave}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{emp.total_working_hours} hrs</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                                            No attendance records found for {selectedMonth}.
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