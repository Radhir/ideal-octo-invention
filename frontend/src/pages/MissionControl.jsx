import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BentoCard from '../components/BentoCard';
import GlassCard from '../components/GlassCard';
import {
    Shield, BarChart, Users,
    ArrowRight, Calendar as CalendarIcon,
    PlusCircle, Clock, CreditCard, Truck,
    UserCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MissionControl = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [stats, setStats] = useState({ bookings: 0, deliveries: 0, payments: 'AED 0', activeJobs: 0, totalStaff: 0, revenue: 'AED 0' });
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        fetchLiveData();
    }, []);

    const fetchLiveData = async () => {
        try {
            const [jobsRes, bookingsRes, invoicesRes] = await Promise.all([
                api.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                api.get('/forms/bookings/api/list/').catch(() => ({ data: [] })),
                api.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
            ]);

            const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || [];
            const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.results || [];
            const invoices = Array.isArray(invoicesRes.data) ? invoicesRes.data : invoicesRes.data.results || [];

            const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
            const deliveryJobs = jobs.filter(j => j.status === 'DELIVERY');
            const paidInvoices = invoices.filter(i => i.payment_status === 'PAID');
            const totalRev = paidInvoices.reduce((sum, i) => sum + (parseFloat(i.grand_total) || 0), 0);

            // Build event log from recent jobs
            const recent = jobs.slice(0, 5).map((j, idx) => ({
                id: j.id || idx,
                time: j.created_at ? new Date(j.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--',
                activity: `${j.job_card_number || 'JC'} - ${j.customer_name || 'Customer'} (${j.status_display || j.status})`
            }));
            setRecentJobs(recent);

            setStats({
                bookings: bookings.length,
                deliveries: deliveryJobs.length,
                payments: `AED ${totalRev.toLocaleString()}`,
                activeJobs: activeJobs.length,
                totalStaff: jobs.length,
                revenue: `AED ${totalRev.toLocaleString()}`
            });
        } catch (err) {
            console.error('Mission control data fetch failed', err);
        }
    };

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth, currentYear);
        const startDay = firstDayOfMonth(currentMonth, currentYear);

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} style={{ width: '100%', aspectRatio: '1', opacity: 0.1 }} />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            const isSelected = d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

            days.push(
                <div
                    key={d}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, d))}
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: isSelected ? '800' : '500',
                        color: isSelected ? '#fff' : '#94a3b8',
                        background: isSelected ? 'rgba(176, 141, 87, 0.4)' : isToday ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: isSelected ? '1px solid rgba(176, 141, 87, 0.6)' : isToday ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseOut={(e) => !isSelected && (e.currentTarget.style.background = isToday ? 'rgba(255,255,255,0.05)' : 'transparent')}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bento-section" style={{ padding: '40px 20px', minHeight: '100vh', background: '#0a0a0a' }}>
            <header style={{ marginBottom: '40px', paddingLeft: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ color: '#b08d57', fontWeight: '900', letterSpacing: '4px', fontSize: '12px', marginBottom: '10px' }}>MISSION CONTROL</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Systems Overview</h1>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <button
                        onClick={() => navigate('/job-cards/create')}
                        style={{
                            background: 'rgba(176, 141, 87, 0.15)',
                            border: '1px solid rgba(176, 141, 87, 0.4)',
                            color: '#fff',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(176, 141, 87, 0.3)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(176, 141, 87, 0.15)'}
                    >
                        <PlusCircle size={18} /> Create Job Card
                    </button>
                    <button
                        onClick={() => navigate('/hr/attendance')}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                        <UserCheck size={18} color="#10b981" /> Attendance
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 400px', gap: '25px', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

                    {/* Operational Calendar Bento */}
                    <BentoCard
                        span={2}
                        rows={2}
                        label="Operational Cycle"
                        title="Master Schedule"
                        description=""
                        icon={CalendarIcon}
                    >
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{monthNames[currentMonth]} {currentYear}</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ChevronLeft onClick={handlePrevMonth} style={{ cursor: 'pointer', opacity: 0.5 }} size={20} />
                                    <ChevronRight onClick={handleNextMonth} style={{ cursor: 'pointer', opacity: 0.5 }} size={20} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <div key={`day-${i}`} style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', marginBottom: '10px' }}>{d}</div>
                                ))}
                                {renderCalendar()}
                            </div>
                        </div>
                    </BentoCard>

                    {/* Financial Summary Bento */}
                    <BentoCard
                        label="Finance"
                        title="Revenue Engine"
                        description={stats.revenue}
                        icon={BarChart}
                    />

                    {/* Security Bento */}
                    <BentoCard
                        label="Security"
                        title="Active Defense"
                        description="JWT Encrypted"
                        icon={Shield}
                    />

                    {/* Staffing Bento */}
                    <BentoCard
                        label="Active Jobs"
                        title="Workshop Load"
                        description={`${stats.activeJobs} Active`}
                        icon={Users}
                    />
                </div>

                {/* Right Panel: Daily Operational Snapshot */}
                <GlassCard style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <div className="pulse-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
                            <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '2px' }}>DAILY SNAPSHOT</div>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>{selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <SnapshotItem icon={CalendarIcon} label="Active Jobs" value={stats.activeJobs} color="#3b82f6" />
                        <SnapshotItem icon={Clock} label="Bookings" value={stats.bookings} color="#f59e0b" />
                        <SnapshotItem icon={Truck} label="Deliveries" value={stats.deliveries} color="#10b981" />
                        <SnapshotItem icon={CreditCard} label="Revenue" value={stats.payments} color="#ec4899" />
                    </div>

                    <div style={{ flex: 1, marginTop: '10px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Workshop View</h4>
                            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div className="pulse-dot" style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} /> REAL-TIME
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px', padding: '10px 15px', fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <span>Time</span>
                                <span>Unit / Customer</span>
                                <span style={{ textAlign: 'right' }}>Status</span>
                            </div>
                            {recentJobs.length > 0 ? recentJobs.map(s => {
                                const [jc, cust, statusRaw] = s.activity.split(' - ');
                                const status = statusRaw?.replace(/[()]/g, '') || 'ACTIVE';

                                return (
                                    <div key={s.id} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '80px 1fr 100px',
                                        alignItems: 'center',
                                        padding: '14px 15px',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        transition: 'all 0.3s'
                                    }}>
                                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>{s.time}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{jc}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{cust}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '900',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: status === 'CLOSED' ? 'rgba(255,255,255,0.05)' : 'rgba(176,141,87,0.1)',
                                                color: status === 'CLOSED' ? '#64748b' : '#b08d57',
                                                border: `1px solid ${status === 'CLOSED' ? 'rgba(255,255,255,0.1)' : 'rgba(176,141,87,0.2)'}`
                                            }}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                                    No units currently in shop
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            border: '1px solid #392e4e',
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                        }}
                    >
                        Back to Core Dashboard <ArrowRight size={16} />
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

const SnapshotItem = ({ icon: Icon, label, value, color }) => (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Icon size={18} color={color} style={{ marginBottom: '10px' }} />
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>{value}</div>
    </div>
);

export default MissionControl;
