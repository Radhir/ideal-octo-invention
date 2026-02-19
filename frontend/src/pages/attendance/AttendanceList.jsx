import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import {
    UserCheck, Clock, CheckCircle2, AlertCircle,
    Calendar, Play, Square, Timer,
    Zap, Activity, LayoutDashboard, Printer, User
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

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

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--gold)' }}>
                Synchronizing Personnel Nodes...
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="Workforce Logistics / Attendance Hub">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle
                    subtitle="Live monitoring of the 10-hour industrial shift lifecycle"
                >
                    Attendance Hub
                </PortfolioTitle>
                <PortfolioButton variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Printer size={18} /> Print Logs
                </PortfolioButton>
            </div>

            <PortfolioGrid columns="minmax(400px, 1fr) 450px">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Live Tracking Card */}
                    <PortfolioCard style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: attendance && !attendance.check_out_time ? '#10b981' : 'rgba(232, 230, 227, 0.4)' }}>
                                <Activity size={16} className={attendance && !attendance.clock_out ? 'pulse-anim' : ''} />
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px' }}>
                                    {attendance && !attendance.check_out_time ? 'SESSION ACTIVE' : 'NO ACTIVE SESSION'}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '800', marginBottom: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>Current Session</div>
                            <div style={{
                                fontSize: '6rem',
                                fontWeight: '900',
                                color: 'var(--cream)',
                                fontFamily: 'monospace',
                                letterSpacing: '-4px',
                                lineHeight: '1'
                            }}>
                                {attendance && !attendance.check_out_time ? elapsedTime : attendance?.check_out_time ? `${attendance.total_hours} hrs` : '00:00:00'}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '6px', background: 'rgba(232, 230, 227, 0.1)', borderRadius: '3px', position: 'relative', marginBottom: '25px' }}>
                            <div style={{
                                height: '100%',
                                width: `${getWorkProgress()}%`,
                                background: 'linear-gradient(to right, var(--gold), #fff)',
                                borderRadius: '3px',
                                boxShadow: '0 0 20px rgba(176,141,87,0.4)',
                                transition: 'width 1s ease-in-out'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                            <span>SHIFT START</span>
                            <span>10 HOUR TARGET</span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
                            {!attendance || !attendance.check_in_time ? (
                                <PortfolioButton
                                    variant="gold"
                                    onClick={handleClockIn}
                                    style={{ flex: 1, height: '60px', borderRadius: '15px', justifyContent: 'center', fontSize: '13px' }}
                                >
                                    <Play size={18} style={{ marginRight: '10px' }} /> INITIATE SHIFT
                                </PortfolioButton>
                            ) : !attendance.check_out_time ? (
                                <button
                                    onClick={handleClockOut}
                                    style={{
                                        flex: 1,
                                        height: '60px',
                                        borderRadius: '15px',
                                        background: 'rgba(244,63,94,0.1)',
                                        border: '1px solid #f43f5e',
                                        color: 'var(--cream)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        letterSpacing: '1px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Square size={18} /> TERMINATE SHIFT
                                </button>
                            ) : (
                                <div style={{ flex: 1, padding: '20px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '15px', textAlign: 'center', fontWeight: '800', letterSpacing: '1px', fontSize: '13px' }}>
                                    DAILY CYCLE COMPLETED
                                </div>
                            )}
                        </div>
                    </PortfolioCard>

                    {/* Today's Logs */}
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--cream)', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Today's Fleet Status</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {allLogs.map(log => (
                                <PortfolioCard key={log.id} style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10, 10, 10, 0.6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(232, 230, 227, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={20} color="var(--gold)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '15px' }}>{log.employee_name}</div>
                                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '4px' }}>Shift active since {log.check_in_time}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: log.clock_out ? '#10b981' : '#f59e0b', letterSpacing: '1px' }}>
                                            {log.check_out_time ? 'COMPLETED' : 'IN PROGRESS'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '4px' }}>{log.total_hours} hrs logged</div>
                                    </div>
                                </PortfolioCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Roster Context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <Calendar size={20} color="var(--gold)" />
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Roster</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <RosterItem icon={Timer} label="Shift Window" value={`${new Date(roster?.shift_start || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(roster?.shift_end || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                            <RosterItem icon={Zap} label="Work Order" value={roster?.task_notes || 'Standard Shift'} />
                            <RosterItem icon={LayoutDashboard} label="Compliance" value="10-Hour Standard Applied" />
                        </div>

                        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(176,141,87,0.1)', borderRadius: '15px', border: '1px dashed rgba(176,141,87,0.3)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--gold)', lineHeight: '1.6', textAlign: 'center' }}>
                                Employee must log a minimum of 9.5 hours to satisfy the industrial performance metric. Breaks are calculated automatically.
                            </div>
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ background: 'linear-gradient(135deg, rgba(176,141,87,0.1), transparent)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>System Analytics</div>
                        <PortfolioGrid columns="1fr 1fr" gap="15px">
                            <div style={{ padding: '20px', background: 'rgba(10, 10, 10, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Load Balance</div>
                                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)' }}>Optimal</div>
                            </div>
                            <div style={{ padding: '20px', background: 'rgba(10, 10, 10, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>OT Projected</div>
                                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)' }}>1.2 hrs</div>
                            </div>
                        </PortfolioGrid>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>

        </PortfolioPage>
    );
};

const RosterItem = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '3px', padding: '8px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '8px' }}>
            <Icon size={16} color="var(--gold)" />
        </div>
        <div>
            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--cream)', marginTop: '4px' }}>{value}</div>
        </div>
    </div>
);

export default AttendanceList;
