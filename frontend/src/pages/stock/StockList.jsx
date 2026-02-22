import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Box, User, CreditCard,
    Printer, AlertTriangle, TrendingUp, Package,
    ArrowUpCircle, ArrowDownCircle, Settings, ChevronRight, Filter
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard
} from '../../components/PortfolioComponents';

const StockList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('REGISTRY');
    const [pendingItems, setPendingItems] = useState([]);
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
        fetchPending();
    }, []);

    const fetchData = async () => {
        try {
            const [itemRes, statRes] = await Promise.all([
                api.get('/forms/stock/api/items/'),
                api.get('/forms/stock/api/items/inventory_stats/')
            ]);
            setItems(itemRes.data.results || itemRes.data || []);
            setStats(statRes.data);
        } catch (err) {
            console.error('Error fetching stock data', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPending = async () => {
        try {
            const res = await api.get('/forms/stock/api/movements/?status=PENDING');
            setPendingItems(res.data.results || res.data || []);
        } catch (err) {
            console.error('Error fetching pending', err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/forms/stock/api/movements/${id}/approve/`);
            // Refresh both lists as approval changes stock
            fetchData();
            fetchPending();
            alert("Movement Approved & Stock Updated.");
        } catch (err) {
            alert("Approval Failed.");
        }
    };

    const filteredItems = (items || []).filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const portfolioStats = [
        { value: `AED ${(stats?.total_value / 1000 || 0).toFixed(1)}K`, label: 'INVENTORY VALUE', color: 'var(--gold)' },
        { value: pendingItems.length, label: 'PENDING APPROVALS', color: pendingItems.length > 0 ? '#f59e0b' : '#10b981' },
        { value: stats?.total_items || 0, label: 'MANAGED SKUS' }
    ];

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Asset Management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A strategic registry of high-performance materials and workshop essentials.">
                    Asset Registry
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => navigate('/stock/scanner')} variant="secondary" style={{ borderRadius: '14px', padding: '12px 24px' }}>
                        <Settings size={18} style={{ marginRight: '8px' }} /> SMART SCANNER
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/stock/create')} variant="gold" style={{ borderRadius: '14px', padding: '12px 24px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> INITIALIZE ASSET
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={portfolioStats} />

            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '60px',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {['REGISTRY', 'APPROVALS'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 30px',
                            background: activeTab === tab ? 'var(--gold)' : 'transparent',
                            border: 'none',
                            color: activeTab === tab ? '#000' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '10px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            boxShadow: activeTab === tab ? '0 10px 20px rgba(176,141,87,0.2)' : 'none'
                        }}
                    >
                        {tab} {tab === 'APPROVALS' && pendingItems.length > 0 && `(${pendingItems.length})`}
                    </button>
                ))}
            </div>

            {activeTab === 'REGISTRY' && (
                <>
                    <div style={{ marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'center', marginTop: '30px' }}>
                        <div style={searchContainerStyle}>
                            <Search size={18} color="rgba(232, 230, 227, 0.2)" />
                            <input
                                type="text"
                                placeholder="Search Registry (Name, SKU, Category)..."
                                style={searchInputStyle}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <PortfolioButton variant="secondary" style={{ padding: '0 20px', height: '48px' }}>
                                <Filter size={18} />
                            </PortfolioButton>
                            <PortfolioButton variant="secondary" style={{ padding: '0 20px', height: '48px' }}>
                                <Printer size={18} />
                            </PortfolioButton>
                        </div>
                    </div>

                    <div style={ledgerWrapperStyle}>
                        <table style={ledgerTableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>SKU / IDENTIFIER</th>
                                    <th style={thStyle}>ASSET NAME</th>
                                    <th style={thStyle}>CATEGORY</th>
                                    <th style={thStyle}>BALANCE</th>
                                    <th style={thStyle}>STATUS</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.3)' }}>
                                            RECOVERING INDUSTRIAL LEDGER...
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)' }}>
                                            NO ASSETS RECORDED IN THE CURRENT PARAMETERS.
                                        </td>
                                    </tr>
                                ) : filteredItems.map(item => (
                                    <tr key={item.id} style={ledgerRowStyle} className="ledger-row">
                                        <td style={tdStyle}>
                                            <div style={skuBadgeStyle}>
                                                <Package size={12} style={{ opacity: 0.5 }} />
                                                {item.sku || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, color: 'var(--cream)', fontWeight: '600' }}>
                                            {item.name}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={categoryPillStyle}>{item.category?.toUpperCase()}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ color: 'var(--cream)', fontSize: '15px', fontWeight: '700' }}>
                                                {parseFloat(item.current_stock).toLocaleString()}
                                                <span style={{ fontSize: '10px', opacity: 0.4, marginLeft: '6px' }}>{item.unit.toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <StockStatusIndicator current={parseFloat(item.current_stock)} safety={parseFloat(item.safety_level)} />
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => navigate('/stock/movement', { state: { itemId: item.id } })}
                                                    style={ledgerBtnStyle}
                                                    title="Adjust Stock"
                                                >
                                                    <Activity size={14} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/stock/items/${item.id}`)}
                                                    style={{ ...ledgerBtnStyle, color: 'var(--gold)' }}
                                                    title="View Details"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'APPROVALS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
                    {pendingItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
                            <div style={{ fontSize: '18px', fontWeight: '700' }}>All Caught Up</div>
                            <p style={{ fontSize: '13px' }}>No pending stock movements awaiting approval.</p>
                        </div>
                    ) : (
                        pendingItems.map(move => (
                            <PortfolioCard key={move.id} style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                        <span style={{
                                            background: move.type === 'IN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: move.type === 'IN' ? '#10b981' : '#f43f5e',
                                            padding: '4px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '900'
                                        }}>
                                            {move.type === 'IN' ? 'ENTRY' : 'EXIT'}
                                        </span>
                                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>{move.item_name}</span>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                                        {parseFloat(move.quantity)} Units via Scanner • by {move.recorded_by || 'Unknown'} • {new Date(move.date).toLocaleString()}
                                    </div>
                                </div>
                                <PortfolioButton
                                    onClick={() => handleApprove(move.id)}
                                    variant="primary"
                                    style={{ padding: '0 25px', height: '40px', fontSize: '11px' }}
                                >
                                    APPROVE
                                </PortfolioButton>
                            </PortfolioCard>
                        ))
                    )}
                </div>
            )}
        </PortfolioPage>
    );
};

