import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, MapPin, AlertCircle, Menu } from 'lucide-react';
import { useAssets } from '../../hooks/useAssets';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onNavigate, onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { assets } = useAssets();
    const { user, login, logout } = useAuth();
    const [imgError, setImgError] = useState(false);
    const notificationRef = useRef(null);

    // Reset image error when user changes
    useEffect(() => {
        setImgError(false);
    }, [user]);


    const searchResults = searchQuery.length > 0
        ? assets.filter(asset =>
            asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    // Filter assets for notifications (Critical/Warning)
    const notifications = assets.filter(asset => asset.status === 'critical' || asset.status === 'warning');

    const handleSearchSelect = (asset) => {
        setSearchQuery('');
        if (onNavigate) {
            onNavigate('live', { assetId: asset.id });
        }
    };

    // Click outside to close notifications
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                // Only close unless we clicked inside user menu... 
                // Actually, let's just use separate refs or rely on bubble? 
                // Simplification: close both if clicking outside "header" actions area? 
                // Better: Just close user menu if not clicking inside it.
                setShowNotifications(false);
            }
            // Simple approach: Close user menu anywhere outside
            if (showUserMenu && !event.target.closest('.group')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 md:h-20 w-full flex items-center justify-between px-4 md:px-8 border-b border-slate-200 bg-white/50 backdrop-blur-sm relative z-30">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Breadcrumbs or Title */}
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Overview</h2>
                    <p className="hidden md:block text-sm text-slate-500 truncate max-w-[200px] lg:max-w-xs" title={`Welcome back, ${user?.displayName || 'User'}`}>
                        Welcome back, {user?.displayName || 'User'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500/50 focus:bg-white focus:ring-1 focus:ring-blue-500/50 transition-all w-32 md:w-64 focus:w-48 md:focus:w-64"
                    />

                    {/* Search Dropdown */}
                    {searchQuery && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 transform transition-all">
                            {searchResults.length > 0 ? (
                                searchResults.map(asset => (
                                    <button
                                        key={asset.id}
                                        onClick={() => handleSearchSelect(asset)}

                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start gap-3 border-b border-slate-50 last:border-0"
                                    >
                                        <div className={`p-2 rounded-lg ${asset.category === 'energy' ? 'bg-amber-100 text-amber-600' :
                                            asset.category === 'water' ? 'bg-cyan-100 text-cyan-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{asset.type}</p>
                                            <p className="text-xs text-slate-500">{asset.details} • <span className="uppercase">{asset.status}</span></p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-500">No assets found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 border-l border-slate-200 pl-4 md:pl-6">
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 outline-none"
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950 ring-2 ring-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform transition-all origin-top-right z-50">
                                <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-slate-700">Notifications</h3>
                                    <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{notifications.length} Active</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(note => (
                                            <button
                                                key={note.id}
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    if (onNavigate) {
                                                        onNavigate('live', { assetId: note.id });
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex gap-3 transition-colors"
                                            >
                                                <div className="mt-0.5 text-red-500 shrink-0">
                                                    <AlertCircle size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{note.type}: {note.val}</p>
                                                    <p className="text-xs text-slate-500">{note.details}</p>
                                                    <p className="text-[10px] uppercase font-bold text-red-500 mt-1">{note.status} Alert</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                                            No pending alerts.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Login / User Actions */}
                    {user ? (
                        <div className="relative group">
                            {/* Avatar Trigger (Clickable) */}
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 focus:outline-none"
                            >
                                {user.photoURL && !imgError ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-9 h-9 rounded-full border border-slate-200"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                                        <User size={18} />
                                    </div>
                                )}

                                {/* Desktop Text Only */}
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-slate-700">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</p>
                                </div>
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                                        <p className="font-semibold text-slate-800">{user.displayName || 'User'}</p>
                                        <p className="text-xs text-slate-500 break-all">{user.email}</p>
                                        {user.email === 'vishnurajanme@gmail.com' && (
                                            <span className="mt-2 text-[10px] inline-block font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wide">
                                                Super Admin
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        >
                                            <span className="uppercase">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={login}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <User size={16} /> Login
                        </button>
                    )}
                </div>
            </div>
        </header >
    );
};

