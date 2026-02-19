import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Search, Plus,
    Calendar as CalendarIcon, Clock, Filter,
    ChevronDown, MoreHorizontal, ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard
} from '../components/PortfolioComponents';

const BookingCalendar = () => {
    const [viewMode, setViewMode] = useState('WEEK'); // 'DAY', 'WEEK', 'MONTH'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Date Utility Functions ---
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
        return new Date(d.setDate(diff));
    };

    const getWeekDays = (startDate) => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            return d;
        });
    };

    const formatShortDay = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    };

    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    // --- Data Fetching ---
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/forms/bookings/api/list/');
            // Handle pagination if results is present
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // --- Navigation ---
    const navigateTime = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'WEEK') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else if (viewMode === 'DAY') {
            newDate.setDate(newDate.getDate() + direction);
        } else {
            newDate.setMonth(newDate.getMonth() + direction);
        }
        setCurrentDate(newDate);
    };

    // --- Renderers ---
    const times = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

    const renderWeeklyView = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const weekDays = getWeekDays(startOfWeek);

        return (
            <div className="calendar-grid">
                {/* Header Row */}
                <div className="grid-header-row">
                    <div className="time-col-spacer"></div>
                    {weekDays.map((day, i) => (
                        <div key={i} className={`day-col-header ${day.toDateString() === new Date().toDateString() ? 'is-today' : ''}`}>
                            <div className="day-name">{formatShortDay(day)}</div>
                            <div className="day-number">{day.getDate()}</div>
                        </div>
                    ))}
                </div>

                {/* Body Scrolling Area */}
                <div className="grid-scroll-body">
                    {times.map((time, timeIdx) => (
                        <div key={timeIdx} className="time-row">
                            <div className="time-label">{time}</div>
                            {weekDays.map((day, dayIdx) => {
                                const dayStr = day.toISOString().split('T')[0];
                                const dayBookings = bookings.filter(b => b.appointment_date === dayStr && b.appointment_time?.startsWith(time.split(':')[0]));

                                return (
                                    <div key={dayIdx} className="slot-cell">
                                        {dayBookings.map((b, bIdx) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={bIdx}
                                                className="booking-token"
                                                onClick={() => console.log('View Booking', b.id)}
                                            >
                                                <div className="token-title">{b.customer_name}</div>
                                                <div className="token-meta">{b.service_type || 'Vehicle Service'}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthlyView = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Padding for start of month
        const startPadding = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
        const totalSlots = Math.ceil((endOfMonth.getDate() + startPadding) / 7) * 7;

        const days = Array.from({ length: totalSlots }, (_, i) => {
            const d = new Date(startOfMonth);
            d.setDate(d.getDate() - startPadding + i);
            return d;
        });

        return (
            <div className="month-grid">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(name => (
                    <div key={name} className="month-day-name">{name}</div>
                ))}
                {days.map((day, i) => {
                    const dayStr = day.toISOString().split('T')[0];
                    const dayBookings = bookings.filter(b => b.appointment_date === dayStr);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                    return (
                        <div key={i} className={`month-slot ${isCurrentMonth ? '' : 'is-padded'} ${day.toDateString() === new Date().toDateString() ? 'is-today' : ''}`}>
                            <div className="month-day-num">{day.getDate()}</div>
                            <div className="month-events-container">
                                {dayBookings.slice(0, 3).map((b, idx) => (
                                    <div key={idx} className="month-event-dot" title={b.customer_name}></div>
                                ))}
                                {dayBookings.length > 3 && <div className="month-event-plus">+{dayBookings.length - 3}</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <PortfolioPage breadcrumb="Operations / Scheduling">


            <div className="calendar-controls">
                <div>
                    <PortfolioTitle subtitle="Industrial-grade scheduling and technical resource management.">
                        MISSION CALENDAR
                    </PortfolioTitle>
                    <div className="calendar-nav" style={{ marginTop: '20px' }}>
                        <div className="current-range-label">{formatMonthYear(currentDate)}</div>
                        <div className="nav-arrows">
                            <button className="nav-btn" onClick={() => navigateTime(-1)}><ChevronLeft size={20} /></button>
                            <button className="nav-btn" onClick={() => setCurrentDate(new Date())} style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '1px', width: 'auto', padding: '0 20px' }}>TODAY</button>
                            <button className="nav-btn" onClick={() => navigateTime(1)}><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
                    <PortfolioButton variant="gold" onClick={() => console.log('Create Booking')}>
                        <Plus size={18} /> INITIALIZE APPOINTMENT
                    </PortfolioButton>
                    <div className="view-switcher">
                        {['DAY', 'WEEK', 'MONTH'].map(m => (
                            <button
                                key={m}
                                className={`mode-btn ${viewMode === m ? 'active' : ''}`}
                                onClick={() => setViewMode(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${viewMode}-${currentDate.toISOString()}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
                >
                    {viewMode === 'WEEK' ? renderWeeklyView() : renderMonthlyView()}
                </motion.div>
            </AnimatePresence>

            {/* Bottom Insight Bar */}
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                <div style={{ fontSize: '11px', color: 'var(--cream)', fontWeight: '700', letterSpacing: '1px' }}>
                    LAST SYNC: {new Date().toLocaleTimeString()} • {bookings.length} TOTAL ENTRIES LOGGED
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--gold)', fontWeight: '900' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }}></div> ACTIVE SLOTS
                    </div>
                </div>
            </div>
        </PortfolioPage >
    );
};

export default BookingCalendar;
