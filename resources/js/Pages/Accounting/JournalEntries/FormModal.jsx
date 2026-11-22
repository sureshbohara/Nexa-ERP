import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, Plus, Trash2, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

import Modal from '@/Components/UI/Modal';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { JOURNAL_INITIAL_VALUES, mapJournalToFormData, JOURNAL_STATUS_OPTIONS } from '@/Services/journalEntryService';


const JOURNAL_TEMPLATES = [
    {
        id: 'cash_sale',
        label: 'Cash Sale (Revenue Recognition)',
        icon: '💰',
        items: (accounts) => {
            const cash = accounts.find(a => a.name?.toLowerCase().includes('cash') || a.code === '1000');
            const sales = accounts.find(a => a.name?.toLowerCase().includes('sales') || a.code === '4000');
            return [
                { account_id: cash ? String(cash.id) : '', description: 'Cash received from sale', debit: '', credit: '' },
                { account_id: sales ? String(sales.id) : '', description: 'Sales revenue earned', debit: '', credit: '' },
            ];
        },
        hint: 'Cash मा Debit हाल्नुहोस्, Sales Revenue मा Credit हाल्नुहोस्',
    },
    {
        id: 'expense_payment',
        label: 'Expense Payment',
        icon: '🧾',
        items: (accounts) => {
            const expense = accounts.find(a => a.type === 'expense');
            const cash = accounts.find(a => a.name?.toLowerCase().includes('cash') || a.code === '1000');
            return [
                { account_id: expense ? String(expense.id) : '', description: 'Expense incurred', debit: '', credit: '' },
                { account_id: cash ? String(cash.id) : '', description: 'Cash paid out', debit: '', credit: '' },
            ];
        },
        hint: 'Expense मा Debit हाल्नुहोस्, Cash मा Credit हाल्नुहोस्',
    },
    {
        id: 'owner_investment',
        label: 'Owner Investment',
        icon: '🏦',
        items: (accounts) => {
            const cash = accounts.find(a => a.name?.toLowerCase().includes('cash') || a.code === '1000');
            const equity = accounts.find(a => a.type === 'equity');
            return [
                { account_id: cash ? String(cash.id) : '', description: 'Capital received', debit: '', credit: '' },
                { account_id: equity ? String(equity.id) : '', description: 'Owner capital', debit: '', credit: '' },
            ];
        },
        hint: 'Cash मा Debit हाल्नुहोस्, Equity मा Credit हाल्नुहोस्',
    },
];

