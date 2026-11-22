import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Button from '@/Components/UI/Button';
import { ArrowLeft, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '@/Services/payrollService';

export default function PayslipShow({ payslip }) {
    const emp = payslip.employee;
    const user = emp?.user || {};
    const structure = payslip.salary_structure;

    return (
        <AppLayout title={`Payslip - ${payslip.pay_period}`}>
            <Head title={`Payslip - ${payslip.pay_period}`} />
        <div className="space-y-4">
            <div className="mb-4 flex items-center justify-between print:hidden">
                <Link href={route('hrm.payslips.index')} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Payslips
                </Link>
                <Button variant="primary" size="sm" onClick={() => window.print()}>
                    <Printer className="mr-1.5 h-4 w-4" /> Print / Save as PDF
                </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 print:shadow-none print:border-0 print:p-0">
                <div className="mb-8 border-b border-gray-200 pb-6 text-center dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black">PAYSLIP</h1>
                    <p className="mt-1 text-sm text-gray-500 print:text-gray-600">Pay Period: <span className="font-semibold text-gray-900 dark:text-white print:text-black">{payslip.pay_period}</span></p>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">Employee Name</p><p className="font-semibold text-gray-900 dark:text-white print:text-black">{user.first_name} {user.last_name}</p></div>
                    <div><p className="text-gray-500">Employee Code</p><p className="font-semibold text-gray-900 dark:text-white print:text-black">{emp?.employee_code ?? '—'}</p></div>
                    <div><p className="text-gray-500">Designation</p><p className="font-semibold text-gray-900 dark:text-white print:text-black">{emp?.designation ?? '—'}</p></div>
                    <div><p className="text-gray-500">Salary Structure</p><p className="font-semibold text-gray-900 dark:text-white print:text-black">{structure?.name ?? '—'}</p></div>
                </div>

                <table className="mb-8 w-full text-sm">
                    <thead className="border-b-2 border-gray-300 dark:border-slate-600 print:border-gray-400">
                        <tr>
                            <th className="py-2 text-left font-semibold text-gray-700 dark:text-gray-300 print:text-black">Earnings</th>
                            <th className="py-2 text-right font-semibold text-gray-700 dark:text-gray-300 print:text-black">Amount (Rs.)</th>
                            <th className="py-2 text-left font-semibold text-gray-700 dark:text-gray-300 print:text-black">Deductions</th>
                            <th className="py-2 text-right font-semibold text-gray-700 dark:text-gray-300 print:text-black">Amount (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700 print:divide-gray-300">
                        <tr><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Basic Salary</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.basic_salary)}</td><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Provident Fund</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.provident_fund)}</td></tr>
                        <tr><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">House Rent Allowance</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.house_rent_allowance)}</td><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Tax Deduction</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.tax_deduction)}</td></tr>
                        <tr><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Transport Allowance</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.transport_allowance)}</td><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Other Deductions</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.other_deduction)}</td></tr>
                        <tr><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Medical Allowance</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.medical_allowance)}</td><td className="py-2"></td><td className="py-2"></td></tr>
                        <tr><td className="py-2 text-gray-600 dark:text-gray-400 print:text-gray-700">Other Allowance</td><td className="py-2 text-right print:text-black">{formatCurrency(payslip.other_allowance)}</td><td className="py-2"></td><td className="py-2"></td></tr>
                        <tr className="border-t-2 border-gray-300 dark:border-slate-600 font-semibold print:border-gray-400">
                            <td className="py-3 text-gray-900 dark:text-white print:text-black">Gross Salary</td>
                            <td className="py-3 text-right text-gray-900 dark:text-white print:text-black">{formatCurrency(payslip.gross_salary)}</td>
                            <td className="py-3 text-red-600 print:text-black">Total Deductions</td>
                            <td className="py-3 text-right text-red-600 print:text-black">{formatCurrency(payslip.total_deductions)}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="mb-8 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20 print:bg-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300 print:text-black">Net Salary (Take Home)</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 print:text-black">{formatCurrency(payslip.net_salary)}</span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 print:text-gray-600">
                        Payment Status: <span className="font-semibold uppercase">{payslip.payment_status}</span> {payslip.paid_at && `on ${formatDate(payslip.paid_at)}`}
                    </div>
                </div>

                <div className="mt-12 flex justify-between text-xs text-gray-500 print:mt-24 print:text-black">
                    <div className="text-center"><div className="mb-8 border-t border-gray-300 pt-2">Employee Signature</div></div>
                    <div className="text-center"><div className="mb-8 border-t border-gray-300 pt-2">Authorized Signature</div></div>
                </div>
            </div>
         </div>
        </AppLayout>
    );
}