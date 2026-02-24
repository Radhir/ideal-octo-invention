import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Calendar, User, Zap, Plus,
    LayoutDashboard, Users, Package, Settings,
    BarChart3, MessageSquare, Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Portfolio.css';

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchAttendance();
        return () => clearInterval(timer);
    }, []);

    const fetchAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await api.get(`/api/hr/attendance/?date=${today}`);
            if (res.data.results && res.data.results.length > 0) {
                setAttendance(res.data.results[0]);
            }
        } catch (err) {
            console.error('Failed to fetch attendance', err);
        }
    };

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/hr/attendance/clock_in/');
            setAttendance(res.data);
            alert('Clocked In Successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Clock-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/hr/attendance/clock_out/');
            setAttendance(res.data);
            alert('Clocked Out Successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Clock-out failed');
        } finally {
            setLoading(false);
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

    const navItems = [
        { id: '02', label: 'Dashboard', icon: LayoutDashboard, path: '/portfolio', desc: 'System overview and performance metrics.', active: true },
        { id: '03', label: 'Scheduling', icon: Calendar, path: '/scheduling', desc: 'Manage appointments and workshop load.' },
        { id: '04', label: 'Logistics', icon: Package, path: '/logistics', desc: 'Track vehicle movement and parts delivery.' },
        { id: '05', label: 'Management', icon: BarChart3, path: '/management', desc: 'Operational control and business oversight.' },
        { id: '06', label: 'Operations', icon: Zap, path: '/workshop', desc: 'Live workshop floor and job card tracking.' },
        { id: '07', label: 'Sales/CRM', icon: Users, path: '/sales', desc: 'Customer relations and lead management.' },
        { id: '08', label: 'HR', icon: Users, path: '/hr/directory', desc: 'Employee records and attendance control.' },
        { id: '09', label: 'Chat', icon: MessageSquare, path: '/chat', desc: 'Secure internal team communications.' },
        { id: '10', label: 'Reports', icon: BarChart3, path: '/reports', desc: 'Deep dive analytics and financial summaries.' },
        { id: '11', label: 'Settings', icon: Settings, path: '/settings', desc: 'System configuration and preferences.' },
        { id: '12', label: 'Calculations', icon: Calculator, path: '/finance', desc: 'Invoicing, expenses, and payroll logic.' },
    ];

    return (
        <div className="portfolio-dashboard">
            <div className="welcome-section">
                <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="welcome-title"
                >
                    WELCOME BACK,
                    <span>{user?.name || user?.username || 'GUEST'}</span>
                </motion.h1>
                <span className="user-role">{user?.role_name || 'SYSTEM ARCHITECT'}</span>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="attendance-widget"
                >
                    <div className="attendance-label">System Pulse / Presence</div>
                    <div className="time-display">
                        {formatTime(currentTime)}
                    </div>
                    <div className="date-display">{formatDate(currentTime)}</div>

                    <div className="check-times">
                        <div className="check-block">
                            <span className="check-label">Checked In</span>
                            <span className="check-time">{attendance?.clock_in || '--:--'}</span>
                        </div>
                        <div className="check-block">
                            <span className="check-label">Last Ping</span>
                            <span className="check-time">{formatTime(currentTime)}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button
                            className={`attend-btn punch-in ${attendance?.clock_in ? 'active-status' : ''}`}
                            onClick={handleClockIn}
                            disabled={loading || attendance?.clock_in}
                        >
                            <Zap size={14} fill="currentColor" /> {attendance?.clock_in ? 'ACTIVE' : 'PUNCH IN'}
                        </button>
                        <button
                            className="attend-btn punch-out"
                            onClick={handleClockOut}
                            disabled={loading || !attendance?.clock_in || attendance?.clock_out}
                        >
                            {attendance?.clock_out ? 'LOGGED' : 'PUNCH OUT'}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="portfolio-grid">
                {navItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`nav-card ${item.active ? 'active' : ''}`}
                        onClick={() => item.path && navigate(item.path)}
                    >
                        <div className="card-id">{item.id}</div>
                        <div className="card-icon-wrapper">
                            <item.icon size={24} />
                        </div>
                        <div className="card-content">
                            <div className="card-label">{item.label}</div>
                            <div className="card-description">{item.desc}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="social-sidebar">
                <span className="social-link">Instagram</span>
                <span className="social-link">Facebook</span>
                <span className="social-link">X-PLATFORM</span>
            </div>
        </div>
    );
};

export default Portfolio;
