import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layouts/AppLayout';
import Breadcrumb from '@/Components/Shared/Breadcrumb';
import FormInput from '@/Components/UI/FormInput';
import Button from '@/Components/UI/Button';
import { 
    User, Mail, Phone, FileText, Camera, Save, X, AlertCircle, 
    Loader2, MapPin, Calendar, Briefcase 
} from 'lucide-react';
import toast from 'react-hot-toast';

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export default function UpdateProfile({ user }) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(user?.image_url || null);

    const { data, setData, put, processing, errors } = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        username: user?.username || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        date_of_birth: user?.date_of_birth || '',
        designation: user?.designation || '',
        address: user?.address || '',
        bio: user?.bio || '',
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(user?.image_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        
        put(route('profile.update'), {
            forceFormData: true, 
            preserveScroll: true,
            onSuccess: () => {
               
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Failed to update profile', {
                    duration: 4000,
                    icon: '❌',
                });
            },
        });
    };

    const breadcrumbItems = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Profile', href: route('profile.edit') },
    ];

    return (
        <AppLayout title="Update Profile">
            <Head title="Update Profile - ERP SaaS" />

            <div className="space-y-3">
                <Breadcrumb title="Profile" subTitle="Update Profile" breadcrumbItems={breadcrumbItems} />

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                      
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                           
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-slate-700 flex items-center">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-3">
                                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Personal Information
                            </h2>
                            
                            <div className="space-y-5">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput name="first_name" label="First Name" value={data.first_name} onChange={(v) => setData('first_name', v)} error={errors.first_name} icon={User} placeholder="John" required />
                                    <FormInput name="last_name" label="Last Name" value={data.last_name} onChange={(v) => setData('last_name', v)} error={errors.last_name} icon={User} placeholder="Doe" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput name="username" label="Username" value={data.username} onChange={(v) => setData('username', v)} error={errors.username} icon={User} placeholder="johndoe123" required />
                                    <FormInput name="email" label="Email Address" type="email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} icon={Mail} placeholder="john@example.com" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput name="phone" label="Mobile Number" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} icon={Phone} placeholder="98XXXXXXXX" />
                                    <FormInput name="gender" label="Gender" type="select" value={data.gender} onChange={(v) => setData('gender', v)} error={errors.gender} options={GENDER_OPTIONS} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput name="date_of_birth" label="Date of Birth" type="date" value={data.date_of_birth} onChange={(v) => setData('date_of_birth', v)} error={errors.date_of_birth} icon={Calendar} />
                                    <FormInput name="designation" label="Designation / Title" value={data.designation} onChange={(v) => setData('designation', v)} error={errors.designation} icon={Briefcase} placeholder="e.g., Senior Accountant" />
                                </div>

                                <FormInput name="address" label="Address" type="text" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} icon={MapPin} placeholder="Current address..." rows={2} />
                                <FormInput name="bio" label="Details / Bio" type="textarea" value={data.bio} onChange={(v) => setData('bio', v)} error={errors.bio} icon={FileText} placeholder="Tell us about yourself..." rows={4} />
                            </div>
                        </div>

                 
                        <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm p-6 h-fit lg:sticky lg:top-24">
                            
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-slate-700 flex items-center">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-3">
                                    <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Profile Image
                            </h2>

                            <div className="space-y-6">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Camera className="w-4 h-4" /> Choose File
                                </button>
                                
                                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />
                                
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or WEBP. Max 2MB.</p>

                                {previewImage ? (
                                    <div className="relative group">
                                        <img src={previewImage} alt="Profile Preview" className="w-full h-48 object-cover rounded-lg border-2 border-emerald-200 dark:border-emerald-800" />
                                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Remove image">
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
                                    <p className="text-xs text-red-500 flex items-center mt-2">
                                        <AlertCircle className="w-3 h-3 mr-1" /> {errors.image}
                                    </p>
                                )}

                                <Button type="submit" isLoading={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 mt-4">
                                    {processing ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Changes...</>
                                    ) : (
                                        <><Save className="w-5 h-5 mr-2" /> Save Changes</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}