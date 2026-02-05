import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LiveTrackingMap from '../../components/logistics/LiveTrackingMap';
import TripChat from '../../components/logistics/TripChat';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Truck, MapPin, Navigation, Clock, User } from 'lucide-react';

const PickDropTrackingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrip();
        const interval = setInterval(fetchTrip, 10000); // Poll every 10s for coords
        return () => clearInterval(interval);
    }, [id]);

    const fetchTrip = async () => {
        try {
            const res = await api.get(`/forms/pick-and-drop/api/trips/${id}/`);
            setTrip(res.data);
        } catch (err) {
            console.error('Error fetching trip for tracking', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !trip) {
        return <div style={{ padding: '50px', color: '#fff', textAlign: 'center' }}>Initializing Secure Tracking Link...</div>;
    }

    if (!trip) {
        return <div style={{ padding: '50px', color: '#fff', textAlign: 'center' }}>Trip not found.</div>;
    }

    const driverCoords = trip.current_lat ? [parseFloat(trip.current_lat), parseFloat(trip.current_lng)] : null;
    const pickupCoords = [25.2, 55.27]; // Dummy for now, ideally we'd geocode or have these in DB
    const dropoffCoords = [25.3, 55.4]; // Dummy for now

    return (
        <div style={{ padding: '30px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/pick-drop')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Fleet Operations</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: '900', margin: 0, color: '#fff' }}>Live Tracking: {trip.jc_number || 'TRIP'}</h1>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Status</div>
                    <div style={{ color: '#f59e0b', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>{trip.status}</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '30px', flex: 1, minHeight: 0 }}>
                {/* Map Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ flex: 1, position: 'relative', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <LiveTrackingMap
                            driverCoords={driverCoords}
                            pickupCoords={pickupCoords}
                            dropoffCoords={dropoffCoords}
                            driverName={trip.driver_name}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <GlassCard style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={20} color="#b08d57" />
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Associate</div>
                                    <div style={{ color: '#fff', fontWeight: '800' }}>{trip.driver_name || 'Unassigned'}</div>
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Truck size={20} color="#b08d57" />
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Vehicle</div>
                                    <div style={{ color: '#fff', fontWeight: '800' }}>{trip.license_plate}</div>
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={20} color="#b08d57" />
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Last Update</div>
                                    <div style={{ color: '#fff', fontWeight: '800' }}>
                                        {trip.last_updated_coords ? new Date(trip.last_updated_coords).toLocaleTimeString() : 'Waiting for Signal...'}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Comms Section */}
                <div style={{ height: '100%', minHeight: '600px' }}>
                    <TripChat tripId={id} />
                </div>
            </div>
        </div>
    );
};

export default PickDropTrackingPage;
