import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, FileText, Menu, X, ArrowRight
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
        role: user?.role || 'Verified Expert',
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
            gridTemplateColumns: 'repeat(3, 1fr)',
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
            background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
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
        },
        itemTitle: {
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '1px',
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
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'ERP Control', path: '/finance/invoices' },
        { name: 'Team Network', path: '/hr/team' },
        { name: 'Clock System', path: '/hr/attendance' },
        { name: 'Profile Settings', path: '/hr/profile' },
        { name: 'Elite Rules', path: '/hr/rules' }
    ];

    return (
        <div style={styles.container}>
            {/* Header / Nav */}
            <header style={styles.header}>
                <div style={styles.navLeft}>
                    <span onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
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

            {/* Slide-out Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.1)', zIndex: 1400, backdropFilter: 'blur(2px)' }}
                        />
                        <motion.div
                            initial={{ x: -350 }}
                            animate={{ x: 0 }}
                            exit={{ x: -350 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={styles.dropdown}
                        >
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.4, marginBottom: '10px' }}>AUTHENTICATED SESSION</div>
                                <div style={{ fontWeight: 'bold' }}>{profileData.name}</div>
                            </div>

                            {navItems.map((item, i) => (
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
                                © 2026 ELITE SHINE GROUP<br />ALL SYSTEMS OPERATIONAL
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
                    <p>Verified Elite Member.<br />Welcome to the core,<br /><strong>{profileData.firstName}.</strong></p>
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
                                style={{ ...styles.cardImg, background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' }}
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
                                style={{ ...styles.cardImg, background: 'linear-gradient(45deg, #2a2a2a, #1a1a1a)' }}
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
                                style={{ ...styles.cardImg, background: 'linear-gradient(45deg, #111, #333)' }}
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
