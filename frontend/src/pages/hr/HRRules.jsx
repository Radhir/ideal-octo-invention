import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    ScrollText, Plus, ShieldAlert, CheckCircle2,
    Edit3, Trash2, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRRules = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState([]);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const res = await api.get('/hr/api/rules/');
                // Transform backend data if needed to match UI expectations
                const transformed = res.data.map(r => ({
                    id: r.id,
                    name: r.rule_name,
                    value: r.rule_name.includes('Rate') ? `${r.rule_value}x` : (r.rule_name.includes('AED') ? `AED ${r.rule_value}` : `${r.rule_value} Mins`),
                    desc: r.description
                }));
                setRules(transformed);
            } catch (err) {
                console.error("Failed to fetch rules", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, []);

    return (
        <div style={{ padding: '30px 20px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/hr/hub')}
                    style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ArrowLeft size={20} color="var(--gold)" />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Compliance Intelligence</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>HR RULES & POLICIES</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Define compliance and payroll multipliers</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                <button className="glass-card" style={{ border: '2px dashed var(--gold-border)', background: 'var(--input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '40px', color: 'var(--gold)', cursor: 'pointer' }}>
                    <Plus size={40} />
                    <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Add New Policy</span>
                </button>

                {rules.map(rule => (
                    <GlassCard key={rule.id} style={{ padding: '25px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '10px', border: '1px solid var(--gold-border)' }}>
                                <ScrollText size={20} color="var(--gold)" />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', color: '#64748b' }}>
                                <Edit3 size={16} cursor="pointer" />
                                <Trash2 size={16} cursor="pointer" />
                            </div>
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>{rule.name}</h3>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--gold)', marginBottom: '10px' }}>{rule.value}</div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: '800' }}>{rule.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default HRRules;
