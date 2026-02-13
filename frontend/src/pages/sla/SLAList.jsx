import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Search, FileText, User, Calendar,
    Shield, ArrowRight, Filter, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    const getLevelStyle = (level) => {
        switch (level) {
            case 'PLATINUM': return { color: '#fff', bg: 'linear-gradient(135deg, #94a3b8, #475569)', label: 'Platinum' };
            case 'GOLD': return { color: '#000', bg: 'linear-gradient(135deg, #fbbf24, #b45309)', label: 'Gold' };
            case 'SILVER': return { color: '#fff', bg: 'linear-gradient(135deg, #94a3b8, #64748b)', label: 'Silver' };
            default: return { color: '#fff', bg: 'linear-gradient(135deg, #64748b, #334155)', label: 'Bronze' };
        }
    };

    return (
        <div style={{ padding: '30px 20px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Registry</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>SLA Agreements</h1>
                </div>
                <button onClick={() => navigate('/construction')} style={createBtn}>
                    <Shield size={18} /> Draft New Agreement
                </button>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} size={20} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by agreement # or customer name..."
                    style={{
                        padding: '18px 20px 18px 55px',
                        fontSize: '16px',
                        borderRadius: '15px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        width: '100%',
                        outline: 'none'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
                        Querying Agreement Database...
                    </div>
                ) : filteredSLAs.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
                        No agreements found matching your criteria.
                    </div>
                ) : filteredSLAs.map(sla => {
                    const lStyle = getLevelStyle(sla.service_level);
                    return (
                        <GlassCard key={sla.id} style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 15px', background: lStyle.bg, color: lStyle.color, fontSize: '10px', fontWeight: '900', borderRadius: '0 0 0 12px' }}>
                                {lStyle.label}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800', marginBottom: '4px' }}>{sla.agreement_number}</div>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800' }}>{sla.customer_name || `Customer #${sla.customer}`}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div style={infoBox}>
                                    <Calendar size={14} color="var(--gold)" />
                                    <div>
                                        <div style={infoLabel}>EXPIRY</div>
                                        <div style={infoValue}>{new Date(sla.end_date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div style={infoBox}>
                                    <Shield size={14} color="var(--gold)" />
                                    <div>
                                        <div style={infoLabel}>TYPE</div>
                                        <div style={infoValue}>{sla.agreement_type}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sla.is_active ? '#10b981' : '#f43f5e' }} />
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: sla.is_active ? '#10b981' : '#f43f5e' }}>
                                        {sla.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/sla/${sla.id}`)}
                                    style={inspectBtn}
                                >
                                    Inspect Contract <ChevronRight size={14} />
                                </button>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
};

const infoBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.03)',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const infoLabel = {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontWeight: '800'
};

const infoValue = {
    fontSize: '12px',
    color: '#fff',
    fontWeight: '700'
};

const createBtn = {
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const inspectBtn = {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    opacity: 0.7
};

export default SLAList;
