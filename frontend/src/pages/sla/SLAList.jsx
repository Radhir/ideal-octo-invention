import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Search, FileText, Calendar, Shield, ArrowRight, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput,
    PortfolioGrid,
    PortfolioCard
} from '../../components/PortfolioComponents';

const SLAList = () => {
    const navigate = useNavigate();
    const [slas, setSlas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSLAs();
    }, []);

    const fetchSLAs = async () => {
        try {
            const res = await api.get('/contracts/sla/api/sla/');
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setSlas(data);
        } catch (err) {
            console.error('Error fetching SLAs', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSLAs = slas.filter(s =>
        s.agreement_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLevelBadge = (level) => {
        switch (level) {
            case 'PLATINUM': return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Platinum' };
            case 'GOLD': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Gold' };
            case 'SILVER': return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: 'Silver' };
            default: return { color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: 'Bronze' };
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Registry...</div>
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Service Level Agreement Registry">Agreements</PortfolioTitle>
                <PortfolioButton
                    onClick={() => navigate('/construction')}
                    variant="gold"
                    style={{ marginBottom: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} /> New Agreement
                </PortfolioButton>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232, 230, 227, 0.4)' }} />
                    <input
                        placeholder="Search by agreement # or customer..."
                        style={{
                            width: '100%',
                            padding: '18px 20px 18px 50px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px',
                            color: 'var(--cream)',
                            fontSize: '15px',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <PortfolioGrid columns="repeat(auto-fill, minmax(350px, 1fr))">
                {filteredSLAs.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.4)', border: '1px dashed rgba(232,230,227,0.1)', borderRadius: '20px' }}>
                        No agreements found matching your search.
                    </div>
                ) : filteredSLAs.map(sla => {
                    const badge = getLevelBadge(sla.service_level);
                    return (
                        <PortfolioCard key={sla.id} onClick={() => navigate(`/sla/${sla.id}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '1px' }}>
                                    {sla.agreement_number}
                                </div>
                                <div style={{
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    background: badge.bg,
                                    color: badge.color,
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {badge.label}
                                </div>
                            </div>

                            <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: '500', color: 'var(--cream)', lineHeight: '1.3' }}>
                                {sla.customer_name || `Customer #${sla.customer}`}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div style={infoBox}>
                                    <div style={infoLabel}>Status</div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: sla.is_active ? '#10b981' : '#ef4444' }}>
                                        {sla.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div style={infoBox}>
                                    <div style={infoLabel}>Expiry</div>
                                    <div style={{ fontSize: '13px', color: 'var(--cream)' }}>
                                        {new Date(sla.end_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(232,230,227,0.05)' }}>
                                <span style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.4)' }}>{sla.agreement_type}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--gold)', fontWeight: '500' }}>
                                    View Details <ArrowRight size={14} />
                                </div>
                            </div>
                        </PortfolioCard>
                    );
                })}
            </PortfolioGrid>
        </PortfolioPage>
    );
};

const infoBox = {
    padding: '10px',
    background: 'rgba(232, 230, 227, 0.03)',
    borderRadius: '8px'
};

const infoLabel = {
    fontSize: '10px',
    color: 'rgba(232, 230, 227, 0.4)',
    textTransform: 'uppercase',
    marginBottom: '4px',
    letterSpacing: '0.5px'
};

export default SLAList;
