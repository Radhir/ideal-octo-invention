import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, BarChart3, Briefcase, Activity, Calendar,
    Users, Package, FileText, CreditCard, ShieldCheck,
    MessageSquare, Settings, LogOut, ChevronRight, Paintbrush
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../layouts/AppLayout.css'; // Reusing existing CSS file but targeting new classes

const NavItem = ({ item, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const location = useLocation();

    // Auto-expand if a sub-item is active
    const isActive = React.useMemo(() => {
        if (location.pathname === item.path) return true;
        if (hasSubItems) {
            return item.subItems.some(sub => location.pathname.startsWith(sub.path));
        }
        return false;
    }, [location.pathname, item.path, item.subItems, hasSubItems]);

    const Icon = item.icon;

    if (hasSubItems) {
        return (
            <div className={`nav-item-container depth-${depth}`}>
                <div
                    className={`nav-item collapsible ${isActive ? 'active' : ''}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {Icon && <Icon size={18} className="nav-icon" />}
                    <span className="nav-label">{item.label}</span>
                    <ChevronRight
                        size={14}
                        className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
                    />
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="sub-menu"
                        >
                            {item.subItems.map((sub, idx) => (
                                <NavItem key={idx} item={sub} depth={depth + 1} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `nav-item depth-${depth} ${isActive ? 'active' : ''}`}
        >
            {Icon && <Icon size={18} className="nav-icon" />}
            <span className="nav-label">{item.label}</span>
        </NavLink>
    );
};

const Sidebar = ({ isOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuData = [
        {
            category: 'MAIN', items: [
                { icon: LayoutDashboard, label: 'DASHBOARD', path: '/portfolio' },
                { icon: BarChart3, label: 'MANAGEMENT', path: '/analytics' },
            ]
        },
        {
            category: 'ADVISOR', items: [
                { icon: Users, label: 'CUSTOMERS', path: '/customers' },
                { icon: Calendar, label: 'JOB APPOINTMENT', path: '/bookings/create' },
                { icon: FileText, label: 'ESTIMATION', path: '/job-cards' },
                { icon: Briefcase, label: 'JOB CARD', path: '/job-cards/create' },
                { icon: CreditCard, label: 'BILLING JOB CARD', path: '/invoices/create' },
                { icon: Package, label: 'IMAGES UPLOAD', path: '/job-cards/media' },
                { icon: ShieldCheck, label: 'GATE PASS', path: '/construction' },
            ]
        },
        {
            category: 'ACCOUNTS', items: [
                { icon: Briefcase, label: 'GROUP', path: '/finance/groups' },
                { icon: Package, label: 'ACCOUNT GROUP', path: '/finance/account-groups' },
                { icon: FileText, label: 'ACCOUNT LEDGER', path: '/finance/ledgers' },
                { icon: Activity, label: 'LINKING ACCOUNT', path: '/finance/linking' },
                {
                    icon: CreditCard, label: 'REPORTS', path: '#', subItems: [
                        { label: 'PAYMENT REGISTER', path: '/finance/reports/payments' },
                        { label: 'RECEIPT REGISTER', path: '/finance/reports/receipts' },
                        { label: 'ACCOUNT LEDGER', path: '/finance/reports/ledger' },
                        { label: 'GROUP REPORT', path: '/finance/reports/group' },
                    ]
                },
                {
                    icon: BarChart3, label: 'STATEMENTS', path: '#', subItems: [
                        { label: 'PROFIT AND LOSS', path: '/finance/reports/pnl' },
                        { label: 'BALANCE SHEET', path: '/finance/reports/balance-sheet' },
                        { label: 'TRIAL BALANCE', path: '/finance/reports/trial-balance' },
                        { label: 'VAT REPORT', path: '/finance/reports/vat' },
                    ]
                }
            ]
        },
        {
            category: 'HRMS', items: [
                {
                    icon: Users, label: 'MASTERS', path: '#', subItems: [
                        { label: 'DEPARTMENT', path: '/admin/departments' },
                        { label: 'MARITAL STATUS', path: '/hr/masters/marital' },
                        { label: 'DEDUCTION TYPE', path: '/hr/masters/deductions' },
                        { label: 'EMPLOYEE', path: '/hr/directory' },
                        { label: 'DOCUMENTS', path: '/hr/documents' },
                    ]
                },
                { icon: Settings, label: 'SALARY', path: '/hr/payroll' },
            ]
        },
        {
            category: 'SYSTEM', items: [
                { icon: Settings, label: 'REGISTRY', path: '/masters/vehicles' },
                { icon: LogOut, label: 'LOGOUT', path: '#', action: 'LOGOUT' }
            ]
        }
    ];

    const handleLogout = () => {
        if (window.confirm('End current session?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className={`premium-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <img src="/elite_shine_logo.png" alt="Elite Shine" />
                </div>
                <div className="brand-text">
                    <h1>ELITE SHINE</h1>
                    <span>OPERATING SYSTEM</span>
                </div>
            </div>

            <nav className="sidebar-menu">
                {menuData.map((group, idx) => (
                    <div key={idx} className="nav-group">
                        <div className="nav-group-label">{group.category}</div>
                        {group.items.map((item, i) => (
                            item.action === 'LOGOUT' ? (
                                <button key={i} className="nav-item logout-btn" onClick={handleLogout}>
                                    <item.icon size={18} className="nav-icon" />
                                    <span className="nav-label">{item.label}</span>
                                </button>
                            ) : (
                                <NavItem key={i} item={item} />
                            )
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="version-tag">v3.0.0-ENTERPRISE</div>
            </div>
        </aside>
    );
};

export default Sidebar;
