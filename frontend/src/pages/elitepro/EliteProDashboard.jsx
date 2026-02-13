import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, TrendingUp, DollarSign, ShoppingCart, Ship, AlertTriangle } from 'lucide-react';
import './EliteProDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const EliteProDashboard = () => {
    const [stats, setStats] = useState({
        activeShipments: 0,
        totalInventoryValue: 0,
        pendingOrders: 0,
        monthlyRevenue: 0,
    });
    const [shipments, setShipments] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [shipmentsRes, productsRes, ordersRes] = await Promise.all([
                api.get('/logistics/api/shipments/in-transit/'),
                api.get('/logistics/api/products/low-stock/'),
                api.get('/logistics/api/sales-orders/pending-payment/')
            ]);

            setShipments(shipmentsRes.data.slice(0, 5));
            setLowStockProducts(productsRes.data);

            setStats({
                activeShipments: shipmentsRes.data.length,
                totalInventoryValue: 250000, // Calculate from products
                pendingOrders: ordersRes.data.length,
                monthlyRevenue: 450000, // Calculate from sales
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, trend }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
                <Icon size={28} color={color} />
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
                {trend && <div className="stat-trend" style={{ color }}>{trend}</div>}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading ElitePro Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="elitepro-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">ElitePro Trading</h1>
                    <p className="page-subtitle">Import/Export & Logistics Management</p>
                </div>
                <div className="header-actions">
                    <button className="btn-gold">
                        <Ship size={18} />
                        New Shipment
                    </button>
                    <button className="btn-outline">
                        <ShoppingCart size={18} />
                        New Order
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <StatCard
                    icon={Ship}
                    label="Active Shipments"
                    value={stats.activeShipments}
                    color="#3b82f6"
                    trend="+2 this week"
                />
                <StatCard
                    icon={Package}
                    label="Inventory Value"
                    value={`AED ${stats.totalInventoryValue.toLocaleString()}`}
                    color="#b08d57"
                />
                <StatCard
                    icon={ShoppingCart}
                    label="Pending Orders"
                    value={stats.pendingOrders}
                    color="#8b5cf6"
                    trend="+5 new today"
                />
                <StatCard
                    icon={DollarSign}
                    label="Monthly Revenue"
                    value={`AED ${stats.monthlyRevenue.toLocaleString()}`}
                    color="#10b981"
                    trend="+12% vs last month"
                />
            </div>

            <div className="dashboard-grid">
                {/* Active Shipments */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Active Shipments</h3>
                        <a href="/elitepro/shipments" className="view-all-link">View All →</a>
                    </div>
                    <div className="shipments-list">
                        {shipments.length > 0 ? (
                            shipments.map(shipment => (
                                <div key={shipment.id} className="shipment-item">
                                    <div className="shipment-info">
                                        <div className="shipment-number">{shipment.shipment_number}</div>
                                        <div className="shipment-route">
                                            {shipment.origin} → {shipment.destination}
                                        </div>
                                    </div>
                                    <div className="shipment-meta">
                                        <span className={`status-badge status-${shipment.status.toLowerCase()}`}>
                                            {shipment.status.replace('_', ' ')}
                                        </span>
                                        <span className="shipment-cost">
                                            AED {shipment.total_logistics_cost.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No active shipments</div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Low Stock Alerts</h3>
                        <a href="/elitepro/inventory" className="view-all-link">Manage →</a>
                    </div>
                    <div className="alerts-list">
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.slice(0, 5).map(product => (
                                <div key={product.id} className="alert-item">
                                    <AlertTriangle size={18} color="#f59e0b" />
                                    <div className="alert-info">
                                        <div className="alert-title">{product.name}</div>
                                        <div className="alert-detail">
                                            Stock: {product.current_stock} {product.unit_of_measure}
                                            (Reorder at: {product.reorder_level})
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">All stock levels are healthy ✓</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EliteProDashboard;
