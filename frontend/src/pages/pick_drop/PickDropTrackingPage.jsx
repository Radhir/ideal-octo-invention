import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LiveTrackingMap from '../../components/logistics/LiveTrackingMap';
import TripChat from '../../components/logistics/TripChat';
import { ArrowLeft, Truck, MapPin, Navigation, Clock, User, Signal } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

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
        <PortfolioPage breadcrumb="LOGISTICS // LIVE TRACKING">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle={`Strategic orchestration of Movement protocol ${trip.jc_number || 'TRIP'}.`}>
                    Live Vector
                </PortfolioTitle>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>STATUS</div>
                        <div style={{ color: '#f59e0b', fontWeight: '100', textTransform: 'uppercase', fontSize: '24px', fontFamily: 'var(--font-serif)' }}>{trip.status}</div>
                    </div>
                    <PortfolioBackButton onClick={() => navigate('/pick-drop')} />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '40px', flex: 1, minHeight: 0 }}>
                {/* Map Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(0,0,0,0.5)'
                    }}>
                        <div className="telemetry-grid" style={{ zIndex: 1 }} />
                        <LiveTrackingMap
                            driverCoords={driverCoords}
                            pickupCoords={pickupCoords}
                            dropoffCoords={dropoffCoords}
                            driverName={trip.driver_name}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px' }}>
                        <PortfolioCard style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', marginBottom: '4px' }}>OPERATIVE</div>
                                    <div style={{ color: 'var(--cream)', fontWeight: '300', fontSize: '15px' }}>{trip.driver_name || 'UNASSIGNED'}</div>
                                </div>
                            </div>
                        </PortfolioCard>
                        <PortfolioCard style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Truck size={20} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', marginBottom: '4px' }}>ASSET</div>
                                    <div style={{ color: 'var(--cream)', fontWeight: '300', fontSize: '15px' }}>{trip.license_plate}</div>
                                </div>
                            </div>
                        </PortfolioCard>
                        <PortfolioCard style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Signal size={20} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', marginBottom: '4px' }}>LAST SIGNAL</div>
                                    <div style={{ color: 'var(--cream)', fontWeight: '300', fontSize: '15px' }}>
                                        {trip.last_updated_coords ? new Date(trip.last_updated_coords).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'WAITING...'}
                                    </div>
                                </div>
                            </div>
                        </PortfolioCard>
                    </div>
                </div>

                {/* Comms Section */}
                <div style={{ height: '100%', minHeight: '700px' }}>
                    <TripChat tripId={id} />
                </div>
            </div>
        </PortfolioPage>
    );
};

export default PickDropTrackingPage;
