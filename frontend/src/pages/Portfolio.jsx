import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, User, Mail, Clock, CreditCard, FileText,
    Heart, MapPin, Briefcase, Shield, ArrowRight, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Helper to get proper image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return '/elite_shine_logo.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
        if (imagePath.startsWith('/media/')) {
            return `http://localhost:8000${imagePath}`;
        }
        return imagePath;
    }
    return `http://localhost:8000/media/${imagePath}`;
};

// Team members data
const teamMembers = [
    { id: 'ruchika', name: 'Ruchika', role: 'Managing Director', image: '/ruchika.jpg', accent: '#b08d57' },
    { id: 'radhir', name: 'Radhir', role: 'Systems Architect', image: '/radhir.jpg', accent: '#8b5cf6' },
    { id: 'afsar', name: 'Afsar', role: 'Service Advisor', image: '/afsar.jpg', accent: '#3b82f6' },
    { id: 'ankit', name: 'Ankit', role: 'Technician', image: '/ankit.jpg', accent: '#10b981' },
];

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
            setAttendances(res.data);
            const today = new Date().toISOString().split('T')[0];
            const active = res.data.find(a => a.date === today && !a.check_out_time);
            setAttendance(active || null);
        } catch (err) {
            console.error('Failed to fetch attendance', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        }
    };

    const handleClockIn = async () => {
        try {
            const res = await api.post('/forms/attendance/api/check-in/');
            setAttendance(res.data.data || res.data);
            fetchAttendance(); // Refresh data
        } catch (err) {
            console.error('Clock in failed', err);
            alert('Clock in failed: ' + (err.response?.data?.error || err.message));
        }
    };


    const profileData = {
        name: user?.full_name || user?.username || 'Elite Member',
        role: user?.role || 'Administrator',
        image: getImageUrl(user?.profile_image),
        accent: user?.accent_color || '#b08d57',
        department: 'Technology',
        joinDate: user?.date_joined || '2024',
        hoursLogged: attendances.reduce((sum, a) => sum + parseFloat(a.total_hours || 0), 0).toFixed(1),
    };

    // Merge API employees with static team members
    const allTeam = [...teamMembers];
    employees.forEach(emp => {
        if (!allTeam.find(t => t.id === emp.user?.username?.toLowerCase())) {
            allTeam.push({
                id: emp.employee_id,
                name: `${emp.user?.first_name || ''} ${emp.user?.last_name || ''}`.trim() || emp.user?.username || 'Unknown',
                role: emp.role || 'Team Member',
                image: getImageUrl(emp.profile_image),
                accent: emp.accent_color || '#64748b',
            });
        }
    });

    return (
        <div style={styles.container}>
            {/* Main Bento Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={styles.bentoContainer}
            >
                {/* Top Navigation */}
                <div style={styles.topNav}>
                    <div style={styles.logoPill}>
                        <span style={styles.logoText}>ELITE SHINE</span>
                    </div>
                    <div style={styles.navActions}>
                        <div style={styles.iconBtn}><Search size={18} /></div>
                        <div style={styles.iconBtn}><Users size={18} /></div>
                        <button style={styles.contactBtn} onClick={() => navigate('/')}>
                            <ArrowRight size={14} /> Dashboard
                        </button>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div style={styles.mainGrid}>
                    {/* Left: Hero Image Section */}
                    <div style={styles.heroSection}>
                        <div style={styles.heroImageWrapper}>
                            <img
                                src={selectedMember ? selectedMember.image : profileData.image}
                                alt={selectedMember ? selectedMember.name : profileData.name}
                                style={styles.heroImage}
                            />
                            {/* Floating Labels */}
                            <motion.div
                                key={selectedMember?.id || 'self'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={styles.floatingLabel}
                            >
                                <span style={styles.labelTitle}>
                                    {selectedMember ? selectedMember.role : profileData.department}
                                </span>
                                <span style={styles.labelSub}>Elite Shine Group</span>
                            </motion.div>
                        </div>

                        {/* Big Typography */}
                        <motion.div
                            key={selectedMember?.id || 'self-text'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.heroText}
                        >
                            <h1 style={styles.heroTitle}>
                                {(selectedMember?.name || profileData.name).split(' ')[0].toUpperCase()}<br />
                                <span style={{ ...styles.heroHighlight, color: selectedMember?.accent || profileData.accent }}>
                                    PROFESSIONAL.
                                </span><br />
                                VERIFIED.
                            </h1>
                        </motion.div>
                    </div>

                    {/* Right: Info Cards */}
                    <div style={styles.rightColumn}>
                        {/* Team Members Grid */}
                        <div style={styles.teamSection}>
                            <div style={styles.sectionTitle}>
                                <Users size={16} /> TEAM
                            </div>
                            <div style={styles.teamGrid}>
                                {allTeam.slice(0, 6).map((member, idx) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                                        style={{
                                            ...styles.teamMember,
                                            borderColor: selectedMember?.id === member.id ? member.accent : 'rgba(255,255,255,0.1)',
                                            background: selectedMember?.id === member.id ? `${member.accent}20` : '#000',
                                        }}
                                    >
                                        <img src={member.image} alt={member.name} style={styles.teamAvatar} />
                                        <div style={styles.teamName}>{member.name.split(' ')[0]}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={styles.statCard}
                        >
                            <div style={styles.statLabel}>HOURS LOGGED</div>
                            <div style={styles.statValue}>{profileData.hoursLogged}h</div>
                        </motion.div>

                        {/* Clock In Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            onClick={!attendance ? handleClockIn : () => navigate('/hr/attendance')}
                            style={{
                                ...styles.clockCard,
                                background: attendance ? 'rgba(16, 185, 129, 0.15)' : 'rgba(176, 141, 87, 0.15)',
                                borderColor: attendance ? '#10b981' : profileData.accent,
                            }}
                        >
                            <Clock size={24} color={attendance ? '#10b981' : profileData.accent} />
                            <span style={{ color: attendance ? '#10b981' : '#fff', fontWeight: '800' }}>
                                {attendance ? 'ON DUTY' : 'CLOCK IN'}
                            </span>
                        </motion.div>

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            style={styles.profileThumb}
                        >
                            <img
                                src={profileData.image}
                                alt={profileData.name}
                                style={styles.thumbImage}
                            />
                            <div style={styles.thumbInfo}>
                                <div style={styles.thumbName}>{profileData.name}</div>
                                <div style={styles.thumbRole}>{profileData.role}</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Background Grain */}
            <div style={styles.grain} />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: 'Outfit, sans-serif',
    },
    bentoContainer: {
        width: '100%',
        maxWidth: '1200px',
        background: '#111',
        borderRadius: '40px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
    },
    topNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    logoPill: {
        background: '#000',
        padding: '12px 24px',
        borderRadius: '100px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    logoText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: '14px',
        letterSpacing: '3px',
    },
    navActions: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    iconBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#000',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        cursor: 'pointer',
    },
    contactBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '100px',
        padding: '12px 24px',
        fontWeight: '700',
        fontSize: '13px',
        cursor: 'pointer',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
    },
    heroSection: {
        position: 'relative',
        borderRadius: '30px',
        overflow: 'hidden',
        background: '#000',
        minHeight: '500px',
    },
    heroImageWrapper: {
        position: 'absolute',
        inset: 0,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        opacity: 0.85,
    },
    floatingLabel: {
        position: 'absolute',
        top: '30px',
        left: '30px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '12px 20px',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    labelTitle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: '700',
        display: 'block',
    },
    labelSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
    },
    heroText: {
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        right: '40px',
    },
    heroTitle: {
        fontSize: '3rem',
        fontWeight: '900',
        lineHeight: '0.95',
        margin: 0,
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '-1px',
    },
    heroHighlight: {
        color: '#b08d57',
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    teamSection: {
        background: '#000',
        borderRadius: '25px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginBottom: '15px',
    },
    teamGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
    },
    teamMember: {
        background: '#000',
        borderRadius: '15px',
        padding: '10px',
        border: '2px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    teamAvatar: {
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        objectFit: 'cover',
    },
    teamName: {
        color: '#fff',
        fontSize: '10px',
        fontWeight: '700',
        textAlign: 'center',
    },
    statCard: {
        background: '#000',
        borderRadius: '25px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginBottom: '8px',
    },
    statValue: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: '900',
    },
    clockCard: {
        borderRadius: '25px',
        padding: '20px',
        border: '1px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        fontSize: '13px',
        letterSpacing: '1px',
        transition: 'all 0.2s ease',
    },
    profileThumb: {
        background: 'linear-gradient(135deg, rgba(176, 141, 87, 0.2), rgba(0,0,0,0.8))',
        borderRadius: '25px',
        padding: '15px',
        border: '1px solid rgba(176, 141, 87, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginTop: 'auto',
    },
    thumbImage: {
        width: '50px',
        height: '50px',
        borderRadius: '15px',
        objectFit: 'cover',
    },
    thumbInfo: {
        flex: 1,
    },
    thumbName: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '700',
    },
    thumbRole: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
    },
    grain: {
        position: 'fixed',
        inset: 0,
        background: 'url(/grain.png)',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 999,
    },
};

export default Portfolio;
