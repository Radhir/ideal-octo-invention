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
            const empRes = await api.get('/hr/api/employees/');
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get(`/forms/attendance/api/records/?date=${selectedDate}`);
            setLogs(res.data);

            if (selectedDate === new Date().toISOString().split('T')[0]) {
                const todayRes = await api.get('/forms/attendance/api/today/');
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
            await api.post('/forms/attendance/api/check-in/');
            setStatus('CHECKED_IN');
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/forms/attendance/api/check-out/');
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
        <PortfolioPage breadcrumb="Human Resources">
            <PortfolioTitle subtitle="Real-time workforce tracking and time management">
                ATTENDANCE
            </PortfolioTitle>

            <div style={{ marginBottom: '60px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                        padding: '15px 20px',
                        background: 'transparent',
                        border: '1px solid rgba(232, 230, 227, 0.3)',
                        borderRadius: '10px',
                        color: 'var(--cream)',
                        fontSize: '15px',
                        fontFamily: 'inherit'
                    }}
                />
                {status === 'NOT_CHECKED_IN' && selectedDate === new Date().toISOString().split('T')[0] && (
                    <PortfolioButton onClick={handleCheckIn}>
                        <UserCheck size={18} style={{ display: 'inline', marginRight: '8px', marginBottom: '-3px' }} />
                        Clock In
                    </PortfolioButton>
                )}
                {status === 'CHECKED_IN' && (
                    <PortfolioButton variant="secondary" onClick={handleCheckOut}>
                        <Zap size={18} style={{ display: 'inline', marginRight: '8px', marginBottom: '-3px' }} />
                        Clock Out
                    </PortfolioButton>
                )}
            </div>

            <PortfolioStats stats={[
                { value: employees.length, label: 'TOTAL STAFF' },
                { value: activeCount, label: 'CURRENTLY IN', color: '#10b981' },
                { value: completedCount, label: 'COMPLETED', color: 'var(--cream)' },
                { value: missingCount, label: 'NOT LOGGED', color: missingCount > 0 ? '#ef4444' : 'var(--cream)' }
            ]} />

            <PortfolioGrid>
                {employees.map(emp => {
                    const log = logs.find(l => l.employee === emp.id);
                    const empStatus = log ? (log.check_out_time ? 'OUT' : 'IN') : 'MISSING';

                    return (
                        <div
                            key={emp.id}
                            style={{
                                padding: '30px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                border: `1.5px solid ${empStatus === 'IN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(232, 230, 227, 0.1)'}`,
                                borderRadius: '20px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                        {emp.full_name}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.5 }}>
                                        {emp.employee_id} • {emp.role}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '6px 15px',
                                    background: empStatus === 'IN' ? 'rgba(16, 185, 129, 0.1)' : empStatus === 'OUT' ? 'rgba(232, 230, 227, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: empStatus === 'IN' ? '#10b981' : empStatus === 'OUT' ? 'var(--cream)' : '#ef4444',
                                    borderRadius: '50px',
                                    fontSize: '11px',
                                    fontWeight: '500'
                                }}>
                                    {empStatus}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '5px', letterSpacing: '1px' }}>
                                        CLOCK IN
                                    </div>
                                    <div style={{ fontSize: '16px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                        {log?.check_in_time || '--:--'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '5px', letterSpacing: '1px' }}>
                                        CLOCK OUT
                                    </div>
                                    <div style={{ fontSize: '16px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                        {log?.check_out_time || '--:--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </PortfolioGrid>
        </PortfolioPage>
    );
};

export default AttendanceBoard;
