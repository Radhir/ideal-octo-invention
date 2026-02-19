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
        { label: 'Active Jobs', value: stats.active_jobs || 0, subvalue: 'WORKSHOP QUEUE', icon: CarRepair, color: 'var(--gold)' },
        { label: 'Total Services', value: stats.total_jobs || 0, subvalue: 'LIFETIME HISTORY', icon: HistoryIcon, color: '#3b82f6' },
        { label: 'Total Value', value: `$${(stats.total_spent || 0).toLocaleString()}`, subvalue: 'CUMULATIVE INVESTMENT', icon: Receipt, color: '#10b981' },
        { label: 'Warranties', value: stats.warranties_active || 0, subvalue: 'ACTIVE PROTECTION', icon: StarIcon, color: '#c084fc' }
    ];

    return (
        <PortfolioPage breadcrumb={`MEMBER ACCESS / ${customer?.name.toUpperCase()}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle={`Strategic partner since ${new Date(customer?.member_since).toLocaleDateString([], { month: 'long', year: 'numeric' })}`}>
                    Welcome, {customer?.name}
                </PortfolioTitle>
                <div style={{ textAlign: 'right', padding: '15px 25px', background: 'rgba(176,141,87,0.05)', borderRadius: '16px', border: '1px solid rgba(176,141,87,0.1)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>LOYALTY BALANCE</div>
                    <div style={{ fontSize: '42px', fontWeight: '100', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        {customer?.loyalty_points}
                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px' }}>PTS</span>
                    </div>
                </div>
            </div>

            <PortfolioStats stats={kpiData} />

            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '60px',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.05)'
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
                            padding: '12px 30px',
                            background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                            border: 'none',
                            color: activeTab === tab.id ? '#000' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '10px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 10px 20px rgba(176,141,87,0.2)' : 'none'
                        }}
                    >
                        <tab.icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ minHeight: '400px' }}>
                {activeTab === 'jobs' && <JobList jobs={jobs} navigate={navigate} />}
                {activeTab === 'invoices' && <InvoiceList invoices={invoices} navigate={navigate} />}
                {activeTab === 'booking' && (
                    <div style={{
                        padding: '100px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '32px',
                        border: '1px solid rgba(176,141,87,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div className="telemetry-grid" />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Schedule size={48} strokeWidth={1} style={{ marginBottom: '20px', color: 'var(--gold)', opacity: 0.5 }} />
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: '300', fontSize: '28px', color: 'var(--cream)', marginBottom: '10px' }}>Advanced Reservation</h3>
                            <p style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                                The online booking system is currently undergoing deep-cycle optimization for high-performance scheduling.
                            </p>
                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                                <div className="status-pulse active" style={{ background: 'var(--gold)' }} />
                                <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>CALIBRATING PARAMETERS</span>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'memberships' && <MembershipTab customerId={customer?.id} />}
            </div>
        </PortfolioPage>
    );
};

const JobList = ({ jobs, navigate }) => (
    <PortfolioGrid columns="1fr">
        {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)' }}>
                NO ACTIVE SERVICE CYCLES DETECTED.
            </div>
        ) : (
            jobs.map((job) => (
                <PortfolioCard
                    key={job.id}
                    onClick={() => navigate(`/portal/jobs/${job.id}`)}
                    style={{
                        padding: '30px 40px',
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: '0.8fr 2fr 1.2fr 1fr 0.5fr',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    }}
                    className="workflow-card"
                >
                    <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', fontFamily: 'monospace' }}>
                        #{job.job_number}
                    </div>
                    <div>
                        <div style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                            {job.vehicle_details?.make} {job.vehicle_details?.model}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.5 }} />
                            <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                                REG // {job.registration_number?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style={{
                            fontSize: '9px', fontWeight: '900',
                            color: '#3b82f6',
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '8px 16px', borderRadius: '20px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: 'fit-content'
                        }}>
                            <div className="status-pulse active" style={{ background: '#3b82f6', width: '6px', height: '6px' }} />
                            {job.current_status_display.toUpperCase()}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '100', fontFamily: 'var(--font-serif)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--gold)', marginRight: '6px', fontWeight: '900' }}>AED</span>
                            {parseFloat(job.total_estimated_cost || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.2)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginTop: '4px' }}>VALUATION</div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                        <ArrowRightCircle size={22} color="var(--gold)" style={{ opacity: 0.3 }} />
                    </div>
                </PortfolioCard>
            ))
        )}
    </PortfolioGrid>
);

const InvoiceList = ({ invoices, navigate }) => (
    <PortfolioGrid columns="1fr">
        {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)' }}>
                NO FINANCIAL RECORDS FOUND.
            </div>
        ) : (
            invoices.map((invoice) => (
                <PortfolioCard
                    key={invoice.id}
                    style={{
                        padding: '30px 40px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr 1.2fr 1fr',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    }}
                    className="workflow-card"
                >
                    <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', fontFamily: 'monospace' }}>
                        #{invoice.invoice_number}
                    </div>
                    <div>
                        <div style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                            {new Date(invoice.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginTop: '6px' }}>
                            TRANSACTION LOGGED
                        </div>
                    </div>
                    <div>
                        <span style={{
                            fontSize: '9px', fontWeight: '900',
                            color: invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                            background: invoice.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            padding: '8px 16px', borderRadius: '20px',
                            border: `1px solid ${invoice.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: 'fit-content'
                        }}>
                            <div className={`status-pulse ${invoice.payment_status !== 'PAID' ? 'active' : ''}`} style={{ background: invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b', width: '6px', height: '6px' }} />
                            {invoice.payment_status}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '100', fontFamily: 'var(--font-serif)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--gold)', marginRight: '6px', fontWeight: '900' }}>AED</span>
                            {parseFloat(invoice.total_amount).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.2)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginTop: '4px' }}>SETTLEMENT VALUE</div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                        {invoice.payment_status === 'PENDING' ? (
                            <PortfolioButton
                                variant="gold"
                                onClick={() => navigate(`/payment/${invoice.id}`)}
                                style={{ height: '48px', fontSize: '10px', padding: '0 20px', borderRadius: '12px' }}
                            >
                                <CreditCard size={16} style={{ marginRight: '10px' }} /> SETTLE NOW
                            </PortfolioButton>
                        ) : (
                            <PortfolioButton
                                variant="secondary"
                                onClick={() => navigate(`/portal/invoices/${invoice.id}`)}
                                style={{ height: '48px', width: '48px', padding: 0, borderRadius: '12px' }}
                            >
                                <ArrowRightCircle size={20} color="var(--gold)" style={{ opacity: 0.5 }} />
                            </PortfolioButton>
                        )}
                    </div>
                </PortfolioCard>
            ))
        )}
    </PortfolioGrid>
);

export default CustomerPortal;
