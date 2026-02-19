import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats
} from '../components/PortfolioComponents';
import {
    ShieldAlert, AlertTriangle, CheckCircle, Clock,
    FileText, Eye, BarChart3, TrendingUp, Shield
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
                api.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                api.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
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

    return (
        <PortfolioPage>
            <PortfolioTitle
                title="Risk & Audit"
                subtitle="Governance, Quality Assurance & Compliance Monitoring"
            />

            <PortfolioGrid columns="1fr 1fr 1fr 1fr">
                <PortfolioCard style={{
                    padding: '25px',
                    background: `linear-gradient(135deg, ${riskColor}10, transparent)`,
                    border: `1px solid ${riskColor}30`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Risk Score</div>
                    <div style={{ fontSize: '56px', fontWeight: '900', color: riskColor, lineHeight: 1 }}>{riskScore}</div>
                    <div style={{
                        marginTop: '10px', fontSize: '12px', fontWeight: '800',
                        color: riskColor, background: `${riskColor}15`,
                        padding: '4px 10px', borderRadius: '20px', letterSpacing: '1px'
                    }}>{riskLevel} RISK</div>
                </PortfolioCard>
                <PortfolioStats label="Open Audit Items" value={auditItems.length} icon={AlertTriangle} color="#f59e0b" />
                <PortfolioStats label="QC Failures" value={qcPending.length} icon={ShieldAlert} color="#ef4444" />
                <PortfolioStats label="Overdue Payments" value={overdueInvoices.length} icon={Clock} color="#8b5cf6" />
            </PortfolioGrid>

            <PortfolioGrid columns="2fr 1fr" style={{ marginTop: '25px' }}>
                <PortfolioCard>
                    <h3 style={{ margin: '0 0 25px 0', fontSize: '16px', fontWeight: '800', color: '#fff' }}>Active Audit Items</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {auditItems.length > 0 ? auditItems.map((item, i) => {
                            const ItemIcon = typeIcon[item.type] || AlertTriangle;
                            const color = severityColor[item.severity];
                            return (
                                <div key={i} style={{
                                    padding: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', gap: '15px'
                                }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: `${color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <ItemIcon size={18} color={color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '3px', color: '#fff' }}>{item.title}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{item.detail}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700',
                                            background: `${color}15`, color: color,
                                            border: `1px solid ${color}30`
                                        }}>{item.severity}</span>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>{item.date}</div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                <CheckCircle size={40} style={{ margin: '0 auto 15px', opacity: 0.5, color: '#10b981' }} />
                                <p>All clear - no open audit items.</p>
                            </div>
                        )}
                    </div>
                </PortfolioCard>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <PortfolioCard>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', color: '#fff' }}>Risk Categories</h4>
                        {[
                            { label: 'Quality Control', count: qcPending.length, total: jobs.length, color: '#ef4444' },
                            { label: 'Financial', count: overdueInvoices.length, total: invoices.length, color: '#f59e0b' },
                            { label: 'Compliance', count: noSignOff.length, total: jobs.filter(j => j.status === 'DELIVERY').length || 1, color: '#3b82f6' },
                            { label: 'Operational', count: openJobs.length, total: jobs.length || 1, color: '#8b5cf6' },
                        ].map((cat, i) => (
                            <div key={i} style={{ marginBottom: '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '600', color: '#fff' }}>{cat.label}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{cat.count} / {cat.total}</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(100, (cat.count / Math.max(cat.total, 1)) * 100)}%`,
                                        height: '100%', background: cat.color, borderRadius: '2px'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </PortfolioCard>

                    <PortfolioCard style={{ background: 'linear-gradient(135deg, rgba(176,141,87,0.08), transparent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{ background: 'rgba(176,141,87,0.1)', padding: '8px', borderRadius: '8px' }}>
                                <Shield color="var(--gold)" size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: '800', fontSize: '14px', color: '#fff' }}>Compliance Summary</h4>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Total Jobs Audited</span>
                                <span style={{ fontWeight: '700', color: '#fff' }}>{jobs.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Fully Compliant</span>
                                <span style={{ fontWeight: '700', color: '#10b981' }}>{jobs.filter(j => j.qc_sign_off && j.floor_incharge_sign_off).length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Needs Review</span>
                                <span style={{ fontWeight: '700', color: '#f59e0b' }}>{auditItems.length}</span>
                            </div>
                        </div>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

export default RiskAuditPage;
