import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioBackButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import {
    Printer, FileText, Activity, ChevronRight, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrintHeader from '../../components/PrintHeader';
import DateRangePicker from '../../components/finance/DateRangePicker';

const FinancialReports = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('LEGER'); // LEGER, PL, INVENTORY
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [invStats, setInvStats] = useState(null);
    const [plData, setPlData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [filters, setFilters] = useState({ search: '', department: 'ALL' });

    const fetchData = useCallback(async () => {
        try {
            const [txRes, coaRes, invRes, plRes] = await Promise.all([
                api.get(`/finance/api/transactions/?start_date=${startDate}&end_date=${endDate}`),
                api.get('/finance/api/accounts/'),
                api.get('/forms/stock/api/items/inventory_stats/'),
                api.get(`/reports/api/yearly-pl/?year=${selectedYear}&start_date=${startDate}&end_date=${endDate}`)
            ]);
            setTransactions(txRes.data);
            setInvStats(invRes.data);
            setPlData(plRes.data);
        } catch (err) {
            console.error('Error fetching reports data', err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, selectedYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div style={{ color: 'var(--cream)', padding: '80px', textAlign: 'center', opacity: 0.5 }}>Generating Financial Statements...</div>;

    return (
        <PortfolioPage breadcrumb={`FINANCE // REPORTS // ${activeTab}`}>
            <PrintHeader title={activeTab === 'PL' ? "Profit & Loss Statement" : "General Ledger Report"} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end' }}>
                    <PortfolioBackButton onClick={() => navigate('/finance')} />
                    <PortfolioTitle subtitle="Executive examination of fiscal performance, operational yield, and asset valuation.">
                        FINANCIAL STATEMENTS
                    </PortfolioTitle>
                </div>

                <div className="no-print" style={{ display: 'flex', gap: '15px' }}>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                        onApply={fetchData}
                        styled
                    />
                    <PortfolioButton variant="secondary" onClick={() => window.print()}>
                        <Printer size={16} /> PRINT
                    </PortfolioButton>
                </div>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '50px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)', paddingBottom: '20px' }}>
                <TabButton active={activeTab === 'LEGER'} onClick={() => setActiveTab('LEGER')}>General Ledger</TabButton>
                <TabButton active={activeTab === 'PL'} onClick={() => setActiveTab('PL')}>Profit & Loss</TabButton>
                <TabButton active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')}>Inventory Valuation</TabButton>
            </div>

            {
                activeTab === 'LEGER' ? (
                    <LedgerView
                        transactions={transactions.filter(t => {
                            const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) || (t.reference || '').toLowerCase().includes(filters.search.toLowerCase());
                            const matchesDept = filters.department === 'ALL' || t.department === filters.department;
                            return matchesSearch && matchesDept;
                        })}
                        filters={filters}
                        setFilters={setFilters}
                    />
                ) : activeTab === 'PL' ? (
                    <ProfitLossView data={plData} year={selectedYear} onYearChange={(yr) => { setSelectedYear(yr); fetchData(); }} />
                ) : (
                    <InventoryView stats={invStats} />
                )
            }


        </PortfolioPage>
    );
};

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: active ? 'rgba(232, 230, 227, 0.05)' : 'transparent',
            color: active ? 'var(--gold)' : 'rgba(232, 230, 227, 0.4)',
            border: active ? '1px solid var(--gold)' : '1px solid transparent',
            fontWeight: '800',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '2px'
        }}
    >
        {children}
    </button>
);

