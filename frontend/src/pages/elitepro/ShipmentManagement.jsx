import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Ship, Plus, Search, Filter, Calendar, Package, DollarSign, MapPin, X, Edit2 } from 'lucide-react';
import './ShipmentManagement.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SHIPPING_METHODS = [
    { value: 'SEA', label: 'Sea Freight' },
    { value: 'AIR', label: 'Air Freight' },
    { value: 'LAND', label: 'Land Transport' },
];

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'ARRIVED', label: 'Arrived at Port' },
    { value: 'CUSTOMS', label: 'Customs Clearance' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

const SHIPMENT_TYPES = [
    { value: 'IMPORT', label: 'Import' },
    { value: 'EXPORT', label: 'Export' },
];

const ShipmentManagement = () => {
    const [shipments, setShipments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        shipment_number: '',
        shipment_type: 'IMPORT',
        origin: '',
        destination: '',
        shipping_method: 'SEA',
        container_number: '',
        shipped_date: '',
        expected_arrival: '',
        freight_cost: 0,
        customs_duty: 0,
        port_charges: 0,
        insurance: 0,
        other_charges: 0,
        status: 'PENDING',
        notes: '',
    });

    useEffect(() => {
        fetchShipments();
    }, [filter]);

    const fetchShipments = async () => {
        try {
            const endpoint = filter === 'active'
                ? `${API_BASE}/logistics/api/shipments/in-transit/`
                : `${API_BASE}/logistics/api/shipments/`;

            const response = await api.get(endpoint);
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

    const generateShipmentNumber = () => {
        const prefix = 'SHP';
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}-${timestamp}`;
    };

    const openAddModal = () => {
        setEditingShipment(null);
        setFormData({
            shipment_number: generateShipmentNumber(),
            shipment_type: 'IMPORT',
            origin: '',
            destination: '',
            shipping_method: 'SEA',
            container_number: '',
            shipped_date: new Date().toISOString().split('T')[0],
            expected_arrival: '',
            freight_cost: 0,
            customs_duty: 0,
            port_charges: 0,
            insurance: 0,
            other_charges: 0,
            status: 'PENDING',
            notes: '',
        });
        setShowModal(true);
    };

    const openEditModal = (shipment) => {
        setEditingShipment(shipment);
        setFormData({
            shipment_number: shipment.shipment_number,
            shipment_type: shipment.shipment_type,
            origin: shipment.origin,
            destination: shipment.destination,
            shipping_method: shipment.shipping_method,
            container_number: shipment.container_number || '',
            shipped_date: shipment.shipped_date,
            expected_arrival: shipment.expected_arrival,
            freight_cost: shipment.freight_cost || 0,
            customs_duty: shipment.customs_duty || 0,
            port_charges: shipment.port_charges || 0,
            insurance: shipment.insurance || 0,
            other_charges: shipment.other_charges || 0,
            status: shipment.status,
            notes: shipment.notes || '',
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['freight_cost', 'customs_duty', 'port_charges', 'insurance', 'other_charges'].includes(name)
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingShipment) {
                await api.put(`${API_BASE}/logistics/api/shipments/${editingShipment.id}/`, formData);
            } else {
                await api.post(`${API_BASE}/logistics/api/shipments/`, formData);
            }
            setShowModal(false);
            fetchShipments();
        } catch (error) {
            console.error('Error saving shipment:', error);
            alert('Failed to save shipment. Please check all fields.');
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (shipment, newStatus) => {
        try {
            await api.patch(`${API_BASE}/logistics/api/shipments/${shipment.id}/`, { status: newStatus });
            fetchShipments();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="shipment-management">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Shipment Management</h1>
                    <p className="page-subtitle">Track import/export shipments and logistics</p>
                </div>
                <button className="btn-primary" onClick={openAddModal}>
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
                            <div className="shipment-actions">
                                <button className="action-btn" title="Edit" onClick={() => openEditModal(shipment)}>
                                    <Edit2 size={16} />
                                </button>
                                {shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED' && (
                                    <select
                                        className="status-select"
                                        value={shipment.status}
                                        onChange={(e) => updateStatus(shipment, e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
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

            {/* Add/Edit Shipment Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingShipment ? 'Edit Shipment' : 'New Shipment'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <h3>Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Shipment Number *</label>
                                        <input
                                            type="text"
                                            name="shipment_number"
                                            value={formData.shipment_number}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!!editingShipment}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select name="shipment_type" value={formData.shipment_type} onChange={handleInputChange}>
                                            {SHIPMENT_TYPES.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Shipping Method</label>
                                        <select name="shipping_method" value={formData.shipping_method} onChange={handleInputChange}>
                                            {SHIPPING_METHODS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange}>
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Route Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Origin *</label>
                                        <input
                                            type="text"
                                            name="origin"
                                            value={formData.origin}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Shanghai, China"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Destination *</label>
                                        <input
                                            type="text"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Dubai, UAE"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Container Number</label>
                                        <input
                                            type="text"
                                            name="container_number"
                                            value={formData.container_number}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Dates</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Shipped Date *</label>
                                        <input
                                            type="date"
                                            name="shipped_date"
                                            value={formData.shipped_date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Expected Arrival *</label>
                                        <input
                                            type="date"
                                            name="expected_arrival"
                                            value={formData.expected_arrival}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Costs (AED)</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Freight Cost</label>
                                        <input type="number" name="freight_cost" value={formData.freight_cost} onChange={handleInputChange} min="0" step="0.01" />
                                    </div>
                                    <div className="form-group">
                                        <label>Customs Duty</label>
                                        <input type="number" name="customs_duty" value={formData.customs_duty} onChange={handleInputChange} min="0" step="0.01" />
                                    </div>
                                    <div className="form-group">
                                        <label>Port Charges</label>
                                        <input type="number" name="port_charges" value={formData.port_charges} onChange={handleInputChange} min="0" step="0.01" />
                                    </div>
                                    <div className="form-group">
                                        <label>Insurance</label>
                                        <input type="number" name="insurance" value={formData.insurance} onChange={handleInputChange} min="0" step="0.01" />
                                    </div>
                                    <div className="form-group">
                                        <label>Other Charges</label>
                                        <input type="number" name="other_charges" value={formData.other_charges} onChange={handleInputChange} min="0" step="0.01" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingShipment ? 'Update Shipment' : 'Create Shipment')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipmentManagement;
