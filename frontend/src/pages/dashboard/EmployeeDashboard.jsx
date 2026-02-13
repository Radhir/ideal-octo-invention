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
            <div
                className="animate-fade-in"
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
                    <div style={{ ...styles.currentTime, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>{formatTime(currentTime)}</div>
                    <div className="editorial-label" style={{ marginTop: '10px' }}>{formatDate(currentTime)}</div>
                </div>

                {/* Clock In/Out Section */}
                <div style={styles.attendanceSection}>
                    {!attendance?.check_in_time ? (
                        <button
                            onClick={handleClockIn}
                            disabled={loading}
                            style={styles.clockInBtn}
                            className="scale-hover"
                        >
                            <Clock size={24} />
                            {loading ? 'Processing...' : 'CLOCK IN'}
                        </button>
                    ) : !attendance?.check_out_time ? (
                        <button
                            onClick={handleClockOut}
                            disabled={loading}
                            style={styles.clockOutBtn}
                            className="scale-hover"
                        >
                            <Clock size={24} />
                            {loading ? 'Processing...' : 'CLOCK OUT'}
                        </button>
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
                    <div
                        onClick={() => navigate('/scheduling')}
                        style={styles.linkCard}
                        className="scale-hover"
                    >
                        <Calendar size={20} color="#b08d57" />
                        <span>View Calendar</span>
                        <ChevronRight size={16} color="#64748b" />
                    </div>
                    <div
                        onClick={() => navigate('/portfolio')}
                        style={styles.linkCard}
                        className="scale-hover"
                    >
                        <User size={20} color="#b08d57" />
                        <span>My Profile</span>
                        <ChevronRight size={16} color="#64748b" />
                    </div>
                </div>

                {/* Restricted Access Notice */}
                <div style={styles.restrictedNotice}>
                    <span>🔒</span>
                    <span>Other features require permission from MD</span>
                </div>
            </div>

        </div>
    );
};

const styles = {
    container: {
        minHeight: '100dvh',
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Outfit, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.6)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-md)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontWeight: '900',
        fontSize: '22px',
    },
    userName: {
        margin: 0,
        color: '#fff',
        fontSize: '20px',
        fontWeight: '800',
    },
    userRole: {
        margin: 0,
        color: 'var(--text-muted)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '12px',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    timeSection: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    currentTime: {
        fontSize: '64px',
        fontWeight: '900',
        color: '#fff',
        letterSpacing: '-3px',
        lineHeight: 1,
    },
    currentDate: {
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginTop: '10px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '700',
    },
    attendanceSection: {
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.03)',
    },
    clockInBtn: {
        width: '100%',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: '#fff',
        color: '#000',
        fontSize: '14px',
        fontWeight: '900',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    },
    clockOutBtn: {
        width: '100%',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: '#ef4444',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '900',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    completedShift: {
        textAlign: 'center',
        color: '#10b981',
    },
    checkmark: {
        fontSize: '48px',
        marginBottom: '10px',
    },
    hoursWorked: {
        fontSize: '28px',
        fontWeight: '900',
        marginTop: '10px',
        fontFamily: 'Outfit, sans-serif',
    },
    shiftInfo: {
        marginTop: '24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '24px',
    },
    shiftRow: {
        display: 'flex',
        justifyContent: 'space-between',
        color: 'var(--text-muted)',
        fontSize: '12px',
        marginBottom: '10px',
        fontWeight: '600',
    },
    shiftTime: {
        color: '#fff',
        fontWeight: '800',
    },
    quickLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
    },
    linkCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '18px 24px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    restrictedNotice: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '15px',
        background: 'rgba(176, 141, 87, 0.05)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--gold)',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
};

export default EmployeeDashboard;
