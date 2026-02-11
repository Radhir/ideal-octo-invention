import React, { useState, useEffect } from 'react';
import { Clock, Calendar, LogOut, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

/**
 * Employee Dashboard
 * Limited view for regular employees - only Calendar + Clock In
 * All other features require permission from Ruchika (MD/Owner)
 */
const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodayAttendance();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchTodayAttendance = async () => {
        try {
            const res = await api.get('/forms/attendance/api/today/');
            setAttendance(res.data);
        } catch (err) {
            // No record for today - that's fine
            setAttendance(null);
        }
    };

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const res = await api.post('/forms/attendance/api/check-in/');
            setAttendance(res.data.data || res.data);
        } catch (err) {
            alert(err.response?.data?.error || 'Clock in failed');
        }
        setLoading(false);
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const res = await api.post('/forms/attendance/api/check-out/');
            setAttendance(res.data.data || res.data);
        } catch (err) {
            alert(err.response?.data?.error || 'Clock out failed');
        }
        setLoading(false);
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
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.card}
            >
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user?.username?.[0]?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <h2 style={styles.userName}>{user?.full_name || user?.username || 'Employee'}</h2>
                            <p style={styles.userRole}>Elite Shine Team</p>
                        </div>
                    </div>
                    <button onClick={logout} style={styles.logoutBtn}>
                        <LogOut size={18} />
                    </button>
                </div>

                {/* Time Display */}
                <div style={styles.timeSection}>
                    <div style={styles.currentTime}>{formatTime(currentTime)}</div>
                    <div style={styles.currentDate}>{formatDate(currentTime)}</div>
                </div>

                {/* Clock In/Out Section */}
                <div style={styles.attendanceSection}>
                    {!attendance?.check_in_time ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClockIn}
                            disabled={loading}
                            style={styles.clockInBtn}
                        >
                            <Clock size={24} />
                            {loading ? 'Processing...' : 'CLOCK IN'}
                        </motion.button>
                    ) : !attendance?.check_out_time ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClockOut}
                            disabled={loading}
                            style={styles.clockOutBtn}
                        >
                            <Clock size={24} />
                            {loading ? 'Processing...' : 'CLOCK OUT'}
                        </motion.button>
                    ) : (
                        <div style={styles.completedShift}>
                            <div style={styles.checkmark}>✓</div>
                            <div>Shift Completed</div>
                            <div style={styles.hoursWorked}>
                                {attendance.total_hours}h worked
                            </div>
                        </div>
                    )}

                    {attendance?.check_in_time && (
                        <div style={styles.shiftInfo}>
                            <div style={styles.shiftRow}>
                                <span>Clock In:</span>
                                <span style={styles.shiftTime}>{attendance.check_in_time}</span>
                            </div>
                            {attendance.check_out_time && (
                                <div style={styles.shiftRow}>
                                    <span>Clock Out:</span>
                                    <span style={styles.shiftTime}>{attendance.check_out_time}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div style={styles.quickLinks}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/scheduling')}
                        style={styles.linkCard}
                    >
                        <Calendar size={20} color="#b08d57" />
                        <span>View Calendar</span>
                        <ChevronRight size={16} color="#64748b" />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/portfolio')}
                        style={styles.linkCard}
                    >
                        <User size={20} color="#b08d57" />
                        <span>My Profile</span>
                        <ChevronRight size={16} color="#64748b" />
                    </motion.div>
                </div>

                {/* Restricted Access Notice */}
                <div style={styles.restrictedNotice}>
                    <span>🔒</span>
                    <span>Other features require permission from MD</span>
                </div>
            </motion.div>
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
        padding: '20px',
        fontFamily: 'Outfit, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        background: '#111',
        borderRadius: '30px',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '15px',
        background: 'linear-gradient(135deg, #b08d57, #8b6b3d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '800',
        fontSize: '20px',
    },
    userName: {
        margin: 0,
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700',
    },
    userRole: {
        margin: 0,
        color: '#64748b',
        fontSize: '12px',
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px',
        color: '#94a3b8',
        cursor: 'pointer',
    },
    timeSection: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    currentTime: {
        fontSize: '48px',
        fontWeight: '900',
        color: '#fff',
        letterSpacing: '-2px',
    },
    currentDate: {
        fontSize: '14px',
        color: '#64748b',
        marginTop: '5px',
    },
    attendanceSection: {
        background: '#000',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '20px',
    },
    clockInBtn: {
        width: '100%',
        padding: '20px',
        borderRadius: '15px',
        border: 'none',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '800',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    clockOutBtn: {
        width: '100%',
        padding: '20px',
        borderRadius: '15px',
        border: 'none',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '800',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    completedShift: {
        textAlign: 'center',
        color: '#10b981',
    },
    checkmark: {
        fontSize: '40px',
        marginBottom: '10px',
    },
    hoursWorked: {
        fontSize: '24px',
        fontWeight: '700',
        marginTop: '10px',
    },
    shiftInfo: {
        marginTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px',
    },
    shiftRow: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#94a3b8',
        fontSize: '13px',
        marginBottom: '8px',
    },
    shiftTime: {
        color: '#fff',
        fontWeight: '600',
    },
    quickLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
    },
    linkCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px 20px',
        background: '#000',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    restrictedNotice: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        background: 'rgba(176, 141, 87, 0.1)',
        borderRadius: '10px',
        color: '#b08d57',
        fontSize: '12px',
    },
};

export default EmployeeDashboard;
