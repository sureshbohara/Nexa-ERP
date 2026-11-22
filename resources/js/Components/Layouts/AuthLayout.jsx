import React from 'react';
import { Building2 } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                
              
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-r border-gray-100 dark:border-slate-700">
                    <div className="mb-6">
                        <div className="w-32 h-32 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-20 h-20 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
                        {title || 'Welcome to ERP SaaS!'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-center text-lg max-w-sm">
                        {subtitle || 'Sign in to manage your multi-tenant business management system.'}
                    </p>
                </div>

              
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}