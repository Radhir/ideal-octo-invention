import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Calendar, User, Zap, Plus,
    LayoutDashboard, Users, Package, Settings,
    BarChart3, MessageSquare, Calculator,
    Droplet, Paintbrush, Activity, Monitor,
    Box, ShieldCheck, CheckCircle2, AlertTriangle,
    X, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioStats,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';

import api from '../../api/axios';

const PaintDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [booths, setBooths] = useState([]);
    const [mixingJobs, setMixingJobs] = useState([]);
    const [stats, setStats] = useState([
        { label: 'Booth Utilization', value: '0%', subvalue: '0/0 ACTIVE', icon: Monitor, color: 'var(--gold)' },
        { label: 'Mixing Queue', value: '0', subvalue: 'PENDING MIXES', icon: Droplet, color: '#3b82f6' },
        { label: 'Paint WIP', value: '0', subvalue: 'CURRENT JOBS', icon: Paintbrush, color: '#10b981' },
        { label: 'QC Passed', value: '0%', subvalue: 'WEEKLY AVG', icon: ShieldCheck, color: '#8b5cf6' }
    ]);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Modal States
    const [boothModal, setBoothModal] = useState({ open: false, boothId: null });
    const [mixingModal, setMixingModal] = useState({ open: false });
    const [qcModal, setQcModal] = useState({ open: false, jobId: null });

    // Form States
    const [boothForm, setBoothForm] = useState({ jobId: '', stage: 'PRIMER', time: 60 });
    const [mixingForm, setMixingForm] = useState({ jobId: '', code: '', qty: 500, brand: 'CHROMAX PRO', color: '' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchDashboardData();
        fetchAvailableJobs();
        return () => clearInterval(timer);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [boothRes, mixRes] = await Promise.all([
                api.get('/workshop/api/booths/'),
                api.get('/workshop/api/paint-mixes/')
            ]);

            setBooths(boothRes.data);
            setMixingJobs(mixRes.data);

            const activeBooths = boothRes.data.filter(b => b.status === 'ACTIVE').length;
            const util = boothRes.data.length > 0 ? Math.round((activeBooths / boothRes.data.length) * 100) : 0;

            setStats([
                { label: 'Booth Utilization', value: `${util}%`, subvalue: `${activeBooths}/${boothRes.data.length} ACTIVE`, icon: Monitor, color: 'var(--gold)' },
                { label: 'Mixing Queue', value: mixRes.data.length.toString(), subvalue: 'PENDING MIXES', icon: Droplet, color: '#3b82f6' },
                { label: 'Paint WIP', value: boothRes.data.filter(b => b.status !== 'READY').length.toString(), subvalue: 'CURRENT JOBS', icon: Paintbrush, color: '#10b981' },
                { label: 'QC Passed', value: '100%', subvalue: 'LIVE TRACKING', icon: ShieldCheck, color: '#8b5cf6' }
            ]);
        } catch (err) {
            console.error('Failed to fetch paint telemetry:', err);
        }
    };

    const fetchAvailableJobs = async () => {
        try {
            // Fetch jobs that are released and in a stage suitable for paint
            const res = await api.get('/job-cards/api/job-cards/?is_released=true');
            setAvailableJobs(res.data);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        }
    };

    const handleAssignBooth = async () => {
        if (!boothForm.jobId || !boothModal.boothId) return;
        setSubmitting(true);
        try {
            // 1. Update Booth
            await api.patch(`/workshop/api/booths/${boothModal.boothId}/`, {
                current_job: boothForm.jobId,
                status: 'ACTIVE'
            });
            // 2. Update JobCard
            await api.patch(`/job-cards/api/job-cards/${boothForm.jobId}/`, {
                paint_stage: boothForm.stage,
                current_booth: boothModal.boothId
            });
            setBoothModal({ open: false, boothId: null });
            fetchDashboardData();
        } catch (err) {
            alert('Initialization failed. Check system logs.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartMix = async () => {
        if (!mixingForm.jobId || !mixingForm.code) return;
        setSubmitting(true);
        try {
            await api.post('/workshop/api/paint-mixes/', {
                job_card: mixingForm.jobId,
                paint_code: mixingForm.code,
                color_name: mixingForm.color || 'Custom Mix',
                total_quantity: mixingForm.qty / 1000, // Convert to Liters
                mixed_by: user.hr_profile?.id // Associated with current tech
            });
            setMixingModal({ open: false });
            fetchDashboardData();
        } catch (err) {
            alert('Mix recording failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleQCCommit = async () => {
        if (!qcModal.jobId) return;
        setSubmitting(true);
        try {
            // 1. Move Job to COMPLETED stage
            await api.patch(`/job-cards/api/job-cards/${qcModal.jobId}/`, {
                paint_stage: 'COMPLETED'
            });
            // 2. Free up the booth if it's assigned
            const currentBooth = booths.find(b => b.current_job === qcModal.jobId);
            if (currentBooth) {
                await api.patch(`/workshop/api/booths/${currentBooth.id}/`, {
                    current_job: null,
                    status: 'READY'
                });
            }
            setQcModal({ open: false, jobId: null });
            fetchDashboardData();
        } catch (err) {
            alert('QC Release failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <PortfolioPage breadcrumb="OPERATIONS / PAINT CONTROL">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <div>
                    <PortfolioTitle subtitle="Precision Paint Management & Booth Telemetry.">
                        Paint Control
                    </PortfolioTitle>
                </div>

                <div className="attendance-widget pulse-glow" style={{
                    background: 'rgba(232, 230, 227, 0.02)',
                    padding: '25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(176, 141, 87, 0.2)',
                    textAlign: 'right',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>BOOTH PULSE</div>
                    <div style={{ fontSize: '42px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, textShadow: '0 0 10px rgba(176,141,87,0.3)' }}>
                        {formatTime(currentTime)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', marginTop: '8px', letterSpacing: '1px' }}>{formatDate(currentTime)}</div>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '60px' }}>

                {/* BOOTH MANAGEMENT */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <PortfolioSectionTitle style={{ marginBottom: 0 }}>Active Booths</PortfolioSectionTitle>
                        <PortfolioButton variant="secondary" style={{ padding: '10px 20px', fontSize: '12px' }} onClick={() => setBoothModal({ open: true, boothId: null })}>
                            <Plus size={16} /> ASSIGN BOOTH
                        </PortfolioButton>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {booths.map(booth => (
                            <PortfolioCard
                                key={booth.id}
                                style={{
                                    padding: '30px',
                                    border: booth.status === 'ACTIVE' ? '1.5px solid rgba(176,141,87,0.3)' : '1.5px solid rgba(232,230,227,0.1)',
                                    background: booth.status === 'ACTIVE' ? 'rgba(176,141,87,0.02)' : 'transparent',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onClick={() => setBoothModal({ open: true, boothId: booth.id })}
                            >
                                {booth.status === 'ACTIVE' && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                                        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                                        opacity: 0.5
                                    }} />
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>{booth.paint_stage || 'STANDBY'}</span>
                                    <span style={{
                                        fontSize: '9px', fontWeight: '900', padding: '4px 10px', borderRadius: '4px',
                                        background: booth.status === 'READY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(176, 141, 87, 0.1)',
                                        color: booth.status === 'READY' ? '#10b981' : 'var(--gold)',
                                        border: booth.status === 'READY' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(176, 141, 87, 0.2)'
                                    }}>{booth.status.replace('_', ' ')}</span>
                                </div>
                                <h3 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--cream)', marginBottom: '5px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>{booth.name}</h3>
                                {booth.job_card_number ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800' }}>ACTIVE JOB</div>
                                            <div style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>{booth.job_card_number}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '2px', letterSpacing: '0.5px' }}>{booth.vehicle_name}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800' }}>TELEMETRY</div>
                                            <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>{booth.temperature}°C</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '13px', marginTop: '20px', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Standing by for entry...</div>
                                )}
                            </PortfolioCard>
                        ))}
                    </div>
                </section>

                {/* MIXING CENTER */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <PortfolioSectionTitle style={{ marginBottom: 0 }}>Mixing Lab</PortfolioSectionTitle>
                        <PortfolioButton variant="glass" style={{ padding: '8px 15px', fontSize: '11px', background: 'rgba(176, 141, 87, 0.05)', color: 'var(--gold)', border: '1px solid rgba(176, 141, 87, 0.2)' }} onClick={() => setMixingModal({ open: true })}>
                            START MIX
                        </PortfolioButton>
                    </div>

                    <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '25px' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '900', letterSpacing: '1px', marginBottom: '15px' }}>PENDING MIX FORMULAS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {mixingJobs.map(job => (
                                    <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                            <Droplet size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{job.paint_code} - {job.color_name}</div>
                                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>Tech: {job.mixed_by_name} • {job.total_quantity}L</div>
                                        </div>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(176, 141, 87, 0.05)', borderTop: '1px solid rgba(176, 141, 87, 0.1)', textAlign: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '1px', color: 'var(--gold)' }}>VIEW FULL LAB INVENTORY</span>
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '25px', marginTop: '25px', border: '1px dashed rgba(176, 141, 87, 0.2)' }} onClick={() => setQcModal({ open: true, jobId: booths.find(b => b.status === 'QC')?.current_job })}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Final Quality Control</h4>
                                <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>
                                    {booths.filter(b => b.status === 'QC').length} Vehicles awaiting paint QC clearance
                                </p>
                            </div>
                        </div>
                    </PortfolioCard>
                </section>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {boothModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlayStyle}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={modalContentStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <PortfolioSectionTitle style={{ marginBottom: 0 }}>Booth Execution</PortfolioSectionTitle>
                                <button onClick={() => setBoothModal({ open: false })} style={closeBtnStyle}><X size={20} /></button>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={inputLabelStyle}>SELECT JOB CARD</label>
                                <select
                                    style={inputStyle}
                                    value={boothForm.jobId}
                                    onChange={(e) => setBoothForm({ ...boothForm, jobId: e.target.value })}
                                >
                                    <option value="">Choose active job...</option>
                                    {availableJobs.map(job => (
                                        <option key={job.id} value={job.id}>
                                            {job.job_card_number} - {job.customer_name} ({job.brand})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                                <div>
                                    <label style={inputLabelStyle}>STAGE</label>
                                    <select
                                        style={inputStyle}
                                        value={boothForm.stage}
                                        onChange={(e) => setBoothForm({ ...boothForm, stage: e.target.value })}
                                    >
                                        <option value="PRIMER">PRIMER</option>
                                        <option value="BASE_COAT">BASE COAT</option>
                                        <option value="CLEAR_COAT">CLEAR COAT</option>
                                        <option value="BAKING">BAKING</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={inputLabelStyle}>ESTIMATED TIME (MINS)</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        placeholder="60"
                                        value={boothForm.time}
                                        onChange={(e) => setBoothForm({ ...boothForm, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <PortfolioButton variant="secondary" style={{ flex: 1 }} onClick={() => setBoothModal({ open: false, boothId: null })}>ABORT</PortfolioButton>
                                <PortfolioButton variant="primary" style={{ flex: 1 }} onClick={handleAssignBooth} disabled={submitting}>
                                    {submitting ? 'INITIALIZING...' : 'INITIALIZE BOOTH'}
                                </PortfolioButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {mixingModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlayStyle}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ ...modalContentStyle, width: '600px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ padding: '10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', color: 'var(--gold)' }}>
                                        <Droplet size={24} />
                                    </div>
                                    <PortfolioSectionTitle style={{ marginBottom: 0 }}>Smart Mixing Lab</PortfolioSectionTitle>
                                </div>
                                <button onClick={() => setMixingModal({ open: false })} style={closeBtnStyle}><X size={20} /></button>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', marginBottom: '15px' }}>TARGET JOB & PAINT CODE</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <select
                                        style={inputStyle}
                                        value={mixingForm.jobId}
                                        onChange={(e) => setMixingForm({ ...mixingForm, jobId: e.target.value })}
                                    >
                                        <option value="">Choose job...</option>
                                        {availableJobs.map(job => (
                                            <option key={job.id} value={job.id}>{job.job_card_number}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Paint Code (e.g. LC9A)"
                                        style={{ ...inputStyle, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.2)' }}
                                        value={mixingForm.code}
                                        onChange={(e) => setMixingForm({ ...mixingForm, code: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                                <div>
                                    <label style={inputLabelStyle}>PAINT BRAND</label>
                                    <select
                                        style={inputStyle}
                                        value={mixingForm.brand}
                                        onChange={(e) => setMixingForm({ ...mixingForm, brand: e.target.value })}
                                    >
                                        <option>CHROMAX PRO</option>
                                        <option>STANDOX</option>
                                        <option>U-POL RAPTOR</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={inputLabelStyle}>QUANTITY REQUIRED (ML)</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        placeholder="500"
                                        value={mixingForm.qty}
                                        onChange={(e) => setMixingForm({ ...mixingForm, qty: e.target.value })}
                                    />
                                </div>
                            </div>

                            <PortfolioButton variant="primary" style={{ width: '100%' }} onClick={handleStartMix} disabled={submitting}>
                                {submitting ? 'PROCESSING...' : 'GENERATE FORMULA & PRINT LABEL'}
                            </PortfolioButton>
                        </motion.div>
                    </motion.div>
                )}

                {qcModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlayStyle}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ ...modalContentStyle, width: '500px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <PortfolioSectionTitle style={{ marginBottom: 0 }}>Paint Quality Check</PortfolioSectionTitle>
                                <button onClick={() => setQcModal({ open: false, jobId: null })} style={closeBtnStyle}><X size={20} /></button>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(232,230,227,0.02)', borderRadius: '12px', border: '1px solid rgba(232,230,227,0.05)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>SELECTED FOR AUDIT</div>
                                <div style={{ fontSize: '16px', color: '#fff', fontWeight: '600', marginTop: '5px' }}>
                                    {booths.find(b => b.current_job === qcModal.jobId)?.job_card_number || 'No Job Selected'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
                                <QCCheckItem label="Color Match (Under Studio Lighting)" />
                                <QCCheckItem label="Clear Coat Uniformity / Peel" />
                                <QCCheckItem label="Dust / Contamination Audit" />
                                <QCCheckItem label="Panel Alignment & Overspray" />
                            </div>

                            <PortfolioButton variant="gold" style={{ width: '100%' }} onClick={handleQCCommit} disabled={submitting || !qcModal.jobId}>
                                {submitting ? 'RELEASING...' : 'APPROVE & RELEASE TO DELIVERY'}
                            </PortfolioButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PortfolioPage>
    );
};

// Internal Components
const QCCheckItem = ({ label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
        <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--gold)' }} />
        <span style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '500' }}>{label}</span>
    </label>
);

// Styles
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modalContentStyle = {
    background: '#0a0a0a', border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '30px', padding: '50px', width: '500px', maxWidth: '90vw',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const closeBtnStyle = {
    background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', cursor: 'pointer'
};

const inputLabelStyle = {
    fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', display: 'block', marginBottom: '12px'
};

const inputStyle = {
    width: '100%', background: 'rgba(232, 230, 227, 0.05)',
    border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '12px',
    padding: '15px', color: 'var(--cream)', outline: 'none', fontSize: '14px'
};

export default PaintDashboard;