export default function JournalEntryFormModal({ isOpen, onClose, editing, accounts, onSuccess }) {
    const isEdit = !!editing;
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapJournalToFormData(editing) : JOURNAL_INITIAL_VALUES
    );

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editing) {
                const mapped = mapJournalToFormData(editing);
                Object.keys(mapped).forEach(key => setData(key, mapped[key]));
            } else {
                reset();
            }
            setSelectedTemplate(null);
        }
    }, [isOpen, isEdit, editing]);


    const applyTemplate = (templateId) => {
        const template = JOURNAL_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        setSelectedTemplate(template);
        const preFilledItems = template.items(accounts);
        setData('items', preFilledItems);
    };

    const addItem = () => {
        setData('items', [...data.items, { account_id: '', description: '', debit: '', credit: '' }]);
    };

    const removeItem = (index) => {
        if (data.items.length <= 2) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        setData(`items.${index}.${field}`, value);
        if (field === 'debit' && value) {
            setData(`items.${index}.credit`, '');
        } else if (field === 'credit' && value) {
            setData(`items.${index}.debit`, '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        const url = isEdit 
            ? route('accounting.journal-entries.update', editing.id) 
            : route('accounting.journal-entries.store');
        
        const method = isEdit ? put : post;

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess(); 
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const accountOptions = [
        { value: '', label: '-- Select Account --' },
        ...accounts.map(a => ({ value: String(a.id), label: `${a.name} (${a.code})` }))
    ];

    const totalDebit = data.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
    const totalCredit = data.items.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = difference < 0.01 && totalDebit > 0;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Journal Entry' : 'New Journal Entry'} size="xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                
          
                {!isEdit && (
                    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Quick Start (Template छान्नुहोस् - Accounts आफैं भरिन्छ)
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {JOURNAL_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => applyTemplate(t.id)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                        selectedTemplate?.id === t.id
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-emerald-500'
                                    }`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                        {selectedTemplate && (
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
                                💡 {selectedTemplate.hint}
                            </p>
                        )}
                    </div>
                )}

           
                <div className={`rounded-lg p-3 flex items-start gap-3 border ${
                    isBalanced 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                    {isBalanced ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                        <p className={`text-sm font-semibold ${isBalanced ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isBalanced ? 'Entry is perfectly balanced! ✓' : 'Entry is NOT balanced!'}
                        </p>
                        <p className={`text-xs mt-1 ${isBalanced ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {isBalanced 
                                ? 'Total Debit र Total Credit बराबर छन्। Save गर्न सक्नुहुन्छ।' 
                                : `नियम: एउटा Row मा Debit, अर्को Row मा Credit हाल्नुपर्छ। Debit = Rs. ${totalDebit.toFixed(2)}, Credit = Rs. ${totalCredit.toFixed(2)}, Difference = Rs. ${difference.toFixed(2)}`
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        name="reference_no"
                        label="Reference No"
                        value={data.reference_no}
                        onChange={(v) => setData('reference_no', v)}
                        error={errors.reference_no}
                        required
                        placeholder="e.g., JE-001"
                    />
                    <FormInput
                        name="entry_date"
                        label="Entry Date"
                        type="date"
                        value={data.entry_date}
                        onChange={(v) => setData('entry_date', v)}
                        error={errors.entry_date}
                        required
                    />
                    {!isEdit && (
                        <FormInput
                            name="status"
                            label="Status"
                            type="select"
                            value={data.status}
                            onChange={(v) => setData('status', v)}
                            error={errors.status}
                            options={JOURNAL_STATUS_OPTIONS}
                            required
                        />
                    )}
                </div>

                <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Journal Items
                            <span className="text-xs font-normal text-gray-500 ml-2">(Debit वा Credit मध्ये एउटा मात्र भर्नुहोस्)</span>
                        </span>
                        <Button type="button" variant="primary" size="sm" onClick={addItem}>
                            <Plus className="w-4 h-4 mr-1" /> Add Row
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-2 text-left w-1/3">Account</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-right w-32 text-blue-600 dark:text-blue-400">Debit ↓</th>
                                    <th className="px-4 py-2 text-right w-32 text-orange-600 dark:text-orange-400">Credit ↑</th>
                                    <th className="px-4 py-2 text-center w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {data.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <select
                                                value={item.account_id}
                                                onChange={(e) => updateItem(index, 'account_id', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            >
                                                {accountOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            {errors[`items.${index}.account_id`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.account_id`]}</p>}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                placeholder="Optional"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.debit}
                                                onChange={(e) => updateItem(index, 'debit', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm text-right rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.credit}
                                                onChange={(e) => updateItem(index, 'credit', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm text-right rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                disabled={data.items.length <= 2}
                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-slate-900 font-semibold">
                                <tr>
                                    <td colSpan="2" className="px-4 py-2 text-right">Totals:</td>
                                    <td className={`px-4 py-2 text-right ${!isBalanced ? 'text-red-600' : 'text-emerald-600'}`}>
                                        Rs. {totalDebit.toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-2 text-right ${!isBalanced ? 'text-red-600' : 'text-emerald-600'}`}>
                                        Rs. {totalCredit.toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {errors.items && <p className="text-xs text-red-500 p-4 bg-red-50 dark:bg-red-900/20">{errors.items}</p>}
                </div>

                <FormInput
                    name="notes"
                    label="Overall Notes"
                    type="textarea"
                    value={data.notes}
                    onChange={(v) => setData('notes', v)}
                    error={errors.notes}
                    rows={2}
                    placeholder="Brief description of this journal entry..."
                />

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={processing || !isBalanced}
                        title={!isBalanced ? "Debit र Credit बराबर भएपछि मात्र Save हुन्छ" : ""}
                    >
                        <Save className="w-4 h-4 mr-1.5" />
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Save Entry')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}