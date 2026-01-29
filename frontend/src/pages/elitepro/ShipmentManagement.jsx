import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ship, Plus, Search, Filter, Calendar, Package, DollarSign, MapPin } from 'lucide-react';
import './ShipmentManagement.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ShipmentManagement = () => {
    const [shipments, setShipments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShipments();
    }, [filter]);

    const fetchShipments = async () => {
        try {
            const endpoint = filter === 'active'
                ? `${API_BASE}/logistics/api/shipments/in-transit/`
                : `${API_BASE}/logistics/api/shipments/`;

            const response = await axios.get(endpoint);
            setShipments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shipments:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f59e0b',
            'IN_TRANSIT': '#3b82f6',
            'ARRIVED': '#10b981',
            'CUSTOMS': '#8b5cf6',
            'DELIVERED': '#22c55e',
            'CANCELLED': '#ef4444',
        };
        return colors[status] || '#94a3b8';
    };

    const getShippingIcon = (method) => {
        switch (method) {
            case 'SEA': return '🚢';
            case 'AIR': return '✈️';
            case 'LAND': return '🚛';
            default: return '📦';
        }
    };

    const filteredShipments = shipments.filter(shipment =>
        shipment.shipment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="shipment-management">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Shipment Management</h1>
                    <p className="page-subtitle">Track import/export shipments and logistics</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    New Shipment
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by shipment number, origin, destination..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Shipments
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active Only
                    </button>
                </div>
            </div>

            {/* Shipments Grid */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading shipments...</p>
                </div>
            ) : (
                <div className="shipments-grid">
                    {filteredShipments.map(shipment => (
                        <div key={shipment.id} className="shipment-card">
                            <div className="shipment-header">
                                <div className="shipment-number-section">
                                    <span className="shipping-icon">{getShippingIcon(shipment.shipping_method)}</span>
                                    <div>
                                        <div className="shipment-number">{shipment.shipment_number}</div>
                                        <div className="shipment-type">{shipment.shipment_type}</div>
                                    </div>
                                </div>
                                <div
                                    className="status-badge"
                                    style={{
                                        background: `${getStatusColor(shipment.status)}20`,
                                        color: getStatusColor(shipment.status),
                                        border: `1px solid ${getStatusColor(shipment.status)}40`
                                    }}
                                >
                                    {shipment.status.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="route-section">
                                <div className="location">
                                    <MapPin size={16} color="#b08d57" />
                                    <span>{shipment.origin}</span>
                                </div>
                                <div className="route-arrow">→</div>
                                <div className="location">
                                    <MapPin size={16} color="#d4af37" />
                                    <span>{shipment.destination}</span>
                                </div>
                            </div>

                            <div className="shipment-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>Shipped: {new Date(shipment.shipped_date).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>ETA: {new Date(shipment.expected_arrival).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="shipment-footer">
                                <div className="cost-section">
                                    <DollarSign size={18} color="#b08d57" />
                                    <span className="cost-amount">
                                        AED {shipment.total_logistics_cost?.toLocaleString() || '0'}
                                    </span>
                                </div>
                                {shipment.is_delayed && (
                                    <div className="delayed-badge">⚠️ Delayed</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredShipments.length === 0 && !loading && (
                <div className="empty-state">
                    <Ship size={64} color="#64748b" />
                    <h3>No shipments found</h3>
                    <p>Try adjusting your filters or create a new shipment</p>
                </div>
            )}
        </div>
    );
};

export default ShipmentManagement;
