import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton
} from '../components/PortfolioComponents';
import {
    Shield, BarChart, Users,
    ArrowRight, Calendar as CalendarIcon,
    PlusCircle, Clock, CreditCard, Truck,
    UserCheck, ChevronLeft, ChevronRight, Activity, Zap, Cpu, Global, Target
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
                activity: `${j.job_card_number || 'JC'} - ${j.customer_name || 'Customer'}`,
                status: j.status
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

    return (
        <PortfolioPage breadcrumb="SYSTEMS // MISSION CONTROL">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Strategic orchestration of enterprise vectors and operational rhythm.">
                    Operations<br />Center
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <PortfolioButton variant="glass" onClick={() => navigate('/job-cards/create')}>
                        <PlusCircle size={16} /> NEW OPERATIONALjc
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/hr/attendance')}>
                        <UserCheck size={16} /> ATTENDANCE.log
                    </PortfolioButton>
                </div>
            </header>

            <PortfolioGrid columns="2.2fr 1.2fr" gap="40px">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <BentoBox title="Revenue Stream" subtitle="MTD INVOICED" value={stats.revenue} icon={BarChart} trend="+12.4%" />
                        <BentoBox title="Strategic Load" subtitle="ACTIVE UNITS" value={`${stats.activeJobs} Units`} icon={Zap} trend="Optimal" />
                    </div>

                    {/* Operational Calendar */}
                    <PortfolioCard style={{ padding: '35px', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(176,141,87,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CalendarIcon size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>OPERATIONAL RHYTHM</div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>Master Schedule</h3>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '2px' }}>{monthNames[currentMonth].toUpperCase()} {currentYear}</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handlePrevMonth} style={navBtnStyle}><ChevronLeft size={18} /></button>
                                    <button onClick={handleNextMonth} style={navBtnStyle}><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        </div>

                        <div className="telemetry-grid" style={{ height: '300px', marginBottom: '-300px', opacity: 0.1 }} />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center' }}>
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                                <div key={`day-${i}`} style={{ fontSize: '9px', fontWeight: '900', color: 'var(--gold)', opacity: 0.4, marginBottom: '15px', letterSpacing: '1px' }}>{d}</div>
                            ))}
                            {(() => {
                                const days = [];
                                const totalDays = daysInMonth(currentMonth, currentYear);
                                const startDay = firstDayOfMonth(currentMonth, currentYear);

                                for (let i = 0; i < startDay; i++) {
                                    days.push(<div key={`empty-${i}`} style={{ width: '100%', aspectRatio: '1.2' }} />);
                                }

                                for (let d = 1; d <= totalDays; d++) {
                                    const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                                    const isSelected = d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

                                    days.push(
                                        <div
                                            key={d}
                                            onClick={() => setSelectedDate(new Date(currentYear, currentMonth, d))}
                                            style={{
                                                width: '100%', aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '12px', cursor: 'pointer', fontSize: '13px',
                                                fontWeight: isSelected ? '900' : '300',
                                                color: isSelected ? '#000' : 'var(--cream)',
                                                background: isSelected ? 'var(--gold)' : isToday ? 'rgba(176,141,87,0.1)' : 'rgba(255,255,255,0.02)',
                                                border: isSelected ? 'none' : isToday ? '1px solid rgba(176,141,87,0.3)' : '1px solid rgba(255,255,255,0.03)',
                                                boxShadow: isSelected ? '0 10px 20px rgba(176,141,87,0.3)' : 'none',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {d < 10 ? `0${d}` : d}
                                        </div>
                                    );
                                }
                                return days;
                            })()}
                        </div>
                    </PortfolioCard>
                </div>

                {/* Right Panel: Daily Operational Snapshot */}
                <PortfolioCard style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px', background: 'rgba(176, 141, 87, 0.02)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <div className="status-pulse" />
                            <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>STRATEGIC SNAPSHOT</div>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                            {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                        </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <SnapshotItem icon={Target} label="Active Units" value={stats.activeJobs} color="var(--gold)" />
                        <SnapshotItem icon={Clock} label="Reservations" value={stats.bookings} color="#f59e0b" />
                        <SnapshotItem icon={Truck} label="Logistics" value={stats.deliveries} color="#10b981" />
                        <SnapshotItem icon={CreditCard} label="Revenue" value={stats.payments} color="#3b82f6" />
                    </div>

                    <div style={{ flex: 1, marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '9px', fontWeight: '900', color: 'var(--gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>Operational Feed</h4>
                            <Activity size={14} color="#10b981" className="pulse" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {recentJobs.length > 0 ? recentJobs.map(s => (
                                <div key={s.id} style={{
                                    display: 'grid', gridTemplateColumns: '70px 1fr auto', alignItems: 'center',
                                    padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--gold)', opacity: 0.5 }}>{s.time}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '300', paddingRight: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.activity}</div>
                                    <div>
                                        <span style={{
                                            fontSize: '8px', fontWeight: '900', padding: '4px 10px', borderRadius: '30px',
                                            background: s.status === 'CLOSED' ? 'rgba(255,255,255,0.05)' : 'rgba(176,141,87,0.1)',
                                            color: s.status === 'CLOSED' ? 'rgba(255,255,255,0.4)' : 'var(--gold)',
                                            border: '1px solid rgba(176,141,87,0.2)'
                                        }}>
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(232, 230, 227, 0.2)', fontSize: '11px', letterSpacing: '1px' }}>
                                    NO LIVE TELEMETRY FOUND
                                </div>
                            )}
                        </div>
                    </div>

                    <PortfolioButton variant="outline" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                        CORE DASHBOARD <ArrowRight size={14} style={{ marginLeft: '10px' }} />
                    </PortfolioButton>
                </PortfolioCard>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

const BentoBox = ({ title, subtitle, value, icon: Icon, trend }) => (
    <PortfolioCard style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.1 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div style={{ width: '45px', height: '45px', background: 'rgba(176,141,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="var(--gold)" />
                </div>
                {trend && (
                    <div style={{ fontSize: '9px', fontWeight: '900', color: trend.includes('+') ? '#10b981' : 'var(--gold)', letterSpacing: '1px', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '20px' }}>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.6 }}>{subtitle}</div>
                <div style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '600', marginBottom: '15px' }}>{title}</div>
                <div style={{ fontSize: '28px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{value}</div>
            </div>
        </div>
    </PortfolioCard>
);

const SnapshotItem = ({ icon: Icon, label, value, color }) => (
    <div style={{
        padding: '20px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5 }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: '300', color: 'var(--cream)', marginTop: '4px', fontFamily: 'var(--font-serif)' }}>{value}</div>
        </div>
    </div>
);

const navBtnStyle = {
    background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '5px'
};

export default MissionControl;
