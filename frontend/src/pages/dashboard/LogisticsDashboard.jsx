import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Truck, Box, Calendar,
    Navigation, User, Clock, CheckCircle2
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeTrips: 0,
        pendingPickups: 0,
        scheduledDeliveries: 0,
        fleetStatus: {
            available: 0,
            inUse: 0,
            maintenance: 0
        },
        todaysSchedule: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dashboard/api/logistics/stats/');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch logistics stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Logistics Data...</p>
            </div>

        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Fleet & Movement">
                    Logistics Control
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        variant="glass"
                        onClick={() => navigate('/logistics/fleet')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Truck size={18} /> Fleet Status
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => navigate('/logistics/schedule/new')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <MapPin size={18} /> New Trip
                    </PortfolioButton>
                </div>
            </div>

            {/* KPI ROW */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <KPICard icon={Navigation} label="Active Trips" value={stats.activeTrips} subvalue="Drivers on Road" color="#3b82f6" />
                <KPICard icon={Box} label="Pending Pickups" value={stats.pendingPickups} subvalue="High Priority" color="#f59e0b" />
                <KPICard icon={CheckCircle2} label="Deliveries" value={stats.scheduledDeliveries} subvalue="Scheduled Today" color="#10b981" />
                <KPICard icon={Truck} label="Fleet Avail." value={`${stats.fleetStatus.available}/${stats.fleetStatus.available + stats.fleetStatus.inUse + stats.fleetStatus.maintenance}`} subvalue="Vehicles Ready" color="#8b5cf6" />
            </PortfolioGrid>

            {/* MAIN CONTENT */}
            <PortfolioGrid columns={3} gap="25px">

                {/* LEFT: SCHEDULE */}
                <div style={{ gridColumn: 'span 2' }}>
                    <PortfolioCard style={{ padding: '25px', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={18} color="var(--gold)" /> Today's Movement
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {stats.todaysSchedule.map(trip => (
                                <div key={trip.id} className="logistics-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            background: trip.type === 'PICKUP' ? 'rgba(59, 130, 246, 0.1)' : trip.type === 'DELIVERY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: trip.type === 'PICKUP' ? '#3b82f6' : trip.type === 'DELIVERY' ? '#10b981' : '#f59e0b',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px'
                                        }}>
                                            {trip.type === 'PICKUP' ? 'P' : trip.type === 'DELIVERY' ? 'D' : 'S'}
                                        </div>
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{trip.customer}</div>
                                            <div style={{ color: 'rgba(232,230,227,0.5)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <MapPin size={10} /> {trip.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ width: '150px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--cream)' }}>
                                            <User size={12} color="var(--gold)" /> {trip.driver}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(232,230,227,0.4)', marginTop: '2px' }}>
                                            <Clock size={10} /> {trip.time}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', width: '100px' }}>
                                        <span style={{
                                            fontSize: '10px', padding: '4px 10px', borderRadius: '20px',
                                            background: trip.status === 'COMPLETED' ? '#10b981' : trip.status === 'IN_TRANSIT' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                            color: trip.status === 'COMPLETED' ? '#000' : trip.status === 'IN_TRANSIT' ? '#fff' : 'rgba(232,230,227,0.5)',
                                            fontWeight: '800'
                                        }}>
                                            {trip.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>

                {/* RIGHT: DRIVER MAP MOCKUP */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '0', overflow: 'hidden', height: '100%', minHeight: '300px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: '#000', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>Live Tracking</h3>
                        </div>
                        {/* Mock Map Background */}
                        <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                            <MapPin size={64} />
                            <span style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                Map Integration Placeholder
                            </span>
                        </div>
                    </PortfolioCard>
                </div>

            </PortfolioGrid>

        </PortfolioPage>
    );
};

const KPICard = ({ icon: Icon, label, value, subvalue, color }) => (
    <PortfolioCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `4px solid ${color}` }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={22} />
        </div>
        <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(232,230,227,0.6)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '10px', color: color, marginTop: '2px', fontWeight: '600' }}>{subvalue}</div>
        </div>
    </PortfolioCard>
);

export default LogisticsDashboard;