const LedgerView = ({ transactions, filters, setFilters }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <PortfolioSectionTitle>COMPREHENSIVE TRANSACTION LEDGER</PortfolioSectionTitle>
                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', marginTop: '5px', fontWeight: '800', letterSpacing: '1px' }}>AUDIT TRAIL: {transactions.length} ENTRIES IDENTIFIED</div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <input
                    placeholder="Search ledger..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    style={{
                        background: 'rgba(232, 230, 227, 0.05)',
                        border: '1px solid rgba(232, 230, 227, 0.1)',
                        color: 'var(--cream)',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        width: '250px',
                        fontSize: '12px',
                        outline: 'none'
                    }}
                />
                <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    style={{
                        background: 'rgba(232, 230, 227, 0.05)',
                        border: '1px solid rgba(232, 230, 227, 0.1)',
                        color: 'var(--cream)',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="ALL">ALL DEPARTMENTS</option>
                    <option value="OPERATIONS">OPERATIONS</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="HR">HR & VISA</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="GENERAL">GENERAL & ADMIN</option>
                </select>
            </div>
        </div>

        <div style={{
            background: 'rgba(232, 230, 227, 0.02)',
            border: '1.5px solid rgba(232, 230, 227, 0.1)',
            borderRadius: '24px',
            overflow: 'hidden'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(232, 230, 227, 0.05)', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Reference</th>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Dept</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Debit (Out)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Credit (In)</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                            <td style={tdStyle}>{new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '700' }}>{tx.reference || '--'}</td>
                            <td style={{ ...tdStyle, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tx.description}</td>
                            <td style={tdStyle}>
                                <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '1px', opacity: 0.6 }}>{tx.department}</span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '400', color: tx.transaction_type === 'DEBIT' ? '#ef4444' : 'var(--cream)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                                {tx.transaction_type === 'DEBIT' ? `AED ${parseFloat(tx.amount).toLocaleString()}` : '--'}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '400', color: tx.transaction_type === 'CREDIT' ? '#10b981' : 'var(--cream)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                                {tx.transaction_type === 'CREDIT' ? `AED ${parseFloat(tx.amount).toLocaleString()}` : '--'}
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '13px', letterSpacing: '1px' }}>NO TRANSACTIONS RECORDED IN THIS FISCAL PERIOD</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const ProfitLossView = ({ data, year, onYearChange }) => {
    if (!data) return null;
    const { p_l_statement, departmental_performance } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
            <PortfolioCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <PortfolioSectionTitle>PROFIT & LOSS STATEMENT ({year})</PortfolioSectionTitle>
                    <select
                        value={year}
                        onChange={(e) => onYearChange(e.target.value)}
                        style={{ background: 'rgba(232, 230, 227, 0.05)', border: '1px solid rgba(232, 230, 227, 0.1)', color: 'var(--cream)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}
                    >
                        {[2024, 2025, 2026].map(yr => <option key={yr} value={yr} style={{ background: '#0a0a0a' }}>{yr}</option>)}
                    </select>
                </div>

                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>1. OPERATING REVENUE</div>
                <ReportRow label="Service Revenue" value={p_l_statement.total_revenue} primary />
                <ReportRow label="Total Revenue" value={p_l_statement.total_revenue} total />

                <div style={{ height: '40px' }}></div>

                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>2. OPERATING EXPENSES</div>
                {departmental_performance.map((dept, i) => (
                    <ReportRow key={i} label={dept.name} value={dept.expenses} indent />
                ))}
                <ReportRow label="Total Operating Expenses" value={p_l_statement.total_expenses} total isNegative />

                <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid rgba(232, 230, 227, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--cream)', letterSpacing: '1px' }}>RETAINED FISCAL PERFORMANCE</span>
                        <span style={{ fontSize: '42px', fontWeight: '300', color: p_l_statement.net_profit_loss >= 0 ? '#10b981' : '#f43f5e', fontFamily: 'var(--font-serif)' }}>
                            AED {p_l_statement.net_profit_loss.toLocaleString()}
                        </span>
                    </div>
                </div>
            </PortfolioCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <PortfolioCard borderColor="var(--gold)">
                    <h4 style={{ margin: '0 0 30px 0', fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>FISCAL SUMMARY</h4>
                    <SummaryMetric label="Gross Margin" value="100%" color="#10b981" />
                    <SummaryMetric label="Expense Ratio" value={`${((p_l_statement.total_expenses / p_l_statement.total_revenue) * 100 || 0).toFixed(1)}%`} color="#f43f5e" />
                    <SummaryMetric label="Net Profit Margin" value={`${((p_l_statement.net_profit_loss / p_l_statement.total_revenue) * 100 || 0).toFixed(1)}%`} color="#3b82f6" />
                </PortfolioCard>

                <PortfolioCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <FileText color="var(--gold)" size={20} />
                        <h4 style={{ margin: 0, fontWeight: '800', fontSize: '14px', color: 'var(--cream)' }}>AUDITOR NOTE</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.7)', lineHeight: '1.6' }}>
                        This statement reflects all transactions recorded in the General Ledger for the selected fiscal year and is subject to live adjustments.
                    </p>
                </PortfolioCard>
            </div>
        </div>
    );
};

const InventoryView = ({ stats }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
        <PortfolioCard>
            <PortfolioSectionTitle>WORKSHOP INVENTORY VALUATION</PortfolioSectionTitle>
            <div style={{ height: '30px' }}></div>

            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>ASSET CATEGORIES</div>
            {stats?.category_breakdown?.map((cat, i) => (
                <ReportRow key={i} label={cat.label} value={cat.value || 0} primary />
            ))}

            <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid rgba(232, 230, 227, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--cream)', letterSpacing: '1px' }}>TOTAL INVENTORY ASSET VALUE</span>
                    <span style={{ fontSize: '42px', fontWeight: '300', color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>
                        AED {stats?.total_value?.toLocaleString() || 0}
                    </span>
                </div>
            </div>
        </PortfolioCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <PortfolioCard borderColor="var(--gold)">
                <h4 style={{ margin: '0 0 30px 0', fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>STOCK HEALTH</h4>
                <SummaryMetric label="Critical Items" value={stats?.low_stock_count || 0} color="#f43f5e" />
                <SummaryMetric label="Healthy Items" value={(stats?.total_items || 0) - (stats?.low_stock_count || 0)} color="#10b981" />
                <div style={{ height: '30px' }}></div>
                <p style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', lineHeight: '1.6', fontWeight: '600' }}>
                    Asset values are calculated based on Unit Cost * Current Balance for each SKU in the industrial ledger.
                </p>
            </PortfolioCard>
        </div>
    </div>
);

const ReportRow = ({ label, value, primary, total, indent, isNegative }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 10px',
        paddingLeft: indent ? '40px' : '10px',
        borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
        background: total ? 'rgba(232, 230, 227, 0.03)' : 'transparent',
        borderRadius: total ? '12px' : '0',
    }}>
        <span style={{
            color: total || primary ? 'var(--cream)' : 'rgba(232, 230, 227, 0.6)',
            fontWeight: '600',
            fontSize: total ? '15px' : '13px',
            textTransform: total || primary ? 'uppercase' : 'none',
            letterSpacing: total || primary ? '1px' : '0'
        }}>{label}</span>
        <span style={{
            color: isNegative ? '#f43f5e' : 'var(--cream)',
            fontWeight: '300',
            fontSize: total ? '20px' : '16px',
            fontFamily: 'var(--font-serif)'
        }}>{isNegative ? '-' : ''}AED {value.toLocaleString()}</span>
    </div>
);

const SummaryMetric = ({ label, value, color }) => (
    <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '10px' }}>
            <span style={{ color: 'rgba(232, 230, 227, 0.7)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
            <span style={{ color: 'var(--cream)', fontWeight: '800' }}>{value}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: value, height: '100%', background: color, borderRadius: '10px', boxShadow: `0 0 10px ${color}44` }}></div>
        </div>
    </div>
);

const thStyle = {
    padding: '25px 30px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.8
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.9
};

export default FinancialReports;
