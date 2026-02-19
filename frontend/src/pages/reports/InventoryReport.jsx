import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioSelect,
    PortfolioInput,
    PortfolioGrid,
    PortfolioCard,
    PortfolioStats,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import { Printer, AlertTriangle, Package, Search, Tag, ArrowUpRight, ShieldAlert, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryReport = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        stockLevel: 'ALL', // ALL, LOW, OUT
        category: 'ALL',
        search: ''
    });

    useEffect(() => {
        fetchStock();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, items]);

    const fetchStock = async () => {
        try {
            const res = await api.get('/inventory/api/products/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setItems(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load inventory", err);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...items];

        if (filters.stockLevel === 'LOW') {
            result = result.filter(i => i.quantity <= i.low_stock_threshold);
        } else if (filters.stockLevel === 'OUT') {
            result = result.filter(i => i.quantity <= 0);
        }

        if (filters.category !== 'ALL') {
            result = result.filter(i => i.category === filters.category);
        }

        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(i => i.name.toLowerCase().includes(term) || i.sku?.toLowerCase().includes(term));
        }

        setFilteredItems(result);
    };

    const totalValue = filteredItems.reduce((sum, i) => sum + ((parseFloat(i.cost_price) || 0) * (i.quantity || 0)), 0);
    const lowStockCount = items.filter(i => i.quantity <= i.low_stock_threshold && i.quantity > 0).length;
    const outOfStockCount = items.filter(i => i.quantity <= 0).length;

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px', padding: '100px', textAlign: 'center' }}>AUDITING ASSET INVENTORY...</div></PortfolioPage>;

    const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

    const statsData = [
        { label: "ASSET VALUATION", value: `AED ${totalValue.toLocaleString()}`, color: "var(--gold)" },
        { label: "SKU VOLUME", value: filteredItems.length, color: "#3b82f6" },
        { label: "CRITICAL DEPLETION", value: outOfStockCount, color: "#f43f5e" },
        { label: "SUPPLY WARNINGS", value: lowStockCount, color: "#f59e0b" },
    ];

    return (
        <PortfolioPage breadcrumb="Executive Intelligence / Reports / Asset Evaluation">
            <PortfolioBackButton onClick={() => navigate('/reports')} />

            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle subtitle="Resource audit, stock valuation, and supply chain health telemetry.">
                        Industrial Asset Dossier
                    </PortfolioTitle>
                    <PortfolioButton onClick={handlePrint} variant="primary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> GENERATE AUDIT
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={statsData} />

                <PortfolioCard style={{ marginTop: '60px', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                        <Search size={18} />
                        <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Discovery Filters</span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr',
                        gap: '20px',
                        alignItems: 'end'
                    }}>
                        <PortfolioInput
                            label="SKU / PRODUCT SEARCH"
                            placeholder="Enter keyword or identifier..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{ margin: 0 }}
                        />
                        <PortfolioSelect
                            label="DEPLETION LEVEL"
                            value={filters.stockLevel}
                            onChange={(e) => setFilters({ ...filters, stockLevel: e.target.value })}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL INVENTORY</option>
                            <option value="LOW">SUPPLY WARNING (LOW)</option>
                            <option value="OUT">CRITICAL (OUT OF STOCK)</option>
                        </PortfolioSelect>
                        <PortfolioSelect
                            label="ASSET CATEGORY"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL CATEGORIES</option>
                            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                        </PortfolioSelect>
                    </div>
                </PortfolioCard>
            </div>



            <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)' }}>
                        <thead>
                            <tr style={{ background: 'rgba(232, 230, 227, 0.02)', borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <th style={thStyle}>SKU / ID</th>
                                <th style={thStyle}>PRODUCT NAME</th>
                                <th style={thStyle}>CATALOGUE</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>BALANCE</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>VALUATION (AVG)</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>TOTAL VALUE</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>ASSESSMENT</th>
                                <th style={thStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr><td colSpan="8" style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px', fontWeight: '800', fontSize: '11px' }}>NO ASSETS MATCH CURRENT PARAMETERS</td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }}>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: '800' }}>{item.sku || '--'}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'var(--font-serif)', fontSize: '15px' }}>{item.name}</td>
                                    <td style={{ ...tdStyle, opacity: 0.6, fontSize: '11px', letterSpacing: '1px' }}>{item.category?.toUpperCase() || '--'}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800' }}>{item.quantity}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', opacity: 0.6 }}>AED {parseFloat(item.cost_price || 0).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800', fontSize: '15px' }}>AED {(parseFloat(item.cost_price || 0) * (item.quantity || 0)).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        {item.quantity <= 0 ? (
                                            <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '9px', fontWeight: '900', color: '#f43f5e', letterSpacing: '1px' }}>CRITICAL</span>
                                        ) : item.quantity <= item.low_stock_threshold ? (
                                            <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '9px', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px' }}>WARNING</span>
                                        ) : (
                                            <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '9px', fontWeight: '900', color: '#10b981', letterSpacing: '1px' }}>HEALTHY</span>
                                        )}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/inventory/${item.id}`)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(232, 230, 227, 0.2)', cursor: 'pointer' }}
                                        >
                                            <ArrowUpRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ background: 'rgba(176, 141, 87, 0.05)' }}>
                                <td colSpan="5" style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', letterSpacing: '2px', fontSize: '11px', color: 'var(--gold)' }}>AGGREGATED ASSET VALUE</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', color: 'var(--cream)', fontSize: '18px' }}>AED {totalValue.toLocaleString()}</td>
                                <td colSpan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </PortfolioCard>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '25px 20px',
    textAlign: 'left',
    color: 'var(--gold)',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '2px',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '20px',
    fontSize: '13px',
    color: 'var(--cream)',
    fontWeight: '300'
};

export default InventoryReport;
