import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ScrollText, Plus, ShieldAlert,
    Edit3, Trash2, Gavel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const HRRules = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/hr/rules/');
            // Transform backend data to match UI expectations
            const transformed = res.data.map(r => ({
                id: r.id,
                title: r.rule_name,
                value: r.rule_name.includes('Rate') ? `${r.rule_value}x` : (r.rule_name.includes('AED') ? `AED ${r.rule_value}` : `${r.rule_value} Mins`),
                description: r.description
            }));
            setRules(transformed);
        } catch (err) {
            console.error('Error fetching rules', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const deleteRule = async (id) => {
        if (!window.confirm("Are you sure you want to decommission this regulation?")) return;
        try {
            await api.delete(`/api/hr/rules/${id}/`);
            fetchRules();
        } catch (err) {
            console.error('Error deleting rule', err);
        }
    };

    return (
        <PortfolioPage breadcrumb="HR / Governance / Regulations">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <div>
                    <PortfolioTitle subtitle="Standard Operating Procedures and dynamic HR compliance frameworks.">
                        Institutional Regulations
                    </PortfolioTitle>
                </div>
                <PortfolioButton onClick={() => navigate('/construction')} variant="primary">
                    <Plus size={18} style={{ marginRight: '10px' }} /> ESTABLISH PROTOCOL
                </PortfolioButton>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px' }}>
                    SYNCHRONIZING POLICY ENGINE...
                </div>
            ) : (
                <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))" gap="40px">
                    {rules.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.1)' }}>
                            <ScrollText size={80} strokeWidth={1} style={{ marginBottom: '30px', opacity: 0.3 }} />
                            <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>No Active Regulations</div>
                            <p style={{ fontSize: '14px', letterSpacing: '1px' }}>INITIALIZE GOVERNANCE FRAMEWORK TO BEGIN</p>
                        </div>
                    ) : rules.map(rule => (
                        <PortfolioCard key={rule.id} style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '40px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'rgba(176, 141, 87, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(176, 141, 87, 0.1)'
                                    }}>
                                        <Gavel size={24} color="var(--gold)" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => navigate('/construction')}
                                            style={actionBtnStyle}
                                            title="Edit Protocol"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteRule(rule.id)}
                                            style={{ ...actionBtnStyle, color: 'rgba(244, 63, 94, 0.4)' }}
                                            title="Decommission"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 style={{
                                    margin: '0 0 10px 0',
                                    color: 'var(--cream)',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    fontFamily: 'var(--font-serif)',
                                    lineHeight: '1.3'
                                }}>
                                    {rule.title}
                                </h3>

                                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--gold)', marginBottom: '20px', fontFamily: 'monospace' }}>
                                    {rule.value}
                                </div>

                                <p style={{
                                    margin: 0,
                                    color: 'rgba(232, 230, 227, 0.4)',
                                    fontSize: '13px',
                                    lineHeight: '1.7',
                                    marginBottom: '30px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {rule.description}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '10px',
                                    color: 'var(--gold)',
                                    fontWeight: '800',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    paddingTop: '20px',
                                    borderTop: '1px solid rgba(232, 230, 227, 0.03)'
                                }}>
                                    <ShieldAlert size={14} /> Enforcement Level: Mandatory
                                </div>
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            )}
        </PortfolioPage>
    );
};

const actionBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    color: 'rgba(232, 230, 227, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

export default HRRules;
