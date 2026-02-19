import {
    MapPin, Truck, Phone, Clock, AlertCircle,
    Activity, ShieldCheck, ChevronRight, Search, Zap, Compass, Navigation
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats
} from '../../components/PortfolioComponents';
import React from 'react';

const DriverDashboard = () => {
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState([
        { label: 'UTILIZATION', value: '38.9%', icon: Zap, subvalue: 'Air conditioner & Display' },
        { label: 'MONTHLY LOAD', value: '1,000', icon: Compass, subvalue: 'Cumulative KM' },
        { label: 'FLEET STATUS', value: 'NORMAL', icon: ShieldCheck, subvalue: 'Environmental Safety' },
        { label: 'COMFORT LVL', value: 'OPTIMAL', icon: Activity, subvalue: 'Driver Satisfaction' },
    ]);

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
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: 'var(--bg-black)', overflow: 'hidden' }}>
            {/* Left: Map Preview Area */}
            <div style={{ flex: 1, position: 'relative', background: '#080808', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    opacity: 0.2,
                    filter: 'grayscale(100%) contrast(150%) brightness(0.5)'
                }}></div>

                <div className="telemetry-grid" />

                {/* Dynamic Map Markers */}
                {trips.map(trip => (
                    <Marker
                        key={trip.id}
                        label={trip.name}
                        color={trip.status === 'ERROR' ? '#f43f5e' : trip.status === 'WARNING' ? '#f59e0b' : 'var(--gold)'}
                        top={`${((trip.lat - 36.16) * 500) % 100}%`}
                        left={`${((trip.lng + 115.2) * 500) % 100}%`}
                    />
                ))}
            </div>

            {/* Right: Operational Dashboard */}
            <div style={{ width: '640px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(40px)', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '60px 50px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ color: 'var(--gold)', fontSize: '9px', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>LOGISTICS COMMAND</div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '100', color: 'var(--cream)', margin: 0, fontFamily: 'var(--font-serif)', lineHeight: 1 }}>Logistics<br />Terminal</h2>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '25px', marginTop: '15px' }}>
                        <StatusDot color="#f43f5e" label="ERROR.trace" count="14" />
                        <StatusDot color="#f59e0b" label="WARN.pulse" count="23" />
                        <StatusDot color="var(--gold)" label="TRANSIT.node" count="7" />
                    </div>
                </header>

                <div style={{ marginBottom: '80px' }}>
                    <PortfolioGrid columns="1fr 1fr" gap="40px">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '12px', opacity: 0.6 }}>{stat.label}</div>
                                <div style={{ fontSize: '36px', fontWeight: '100', color: 'var(--cream)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{stat.value}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '300' }}>{stat.subvalue}</div>
                            </div>
                        ))}
                    </PortfolioGrid>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
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


const LogCard = ({ trip }) => (
    <PortfolioCard
        style={{
            padding: '30px',
            position: 'relative',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'left',
            overflow: 'hidden'
        }}
    >
        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                <span style={{ fontWeight: '400', fontSize: '18px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{trip.name}</span>
                <div className="status-pulse" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div>
                    <div style={{ fontSize: '8px', color: 'var(--gold)', marginBottom: '8px', fontWeight: '900', letterSpacing: '1px' }}>UTILIZATION.node</div>
                    <div style={{ fontSize: '16px', fontWeight: '300', color: 'var(--cream)' }}>{trip.util}</div>
                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '8px' }}>
                        <div style={{ width: trip.util, height: '100%', background: 'var(--gold)' }}></div>
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '8px', color: 'var(--gold)', marginBottom: '8px', fontWeight: '900', letterSpacing: '1px' }}>TELEMETRY.pulse</div>
                    <div style={{ fontSize: '16px', fontWeight: '300', color: 'var(--cream)' }}>{trip.energy}%</div>
                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '8px' }}>
                        <div style={{ width: `${trip.energy}%`, height: '100%', background: 'var(--gold)' }}></div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <StatusDot color="#f43f5e" label="ERR" count="2" />
                <StatusDot color="#f59e0b" label="WRN" count="1" />
            </div>
        </div>
    </PortfolioCard>
);

export default DriverDashboard;
