import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    Plus, Search, Box, User, CreditCard,
    Printer, AlertTriangle, TrendingUp, Package,
    ArrowUpCircle, ArrowDownCircle, Settings
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const StockList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemRes, statRes] = await Promise.all([
                api.get('/forms/stock/api/items/'),
                api.get('/forms/stock/api/items/inventory_stats/')
            ]);
            setItems(itemRes.data);
            setStats(statRes.data);
        } catch (err) {
            console.error('Error fetching stock data', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bento-section" style={{ padding: '40px 20px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <PrintHeader title="Workshop Inventory & Asset Registry" />

            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', paddingLeft: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div className="pulse-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
                        <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '4px' }}>LIVE STOCK MONITOR</div>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '3rem', fontWeight: '900', margin: 0 }}>Stock Central</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '700',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                        <Printer size={18} /> Export Registry
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/stock/scanner')}
                        style={{
                            background: 'rgba(176, 141, 87, 0.15)',
                            border: '1px solid rgba(176, 141, 87, 0.4)',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        <Settings size={18} color="#b08d57" /> Smart Scanner
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/stock/create')}
                        style={{
                            background: '#b08d57',
                            color: '#000',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '900',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} /> New Item
                    </button>
                </div>
            </header>

            {/* Top Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px', padding: '0 20px' }}>
                <InventoryStatCard
                    label="Asset Value"
                    value={`AED ${stats?.total_value?.toLocaleString() || 0}`}
                    icon={<TrendingUp size={20} color="#b08d57" />}
                    sub="Current Stock Capital"
                />
                <InventoryStatCard
                    label="Low Stock Alert"
                    value={stats?.low_stock_count || 0}
                    icon={<AlertTriangle size={20} color={stats?.low_stock_count > 0 ? "#f43f5e" : "#64748b"} />}
                    sub="Critical Buffer Levels"
                    warning={stats?.low_stock_count > 0}
                />
                <InventoryStatCard
                    label="Total SKUs"
                    value={stats?.total_items || 0}
                    icon={<Package size={20} color="#b08d57" />}
                    sub="Managed Workshop Items"
                />
                <InventoryStatCard
                    label="Daily Consumption"
                    value="12 Units"
                    icon={<ArrowDownCircle size={20} color="#3b82f6" />}
                    sub="Projected Outflow"
                />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', position: 'relative', padding: '0 20px' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by SKU, Name or Category..."
                    style={{ paddingLeft: '45px', flex: 1, background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ padding: '0 20px' }}>
                <GlassCard style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--input-bg)', borderBottom: '1px solid rgba(176, 141, 87, 0.2)' }}>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '10px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>Item Name / SKU</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '10px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>Balance</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '10px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>Safety</th>
                                <th style={{ padding: '20px', textAlign: 'center', fontSize: '10px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>Status</th>
                                <th style={{ padding: '20px', textAlign: 'right', fontSize: '10px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Syncing Industrial Ledger...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No inventory items registered.</td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }} className="stock-row">
                                    <td style={{ padding: '25px 20px' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '16px', marginBottom: '5px' }}>{item.name}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>{item.category}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '18px' }}>{parseFloat(item.current_stock).toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.unit}</span></div>
                                        <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>ONLINE</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '700' }}>{item.safety_level} {item.unit}</div>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                        <StockStatusIndicator current={parseFloat(item.current_stock)} safety={parseFloat(item.safety_level)} />
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => navigate('/stock/movement', { state: { itemId: item.id } })}
                                                style={{
                                                    background: 'rgba(176,141,87,0.1)',
                                                    border: '1px solid rgba(176,141,87,0.3)',
                                                    color: '#b08d57',
                                                    padding: '8px 20px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '900',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(176,141,87,0.2)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(176,141,87,0.1)'}
                                            >
                                                ADJUST
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassCard>
            </div>
        </div>
    );
};

const InventoryStatCard = ({ label, value, icon, sub, warning }) => (
    <GlassCard style={{ padding: '30px', position: 'relative', overflow: 'hidden', border: warning ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>{icon}</div>
            {warning && <div className="pulse-dot" style={{ background: '#f43f5e', width: '8px', height: '8px', borderRadius: '50%' }} />}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
        <div style={{ fontSize: '11px', color: warning ? '#f43f5e' : 'var(--text-muted)', fontWeight: '600' }}>{sub}</div>
    </GlassCard>
);

const StockStatusIndicator = ({ current, safety }) => {
    let color = '#10b981';
    let label = 'HEALTHY';
    if (current <= 0) { color = '#f43f5e'; label = 'EMPTY'; }
    else if (current <= safety) { color = '#f59e0b'; label = 'CRITICAL'; }

    return (
        <span style={{
            color, background: `${color}1A`,
            padding: '6px 15px', borderRadius: '8px',
            fontSize: '10px', fontWeight: '900',
            border: `1px solid ${color}33`,
            letterSpacing: '1px'
        }}>
            {label}
        </span>
    );
};

export default StockList;
