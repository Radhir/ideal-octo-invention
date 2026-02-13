import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, CreditCard, FileText, Users, Menu, X, ArrowRight
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
        role: user?.role || 'Verified Member',
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
        menuBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 'bold',
        },
        dropdown: {
            position: 'fixed',
            top: '60px',
            left: 0,
            width: '100%',
            background: '#ffffff',
            borderBottom: '1px solid #e0e0e0',
            padding: '40px',
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        },
        dropItem: {
            fontSize: '1.5rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            z- index: 3,
        fontSize: '0.8rem',
        color: '#1c1c1c',
        maxWidth: '220px',
        lineHeight: '1.5',
    },
        btnContact: {
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 25px',
            backgroundColor: '#6c7a89',
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
        introRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '80px',
            flexWrap: 'wrap',
            gap: '40px',
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
            maxWidth: '650px',
            lineHeight: '1.1',
            fontWeight: 'bold',
            letterSpacing: '-2px',
        },
        subTextBlock: {
            maxWidth: '380px',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            opacity: 0.7,
        },
        btnSteps: {
            marginTop: '25px',
            backgroundColor: '#e0e6c8',
            color: '#1c1c1c',
            padding: '12px 25px',
            fontWeight: 'bold',
            display: 'inline-block',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            cursor: 'pointer',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '60px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '60px',
        },
        statItem: {
            position: 'relative',
            padding: '30px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
        }
};

return (
    <div style={styles.container}>
        {/* Navigation Header */}
        <header style={styles.header}>
            <div style={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </div>
            <div style={{ ...styles.menuBtn, cursor: 'default' }}>
                <span style={{ opacity: 0.5 }}>ELITE SHINE</span>
            </div>
        </header>

        {/* Consolidated Dropdown Menu */}
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={styles.dropdown}
                >
                    {[
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'ERP Systems', path: '/finance/invoices' },
                        { name: 'Team Network', path: '/hr/team' },
                        { name: 'Attendance', path: '/hr/attendance' },
                        { name: 'My Profile', path: '/hr/profile' }
                    ].map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={styles.dropItem}
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate(item.path);
                            }}
                        >
                            {item.name.toUpperCase()}
                            <ArrowRight size={20} opacity={0.3} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Hero Section */}
        <section style={styles.hero}>
            <div style={styles.heroTitleContainer}>
                <h1 style={styles.heroTitle}>POINT OF</h1>
                <h1 style={styles.heroTitle}>SUPPORT</h1>
            </div>

            <motion.img
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                src={profileData.image}
                alt={profileData.name}
                style={styles.heroImage}
                onError={(e) => { e.target.src = '/radhir.jpg'; }}
            />

            <div style={{ ...styles.infoBox, bottom: '100px', left: '5%' }}>
                <p>Welcome back, <strong>{profileData.name.toUpperCase()}</strong>.<br />Verification complete. Access<br /><strong>Granted.</strong></p>
                <div style={styles.btnContact} onClick={() => !attendance ? handleClockIn() : navigate('/hr/attendance')}>
                    {attendance ? '[ ACTIVE DUTY ]' : '[ CLOCK IN ]'}
                </div>
            </div>

            <div style={{ ...styles.infoBox, bottom: '100px', right: '5%', textAlign: 'right' }}>
                <p>— {profileData.role.toUpperCase()} —<br />Elite Shine Group<br />Verified Since {profileData.joinDate.split('-')[0]}</p>
            </div>
        </section>

        {/* Dark Content Section */}
        <section style={styles.darkSection}>
            <div style={styles.gridBg} />
            <div style={styles.contentWrapper}>
                <div style={styles.introRow}>
                    <div>
                        <span style={styles.sectionTag}>[ PHILOSOPHY ]</span>
                        <h2 style={styles.mainHeadline}>YOU ARE THE FOUNDATION<br />OF EXCELLENCE.</h2>
                    </div>
                    <div style={styles.subTextBlock}>
                        <p>Every member of the Elite Shine team is a Pillar of support. Your work ensures the precision and quality our clients demand. Monitor your milestones and coordinate with the network below.</p>
                        <div style={styles.btnSteps} onClick={() => navigate('/hr/team')}>[ VIEW TEAM ]</div>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statItem}>
                        <Clock size={40} style={{ marginBottom: '20px', color: '#b08d57' }} />
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{profileData.hoursLogged}H</div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.6 }}>TOTAL HOURS CONTRIBUTED</div>
                    </div>

                    <div style={{ ...styles.statItem, cursor: 'pointer' }} onClick={() => navigate('/hr/team')}>
                        <Users size={40} style={{ marginBottom: '20px', color: '#b08d57' }} />
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{employees.length || '12'}</div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.6 }}>ACTIVE COLLEAGUES</div>
                    </div>

                    <div style={{ ...styles.statItem, cursor: 'pointer' }} onClick={() => navigate('/finance/invoices')}>
                        <FileText size={40} style={{ marginBottom: '20px', color: '#b08d57' }} />
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>ERP</div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.6 }}>INTERNAL RESOURCES</div>
                    </div>
                </div>

                <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '60px' }}>
                    <div>
                        <span style={styles.sectionTag}>[ LEGACY ]</span>
                        <h2 style={{ ...styles.mainHeadline, fontSize: '4.5rem', lineHeight: '0.9' }}>INVEST IN YOUR<br />JOURNEY.</h2>
                    </div>
                    <div>
                        <div style={{ ...styles.subTextBlock, marginBottom: '20px' }}>
                            Professional growth is our collective mission. Your verified status opens access to premium company resources.
                        </div>
                        <div style={{ ...styles.btnSteps, backgroundColor: '#ffffff', color: '#000' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
