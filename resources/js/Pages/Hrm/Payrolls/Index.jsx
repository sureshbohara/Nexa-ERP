import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Loader2, PlayCircle, Search } from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import { formatCurrency, formatDate, getMonthDateRange, getStatusClasses } from '@/Services/payrollService';

const currentDate = new Date();
const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

export default function PayrollsIndex({ payrolls = [], branches = [] }) {
    const list = Array.isArray(payrolls) ? payrolls : [];
    const branchList = Array.isArray(branches) ? branches : [];
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processingPayrollId, setProcessingPayrollId] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ branch_id: '', payroll_period: currentPeriod, ...getMonthDateRange(currentPeriod), notes: '' });

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return list.filter((p) => {
            const matchSearch = !term || [p.payroll_period, p.branch?.name, p.user?.first_name, p.user?.last_name].some(v => String(v ?? '').toLowerCase().includes(term));
            return matchSearch && (statusFilter === 'all' || p.status === statusFilter) && (branchFilter === 'all' || String(p.branch_id ?? '') === branchFilter);
        });
    }, [list, search, statusFilter, branchFilter]);

    const branchOptions = [{ value: '', label: 'All permitted branches' }, ...branchList.map(b => ({ value: String(b.id), label: b.name }))];
    const updatePeriod = (period) => setFormData(c => ({ ...c, payroll_period: period, ...getMonthDateRange(period) }));

    const handleProcess = (e) => {
        e.preventDefault(); setProcessing(true); setErrors({});
        router.post(route('hrm.payrolls.process'), formData, {
            preserveScroll: true,
            onSuccess: () => { setIsModalOpen(false); setFormData(c => ({ ...c, notes: '' })); },
            onError: (err) => setErrors(err), onFinish: () => setProcessing(false),
        });
    };

    const handleMarkPaid = (p) => {
        if (!window.confirm(`Mark payroll ${p.payroll_period} as paid?`)) return;
        setProcessingPayrollId(p.id);
        router.post(route('hrm.payrolls.mark-paid', p.id), {}, { preserveScroll: true, onFinish: () => setProcessingPayrollId(null) });
    };

    return (
        <AppLayout title="Payrolls">
            <Head title="Payroll Management" />
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Breadcrumb title="HRM" subTitle="Payrolls" breadcrumbItems={[{ label: 'HRM', href: '#' }, { label: 'Payrolls', href: route('hrm.payrolls.index') }]} />
                    <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}><PlayCircle className="mr-1.5 h-4 w-4" /> Process New Payroll</Button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search period, branch or creator..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900" />
                        </div>
                        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                            <option value="all">All branches</option>
                            {branchList.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                            <option value="all">All statuses</option>
                            <option value="draft">Draft</option><option value="processed">Processed</option><option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="border-b border-gray-200 bg-emerald-50 dark:border-slate-700 dark:bg-emerald-900/20">
                                <tr>
                                    <th className="table-th">Period</th><th className="table-th">Branch</th><th className="table-th text-right">Employees</th>
                                    <th className="table-th text-right">Gross Salary</th><th className="table-th text-right">Deductions</th><th className="table-th text-right">Net Payable</th>
                                    <th className="table-th">Status</th><th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filtered.map((p) => {
                                    const gross = (parseFloat(p.total_basic || 0) + parseFloat(p.total_allowances || 0));
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                                            <td className="table-td font-medium text-gray-900 dark:text-white whitespace-nowrap">{p.payroll_period}</td>
                                            <td className="table-td text-gray-600 dark:text-gray-300">{p.branch?.name ?? 'All permitted branches'}</td>
                                            <td className="table-td text-right font-medium">{p.total_employees ?? p.payslips_count ?? 0}</td>
                                            <td className="table-td text-right text-gray-600 dark:text-gray-300">{formatCurrency(gross)}</td>
                                            <td className="table-td text-right text-red-600">{formatCurrency(p.total_deductions)}</td>
                                            <td className="table-td text-right font-bold text-emerald-600">{formatCurrency(p.net_payable)}</td>
                                            <td className="table-td"><span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusClasses(p.status)}`}>{p.status ?? 'unknown'}</span></td>
                                            <td className="table-td text-right">
                                                {p.status === 'processed' && (
                                                    <button type="button" disabled={processingPayrollId === p.id} onClick={() => handleMarkPaid(p)} className="inline-flex items-center rounded border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60">
                                                        {processingPayrollId === p.id ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="mr-1 h-3.5 w-3.5" />} Mark Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-gray-500">No payroll records found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !processing && setIsModalOpen(false)} title="Process New Payroll" size="md">
                <form onSubmit={handleProcess} className="space-y-4">
                    <FormInput name="branch_id" label="Branch" type="select" value={formData.branch_id} onChange={(v) => setFormData((c) => ({ ...c, branch_id: v }))} options={branchOptions} error={errors.branch_id} />
                    <FormInput name="payroll_period" label="Payroll Month" type="month" value={formData.payroll_period} onChange={updatePeriod} error={errors.payroll_period} required />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormInput name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={(v) => setFormData((c) => ({ ...c, start_date: v }))} error={errors.start_date} required />
                        <FormInput name="end_date" label="End Date" type="date" value={formData.end_date} onChange={(v) => setFormData((c) => ({ ...c, end_date: v }))} error={errors.end_date} required />
                    </div>
                    <FormInput name="notes" label="Notes (Optional)" type="textarea" rows={3} value={formData.notes} onChange={(v) => setFormData((c) => ({ ...c, notes: v }))} error={errors.notes} />
                    <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={processing}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={processing}>{processing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-1.5 h-4 w-4" />} Process Payroll</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}