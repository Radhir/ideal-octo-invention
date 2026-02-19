import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Shield, Clock,
    AlertTriangle, CheckCircle2, FileText,
    TrendingUp, Calendar
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioBackButton,
    PortfolioGrid,
    PortfolioCard,
    PortfolioDetailBox
} from '../../components/PortfolioComponents';

const SLADetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sla, setSla] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSLADetails();
    }, [id]);

    const fetchSLADetails = async () => {
        try {
            setLoading(true);
            const [slaRes, metricsRes, violationsRes] = await Promise.all([
                api.get(`/contracts/sla/api/sla/${id}/`),
                api.get(`/contracts/sla/api/sla/${id}/metrics/`),
                api.get(`/contracts/sla/api/violations/?sla_id=${id}`)
            ]);

            setSla(slaRes.data);
            setMetrics(Array.isArray(metricsRes.data) ? metricsRes.data : [metricsRes.data]);
            setViolations(Array.isArray(violationsRes.data) ? violationsRes.data : violationsRes.data.results || []);
        } catch (err) {
            console.error('Error fetching SLA details', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '900' }}>Synchronizing Agreement Data...</div>
            </div>
        </PortfolioPage>
    );

    if (!sla) return (
        <PortfolioPage>
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Agreement profile not detected.</div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb={`Contracts / SLA / ${sla.agreement_number}`}>
            <PortfolioBackButton onClick={() => navigate('/sla/list')} label="SLA REPOSITORY" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px', marginTop: '40px' }}>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '3px', marginBottom: '15px', textTransform: 'uppercase' }}>
                        ACTIVE PROTOCOL // {sla.agreement_number}
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--cream)',
                        lineHeight: '1',
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        {sla.customer_name || `Entity #${sla.customer}`}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        padding: '10px 25px',
                        borderRadius: '50px',
                        background: sla.is_active ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                        color: sla.is_active ? '#10b981' : '#ef4444',
                        border: `1px solid ${sla.is_active ? '#10b981' : '#ef4444'}20`,
                        fontSize: '11px',
                        fontWeight: '900',
                        letterSpacing: '2px',
                        display: 'inline-block',
                        marginBottom: '15px'
                    }}>
                        {sla.is_active ? 'SERVICE STATUS: OPTIMAL' : 'SERVICE STATUS: SUSPENDED'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '1px' }}>
                        TIER: <span style={{ color: 'var(--gold)', fontWeight: '800' }}>{sla.service_level.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <PortfolioGrid columns="1fr 380px" gap="60px">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* SLA Terms */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <PortfolioDetailBox
                            label="CRITICAL RESPONSE"
                            value={`${sla.emergency_response_time || '--'}HR`}
                            icon={<Clock size={16} color="var(--gold)" />}
                        />
                        <PortfolioDetailBox
                            label="STANDARD RESPONSE"
                            value={`${sla.standard_response_time}HR`}
                            icon={<Clock size={16} color="var(--gold)" />}
                        />
                        <PortfolioDetailBox
                            label="RESOLUTION TARGET"
                            value={`${sla.resolution_time}HR`}
                            icon={<TrendingUp size={16} color="var(--gold)" />}
                        />
                    </div>

                    {/* Performance Metrics */}
                    <PortfolioCard style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '18px', fontWeight: '500', fontFamily: 'var(--font-serif)' }}>Performance Telemetry</h3>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>MONTHLY DRILLDOWN</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {metrics.length > 0 ? metrics.map((m, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                    <div style={{ width: '100px', fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>{m.month?.toUpperCase() || 'CURRENT'}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '700' }}>COMPLIANCE QUOTIENT</span>
                                            <span style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'monospace' }}>{m.response_time_compliance || 100}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '2px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '2px' }}>
                                            <div style={{ width: `${m.response_time_compliance || 100}%`, height: '100%', background: 'var(--gold)', borderRadius: '2px', boxShadow: '0 0 10px var(--gold)40' }} />
                                        </div>
                                    </div>
                                    <div style={{ width: '120px', textAlign: 'right', fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800' }}>
                                        {m.total_jobs || 0} OPERATIONS
                                    </div>
                                </div>
                            )) : (
                                <div style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '13px', textAlign: 'center', padding: '40px', letterSpacing: '1px' }}>NO TELEMETRY RECORDED</div>
                            )}
                        </div>
                    </PortfolioCard>

                    {/* Violations Table */}
                    <PortfolioCard style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '30px 40px', borderBottom: '1px solid rgba(232, 230, 227, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '18px', fontWeight: '500', fontFamily: 'var(--font-serif)' }}>Breach Registry</h3>
                            <AlertTriangle size={18} color="#ef4444" style={{ opacity: 0.5 }} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(232, 230, 227, 0.01)' }}>
                                        <th style={thStyle}>TIMESTAMP</th>
                                        <th style={thStyle}>BREACH TYPE</th>
                                        <th style={thStyle}>REFERENCE</th>
                                        <th style={thStyle}>OVERRUN</th>
                                        <th style={thStyle}>LIABILITY</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {violations.length > 0 ? violations.map(v => (
                                        <tr key={v.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }}>
                                            <td style={tdStyle}>{new Date(v.violation_date).toLocaleDateString()}</td>
                                            <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '800', fontSize: '11px' }}>{v.violation_type}</td>
                                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>JC-{v.job_card}</td>
                                            <td style={tdStyle}>{v.time_exceeded}H</td>
                                            <td style={{ ...tdStyle, color: '#f43f5e', fontWeight: '800' }}>AED {parseFloat(v.service_credit_amount).toLocaleString()}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <span style={{
                                                    fontSize: '9px',
                                                    padding: '4px 12px',
                                                    borderRadius: '30px',
                                                    background: v.is_acknowledged ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                                                    color: v.is_acknowledged ? '#10b981' : '#f43f5e',
                                                    fontWeight: '900',
                                                    letterSpacing: '0.5px',
                                                    border: `1px solid ${v.is_acknowledged ? '#10b981' : '#f43f5e'}20`
                                                }}>
                                                    {v.is_acknowledged ? 'RESOLVED' : 'PENDING'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.1)', fontSize: '12px', letterSpacing: '2px', fontWeight: '800' }}>NO CONTRACTUAL BREACHES DETECTED</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </PortfolioCard>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ border: '1px solid rgba(176, 141, 87, 0.3)', padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176, 141, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={20} color="var(--gold)" />
                            </div>
                            <h4 style={{ margin: 0, color: 'var(--gold)', fontSize: '12px', fontWeight: '900', letterSpacing: '2px' }}>FINANCIAL EXPOSURE</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={billingItem}>
                                <span>Monthly Retainer</span>
                                <span style={{ color: 'var(--cream)', fontWeight: '300', fontFamily: 'monospace' }}>AED {parseFloat(sla.monthly_retainer || 0).toLocaleString()}</span>
                            </div>
                            <div style={billingItem}>
                                <span>Volume Advantage</span>
                                <span style={{ color: 'var(--gold)', fontWeight: '800' }}>{sla.discount_percentage}% REDUCTION</span>
                            </div>
                            <div style={{ ...billingItem, borderTop: '1px solid rgba(232, 230, 227, 0.05)', paddingTop: '25px', marginTop: '10px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(232, 230, 227, 0.3)' }}>TOTAL LIABILITIES</span>
                                <span style={{ color: '#f43f5e', fontWeight: '300', fontSize: '24px', fontFamily: 'monospace' }}>- AED {violations.reduce((sum, v) => sum + parseFloat(v.service_credit_amount), 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '40px' }}>
                        <h4 style={{ margin: '0 0 25px 0', color: 'var(--cream)', fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-serif)' }}>Contract Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={metaItem}>
                                <Calendar size={14} color="var(--gold)" />
                                <span>Ratified: {sla.signed_date || 'PENDING EXECUTION'}</span>
                            </div>
                            <div style={metaItem}>
                                <FileText size={14} color="var(--gold)" />
                                <span>Termination Notice: {sla.notice_period_days} Days</span>
                            </div>
                            <div style={metaItem}>
                                <CheckCircle2 size={14} color="var(--gold)" />
                                <span>Automated Renewal: {sla.auto_renew ? 'ENABLED' : 'MANUAL'}</span>
                            </div>
                        </div>
                        <PortfolioButton
                            onClick={() => navigate('/construction')}
                            variant="secondary"
                            style={{ width: '100%', marginTop: '30px', fontSize: '11px' }}
                        >
                            ADJUST CONTRACT TERMS
                        </PortfolioButton>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '20px 40px',
    textAlign: 'left',
    fontSize: '9px',
    color: 'rgba(232, 230, 227, 0.3)',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '2px'
};

const tdStyle = {
    padding: '25px 40px',
    color: 'var(--cream)',
    fontSize: '13px'
};

const billingItem = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.5)'
};

const metaItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.4)',
    fontWeight: '500'
};

export default SLADetail;
