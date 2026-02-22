import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ShoppingCart, Clock, CheckCircle,
    Plus, Truck, Package, Download, ChevronRight
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats
} from '../../components/PortfolioComponents';

const ProcurementManager = () => {
    const [orders, setOrders] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, received: 0, total_val: 0 });

    useEffect(() => {
        fetchOrders();
        fetchForecasts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/forms/stock/api/purchase-orders/');
            setOrders(res.data);
            const pending = res.data.filter(o => o.status === 'DRAFT' || o.status === 'SENT').length;
            const received = res.data.filter(o => o.status === 'RECEIVED' || o.status === 'COMPLETED').length;
            const total = res.data.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);
            setStats({ pending, received, total_val: total });
        } catch (err) {
            console.error("Error fetching orders", err);
        }
    };

    const fetchForecasts = async () => {
        try {
            const res = await api.get('/stock/api/items/forecast_stock/');
            setForecasts(res.data.forecasts.filter(f => f.status !== 'OK'));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching forecasts", err);
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: '#10b981', label: 'FULFILLED' };
            case 'RECEIVED': return { color: '#3b82f6', label: 'PARTIAL' };
            case 'SENT': return { color: '#f59e0b', label: 'DISPATCHED' };
            case 'CANCELLED': return { color: '#f43f5e', label: 'VOID' };
            default: return { color: 'rgba(232, 230, 227, 0.4)', label: 'DRAFT' };
        }
    };

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Procurement">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Command center for material acquisition and industrial supply chain fulfillment.">
                    Procurement Ledger
                </PortfolioTitle>
                <PortfolioButton
                    variant="primary"
                    style={{ height: '60px', padding: '0 30px' }}
                >
                    <Plus size={18} /> INITIALIZE NEW PO
                </PortfolioButton>
            </header>

            <PortfolioStats
                stats={[
                    { label: 'ACTIVE ORDERS', value: stats.pending, icon: <Clock size={20} /> },
                    { label: 'FULFILLED', value: stats.received, icon: <CheckCircle size={20} /> },
                    { label: 'COMMITMENT', value: `AED ${stats.total_val.toLocaleString()}`, icon: <ShoppingCart size={20} /> },
                    { label: 'STOCK RISKS', value: forecasts.length, icon: <Package size={20} /> }
                ]}
            />

            {forecasts.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <div style={sectionHeader}>PREDICTIVE SUPPLY INTELLIGENCE // SMART BUY</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {forecasts.map(item => (
                            <div key={item.id} style={{
                                padding: '20px', background: 'rgba(244, 63, 94, 0.05)',
                                border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: '15px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)' }}>{item.name}</div>
                                    <div style={{ fontSize: '10px', opacity: 0.5 }}>SKU: {item.sku}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#f43f5e', fontWeight: '900', fontSize: '12px' }}>OUT IN ~{item.days_remaining} DAYS</div>
                                    <div style={{ fontSize: '9px', opacity: 0.4 }}>ETA: {item.projected_stock_out}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '60px' }}>
                <div style={sectionHeader}>INDUSTRIAL ACQUISITION LOG</div>
                <PortfolioGrid minWidth="450px">
                    {orders.map(order => {
                        const status = getStatusStyle(order.status);
                        return (
                            <PortfolioCard key={order.id} style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <div>
                                        <div style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: '24px',
                                            color: 'var(--cream)',
                                            marginBottom: '5px'
                                        }}>
                                            {order.po_number || `PO-${order.id.toString().padStart(4, '0')}`}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', letterSpacing: '1px' }}>
                                            <Truck size={12} color="var(--gold)" />
                                            {order.supplier_name.toUpperCase()}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        letterSpacing: '2px',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        background: `${status.color}15`,
                                        color: status.color,
                                        border: `1px solid ${status.color}30`
                                    }}>
                                        {status.label}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '20px',
                                    padding: '20px 0',
                                    borderTop: '1px solid rgba(232, 230, 227, 0.05)',
                                    borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
                                    marginBottom: '20px'
                                }}>
                                    <div>
                                        <div style={labelTag}>ISSUED ON</div>
                                        <div style={{ color: 'var(--cream)', fontSize: '14px' }}>{order.order_date}</div>
                                    </div>
                                    <div>
                                        <div style={labelTag}>TOTAL VALUE</div>
                                        <div style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: '900' }}>
                                            AED {parseFloat(order.total_amount).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <PortfolioButton
                                        variant="secondary"
                                        style={{ flex: 1, height: '45px', fontSize: '11px' }}
                                    >
                                        <Download size={14} /> DOWNLOAD PDF
                                    </PortfolioButton>
                                    <PortfolioButton
                                        variant="secondary"
                                        style={{ height: '45px', width: '45px', padding: 0 }}
                                    >
                                        <ChevronRight size={16} />
                                    </PortfolioButton>
                                </div>
                            </PortfolioCard>
                        );
                    })}
                </PortfolioGrid>

                {orders.length === 0 && !loading && (
                    <div style={{
                        padding: '100px 20px',
                        textAlign: 'center',
                        background: 'rgba(232, 230, 227, 0.02)',
                        borderRadius: '20px',
                        border: '1px dashed rgba(232, 230, 227, 0.1)'
                    }}>
                        <ShoppingCart size={40} style={{ color: 'var(--gold)', marginBottom: '20px', opacity: 0.3 }} />
                        <div style={{ color: 'var(--cream)', fontSize: '18px', fontFamily: "'Cormorant Garamond', serif" }}>No Purchase Orders Registered</div>
                        <div style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '12px', marginTop: '10px' }}>Start by initializing a new procurement request.</div>
                    </div>
                )}
            </div>
        </PortfolioPage>
    );
};

const sectionHeader = {
    fontSize: '11px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '30px',
    opacity: 0.8
};

const labelTag = {
    fontSize: '10px',
    color: 'rgba(232, 230, 227, 0.4)',
    marginBottom: '5px',
    letterSpacing: '1px',
    fontWeight: '700'
};

export default ProcurementManager;
