import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Box, User, CreditCard,
    Printer, AlertTriangle, TrendingUp, Package,
    ArrowUpCircle, ArrowDownCircle, Settings, ChevronRight
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
                        <PortfolioButton variant="secondary" style={{ padding: '0 20px', height: '48px' }}>
                            <Printer size={18} />
                        </PortfolioButton>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {loading ? (
                            <div style={{ color: 'var(--cream)', padding: '100px', textAlign: 'center', letterSpacing: '2px', fontWeight: '800' }}>RECOVERING INDUSTRIAL LEDGER...</div>
                        ) : filteredItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)', fontFamily: 'var(--font-serif)' }}>
                                NO ASSETS RECORDED IN THE CURRENT PARAMETERS.
                            </div>
                        ) : (
                            <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                                {filteredItems.map(item => (
                                    <PortfolioCard
                                        key={item.id}
                                        style={{
                                            padding: '40px',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                                        }}
                                        className="workflow-card"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                            <div style={skuBadgeStyle}>
                                                <Package size={14} color="var(--gold)" />
                                                <span>{item.sku || 'NO SKU'}</span>
                                            </div>
                                            <StockStatusIndicator current={parseFloat(item.current_stock)} safety={parseFloat(item.safety_level)} />
                                        </div>
                                        -
                                        <div style={{ marginBottom: '30px' }}>
                                            <h3 style={assetNameStyle}>{item.name}</h3>
                                            <div style={{ ...categoryStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }} />
                                                {item.category.toUpperCase()}
                                            </div>
                                        </div>
                                        -
                                        <div style={balanceBox}>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={labelTag}>CURRENT BALANCE</div>
                                                <div style={balanceValue}>
                                                    {parseFloat(item.current_stock).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(232, 230, 227, 0.2)', marginLeft: '4px' }}>{item.unit.toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={labelTag}>SAFETY LIMIT</div>
                                                <div style={{ fontSize: '18px', fontWeight: '700', color: 'rgba(232, 230, 227, 0.4)', marginTop: '8px', fontFamily: 'var(--font-serif)' }}>
                                                    {item.safety_level} <span style={{ fontSize: '10px' }}>{item.unit.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        -
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                                            <PortfolioButton
                                                onClick={() => navigate('/stock/movement', { state: { itemId: item.id } })}
                                                variant="secondary"
                                                style={{ flex: 1, fontSize: '10px', height: '52px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                                            >
                                                ADJUST QUANTITY
                                            </PortfolioButton>
                                            <PortfolioButton
                                                variant="gold"
                                                style={{ height: '52px', width: '52px', padding: 0, borderRadius: '12px' }}
                                                onClick={() => navigate(`/stock/items/${item.id}`)}
                                            >
                                                <ChevronRight size={20} />
                                            </PortfolioButton>
                                        </div>
                                    </PortfolioCard>
                                ))}
                            </PortfolioGrid>
                        )}
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

const assetNameStyle = {
    fontSize: '26px',
    fontWeight: '300',
    color: 'var(--cream)',
    marginBottom: '8px',
    fontFamily: 'var(--font-serif)',
    letterSpacing: '0.5px'
};

const categoryStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--gold)',
    letterSpacing: '2px',
    opacity: 0.6
};

const balanceBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderTop: '1px solid rgba(232, 230, 227, 0.03)',
    borderBottom: '1px solid rgba(232, 230, 227, 0.03)'
};

const labelTag = {
    fontSize: '9px',
    fontWeight: '900',
    color: 'rgba(232, 230, 227, 0.3)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase'
};

const balanceValue = {
    fontSize: '32px',
    fontWeight: '100',
    color: 'var(--cream)',
    fontFamily: 'var(--font-serif)',
    marginTop: '5px'
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
