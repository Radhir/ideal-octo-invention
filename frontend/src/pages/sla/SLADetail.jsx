import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import BentoCard from '../../components/BentoCard';
import {
    ChevronLeft, Shield, Clock,
    AlertTriangle, CheckCircle2, FileText,
    TrendingUp, Calculator, Calendar
} from 'lucide-react';

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

    if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Loading Agreement Matrix...</div>;
    if (!sla) return <div style={{ padding: '40px', color: '#fff' }}>Agreement not found.</div>;

    return (
        <div style={{ padding: '30px 20px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <button
                onClick={() => navigate('/sla/list')}
                style={{ background: 'transparent', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '25px', fontWeight: '800' }}
            >
                <ChevronLeft size={18} /> BACK TO REGISTRY
            </button>

            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Shield color="var(--gold)" size={24} />
                        <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>{sla.agreement_number}</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                        {sla.customer_name || `Customer #${sla.customer}`}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ ...statusBadge, background: sla.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: sla.is_active ? '#10b981' : '#f43f5e' }}>
                        {sla.is_active ? 'CONTRACT ACTIVE' : 'CONTRACT INACTIVE'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px' }}>Level: <span style={{ color: '#fff', fontWeight: '800' }}>{sla.service_level}</span></div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* SLA Terms / Parameters */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <TermCard label="Emergency Response" value={`${sla.emergency_response_time || '--'} hrs`} icon={Clock} />
                        <TermCard label="Standard Response" value={`${sla.standard_response_time} hrs`} icon={Clock} />
                        <TermCard label="Job Resolution" value={`${sla.resolution_time} hrs`} icon={TrendingUp} />
                    </div>

                    {/* Historical Performance */}
                    <GlassCard style={{ padding: '25px' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px' }}>Performance History</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {metrics.length > 0 ? metrics.map((m, idx) => (
                                <div key={idx} style={metricRow}>
                                    <div style={{ width: '100px', fontWeight: '800', color: 'var(--gold)' }}>{m.month || 'Current'}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Compliance Rate</span>
                                            <span style={{ fontSize: '11px', color: '#fff' }}>{m.response_time_compliance || 100}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                            <div style={{ width: `${m.response_time_compliance || 100}%`, height: '100%', background: 'var(--gold)', borderRadius: '2px' }} />
                                        </div>
                                    </div>
                                    <div style={{ width: '150px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {m.total_jobs || 0} Jobs Analyzed
                                    </div>
                                </div>
                            )) : (
                                <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No metric data recorded.</div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Violation Log */}
                    <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Violation Log</h3>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={thStyle}>Date</th>
                                    <th style={thStyle}>Type</th>
                                    <th style={thStyle}>JC #</th>
                                    <th style={thStyle}>Over-runs</th>
                                    <th style={thStyle}>Credit</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.length > 0 ? violations.map(v => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={tdStyle}>{new Date(v.violation_date).toLocaleDateString()}</td>
                                        <td style={tdStyle}>{v.violation_type}</td>
                                        <td style={tdStyle}>JC-2024-{v.job_card}</td>
                                        <td style={tdStyle}>{v.time_exceeded}h</td>
                                        <td style={{ ...tdStyle, color: '#f43f5e', fontWeight: '800' }}>AED {v.service_credit_amount}</td>
                                        <td style={tdStyle}>
                                            <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: v.is_acknowledged ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: v.is_acknowledged ? '#10b981' : '#f43f5e' }}>
                                                {v.is_acknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No violations recorded. Excellent performance!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </GlassCard>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <GlassCard style={{ padding: '25px', border: '1px solid var(--gold-border)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--gold)', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>FINANCIAL EXPOSURE</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={billingItem}>
                                <span>Monthly Retainer</span>
                                <span style={{ color: '#fff', fontWeight: '800' }}>AED {parseFloat(sla.monthly_retainer || 0).toLocaleString()}</span>
                            </div>
                            <div style={billingItem}>
                                <span>Volume Discount</span>
                                <span style={{ color: '#fff', fontWeight: '800' }}>{sla.discount_percentage}%</span>
                            </div>
                            <div style={{ ...billingItem, borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
                                <span>Total Credits Due</span>
                                <span style={{ color: '#f43f5e', fontWeight: '900', fontSize: '18px' }}>AED {violations.reduce((sum, v) => sum + parseFloat(v.service_credit_amount), 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '25px' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '14px', fontWeight: '800' }}>CONTRACT MANAGEMENT</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={metaItem}><Calendar size={14} /> Signed: {sla.signed_date || 'Incomplete'}</div>
                            <div style={metaItem}><FileText size={14} /> Notice Period: {sla.notice_period_days} Days</div>
                            <div style={metaItem}><CheckCircle2 size={14} /> Auto-Renew: {sla.auto_renew ? 'YES' : 'NO'}</div>
                        </div>
                        <button style={actionBtn} onClick={() => navigate('/construction')}>
                            Edit Agreement Terms
                        </button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

const TermCard = ({ label, value, icon: Icon }) => (
    <GlassCard style={{ padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Icon size={20} color="var(--gold)" />
        <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '18px', color: '#fff', fontWeight: '800' }}>{value}</div>
        </div>
    </GlassCard>
);

const statusBadge = {
    padding: '8px 15px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1px',
    display: 'inline-block'
};

const metricRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '10px 0'
};

const thStyle = {
    padding: '15px 20px',
    textAlign: 'left',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontWeight: '800',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '15px 20px',
    fontSize: '13px',
    color: '#fff'
};

const billingItem = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--text-secondary)'
};

const metaItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px'
};

const actionBtn = {
    marginTop: '20px',
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '800',
    fontSize: '13px',
    cursor: 'pointer'
};

export default SLADetail;
