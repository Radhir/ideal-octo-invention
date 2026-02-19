import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Filter } from 'lucide-react';

const BookingCalendar = ({ bookings = [] }) => {
    const navigate = useNavigate();
    const [view, setView] = useState('WEEK');
    const [currentDate, setCurrentDate] = useState(new Date());

    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    // Dynamic Week Generation
    const getWeekDays = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        start.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return {
                name: d.toLocaleDateString('en-US', { weekday: 'long' }),
                date: d.getDate().toString(),
                isToday: d.toDateString() === new Date().toDateString(),
                fullDate: d
            };
        });
    };

    const days = getWeekDays(currentDate);
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

    const changeWeek = (offset) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + (offset * 7));
        setCurrentDate(nextDate);
    };

    const getBookingForSlot = (dayDate, hour) => {
        return bookings.find(b => {
            if (!b.booking_time || !b.booking_date) return false;
            const bDate = new Date(b.booking_date).toDateString();
            const bHour = parseInt(b.booking_time.split(':')[0]);
            return bDate === dayDate.toDateString() && bHour === hour;
        });
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <div style={{
                background: 'rgba(232, 230, 227, 0.02)',
                border: '1.5px solid rgba(232, 230, 227, 0.1)',
                borderRadius: '24px',
                overflow: 'hidden'
            }}>
                {/* Calendar Control Bar */}
                <div style={{
                    padding: '30px 40px',
                    borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(232, 230, 227, 0.01)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: 0, letterSpacing: '1px' }}>
                                {monthYear}
                            </h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={navBtnStyle} onClick={() => changeWeek(-1)}><ChevronLeft size={16} /></button>
                                <button style={navBtnStyle} onClick={() => changeWeek(1)}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        {['DAY', 'WEEK', 'MONTH'].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                style={{
                                    background: view === v ? 'var(--gold)' : 'transparent',
                                    border: '1px solid rgba(232, 230, 227, 0.2)',
                                    borderRadius: '50px',
                                    padding: '8px 20px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: view === v ? '#0a0a0a' : 'var(--cream)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid Container */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '100px repeat(7, 1fr)',
                    background: 'rgba(232, 230, 227, 0.05)',
                    gap: '1px'
                }}>
                    {/* Header: Timeslot label + Days */}
                    <div style={{ background: '#0a0a0a', padding: '20px' }}></div>
                    {days.map(day => (
                        <div key={day.name} style={{ background: day.isToday ? 'rgba(176, 141, 87, 0.05)' : '#0a0a0a', padding: '25px 20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px', letterSpacing: '1.5px', opacity: 0.8 }}>{day.name.slice(0, 3)}</div>
                            <div style={{ fontSize: '28px', fontWeight: '900', color: day.isToday ? 'var(--gold)' : 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                {day.date}
                            </div>
                        </div>
                    ))}

                    {/* Time Rows */}
                    {hours.map(hour => (
                        <React.Fragment key={hour}>
                            <div style={{
                                background: 'rgba(10, 10, 10, 0.8)',
                                padding: '30px 20px',
                                fontSize: '11px',
                                color: 'rgba(232, 230, 227, 0.4)',
                                fontWeight: '700',
                                borderTop: '1px solid rgba(232, 230, 227, 0.05)',
                                display: 'flex', alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                            {days.map(day => {
                                const booking = getBookingForSlot(day.fullDate, hour);
                                return (
                                    <div key={`${day.name}-${hour}`} style={{
                                        background: day.isToday ? 'rgba(232, 230, 227, 0.015)' : 'rgba(10, 10, 10, 0.4)',
                                        minHeight: '120px',
                                        borderTop: '1px solid rgba(232, 230, 227, 0.05)',
                                        borderLeft: '1px solid rgba(232, 230, 227, 0.05)',
                                        position: 'relative',
                                        padding: '8px',
                                        transition: 'all 0.2s',
                                    }}>
                                        {booking && (
                                            <div style={{
                                                background: 'rgba(176, 141, 87, 0.1)',
                                                borderLeft: '3px solid var(--gold)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                height: '100%',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--cream)', marginBottom: '4px', lineHeight: '1.2' }}>
                                                        {booking.customer_name}
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '700', letterSpacing: '0.5px' }}>
                                                        {booking.v_registration_no}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.6)', fontStyle: 'italic', marginTop: '10px' }}>
                                                    {booking.service_category_name || 'Standard Service'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const navBtnStyle = {
    padding: '6px',
    border: '1px solid rgba(232, 230, 227, 0.15)',
    borderRadius: '8px',
    color: 'var(--cream)',
    background: 'rgba(232, 230, 227, 0.03)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
};

export default BookingCalendar;
