import React from 'react';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import {
    Activity, Calculator, Package, Settings, Globe, UserCircle, UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import QuickNotes from '../components/QuickNotes';
import AccordionMenu from '../components/AccordionMenu';
import { usePermissions } from '../context/PermissionContext';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import MeetingRoomWidget from '../components/MeetingRoomWidget';

const CATEGORIES = [
    {
        id: 'OPERATIONS',
        name: 'Technical Services',
        icon: <Activity size={24} />,
        headline: 'PRECISION ENGINEERING',
        description: 'Managing the core workshop flow from reception to final QC and delivery.',
        color: '#3b82f6',
        modules: [
            { name: 'Job Cards', path: '/job-cards', permission: 'job_cards' },
            { name: 'PPF & Tinting', path: '/ppf', permission: 'job_cards' },
            { name: 'Ceramic Coating', path: '/ceramic', permission: 'job_cards' },
            { name: 'Detailing', path: '/job-cards', permission: 'job_cards' },
            { name: 'Bodyshop', path: '/job-cards', permission: 'job_cards' },
            { name: 'Quality Control', path: '/job-cards', permission: 'job_cards' },
            { name: 'Scanner/Vision', path: '/job-cards', permission: 'job_cards' },
        ]
    },
    {
        id: 'CRM',
        name: 'Front Office',
        icon: <UserPlus size={24} />,
        headline: 'CUSTOMER EXCELLENCE',
        description: 'Strengthening relationships and driving sales through interactive lead management.',
        color: '#ec4899',
        modules: [
            { name: 'Sales Dashboard', path: '/sales', permission: 'job_cards' },
            { name: 'Leads & Sales', path: '/leads', permission: 'leads' },
            { name: 'Customer Database', path: '/customers', permission: 'customers' },
            { name: 'Booking Schedule', path: '/bookings', permission: 'bookings' },
            { name: 'Quick Chat', path: '/chat', permission: 'all' },
        ]
    },
    {
        id: 'FINANCE',
        name: 'Finance & Accounts',
        icon: <Calculator size={24} />,
        headline: 'CAPITAL STEWARDSHIP',
        description: 'Real-time financial tracking, billing, and automated ledger management.',
        color: '#8b5cf6',
        modules: [
            { name: 'General Accounting', path: '/finance/coa', permission: 'finance' },
            { name: 'Billing & Cashier', path: '/invoices', permission: 'invoices' },
            { name: 'Budget Control', path: '/finance/budget', permission: 'finance' },
            { name: 'Revenue Reports', path: '/finance/reports', permission: 'finance' },
        ]
    },
    {
        id: 'HR',
        name: 'Workforce',
        icon: <UserCircle size={24} />,
        headline: 'HUMAN CAPITAL',
        description: 'Empowering your team through structured attendance and performance tracking.',
        color: '#f43f5e',
        modules: [
            { name: 'HR Management', path: '/hr', permission: 'hr' },
            { name: 'Attendance Logs', path: '/hr/attendance', permission: 'attendance' },
            { name: 'Logistics/Drivers', path: '/pick-drop', permission: 'logistics' },
            { name: 'Duty Approvals', path: '/requests', permission: 'hr' },
        ]
    },
    {
        id: 'INVENTORY',
        name: 'Inventory & Assets',
        icon: <Package size={24} />,
        headline: 'RESOURCE OPTIMIZATION',
        description: 'Sleek supply chain control and asset tracking for maximum efficiency.',
        color: '#f59e0b',
        modules: [
            { name: 'Stock Inventory', path: '/stock' },
            { name: 'Procurement', path: '/stock/procurement' },
            { name: 'Asset Control', path: '/stock' },
            { name: 'Manufacturing', path: '/elitepro/inventory' },
        ]
    },
    {
        id: 'STRATEGY',
        name: 'Corporate & Strategy',
        icon: <Globe size={24} />,
        headline: 'STRATEGIC VISION',
        description: 'Level-up your brand with high-level strategy and multi-branch intelligence.',
        color: '#b08d57',
        modules: [
            { name: 'Company Strategy', path: '/mission-control', permission: 'settings' },
            { name: 'Risk & Audit', path: '/risk-management', permission: 'settings' },
            { name: 'Portfolio Hub', path: '/portfolio', permission: 'all' },
            { name: 'Branch Management', path: '/admin/branches', permission: 'settings' },
        ]
    },
    {
        id: 'SYSTEM',
        name: 'System Utils',
        icon: <Settings size={24} />,
        headline: 'CORE CONFIGURATION',
        description: 'Backend utilities, dynamic models, and system-wide settings.',
        color: '#2dd4bf',
        modules: [
            { name: 'Global Settings', path: '/admin/branches', permission: 'settings' },
            { name: 'Forms Hub', path: '/forms', permission: 'settings' },
            { name: 'Media Library', path: '/media', permission: 'settings' },
        ]
    }
];

const HomePage = () => {
    const { hasPermission } = usePermissions();

    // Regular employees only see the limited dashboard
    if (!hasPermission('dashboard')) {
        return <EmployeeDashboard />;
    }

    return (
        <div className="home-page-container" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(15px, 4vw, 40px)',
            color: '#fff',
            overflowX: 'hidden'
        }}>
            <style>{`
                .home-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 30px;
                    align-items: start;
                    padding-top: 20px;
                }
                @media (max-width: 1024px) {
                    .home-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }
            `}</style>
            {/* Main Layout Area */}
            <div className="home-grid">

                {/* 1. Sidebar - Left */}
                <GlassCard
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px',
                        height: '100%',
                        padding: '20px'
                    }}
                >
                    {/* Elite Shine Logo - Moved to Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ marginBottom: '20px', paddingLeft: '10px' }}
                    >
                        <img
                            src="/elite_shine_logo.png"
                            alt="Elite Shine Group"
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                filter: 'drop-shadow(0 0 15px rgba(176, 141, 87, 0.3)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.15))',
                                transition: 'filter 0.3s ease'
                            }}
                        />
                    </motion.div>

                    {/* Sidebar navigation filtered by permissions */}
                    <AccordionMenu items={CATEGORIES.map(cat => ({
                        id: cat.id,
                        title: cat.name,
                        icon: cat.icon,
                        subItems: cat.modules
                            .filter(m => !m.permission || hasPermission(m.permission))
                            .map(m => ({ label: m.name, path: m.path }))
                    })).filter(cat => cat.subItems.length > 0)} />
                </GlassCard>

                {/* 2. Center: Meeting Room & Tools */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '10px' }}>

                    {/* War Room / Meeting Room Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <MeetingRoomWidget />
                    </motion.div>

                    {/* Executive Notepad */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ width: '100%' }}
                    >
                        <QuickNotes />
                    </motion.div>

                </div>
            </div>

            {/* Bottom Indicator */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px' }}>
                <MagneticButton strength={0.4}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', cursor: 'pointer' }}
                    >
                        <div style={{ height: '50px', width: '2px', background: 'linear-gradient(to bottom, transparent, var(--gold))', opacity: 0.6 }} />
                        <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--gold)', letterSpacing: '2px' }}>ESTABLISHED 2026</div>
                    </motion.div>
                </MagneticButton>
            </div>
        </div>
    );
};

export default HomePage;
