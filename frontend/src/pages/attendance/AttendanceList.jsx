import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    UserCheck, Clock, CheckCircle2, AlertCircle,
    Calendar, Play, Square, Timer,
    Zap, Activity, LayoutDashboard, Printer
} from 'lucide-react';

const AttendanceList = () => {
    const [attendance, setAttendance] = useState(null);
    const [roster, setRoster] = useState(null);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const timerRef = useRef(null);

    useEffect(() => {
        fetchInitialData();
        return () => clearInterval(timerRef.current);
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch roster for today (simulated)
            const rostersRes = await api.get('/hr/api/roster/');
            // Find roster for today or use a default 10-hour shift
            const todayStr = new Date().toISOString().split('T')[0];
            const myRoster = rostersRes.data.length > 0 ? rostersRes.data[0] : {
                shift_start: `${todayStr}T08:00:00`,
                shift_end: `${todayStr}T18:00:00`,
                task_notes: "Elite Shine Standard 10-Hour Shift"
            };
            setRoster(myRoster);

            // Fetch current attendance
            const attendRes = await api.get('/forms/attendance/api/records/');
            const todayAttend = attendRes.data.find(a => a.date === todayStr);
            setAttendance(todayAttend);
            setAllLogs(attendRes.data);

            if (todayAttend && todayAttend.check_in_time && !todayAttend.check_out_time) {
                startTimer(todayAttend.check_in_time);
            }
        } catch (err) {
            console.error('Error fetching HR data', err);
        } finally {
            setLoading(false);
        }
    };

    const startTimer = (startTimeStr) => {
        clearInterval(timerRef.current);
        const [h, m, s] = startTimeStr.split(':').map(Number);
        const start = new Date();
        start.setHours(h, m, s, 0);

        timerRef.current = setInterval(() => {
            const now = new Date();
            const diff = now - start;
            if (diff < 0) return;

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setElapsedTime(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        }, 1000);
    };

    const handleClockIn = async () => {
        try {
            const res = await api.post('/forms/attendance/api/check-in/');
            setAttendance(res.data.data || res.data);
            if (res.data.data?.check_in_time || res.data.check_in_time) {
                startTimer(res.data.data?.check_in_time || res.data.check_in_time);
            }
            fetchInitialData();
        } catch (err) {
            console.error('Clock in failed', err);
            alert('Clock in failed: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleClockOut = async () => {
        try {
            const res = await api.post('/forms/attendance/api/check-out/');
            setAttendance(res.data.data || res.data);
            clearInterval(timerRef.current);
            fetchInitialData();
        } catch (err) {
            console.error('Clock out failed', err);
            alert('Clock out failed: ' + (err.response?.data?.error || err.message));
        }
    };

    // Calculate progress based on a 10-hour workday (36000 seconds)
    const getWorkProgress = () => {
        if (!attendance || !attendance.check_in_time) return 0;
        if (attendance.check_out_time) return (attendance.total_hours / 10) * 100;

        const [h, m, s] = attendance.check_in_time.split(':').map(Number);
        const start = new Date();
        start.setHours(h, m, s, 0);
        const diffInSeconds = (new Date() - start) / 1000;
        return Math.min((diffInSeconds / 36000) * 100, 100);
    };

    if (loading) return <div style={{ color: 'var(--text-primary)', padding: '100px', textAlign: 'center', background: 'var(--bg-primary)', minHeight: '100vh' }}>Synchronizing Personnel Nodes...</div>;

    return (
        <div style={{ padding: '40px 30px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <div style={{ color: '#b08d57', fontWeight: '900', letterSpacing: '4px', fontSize: '12px', marginBottom: '10px' }}>WORKFORCE LOGISTICS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Attendance Hub</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginTop: '10px' }}>Live monitoring of the 10-hour industrial shift lifecycle.</p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    >
                        <Printer size={20} /> Print Logs
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 450px', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Live Tracking Card */}
                    <GlassCard style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: attendance && !attendance.check_out_time ? '#10b981' : 'var(--text-muted)' }}>
                                <Activity size={16} className={attendance && !attendance.clock_out ? 'pulse-anim' : ''} />
                                <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>
                                    {attendance && !attendance.check_out_time ? 'SESSION ACTIVE' : 'NO ACTIVE SESSION'}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ fontSize: '14px', color: '#b08d57', fontWeight: '800', marginBottom: '5px' }}>CURRENT SESSION</div>
                            <div style={{
                                fontSize: '5rem',
                                fontWeight: '900',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                letterSpacing: '-2px'
                            }}>
                                {attendance && !attendance.check_out_time ? elapsedTime : attendance?.check_out_time ? `${attendance.total_hours} hrs` : '00:00:00'}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', position: 'relative', marginBottom: '20px' }}>
                            <div style={{
                                height: '100%',
                                width: `${getWorkProgress()}%`,
                                background: 'linear-gradient(to right, #b08d57, var(--text-primary))',
                                borderRadius: '4px',
                                boxShadow: '0 0 15px rgba(176,141,87,0.3)',
                                transition: 'width 1s ease-in-out'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800' }}>
                            <span>SHIFT START</span>
                            <span>10 HOUR TARGET</span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                            {!attendance || !attendance.check_in_time ? (
                                <button onClick={handleClockIn} className="nav-action-btn" style={{ flex: 1, height: '60px', borderRadius: '15px', background: 'rgba(176,141,87,0.1)', border: '1px solid #b08d57', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: '800', cursor: 'pointer' }}>
                                    <Play size={20} /> INITIATE SHIFT
                                </button>
                            ) : !attendance.check_out_time ? (
                                <button onClick={handleClockOut} className="nav-action-btn" style={{ flex: 1, height: '60px', borderRadius: '15px', background: 'rgba(244,63,94,0.1)', border: '1px solid #f43f5e', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: '800', cursor: 'pointer' }}>
                                    <Square size={20} /> TERMINATE SHIFT
                                </button>
                            ) : (
                                <div style={{ flex: 1, padding: '20px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '15px', textAlign: 'center', fontWeight: '800' }}>
                                    DAILY CYCLE COMPLETED
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Today's Logs */}
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>TODAY'S FLEET STATUS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {allLogs.map(log => (
                                <GlassCard key={log.id} style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserCheck size={18} color="#b08d57" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{log.employee_name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shift active since {log.check_in_time}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: log.clock_out ? '#10b981' : '#f59e0b' }}>
                                            {log.check_out_time ? 'COMPLETED' : 'IN_TRANSIT'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.total_hours} hrs logged</div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Roster Context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <GlassCard style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <Calendar size={20} color="#b08d57" />
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Active Roster</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <RosterItem icon={Timer} label="Shift Window" value={`${new Date(roster.shift_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(roster.shift_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                            <RosterItem icon={Zap} label="Work Order" value={roster.task_notes} />
                            <RosterItem icon={LayoutDashboard} label="Compliance" value="10-Hour Standard Applied" />
                        </div>

                        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(176,141,87,0.05)', borderRadius: '15px', border: '1px dashed rgba(176,141,87,0.2)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Employee must log a minimum of 9.5 hours to satisfy the industrial performance metric. Breaks are calculated automatically.
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(176,141,87,0.05), transparent)' }}>
                        <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '2px', marginBottom: '15px' }}>SYSTEM ANALYTICS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ padding: '15px', background: 'var(--input-bg)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Load Balance</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Optimal</div>
                            </div>
                            <div style={{ padding: '15px', background: 'var(--input-bg)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OT Projected</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>1.2 hrs</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
            <style>{`
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .glass-card { border: 1px solid #eee !important; box-shadow: none !important; background: #fff !important; color: #000 !important; }
                    button, .nav-action-btn, .pulse-anim, header > div:last-child { display: none !important; }
                    h1 { color: #b08d57 !important; }
                    div[style*="grid"] { display: block !important; }
                    .glass-card { margin-bottom: 20px !important; page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

const RosterItem = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '3px' }}>
            <Icon size={16} color="#b08d57" />
        </div>
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>{value}</div>
        </div>
    </div>
);

export default AttendanceList;
