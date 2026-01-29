import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, Calendar as CalendarIcon, Phone, LayoutGrid, Table, Printer, Car, User, Settings, ExternalLink } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import PrintHeader from '../../components/PrintHeader';

const BookingList = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [stats, setStats] = useState({ todayCount: 0 });

    useEffect(() => {
        fetchBookings();

        // Handle direct print request from Reports Dashboard
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
            const res = await axios.get('/forms/bookings/api/list/');
            setBookings(res.data);
            const today = new Date().toISOString().split('T')[0];
            const count = res.data.filter(b => b.booking_date === today).length;
            setStats({ todayCount: count });
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return { color: '#10b981', label: 'Confirmed' };
            case 'ARRIVED': return { color: '#b08d57', label: 'Vehicle Arrived' };
            case 'CANCELLED': return { color: '#f43f5e', label: 'Cancelled' };
            default: return { color: '#3b82f6', label: 'Pending' };
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title="Bookings Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Workflow Management</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Reservations</h1>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginTop: '5px' }}>{stats.todayCount} Expected Arrivals Today</div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setViewMode('list')} style={viewModeStyle(viewMode === 'list')}><Table size={16} /> List</button>
                        <button onClick={() => setViewMode('calendar')} style={viewModeStyle(viewMode === 'calendar')}><CalendarIcon size={16} /> Calendar</button>
                    </div>
                    <button onClick={() => window.print()} className="glass-card" style={actionButtonStyle}><Printer size={18} /> Print</button>
                    <Link to="/bookings/create" className="btn-primary" style={{ ...actionButtonStyle, textDecoration: 'none', background: '#b08d57' }}>
                        <Plus size={18} /> Add Booking
                    </Link>
                </div>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} size={20} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search registry by customer, plate, or vehicle..."
                    style={{ padding: '18px 20px 18px 55px', fontSize: '16px', borderRadius: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {viewMode === 'calendar' ? (
                <BookingCalendar bookings={filteredBookings} />
            ) : (
                <GlassCard style={{ padding: '0', overflow: 'hidden', borderRadius: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(176, 141, 87, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={thStyle}>Date & Time</th>
                                <th style={thStyle}>Identity / Phone</th>
                                <th style={thStyle}>Vehicle / Plate</th>
                                <th style={thStyle}>Service Category</th>
                                <th style={thStyle}>Advisor</th>
                                <th style={thStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>Refreshing Master Registry...</td></tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>No bookings found.</td></tr>
                            ) : (
                                filteredBookings.map((b) => {
                                    const sStyle = getStatusStyle(b.status);
                                    return (
                                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                                            <td style={{ padding: '25px 20px' }}>
                                                <div style={{ color: '#fff', fontWeight: '900', fontSize: '15px' }}>{b.booking_date}</div>
                                                <div style={{ fontSize: '12px', color: '#b08d57', fontWeight: '800' }}>{b.booking_time}</div>
                                            </td>
                                            <td style={{ padding: '25px 20px' }}>
                                                <div style={{ color: '#fff', fontWeight: '800' }}>{b.customer_name}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{b.phone}</div>
                                            </td>
                                            <td style={{ padding: '25px 20px' }}>
                                                <div style={{ color: '#fff', fontSize: '14px' }}>{b.vehicle_details}</div>
                                                <div style={{ fontSize: '11px', color: '#b08d57', fontWeight: '900', letterSpacing: '1px' }}>{b.v_registration_no}</div>
                                            </td>
                                            <td style={{ padding: '25px 20px', color: '#fff', fontSize: '14px' }}>
                                                {b.service_category_name || 'Unspecified'}
                                            </td>
                                            <td style={{ padding: '25px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={12} color="#b08d57" />
                                                    </div>
                                                    <span style={{ fontSize: '13px', color: '#fff' }}>{b.advisor_name || 'Open'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '25px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sStyle.color }}></div>
                                                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700', textTransform: 'uppercase' }}>{sStyle.label}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '25px 20px', textAlign: 'right' }}>
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm(`Start Job for ${b.customer_name}? This will create a new Job Card.`)) return;
                                                        try {
                                                            const res = await axios.post(`/forms/bookings/api/list/${b.id}/convert_to_job/`);
                                                            navigate(`/job-cards/${res.data.job_card_id}`);
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert('Failed to start job: ' + (err.response?.data?.error || err.message));
                                                        }
                                                    }}
                                                    style={{
                                                        background: '#b08d57', color: '#000',
                                                        border: 'none', padding: '8px 15px',
                                                        borderRadius: '8px', fontSize: '11px', fontWeight: '900',
                                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        boxShadow: '0 4px 12px rgba(176, 141, 87, 0.3)'
                                                    }}
                                                >
                                                    <ExternalLink size={14} color="#000" /> ARRIVED / START JOB
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }))}
                        </tbody>
                    </table>
                </GlassCard>
            )}
        </div>
    );
};

const thStyle = {
    padding: '20px',
    textAlign: 'left',
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#b08d57',
    fontWeight: '900',
    letterSpacing: '1px'
};

const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 25px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff'
};

const viewModeStyle = (active) => ({
    padding: '8px 15px',
    borderRadius: '8px',
    border: 'none',
    background: active ? '#b08d57' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '800'
});

export default BookingList;
