import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, MapPin, Truck, Phone, Calendar, Printer, ExternalLink, User, Navigation } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioInput
} from '../../components/PortfolioComponents';
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
        <PortfolioPage breadcrumb="LOGISTICS // REGISTRY">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="Archive of global vehicle movements, strategic fleet orchestration, and real-time transit telemetry.">
                    Logistics<br />Pulse
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <PortfolioButton onClick={() => window.print()} variant="glass">
                        <Printer size={16} /> PRINT.archive
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/pick-drop/create')} variant="gold">
                        <Plus size={16} /> INITIATE.movement
                    </PortfolioButton>
                </div>
            </header>

            <div style={{ marginBottom: '60px', position: 'relative', width: '100%' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '10px 25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Search color="var(--gold)" size={20} opacity={0.5} />
                    <input
                        type="text"
                        placeholder="Search logistics pulse (Operative, Plate, JC Protocol)..."
                        style={{
                            padding: '15px 0',
                            fontSize: '15px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--cream)',
                            width: '100%',
                            outline: 'none',
                            letterSpacing: '0.5px',
                            fontWeight: '300'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', opacity: 0.4 }}>PULSE.search</div>
                </div>
            </div>

            <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))" gap="30px">
                {loading ? (
                    <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '800' }}>
                        SYNCHRONIZING FLEET DATA...
                    </div>
                ) : filteredTrips.length === 0 ? (
                    <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '800' }}>
                        SYSTEM STANDBY // NO ACTIVE MOVEMENTS
                    </div>
                ) : (
                    filteredTrips.map((trip) => {
                        const sStyle = getStatusStyle(trip.status);
                        return (
                            <PortfolioCard
                                key={trip.id}
                                style={{
                                    padding: '40px',
                                    background: 'rgba(0,0,0,0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
                                        <div>
                                            <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>
                                                {trip.jc_number ? `PROTOCOL // ${trip.jc_number}` : 'STDBY.node'}
                                            </div>
                                            <h3 style={{ fontSize: '26px', fontWeight: '300', color: 'var(--cream)', margin: 0, fontFamily: 'var(--font-serif)' }}>{trip.customer_name}</h3>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div className="status-pulse" />
                                            <div style={{
                                                fontSize: '8px', fontWeight: '900', color: sStyle.color,
                                                background: `${sStyle.color}15`, padding: '6px 14px', borderRadius: '30px',
                                                textTransform: 'uppercase', border: `1px solid ${sStyle.color}30`,
                                                letterSpacing: '1px'
                                            }}>{sStyle.label}</div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '16px', marginBottom: '35px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5px' }}>
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '6px',
                                                    background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <ArrowDownCircle size={12} color="#10b981" />
                                                </div>
                                                <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, #10b98130, #3b82f630)', margin: '4px 0' }}></div>
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '6px',
                                                    background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <ArrowUpCircle size={12} color="#3b82f6" />
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <div style={{ color: '#10b981', fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', opacity: 0.8 }}>VECTOR // INBOUND_ORIGIN</div>
                                                    <div style={{ fontWeight: '300', color: 'var(--cream)', fontSize: '13px', fontFamily: 'var(--font-serif)' }}>{trip.pickup_location}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#3b82f6', fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', opacity: 0.8 }}>VECTOR // OUTBOUND_DEST</div>
                                                    <div style={{ fontWeight: '300', color: 'var(--cream)', fontSize: '13px', fontFamily: 'var(--font-serif)' }}>{trip.drop_off_location}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Car size={16} color="var(--gold)" opacity={0.5} />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--cream)', fontWeight: '400', fontSize: '14px', fontFamily: 'var(--font-serif)' }}>{trip.vehicle_brand} {trip.vehicle_model}</div>
                                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{trip.license_plate}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="var(--gold)" opacity={0.5} />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--cream)', fontWeight: '400', fontSize: '14px', fontFamily: 'var(--font-serif)' }}>{trip.driver_name || 'UNASSIGNED'}</div>
                                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>OPERATIVE</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)', fontWeight: '300', fontSize: '12px' }}>
                                            <Calendar size={14} color="var(--gold)" opacity={0.4} />
                                            {new Date(trip.scheduled_time).toLocaleDateString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <PortfolioButton
                                                onClick={() => navigate(`/pick-drop/track/${trip.id}`)}
                                                variant="glass"
                                                style={{ height: '36px', padding: '0 15px', fontSize: '9px', borderRadius: '8px' }}
                                            >
                                                <Navigation size={12} /> TRACK.live
                                            </PortfolioButton>
                                            <PortfolioButton
                                                onClick={() => navigate(`/pick-drop/edit/${trip.id}`)}
                                                variant="gold"
                                                style={{ height: '36px', padding: '0 15px', fontSize: '9px', borderRadius: '8px' }}
                                            >
                                                <ExternalLink size={12} /> MANAGE.node
                                            </PortfolioButton>
                                        </div>
                                    </div>
                                </div>
                            </PortfolioCard>
                        );
                    })
                )}
            </PortfolioGrid>
        </PortfolioPage>
    );
};

