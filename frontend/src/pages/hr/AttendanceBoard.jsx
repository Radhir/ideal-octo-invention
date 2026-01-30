import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    Users, Clock, CheckCircle2, AlertCircle,
    Search, Filter, ArrowUpRight, UserCheck,
    UserMinus, Zap, Printer
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const AttendanceBoard = () => {
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    // New state variables for current user's attendance
    const [status, setStatus] = useState('NOT_CHECKED_IN'); // NOT_CHECKED_IN, CHECKED_IN, CHECKED_OUT
    const [records, setRecords] = useState([]); // Current user's attendance records
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchAttendance = async () => {
        try {
            const res = await axios.get('/forms/attendance/api/');
            // Backend returns list, we want today's record for this user
            const todayStr = new Date().toISOString().split('T')[0];
            const todayRecord = res.data.find(r => r.date === todayStr);

            if (todayRecord) {
                setStatus('CHECKED_IN');
                // Calculate hours if needed, or rely on backend
                if (todayRecord.check_out_time) {
                    setStatus('CHECKED_OUT');
                }
                setRecords(res.data);
            } else {
                setStatus('NOT_CHECKED_IN');
            }
        } catch (err) {
            console.error("Error fetching current user's attendance:", err);
            setStatus('NOT_CHECKED_IN'); // Assume not checked in if error
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data for the board
        fetchAttendance(); // Fetch current user's attendance status
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, logRes] = await Promise.all([
                axios.get('/hr/api/employees/'),
                axios.get('/hr/api/attendance/')
            ]);
            setEmployees(empRes.data);
            setLogs(logRes.data);
        } catch (err) {
            console.error('Error fetching HR data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setLoading(true); // This loading state might need to be more granular if it affects the whole board
        try {
            await axios.post('/forms/attendance/api/check_in/');
            setStatus('CHECKED_IN');
            alert('Checked in successfully!');
            fetchAttendance(); // Re-fetch current user's attendance to update records
            fetchData(); // Re-fetch board data to update overall status
        } catch (err) {
            alert(err.response?.data?.error || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true); // This loading state might need to be more granular
        try {
            await axios.post('/forms/attendance/api/check_out/');
            setStatus('CHECKED_OUT');
            alert('Checked out successfully!');
            fetchAttendance(); // Re-fetch current user's attendance to update records
            fetchData(); // Re-fetch board data to update overall status
        } catch (err) {
            alert(err.response?.data?.error || 'Check-out failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#fff' }}>Monitoring Personnel Nodes...</div>;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysLogs = logs.filter(l => l.date === todayStr);

    const activeCount = todaysLogs.filter(l => !l.check_out_time).length;
    const completedCount = todaysLogs.filter(l => l.check_out_time).length;
    const missingCount = employees.length - todaysLogs.length;

    return (
        <div style={{ padding: '30px' }}>
            <PrintHeader title="Daily Attendance Board" />

            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#8400ff', fontWeight: '800', letterSpacing: '2px' }}>WORKFORCE CONTROL</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.2rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Attendance Board</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Attendance Actions */}
                    {status !== 'CHECKED_IN' && status !== 'CHECKED_OUT' && (
                        <button onClick={handleCheckIn} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid #10b981', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Zap size={18} color="#10b981" /> Clock In
                        </button>
                    )}

                    {status === 'CHECKED_IN' && (
                        <button onClick={handleCheckOut} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid #f43f5e', cursor: 'pointer', background: 'rgba(244, 63, 94, 0.1)' }}>
                            <ArrowUpRight size={18} color="#f43f5e" /> Clock Out
                        </button>
                    )}

                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}>
                        <Printer size={18} /> Print Daily Log
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
                <StatusCard label="Total Staff" value={employees.length} icon={Users} color="#8400ff" />
                <StatusCard label="Currently In" value={activeCount} icon={UserCheck} color="#10b981" />
                <StatusCard label="Shift Done" value={completedCount} icon={Zap} color="#b08d57" />
                <StatusCard label="Not Yet Logged" value={missingCount} icon={UserMinus} color="#f43f5e" />
            </div>

            <GlassCard style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={cardTitleStyle}>Real-time Personnel Status</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['ALL', 'IN', 'OUT', 'MISSING'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '6px 15px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    background: filter === f ? '#8400ff' : 'rgba(255,255,255,0.02)',
                                    color: filter === f ? '#fff' : '#64748b',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {employees.map(emp => {
                        const log = todaysLogs.find(l => l.employee === emp.id);
                        const status = log ? (log.check_out_time ? 'OUT' : 'IN') : 'MISSING';

                        // Filtering logic
                        if (filter !== 'ALL' && filter !== status) return null;

                        return (
                            <div key={emp.id} style={{
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '15px',
                                border: `1px solid ${status === 'IN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>{emp.user_name || 'Personnel Node'}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.role} | ID: {emp.employee_id}</div>
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
                                        <div style={{ fontSize: '13px', color: '#fff' }}>{log?.check_in_time || '--:--'}</div>
                                    </div>
                                    <div>
                                        <div style={labelStyle}>Total Hours</div>
                                        <div style={{ fontSize: '13px', color: '#fff' }}>{log?.total_hours || '0.00'} hrs</div>
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
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{value}</div>
        </div>
    </GlassCard>
);

const cardTitleStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#8400ff',
    marginBottom: '25px',
    fontWeight: '800',
    letterSpacing: '1px'
};

const labelStyle = {
    fontSize: '9px',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '3px',
    fontWeight: '700'
};

export default AttendanceBoard;
