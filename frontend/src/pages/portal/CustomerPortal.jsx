import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
    Wrench as CarRepair,
    ReceiptText as Receipt,
    History as HistoryIcon,
    Star as StarIcon,
    Calendar as Schedule,
    ArrowRightCircle,
    CheckCircle2,
    AlertCircle,
    Clock,
    CreditCard
} from 'lucide-react';
import MembershipTab from '../../components/portal/MembershipTab';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

const CustomerPortal = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (token) verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await api.post('/customer-portal/portal/verify_token/', {
                token: token
            });
            setCustomer(response.data);
            loadDashboardData(response.data.id);
        } catch (err) {
            setError('Invalid or expired access link. Please request a new one.');
            setLoading(false);
        }
    };

    const loadDashboardData = async (customerId) => {
        try {
            const [jobsRes, invoicesRes, statsRes] = await Promise.all([
                api.get(`/customer-portal/my-jobs/?customer_id=${customerId}`),
                api.get(`/customer-portal/invoices/?customer_id=${customerId}`),
                api.get(`/customer-portal/portal/dashboard_stats/?customer_id=${customerId}`)
            ]);

            setJobs(jobsRes.data.results || jobsRes.data);
            setInvoices(invoicesRes.data.results || invoicesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PortfolioPage breadcrumb="SECURE ACCESS / INITIALIZING">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                    <div className="portfolio-spinner"></div>
                    <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800' }}>RECOVERING PROTOCOLS...</p>
                </div>

            </PortfolioPage>
        );
    }

    if (error) {
        return (
            <PortfolioPage breadcrumb="SECURE ACCESS / DENIED">
                <div style={{ padding: '100px 50px', textAlign: 'center', color: '#f43f5e' }}>
                    <AlertCircle size={48} strokeWidth={1} style={{ marginBottom: '30px', opacity: 0.5 }} />
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: '300', fontSize: '32px', color: 'var(--cream)', marginBottom: '20px' }}>Access Revoked</h2>
                    <p style={{ color: 'rgba(232, 230, 227, 0.4)', maxWidth: '400px', margin: '0 auto 40px auto' }}>{error}</p>
                    <PortfolioButton onClick={() => navigate('/portal/request-access')} variant="primary">
                        REQUEST NEW LINK
                    </PortfolioButton>
                </div>
            </PortfolioPage>
        );
    }

    const kpiData = [
        { label: 'ACTIVE.jobs', value: stats.active_jobs || 0, subvalue: 'WORKSHOP QUEUE', icon: CarRepair, color: 'var(--gold)' },
        { label: 'TOTAL.services', value: stats.total_jobs || 0, subvalue: 'LIFETIME HISTORY', icon: HistoryIcon, color: '#3b82f6' },
        { label: 'TOTAL.investment', value: `${(stats.total_spent || 0).toLocaleString()} AED`, subvalue: 'CUMULATIVE VALUE', icon: Receipt, color: '#10b981' },
        { label: 'WARRANTY.active', value: stats.warranties_active || 0, subvalue: 'PROTECTION NODES', icon: StarIcon, color: '#c084fc' }
    ];

    return (
        <PortfolioPage breadcrumb={`MEMBER ACCESS // ${customer?.name?.toUpperCase()}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle={`Strategic partner since ${new Date(customer?.member_since).toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase()}`}>
                    Welcome,<br />{customer?.name}
                </PortfolioTitle>
                <div style={{
                    textAlign: 'right',
                    padding: '30px 40px',
                    background: 'rgba(176,141,87,0.03)',
                    borderRadius: '24px',
                    border: '1px solid rgba(176,141,87,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '3px', marginBottom: '12px' }}>LOYALTY BALANCE</div>
                    <div style={{
                        fontSize: '56px', fontWeight: '100', color: 'var(--cream)',
                        fontFamily: 'var(--font-serif)', lineHeight: 1, display: 'flex',
                        alignItems: 'baseline', gap: '12px', justifyContent: 'flex-end',
                        textShadow: '0 0 30px rgba(176,141,87,0.3)'
                    }}>
                        {customer?.loyalty_points}
                        <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '2px' }}>PTS</span>
                    </div>
                </div>
            </div>

            <PortfolioStats stats={kpiData} />

            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '60px',
                padding: '8px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)'
            }}>
                {[
                    { id: 'jobs', label: 'SERVICES', icon: CarRepair },
                    { id: 'invoices', label: 'FINANCE', icon: Receipt },
                    { id: 'booking', label: 'RESERVE', icon: Schedule },
                    { id: 'memberships', label: 'PRIVILEGES', icon: StarIcon }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 28px',
                            background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                            border: 'none',
                            color: activeTab === tab.id ? '#000' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '10px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            borderRadius: '12px',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: activeTab === tab.id ? '0 10px 30px rgba(176,141,87,0.3)' : 'none'
                        }}
                    >
                        <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ minHeight: '400px' }}>
                {activeTab === 'jobs' && <JobList jobs={jobs} navigate={navigate} />}
                {activeTab === 'invoices' && <InvoiceList invoices={invoices} navigate={navigate} />}
                {activeTab === 'booking' && (
                    <div style={{
                        padding: '120px 60px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.01)',
                        borderRadius: '40px',
                        border: '1px solid rgba(176,141,87,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div className="telemetry-grid" style={{ opacity: 0.1 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Schedule size={48} strokeWidth={1} style={{ marginBottom: '30px', color: 'var(--gold)', opacity: 0.4 }} />
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: '300', fontSize: '32px', color: 'var(--cream)', marginBottom: '15px' }}>Advanced Reservation</h3>
                            <p style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '15px', maxWidth: '450px', margin: '0 auto', lineHeight: '1.6' }}>
                                The online booking system is currently undergoing deep-cycle optimization for high-performance scheduling.
                            </p>
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                                <div className="status-pulse active" style={{ background: 'var(--gold)' }} />
                                <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '3px' }}>CALIBRATING PARAMETERS</span>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'memberships' && <MembershipTab customerId={customer?.id} />}
            </div>
        </PortfolioPage>
    );
};

const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s.includes('closed') || s.includes('paid')) return '#10b981';
    if (s.includes('estimation') || s.includes('pending')) return '#f59e0b';
    if (s.includes('wip') || s.includes('assignment')) return '#3b82f6';
    return 'var(--gold)';
};

const JobList = ({ jobs, navigate }) => (
    <PortfolioGrid columns="1fr" gap="20px">
        {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(232,230,227,0.2)', background: 'rgba(232,230,227,0.01)', borderRadius: '40px', border: '1px dashed rgba(232,230,227,0.05)', letterSpacing: '2px', fontSize: '11px', fontWeight: '900' }}>
                NO ACTIVE SERVICE CYCLES DETECTED.
            </div>
        ) : (
            jobs.map((job) => {
                const statusColor = getStatusColor(job.status);
                return (
                    <PortfolioCard
                        key={job.id}
                        onClick={() => navigate(`/portal/jobs/${job.id}`)}
                        style={{
                            padding: '35px 45px',
                            cursor: 'pointer',
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 2.5fr 1.5fr 1.2fr 0.5fr',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        className="workflow-card"
                    >
                        <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', fontFamily: 'monospace' }}>
                            #{job.job_number}
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                                {job.vehicle_details?.make} {job.vehicle_details?.model}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.4 }} />
                                <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                                    PLATE // {job.registration_number?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span style={{
                                fontSize: '10px', fontWeight: '900',
                                color: statusColor,
                                background: `${statusColor}11`,
                                padding: '10px 20px', borderRadius: '30px',
                                border: `1px solid ${statusColor}33`,
                                letterSpacing: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: 'fit-content'
                            }}>
                                <div className="status-pulse active" style={{ background: statusColor, width: '6px', height: '6px' }} />
                                {job.current_status_display?.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '100', fontFamily: 'var(--font-serif)' }}>
                                <span style={{ fontSize: '12px', color: 'var(--gold)', marginRight: '8px', fontWeight: '900' }}>AED</span>
                                {parseFloat(job.total_estimated_cost || 0).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.2)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', marginTop: '6px' }}>ESTIMATED TOTAL</div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                            <ArrowRightCircle size={24} color="var(--gold)" style={{ opacity: 0.2 }} />
                        </div>
                    </PortfolioCard>
                );
            })
        )}
    </PortfolioGrid>
);

const InvoiceList = ({ invoices, navigate }) => (
    <PortfolioGrid columns="1fr" gap="20px">
        {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(232,230,227,0.2)', background: 'rgba(232,230,227,0.01)', borderRadius: '40px', border: '1px dashed rgba(232,230,227,0.05)', letterSpacing: '2px', fontSize: '11px', fontWeight: '900' }}>
                NO FINANCIAL RECORDS FOUND.
            </div>
        ) : (
            invoices.map((invoice) => {
                const isPaid = invoice.payment_status?.toUpperCase() === 'PAID';
                const statusColor = isPaid ? '#10b981' : '#f59e0b';

                return (
                    <PortfolioCard
                        key={invoice.id}
                        style={{
                            padding: '35px 45px',
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 2fr 1.5fr 1.5fr 1.2fr',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            transition: 'all 0.3s ease'
                        }}
                        className="workflow-card"
                    >
                        <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', fontFamily: 'monospace' }}>
                            #{invoice.invoice_number}
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                                {new Date(invoice.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                            </div>
                            <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', marginTop: '6px' }}>
                                SETTLEMENT REGISTERED
                            </div>
                        </div>
                        <div>
                            <span style={{
                                fontSize: '10px', fontWeight: '900',
                                color: statusColor,
                                background: `${statusColor}11`,
                                padding: '10px 20px', borderRadius: '30px',
                                border: `1px solid ${statusColor}33`,
                                letterSpacing: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: 'fit-content'
                            }}>
                                <div className={`status-pulse ${!isPaid ? 'active' : ''}`} style={{ background: statusColor, width: '6px', height: '6px' }} />
                                {invoice.payment_status?.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '26px', color: 'var(--cream)', fontWeight: '100', fontFamily: 'var(--font-serif)' }}>
                                <span style={{ fontSize: '12px', color: 'var(--gold)', marginRight: '8px', fontWeight: '900' }}>AED</span>
                                {parseFloat(invoice.total_amount).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.2)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', marginTop: '6px' }}>SETTLEMENT VALUE</div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                            {!isPaid ? (
                                <PortfolioButton
                                    variant="gold"
                                    onClick={() => navigate(`/payment/${invoice.id}`)}
                                    style={{ height: '54px', fontSize: '11px', padding: '0 25px', borderRadius: '14px', fontWeight: '900' }}
                                >
                                    <CreditCard size={18} style={{ marginRight: '12px' }} /> SETTLE NOW
                                </PortfolioButton>
                            ) : (
                                <PortfolioButton
                                    variant="secondary"
                                    onClick={() => navigate(`/portal/invoices/${invoice.id}`)}
                                    style={{ height: '54px', width: '54px', padding: 0, borderRadius: '14px', border: '1px solid rgba(176,141,87,0.2)' }}
                                >
                                    <ArrowRightCircle size={22} color="var(--gold)" style={{ opacity: 0.5 }} />
                                </PortfolioButton>
                            )}
                        </div>
                    </PortfolioCard>
                );
            })
        )}
    </PortfolioGrid>
);

export default CustomerPortal;
