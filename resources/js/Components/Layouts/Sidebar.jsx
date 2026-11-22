import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, X, Building2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/Utils/cn';
import { menuItems, hasPermission } from '@/Utils/menuConfig';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { url, props } = usePage();
    

    const [openMenus, setOpenMenus] = useState([]);


    const currentPath = useMemo(() => {
        if (!url) return '/';
        const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
        return path === '/' ? '/dashboard' : path;
    }, [url]);

    const userPermissions = props.auth?.user?.permissions || [];
    const roleName = props.auth?.user?.role?.name || '';


    const accessibleMenus = useMemo(() => {
        const filter = (items) => items.reduce((acc, item) => {
            if (item.children) {
                const filteredChildren = filter(item.children);
                if (filteredChildren.length > 0 && hasPermission(item.permission, userPermissions, roleName)) {
                    acc.push({ ...item, children: filteredChildren });
                }
            } else if (hasPermission(item.permission, userPermissions, roleName)) {
                acc.push(item);
            }
            return acc;
        }, []);
        return filter(menuItems);
    }, [userPermissions, roleName]);


    const isActive = (href) => {
        if (!href || href === '#') return false;
        try {
            const target = route(href, {}, false).replace(/^https?:\/\/[^/]+/, '').split('?')[0];
            return currentPath === target || currentPath.startsWith(target + '/');
        } catch { return false; }
    };

    const hasActiveChild = (item) => item.children?.some((child) => isActive(child.href));

    useEffect(() => {
        const activeParents = accessibleMenus.filter(hasActiveChild).map((item) => item.name);
        setOpenMenus((prev) => {
            const merged = [...new Set([...prev, ...activeParents])];

            return merged.length === prev.length && merged.every((m, i) => m === prev[i]) ? prev : merged;
        });
    }, [currentPath, accessibleMenus]);


    const toggleMenu = (name) => {
        setOpenMenus((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
    };


    const getHref = (href) => {
        try { return href === '#' ? '#' : route(href); } catch { return '#'; }
    };

    return (
        <>
   
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
            
     
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-72 flex-shrink-0 bg-slate-900 text-white transition-transform duration-300 ease-in-out",
                "lg:sticky lg:top-0 lg:z-10",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">ERP SaaS</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

          
                <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
                    {accessibleMenus.map((item) => {
                        const isParentActive = hasActiveChild(item);
                        const isOpenMenu = openMenus.includes(item.name);

                        return (
                            <div key={item.name}>
                                {item.children ? (
                                    <>
                               
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                                                isParentActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className={cn("w-5 h-5", isParentActive ? "text-primary-400" : "text-slate-400 group-hover:text-white")} />
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpenMenu && "rotate-180")} />
                                        </button>
                                        
                                
                                        {isOpenMenu && (
                                            <div className="mt-1 ml-4 pl-4 border-l border-slate-700 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={getHref(child.href)}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                                                            isActive(child.href) 
                                                                ? "text-primary-400 font-semibold bg-slate-800/50" 
                                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                        )}
                                                    >
                                                        <child.icon className="w-4 h-4 mr-3" />
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                           
                                    <Link
                                        href={getHref(item.href)}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                            isActive(item.href) ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}