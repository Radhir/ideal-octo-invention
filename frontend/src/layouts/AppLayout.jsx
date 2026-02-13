import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ChevronRight, Terminal, User, Menu,
    ClipboardList, MessageSquare, Zap, Plus,
    Home, Briefcase, Settings, Search
} from 'lucide-react';
import UserDropdown from '../components/UserDropdown';
import BottomNav from '../components/BottomNav';
import QuickAccessHub from '../components/QuickAccessHub';
import BranchSwitcher from '../components/BranchSwitcher';
import NotificationBell from '../components/NotificationBell';

import './AppLayout.css';

const AppLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const sidebarItems = [
        { icon: <Home size={20} />, path: '/', label: 'Home' },
        { icon: <ClipboardList size={20} />, path: '/job-cards', label: 'Jobs' },
        { icon: <Plus size={20} />, path: '/jobs/builder', label: 'New Job' },
        { icon: <Briefcase size={20} />, path: '/finance', label: 'Treasury' },
        { icon: <Zap size={20} />, path: '/leads', label: 'Leads' },
        { icon: <MessageSquare size={20} />, path: '/chat', label: 'Comms' },
        { icon: <Settings size={20} />, path: '/hr/access', label: 'Admin' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="app-container">
            {/* 2. Main Content Area */}
            <div className="app-content">
                {/* 2a. Bento Header */}
                <header className="app-header">
                    <div className="header-left">
                        <BranchSwitcher />
                    </div>

                    <div className="header-center">
                        <div className="header-search-bar">
                            <Search size={16} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>⌘K</div>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="header-actions">
                            <NotificationBell />
                            <div className="sidebar-icon-btn">
                                <Terminal size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2b. Modular Main View */}
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            {/* 1. Thin Sidebar (Desktop) - Right Side */}
            <aside className="app-sidebar">
                <div className="sidebar-logo">
                    <img src="/elite_shine_logo.png" alt="Logo" style={{ width: '100%', height: 'auto', filter: 'brightness(1.5)' }} />
                </div>

                <nav className="sidebar-nav">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-icon-btn ${isActive(item.path) ? 'active' : ''}`}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <UserDropdown />
                </div>
            </aside>

            {/* Mobile Navigation */}
            <BottomNav />
            <QuickAccessHub />
        </div>
    );
};

export default AppLayout;
