import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, MapPin, Truck, Phone, Calendar, Printer, ExternalLink, User, Navigation } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const PickDropList = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await api.get('/forms/pick-and-drop/api/trips/');
            setTrips(res.data);
        } catch (err) {
            console.error('Error fetching pick and drop trips', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTrips = trips.filter(t =>
        t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.vehicle_brand + ' ' + t.vehicle_model).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.jc_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'IN_TRANSIT': return { color: '#f59e0b', label: 'In Transit' };
            case 'DELIVERED': return { color: '#10b981', label: 'Completed' };
            case 'CANCELLED': return { color: '#f43f5e', label: 'Cancelled' };
            default: return { color: '#3b82f6', label: 'Scheduled' };
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title="Logistics Registry - Pick & Drop" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Fleet Operations</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Logistics Log</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.print()} className="glass-card" style={actionButtonStyle}>
                        <Printer size={18} /> Print Log
                    </button>
                    <Link to="/pick-drop/create" className="btn-primary" style={{ ...actionButtonStyle, textDecoration: 'none', background: '#b08d57' }}>
                        <Plus size={18} /> Schedule Trip
                    </Link>
                </div>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} size={20} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by customer, plate, JC#, or driver..."
                    style={{ padding: '18px 20px 18px 55px', fontSize: '16px', borderRadius: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>Synchronizing Logistics Data...</p>
                ) : filteredTrips.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>No active movement logs.</p>
                ) : (
                    filteredTrips.map((trip) => {
                        const sStyle = getStatusStyle(trip.status);
                        return (
                            <GlassCard key={trip.id} style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#b08d57', fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' }}>{trip.jc_number || 'STDBY_TRIP'}</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>{trip.customer_name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginTop: '5px' }}>
                                            <Phone size={14} color="#b08d57" /> {trip.phone}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '900', color: sStyle.color,
                                        background: `${sStyle.color}15`, padding: '6px 12px', borderRadius: '8px',
                                        textTransform: 'uppercase'
                                    }}>{sStyle.label}</span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '6px 0' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#b08d57' }}></div>
                                            <div style={{ width: '2px', flex: 1, minHeight: '30px', background: 'rgba(176, 141, 87, 0.2)', margin: '6px 0' }}></div>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3b82f6' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: '20px' }}>
                                                <div style={{ color: '#b08d57', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Departure / Pickup</div>
                                                <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>{trip.pickup_location}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#3b82f6', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Destination / Drop-off</div>
                                                <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>{trip.drop_off_location}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                        <Car size={16} color="#b08d57" />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#fff', fontWeight: '700' }}>{trip.vehicle_brand} {trip.vehicle_model}</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{trip.license_plate}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                        <User size={16} color="#b08d57" />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#fff', fontWeight: '700' }}>{trip.driver_name || 'Open Assignment'}</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Logistics Associate</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '700', fontSize: '13px' }}>
                                        <Calendar size={14} color="#b08d57" />
                                        {new Date(trip.scheduled_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => navigate(`/pick-drop/track/${trip.id}`)}
                                            style={{
                                                background: 'rgba(176, 141, 87, 0.1)', color: '#b08d57',
                                                border: '1px solid rgba(176, 141, 87, 0.3)', padding: '8px 15px',
                                                borderRadius: '8px', fontSize: '11px', fontWeight: '900',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                            }}
                                        >
                                            <Navigation size={14} /> Track Live
                                        </button>
                                        <button
                                            onClick={() => navigate(`/pick-drop/edit/${trip.id}`)}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)', color: '#fff',
                                                border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px',
                                                borderRadius: '8px', fontSize: '11px', fontWeight: '900',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                            }}
                                        >
                                            <ExternalLink size={14} color="#b08d57" /> Manage Trip
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
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

export default PickDropList;
