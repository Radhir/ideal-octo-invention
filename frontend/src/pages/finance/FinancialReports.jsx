import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    ArrowLeft, Printer, Download, Filter,
    TrendingUp, TrendingDown, FileText, Calendar,
    ChevronRight, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrintHeader from '../../components/PrintHeader';
import DateRangePicker from '../../components/finance/DateRangePicker';

const FinancialReports = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('LEGER'); // LEGER, PL, INVENTORY
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coa, setCoa] = useState([]);
    const [invStats, setInvStats] = useState(null);
    const [plData, setPlData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [filters, setFilters] = useState({ search: '', department: 'ALL' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, coaRes, invRes, plRes] = await Promise.all([
                api.get(`/finance/api/transactions/?start_date=${startDate}&end_date=${endDate}`),
                api.get('/finance/api/accounts/'),
                api.get('/forms/stock/api/items/inventory_stats/'),
                api.get(`/reports/api/yearly-pl/?year=${selectedYear}&start_date=${startDate}&end_date=${endDate}`)
            ]);
            setTransactions(txRes.data);
            setCoa(coaRes.data);
            setInvStats(invRes.data);
            setPlData(plRes.data);
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

            <div style={{ display: 'flex', gap: '15px' }}>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onApply={fetchData}
                />
                <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)' }}>
                    <Printer size={18} /> Print
                </button>
            </div>
        </header>

            {
        activeTab === 'LEGER' ? (
            <LedgerView
                transactions={transactions.filter(t => {
                    const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) || t.reference.toLowerCase().includes(filters.search.toLowerCase());
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

    <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; }
                }
            `}</style>
        </div >
    );
};

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: active ? '1.5px solid var(--gold-border)' : '1.5px solid transparent',
            background: active ? 'var(--gold-glow)' : 'transparent',
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase'
        }}
    >
        {children}
    </button>
);

const LedgerView = ({ transactions, filters, setFilters }) => (
    <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>Comprehensive Transaction Ledger</h3>
                <div style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '5px', fontWeight: '900', letterSpacing: '1px' }}>AUDIT TRAIL: {transactions.length} ENTRIES FOUND</div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <input
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', padding: '8px 15px', borderRadius: '8px', width: '200px', fontSize: '13px', fontWeight: '800' }}
                />
                <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', padding: '8px 15px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '800' }}
                >
                    <option value="ALL">All Departments</option>
                    <option value="OPERATIONS">Operations</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="HR">HR & Visa</option>
                    <option value="INVENTORY">Inventory</option>
                    <option value="GENERAL">General & Admin</option>
                </select>
            </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--gold-border)', color: 'var(--gold)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '900' }}>
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
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '15px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '800' }}>
                                {new Date(tx.date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '15px', fontWeight: '900', color: 'var(--gold)' }}>{tx.reference || '--'}</td>
                            <td style={{ padding: '15px', fontWeight: '900', fontSize: '14px', color: 'var(--text-primary)' }}>{tx.description}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{ fontSize: '11px', background: 'var(--gold-glow)', color: 'var(--gold)', padding: '4px 10px', border: '1px solid var(--gold-border)', borderRadius: '8px', fontWeight: '900' }}>
                                    {tx.department}
                                </span>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right', fontWeight: '900', color: tx.transaction_type === 'DEBIT' ? '#ef4444' : 'var(--text-primary)' }}>
                                {tx.transaction_type === 'DEBIT' ? `AED ${parseFloat(tx.amount).toLocaleString()}` : '--'}
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right', fontWeight: '900', color: tx.transaction_type === 'CREDIT' ? '#10b981' : 'var(--text-primary)' }}>
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

const ProfitLossView = ({ data, year, onYearChange }) => {
    if (!data) return null;
    const { p_l_statement, departmental_performance } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>Profit & Loss Statement ({year})</h3>
                    <select
                        value={year}
                        onChange={(e) => onYearChange(e.target.value)}
                        style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900' }}
                    >
                        {[2024, 2025, 2026].map(yr => <option key={yr} value={yr} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{yr}</option>)}
                    </select>
                </div>

                <SectionHeader>1. OPERATING REVENUE</SectionHeader>
                <ReportRow label="Service Revenue" value={p_l_statement.total_revenue} primary />
                <ReportRow label="Total Revenue" value={p_l_statement.total_revenue} total />

                <div style={{ height: '30px' }}></div>

                <SectionHeader>2. OPERATING EXPENSES</SectionHeader>
                {departmental_performance.map((dept, i) => (
                    <ReportRow key={i} label={dept.name} value={dept.expenses} indent />
                ))}
                <ReportRow label="Total Operating Expenses" value={p_l_statement.total_expenses} total color="#f43f5e" />

                <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2.5px solid var(--gold-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>NET OPERATING INCOME</span>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: p_l_statement.net_profit_loss >= 0 ? '#10b981' : '#ef4444' }}>
                            AED {p_l_statement.net_profit_loss.toLocaleString()}
                        </span>
                    </div>
                </div>
            </GlassCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>FISCAL SUMMARY</h4>
                    <SummaryMetric label="Gross Margin" value="100%" color="#10b981" />
                    <SummaryMetric label="Expense Ratio" value={`${((p_l_statement.total_expenses / p_l_statement.total_revenue) * 100 || 0).toFixed(1)}%`} color="#f43f5e" />
                    <SummaryMetric label="Net Profit Margin" value={`${((p_l_statement.net_profit_loss / p_l_statement.total_revenue) * 100 || 0).toFixed(1)}%`} color="#3b82f6" />
                </GlassCard>

                <GlassCard style={{ padding: '30px', background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <FileText color="var(--gold)" />
                        <h4 style={{ margin: 0, fontWeight: '900', color: 'var(--text-primary)' }}>Auditor Note</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '800' }}>
                        This statement reflects all transactions recorded in the General Ledger for the selected fiscal year.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
};

const InventoryView = ({ stats }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)' }}>
            <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>Workshop Inventory Valuation</h3>

            <SectionHeader>ASSET CATEGORIES</SectionHeader>
            {stats?.category_breakdown?.map((cat, i) => (
                <ReportRow key={i} label={cat.label} value={cat.value || 0} primary />
            ))}

            <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2.5px solid var(--gold-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>TOTAL INVENTORY ASSET VALUE</span>
                    <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--gold)' }}>
                        AED {stats?.total_value?.toLocaleString() || 0}
                    </span>
                </div>
            </div>
        </GlassCard>

        <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>STOCK HEALTH</h4>
            <SummaryMetric label="Critical Items" value={stats?.low_stock_count || 0} color="#f43f5e" />
            <SummaryMetric label="Healthy Items" value={(stats?.total_items || 0) - (stats?.low_stock_count || 0)} color="#10b981" />
            <div style={{ height: '20px' }}></div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '800' }}>
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
        borderBottom: total ? 'none' : '1.5px solid var(--border-color)',
        background: total ? 'var(--gold-glow)' : 'transparent',
        borderRadius: total ? '10px' : '0'
    }}>
        <span style={{
            color: total || primary ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: total || primary ? '900' : '700',
            fontSize: total ? '15px' : '14px'
        }}>{label}</span>
        <span style={{
            color: color || 'var(--text-primary)',
            fontWeight: total || primary ? '900' : '800',
            fontSize: total ? '16px' : '14px'
        }}>AED {value.toLocaleString()}</span>
    </div>
);

const SummaryMetric = ({ label, value, color }) => (
    <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '800' }}>{label}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>{value}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--input-bg)', borderRadius: '3px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: value, height: '100%', background: color, borderRadius: '3px' }}></div>
        </div>
    </div>
);

export default FinancialReports;
