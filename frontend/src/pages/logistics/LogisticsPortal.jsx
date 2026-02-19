import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Truck, Box, Calendar,
    Navigation, User, Clock, CheckCircle2,
    Plus, Package, AlertTriangle, ArrowRight,
    Ship, Plane, DollarSign, Activity
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioStats
} from '../../components/PortfolioComponents';

// --- Sub-components for Tabs ---

const DashboardTab = ({ stats }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGrid columns="1.5fr 1fr" gap="40px">
                <PortfolioCard style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <PortfolioSectionTitle>Fleet Manifest</PortfolioSectionTitle>
                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '2px', fontWeight: '800' }}>TODAY'S SCHEDULE</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {stats.todaysSchedule?.map(trip => (
                            <div key={trip.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: trip.type === 'PICKUP' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: trip.type === 'PICKUP' ? '#3b82f6' : '#10b981',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px'
                                    }}>
                                        {trip.type[0]}
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--cream)', fontWeight: '700', fontSize: '14px' }}>{trip.customer}</div>
                                        <div style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', marginTop: '2px' }}>{trip.location}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--cream)' }}>
                                    <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '9px', fontWeight: '800', marginBottom: '4px' }}>OPERATIVE</div>
                                    {trip.driver}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--cream)' }}>
                                    <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '9px', fontWeight: '800', marginBottom: '4px' }}>TIMESTAMP</div>
                                    {trip.time}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '9px', padding: '6px 14px', borderRadius: '30px',
                                        background: trip.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(232, 230, 227, 0.05)',
                                        color: trip.status === 'COMPLETED' ? '#10b981' : 'rgba(232, 230, 227, 0.4)',
                                        fontWeight: '800', border: '1px solid rgba(232, 230, 227, 0.1)'
                                    }}>
                                        {trip.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </PortfolioCard>

                <PortfolioCard style={{
                    padding: '0',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'rgba(0,0,0,0.2)',
                    minHeight: '400px'
                }}>
                    <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 10 }}>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginBottom: '5px' }}>TELEMETRY</div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>Live Tracking</h3>
                    </div>

                    <div className="telemetry-grid"></div>

                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <div className="radar-pulse"></div>
                        <div className="radar-scanner"></div>
                        <MapPin size={40} color="var(--gold)" style={{ zIndex: 5, fill: 'rgba(176,141,87,0.2)' }} />

                        <div style={{
                            position: 'absolute',
                            bottom: '30px',
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '11px',
                            color: 'rgba(176, 141, 87, 0.5)',
                            letterSpacing: '2px',
                            fontWeight: '700'
                        }}>
                            SATELLITE LINK ESTABLISHED
                        </div>
                    </div>
                </PortfolioCard>
            </PortfolioGrid>
        </motion.div>
    );
};

