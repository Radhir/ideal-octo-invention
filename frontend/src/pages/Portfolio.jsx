import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, FileText, Menu, X, ArrowRight, LayoutDashboard, Settings, ShieldCheck, UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAttendance();
            fetchEmployees();
        }
    }, [user]);

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/forms/attendance/api/records/');
            const data = res.data.results || res.data;
            setAttendances(Array.isArray(data) ? data : []);
            const today = new Date().toISOString().split('T')[0];
            const active = Array.isArray(data) ? data.find(a => a.date === today && !a.check_out_time) : null;
            setAttendance(active || null);
        } catch (err) {
            console.error('Failed to fetch attendance', err);
            setAttendances([]);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            const data = res.data.results || res.data;
            setEmployees(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch employees', err);
            setEmployees([]);
        }
    };

    const handleClockIn = async () => {
        try {
            const res = await api.post('/forms/attendance/api/check-in/');
            setAttendance(res.data.data || res.data);
            fetchAttendance();
        } catch (err) {
            console.error('Clock in failed', err);
        }
    };

    const profileData = {
        name: user?.full_name || user?.username || 'Elite Member',
        role: user?.role || 'Elite Specialist',
        image: user?.username === 'ravit' ? '/BGRAVIT.png' : (user?.profile_image || '/radhir.jpg'),
        joinDate: user?.date_joined || '2024',
        hoursLogged: attendances.length > 0
            ? attendances.reduce((sum, a) => sum + parseFloat(a.total_hours || 0), 0).toFixed(1)
            : '0.0',
    };

    const styles = {
        container: {
            background: '#ffffff',
            minHeight: '100vh',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            color: '#1c1c1c',
            overflowX: 'hidden',
            paddingBottom: '100px', // Extra space for floating nav
        },
        header: {
            background: '#ffffff',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 40px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 2000,
        },
        navLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 'bold',
        },
        hero: {
            backgroundColor: '#ffffff',
            height: '90vh',
            position: 'relative',
            overflow: 'hidden',
            borderBottomLeftRadius: '30px',
            borderBottomRightRadius: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '60px',
        },
        heroTitleContainer: {
            position: 'absolute',
            top: '25%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 5%',
            zIndex: 1,
            pointerEvents: 'none',
        },
        heroTitle: {
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            fontSize: '13vw',
            color: '#1c1c1c',
            textTransform: 'uppercase',
            lineHeight: '0.8',
            margin: 0,
        },
        heroImage: {
            position: 'relative',
            zIndex: 2,
            height: '85%',
            width: 'auto',
            objectFit: 'contain',
            marginTop: '-20px',
        },
        infoBox: {
            position: 'absolute',
            zIndex: 3,
            fontSize: '0.8rem',
            color: '#1c1c1c',
            maxWidth: '220px',
            lineHeight: '1.5',
        },
        btnDark: {
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 25px',
            backgroundColor: '#1c1c1c',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: '2px',
        },
        darkSection: {
            background: '#1c1c1c',
            color: '#ffffff',
            padding: '100px 5%',
            position: 'relative',
            minHeight: '100vh',
        },
        gridBg: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '150px 150px',
            zIndex: 0,
            pointerEvents: 'none',
        },
        contentWrapper: {
            position: 'relative',
            zIndex: 5,
            maxWidth: '1200px',
            margin: '0 auto',
        },
        sectionHeading: {
            marginBottom: '80px',
        },
        sectionTag: {
            fontSize: '0.75rem',
            opacity: 0.5,
            marginBottom: '15px',
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '3px',
        },
        mainHeadline: {
            fontFamily: "'Arial Narrow', sans-serif",
            fontSize: '3.5rem',
            textTransform: 'uppercase',
            lineHeight: '1.1',
            fontWeight: 'bold',
            letterSpacing: '-1px',
        },
        itemsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '60px',
        },
        gridItem: {
            position: 'relative',
        },
        cardImg: {
            width: '100%',
            height: '350px',
            background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
            backgroundColor: '#111',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            opacity: 0.8,
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
        },
        itemTitle: {
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '1px',
        },
        // Floating Nav Styles
        floatingNav: {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '100px',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 3000,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        },
        navBtn: {
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#1c1c1c',
            backgroundColor: 'transparent',
            position: 'relative',
        },
        navLabel: {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 12px',
            background: '#1c1c1c',
            color: '#ffffff',
            fontSize: '0.65rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            marginBottom: '10px',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'all 0.2s ease',
        },
        dropdown: {
            position: 'fixed',
            top: '60px',
            left: 0,
            width: '350px',
            height: 'calc(100vh - 60px)',
            background: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            padding: '40px',
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            boxShadow: '20px 0 60px rgba(0,0,0,0.1)',
        },
        dropItem: {
            fontSize: '1.2rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0.7,
            transition: 'all 0.3s ease',
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'ERP Control', path: '/finance/invoices', icon: FileText },
        { name: 'Team Network', path: '/hr/team', icon: Users },
        { name: 'Clock System', path: '/hr/attendance', icon: Clock },
        { name: 'Profile Settings', path: '/hr/profile', icon: UserCircle },
        { name: 'Elite Rules', path: '/hr/rules', icon: ShieldCheck }
    ];

    return (
        <div style={styles.container}>
            {/* Header / Nav */}
            <header style={styles.header}>
                <div style={styles.navLeft}>
                    <span onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </span>
                    <span style={{ opacity: 0.3 }}>•</span>
                    <span style={{ cursor: 'pointer' }}>MISSION</span>
                    <span style={{ opacity: 0.3 }}>•</span>
                    <span style={{ cursor: 'pointer' }}>ABOUT US</span>
                </div>
                <div style={{ ...styles.navLeft, gap: '10px' }}>
                    <span style={{ opacity: 0.5 }}>ELITE SHINE GROUP</span>
                </div>
            </header>

            {/* Floating Navigation Pill */}
            <motion.div
                initial={{ y: 100, x: '-50%' }}
                animate={{ y: 0, x: '-50%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 1 }}
                style={styles.floatingNav}
            >
                {navItems.map((item) => (
                    <div key={item.name} style={{ position: 'relative' }} className="nav-item-container">
                        <motion.div
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                            whileTap={{ scale: 0.95 }}
                            style={styles.navBtn}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={(e) => {
                                const label = e.currentTarget.parentElement.querySelector('.nav-label');
                                if (label) {
                                    label.style.opacity = '1';
                                    label.style.transform = 'translate(-50%, -5px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                const label = e.currentTarget.parentElement.querySelector('.nav-label');
                                if (label) {
                                    label.style.opacity = '0';
                                    label.style.transform = 'translate(-50%, 0)';
                                }
                            }}
                        >
                            <item.icon size={20} strokeWidth={1.5} />
                            <div className="nav-label" style={styles.navLabel}>
                                {item.name.toUpperCase()}
                            </div>
                        </motion.div>
                    </div>
                ))}
                <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)', margin: '0 5px' }} />
                <motion.div
                    whileHover={{ scale: 1.1, backgroundColor: '#1c1c1c', color: '#fff' }}
                    style={{ ...styles.navBtn, backgroundColor: 'rgba(28,28,28,0.05)' }}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={20} />
                </motion.div>
            </motion.div>

            {/* Slide-out Sidebar Menu (Fallback/Extended) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1400, backdropFilter: 'blur(5px)' }}
                        />
                        <motion.div
                            initial={{ x: -350 }}
                            animate={{ x: 0 }}
                            exit={{ x: -350 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={styles.dropdown}
                        >
                            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.4, marginBottom: '10px' }}>AUTHENTICATED SESSION</div>
                                    <div style={{ fontWeight: 'bold' }}>{profileData.name.toUpperCase()}</div>
                                </div>
                                <X size={24} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setIsMenuOpen(false)} />
                            </div>

                            {navItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    whileHover={{ x: 10, opacity: 1 }}
                                    style={styles.dropItem}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate(item.path);
                                    }}
                                >
                                    {item.name}
                                    <ArrowRight size={16} />
                                </motion.div>
                            ))}

                            <div style={{ marginTop: 'auto', fontSize: '0.7rem', opacity: 0.3 }}>
                                © 2026 ELITE SHINE GROUP<br />CORE SYSTEMS OPERATIONAL
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroTitleContainer}>
                    <h1 style={styles.heroTitle}>POINT OF</h1>
                    <h1 style={styles.heroTitle}>SUPPORT</h1>
                </div>

                <motion.img
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    src={profileData.image}
                    alt={profileData.name}
                    style={styles.heroImage}
                    onError={(e) => { e.target.src = '/radhir.jpg'; }}
                />

                <div style={{ ...styles.infoBox, bottom: '100px', left: '5%' }}>
                    <p>Verified Elite Member.<br />Welcome to the core,<br /><strong>{profileData.name.split(' ')[0].toUpperCase()}.</strong></p>
                    <div style={styles.btnDark} onClick={() => !attendance ? handleClockIn() : navigate('/hr/attendance')}>
                        {attendance ? '[ ACTIVE ]' : '[ CLOCK IN ]'}
                    </div>
                </div>

                <div style={{ ...styles.infoBox, bottom: '100px', right: '5%', textAlign: 'right' }}>
                    <p>— {profileData.role.toUpperCase()} —<br />Specialist Status: Active<br />Excellence in Motion.</p>
                </div>
            </section>

            {/* Dark Section with Cards */}
            <section style={styles.darkSection}>
                <div style={styles.gridBg} />
                <div style={styles.contentWrapper}>
                    <div style={styles.sectionHeading}>
                        <span style={styles.sectionTag}>[ PHILOSOPHY ]</span>
                        <h2 style={styles.mainHeadline}>YOU DON'T HAVE TO "HANDLE IT".<br />YOU HAVE THE RIGHT TO ASK FOR HELP.</h2>
                    </div>

                    <div style={styles.itemsGrid}>
                        <div style={styles.gridItem}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                style={styles.cardImg}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Clock size={48} style={{ marginBottom: '20px', color: '#b08d57' }} />
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{profileData.hoursLogged}H</div>
                                </div>
                            </motion.div>
                            <div style={styles.itemTitle}>MEETING WITHOUT PRESSURE</div>
                        </div>

                        <div style={styles.gridItem}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                style={styles.cardImg}
                                onClick={() => navigate('/hr/team')}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Users size={48} style={{ marginBottom: '20px', color: '#b08d57' }} />
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{employees.length || 12}</div>
                                </div>
                            </motion.div>
                            <div style={styles.itemTitle}>SEEKING ROOTS, NOT SYMPTOMS</div>
                        </div>

                        <div style={styles.gridItem}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                style={styles.cardImg}
                                onClick={() => navigate('/finance/invoices')}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <FileText size={48} style={{ marginBottom: '20px', color: '#b08d57' }} />
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ERP</div>
                                </div>
                            </motion.div>
                            <div style={styles.itemTitle}>SUPPORTING GROWTH</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '60px' }}>
                        <div>
                            <span style={styles.sectionTag}>[ LEGACY ]</span>
                            <h2 style={{ ...styles.mainHeadline, fontSize: '4.5rem', lineHeight: '0.9' }}>INVEST IN YOUR<br />QUALITY OF LIFE.</h2>
                        </div>
                        <div style={{ maxWidth: '350px' }}>
                            <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.6', marginBottom: '25px' }}>
                                Knowledge is the first step to harmony. Every action you take here contributes to a smarter, more efficient professional ecosystem.
                            </p>
                            <div style={{ ...styles.btnDark, background: '#fff', color: '#000' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                [ BACK TO TOP ]
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;
