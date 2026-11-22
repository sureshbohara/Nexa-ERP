import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { useUserForm } from '@/Hooks/useUserForm';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/Services/userService';
import { Camera, Save, X, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function UserForm({ user, dropdownData }) {
    const isEdit = !!user;
    const {
        data, setData, processing, errors,
        previewImage, fileInputRef,
        handleImageChange, removeImage, submit
    } = useUserForm(user, isEdit);

    const breadcrumbItems = [
        { label: 'System', href: route('dashboard') },
        { label: 'Users', href: route('users.index') },
    ];
    
    const filteredBranches = dropdownData?.branches?.filter(
        (b) => !data.organization_id || b.organization_id == data.organization_id
    ) || [];

    return (
        <AppLayout title={isEdit ? 'Edit User' : 'Create User'}>
            <Head title={isEdit ? 'Edit User - ERP SaaS' : 'Create User - ERP SaaS'} />

            <div className="space-y-3">
           
                <div className="flex items-center justify-between">
                    <Breadcrumb title="Users" subTitle={isEdit ? 'Edit User' : 'Create User'} breadcrumbItems={breadcrumbItems} />
                    <Link href={route('users.index')} className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                    </Link>
                </div>
                
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                     
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                                
                          
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700">
                                    Personal Information
                                </h2>
                                <div className="space-y-5 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="first_name" label="First Name" value={data.first_name} onChange={(v) => setData('first_name', v)} error={errors.first_name} placeholder="John" required />
                                        <FormInput name="last_name" label="Last Name" value={data.last_name} onChange={(v) => setData('last_name', v)} error={errors.last_name} placeholder="Doe" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="username" label="Username" value={data.username} onChange={(v) => setData('username', v)} error={errors.username} placeholder="johndoe123" required />
                                        <FormInput name="email" label="Email Address" type="email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} placeholder="john@example.com" required />
                                    </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="phone" label="Mobile Number" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} placeholder="98XXXXXXXX" />
                                         <FormInput name="address" label="Address" type="text" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} placeholder="Current address..." rows={2} />
                                    </div>
                                    
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="gender" label="Gender" type="select" value={data.gender} onChange={(v) => setData('gender', v)} error={errors.gender} options={GENDER_OPTIONS} />
                                        <FormInput name="date_of_birth" label="Date of Birth" type="date" value={data.date_of_birth} onChange={(v) => setData('date_of_birth', v)} error={errors.date_of_birth} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput name="designation" label="Designation / Title" value={data.designation} onChange={(v) => setData('designation', v)} error={errors.designation} placeholder="e.g., Senior Accountant" />
                                        <FormInput name="status" label="Status" type="select" value={data.status} onChange={(v) => setData('status', v)} error={errors.status} options={STATUS_OPTIONS} required />
                                    </div>
                                   
                                    <FormInput name="bio" label="Bio / About" type="textarea" value={data.bio} onChange={(v) => setData('bio', v)} error={errors.bio} placeholder="Tell us about this user..." rows={3} />
                                </div>

                           
                                
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput 
                                            name="password" 
                                            label={isEdit ? "New Password (leave blank to keep current)" : "Password"} 
                                            type="password" 
                                            value={data.password} 
                                            onChange={(v) => setData('password', v)} 
                                            error={errors.password} 
                                            placeholder={isEdit ? "Leave blank to keep current" : "Minimum 8 characters"} 
                                            required={!isEdit} 
                                        />
                                        <FormInput 
                                            name="password_confirmation" 
                                            label="Confirm Password" 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={(v) => setData('password_confirmation', v)} 
                                            error={errors.password_confirmation} 
                                            placeholder="Re-enter password" 
                                            required={!isEdit} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                      
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
                                
                        
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700">
                                    Organization & Role
                                </h2>
                                <div className="space-y-5 mb-8">
                                    <FormInput
                                        name="organization_id"
                                        label="Organization"
                                        type="select"
                                        value={data.organization_id}
                                        onChange={(v) => { setData('organization_id', v); setData('branch_id', ''); }}
                                        error={errors.organization_id}
                                        options={[{ value: '', label: '-- Select Organization --' }, ...(dropdownData?.organizations?.map(org => ({ value: org.id, label: org.name })) || [])]}
                                    />
                                    <FormInput
                                        name="branch_id"
                                        label="Branch"
                                        type="select"
                                        value={data.branch_id}
                                        onChange={(v) => setData('branch_id', v)}
                                        error={errors.branch_id}
                                        options={[{ value: '', label: '-- Select Branch --' }, ...filteredBranches.map(branch => ({ value: branch.id, label: branch.name }))]}
                                    />
                                    <FormInput
                                        name="role_id"
                                        label="Role"
                                        type="select"
                                        value={data.role_id}
                                        onChange={(v) => setData('role_id', v)}
                                        error={errors.role_id}
                                        options={[{ value: '', label: '-- Select Role --' }, ...(dropdownData?.roles?.map(role => ({ value: role.id, label: role.name })) || [])]}
                                        required
                                    />
                                </div>

                      
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-200 dark:border-slate-700">
                                    Profile Image
                                </h2>
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" /> Choose File
                                    </button>
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or WEBP. Max 2MB.</p>

                                    {previewImage ? (
                                        <div className="relative group">
                                            <img src={previewImage} alt="Profile Preview" className="w-full h-48 object-cover rounded-lg border-2 border-emerald-200 dark:border-emerald-800" />
                                            <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gray-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                    <Camera className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No image uploaded</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.image && (
                                        <p className="text-xs text-red-500 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" /> {errors.image}
                                        </p>
                                    )}

                                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700 mt-6">
                                        <Button type="submit" isLoading={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3">
                                            {processing ? (
                                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
                                            ) : (
                                                <><Save className="w-5 h-5 mr-2" /> {isEdit ? 'Update User' : 'Create User'}</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}