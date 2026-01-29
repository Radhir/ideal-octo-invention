import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';
import {
    Activity, Clipboard, ShieldCheck, Droplets, PaintBucket, Wrench, ShieldAlert, Video,
    UserPlus, LayoutDashboard, Users, Calendar, MessageSquare,
    Calculator, Receipt, TrendingUp, BarChart3,
    UserCircle, CheckSquare, Truck, Bell,
    Package, ShoppingCart, Construction, HardHat,
    Globe, Shield, LayoutGrid, Building2,
    Settings, FileJson, Image,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuickNotes from '../components/QuickNotes';
import AccordionMenu from '../components/AccordionMenu';

const CATEGORIES = [
    {
        id: 'OPERATIONS',
        name: 'Technical Services',
        icon: <Activity size={24} />,
        headline: 'PRECISION ENGINEERING',
        description: 'Managing the core workshop flow from reception to final QC and delivery.',
        color: '#3b82f6',
        modules: [
            { name: 'Job Cards', path: '/job-cards' },
            { name: 'PPF & Tinting', path: '/ppf' },
            { name: 'Ceramic Coating', path: '/ceramic' },
            { name: 'Detailing', path: '/job-cards' }, // Consolidated
            { name: 'Bodyshop', path: '/job-cards' }, // Consolidated
            { name: 'Quality Control', path: '/job-cards' }, // Consolidated
            { name: 'Scanner/Vision', path: '/job-cards' }, // Consolidated
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
            { name: 'Sales Dashboard', path: '/sales' },
            { name: 'Leads & Sales', path: '/leads' },
            { name: 'Customer Database', path: '/customers' },
            { name: 'Booking Schedule', path: '/bookings' },
            { name: 'Quick Chat', path: '/chat' },
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
            { name: 'General Accounting', path: '/finance/coa' },
            { name: 'Billing & Cashier', path: '/invoices' },
            { name: 'Budget Control', path: '/finance/budget' },
            { name: 'Revenue Reports', path: '/finance/reports' },
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
            { name: 'HR Management', path: '/hr' },
            { name: 'Attendance Logs', path: '/hr/attendance' },
            { name: 'Logistics/Drivers', path: '/pick-drop' },
            { name: 'Duty Approvals', path: '/requests' },
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
            { name: 'Procurement', path: '/requests' }, // Using Requests as Procurement for now
            { name: 'Asset Control', path: '/stock' },
            { name: 'Manufacturing', path: '/construction' },
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
            { name: 'Company Strategy', path: '/mission-control' },
            { name: 'Risk & Audit', path: '/construction' },
            { name: 'Portfolio Hub', path: '/portfolio' },
            { name: 'Branch Management', path: '/construction' },
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
            { name: 'Global Settings', path: '/construction' },
            { name: 'Forms Hub', path: '/construction' },
            { name: 'Media Library', path: '/construction' },
        ]
    }
];

import MeetingRoomWidget from '../components/MeetingRoomWidget';

// ... imports remain ...

const HomePage = () => {
    const navigate = useNavigate();
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            color: '#fff',
            overflowX: 'hidden'
        }}>
            {/* Main Layout Area */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', gap: '80px', alignItems: 'start', paddingTop: '20px' }}>

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
                        padding: '30px'
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

                    <AccordionMenu items={CATEGORIES.map(cat => ({
                        id: cat.id,
                        title: cat.name,
                        icon: cat.icon,
                        subItems: cat.modules.map(m => ({ label: m.name, path: m.path }))
                    }))} />
                </GlassCard>

                {/* 2. Center: Meeting Room & Tools */}
                <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '10px' }}>

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
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
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
