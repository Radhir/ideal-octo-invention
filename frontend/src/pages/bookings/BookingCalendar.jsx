import React from 'react';
import GlassCard from '../../components/GlassCard';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const BookingCalendar = ({ bookings }) => {
    // Generate hours from 08:00 to 19:00
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    // Generate current week days (demo: start from a fixed or relative date)
    const days = [
        { name: 'Monday', date: '23', isToday: false },
        { name: 'Tuesday', date: '24', isToday: false },
        { name: 'Wednesday', date: '25', isToday: false },
        { name: 'Thursday', date: '26', isToday: false },
        { name: 'Friday', date: '27', isToday: true },
        { name: 'Saturday', date: '28', isToday: false },
        { name: 'Sunday', date: '29', isToday: false },
    ];

    const getBookingForSlot = (dayName, hour) => {
        // This is a simplified lookup for demo/seeded data
        // In reality, we'd parse booking_date and booking_time
        return bookings.find(b => {
            const bHour = parseInt(b.booking_time.split(':')[0]);
            // For simplicity in this view, we'll just check if the hour matches
            return bHour === hour;
        });
    };

    return (
        <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>November 2020</h2>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
                        <button style={{ ...tabStyle, background: 'rgba(59, 130, 246, 0.5)', color: '#fff' }}>Week</button>
                        <button style={tabStyle}>Month</button>
                        <button style={tabStyle}>Year</button>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
                        <button style={{ ...navBtnStyle }}><ChevronLeft size={16} /></button>
                        <button style={{ ...navBtnStyle, fontSize: '12px', fontWeight: '700' }}>Today</button>
                        <button style={{ ...navBtnStyle }}><ChevronRight size={16} /></button>
                    </div>
                    <button style={{ ...btnSecondaryStyle }}>Jump to date</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden' }}>
                {/* Header Row */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px' }}></div>
                {days.map(day => (
                    <div key={day.name} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '5px' }}>{day.name}</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: day.isToday ? '#3b82f6' : '#fff' }}>
                            {day.date}
                            {day.isToday && <span style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block', marginLeft: '8px', verticalAlign: 'middle' }}></span>}
                        </div>
                    </div>
                ))}

                {/* Hour Rows */}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', fontSize: '11px', color: '#64748b', fontWeight: '700', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                            {hour.toString().padStart(2, '0')}:00 {hour >= 12 ? 'PM' : 'AM'}
                        </div>
                        {days.map(day => {
                            const booking = getBookingForSlot(day.name, hour);
                            return (
                                <div key={`${day.name}-${hour}`} style={{
                                    background: 'rgba(0,0,0,0.1)',
                                    minHeight: '80px',
                                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                                    borderTop: '1px solid rgba(255,255,255,0.02)',
                                    position: 'relative',
                                    padding: '5px'
                                }}>
                                    {booking && (
                                        <div style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderLeft: '3px solid #3b82f6',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }} className="calendar-card-hover">
                                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{booking.customer_name}</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{booking.service_type}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            <style>
                {`
                    .calendar-card-hover:hover {
                        background: rgba(59, 130, 246, 0.2);
                        transform: translateY(-2px);
                    }
                `}
            </style>
        </div>
    );
};

const tabStyle = {
    padding: '6px 15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const navBtnStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '8px',
    color: '#94a3b8',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const btnSecondaryStyle = {
    padding: '8px 15px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer'
};

export default BookingCalendar;
