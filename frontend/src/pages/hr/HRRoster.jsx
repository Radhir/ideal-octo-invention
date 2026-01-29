import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    Calendar, User, Clock, ChevronLeft,
    ChevronRight, Plus, MapPin, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRRoster = () => {
    const navigate = useNavigate();
    const [roster, setRoster] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // Mock data for initial preview
        const mockRoster = [
            { id: 1, emp: 'Radhir', shift: '08:00 - 18:00', task: 'Interior Detail' },
            { id: 2, emp: 'Abdul Saboor', shift: '09:00 - 19:00', task: 'Ceramic Coating' },
            { id: 3, emp: 'Ali Shan', shift: '08:00 - 18:00', task: 'Wash Bay A' },
            { id: 4, emp: 'Azan Idrees', shift: 'Night Shift', task: 'Security' },
        ];
        setRoster(mockRoster);
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
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>SHIFT ROSTER</h1>
                    <p style={{ color: '#94a3b8' }}>Resource allocation & daily schedule</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                {/* Day Selector */}
                <GlassCard style={{ padding: '25px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Current Month</div>
                        <h2 style={{ margin: '10px 0', fontSize: '1.2rem' }}>January 2024</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} style={{ fontSize: '10px', color: '#64748b' }}>{d}</div>)}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} style={{
                                padding: '8px',
                                fontSize: '12px',
                                border: i + 1 === 24 ? '1px solid #b08d57' : '1px solid transparent',
                                background: i + 1 === 24 ? '#b08d5722' : 'transparent',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}>{i + 1}</div>
                        ))}
                    </div>
                </GlassCard>

                {/* Daily Schedule */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800' }}>Daily Assignments (Jan 24)</h3>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                            <Plus size={16} /> Assign Shift
                        </button>
                    </div>
                    {roster.map(item => (
                        <GlassCard key={item.id} style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                                    <User size={20} color="#b08d57" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800' }}>{item.emp}</div>
                                    <div style={{ color: '#b08d57', fontSize: '11px', fontWeight: '700' }}>{item.task}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800' }}>
                                    <Clock size={14} color="#3b82f6" /> {item.shift}
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
