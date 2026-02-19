import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Calendar, User, Clock, ChevronLeft,
    ChevronRight, Plus, MapPin, ArrowLeft
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

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    return (
        <PortfolioPage breadcrumb="Logistics Division / Shift Roster">
            <PortfolioBackButton onClick={() => navigate('/hr/hub')} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
                <PortfolioTitle
                    subtitle="Resource allocation & daily schedule management"
                >
                    Shift Roster
                </PortfolioTitle>
            </div>

            <PortfolioGrid columns="1fr 3fr">
                {/* Day Selector */}
                <PortfolioCard style={{ height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '2px' }}>Current Month</div>
                        <h2 style={{ margin: '10px 0', fontSize: '1.8rem', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{monthName} {currentYear}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', opacity: 0.7 }}>{d}</div>)}
                        {Array.from({ length: 30 }).map((_, i) => {
                            const day = i + 1;
                            const loopDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = selectedDate === loopDateStr;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(loopDateStr)}
                                    style={{
                                        padding: '10px 0',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        color: isSelected ? '#000' : 'var(--cream)',
                                        border: isSelected ? 'none' : '1px solid rgba(232, 230, 227, 0.1)',
                                        background: isSelected ? 'var(--gold)' : 'transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isSelected ? '0 0 15px rgba(176,141,87,0.4)' : 'none'
                                    }}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </PortfolioCard>

                {/* Daily Schedule */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontWeight: '900', color: 'var(--cream)', fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Daily Assignments</h3>
                        <PortfolioButton variant="gold" style={{ padding: '10px 20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} /> Assign Shift
                        </PortfolioButton>
                    </div>

                    {roster.length === 0 ? (
                        <div style={{ padding: '50px', border: '1px dashed rgba(232, 230, 227, 0.2)', borderRadius: '15px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)' }}>
                            No shifts assigned for this date.
                        </div>
                    ) : (
                        roster.map(item => (
                            <PortfolioCard key={item.id} style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} className="hover-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                    <div style={{ background: 'rgba(176,141,87,0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(176,141,87,0.2)' }}>
                                        <User size={24} color="var(--gold)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', color: 'var(--cream)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>{item.employee_name || 'Personnel Node'}</div>
                                        <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>{item.task_notes || 'Assigned Duty'}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700', color: 'rgba(232, 230, 227, 0.8)' }}>
                                            <Clock size={16} color="var(--gold)" />
                                            {new Date(item.shift_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.shift_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </PortfolioCard>
                        ))
                    )}
                </div>
            </PortfolioGrid>


        </PortfolioPage>
    );
};

export default HRRoster;
