import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bot, Key, Link as LinkIcon, Activity, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-slate-400 font-sans">Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'Agents', href: '/app/agents', icon: Bot },
        { name: 'Credentials', href: '/app/credentials', icon: Key },
        { name: 'Tools', href: '/app/tools', icon: LinkIcon },
        { name: 'Audit Logs', href: '/app/audit-logs', icon: Activity },
        { name: 'Documentation', href: '/docs', icon: BookOpen },
    ];

    return (
        <div className="flex h-screen bg-[#0B1120] font-sans selection:bg-cyan-500/30">
            {/* Sidebar */}
            <div className="w-64 bg-[#0F172A] border-r border-slate-800/60 flex flex-col shadow-xl z-10">
                <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
                    <img src="/logo.png" alt="Decarabian" className="h-8 w-8 object-contain mr-3 rounded" />
                    <h1 className="text-xl font-bold text-slate-50 tracking-wider font-heading uppercase">DECARABIAN</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href || (item.href !== '/app' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-400 shadow-sm' 
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
                                }`}
                            >
                                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-800/60 bg-[#0F172A]">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-300 truncate pr-2 font-heading">
                            {user.name}
                        </div>
                        <button onClick={logout} className="p-2 text-slate-500 hover:text-rose-400 rounded-md hover:bg-slate-800/50 transition-colors">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto bg-[#0B1120]">
                <main className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
