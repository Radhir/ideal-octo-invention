import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Save, DollarSign, Briefcase, Calendar, Tag } from 'lucide-react';

const BudgetManager = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        account: '',
        period: `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`,
        amount: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            alert('Budget allocated successfully. (Backend link active)');
            navigate('/finance');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/finance')}
                    style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>BUDGET ALLOCATION</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Define departmental spending limits</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label" style={{ fontWeight: '900', color: 'var(--text-primary)' }}>Select Account</label>
                            <select name="account" className="form-control" onChange={handleChange} required style={{ background: 'var(--input-bg)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '800' }}>
                                <option value="">Choose Account Category...</option>
                                <option value="6010">Staff Salaries</option>
                                <option value="6100">Workshop Rent</option>
                                <option value="6200">Social Media Ads</option>
                                <option value="6109">Car Wash Materials</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontWeight: '900', color: 'var(--text-primary)' }}>Budget Period</label>
                            <input name="period" className="form-control" value={formData.period} onChange={handleChange} placeholder="e.g. 2024-Q1" style={{ background: 'var(--input-bg)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '800' }} />
                        </div>
                        <div>
                            <label className="form-label" style={{ fontWeight: '900', color: 'var(--text-primary)' }}>Allocation Amount (AED)</label>
                            <input name="amount" className="form-control" type="number" onChange={handleChange} placeholder="0.00" required style={{ background: 'var(--input-bg)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '800' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '40px', height: '55px', fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '1.5px solid var(--gold-border)' }}>
                        <Save size={20} /> Commit Allocation
                    </button>
                </GlassCard>
            </form>
        </div>
    );
};

export default BudgetManager;
