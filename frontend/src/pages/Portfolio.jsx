import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Database, ShieldCheck, ArrowRight,
    Navigation, Code, Instagram, Twitter, Linkedin,
    Clock, ArrowUp, CreditCard, FileText, AlertTriangle, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const team = {
    // ... existing hardcoded team for fallback ...
    ruchika: { name: "Ruchika", role: "OWNER & MANAGING DIRECTOR", bio: "Architecting the future.", image: "/ruchika.jpg", accent: "#b08d57", label: "01 MANAGEMENT" },
    afsar: { name: "Afsar Hussain", role: "SERVICE ADVISOR", bio: "Driving operational excellence.", image: "/afsar.jpg", accent: "#3b82f6", label: "02 OPERATIONS" },
};

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('ruchika');
    const [attendance, setAttendance] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [showIdCard, setShowIdCard] = useState(false);

    // Use backend data for the logged in user
    const isMe = user && user.username && activeSection === user.username.toLowerCase();

    // Dynamic Team Construction
    const fullTeam = { ...team };
    if (user && user.username) {
        fullTeam[user.username.toLowerCase()] = {
            name: user.full_name || user.username,
            role: user.role || "Elite Professional",
            bio: user.bio || `Dedicated member of the Elite Shine team.`,
            image: user.profile_image || "/elite_shine_logo.png",
            accent: user.accent_color || "#b08d57",
            label: "MY PROFILE",
            // New Fields
            medical: user.medical_history,
            familyCount: user.family_members_count,
            visaStart: user.visa_start_date,
            experience: user.experience_summary,
            emergency1: user.emergency_contact_1,
            emergency2: user.emergency_contact_2,
            mistakes: user.mistakes_this_month,
            netEarnings: user.net_earnings
        };
    }

    useEffect(() => {
        if (user && user.username) {
            setActiveSection(user.username.toLowerCase());
            fetchAttendance();
        }
    }, [user]);

    const fetchAttendance = async () => {
        try {
            const res = await axios.get('/hr/api/attendance/');
            setAttendances(res.data);
            const today = new Date().toISOString().split('T')[0];
            const active = res.data.find(a => a.date === today && !a.clock_out);
            setAttendance(active || null);
        } catch (err) {
            console.error('Failed to fetch attendance', err);
        }
    };

    const handleClockIn = async () => {
        try {
            const res = await axios.post('/hr/api/attendance/clock_in/');
            setAttendance(res.data);
        } catch (err) { console.error('Clock in failed', err); }
    };

    const current = fullTeam[activeSection] || team.ruchika; // Default safe

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', overflowX: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
            {/* Nav */}
            <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, mixBlendMode: 'difference' }}>
                <div style={{ fontWeight: '900', letterSpacing: '4px', fontSize: '14px' }}>ELITE SHINE GROUP ®</div>
                <div style={{ display: 'flex', gap: '30px', fontSize: '11px', fontWeight: '600', letterSpacing: '2px' }}>
                    {Object.keys(fullTeam).map(key => (
                        <span key={key} onClick={() => setActiveSection(key)} style={{ cursor: 'pointer', opacity: activeSection === key ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                            {fullTeam[key].label}
                        </span>
                    ))}
                </div>
            </nav>

            {/* Background */}
            <motion.div
                key={activeSection + '-bg'}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 1.5 }}
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${current.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(50%)' }}
            />

            {/* Main Content */}
            <div style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw', zIndex: 5 }}>
                <motion.h1 key={activeSection} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 0.1 }} style={{ position: 'absolute', bottom: '10vh', left: '5vw', fontSize: '20vw', fontWeight: '900', lineHeight: '0.8', color: '#fff', pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '-1vw' }}>
                    {current.name.split(' ')[0]}
                </motion.h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', width: '100%', alignItems: 'center' }}>

                    {/* Left: Profile Info */}
                    <motion.div key={activeSection + '-info'} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div style={{ color: current.accent, fontWeight: '900', letterSpacing: '8px', fontSize: '12px', marginBottom: '20px' }}>// {current.role}</div>
                        <h2 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '0.9', margin: '0 0 40px 0', letterSpacing: '-2px' }}>
                            {current.name} <br />
                            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>PROFILE</span>
                        </h2>
                        <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontWeight: '300', maxWidth: '500px' }}>
                            {current.bio}
                        </p>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: current.accent }} onClick={() => navigate('/')} style={{ background: 'transparent', border: `1px solid ${current.accent}`, color: '#fff', padding: '15px 30px', borderRadius: '100px', fontWeight: '800', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Navigation size={16} /> DASHBOARD
                            </motion.button>
                            {isMe && (
                                <motion.button whileHover={{ scale: 1.05 }} onClick={!attendance ? handleClockIn : () => navigate('/hr/attendance')} style={{ background: attendance ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${attendance ? '#10b981' : 'rgba(255,255,255,0.1)'}`, color: attendance ? '#10b981' : '#fff', padding: '15px 30px', borderRadius: '100px', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={16} /> {attendance ? 'ON DUTY' : 'CLOCK IN'}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Personnel File (Only for Self) */}
                    {isMe && (
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FileText size={20} color={current.accent} />
                                    <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>PERSONNEL FILE</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowIdCard(true)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                                >
                                    <CreditCard size={14} />
                                </motion.button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <InfoItem label="VISA START" value={current.visaStart || 'N/A'} />
                                <InfoItem label="FAMILY MEMBERS" value={current.familyCount || '0'} />
                                <InfoItem label="MEDICAL HISTORY" value={current.medical || 'None declared'} full />
                                <InfoItem label="EXPERIENCE" value={current.experience || 'N/A'} full />
                            </div>

                            <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px', color: '#64748b', marginBottom: '15px' }}>EMERGENCY CONTACTS</div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                {current.emergency1 && <ContactCard contact={current.emergency1} />}
                                {current.emergency2 && <ContactCard contact={current.emergency2} />}
                            </div>

                            {/* Integrity / Mistakes Section */}
                            {current.mistakes && current.mistakes.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#ef4444' }}>
                                        <AlertTriangle size={16} />
                                        <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px' }}>INTEGRITY ALERTS (THIS MONTH)</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {current.mistakes.map((m, idx) => (
                                            <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {m.evidence_photo && <img src={m.evidence_photo} alt="Evidence" style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '11px', color: '#fff' }}>{m.description}</div>
                                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{m.date}</div>
                                                </div>
                                                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444' }}>- AED {m.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div style={{ position: 'fixed', bottom: '40px', right: '60px', display: 'flex', gap: '60px', zIndex: 100 }}>
                {isMe && (
                    <>
                        <Stat icon={Clock} label="HOURS LOGGED" value={`${attendances.reduce((sum, a) => sum + parseFloat(a.total_hours || 0), 0).toFixed(1)}h`} />
                        <Stat
                            icon={CreditCard}
                            label="PROJ. SALARY"
                            value={`AED ${current.netEarnings ? parseFloat(current.netEarnings).toLocaleString() : '0'}`}
                            highlight
                        />
                    </>
                )}
                <Stat icon={Activity} label="STATUS" value="ACTIVE" />
            </div>

            {/* Footer Stats ... existing ... */}

            <div style={{ position: 'fixed', inset: 0, background: 'url(/grain.png)', opacity: 0.05, pointerEvents: 'none', zIndex: 999 }} />

            {/* Digital ID Card Modal */}
            <AnimatePresence>
                {showIdCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowIdCard(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, rotateY: 90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            exit={{ scale: 0.9, rotateY: 90 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '400px', height: '600px',
                                background: '#111',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                border: `1px solid ${current.accent}`,
                                boxShadow: `0 0 50px ${current.accent}40`
                            }}
                        >
                            {/* Card Design */}
                            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <img src="/elite_shine_logo.png" alt="Logo" style={{ width: '160px', filter: 'drop-shadow(0 0 10px rgba(176, 141, 87, 0.4))' }} />
                                </div>

                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${current.accent}`, padding: '5px', marginBottom: '30px' }}>
                                    <img src={current.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                </div>

                                <h2 style={{ fontSize: '24px', fontWeight: '900', textAlign: 'center', margin: '0 0 10px 0' }}>{current.name}</h2>
                                <div style={{ fontSize: '12px', letterSpacing: '2px', color: current.accent, fontWeight: '700', marginBottom: '40px' }}>{current.role}</div>

                                <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '9px', color: '#666', fontWeight: '800' }}>ID NO</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600' }}>ESG-{Math.floor(Math.random() * 10000)}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: '#666', fontWeight: '800' }}>VISA EXP</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600' }}>2028</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: '#666', fontWeight: '800' }}>BLOOD GRP</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600' }}>O+</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: '#666', fontWeight: '800' }}>STATUS</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>ACTIVE</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
                                    <div style={{ height: '40px', background: '#fff', borderRadius: '5px' }}></div>
                                    <div style={{ fontSize: '9px', marginTop: '10px', color: '#444' }}>OFFICIAL ELITE SHINE PERSONNEL CARD</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InfoItem = ({ label, value, full }) => (
    <div style={{ gridColumn: full ? 'span 2' : 'span 1' }}>
        <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>{value}</div>
    </div>
);

const ContactCard = ({ contact }) => (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
            {contact.photo ? <img src={contact.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Heart size={14} style={{ margin: '8px' }} />}
        </div>
        <div>
            <div style={{ fontSize: '11px', fontWeight: '700' }}>{contact.name}</div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>{contact.relation} • {contact.phone}</div>
        </div>
    </div>
);

const Stat = ({ icon: Icon, label, value, highlight }) => (
    <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', color: highlight ? '#10b981' : '#fff' }}>{value}</div>
    </div>
);

export default Portfolio;
