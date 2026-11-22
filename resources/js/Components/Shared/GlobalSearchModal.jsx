import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Search, X, Loader2, FileText, User, Building2, Package, Users, Briefcase } from 'lucide-react';

const ICONS = {
    user: User,
    organization: Building2,
    product: Package,
    customer: Users,
    supplier: Briefcase,
    sale: FileText,
    employee: User,
};

export default function GlobalSearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);


    useEffect(() => {
        if (!isOpen || query.length < 2) {
            setResults({});
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/global-search?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.data || {});
                }
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    const handleSelect = (url) => {
        setIsOpen(false);
        setQuery('');
        setResults({});
        router.visit(url);
    };

    const hasResults = Object.keys(results).length > 0;

    return (
        <>
  
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center w-full max-w-md px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
                <Search className="w-4 h-4 mr-2" />
                <span>Search products, sales, invoices...</span>
                <kbd className="hidden ml-auto px-2 py-0.5 text-xs font-semibold bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded">
                    ⌘K
                </kbd>
            </button>

 
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsOpen(false)}
                    />
                    
          
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[60vh] animate-in fade-in zoom-in-95 duration-200">
                        
              
                        <div className="flex items-center px-4 border-b border-gray-200 dark:border-slate-700">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type to search..."
                                className="w-full px-4 py-4 text-base bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            />
                            {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

              
                        <div className="overflow-y-auto p-2 custom-scrollbar">
                            {!hasResults && !isLoading && query.length >= 2 && (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No results found for "{query}"
                                </div>
                            )}
                            
                            {!hasResults && !isLoading && query.length < 2 && (
                                <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                                    Type at least 2 characters to search...
                                </div>
                            )}

                            {Object.entries(results).map(([category, items]) => {
                                const Icon = ICONS[category] || FileText;
                                const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
                                
                                return (
                                    <div key={category} className="mb-4">
                                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {categoryName}
                                        </h3>
                                        <ul className="space-y-1">
                                            {items.map((item) => (
                                                <li key={`${category}-${item.id}`}>
                                                    <button
                                                        onClick={() => handleSelect(item.url)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left group"
                                                    >
                                                        <div className="p-2 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-emerald-600 transition-colors">
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {item.subtitle}
                                                            </p>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>

                  
                        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">↑↓</kbd> to navigate</span>
                                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">↵</kbd> to open</span>
                            </div>
                            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">esc</kbd> to close</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}