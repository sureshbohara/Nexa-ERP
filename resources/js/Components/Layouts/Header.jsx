import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Bell, Sun, Moon, ChevronDown, LogOut, User, Key, Check, Loader2 } from 'lucide-react';
import GlobalSearchModal from '@/Components/Shared/GlobalSearchModal';
import { useDarkMode } from '@/Hooks/useDarkMode';

export default function Header({ setSidebarOpen }) {
    const { auth } = usePage().props;
    const [isDark, setIsDark] = useDarkMode();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotif, setLoadingNotif] = useState(false);

    const userRef = useRef(null);
    const notifRef = useRef(null);
    const user = auth?.user;

  
    const loadNotifications = useCallback(async () => {
        try {
            setLoadingNotif(true);
            const res = await fetch(route('notifications.recent'), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
            setUnreadCount(Number(data.unread_count || 0));
        } catch (e) {
          
        } finally {
            setLoadingNotif(false);
        }
    }, []);


    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

 
    useEffect(() => {
        if (showNotifications) loadNotifications();
    }, [showNotifications, loadNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) setShowUserMenu(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => router.post(route('logout'));

    const handleMarkRead = (id) => {
        router.post(route('notifications.read', id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => loadNotifications(),
        });
    };

    const handleMarkAllRead = () => {
        router.post(route('notifications.read-all'), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => loadNotifications(),
        });
    };

    const priorityDot = {
        high: 'bg-red-500',
        normal: 'bg-blue-500',
        low: 'bg-gray-400',
    };

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">

                <div className="flex items-center flex-1 gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 dark:text-gray-300 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <GlobalSearchModal />
                </div>

                <div className="flex items-center space-x-2 lg:space-x-4">

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        title="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

               
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                            className="relative p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Notifications {unreadCount > 0 && <span className="text-xs text-gray-500">({unreadCount} unread)</span>}
                                    </h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {loadingNotif && notifications.length === 0 ? (
                                        <div className="flex items-center justify-center py-8 text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                                            No notifications
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                                            {notifications.map((n) => (
                                                <li
                                                    key={n.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className={`mt-1.5 w-2 h-2 shrink-0 rounded-full ${priorityDot[n.priority] || 'bg-gray-400'}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {n.title}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                                                                {n.message}
                                                            </p>
                                                            <p className="text-[11px] text-gray-400 mt-1">{n.created_at}</p>
                                                        </div>
                                                        {!n.is_read && (
                                                            <button
                                                                onClick={() => handleMarkRead(n.id)}
                                                                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <Link
                                    href={route('notifications.index')}
                                    onClick={() => setShowNotifications(false)}
                                    className="block px-4 py-2.5 text-center text-sm font-medium text-emerald-600 hover:bg-gray-50 dark:hover:bg-slate-700 border-t border-gray-100 dark:border-slate-700"
                                >
                                    View all notifications
                                </Link>
                            </div>
                        )}
                    </div>

 
                    <div className="relative" ref={userRef}>
                        <button
                            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role || 'Admin'}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || 'N/A'}
                                    </p>
                                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>

                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setShowUserMenu(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <User className="w-4 h-4 mr-3 text-gray-400" /> Profile Settings
                                </Link>
                                <Link
                                    href={route('profile.password')}
                                    onClick={() => setShowUserMenu(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Key className="w-4 h-4 mr-3 text-gray-400" /> Change Password
                                </Link>

                                <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}