import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FileBarChart, Search, Filter } from 'lucide-react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';

export default function GeneralLedger({ ledgerItems, accounts, filters }) {
    const breadcrumbItems = [
        { label: 'Accounting', href: '#' },
        { label: 'General Ledger', href: route('accounting.reports.general-ledger') },
    ];

    const [formData, setFormData] = useState({
        account_id: filters.account_id || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('accounting.reports.general-ledger'), formData, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    return (
        <AppLayout title="General Ledger">
            <Head title="General Ledger" />
            <div className="space-y-4">
                <Breadcrumb title="Accounting" subTitle="General Ledger" breadcrumbItems={breadcrumbItems} />

                <form onSubmit={handleFilter} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Filter className="w-4 h-4" /> Filter Ledger
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormInput
                            name="account_id"
                            label="Select Account"
                            type="select"
                            value={formData.account_id}
                            onChange={(v) => setFormData({...formData, account_id: v})}
                            options={[
                                {value: '', label: 'All Accounts'}, 
                                ...accounts.map(a => ({value: String(a.id), label: `${a.code} - ${a.name}`}))
                            ]}
                        />
                        <FormInput 
                            name="start_date" 
                            label="From Date" 
                            type="date" 
                            value={formData.start_date} 
                            onChange={(v) => setFormData({...formData, start_date: v})} 
                        />
                        <FormInput 
                            name="end_date" 
                            label="To Date" 
                            type="date" 
                            value={formData.end_date} 
                            onChange={(v) => setFormData({...formData, end_date: v})} 
                        />
                        
                  
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                &nbsp; 
                            </label>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full py-2.5 flex items-center justify-center"
                            >
                                <Search className="w-4 h-4 mr-1.5" /> Apply Filter
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="table-th text-left">Date</th>
                                    <th className="table-th text-left">Reference</th>
                                    <th className="table-th text-left">Account</th>
                                    <th className="table-th text-left">Description</th>
                                    <th className="table-th text-right">Debit</th>
                                    <th className="table-th text-right">Credit</th>
                                    <th className="table-th text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {ledgerItems.length > 0 ? ledgerItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="table-td text-gray-600 dark:text-gray-300">{item.journal_entry?.entry_date}</td>
                                        <td className="table-td font-medium text-gray-900 dark:text-white">{item.journal_entry?.reference_no}</td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{item.account?.code} - {item.account?.name}</td>
                                        <td className="table-td text-gray-600 dark:text-gray-300">{item.description || '-'}</td>
                                        <td className="table-td text-right">
                                            {Number(item.debit) > 0 ? Number(item.debit).toFixed(2) : '-'}
                                        </td>
                                        <td className="table-td text-right">
                                            {Number(item.credit) > 0 ? Number(item.credit).toFixed(2) : '-'}
                                        </td>
                                        <td className="table-td text-right font-semibold text-gray-900 dark:text-white">
                                            {Number(item.running_balance).toFixed(2)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FileBarChart className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm">No ledger entries found for the selected filters.</p>
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