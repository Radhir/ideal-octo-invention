import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Activity, Briefcase,
    Settings, Users, Menu, X, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UniversalBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Portfolio', path: '/portfolio', icon: LayoutDashboard },
        { name: 'Intelligence', path: '/analytics', icon: Activity },
        { name: 'Operations', path: '/job-cards', icon: Briefcase },
        { name: 'Logistics', path: '/stock', icon: Settings },
        { name: 'Team', path: '/hr', icon: Users },
    ];

    const styles = {
        floatingNav: {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(232, 218, 206, 0.1)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(232, 218, 206, 0.2)',
            borderRadius: '100px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 5000,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },
        navBtn: {
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: '#e8dace',
        },
        sidebarMenu: {
            position: 'fixed',
            inset: 0,
            zIndex: 6000,
            display: 'flex',
            justifyContent: 'flex-end',
        },
        sidebarContent: {
            width: '100%',
            maxWidth: '400px',
            background: '#e8dace',
            color: '#1a1a1a',
            height: '100%',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            position: 'relative',
        }
    };

    const isActive = (path) => {
        if (path === '/portfolio') return location.pathname === '/portfolio';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Centered Dock */}
            <motion.div
                initial={{ y: 100, x: '-50%' }}
                animate={{ y: 0, x: '-50%' }}
                style={styles.floatingNav}
            >
                {navItems.map((item) => (
                    <motion.div
                        key={item.name}
                        whileHover={{ backgroundColor: 'rgba(232, 218, 206, 0.2)' }}
                        style={{
                            ...styles.navBtn,
                            backgroundColor: isActive(item.path) ? 'rgba(232, 218, 206, 0.2)' : 'transparent',
                            color: isActive(item.path) ? '#fff' : '#e8dace'
                        }}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon size={20} strokeWidth={isActive(item.path) ? 2 : 1.5} />
                    </motion.div>
                ))}

                <div style={{ width: '1px', height: '20px', background: 'rgba(232, 218, 206, 0.2)', margin: '0 5px' }} />

                <motion.div
                    whileHover={{ scale: 1.1, color: '#fff' }}
                    style={styles.navBtn}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={20} />
                </motion.div>
            </motion.div>

            {/* Slide-out Sidebar Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div style={styles.sidebarMenu}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={styles.sidebarContent}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'Impact', fontSize: '2rem' }}>ERP SYSTEMS</span>
                                <X size={30} style={{ cursor: 'pointer' }} onClick={() => setIsMenuOpen(false)} />
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                                {[
                                    { name: 'Portfolio Hub', path: '/portfolio' },
                                    { name: 'Mission Control', path: '/analytics' },
                                    { name: 'Operations', path: '/job-cards' },
                                    { name: 'Stock & Logistics', path: '/stock' },
                                    { name: 'Customer Leads', path: '/leads' },
                                    { name: 'Finance Hub', path: '/finance' },
                                    { name: 'HR Network', path: '/hr' },
                                    { name: 'Risk & Compliance', path: '/risk-management' },
                                    { name: 'Elite Pro', path: '/elitepro' }
                                ].map((item) => (
                                    <motion.div
                                        key={item.name}
                                        whileHover={{ x: 10 }}
                                        style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' }}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate(item.path);
                                        }}
                                    >
                                        {item.name.toUpperCase()}
                                        <ArrowRight size={18} />
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.5, paddingTop: '20px' }}>
                                © 2026 ELITE SHINE GROUP<br />RAVOIT PRESENTATION LAYER
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UniversalBottomNav;
