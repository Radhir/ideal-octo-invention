import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioInput
} from '../../components/PortfolioComponents';
import { Plus, Search, Calendar as CalendarIcon, Printer, User, ExternalLink, Clock, Car } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import PrintHeader from '../../components/PrintHeader';

const BookingList = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [stats, setStats] = useState({ todayCount: 0, pendingCount: 0, confirmedCount: 0 });

    useEffect(() => {
        fetchBookings();

        const params = new URLSearchParams(window.location.search);
        if (params.get('print_confirm') === 'true') {
            setTimeout(() => {
                if (window.confirm("Perform bulk print of active Reservations Registry?")) {
                    window.print();
                }
            }, 1500);
        }
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/forms/bookings/api/list/');
            setBookings(res.data);
            const today = new Date().toISOString().split('T')[0];
            const todayArrivals = res.data.filter(b => b.booking_date === today).length;
            const pending = res.data.filter(b => b.status === 'PENDING').length;
            const confirmed = res.data.filter(b => b.status === 'CONFIRMED').length;

            setStats({
                todayCount: todayArrivals,
                pendingCount: pending,
                confirmedCount: confirmed
            });
        } catch (err) {
            console.error('Error fetching bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.vehicle_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.v_registration_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status) => {
        switch (status) {
            case 'CONFIRMED': return { color: '#10b981', label: 'Confirmed' };
            case 'ARRIVED': return { color: 'var(--gold)', label: 'Vehicle Arrived' };
            case 'CANCELLED': return { color: '#f43f5e', label: 'Cancelled' };
            default: return { color: '#3b82f6', label: 'Pending' };
        }
    };

    return (
        <PortfolioPage breadcrumb="OPERATIONS // RESERVATIONS">
            <PrintHeader title="Bookings Registry" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="A comprehensive registry of vehicle reservations and scheduled operations.">
                    RESERVATIONS
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '100px' }}>
                    <PortfolioButton
                        variant={viewMode === 'list' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('list')}
                        style={{ padding: '12px 25px' }}
                    >
                        LIST
                    </PortfolioButton>
                    <PortfolioButton
                        variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
                        onClick={() => setViewMode('calendar')}
                        style={{ padding: '12px 25px' }}
                    >
                        CALENDAR
                    </PortfolioButton>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => window.print()}
                        style={{ padding: '12px 25px' }}
                    >
                        <Printer size={16} />
                    </PortfolioButton>
                    <PortfolioButton
                        variant="gold"
                        onClick={() => navigate('/bookings/create')}
                        style={{ padding: '12px 30px' }}
                    >
                        <Plus size={16} /> NEW BOOKING
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { label: 'EXPECTED TODAY', value: stats.todayCount },
                { label: 'PENDING TASKS', value: stats.pendingCount },
                { label: 'CONFIRMED SLOTS', value: stats.confirmedCount, color: 'var(--gold)' }
            ]} />

            <div style={{ marginBottom: '60px', maxWidth: '800px' }}>
                <PortfolioInput
                    placeholder="Search by customer, vehicle, or plate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search size={18} />}
                />
            </div>

            {viewMode === 'calendar' ? (
                <BookingCalendar bookings={filteredBookings} />
            ) : (
                <PortfolioGrid columns="repeat(auto-fill, minmax(400px, 1fr))">
                    {loading ? (
                        <div style={{ color: 'var(--cream)', opacity: 0.5, padding: '40px' }}>Refreshing Master Registry...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div style={{ color: 'var(--cream)', opacity: 0.5, padding: '40px' }}>No reservations found.</div>
                    ) : (
                        filteredBookings.map((b) => {
                            const config = getStatusConfig(b.status);
                            return (
                                <PortfolioCard key={b.id} onClick={() => { }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '700', letterSpacing: '2px', marginBottom: '5px' }}>
                                                {b.booking_date}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)', fontSize: '14px', opacity: 0.7 }}>
                                                <Clock size={14} /> {b.booking_time}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            border: `1px solid ${config.color}`,
                                            color: config.color,
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {config.label}
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: '0 0 10px 0' }}>
                                        {b.customer_name}
                                    </h3>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)', opacity: 0.6, fontSize: '13px', marginBottom: '20px' }}>
                                        <Car size={16} /> {b.vehicle_details} • <span style={{ color: 'var(--gold)', fontWeight: '700' }}>{b.v_registration_no}</span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(232, 230, 227, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={12} color="var(--gold)" />
                                            </div>
                                            <span style={{ fontSize: '12px', color: 'var(--cream)', opacity: 0.7 }}>{b.advisor_name || 'Open'}</span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!window.confirm(`Start Job for ${b.customer_name}?`)) return;
                                                api.post(`/forms/bookings/api/list/${b.id}/convert_to_job/`)
                                                    .then(res => navigate(`/job-cards/${res.data.job_card_id}`))
                                                    .catch(err => alert('Error: ' + err.message));
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--gold)',
                                                color: 'var(--gold)',
                                                padding: '8px 16px',
                                                borderRadius: '50px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--gold)';
                                                e.target.style.color = '#0a0a0a';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = 'var(--gold)';
                                            }}
                                        >
                                            <ExternalLink size={14} /> START JOB
                                        </button>
                                    </div>
                                </PortfolioCard>
                            );
                        })
                    )}
                </PortfolioGrid>
            )}
        </PortfolioPage>
    );
};

export default BookingList;
