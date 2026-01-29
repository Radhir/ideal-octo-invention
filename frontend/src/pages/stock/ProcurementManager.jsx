import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    FileText, ShoppingCart, Clock, CheckCircle,
    AlertCircle, Plus, Search, ChevronRight,
    Truck, Package, ArrowRight, Download
} from 'lucide-react';

const ProcurementManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, received: 0, total_val: 0 });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/forms/stock/api/purchase-orders/');
            setOrders(res.data);

            const pending = res.data.filter(o => o.status === 'DRAFT' || o.status === 'SENT').length;
            const received = res.data.filter(o => o.status === 'RECEIVED' || o.status === 'COMPLETED').length;
            const total = res.data.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);

            setStats({ pending, received, total_val: total });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders", err);
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
            case 'RECEIVED': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
            case 'SENT': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
            case 'CANCELLED': return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' };
            default: return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Procurement Workflow</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Purchase Orders</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>Track material acquisition and stock fulfillment.</p>
                </div>
                <button
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px',
                        background: 'rgba(176, 141, 87, 0.1)', color: '#b08d57', border: '1px solid #b08d57', borderRadius: '12px',
                        fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                >
                    <Plus size={20} /> CREATE PO
                </button>
            </header>

            {/* QUICK STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={<Clock color="#f59e0b" />} label="Active Orders" value={stats.pending} />
                <StatCard icon={<CheckCircle color="#10b981" />} label="Fulfilled" value={stats.received} />
                <StatCard icon={<ShoppingCart color="#3b82f6" />} label="Commitment" value={`AED ${stats.total_val.toLocaleString()}`} />
                <StatCard icon={<Package color="#8b5cf6" />} label="Total SKUs" value={orders.length * 5} /> {/* Mock SKU count */}
            </div>

            <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={thStyle}>PO NUMBER</th>
                            <th style={thStyle}>SUPPLIER</th>
                            <th style={thStyle}>ORDER DATE</th>
                            <th style={thStyle}>STATUS</th>
                            <th style={thStyle}>TOTAL (AED)</th>
                            <th style={thStyle}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const status = getStatusStyle(order.status);
                            return (
                                <tr key={order.id} style={trStyle}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '900', color: '#fff' }}>{order.po_number}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>#{order.id}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Truck size={14} color="#b08d57" />
                                            </div>
                                            <span style={{ fontWeight: '700' }}>{order.supplier_name}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{order.order_date}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900',
                                            background: status.bg, color: status.color
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '900', color: '#b08d57' }}>
                                            {parseFloat(order.total_amount).toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={actionBtnStyle} title="View Details">
                                                <ChevronRight size={16} />
                                            </button>
                                            <button style={actionBtnStyle} title="Download PDF">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && !loading && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                        <ShoppingCart size={48} style={{ marginBottom: '15px', opacity: 0.2 }} />
                        <p>No purchase orders found. Start by creating your first PO.</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <GlassCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff', marginTop: '2px' }}>{value}</div>
        </div>
    </GlassCard>
);

const thStyle = {
    textAlign: 'left',
    padding: '15px 25px',
    fontSize: '11px',
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const trStyle = {
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    transition: 'background 0.2s'
};

const tdStyle = {
    padding: '20px 25px',
    fontSize: '13px',
    color: '#94a3b8'
};

const actionBtnStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#94a3b8',
    transition: 'all 0.2s'
};

export default ProcurementManager;
