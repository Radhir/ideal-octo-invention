import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import {
    ShieldAlert, AlertTriangle, CheckCircle, Clock,
    FileText, Eye, BarChart3, TrendingUp,
    Search, Filter, ChevronRight
} from 'lucide-react';

const RiskAuditPage = () => {
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuditData();
    }, []);

    const fetchAuditData = async () => {
        try {
            const [jobsRes, invoicesRes] = await Promise.all([
                axios.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                axios.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
            ]);
            setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || []);
            setInvoices(Array.isArray(invoicesRes.data) ? invoicesRes.data : invoicesRes.data.results || []);
        } catch (err) {
            console.error('Audit fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    // Risk metrics computed from real data
    const openJobs = jobs.filter(j => j.status !== 'CLOSED' && j.status !== 'DELIVERY');
    const qcPending = jobs.filter(j => j.status === 'QC' && !j.qc_sign_off);
    const overdueInvoices = invoices.filter(i => i.payment_status === 'OVERDUE');
    const noSignOff = jobs.filter(j => j.status === 'DELIVERY' && (!j.customer_signature));
    const highValueJobs = jobs.filter(j => parseFloat(j.net_amount || 0) > 5000);

    const riskScore = Math.min(100, Math.round(
        (qcPending.length * 10) + (overdueInvoices.length * 15) + (noSignOff.length * 8)
    ));
    const riskLevel = riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW';
    const riskColor = riskScore > 60 ? '#ef4444' : riskScore > 30 ? '#f59e0b' : '#10b981';

    const auditItems = [
        ...qcPending.map(j => ({
            type: 'QC',
            severity: 'HIGH',
            title: `QC Pending: ${j.job_card_number || 'JC-' + j.id}`,
            detail: `${j.customer_name || 'Unknown'} - ${j.brand || ''} ${j.model || ''}`,
            date: j.updated_at?.split('T')[0] || '-'
        })),
        ...overdueInvoices.map(inv => ({
            type: 'FINANCE',
            severity: 'HIGH',
            title: `Overdue Payment: ${inv.invoice_number || 'INV-' + inv.id}`,
            detail: `${inv.customer_name || 'Unknown'} - AED ${parseFloat(inv.grand_total || 0).toLocaleString()}`,
            date: inv.date || '-'
        })),
        ...noSignOff.map(j => ({
            type: 'COMPLIANCE',
            severity: 'MEDIUM',
            title: `Missing Signature: ${j.job_card_number || 'JC-' + j.id}`,
            detail: `Delivery without customer sign-off`,
            date: j.updated_at?.split('T')[0] || '-'
        })),
        ...highValueJobs.filter(j => !j.floor_incharge_sign_off).map(j => ({
            type: 'APPROVAL',
            severity: 'MEDIUM',
            title: `High-Value Missing Approval: ${j.job_card_number || 'JC-' + j.id}`,
            detail: `AED ${parseFloat(j.net_amount || 0).toLocaleString()} - No floor incharge sign-off`,
            date: j.updated_at?.split('T')[0] || '-'
        }))
    ];

    const severityColor = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
    const typeIcon = { QC: ShieldAlert, FINANCE: AlertTriangle, COMPLIANCE: FileText, APPROVAL: Eye };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Running Risk Analysis...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '800', letterSpacing: '2px' }}>GOVERNANCE & COMPLIANCE</div>
                <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Risk & Audit</h1>
            </header>

            {/* Risk Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <GlassCard style={{ padding: '30px', background: `linear-gradient(135deg, ${riskColor}15, transparent)`, border: `1px solid ${riskColor}30` }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Score</div>
                    <div style={{ fontSize: '48px', fontWeight: '900', color: riskColor, lineHeight: 1.2 }}>{riskScore}</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: riskColor }}>{riskLevel} RISK</div>
                </GlassCard>
                <RiskStat label="Open Audit Items" value={auditItems.length} icon={AlertTriangle} color="#f59e0b" />
                <RiskStat label="QC Failures" value={qcPending.length} icon={ShieldAlert} color="#ef4444" />
                <RiskStat label="Overdue Payments" value={overdueInvoices.length} icon={Clock} color="#8b5cf6" />
            </div>

            {/* Risk Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                {/* Audit Items List */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '800' }}>Active Audit Items</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {auditItems.length > 0 ? auditItems.map((item, i) => {
                            const ItemIcon = typeIcon[item.type] || AlertTriangle;
                            return (
                                <div key={i} style={{
                                    padding: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${severityColor[item.severity]}20`, display: 'flex', alignItems: 'center', gap: '15px'
                                }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: `${severityColor[item.severity]}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <ItemIcon size={18} color={severityColor[item.severity]} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{item.title}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.detail}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800',
                                            background: `${severityColor[item.severity]}15`, color: severityColor[item.severity],
                                            border: `1px solid ${severityColor[item.severity]}30`
                                        }}>{item.severity}</span>
                                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '5px' }}>{item.date}</div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                <CheckCircle size={40} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
                                <p>All clear - no open audit items.</p>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Risk Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <GlassCard style={{ padding: '25px' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '800' }}>Risk Categories</h4>
                        {[
                            { label: 'Quality Control', count: qcPending.length, total: jobs.length, color: '#ef4444' },
                            { label: 'Financial', count: overdueInvoices.length, total: invoices.length, color: '#f59e0b' },
                            { label: 'Compliance', count: noSignOff.length, total: jobs.filter(j => j.status === 'DELIVERY').length || 1, color: '#3b82f6' },
                            { label: 'Operational', count: openJobs.length, total: jobs.length || 1, color: '#8b5cf6' },
                        ].map((cat, i) => (
                            <div key={i} style={{ marginBottom: '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '600' }}>{cat.label}</span>
                                    <span style={{ color: '#64748b' }}>{cat.count} / {cat.total}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(100, (cat.count / Math.max(cat.total, 1)) * 100)}%`,
                                        height: '100%', background: cat.color, borderRadius: '3px', transition: 'width 0.5s'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </GlassCard>

                    <GlassCard style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(176,141,87,0.08), transparent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{ background: '#b08d5720', padding: '10px', borderRadius: '10px' }}>
                                <BarChart3 color="#b08d57" size={20} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: '800', fontSize: '14px' }}>Compliance Summary</h4>
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Total Jobs Audited</span>
                                <span style={{ fontWeight: '800', color: '#fff' }}>{jobs.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Fully Compliant</span>
                                <span style={{ fontWeight: '800', color: '#10b981' }}>{jobs.filter(j => j.qc_sign_off && j.floor_incharge_sign_off).length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Needs Review</span>
                                <span style={{ fontWeight: '800', color: '#f59e0b' }}>{auditItems.length}</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

const RiskStat = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>{value}</div>
        </div>
    </GlassCard>
);

export default RiskAuditPage;
