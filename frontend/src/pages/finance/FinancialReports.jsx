import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    ArrowLeft, Printer, Download, Filter,
    TrendingUp, TrendingDown, FileText, Calendar,
    ChevronRight, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrintHeader from '../../components/PrintHeader';

const FinancialReports = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('LEGER'); // LEGER, PL, INVENTORY
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coa, setCoa] = useState([]);
    const [invStats, setInvStats] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, coaRes, invRes] = await Promise.all([
                axios.get('/finance/api/transactions/'),
                axios.get('/finance/api/accounts/'),
                axios.get('/forms/stock/api/items/inventory_stats/')
            ]);
            setTransactions(txRes.data);
            setCoa(coaRes.data);
            setInvStats(invRes.data);
        } catch (err) {
            console.error('Error fetching reports data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Generating Financial Statements...</div>;

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title={activeTab === 'PL' ? "Profit & Loss Statement" : "General Ledger Report"} />

            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/finance')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE REPORTING</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>Fiscal Hub</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <TabButton active={activeTab === 'LEGER'} onClick={() => setActiveTab('LEGER')}>General Ledger</TabButton>
                        <TabButton active={activeTab === 'PL'} onClick={() => setActiveTab('PL')}>Profit & Loss</TabButton>
                        <TabButton active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')}>Inventory Value</TabButton>
                    </div>
                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: '#fff', cursor: 'pointer' }}>
                        <Printer size={18} /> Print
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </header>

            {activeTab === 'LEGER' ? (
                <LedgerView transactions={transactions} />
            ) : activeTab === 'PL' ? (
                <ProfitLossView transactions={transactions} coa={coa} />
            ) : (
                <InventoryView stats={invStats} />
            )}

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; }
                }
            `}</style>
        </div>
    );
};

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: active ? '#b08d57' : 'transparent',
            color: active ? '#fff' : '#94a3b8',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}
    >
        {children}
    </button>
);

const LedgerView = ({ transactions }) => (
    <GlassCard style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Comprehensive Transaction Ledger</h3>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Showing all recent journal entries</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Ref / Invoice</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Department</th>
                        <th style={{ padding: '15px', textAlign: 'right' }}>Debit (Out)</th>
                        <th style={{ padding: '15px', textAlign: 'right' }}>Credit (In)</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '15px', fontSize: '13px', color: '#94a3b8' }}>
                                {new Date(tx.date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '15px', fontWeight: '700', color: '#b08d57' }}>{tx.reference || '--'}</td>
                            <td style={{ padding: '15px', fontWeight: '600', fontSize: '14px' }}>{tx.description}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
                                    {tx.department}
                                </span>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right', fontWeight: '800', color: tx.transaction_type === 'DEBIT' ? '#f43f5e' : '#fff' }}>
                                {tx.transaction_type === 'DEBIT' ? `AED ${parseFloat(tx.amount).toLocaleString()}` : '--'}
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right', fontWeight: '800', color: tx.transaction_type === 'CREDIT' ? '#10b981' : '#fff' }}>
                                {tx.transaction_type === 'CREDIT' ? `AED ${parseFloat(tx.amount).toLocaleString()}` : '--'}
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No transactions recorded in the current ledger.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </GlassCard>
);

const ProfitLossView = ({ transactions, coa }) => {
    // Basic P&L aggregation
    const revenue = transactions.filter(t => t.transaction_type === 'CREDIT').reduce((s, t) => s + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => t.transaction_type === 'DEBIT').reduce((s, t) => s + parseFloat(t.amount), 0);
    const net = revenue - expenses;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <GlassCard style={{ padding: '40px' }}>
                <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900' }}>Profit & Loss Statement</h3>

                <SectionHeader>1. OPERATING REVENUE</SectionHeader>
                <ReportRow label="Service Revenue" value={revenue} primary />
                <ReportRow label="Other Income" value={0} indent />
                <ReportRow label="Total Revenue" value={revenue} total />

                <div style={{ height: '30px' }}></div>

                <SectionHeader>2. OPERATING EXPENSES</SectionHeader>
                <ReportRow label="Cost of Operations" value={expenses} primary />
                <ReportRow label="Marketing Expense" value={0} indent />
                <ReportRow label="Salaries & Benefits" value={0} indent />
                <ReportRow label="Total Expenses" value={expenses} total color="#f43f5e" />

                <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>NET OPERATING INCOME</span>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: net >= 0 ? '#10b981' : '#f43f5e' }}>
                            AED {net.toLocaleString()}
                        </span>
                    </div>
                </div>
            </GlassCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <GlassCard style={{ padding: '30px' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#b08d57' }}>FISCAL SUMMARY</h4>
                    <SummaryMetric label="Gross Margin" value="100%" color="#10b981" />
                    <SummaryMetric label="Expense Ratio" value={`${((expenses / revenue) * 100 || 0).toFixed(1)}%`} color="#f43f5e" />
                    <SummaryMetric label="Net Profit Margin" value={`${((net / revenue) * 100 || 0).toFixed(1)}%`} color="#3b82f6" />
                </GlassCard>

                <GlassCard style={{ padding: '30px', background: 'rgba(176,141,87,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <FileText color="#b08d57" />
                        <h4 style={{ margin: 0, fontWeight: '800' }}>Auditor Note</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                        This statement reflects all transactions recorded in the General Ledger as of today. Automated revenue from paid invoices is included.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
};

const InventoryView = ({ stats }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <GlassCard style={{ padding: '40px' }}>
            <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900' }}>Workshop Inventory Valuation</h3>

            <SectionHeader>ASSET CATEGORIES</SectionHeader>
            {stats?.category_breakdown?.map((cat, i) => (
                <ReportRow key={i} label={cat.label} value={0} primary />
            ))}

            <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>TOTAL INVENTORY ASSET VALUE</span>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#b08d57' }}>
                        AED {stats?.total_value?.toLocaleString() || 0}
                    </span>
                </div>
            </div>
        </GlassCard>

        <GlassCard style={{ padding: '30px' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#b08d57' }}>STOCK HEALTH</h4>
            <SummaryMetric label="Critical Items" value={stats?.low_stock_count || 0} color="#f43f5e" />
            <SummaryMetric label="Healthy Items" value={(stats?.total_items || 0) - (stats?.low_stock_count || 0)} color="#10b981" />
            <div style={{ height: '20px' }}></div>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
                Asset values are calculated based on Unit Cost * Current Balance for each SKU in the industrial ledger.
            </p>
        </GlassCard>
    </div>
);

const SectionHeader = ({ children }) => (
    <div style={{ fontSize: '11px', fontWeight: '900', color: '#b08d57', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>
        {children}
    </div>
);

const ReportRow = ({ label, value, indent, total, primary, color }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 10px',
        paddingLeft: indent ? '40px' : '10px',
        borderBottom: total ? 'none' : '1px solid rgba(255,255,255,0.02)',
        background: total ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderRadius: total ? '10px' : '0'
    }}>
        <span style={{
            color: total || primary ? '#fff' : '#94a3b8',
            fontWeight: total || primary ? '800' : '500',
            fontSize: total ? '15px' : '14px'
        }}>{label}</span>
        <span style={{
            color: color || '#fff',
            fontWeight: total || primary ? '900' : '600',
            fontSize: total ? '16px' : '14px'
        }}>AED {value.toLocaleString()}</span>
    </div>
);

const SummaryMetric = ({ label, value, color }) => (
    <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
            <span style={{ color: '#94a3b8' }}>{label}</span>
            <span style={{ color: '#fff', fontWeight: '800' }}>{value}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <div style={{ width: value, height: '100%', background: color, borderRadius: '2px' }}></div>
        </div>
    </div>
);

export default FinancialReports;
