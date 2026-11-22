import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FlashToaster from '@/Components/Shared/FlashToaster';

export default function AppLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
            <FlashToaster />
            
            <div className="flex min-h-screen">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                
                <div className="flex-1 flex flex-col min-w-0">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <main className="p-4 lg:p-6 flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}