import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { Save, ArrowLeft, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { SALARY_STATUS_OPTIONS } from '@/Services/salaryStructureService';

export default function SalaryStructureForm({ salaryStructure }) {
    const isEdit = !!salaryStructure;
    
    const initialData = {
        name: salaryStructure?.name || '',
        code: salaryStructure?.code || '',
        basic_salary: salaryStructure?.basic_salary || 0,
        house_rent_allowance: salaryStructure?.house_rent_allowance || 0,
        transport_allowance: salaryStructure?.transport_allowance || 0,
        medical_allowance: salaryStructure?.medical_allowance || 0,
        other_allowance: salaryStructure?.other_allowance || 0,
        provident_fund: salaryStructure?.provident_fund || 0,
        tax_deduction: salaryStructure?.tax_deduction || 0,
        other_deduction: salaryStructure?.other_deduction || 0,
        description: salaryStructure?.description || '',
        status: salaryStructure?.status || 'active',
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);


    const calculations = useMemo(() => {
        const basic = parseFloat(formData.basic_salary) || 0;
        const allowances = (parseFloat(formData.house_rent_allowance) || 0) +
                           (parseFloat(formData.transport_allowance) || 0) +
                           (parseFloat(formData.medical_allowance) || 0) +
                           (parseFloat(formData.other_allowance) || 0);
        const deductions = (parseFloat(formData.provident_fund) || 0) +
                           (parseFloat(formData.tax_deduction) || 0) +
                           (parseFloat(formData.other_deduction) || 0);
        const gross = basic + allowances;
        const net = gross - deductions;
        return { allowances, deductions, gross, net };
    }, [formData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const url = isEdit ? route('hrm.salary-structures.update', salaryStructure.id) : route('hrm.salary-structures.store');
        const method = isEdit ? 'put' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    const breadcrumbItems = [
        { label: 'HRM', href: route('dashboard') },
        { label: 'Salary Structures', href: route('hrm.salary-structures.index') },
    ];

    return (
        <AppLayout title={isEdit ? 'Edit Salary Structure' : 'Create Salary Structure'}>
            <Head title={isEdit ? 'Edit Salary Structure' : 'Create Salary Structure'} />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Breadcrumb title="Salary Structures" subTitle={isEdit ? 'Edit Structure' : 'Create Structure'} breadcrumbItems={breadcrumbItems} />
                    <Link href={route('hrm.salary-structures.index')} className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                 
                        <div className="lg:col-span-2 space-y-6">
                            
                      
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700">Basic Information</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="name" label="Structure Name" value={formData.name} onChange={(v) => handleChange('name', v)} error={errors.name} placeholder="e.g., Senior Manager" required />
                                        <FormInput name="code" label="Structure Code" value={formData.code} onChange={(v) => handleChange('code', v)} error={errors.code} placeholder="e.g., SS-MGR-01" required />
                                    </div>
                                    {!isEdit && (
                                        <FormInput name="status" label="Status" type="select" value={formData.status} onChange={(v) => handleChange('status', v)} error={errors.status} options={SALARY_STATUS_OPTIONS} required />
                                    )}
                                    <FormInput name="description" label="Description" type="textarea" value={formData.description} onChange={(v) => handleChange('description', v)} error={errors.description} placeholder="Brief description of this salary structure..." rows={3} />
                                </div>
                            </div>

                  
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-5 pb-2 border-b border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Earnings (Allowances)
                                </h2>
                                <div className="space-y-5">
                                    <FormInput name="basic_salary" label="Basic Salary (Rs.)" type="number" value={formData.basic_salary} onChange={(v) => handleChange('basic_salary', v)} error={errors.basic_salary} placeholder="0.00" required />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <FormInput name="house_rent_allowance" label="House Rent Allowance" type="number" value={formData.house_rent_allowance} onChange={(v) => handleChange('house_rent_allowance', v)} placeholder="0.00" />
                                        <FormInput name="transport_allowance" label="Transport Allowance" type="number" value={formData.transport_allowance} onChange={(v) => handleChange('transport_allowance', v)} placeholder="0.00" />
                                        <FormInput name="medical_allowance" label="Medical Allowance" type="number" value={formData.medical_allowance} onChange={(v) => handleChange('medical_allowance', v)} placeholder="0.00" />
                                        <FormInput name="other_allowance" label="Other Allowance" type="number" value={formData.other_allowance} onChange={(v) => handleChange('other_allowance', v)} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                        </div>

       
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                                
                                {/* Section 1: Deductions */}
                                <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5" /> Deductions
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <FormInput name="provident_fund" label="Provident Fund (PF)" type="number" value={formData.provident_fund} onChange={(v) => handleChange('provident_fund', v)} placeholder="0.00" />
                                    <FormInput name="tax_deduction" label="Tax Deduction (TDS)" type="number" value={formData.tax_deduction} onChange={(v) => handleChange('tax_deduction', v)} placeholder="0.00" />
                                    <FormInput name="other_deduction" label="Other Deduction" type="number" value={formData.other_deduction} onChange={(v) => handleChange('other_deduction', v)} placeholder="0.00" />
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 dark:border-slate-700 my-6"></div>

                                {/* Section 2: Salary Summary */}
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-emerald-600" /> Salary Summary
                                </h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Basic Salary</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Rs. {(parseFloat(formData.basic_salary) || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-600 dark:text-emerald-400">+ Total Allowances</span>
                                        <span className="font-medium text-emerald-600">Rs. {calculations.allowances.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-300 dark:border-slate-600 pt-3 flex justify-between items-center">
                                        <span className="font-semibold text-gray-900 dark:text-white">Gross Salary</span>
                                        <span className="font-bold text-blue-600 text-lg">Rs. {calculations.gross.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-red-600 dark:text-red-400">- Total Deductions</span>
                                        <span className="font-medium text-red-600">Rs. {calculations.deductions.toFixed(2)}</span>
                                    </div>

                                    <div className="bg-emerald-600 text-white rounded-lg p-4 mt-4 shadow-md">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium opacity-90">Net Salary (Take Home)</span>
                                            <span className="font-bold text-2xl">Rs. {calculations.net.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                        
                                <div className="border-t border-gray-200 dark:border-slate-700 my-6"></div>

                             
                                <div className="space-y-3">
                                    <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 flex items-center justify-center">
                                        {processing ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
                                        ) : (
                                            <><Save className="w-5 h-5 mr-2" /> {isEdit ? 'Update Structure' : 'Create Structure'}</>
                                        )}
                                    </Button>
                                 
                                </div>

                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}