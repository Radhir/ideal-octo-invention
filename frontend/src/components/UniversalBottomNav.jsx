import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const UniversalBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'BOOKINGS', path: '/bookings/create' },
        { name: 'CALENDAR', path: '/bookings' },
        { name: 'WORKSHOP', path: '/job-board' },
        { name: 'INVENTORY', path: '/stock' },
        { name: 'CRM', path: '/leads' },
        { name: 'SCANNER', path: '/job-cards' },
        { name: 'REPORTS', path: '/finance/reports' },
        { name: 'CHAT', path: '/chat' },
        { name: 'APPROVALS', path: '/hr/approvals' },
    ];

    const styles = {
        footerContainer: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'rgba(10, 10, 12, 0.8)',
            backdropFilter: 'blur(30px)',
            borderTop: '1px solid rgba(250, 249, 246, 0.05)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
        },
        navInner: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            maxWidth: '1200px',
            width: '100%',
            justifyContent: 'space-between',
        },
        navItem: {
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '2px',
            color: 'rgba(250, 249, 246, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            padding: '10px 0',
            textTransform: 'uppercase'
        },
        activeItem: {
            color: 'var(--gold)',
            position: 'relative',
        }
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div style={styles.footerContainer}>
            <div style={styles.navInner}>
                {navItems.map((item) => (
                    <motion.div
                        key={item.name}
                        whileHover={{ color: '#fff' }}
                        style={{
                            ...styles.navItem,
                            ...(isActive(item.path) ? styles.activeItem : {})
                        }}
                        onClick={() => navigate(item.path)}
                    >
                        {item.name}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UniversalBottomNav;
