import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Not Found" />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <SearchX className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">The page you are looking for does not exist.</p>
                    <Link href={route('dashboard')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}