const InventoryTab = ({ products, onAdd }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <PortfolioButton onClick={onAdd} variant="glass">
                    <Plus size={16} /> REGISTER.asset
                </PortfolioButton>
            </div>
            <PortfolioGrid columns="repeat(auto-fill, minmax(320px, 1fr))" gap="25px">
                {products.map(product => (
                    <PortfolioCard key={product.id} style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>SKU // {product.sku}</div>
                                    <h3 style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', margin: 0 }}>{product.name}</h3>
                                </div>
                                <div className="status-pulse" />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>STOCK.telemetry</div>
                                    <div style={{ fontSize: '24px', color: product.needs_reorder ? '#f59e0b' : 'var(--gold)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>
                                        {product.current_stock} <span style={{ fontSize: '12px', opacity: 0.5 }}>{product.unit_of_measure}</span>
                                    </div>
                                </div>
                                {product.needs_reorder && (
                                    <div style={{ fontSize: '8px', color: '#f59e0b', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '30px', border: '1px solid rgba(245, 158, 11, 0.2)', letterSpacing: '1px' }}>
                                        <AlertTriangle size={10} /> CRITICAL_REORDER
                                    </div>
                                )}
                            </div>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const ShipmentsTab = ({ shipments, onAdd }) => {
    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f59e0b', 'IN_TRANSIT': '#3b82f6', 'ARRIVED': '#10b981',
            'CUSTOMS': '#c084fc', 'DELIVERED': '#22c55e', 'CANCELLED': '#ef4444',
        };
        return colors[status] || 'rgba(232, 230, 227, 0.4)';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <PortfolioButton onClick={onAdd} variant="primary">INITIATE SHIPMENT</PortfolioButton>
            </div>
            <PortfolioGrid columns="repeat(auto-fill, minmax(400px, 1fr))">
                {shipments.map(shipment => (
                    <PortfolioCard key={shipment.id} style={{ padding: '35px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginBottom: '5px' }}>MANIFEST #{shipment.shipment_number}</div>
                                <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{shipment.shipment_type}</div>
                            </div>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'rgba(232, 230, 227, 0.03)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(232, 230, 227, 0.05)'
                            }}>
                                {shipment.shipping_method === 'AIR' ? <Plane size={20} color="var(--gold)" strokeWidth={1.5} /> : shipment.shipping_method === 'LAND' ? <Truck size={20} color="var(--gold)" strokeWidth={1.5} /> : <Ship size={20} color="var(--gold)" strokeWidth={1.5} />}
                            </div>
                        </div>

                        <div style={{ fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--cream)' }}>{shipment.origin}</span>
                            <ArrowRight size={14} style={{ opacity: 0.3 }} />
                            <span style={{ fontWeight: '800', color: 'var(--cream)' }}>{shipment.destination}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(232, 230, 227, 0.03)', paddingTop: '25px' }}>
                            <div style={{
                                padding: '6px 14px', borderRadius: '30px', fontSize: '9px', fontWeight: '900',
                                background: `${getStatusColor(shipment.status)}05`,
                                color: getStatusColor(shipment.status),
                                border: `1px solid ${getStatusColor(shipment.status)}15`,
                                letterSpacing: '1px'
                            }}>
                                {shipment.status.replace('_', ' ')}
                            </div>
                            <div style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '800' }}>
                                <span style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', marginRight: '8px' }}>VALUATION</span>
                                AED {shipment.total_logistics_cost?.toLocaleString()}
                            </div>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const LogisticsPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [stats, setStats] = useState({});
    const [products, setProducts] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, productsRes, shipmentsRes] = await Promise.all([
                    api.get('/dashboard/api/logistics/stats/'),
                    api.get('/logistics/api/products/'),
                    api.get('/logistics/api/shipments/')
                ]);
                setStats(statsRes.data);
                setProducts(productsRes.data);
                setShipments(shipmentsRes.data);
            } catch (err) {
                console.error("Failed to fetch logistics data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const kpiData = [
        { label: 'Active Trips', value: stats.activeTrips || 0, subvalue: 'TELEMETRY PULSE', icon: Navigation, color: '#3b82f6' },
        { label: 'Low Stock', value: products.filter(p => p.needs_reorder).length || 0, subvalue: 'CRITICAL REORDER', icon: Box, color: '#f59e0b' },
        { label: 'Asset Value', value: `${(products.reduce((sum, p) => sum + (p.current_stock * p.cost_price), 0) / 1000).toFixed(0)}K`, subvalue: 'GROSS VALUATION', icon: DollarSign, color: '#10b981' },
        { label: 'In Transit', value: shipments.filter(s => s.status === 'IN_TRANSIT').length || 0, subvalue: 'GLOBAL MOVEMENT', icon: Activity, color: '#c084fc' }
    ];

    if (loading) return (
        <PortfolioPage breadcrumb="OPERATIONS / SUPPLY CHAIN">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="portfolio-spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800' }}>INITIALIZING LOGISTICS CONSOLE...</p>
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="OPERATIONS / LOGISTICS">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="Global supply chain visibility, strategic movement orchestration, and autonomous fleet intelligence.">
                    Logistics<br />Command Center
                </PortfolioTitle>
            </div>

            <PortfolioStats stats={kpiData} />

            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '60px',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '15px',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)'
            }}>
                {['DASHBOARD', 'ASSET MATRIX', 'SHIPMENTS'].map(tab => {
                    const mappedTab = tab === 'ASSET MATRIX' ? 'INVENTORY' : tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(mappedTab)}
                            style={{
                                padding: '14px 35px',
                                background: activeTab === mappedTab ? 'var(--gold)' : 'transparent',
                                border: 'none',
                                color: activeTab === mappedTab ? '#000' : 'rgba(232, 230, 227, 0.4)',
                                fontSize: '10px',
                                fontWeight: '900',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                borderRadius: '10px',
                                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                boxShadow: activeTab === mappedTab ? '0 10px 30px rgba(176,141,87,0.3)' : 'none'
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'DASHBOARD' && <DashboardTab stats={stats} />}
                {activeTab === 'INVENTORY' && <InventoryTab products={products} onAdd={() => navigate('/stock/create')} />}
                {activeTab === 'SHIPMENTS' && <ShipmentsTab shipments={shipments} onAdd={() => navigate('/logistics/shipment/new')} />}
            </AnimatePresence>

        </PortfolioPage>
    );
};

export default LogisticsPortal;
