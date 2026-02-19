import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart, Package, TrendingUp, DollarSign,
    RefreshCw, Truck, ArrowUpRight, ArrowDownLeft,
    Filter, Download
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput
} from '../../components/PortfolioComponents';

const TradingDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        metrics: {
            dailySales: 45000,
            pendingOrders: 12,
            lowStockItems: 5,
            profitMargin: 22
        },
        recentOrders: [
            { id: 'ORD-2024-001', client: 'AutoSpa Dubai', items: 3, total: 2500, status: 'Processing' },
            { id: 'ORD-2024-002', client: 'Rapid Fix Garage', items: 15, total: 12400, status: 'Shipped' },
            { id: 'ORD-2024-003', client: 'Direct Sale', items: 1, total: 450, status: 'Completed' },
        ],
        inventoryAlerts: [
            { sku: 'PPF-GLOSS-ROLL', name: 'Ultra Gloss PPF Role', qty: 2, min: 5 },
            { sku: 'CERAMIC-9H', name: '9H Ceramic Coating Kit', qty: 8, min: 10 },
        ]
    });

    // Mock Data Loading
    useEffect(() => {
        // fetchTradingData();
    }, []);

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Trading Division">
                    Global Commerce
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        variant="glass"
                        onClick={() => navigate('/trading/orders')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ShoppingCart size={18} /> Orders
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => navigate('/trading/inventory/new')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Package size={18} /> New Product
                    </PortfolioButton>
                </div>
            </div>

            {/* TRADING METRICS */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <KPICard icon={DollarSign} label="Daily Sales" value={`AED ${(stats.metrics.dailySales / 1000).toFixed(1)}k`} subvalue="vs AED 32k Avg" color="#10b981" />
                <KPICard icon={RefreshCw} label="Pending Orders" value={stats.metrics.pendingOrders} subvalue="Needs Action" color="#f59e0b" />
                <KPICard icon={Package} label="Low Stock" value={stats.metrics.lowStockItems} subvalue="Restock Required" color="#f43f5e" />
                <KPICard icon={TrendingUp} label="Net Margin" value={`${stats.metrics.profitMargin}%`} subvalue="Target: 20%" color="#3b82f6" />
            </PortfolioGrid>

            <PortfolioGrid columns={3} gap="25px">

                {/* ACTIVE ORDERS */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Truck size={18} color="var(--gold)" /> Recent Order Activity
                            </h3>
                            <button onClick={() => navigate('/trading/orders')} style={{ background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>VIEW ALL</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', padding: '10px', fontSize: '11px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', textTransform: 'uppercase' }}>
                                <div style={{ flex: 1.5 }}>Order ID</div>
                                <div style={{ flex: 2 }}>Client</div>
                                <div style={{ flex: 1 }}>Items</div>
                                <div style={{ flex: 1.5, textAlign: 'right' }}>Total</div>
                                <div style={{ flex: 1.5, textAlign: 'right' }}>Status</div>
                            </div>
                            {stats.recentOrders.map(order => (
                                <div key={order.id} className="trading-row">
                                    <div style={{ flex: 1.5, color: 'var(--gold)', fontWeight: '700', fontSize: '12px' }}>{order.id}</div>
                                    <div style={{ flex: 2, color: '#fff', fontSize: '13px' }}>{order.client}</div>
                                    <div style={{ flex: 1, color: 'rgba(232,230,227,0.6)', fontSize: '12px' }}>{order.items} Units</div>
                                    <div style={{ flex: 1.5, textAlign: 'right', color: '#fff', fontWeight: '800' }}>AED {order.total.toLocaleString()}</div>
                                    <div style={{ flex: 1.5, textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                                            background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : order.status === 'Processing' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: order.status === 'Completed' ? '#10b981' : order.status === 'Processing' ? '#f59e0b' : '#3b82f6',
                                            fontWeight: '800'
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>

                {/* INVENTORY ALERTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={18} color="#f43f5e" /> Inventory Alerts
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {stats.inventoryAlerts.map((item, i) => (
                                <div key={i} style={{ padding: '15px', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{item.name}</div>
                                        <div style={{ color: '#f43f5e', fontWeight: '900', fontSize: '13px' }}>{item.qty} Left</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ color: 'rgba(232,230,227,0.4)', fontSize: '10px' }}>SKU: {item.sku}</div>
                                        <div style={{ color: 'rgba(232,230,227,0.5)', fontSize: '10px' }}>Min Level: {item.min}</div>
                                    </div>
                                    <PortfolioButton
                                        variant="glass"
                                        style={{ width: '100%', marginTop: '10px', justifyContent: 'center', height: '30px', fontSize: '11px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                                    >
                                        Create PO
                                    </PortfolioButton>
                                </div>
                            ))}
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

export default TradingDashboard;
