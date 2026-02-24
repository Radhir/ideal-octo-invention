import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserCheck, UserMinus, Zap, Clock } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioStats, PortfolioButton, PortfolioGrid, PortfolioCard } from '../../components/PortfolioComponents';

const AttendanceBoard = () => {
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('NOT_CHECKED_IN');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!loading) fetchAttendance();
    }, [selectedDate, loading]);

    const fetchInitialData = async () => {
        try {
            const empRes = await api.get('/api/hr/employees/');
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get(`/api/attendance/records/?date=${selectedDate}`);
            setLogs(res.data);

            if (selectedDate === new Date().toISOString().split('T')[0]) {
                const todayRes = await api.get('/api/attendance/today/');
                if (todayRes.data?.id) {
                    setStatus(todayRes.data.check_out_time ? 'CHECKED_OUT' : 'CHECKED_IN');
                } else {
                    setStatus('NOT_CHECKED_IN');
                }
            }
        } catch (err) {
            console.error("Error fetching attendance logs:", err);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/api/attendance/check-in/');
            setStatus('CHECKED_IN');
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/api/attendance/check-out/');
            setStatus('CHECKED_OUT');
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Check-out failed');
        }
    };

    const activeCount = logs.filter(l => !l.check_out_time).length;
    const completedCount = logs.filter(l => l.check_out_time).length;
    const missingCount = employees.length - logs.length;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="HUMAN RESOURCES // PERSONNEL TELEMETRY">
            <PortfolioTitle subtitle="Real-time workforce orchestration, tactical movement tracking, and shift management.">
                Tactical<br />Matrix
            </PortfolioTitle>

            <div style={{ marginBottom: '60px', display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Clock size={16} color="var(--gold)" style={{ position: 'absolute', left: '20px', zIndex: 1, opacity: 0.5 }} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                            padding: '15px 25px 15px 50px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '15px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '1px',
                            outline: 'none',
                            colorScheme: 'dark',
                            width: '240px'
                        }}
                    />
                </div>

                {status === 'NOT_CHECKED_IN' && selectedDate === new Date().toISOString().split('T')[0] && (
                    <PortfolioButton variant="gold" onClick={handleCheckIn}>
                        <UserCheck size={16} /> INITIATE_SESSION.log
                    </PortfolioButton>
                )}
                {status === 'CHECKED_IN' && (
                    <PortfolioButton variant="glass" onClick={handleCheckOut}>
                        <Zap size={16} className="pulse" /> TERMINATE_SESSION.end
                    </PortfolioButton>
                )}
            </div>

            <PortfolioStats stats={[
                { value: employees.length, label: 'TOTAL FORCE', color: 'var(--gold)' },
                { value: activeCount, label: 'ACTIVE OPERATIVES', color: '#10b981' },
                { value: completedCount, label: 'COMPLETED SHIFTS', color: 'var(--gold)' },
                { value: missingCount, label: 'UNACCOUNTED', color: missingCount > 0 ? '#f43f5e' : 'rgba(255,255,255,0.1)' }
            ]} />

            <div style={{ marginTop: '50px' }}>
                <PortfolioGrid>
                    {employees.map(emp => {
                        const log = logs.find(l => l.employee === emp.id);
                        const empStatus = log ? (log.check_out_time ? 'OUT' : 'IN') : 'MISSING';

                        return (
                            <PortfolioCard
                                key={emp.id}
                                style={{
                                    padding: '40px',
                                    background: empStatus === 'IN' ? 'rgba(16, 185, 129, 0.03)' : 'rgba(0,0,0,0.3)',
                                    position: 'relative'
                                }}
                            >
                                <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: '0 0 8px 0', fontWeight: '300' }}>
                                                {emp.full_name}
                                            </h3>
                                            <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', textTransform: 'uppercase' }}>
                                                {emp.role?.toUpperCase()} // {emp.employee_id}
                                            </div>
                                        </div>
                                        {empStatus === 'IN' && (
                                            <div className="status-pulse" />
                                        )}
                                        {empStatus === 'MISSING' && (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                        )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
                                        <div>
                                            <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px', opacity: 0.5 }}>
                                                ENTRY.log
                                            </div>
                                            <div style={{ fontSize: '18px', color: log?.check_in_time ? 'var(--cream)' : 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-serif)', fontWeight: '300' }}>
                                                {log?.check_in_time || 'DEACTIVATED'}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px', opacity: 0.5 }}>
                                                EXIT.log
                                            </div>
                                            <div style={{ fontSize: '18px', color: log?.check_out_time ? 'var(--cream)' : 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-serif)', fontWeight: '300' }}>
                                                {log?.check_out_time || 'DEACTIVATED'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PortfolioCard>
                        );
                    })}
                </PortfolioGrid>
            </div>
        </PortfolioPage>
    );
};

export default AttendanceBoard;
