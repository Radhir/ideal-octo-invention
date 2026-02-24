import React, { useState, useRef, useEffect } from 'react';
import {
    X, LayoutDashboard, Briefcase, Calendar as CalendarIcon,
    AlertTriangle, Coffee, Palette, Gamepad2, Zap,
    Activity, FileText, MessageSquare, PieChart, Flame,
    Search, Bell, User, Grid, Layers, Plus, ClipboardCheck,
    BarChart3, Settings, Package, FileCheck, Users,
    Search as SearchIcon, MoreHorizontal, ShieldCheck,
    HelpCircle, ChevronRight, CheckCircle2, Clock,
    CreditCard, Warehouse, Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePermissions } from '../context/PermissionContext';
import EliteCommandTerminal from './EliteCommandTerminal';
import api from '../api/axios';

const WorkflowCenter = () => {
    const { hasPermission } = usePermissions();
    const [isOpen, setIsOpen] = useState(false);
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [stats, setStats] = useState({ liveJobs: 0, pendingQC: 0, revenue: '0', alerts: 0 });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const clickCountRef = useRef(0);
    const lastClickTime = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await api.get('/api/job-cards/api/jobs/');
                    const jobs = res.data;

                    // Stats calculation
                    const live = jobs.filter(j => ['RECEIVED', 'IN_PROGRESS', 'READY'].includes(j.status)).length;
                    const qc = jobs.filter(j => j.status === 'READY').length;
                    const totalRev = jobs.reduce((sum, j) => sum + parseFloat(j.total_amount || 0), 0);

                    setStats({
                        liveJobs: live,
                        pendingQC: qc,
                        revenue: (totalRev / 1000).toFixed(1) + 'k',
                        alerts: 3 // Mocked for now
                    });

                    // Activities
                    const sorted = jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
                    setActivities(sorted);
                } catch (err) {
                    console.error('Error fetching Workflow Center data', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleHubClick = () => {
        const now = Date.now();
        if (now - lastClickTime.current < 500) {
            clickCountRef.current += 1;
        } else {
            clickCountRef.current = 1;
        }
        lastClickTime.current = now;

        if (clickCountRef.current >= 5) {
            setTerminalOpen(true);
            clickCountRef.current = 0;
            setIsOpen(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <>


            <EliteCommandTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hub-overlay"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="hub-panel"
                            onClick={e => e.stopPropagation()}
                        >
                            <header className="hub-header">
                                <div className="hub-title-box">
                                    <div className="hub-logo-circle">
                                        <Settings size={22} />
                                    </div>
                                    <div className="hub-title-text">
                                        <h2>Workflow Center</h2>
                                        <p>Quick Access & Action Panel</p>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    <div className="header-btn"><MoreHorizontal size={18} /></div>
                                    <div className="header-btn" onClick={() => setIsOpen(false)}><X size={18} /></div>
                                </div>
                            </header>

                            <div className="hub-body">
                                <aside className="hub-sidebar">
                                    <div className="side-section">
                                        <h3>Operations</h3>
                                        <div className="side-item" onClick={() => { navigate('/job-cards'); setIsOpen(false); }}>
                                            <div className="side-icon"><Briefcase size={14} /></div>
                                            Workshop Registry
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/operations'); setIsOpen(false); }}>
                                            <div className="side-icon"><ClipboardCheck size={14} /></div>
                                            System Inspections
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/job-board'); setIsOpen(false); }}>
                                            <div className="side-icon"><Activity size={14} /></div>
                                            Workshop Board (QC)
                                        </div>
                                    </div>
                                    <div className="side-section" style={{ color: '#C084FC' }}>
                                        <h3>Sales & CRM</h3>
                                        <div className="side-item" onClick={() => { navigate('/bookings/create'); setIsOpen(false); }}>
                                            <div className="side-icon"><CalendarIcon size={14} /></div>
                                            New Booking
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/customers'); setIsOpen(false); }}>
                                            <div className="side-icon"><Users size={14} /></div>
                                            Customer Master
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/leads'); setIsOpen(false); }}>
                                            <div className="side-icon"><Zap size={14} /></div>
                                            Opportunities (Leads)
                                        </div>
                                    </div>
                                    <div className="side-section" style={{ color: '#FCD34D' }}>
                                        <h3>Finance & Accounts</h3>
                                        <div className="side-item" onClick={() => { navigate('/finance/coa'); setIsOpen(false); }}>
                                            <div className="side-icon"><CreditCard size={14} /></div>
                                            Accounts Master (COA)
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/invoices'); setIsOpen(false); }}>
                                            <div className="side-icon"><FileText size={14} /></div>
                                            Invoices
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/finance/reports'); setIsOpen(false); }}>
                                            <div className="side-icon"><BarChart3 size={14} /></div>
                                            Reports
                                        </div>
                                    </div>
                                    <div className="side-section" style={{ color: '#6366F1' }}>
                                        <h3>Executive Management</h3>
                                        <div className="side-item" onClick={() => { navigate('/analytics'); setIsOpen(false); }}>
                                            <div className="side-icon"><BarChart3 size={14} /></div>
                                            Performance Analytics
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/risk-management'); setIsOpen(false); }}>
                                            <div className="side-icon"><ShieldCheck size={14} /></div>
                                            Risk & Audit
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/elitepro'); setIsOpen(false); }}>
                                            <div className="side-icon"><Package size={14} /></div>
                                            ElitePro (EPM)
                                        </div>
                                    </div>

                                    <div className="side-section" style={{ color: '#F472B6' }}>
                                        <h3>Human Resources</h3>
                                        <div className="side-item" onClick={() => { navigate('/hr'); setIsOpen(false); }}>
                                            <div className="side-icon"><Users size={14} /></div>
                                            HR Command Hub
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/hr/directory'); setIsOpen(false); }}>
                                            <div className="side-icon"><User size={14} /></div>
                                            Personnel Directory
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/hr/access'); setIsOpen(false); }}>
                                            <div className="side-icon"><ShieldCheck size={14} /></div>
                                            Access Permissions
                                        </div>
                                    </div>

                                    <div className="side-section" style={{ color: '#F87171' }}>
                                        <h3>Master Data</h3>
                                        <div className="side-item" onClick={() => { navigate('/masters/vehicles'); setIsOpen(false); }}>
                                            <div className="side-icon"><Car size={14} /></div>
                                            Vehicle Master
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/masters/users'); setIsOpen(false); }}>
                                            <div className="side-icon"><User size={14} /></div>
                                            User Master
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/masters/branches'); setIsOpen(false); }}>
                                            <div className="side-icon"><Warehouse size={14} /></div>
                                            Branch Master
                                        </div>
                                        <div className="side-item" onClick={() => { navigate('/customers'); setIsOpen(false); }}>
                                            <div className="side-icon"><Users size={14} /></div>
                                            Customer Master
                                        </div>
                                    </div>
                                </aside>

                                <main className="hub-content">
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <span className="stat-label">Live Jobs</span>
                                            <div className="stat-value-row">
                                                <span className="stat-value">{stats.liveJobs}</span>
                                                <span className="stat-change pos">+2</span>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-label">Pending QC</span>
                                            <div className="stat-value-row">
                                                <span className="stat-value">{stats.pendingQC}</span>
                                                <span className="stat-change neg">-1</span>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-label">Total Revenue</span>
                                            <div className="stat-value-row">
                                                <span className="stat-value">AED {stats.revenue}</span>
                                                <span className="stat-change pos">+12%</span>
                                            </div>
                                        </div>
                                        <div className="stat-card" style={{ borderColor: 'rgba(255, 77, 77, 0.2)' }}>
                                            <span className="stat-label">Inventory Alert</span>
                                            <div className="stat-value-row">
                                                <span className="stat-value">{stats.alerts}</span>
                                                <span style={{ color: '#FF4D4D', fontWeight: 800 }}>!</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="activity-section">
                                        <header>
                                            <h4>Live Activity Stream</h4>
                                            <div className="live-indicator">
                                                <div className="live-dot"></div>
                                                LIVE UPDATES
                                            </div>
                                        </header>
                                        <div className="activity-list">
                                            {activities.map((act, i) => (
                                                <div key={i} className="activity-item">
                                                    <div className="act-avatar">
                                                        {act.customer_name?.[0]?.toUpperCase() || 'J'}
                                                    </div>
                                                    <div className="act-details">
                                                        <div className="act-user-row">
                                                            <span className="act-user">{act.customer_name}</span>
                                                            <span className="act-time">{new Number(Math.floor(Math.random() * 60))}m ago</span>
                                                        </div>
                                                        <div className="act-desc">
                                                            New {act.status_display || act.status} Job: {act.brand} {act.model} ({act.job_card_number})
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {activities.length === 0 && (
                                                <div style={{ textAlign: 'center', opacity: 0.3, padding: '40px' }}>No recent pulses detected.</div>
                                            )}
                                        </div>
                                    </div>
                                </main>
                            </div>

                            <footer className="hub-footer">
                                <div className="footer-link">
                                    <ShieldCheck size={14} />
                                    System Health
                                </div>
                                <div className="footer-link">
                                    <HelpCircle size={14} />
                                    Quick Support
                                </div>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                className="hub-toggle-btn"
                onClick={handleHubClick}
            >
                {isOpen ? <X size={24} /> : <Zap size={24} />}
            </button>
        </>
    );
};

export default WorkflowCenter;
