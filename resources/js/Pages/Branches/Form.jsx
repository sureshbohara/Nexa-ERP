import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { useBranchForm } from '@/Hooks/useBranchForm';
import { STATUS_OPTIONS, BRANCH_TYPE_OPTIONS } from '@/Services/branchService';
import { Building2, Save, Loader2, ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';

export default function BranchForm({ branch, organizations }) {
    const isEdit = !!branch;
    const { data, setData, processing, errors, submit } = useBranchForm(branch, isEdit);

    const breadcrumbItems = [
        { label: 'System', href: route('dashboard') },
        { label: 'Branches', href: route('branches.index') },
    ];

    return (
        <AppLayout title={isEdit ? 'Edit Branch' : 'Create Branch'}>
            <Head title={isEdit ? 'Edit Branch' : 'Create Branch'} />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Breadcrumb title="System Management" subTitle={isEdit ? 'Edit Branch' : 'Create Branch'} breadcrumbItems={breadcrumbItems} />
                    <Link href={route('branches.index')}>
                        <Button variant="secondary" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>
                    </Link>
                </div>
                
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                     
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Contact & Address Details
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  
                                    <div className="md:col-span-2">
                                        <FormInput name="name" label="Branch Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} placeholder="e.g., Kathmandu Branch" required />
                                    </div>
                                    <FormInput name="manager_name" label="Manager Name" value={data.manager_name} onChange={(v) => setData('manager_name', v)} error={errors.manager_name} placeholder="Full Name" />
                                    <FormInput name="phone" label="Primary Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} placeholder="98XXXXXXXX" required />
                                    <FormInput name="alternate_phone" label="Alternate Phone" value={data.alternate_phone} onChange={(v) => setData('alternate_phone', v)} error={errors.alternate_phone} placeholder="98XXXXXXXX" />
                                    <FormInput name="email" label="Email Address" type="email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} placeholder="branch@example.com" />
                                    
                               
                                 
                                    <FormInput name="province" label="Province" value={data.province} onChange={(v) => setData('province', v)} error={errors.province} placeholder="e.g., Bagmati" required />
                                    <FormInput name="district" label="District" value={data.district} onChange={(v) => setData('district', v)} error={errors.district} placeholder="e.g., Kathmandu" required />
                                    <FormInput name="municipality" label="Municipality" value={data.municipality} onChange={(v) => setData('municipality', v)} error={errors.municipality} placeholder="e.g., Kathmandu Metro" />
                                    <FormInput name="ward_number" label="Ward Number" value={data.ward_number} onChange={(v) => setData('ward_number', v)} error={errors.ward_number} placeholder="e.g., 10" />
                                    <div className="md:col-span-2">
                                        <FormInput name="address" label="Full Address" type="text" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} placeholder="Street name, landmark, etc." rows={3} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                  
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sticky top-24 space-y-5">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Branch Identity
                                </h2>
                                
                          
                                <FormInput 
                                    name="organization_id" 
                                    label="Organization" 
                                    type="select" 
                                    value={data.organization_id} 
                                    onChange={(v) => setData('organization_id', v)} 
                                    error={errors.organization_id} 
                                    options={[{ value: '', label: '-- Select Organization --' }, ...(organizations?.map(org => ({ value: org.id, label: org.name })) || [])]} 
                                    required 
                                />
                                
                                <FormInput 
                                    name="code" 
                                    label="Branch Code" 
                                    value={data.code} 
                                    onChange={(v) => setData('code', v)} 
                                    error={errors.code} 
                                    placeholder="e.g., BR-001" 
                                    required 
                                />
                                
                                <FormInput 
                                    name="branch_type" 
                                    label="Branch Type" 
                                    type="select" 
                                    value={data.branch_type} 
                                    onChange={(v) => setData('branch_type', v)} 
                                    error={errors.branch_type} 
                                    options={BRANCH_TYPE_OPTIONS} 
                                    required 
                                />
                                
                                <FormInput 
                                    name="status" 
                                    label="Status" 
                                    type="select" 
                                    value={data.status} 
                                    onChange={(v) => setData('status', v)} 
                                    error={errors.status} 
                                    options={STATUS_OPTIONS} 
                                    required 
                                />

                            
                                <div className="pt-4 border-t border-gray-200 dark:border-slate-700 mt-6">
                                    <Button type="submit" isLoading={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3">
                                        {processing ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
                                        ) : (
                                            <><Save className="w-5 h-5 mr-2" /> {isEdit ? 'Update Branch' : 'Create Branch'}</>
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