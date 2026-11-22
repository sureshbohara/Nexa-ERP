import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { 
    Settings, Save, Image as ImageIcon, Building2, 
    Package, CreditCard, Users, Clock, Globe 
} from 'lucide-react';

export default function SettingsIndex({ settings }) {
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing, errors } = useForm({
        ...settings,
        system_logo: null,
        report_logo: null, 
        favicon: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'), { 
            forceFormData: true,
            preserveScroll: true 
        });
    };

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const tabs = [
        { id: 'general', name: 'General', subtitle: 'App Info & Preferences', icon: Settings },
        { id: 'branding', name: 'Branding', subtitle: 'Logos & Favicon', icon: ImageIcon },
        { id: 'inventory', name: 'Inventory', subtitle: 'Stock Alerts & Units', icon: Package },
        { id: 'finance', name: 'Finance', subtitle: 'Tax, Invoices & Receipts', icon: CreditCard },
        { id: 'hrm', name: 'HRM', subtitle: 'Office Hours & Leaves', icon: Users },
    ];

    return (
        <AppLayout title="System Settings">
            <Head title="System Settings" />
            
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Breadcrumb 
                        title="System Management" 
                        subTitle="Settings" 
                        breadcrumbItems={[{ label: 'System', href: route('dashboard') }]} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configuration</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage system preferences</p>
                            </div>
                            <nav className="p-2 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-start gap-3 px-3 py-2.5 text-left rounded-md transition-all duration-200 ${
                                                isActive 
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <div className={`p-1.5 rounded-md shrink-0 ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-slate-700'}`}>
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-medium truncate ${isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {tab.name}
                                                </div>
                                                <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-gray-500 dark:text-gray-500'}`}>
                                                    {tab.subtitle}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

            
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                      
                            {activeTab === 'general' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-emerald-600" /> General Information
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="app_name" label="Application Name" value={data.app_name} onChange={(v) => setData('app_name', v)} error={errors.app_name} required placeholder="e.g., ERP SaaS" />
                                        <FormInput name="language" label="Default Language" type="select" value={data.language} onChange={(v) => setData('language', v)} options={[{ value: 'en', label: 'English' }, { value: 'ne', label: 'Nepali' }]} />
                                        <FormInput name="default_currency" label="Default Currency" value={data.default_currency} onChange={(v) => setData('default_currency', v)} error={errors.default_currency} required placeholder="e.g., NPR" />
                                        <FormInput name="currency_position" label="Currency Position" type="select" value={data.currency_position} onChange={(v) => setData('currency_position', v)} options={[{ value: 'before', label: 'Before (e.g., Rs. 100)' }, { value: 'after', label: 'After (e.g., 100 Rs.)' }]} />
                                        <FormInput name="decimal_places" label="Decimal Places" type="number" value={data.decimal_places} onChange={(v) => setData('decimal_places', v)} error={errors.decimal_places} placeholder="e.g., 2" />
                                        <FormInput name="timezone" label="Timezone" type="select" value={data.timezone} onChange={(v) => setData('timezone', v)} options={[{ value: 'Asia/Kathmandu', label: 'Asia/Kathmandu (NPT)' }, { value: 'UTC', label: 'UTC' }]} required />
                                        <FormInput name="date_format" label="Date Format" type="select" value={data.date_format} onChange={(v) => setData('date_format', v)} options={[{ value: 'Y-m-d', label: 'YYYY-MM-DD' }, { value: 'd-m-Y', label: 'DD-MM-YYYY' }]} required />
                                        <FormInput name="financial_year_start" label="Financial Year Start (MM-DD)" value={data.financial_year_start} onChange={(v) => setData('financial_year_start', v)} error={errors.financial_year_start} placeholder="e.g., 07-16" required />
                               
                                    </div>
                                </div>
                            )}

                        
                            {activeTab === 'branding' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-emerald-600" /> Branding & Media
                                        </h2>
                                    </div>
                                   
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {['system_logo', 'report_logo', 'favicon'].map((field) => (
                                            <div key={field} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field.replace('_', ' ')}</label>
                                                <div className="w-full h-40 bg-gray-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group hover:border-emerald-400 transition-colors">
                                                    {data[field] instanceof File ? (
                                                        <img src={URL.createObjectURL(data[field])} alt="Preview" className="w-full h-full object-contain p-4" />
                                                    ) : settings[field] ? (
                                                        <img src={`/storage/${settings[field]}`} alt="Current" className="w-full h-full object-contain p-4" />
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept={field === 'favicon' ? 'image/png,image/x-icon' : 'image/*'} 
                                                        onChange={(e) => handleFileChange(field, e.target.files[0])} 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <span className="text-white text-xs font-medium">Click to change</span>
                                                    </div>
                                                </div>
                                                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                 
                            {activeTab === 'inventory' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Package className="w-4 h-4 text-emerald-600" /> Inventory Settings
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                                            <input 
                                                type="checkbox" 
                                                id="enable_low_stock_alert"
                                                checked={data.enable_low_stock_alert}
                                                onChange={(e) => setData('enable_low_stock_alert', e.target.checked)}
                                                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 dark:border-slate-600 rounded focus:ring-emerald-500 dark:bg-slate-800"
                                            />
                                            <div>
                                                <label htmlFor="enable_low_stock_alert" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">Enable Low Stock Alerts</label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get notified when stock falls below threshold.</p>
                                            </div>
                                        </div>
                                        <FormInput name="low_stock_threshold" label="Low Stock Threshold (Qty)" type="number" value={data.low_stock_threshold} onChange={(v) => setData('low_stock_threshold', v)} error={errors.low_stock_threshold} placeholder="e.g., 10" />
                                        
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                                            <input 
                                                type="checkbox" 
                                                id="allow_negative_stock"
                                                checked={data.allow_negative_stock}
                                                onChange={(e) => setData('allow_negative_stock', e.target.checked)}
                                                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 dark:border-slate-600 rounded focus:ring-emerald-500 dark:bg-slate-800"
                                            />
                                            <div>
                                                <label htmlFor="allow_negative_stock" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">Allow Negative Stock</label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Permit sales even when physical stock is zero.</p>
                                            </div>
                                        </div>
                                        <FormInput name="default_unit" label="Default Unit of Measurement" value={data.default_unit} onChange={(v) => setData('default_unit', v)} error={errors.default_unit} placeholder="e.g., pcs, kg" />
                                    </div>
                                </div>
                            )}

                      
                            {activeTab === 'finance' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-emerald-600" /> Finance Settings
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="invoice_prefix" label="Invoice Number Prefix" value={data.invoice_prefix} onChange={(v) => setData('invoice_prefix', v)} error={errors.invoice_prefix} placeholder="e.g., INV-" />
                                        <FormInput name="default_tax_percentage" label="Default Tax / VAT Percentage (%)" type="number" value={data.default_tax_percentage} onChange={(v) => setData('default_tax_percentage', v)} error={errors.default_tax_percentage} placeholder="e.g., 13" />
                                        <div className="md:col-span-2">
                                            <FormInput name="receipt_footer" label="Receipt / Invoice Footer Text" type="textarea" value={data.receipt_footer} onChange={(v) => setData('receipt_footer', v)} error={errors.receipt_footer} rows={3} placeholder="e.g., This is a computer-generated receipt." />
                                        </div>
                                    </div>
                                </div>
                            )}

                        
                            {activeTab === 'hrm' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-600" /> HRM Settings
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="office_start_time" label="Office Start Time" type="time" value={data.office_start_time} onChange={(v) => setData('office_start_time', v)} error={errors.office_start_time} />
                                        <FormInput name="office_end_time" label="Office End Time" type="time" value={data.office_end_time} onChange={(v) => setData('office_end_time', v)} error={errors.office_end_time} />
                                        <FormInput name="default_annual_leave" label="Default Annual Leave (Days)" type="number" value={data.default_annual_leave} onChange={(v) => setData('default_annual_leave', v)} error={errors.default_annual_leave} placeholder="e.g., 15" />
                                    </div>
                                </div>
                            )}

                        
                            <div className="flex justify-end pt-2">
                                <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm">
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Saving Settings...' : 'Save All Settings'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}