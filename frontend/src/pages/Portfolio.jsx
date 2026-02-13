import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, FileText, Menu, X, ArrowRight, LayoutDashboard, Settings, ShieldCheck, UserCircle, Briefcase, Mail
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
        name: (user?.full_name || user?.username || 'Ravoit').toUpperCase(),
        firstName: (user?.full_name || user?.username || 'Ravoit').split(' ')[0].toUpperCase(),
        role: user?.role || 'Creative Director & Founder',
        image: user?.username === 'ravit' ? '/BGRAVIT.png' : (user?.profile_image || '/radhir.jpg'),
        hoursLogged: attendances.length > 0
            ? attendances.reduce((sum, a) => sum + parseFloat(a.total_hours || 0), 0).toFixed(1)
            : '0.0',
    };

    const styles = {
        container: {
            background: '#1a1a1a', // Dark Charcoal
            color: '#e8dace', // Cream/Beige
            minHeight: '100vh',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            overflowX: 'hidden',
            padding: '40px 0',
        },
        section: {
            maxWidth: '900px',
            margin: '0 auto 120px',
            padding: '0 20px',
            position: 'relative',
        },
        headerBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            opacity: 0.6,
            marginBottom: '60px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
        },
        footerBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            opacity: 0.5,
            marginTop: '80px',
            borderTop: '1px solid rgba(232, 218, 206, 0.1)',
            paddingTop: '20px',
        },
        megaTitle: {
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            lineHeight: '0.8',
            textTransform: 'uppercase',
            letterSpacing: '-2px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
            margin: 0,
            pointerEvents: 'none',
        },
        heroImageContainer: {
            position: 'relative',
            top: '-60px',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        },
        heroImage: {
            height: 'clamp(300px, 60vh, 600px)',
            width: 'auto',
            objectFit: 'contain',
        },
        sectionTitle: {
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            lineHeight: '0.9',
            textTransform: 'uppercase',
            marginBottom: '30px',
        },
        bodyText: {
            fontSize: '1rem',
            opacity: 0.8,
            maxWidth: '500px',
            lineHeight: '1.6',
        },
        // Table of Contents Grid
        tocContent: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '60px',
            flexWrap: 'wrap',
        },
        tocLeft: {
            flex: '1.2',
            minWidth: '300px',
        },
        tocRight: {
            flex: '1',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            minWidth: '280px',
        },
        btnPill: {
            padding: '14px 20px',
            borderRadius: '50px',
            textAlign: 'center',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
        },
        btnOutline: {
            border: '2px solid #e8dace',
            background: 'transparent',
            color: '#e8dace',
        },
        btnSolid: {
            background: '#e8dace',
            color: '#1a1a1a',
        },
        // Introduction Banner
        banner: {
            width: '100%',
            height: '450px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '40px',
            backgroundColor: '#222',
        },
        bannerImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7,
        },
        bannerTitleOverlay: {
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            textAlign: 'center',
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            textTransform: 'uppercase',
            color: '#e8dace',
            zIndex: 15,
            margin: 0,
        },
        // Floating Nav
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
            zIndex: 3000,
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
            zIndex: 4000,
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

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'ERP Control', path: '/finance/invoices', icon: FileText },
        { name: 'Team Hub', path: '/hr/team', icon: Users },
        { name: 'Attendance', path: '/hr/attendance', icon: Clock },
        { name: 'Profile', path: '/hr/profile', icon: UserCircle },
        { name: 'Elite Rules', path: '/hr/rules', icon: ShieldCheck }
    ];

    return (
        <div style={styles.container}>
            {/* Slide 1: Cover Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={styles.section}
            >
                <div style={styles.headerBar}>
                    <span>Creative Portfolio</span>
                    <ArrowRight size={24} strokeWidth={1} />
                </div>

                <h1 style={styles.megaTitle}>{profileData.firstName}</h1>

                <div style={styles.heroImageContainer}>
                    <motion.img
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        src={profileData.image}
                        alt={profileData.name}
                        style={styles.heroImage}
                        onError={(e) => { e.target.src = '/radhir.jpg'; }}
                    />
                </div>

                <div style={styles.footerBar}>
                    <span>{user?.full_name || 'Ravoit Digital'}</span>
                    <span>{user?.email || 'www.eliteshine.ae'}</span>
                </div>
            </motion.section>

            {/* Slide 2: Table of Contents / Systems Nav */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={styles.section}
            >
                <div style={styles.headerBar}>
                    <span>Systems Access</span>
                    <ArrowRight size={24} strokeWidth={1} />
                </div>

                <div style={styles.tocContent}>
                    <div style={styles.tocLeft}>
                        <h2 style={styles.sectionTitle}>TABLE OF<br />SYSTEMS</h2>
                        <p style={styles.bodyText}>
                            Welcome to the central node of the Elite Shine ecosystem. Access verified ERP modules, track organizational performance, and manage secure resources through the terminals below.
                        </p>
                    </div>
                    <div style={styles.tocRight}>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnOutline }} onClick={() => navigate('/dashboard')}>
                            Introduction
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnSolid }} onClick={() => navigate('/finance/invoices')}>
                            ERP Control
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnOutline }} onClick={() => navigate('/hr/team')}>
                            Team Network
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnSolid }} onClick={() => navigate('/hr/attendance')}>
                            Time Clock
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnOutline }} onClick={() => navigate('/hr/profile')}>
                            User Profile
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnSolid }} onClick={() => navigate('/hr/rules')}>
                            Elite Rules
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnOutline }} onClick={() => navigate('/crm/leads')}>
                            CRM Hub
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ ...styles.btnPill, ...styles.btnSolid }} onClick={() => navigate('/operations/workshop')}>
                            Operations
                        </motion.div>
                    </div>
                </div>

                <div style={styles.footerBar}>
                    <span>Verified Session</span>
                    <span>System v4.0.2</span>
                </div>
            </motion.section>

            {/* Slide 3: Introduction / Action Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={styles.section}
            >
                <div style={styles.headerBar}>
                    <span>Executive Summary</span>
                    <ArrowRight size={24} strokeWidth={1} />
                </div>

                <div style={styles.banner}>
                    <img
                        src="/backgrounds/Premium_Office.jpg"
                        alt="Background"
                        style={styles.bannerImg}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'; }}
                    />
                    <h2 style={styles.bannerTitleOverlay}>INTRODUCTION</h2>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ ...styles.bodyText, margin: '0 auto', marginBottom: '40px' }}>
                        Your journey through the Elite Shine infrastructure starts here. Track your <strong>{profileData.hoursLogged} hours</strong> of professional contribution and maintain peak operational harmony.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...styles.btnPill, ...styles.btnSolid, width: '250px', margin: '0 auto' }}
                        onClick={() => !attendance ? handleClockIn() : navigate('/hr/attendance')}
                    >
                        {attendance ? 'VIEW ACTIVE SESSION' : 'INITIALIZE CLOCK-IN'}
                    </motion.div>
                </div>

                <div style={styles.footerBar}>
                    <span>{profileData.name}</span>
                    <span>{profileData.role}</span>
                </div>
            </motion.section>

            {/* Floating Navigation Bar (Cream Palette) */}
            <motion.div
                initial={{ y: 100, x: '-50%' }}
                animate={{ y: 0, x: '-50%' }}
                style={styles.floatingNav}
            >
                {navItems.slice(0, 5).map((item) => (
                    <motion.div
                        key={item.name}
                        whileHover={{ backgroundColor: 'rgba(232, 218, 206, 0.2)' }}
                        style={styles.navBtn}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon size={20} strokeWidth={1.5} />
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
                                <span style={{ fontFamily: 'Impact', fontSize: '2rem' }}>MENU</span>
                                <X size={30} style={{ cursor: 'pointer' }} onClick={() => setIsMenuOpen(false)} />
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {navItems.map((item) => (
                                    <motion.div
                                        key={item.name}
                                        whileHover={{ x: 10 }}
                                        style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' }}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate(item.path);
                                        }}
                                    >
                                        {item.name.toUpperCase()}
                                        <ArrowRight size={20} />
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.5 }}>
                                © 2026 ELITE SHINE GROUP<br />ALL SYSTEMS VERIFIED
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Portfolio;
