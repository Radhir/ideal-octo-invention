import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    MapPin, Truck, Phone, Clock, AlertCircle,
    Activity, ShieldCheck, ChevronRight, Search
} from 'lucide-react';

const DriverDashboard = () => {
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState({
        total: 14,
        warning: 3,
        transit: 7,
        delivered: 8
    });

    useEffect(() => {
        // Mocking some data for the map-centric view
        const mockTrips = [
            { id: 1, name: 'Rancho Dr', status: 'IN_TRANSIT', city: 'Las Vegas', lat: 36.1699, lng: -115.1398, util: '80%', energy: '70' },
            { id: 2, name: 'N Jones Blvd', status: 'ERROR', city: 'Las Vegas', lat: 36.1750, lng: -115.2431, util: '100%', energy: '90' },
            { id: 3, name: 'Fremont St', status: 'WARNING', city: 'Las Vegas', lat: 36.1680, lng: -115.1430, util: '60%', energy: '80' },
            { id: 4, name: 'Bonanza Rd', status: 'TRANSIT', city: 'Las Vegas', lat: 36.1767, lng: -115.1350, util: '90%', energy: '60' },
        ];
        setTrips(mockTrips);

        const interval = setInterval(() => {
            setTrips(currentTrips => currentTrips.map(t => ({
                ...t,
                lat: t.lat + (Math.random() - 0.5) * 0.001,
                lng: t.lng + (Math.random() - 0.5) * 0.001
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: '#0a0a0a', overflow: 'hidden' }}>

            {/* Left: Map Preview Area */}
            <div style={{ flex: 1, position: 'relative', background: '#111', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    opacity: 0.3,
                    filter: 'grayscale(100%) contrast(150%) invert(100%)'
                }}></div>

                {/* Dynamic Map Markers */}
                {trips.map(trip => (
                    <Marker
                        key={trip.id}
                        label={trip.name}
                        color={trip.status === 'ERROR' ? '#f43f5e' : trip.status === 'WARNING' ? '#f59e0b' : '#3b82f6'}
                        top={`${((trip.lat - 36.16) * 500) % 100}%`} // Simple mapping for demonstration
                        left={`${((trip.lng + 115.2) * 500) % 100}%`}
                    />
                ))}
            </div>

            {/* Right: Operational Dashboard */}
            <div style={{ width: '600px', background: '#000', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '40px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: '#b08d57', fontSize: '10px', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>LOGISTICS COMMAND</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0 }}>TOTAL</h2>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '20px' }}>
                        <StatusDot color="#f43f5e" label="Error" count="14" />
                        <StatusDot color="#f59e0b" label="Warning" count="23" />
                        <StatusDot color="#3b82f6" label="Transit" count="7" />
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '50px' }}>
                    <SummaryItem label="Utilization Rate" value="38.9%" sub="Air conditioner & Display" />
                    <SummaryItem label="Monthly Load" value="1,000 km" sub="Cumulative distance" />
                    <SummaryItem label="Fleet Status" value="Normal" sub="Indoor Air Quality" />
                    <SummaryItem label="Driver Comfort" value="Optimal" sub="Indoor Comfort Level" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {trips.map(trip => (
                        <LogCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Marker = ({ label, color, top, left }) => (
    <div style={{ position: 'absolute', top, left, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{
            background: 'rgba(30,30,35,0.9)',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '900',
            color: '#fff',
            marginBottom: '8px',
            border: `1px solid ${color}44`
        }}>{label}</div>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 15px ${color}`, border: '2px solid #fff' }}></div>
    </div>
);

const StatusDot = ({ color, label, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{label} <strong style={{ color: '#fff', marginLeft: '5px' }}>{count}</strong></span>
    </div>
);

const SummaryItem = ({ label, value, sub }) => (
    <div>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>{sub}</div>
    </div>
);

const LogCard = ({ trip }) => (
    <GlassCard style={{ padding: '20px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>{trip.name}</span>
            <ChevronRight size={14} color="#64748b" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Operation Rate</div>
                <div style={{ fontSize: '16px', fontWeight: '900' }}>{trip.util}</div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '5px' }}>
                    <div style={{ width: trip.util, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                </div>
            </div>
            <div>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Display</div>
                <div style={{ fontSize: '16px', fontWeight: '900' }}>{trip.energy}%</div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '5px' }}>
                    <div style={{ width: `${trip.energy}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <StatusDot color="#f43f5e" label="Error" count="2" />
            <StatusDot color="#f59e0b" label="Warn" count="1" />
        </div>
    </GlassCard>
);

export default DriverDashboard;
