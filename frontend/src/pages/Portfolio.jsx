import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, User, Mail, Clock, CreditCard, FileText,
    Heart, MapPin, Briefcase, Shield, ArrowRight, Users, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

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
        firstName: (user?.full_name || user?.username || 'ELITE').split(' ')[0].toUpperCase(),
        role: user?.role || 'Administrator',
        image: user?.profile_image || '/radhir.jpg', // Fallback
        accent: user?.accent_color || '#b08d57',
        department: 'Technology',
        joinDate: user?.date_joined || '2024',
        hoursLogged: attendances.length > 0
            ? attendances.reduce((sum, a) => sum + parseFloat(a.total_hours || 0), 0).toFixed(1)
            : '0.0',
    };

    const styles = {
        container: {
            background: '#ffffff',
            minHeight: '100vh',
            fontFamily: "'Outfit', sans-serif",
            color: '#1c1c1c',
            overflowX: 'hidden',
        },
        header: {
            height: '70px',
            padding: '0 5%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
            fontSize: '0.7rem',
            letterSpacing: '2px',
            fontWeight: '800',
            textTransform: 'uppercase',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1000,
        },
        navGroup: {
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
        },
        navItem: {
            cursor: 'pointer',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        hero: {
            height: '95vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '5vh',
        },
        heroTextBg: {
            position: 'absolute',
            top: '20%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
            pointerEvents: 'none',
        },
        heroTitle: {
            fontSize: '18vw',
            fontWeight: '900',
            lineHeight: '0.8',
            margin: 0,
            textAlign: 'center',
            color: '#1c1c1c',
        },
        heroImage: {
            position: 'relative',
            zIndex: 2,
            height: '85%',
            width: 'auto',
            objectFit: 'contain',
        },
        infoBox: {
            position: 'absolute',
            zIndex: 3,
            fontSize: '0.85rem',
            maxWidth: '220px',
            lineHeight: '1.6',
            color: '#444',
        },
        btnContact: {
            marginTop: '20px',
            padding: '12px 30px',
            background: '#2d3436',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: '800',
            letterSpacing: '2px',
            cursor: 'pointer',
            textAlign: 'center',
        },
        darkSection: {
            background: '#0a0c10',
            color: '#fff',
            padding: '100px 5%',
            position: 'relative',
            minHeight: '100vh',
        },
        gridLines: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            pointerEvents: 'none',
        },
        contentWrapper: {
            position: 'relative',
            zIndex: 10,
            maxWidth: '1400px',
            margin: '0 auto',
        },
        sectionHeading: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '80px',
        },
        bigHeadline: {
            fontSize: '3.5rem',
            fontWeight: '800',
            lineHeight: '1.1',
            maxWidth: '700px',
            textTransform: 'uppercase',
            letterSpacing: '-2px',
        },
        itemGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginTop: '60px',
        },
        gridCard: {
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '40px',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.navGroup}>
                    <Menu size={18} />
                    <div style={styles.navItem} onClick={() => navigate('/dashboard')}>DASHBOARD</div>
                    <div style={styles.navItem}>MISSION</div>
                </div>
                <div style={styles.navGroup}>
                    <div style={styles.navItem}>SERVICES</div>
                    <div style={{ ...styles.navItem, opacity: 1 }}>CONTACT</div>
                </div>
            </header>

            <section style={styles.hero}>
                <div style={styles.heroTextBg}>
                    <h1 style={styles.heroTitle}>ELITE</h1>
                    <h1 style={styles.heroTitle}>SHINE</h1>
                </div>

                <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    src={profileData.image}
                    alt={profileData.name}
                    style={styles.heroImage}
                    onError={(e) => { e.target.src = '/radhir.jpg'; }}
                />

                <div style={{ ...styles.infoBox, bottom: '15%', left: '5%' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '10px' }}>"Commitment is the bridge between goals and accomplishment."</p>
                    <div style={styles.btnContact} onClick={() => navigate('/hr/profile')}>VIEW PROFILE</div>
                </div>

                <div style={{ ...styles.infoBox, bottom: '15%', right: '5%', textAlign: 'right' }}>
                    <p style={{ fontWeight: '800', color: '#b08d57', letterSpacing: '2px' }}>{profileData.role.toUpperCase()}</p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '5px' }}>MEMBER SINCE {profileData.joinDate.split('-')[0]}</p>
                </div>
            </section>

            <section style={styles.darkSection}>
                <div style={styles.gridLines} />
                <div style={styles.contentWrapper}>
                    <div style={styles.sectionHeading}>
                        <div>
                            <span style={{ fontSize: '0.7rem', color: '#b08d57', letterSpacing: '5px', display: 'block', marginBottom: '20px' }}>[ PERFORMANCE ]</span>
                            <h2 style={styles.bigHeadline}>TRUE MASTERY IS A<br />CONTINUOUS JOURNEY.</h2>
                        </div>
                        <div style={{ maxWidth: '400px' }}>
                            <p style={{ fontSize: '0.9rem', opacity: 0.6, lineHeight: '1.8', marginBottom: '30px' }}>
                                Your professional journey is measured not just in years, but in consistency and dedication. Track your progress and stay connected with the core team.
                            </p>
                            <div style={{ ...styles.btnContact, background: '#b08d57', color: '#000' }} onClick={() => !attendance ? handleClockIn() : navigate('/hr/attendance')}>
                                {attendance ? 'VIEW ATTENDANCE' : '[ CLOCK IN ]'}
                            </div>
                        </div>
                    </div>

                    <div style={styles.itemGrid}>
                        <motion.div whileHover={{ scale: 1.02 }} style={styles.gridCard}>
                            <Clock size={32} color="#b08d57" style={{ marginBottom: '30px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>HOURS LOGGED</h3>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>{profileData.hoursLogged}H</div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} style={styles.gridCard} onClick={() => navigate('/hr/team')}>
                            <Users size={32} color="#b08d57" style={{ marginBottom: '30px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>TEAM NETWORK</h3>
                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Collaborate with {employees.length || 12} verified experts in the Elite Shine network.</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} style={styles.gridCard} onClick={() => navigate('/finance/invoices')}>
                            <CreditCard size={32} color="#b08d57" style={{ marginBottom: '30px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>RESOURCES</h3>
                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Access internal files, invoices, and professional materials.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Background Texture Overlay */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none',
                opacity: 0.03,
                zIndex: 9999,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
            }} />
        </div>
    );
};

export default Portfolio;
