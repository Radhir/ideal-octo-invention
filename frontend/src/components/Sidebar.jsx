import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, BarChart3, Briefcase, Activity, Calendar,
    Users, Package, FileText, CreditCard, ShieldCheck,
    MessageSquare, Settings, LogOut, ChevronRight, Paintbrush
} from 'lucide-react';
import '../layouts/AppLayout.css'; // Reusing existing CSS file but targeting new classes

const Sidebar = ({ isOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        {
            category: 'MAIN', items: [
                { icon: LayoutDashboard, label: 'DASHBOARD', path: '/portfolio' },
                { icon: BarChart3, label: 'MANAGEMENT', path: '/analytics' },
            ]
        },
        {
            category: 'OPERATIONS', items: [
                { icon: Briefcase, label: 'WORKSHOP HUB', path: '/job-cards' },
                { icon: Paintbrush, label: 'PAINT CONTROL', path: '/paint/dashboard' },
                { icon: Activity, label: 'JOB BOARD', path: '/job-board' },
                { icon: Calendar, label: 'BOOKINGS', path: '/bookings' },
            ]
        },
        {
            category: 'COMMERCIAL', items: [
                { icon: Users, label: 'CRM / LEADS', path: '/leads' },
                { icon: Package, label: 'INVENTORY', path: '/stock' },
                { icon: FileText, label: 'INVOICES', path: '/invoices' },
                { icon: CreditCard, label: 'FINANCE', path: '/finance' },
            ]
        },
        {
            category: 'ADMIN', items: [
                { icon: Users, label: 'HR & TEAM', path: '/hr' },
                { icon: ShieldCheck, label: 'RISK & AUDIT', path: '/risk-management' },
                { icon: Package, label: 'ELITE PRO', path: '/elitepro' },
                { icon: Settings, label: 'REGISTRY', path: '/masters/vehicles' },
            ]
        }
    ];

    const handleLogout = () => {
        if (window.confirm('End curent session?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className={`premium-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Brand Header */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <img src="/elite_shine_logo.png" alt="Elite Shine" />
                </div>
                <div className="brand-text">
                    <h1>ELITE SHINE</h1>
                    <span>OPERATING SYSTEM</span>
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="sidebar-menu">
                {navItems.map((group, idx) => (
                    <div key={idx} className="nav-group">
                        <div className="nav-group-label">{group.category}</div>
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon size={18} className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                                {item.path === '/chat' && <div className="nav-badge">3</div>}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut size={18} className="nav-icon" />
                    <span className="nav-label">TERMINATE SESSION</span>
                </button>
                <div className="version-tag">v2.4.0-PROD</div>
            </div>
        </aside>
    );
};

export default Sidebar;
