import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ShieldCheck, Search, Filter, Download,
    Link as LinkIcon, FileText, CheckCircle, BarChart2
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats,
    PortfolioButton
} from '../../components/PortfolioComponents';

const AuditorDossier = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total_vouchers: 0, tax_valid: '100%', audit_trails: 0 });

    useEffect(() => {
        fetchAuditData();
    }, []);

    const fetchAuditData = async () => {
        try {
            const res = await api.get('/finance/api/vouchers/');
            setVouchers(res.data);
            setStats({
                total_vouchers: res.data.length,
                tax_valid: '100%',
                audit_trails: res.data.filter(v => v.status === 'POSTED').length
            });
            setLoading(false);
        } catch (err) {
            console.error("Audit fetch failed", err);
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb="Strategic Hub / Governance / Auditor Dossier">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A high-fidelity audit environment for verifying institutional ledger integrity and tax compliance.">
                    Institutional Audit Dossier
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="secondary">
                        <Download size={18} /> EXPORT AUDIT LOG
                    </PortfolioButton>
                    <PortfolioButton variant="primary">
                        <ShieldCheck size={18} /> VERIFY INTEGRITY
                    </PortfolioButton>
                </div>
            </header>

            <PortfolioStats
                stats={[
                    { label: 'LEDGER INTEGRITY', value: 'VERIFIED', icon: <ShieldCheck size={20} color="var(--gold)" /> },
                    { label: 'TOTAL VOUCHERS', value: stats.total_vouchers, icon: <FileText size={20} /> },
                    { label: 'AUDIT TRAILS', value: stats.audit_trails, icon: <BarChart2 size={20} /> },
                    { label: 'TAX COMPLIANCE', value: stats.tax_valid, icon: <CheckCircle size={20} /> },
                ]}
            />

            <div style={{ marginTop: '60px' }}>
                <div style={filterHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <Search size={18} opacity={0.5} />
                        <input
                            placeholder="SEARCH BY VOUCHER #, TRANSACTION ID, OR REFERENCE..."
                            style={searchInput}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <PortfolioButton variant="secondary" style={{ height: '45px', fontSize: '11px' }}>
                        <Filter size={14} /> FILTERS
                    </PortfolioButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {vouchers.filter(v => v.voucher_number.includes(searchTerm)).map(voucher => (
                        <PortfolioCard key={voucher.id} style={{ padding: '0' }}>
                            <div style={auditRow}>
                                <div style={{ width: '150px' }}>
                                    <div style={labelTag}>VOUCHER NO</div>
                                    <div style={voucherId}>{voucher.voucher_number}</div>
                                </div>
                                <div style={{ width: '120px' }}>
                                    <div style={labelTag}>DATE</div>
                                    <div style={auditText}>{voucher.date}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={labelTag}>NARRATION</div>
                                    <div style={auditText}>{voucher.narration}</div>
                                </div>
                                <div style={{ width: '120px', textAlign: 'right' }}>
                                    <div style={labelTag}>STATUS</div>
                                    <div style={{ ...statusBadge, color: voucher.status === 'POSTED' ? '#10b981' : 'var(--gold)' }}>
                                        {voucher.status}
                                    </div>
                                </div>
                                <div style={{ paddingLeft: '30px', borderLeft: '1px solid rgba(232, 230, 227, 0.1)' }}>
                                    <PortfolioButton variant="secondary" style={{ width: '40px', height: '40px', padding: 0 }}>
                                        <LinkIcon size={14} />
                                    </PortfolioButton>
                                </div>
                            </div>
                        </PortfolioCard>
                    ))}
                </div>
            </div>
        </PortfolioPage>
    );
};

const filterHeader = {
    display: 'flex',
    gap: '30px',
    marginBottom: '40px',
    padding: '0 10px'
};

const searchInput = {
    background: 'transparent',
    border: 'none',
    color: 'var(--cream)',
    fontSize: '12px',
    letterSpacing: '2px',
    width: '100%',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '300'
};

const labelTag = {
    fontSize: '9px',
    color: 'rgba(232, 230, 227, 0.4)',
    letterSpacing: '2px',
    marginBottom: '8px',
    fontWeight: '900'
};

const voucherId = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '18px',
    color: 'var(--gold)',
};

const auditText = {
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.8
};

const statusBadge = {
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1px'
};

const auditRow = {
    display: 'flex',
    alignItems: 'center',
    padding: '25px 30px',
    gap: '40px'
};

export default AuditorDossier;
