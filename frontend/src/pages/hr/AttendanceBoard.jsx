import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Users, Search, Filter, ArrowUpRight, UserCheck,
    UserMinus, Zap, Printer
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const AttendanceBoard = () => {
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // New state variables for current user's attendance
    const [status, setStatus] = useState('NOT_CHECKED_IN'); // NOT_CHECKED_IN, CHECKED_IN, CHECKED_OUT
    const [, setCurrentTime] = useState(new Date());

    const fetchAttendance = useCallback(async () => {
        try {
            const res = await api.get(`/forms/attendance/api/records/?date=${selectedDate}`);
            setLogs(res.data);

            // Current user's status for the action buttons
            if (selectedDate === new Date().toISOString().split('T')[0]) {
                const todayRes = await api.get('/forms/attendance/api/today/');
                if (todayRes.data && todayRes.data.id) {
                    setStatus(todayRes.data.check_out_time ? 'CHECKED_OUT' : 'CHECKED_IN');
                } else {
                    setStatus('NOT_CHECKED_IN');
                }
            }
        } catch (err) {
            console.error("Error fetching attendance logs:", err);
        }
    }, [selectedDate]);

    const fetchInitialData = useCallback(async () => {
        try {
            const empRes = await api.get('/hr/api/employees/');
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, [fetchInitialData]);

    useEffect(() => {
        if (!loading) fetchAttendance();
    }, [fetchAttendance, loading]);

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            await api.post('/forms/attendance/api/check-in/');
            setStatus('CHECKED_IN');
            alert('Checked in successfully!');
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            await api.post('/forms/attendance/api/check-out/');
            setStatus('CHECKED_OUT');
            alert('Checked out successfully!');
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Check-out failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '900' }}>MONITORING PERSONNEL NODES...</div>;

    const activeCount = logs.filter(l => !l.check_out_time).length;
    const completedCount = logs.filter(l => l.check_out_time).length;
    const missingCount = employees.length - logs.length;

    return (
        <div style={{ padding: '30px' }}>
            <PrintHeader title="Daily Attendance Board" />

            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Workforce Control • Live</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h1 style={{ margin: '5px 0 0 0', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Attendance Board</h1>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                background: 'var(--input-bg)',
                                border: '1.5px solid var(--gold-border)',
                                color: 'var(--gold)',
                                padding: '8px 15px',
                                borderRadius: '8px',
                                fontWeight: '900',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginTop: '8px'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Attendance Actions */}
                    {status !== 'CHECKED_IN' && status !== 'CHECKED_OUT' && (
                        <button onClick={handleCheckIn} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', color: 'var(--text-primary)', border: '1.5px solid #10b981', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.1)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>
                            <Zap size={18} color="#10b981" /> Clock In
                        </button>
                    )}

                    {status === 'CHECKED_IN' && (
                        <button onClick={handleCheckOut} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', color: 'var(--text-primary)', border: '1.5px solid #f43f5e', cursor: 'pointer', background: 'rgba(244, 63, 94, 0.1)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>
                            <ArrowUpRight size={18} color="#f43f5e" /> Clock Out
                        </button>
                    )}

                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)', cursor: 'pointer', background: 'var(--input-bg)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>
                        <Printer size={18} color="var(--gold)" /> Print Log
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
                <StatusCard label="Total Staff" value={employees.length} icon={Users} color="var(--gold)" />
                <StatusCard label="Currently In" value={activeCount} icon={UserCheck} color="#10b981" />
                <StatusCard label="Shift Done" value={completedCount} icon={Zap} color="var(--gold)" />
                <StatusCard label="Not Yet Logged" value={missingCount} icon={UserMinus} color="#f43f5e" />
            </div>

            <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={cardTitleStyle}>Real-time Personnel Status</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['ALL', 'IN', 'OUT', 'MISSING'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    fontSize: '10px',
                                    fontWeight: '900',
                                    background: filter === f ? 'var(--gold)' : 'var(--bg-glass)',
                                    color: filter === f ? '#000000' : 'var(--text-secondary)',
                                    border: '1.5px solid var(--gold-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {employees.map(emp => {
                        const log = logs.find(l => l.employee === emp.id);
                        const status = log ? (log.check_out_time ? 'OUT' : 'IN') : 'MISSING';

                        // Filtering logic
                        if (filter !== 'ALL' && filter !== status) return null;

                        return (
                            <div key={emp.id} style={{
                                padding: '20px',
                                background: 'var(--bg-glass)',
                                borderRadius: '15px',
                                border: `1.5px solid ${status === 'IN' ? '#10b981' : 'var(--gold-border)'}`,
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <div style={{ fontWeight: '900', fontSize: '15px', color: 'var(--text-primary)' }}>{emp.user_name || 'Personnel Node'}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase' }}>{emp.role} | ID: {emp.employee_id}</div>
                                    </div>
                                    <div style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        background: status === 'IN' ? 'rgba(16, 185, 129, 0.1)' : status === 'OUT' ? 'rgba(176, 141, 87, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: status === 'IN' ? '#10b981' : status === 'OUT' ? '#b08d57' : '#f43f5e',
                                        border: '1px solid currentColor'
                                    }}>
                                        {status}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={labelStyle}>Clock In</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '900' }}>{log?.check_in_time || '--:--'}</div>
                                    </div>
                                    <div>
                                        <div style={labelStyle}>Clock Out</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '900' }}>{log?.check_out_time || '--:--'}</div>
                                    </div>
                                </div>

                                {status === 'IN' && (
                                    <div style={{ marginTop: '15px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div className="progress-crawl" style={{ height: '100%', width: '40%', background: '#10b981', borderRadius: '2px' }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </GlassCard>

            <style>{`
                .progress-crawl { animation: crawl 2s infinite linear; }
                @keyframes crawl { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .glass-card { border: 1px solid #eee !important; box-shadow: none !important; background: #fff !important; color: #000 !important; }
                    button, .no-print { display: none !important; }
                    h1 { color: #8400ff !important; }
                }
            `}</style>
        </div>
    );
};

const StatusCard = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gold-border)' }}>
            <Icon size={24} style={{ color: 'var(--gold)' }} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </GlassCard>
);

const cardTitleStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '25px',
    fontWeight: '900',
    letterSpacing: '2px'
};

const labelStyle = {
    fontSize: '9px',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    marginBottom: '3px',
    fontWeight: '900',
    letterSpacing: '1px'
};

export default AttendanceBoard;
