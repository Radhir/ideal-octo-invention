import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ArrowRight, Plus, Ship, Plane, Truck, MapPin, Calendar, DollarSign } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SHIPPING_METHODS = [
    { value: 'SEA', label: 'Sea Freight', icon: Ship },
    { value: 'AIR', label: 'Air Freight', icon: Plane },
    { value: 'LAND', label: 'Land Transport', icon: Truck },
];

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'ARRIVED', label: 'Arrived' },
    { value: 'CUSTOMS', label: 'Customs' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

const SHIPMENT_TYPES = [
    { value: 'IMPORT', label: 'Import' },
    { value: 'EXPORT', label: 'Export' },
];

const ShipmentManagement = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [editingShipment, setEditingShipment] = useState(null);
    const [formData, setFormData] = useState({
        shipment_number: '', shipment_type: 'IMPORT', origin: '', destination: '',
        shipping_method: 'SEA', container_number: '', shipped_date: '',
        expected_arrival: '', freight_cost: 0, customs_duty: 0, port_charges: 0,
        insurance: 0, other_charges: 0, status: 'PENDING', notes: '',
    });

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await api.get(`${API_BASE}/logistics/api/shipments/`);
            setShipments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shipments:', error);
            setLoading(false);
        }
    };

    const generateShipmentNumber = () => {
        const prefix = 'SHP';
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}-${timestamp}`;
    };

    const openAddModal = () => {
        setEditingShipment(null);
        setFormData({
            shipment_number: generateShipmentNumber(),
            shipment_type: 'IMPORT', origin: '', destination: '', shipping_method: 'SEA',
            container_number: '', shipped_date: new Date().toISOString().split('T')[0],
            expected_arrival: '', freight_cost: 0, customs_duty: 0, port_charges: 0,
            insurance: 0, other_charges: 0, status: 'PENDING', notes: '',
        });
        setShowForm(true);
        setSelectedShipment(null);
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
        setShowForm(true);
        setSelectedShipment(null);
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
        try {
            if (editingShipment) {
                await api.put(`${API_BASE}/logistics/api/shipments/${editingShipment.id}/`, formData);
            } else {
                await api.post(`${API_BASE}/logistics/api/shipments/`, formData);
            }
            setShowForm(false);
            fetchShipments();
        } catch (error) {
            console.error('Error saving shipment:', error);
            alert('Failed to save shipment. Please check all fields.');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f59e0b', 'IN_TRANSIT': '#3b82f6', 'ARRIVED': '#10b981',
            'CUSTOMS': '#8b5cf6', 'DELIVERED': '#22c55e', 'CANCELLED': '#ef4444',
        };
        return colors[status] || '#94a3b8';
    };

    const getMethodIcon = (method) => {
        const methodObj = SHIPPING_METHODS.find(m => m.value === method);
        return methodObj ? methodObj.icon : Ship;
    };

    const inTransitCount = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const totalValue = shipments.reduce((sum, s) => sum + (s.total_logistics_cost || 0), 0);

    if (loading) return <div style={{ padding: '60px', color: 'var(--cream)' }}>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 80px',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '40px'
            }}>
                <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '300', letterSpacing: '1px' }}>
                    Logistics
                </div>
                <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
            </div>

            {!showForm && !selectedShipment ? (
                <>
                    <h1 style={{
                        fontSize: 'clamp(4rem, 12vw, 10rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '600',
                        color: 'var(--cream)',
                        lineHeight: '0.9',
                        marginBottom: '60px',
                        letterSpacing: '-0.02em'
                    }}>
                        SHIPMENTS
                    </h1>

                    <div style={{ display: 'flex', gap: '40px', marginBottom: '80px' }}>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {shipments.length}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                TOTAL
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: '#3b82f6', fontWeight: '300' }}>
                                {inTransitCount}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                IN TRANSIT
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {(totalValue / 1000).toFixed(0)}K
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                AED COST
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        style={{
                            padding: '18px 40px',
                            background: 'var(--cream)',
                            border: 'none',
                            borderRadius: '50px',
                            color: '#0a0a0a',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            letterSpacing: '0.5px'
                        }}
                    >
                        New Shipment
                    </button>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '20px',
                        maxWidth: '1400px'
                    }}>
                        {shipments.map(shipment => {
                            const Icon = getMethodIcon(shipment.shipping_method);
                            return (
                                <button
                                    key={shipment.id}
                                    onClick={() => setSelectedShipment(shipment)}
                                    style={{
                                        padding: '30px',
                                        background: 'transparent',
                                        border: '1.5px solid rgba(232, 230, 227, 0.2)',
                                        borderRadius: '20px',
                                        color: 'var(--cream)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        textAlign: 'left',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(232, 230, 227, 0.03)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                        <Icon size={24} color="rgba(232, 230, 227, 0.3)" />
                                    </div>

                                    <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', marginBottom: '5px' }}>
                                        {shipment.shipment_number}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '20px' }}>
                                        {shipment.shipment_type}
                                    </div>

                                    <div style={{ fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ opacity: 0.7 }}>{shipment.origin}</span>
                                        <span style={{ opacity: 0.4 }}>→</span>
                                        <span style={{ opacity: 0.7 }}>{shipment.destination}</span>
                                    </div>

                                    <div style={{
                                        padding: '6px 15px',
                                        background: `${getStatusColor(shipment.status)}20`,
                                        border: `1px solid ${getStatusColor(shipment.status)}40`,
                                        borderRadius: '50px',
                                        color: getStatusColor(shipment.status),
                                        fontSize: '12px',
                                        width: 'fit-content',
                                        marginBottom: '15px'
                                    }}>
                                        {shipment.status.replace('_', ' ')}
                                    </div>

                                    <div style={{ fontSize: '13px', opacity: 0.6 }}>
                                        AED {shipment.total_logistics_cost?.toLocaleString() || '0'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : showForm ? (
                <>
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back
                    </button>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {editingShipment ? 'Edit Shipment' : 'New Shipment'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>SHIPMENT NUMBER</label>
                                <input
                                    type="text"
                                    name="shipment_number"
                                    value={formData.shipment_number}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!editingShipment}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>TYPE</label>
                                <select name="shipment_type" value={formData.shipment_type} onChange={handleInputChange} style={{ ...inputStyle, background: '#0a0a0a' }}>
                                    {SHIPMENT_TYPES.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>METHOD</label>
                                <select name="shipping_method" value={formData.shipping_method} onChange={handleInputChange} style={{ ...inputStyle, background: '#0a0a0a' }}>
                                    {SHIPPING_METHODS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>ORIGIN</label>
                                <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} required style={inputStyle} placeholder="e.g., Shanghai, China" />
                            </div>
                            <div>
                                <label style={labelStyle}>DESTINATION</label>
                                <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required style={inputStyle} placeholder="e.g., Dubai, UAE" />
                            </div>
                            <div>
                                <label style={labelStyle}>CONTAINER #</label>
                                <input type="text" name="container_number" value={formData.container_number} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>SHIPPED DATE</label>
                                <input type="date" name="shipped_date" value={formData.shipped_date} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>EXPECTED ARRIVAL</label>
                                <input type="date" name="expected_arrival" value={formData.expected_arrival} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>STATUS</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} style={{ ...inputStyle, background: '#0a0a0a' }}>
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>FREIGHT</label>
                                <input type="number" name="freight_cost" value={formData.freight_cost} onChange={handleInputChange} min="0" step="0.01" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>CUSTOMS</label>
                                <input type="number" name="customs_duty" value={formData.customs_duty} onChange={handleInputChange} min="0" step="0.01" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>PORT</label>
                                <input type="number" name="port_charges" value={formData.port_charges} onChange={handleInputChange} min="0" step="0.01" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>INSURANCE</label>
                                <input type="number" name="insurance" value={formData.insurance} onChange={handleInputChange} min="0" step="0.01" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>OTHER</label>
                                <input type="number" name="other_charges" value={formData.other_charges} onChange={handleInputChange} min="0" step="0.01" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={labelStyle}>NOTES</label>
                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '18px 60px',
                                background: 'var(--cream)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#0a0a0a',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {editingShipment ? 'Save Changes' : 'Create Shipment'}
                        </button>
                    </form>
                </>
            ) : selectedShipment && (
                <>
                    <button
                        onClick={() => setSelectedShipment(null)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back to shipments
                    </button>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '20px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedShipment.shipment_number}
                    </h2>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '60px' }}>
                        <div style={{
                            padding: '8px 20px',
                            background: `${getStatusColor(selectedShipment.status)}20`,
                            border: `1px solid ${getStatusColor(selectedShipment.status)}40`,
                            borderRadius: '50px',
                            color: getStatusColor(selectedShipment.status),
                            fontSize: '13px'
                        }}>
                            {selectedShipment.status.replace('_', ' ')}
                        </div>
                        <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '14px' }}>
                            {selectedShipment.shipment_type} • {SHIPPING_METHODS.find(m => m.value === selectedShipment.shipping_method)?.label}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px', maxWidth: '800px' }}>
                        <div style={{ padding: '30px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '15px', letterSpacing: '1px' }}>
                                <MapPin size={16} style={{ display: 'inline', marginRight: '8px', marginBottom: '-2px' }} />
                                ORIGIN
                            </div>
                            <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                {selectedShipment.origin}
                            </div>
                        </div>

                        <div style={{ padding: '30px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '15px', letterSpacing: '1px' }}>
                                <MapPin size={16} style={{ display: 'inline', marginRight: '8px', marginBottom: '-2px' }} />
                                DESTINATION
                            </div>
                            <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                {selectedShipment.destination}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px', maxWidth: '800px' }}>
                        <div style={{ padding: '20px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '8px', letterSpacing: '1px' }}>SHIPPED</div>
                            <div style={{ fontSize: '16px', color: 'var(--cream)' }}>{new Date(selectedShipment.shipped_date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '8px', letterSpacing: '1px' }}>ETA</div>
                            <div style={{ fontSize: '16px', color: 'var(--cream)' }}>{new Date(selectedShipment.expected_arrival).toLocaleDateString()}</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '8px', letterSpacing: '1px' }}>TOTAL COST</div>
                            <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#10b981' }}>
                                AED {selectedShipment.total_logistics_cost?.toLocaleString() || '0'}
                            </div>
                        </div>
                    </div>

                    {selectedShipment.notes && (
                        <div style={{ marginBottom: '40px', maxWidth: '800px' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>NOTES</div>
                            <p style={{ color: 'rgba(232, 230, 227, 0.8)', fontSize: '15px', lineHeight: '1.6' }}>
                                {selectedShipment.notes}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => openEditModal(selectedShipment)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Edit Shipment
                    </button>
                </>
            )}
        </div>
    );
};

const labelStyle = {
    display: 'block',
    color: 'rgba(232, 230, 227, 0.6)',
    fontSize: '13px',
    marginBottom: '10px',
    letterSpacing: '1px'
};

const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    background: 'transparent',
    border: '1px solid rgba(232, 230, 227, 0.3)',
    borderRadius: '10px',
    color: 'var(--cream)',
    fontSize: '15px',
    fontFamily: 'inherit'
};

export default ShipmentManagement;
