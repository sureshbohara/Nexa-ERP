import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { useOrganizationForm } from '@/Hooks/useOrganizationForm';
import { STATUS_OPTIONS } from '@/Services/organizationService';
import { Building2, Save, X, AlertCircle, Loader2, ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';

export default function OrganizationForm({ organization }) {
    const isEdit = !!organization;
    const {
        data, setData, processing, errors,
        previewLogo, fileInputRef,
        handleLogoChange, removeLogo, submit
    } = useOrganizationForm(organization, isEdit);

    const breadcrumbItems = [
        { label: 'System', href: route('dashboard') },
        { label: 'Organizations', href: route('organizations.index') },
    ];

    return (
        <AppLayout title={isEdit ? 'Edit Organization' : 'Create Organization'}>
            <Head title={isEdit ? 'Edit Organization' : 'Create Organization'} />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Breadcrumb title="System Management" subTitle={isEdit ? 'Edit Organization' : 'Create Organization'} breadcrumbItems={breadcrumbItems} />
                    <Link href={route('organizations.index')}>
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
                                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Organization Details
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                               
                                    <FormInput name="name" label="Organization Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} placeholder="e.g., Nepal Trading Pvt. Ltd." required />
                                    <FormInput name="code" label="Organization Code" value={data.code} onChange={(v) => setData('code', v)} error={errors.code} placeholder="e.g., ORG-001" required />
                                    <FormInput name="registration_number" label="Registration Number" value={data.registration_number} onChange={(v) => setData('registration_number', v)} error={errors.registration_number} placeholder="Company Reg. No." />
                                    <FormInput name="pan_vat_number" label="PAN / VAT Number" value={data.pan_vat_number} onChange={(v) => setData('pan_vat_number', v)} error={errors.pan_vat_number} placeholder="PAN/VAT No." />
                                    
                               
                                    <FormInput name="contact_person" label="Contact Person" value={data.contact_person} onChange={(v) => setData('contact_person', v)} error={errors.contact_person} placeholder="Full Name" />
                                    <FormInput name="phone" label="Primary Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} placeholder="98XXXXXXXX" required />
                                    <FormInput name="alternate_phone" label="Alternate Phone" value={data.alternate_phone} onChange={(v) => setData('alternate_phone', v)} error={errors.alternate_phone} placeholder="98XXXXXXXX" />
                                    <FormInput name="email" label="Email Address" type="email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} placeholder="info@example.com" />
                                    
                                
                                    <FormInput name="province" label="Province" value={data.province} onChange={(v) => setData('province', v)} error={errors.province} placeholder="e.g., Bagmati" />
                                    <FormInput name="district" label="District" value={data.district} onChange={(v) => setData('district', v)} error={errors.district} placeholder="e.g., Kathmandu" />
                                    <FormInput name="municipality" label="Municipality" value={data.municipality} onChange={(v) => setData('municipality', v)} error={errors.municipality} placeholder="e.g., Kathmandu Metro" />
                                    <FormInput name="ward_number" label="Ward Number" value={data.ward_number} onChange={(v) => setData('ward_number', v)} error={errors.ward_number} placeholder="e.g., 10" />
                                    
                                    <div className="md:col-span-2">
                                        <FormInput name="address" label="Full Address" type="textarea" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} placeholder="Street name, landmark, etc." rows={3} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                  
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sticky top-24 space-y-6">
                                
                      
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Organization Logo
                                    </h2>
                                    <div className="space-y-3">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Camera className="w-4 h-4" /> Choose File
                                        </button>
                                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="hidden" />
                                        
                                        {previewLogo ? (
                                            <div className="relative group">
                                                <img src={previewLogo} alt="Logo Preview" className="w-full h-40 object-contain rounded-lg border-2 border-emerald-200 dark:border-emerald-800 bg-gray-50 dark:bg-slate-900" />
                                                <button type="button" onClick={removeLogo} className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 bg-gray-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                        <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">No logo uploaded</p>
                                                </div>
                                            </div>
                                        )}
                                        {errors.logo && (
                                            <p className="text-xs text-red-500 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" /> {errors.logo}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or WEBP. Max 2MB.</p>
                                    </div>
                                </div>

                                {/* 2. Additional Metadata Section */}
                                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 space-y-4">
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Additional Details
                                    </h2>
                                    
                                    <FormInput 
                                        name="established_date" 
                                        label="Established Date" 
                                        type="date" 
                                        value={data.established_date} 
                                        onChange={(v) => setData('established_date', v)} 
                                        error={errors.established_date} 
                                    />
                                    
                                    <FormInput 
                                        name="website" 
                                        label="Website" 
                                        type="text" 
                                        value={data.website} 
                                        onChange={(v) => setData('website', v)} 
                                        error={errors.website} 
                                        placeholder="https://example.com" 
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
                                </div>

                           
                                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <Button type="submit" isLoading={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3">
                                        {processing ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
                                        ) : (
                                            <><Save className="w-5 h-5 mr-2" /> {isEdit ? 'Update Organization' : 'Create Organization'}</>
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