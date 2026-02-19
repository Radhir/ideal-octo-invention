import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ChevronRight, Terminal, User, Menu,
    MessageSquare, Zap, Plus, Home, Briefcase,
    Settings, Search, Activity, Users, FileText,
    UserCircle, ShieldCheck, FilePlus, ShoppingCart,
    Truck, BarChart3, Package, LayoutDashboard, Calendar, ClipboardCheck,
    LogOut, MoreHorizontal, CreditCard, ShieldCheck as Shield
} from 'lucide-react';
import UserDropdown from '../components/UserDropdown';
import UniversalBottomNav from '../components/UniversalBottomNav';
import WorkflowCenter from '../components/QuickAccessHub'; // Renamed import for clarity
import BranchSwitcher from '../components/BranchSwitcher';
import BrandSwitcher from '../components/BrandSwitcher';
import NotificationBell from '../components/NotificationBell';

import Sidebar from '../components/Sidebar';
import './AppLayout.css';

const AppLayout = () => {
    const { user, logout } = useAuth();
    const { currentBrand } = useBrand();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).toUpperCase();
    };

    // Dynamically get user name and role
    const userName = user?.name || user?.username || 'User';
    const userRole = user?.role_name || 'Administrator';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, path: '/portfolio', label: 'Dashboard' },
        { icon: <BarChart3 size={20} />, path: '/analytics', label: 'Management' },
        { icon: <Briefcase size={20} />, path: '/job-cards', label: 'Workshop Hub' },
        { icon: <Activity size={20} />, path: '/job-board', label: 'Workshop Board' },
        { icon: <Calendar size={20} />, path: '/bookings', label: 'Bookings' },
        { icon: <Users size={20} />, path: '/leads', label: 'CRM / Leads' },
        { icon: <Package size={20} />, path: '/stock', label: 'Inventory' },
        { icon: <FileText size={20} />, path: '/invoices', label: 'Invoices' },
        { icon: <CreditCard size={20} />, path: '/finance', label: 'Finance Hub' },
        { icon: <Users size={20} />, path: '/hr', label: 'Human Resources' },
        { icon: <ShieldCheck size={20} />, path: '/risk-management', label: 'Risk & Audit' },
        { icon: <Package size={20} />, path: '/elitepro', label: 'ElitePro (EPM)' },
        { icon: <MessageSquare size={20} />, path: '/chat', label: 'Command Chat' },
        { icon: <Settings size={20} />, path: '/masters/vehicles', label: 'System Registry' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="app-container">
            {/* 1. Sidebar (New Component) */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <div className="app-content">
                {/* 2a. Premium Header */}
                <header className="premium-header">
                    <div className="header-user-profile">
                        <div className="user-avatar-circle" style={{ background: 'var(--gold)', color: '#000' }}>{userInitials}</div>
                        <div className="user-info-text">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="user-name" style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '400', color: 'var(--cream)', letterSpacing: '0' }}>{userName}</span>
                                <div className="verified-badge"><ShieldCheck size={8} /></div>
                            </div>
                            <div className="professional-status-row">
                                <span className="user-perf" style={{ color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', fontSize: '10px' }}>{userRole}</span>
                                <span className="verified-text">PROFESSIONAL. VERIFIED.</span>
                            </div>
                            {userRole === 'Administrator' && <span className="architect-pill">SYSTEMS ARCHITECT</span>}
                        </div>
                        <button className="me-pill" style={{ background: 'rgba(250, 249, 246, 0.05)', color: 'var(--cream)', border: '1px solid rgba(250, 249, 246, 0.1)' }} onClick={() => navigate('/profile')}>ME</button>
                    </div>

                    <div className="header-status-actions">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', marginRight: '20px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)', letterSpacing: '1px', fontFamily: 'monospace' }}>{formatTime(currentTime)}</span>
                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '1px' }}>{formatDate(currentTime)}</span>
                        </div>
                        <div className="status-indicator" style={{ background: 'rgba(176, 141, 87, 0.05)', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                            <span className="status-dot" style={{ background: 'var(--gold)', boxShadow: '0 0 15px var(--gold)' }}></span>
                            <span className="status-text" style={{ color: 'var(--gold)' }}>COMMAND ACTIVE</span>
                        </div>
                        <button className="logout-icon-btn" title="Logout" onClick={logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* 2b. Modular Main View */}
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            {/* Premium Universal Navigation */}
            <UniversalBottomNav />
            <WorkflowCenter />
        </div>
    );
};

export default AppLayout;
