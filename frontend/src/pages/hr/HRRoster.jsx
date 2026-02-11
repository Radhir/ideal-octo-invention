import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Calendar, User, Clock, ChevronLeft,
    ChevronRight, Plus, MapPin, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRRoster = () => {
    const navigate = useNavigate();
    const [roster, setRoster] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoster();
    }, [selectedDate]);

    const fetchRoster = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/hr/api/roster/?date=${selectedDate}`);
            setRoster(res.data);
        } catch (err) {
            console.error('Error fetching roster', err);
        } finally {
            setLoading(false);
        }
    };

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
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Logistics Division</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>SHIFT ROSTER</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Resource allocation & daily schedule</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                {/* Day Selector */}
                <GlassCard style={{ padding: '25px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>Current Month</div>
                        <h2 style={{ margin: '10px 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>February 2026</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900' }}>{d}</div>)}
                        {Array.from({ length: 28 }).map((_, i) => {
                            const day = i + 1;
                            const currentYear = new Date().getFullYear();
                            const currentMonth = new Date().getMonth();
                            const loopDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(loopDateStr)}
                                    style={{
                                        padding: '8px',
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        color: 'var(--text-primary)',
                                        border: selectedDate === loopDateStr ? '1.5px solid var(--gold)' : '1px solid var(--border-color)',
                                        background: selectedDate === loopDateStr ? 'var(--gold-glow)' : 'transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Daily Schedule */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.25rem' }}>DAILY ASSIGNMENTS</h3>
                        <button className="glass-card" style={{ padding: '10px 20px', fontSize: '12px', fontWeight: '900', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} color="var(--gold)" /> ASSIGN SHIFT
                        </button>
                    </div>
                    {roster.map(item => (
                        <GlassCard key={item.id} style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid var(--gold-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>
                                    <User size={24} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '16px' }}>{item.employee_name || 'Personnel Node'}</div>
                                    <div style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.task_notes || 'Assigned Duty'}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                                        <Clock size={16} color="var(--gold)" />
                                        {new Date(item.shift_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.shift_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRRoster;