const ledgerWrapperStyle = {
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
};

const ledgerTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const thStyle = {
    padding: '25px 30px',
    fontSize: '10px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    background: 'rgba(232, 230, 227, 0.03)',
    borderBottom: '1px solid rgba(232, 230, 227, 0.08)'
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.5)',
    borderBottom: '1px solid rgba(232, 230, 227, 0.03)'
};

const ledgerRowStyle = {
    transition: 'all 0.3s ease',
    cursor: 'default'
};

const categoryPillStyle = {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--gold)',
    background: 'rgba(176, 141, 87, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '1px'
};

const ledgerBtnStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: 'var(--cream)',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s'
};

const skuBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(232, 230, 227, 0.02)',
    color: 'rgba(232, 230, 227, 0.4)',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '900',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    letterSpacing: '1px'
};

const searchContainerStyle = {
    flex: 1,
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '16px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    height: '48px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    padding: '15px 0',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'var(--font-serif)'
};

const StockStatusIndicator = ({ current, safety }) => {
    let color = '#10b981';
    let label = 'OPTIMAL';
    if (current <= 0) { color = '#f43f5e'; label = 'EMPTY'; }
    else if (current <= safety) { color = '#f59e0b'; label = 'LOW STOCK'; }

    return (
        <span style={{
            color,
            background: `${color}10`,
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '9px',
            fontWeight: '900',
            border: `1px solid ${color}20`,
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div className={`status-pulse ${label !== 'OPTIMAL' ? 'active' : ''}`} style={{ background: color, width: '6px', height: '6px' }} />
            {label}
        </span>
    );
};

export default StockList;
