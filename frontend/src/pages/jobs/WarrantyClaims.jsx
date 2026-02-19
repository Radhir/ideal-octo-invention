import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioGrid, PortfolioButton, PortfolioCard
} from '../../components/PortfolioComponents';
import {
    ShieldAlert, CheckCircle2, XCircle,
    Clock, Search, Plus, ExternalLink,
    ClipboardList, User, Car, Briefcase, ChevronRight
} from 'lucide-react';

const WarrantyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const res = await api.get('/forms/job-cards/api/warranty-claims/');
            setClaims(res.data);
        } catch (err) {
            console.error('Error fetching claims', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/forms/job-cards/api/warranty-claims/${id}/`, { status: newStatus });
            fetchClaims();
        } catch (err) {
            console.error('Error updating claim status', err);
            alert('Operation failed. Please ensure you have appropriate clearance.');
        }
    };

    const stats = [
        { value: claims.filter(c => c.status === 'PENDING').length, label: 'PENDING INSPECTION', color: 'var(--gold)' },
        { value: claims.filter(c => c.status === 'APPROVED').length, label: 'APPROVED RE-WORK', color: '#10b981' },
        { value: claims.length, label: 'TOTAL CLAIMS' }
    ];

    const filteredClaims = claims.filter(c =>
        c.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.claim_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.job_card_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PortfolioPage breadcrumb="Operations / Warranty / Claims Tracker">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Systematic surveillance of material integrity and installation quality across the Elite network.">
                    Warranty Command
                </PortfolioTitle>
                <div style={searchBoxStyle}>
                    <Search size={16} color="rgba(232, 230, 227, 0.3)" />
                    <input
                        type="text"
                        placeholder="Search Dossier / Claim ID..."
                        style={inputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ marginTop: '50px' }}>
                <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                    {loading ? (
                        <div style={{ color: 'rgba(232, 230, 227, 0.4)', padding: '40px', letterSpacing: '2px', fontWeight: '800' }}>INITIALIZING SECURE RETRIEVAL...</div>
                    ) : filteredClaims.length === 0 ? (
                        <div style={{ color: 'rgba(232, 230, 227, 0.2)', padding: '40px', fontFamily: 'var(--font-serif)' }}>No incidents recorded in the current filter.</div>
                    ) : filteredClaims.map(claim => (
                        <PortfolioCard key={claim.id} style={{ padding: '35px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <div style={claimBadgeStyle}>
                                    <ShieldAlert size={14} />
                                    <span>{claim.claim_number}</span>
                                </div>
                                <span style={statusBadgeStyle(claim.status)}>{claim.status_display?.toUpperCase()}</span>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={customerNameStyle}>{claim.customer_name}</h3>
                                <div style={serviceTypeStyle}>{claim.type?.toUpperCase()} PROTECTION CLAIM</div>
                            </div>

                            <div style={detailsGrid}>
                                <div style={detailItem}>
                                    <Briefcase size={12} />
                                    <span>#{claim.job_card_number}</span>
                                </div>
                                <div style={detailItem}>
                                    <Clock size={12} />
                                    <span>{new Date(claim.inspection_date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={descriptionBox}>
                                <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Issue Intelligence</div>
                                <div style={{ fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.6', fontFamily: 'var(--font-serif)' }}>
                                    {claim.issue_description}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                                <PortfolioButton
                                    variant="secondary"
                                    style={{ flex: 1, fontSize: '11px' }}
                                    onClick={() => alert('Inspection feature under development')}
                                >
                                    INSPECT ASSET
                                </PortfolioButton>
                                {claim.status === 'PENDING' && (
                                    <PortfolioButton
                                        variant="primary"
                                        style={{ flex: 1, fontSize: '11px' }}
                                        onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
                                    >
                                        AUTHORIZE RE-WORK
                                    </PortfolioButton>
                                )}
                                {claim.status === 'APPROVED' && (
                                    <PortfolioButton
                                        variant="primary"
                                        style={{ flex: 1, fontSize: '11px', background: '#10b981', borderColor: '#10b981' }}
                                        onClick={() => handleStatusUpdate(claim.id, 'COMPLETED')}
                                    >
                                        MARK RESOLVED
                                    </PortfolioButton>
                                )}
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            </div>
        </PortfolioPage>
    );
};

// Styles
const searchBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '16px',
    padding: '0 20px',
    height: '48px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
};

const inputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    fontSize: '14px',
    outline: 'none',
    width: '280px',
    fontFamily: 'var(--font-serif)'
};

const claimBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(176, 141, 87, 0.05)',
    color: 'var(--gold)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '900',
    border: '1px solid rgba(176, 141, 87, 0.1)',
    letterSpacing: '1px'
};

const statusBadgeStyle = (status) => ({
    fontSize: '9px',
    fontWeight: '900',
    padding: '4px 12px',
    borderRadius: '30px',
    background: status === 'PENDING' ? 'rgba(245, 158, 11, 0.05)' :
        status === 'APPROVED' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
    color: status === 'PENDING' ? '#f59e0b' :
        status === 'APPROVED' ? '#10b981' : '#f43f5e',
    border: `1px solid ${status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' :
        status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
    letterSpacing: '0.5px'
});

const customerNameStyle = {
    fontSize: '22px',
    fontWeight: '300',
    color: 'var(--cream)',
    marginBottom: '5px',
    fontFamily: 'var(--font-serif)'
};

const serviceTypeStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--gold)',
    letterSpacing: '1.5px',
    opacity: 0.6
};

const detailsGrid = {
    display: 'flex',
    gap: '24px',
    marginBottom: '25px',
    padding: '15px 0',
    borderTop: '1px solid rgba(232, 230, 227, 0.03)',
    borderBottom: '1px solid rgba(232, 230, 227, 0.03)'
};

const detailItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(232, 230, 227, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const descriptionBox = {
    background: 'rgba(232, 230, 227, 0.01)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(232, 230, 227, 0.05)'
};

export default WarrantyClaims;
