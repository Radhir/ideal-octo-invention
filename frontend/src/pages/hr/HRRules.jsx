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
    const [loading, setLoading] = useState(true);

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
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/hr')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>HR RULES & POLICIES</h1>
                    <p style={{ color: '#94a3b8' }}>Define compliance and payroll multipliers</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                <button className="glass-card" style={{ border: '2px dashed rgba(176,141,87,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '40px', color: '#b08d57', cursor: 'pointer' }}>
                    <Plus size={40} />
                    <span style={{ fontWeight: '800' }}>Add New Policy</span>
                </button>

                {rules.map(rule => (
                    <GlassCard key={rule.id} style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ background: '#b08d5722', padding: '10px', borderRadius: '10px' }}>
                                <ScrollText size={20} color="#b08d57" />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', color: '#64748b' }}>
                                <Edit3 size={16} cursor="pointer" />
                                <Trash2 size={16} cursor="pointer" />
                            </div>
                        </div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '800' }}>{rule.name}</h3>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#b08d57', marginBottom: '10px' }}>{rule.value}</div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>{rule.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default HRRules;
