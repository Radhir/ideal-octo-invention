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
    const [activeTab, setActiveTab] = useState('LEGER'); // LEGER, PL, BS, TB
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [filters, setFilters] = useState({ search: '', department: 'ALL' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = `?start_date=${startDate}&end_date=${endDate}`;
            let endpoint = '';

            switch (activeTab) {
                case 'LEGER': endpoint = `/finance/api/vouchers/ledger/${params}`; break;
                case 'PL': endpoint = `/finance/api/reports/profit_loss/${params}`; break;
                case 'BS': endpoint = `/finance/api/reports/balance_sheet/?end_date=${endDate}`; break;
                case 'TB': endpoint = `/finance/api/reports/trial_balance/?end_date=${endDate}`; break;
                case 'VAT': endpoint = `/finance/api/reports/vat_report/${params}`; break;
                case 'PAY_REG': endpoint = `/finance/api/vouchers/?voucher_type=PAYMENT&status=POSTED&start=${startDate}&end=${endDate}`; break;
                case 'REC_REG': endpoint = `/finance/api/vouchers/?voucher_type=RECEIPT&status=POSTED&start=${startDate}&end=${endDate}`; break;
                case 'INV': endpoint = `/forms/stock/api/items/inventory_stats/`; break;
                default: endpoint = `/finance/api/vouchers/ledger/${params}`;
            }

            const res = await api.get(endpoint);
            setReportData(res.data);
            if (activeTab === 'LEGER') setTransactions(res.data.results || res.data);
        } catch (err) {
            console.error('Error fetching reports data', err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <PortfolioPage breadcrumb={`FINANCE // REPORTS // ${activeTab}`}>
            <PrintHeader title={
                activeTab === 'PL' ? "Profit & Loss Statement" :
                    activeTab === 'BS' ? "Balance Sheet" :
                        activeTab === 'TB' ? "Trial Balance" :
                            activeTab === 'INV' ? "Inventory Valuation" : "Financial Report"
            } />

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

            <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '50px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)', paddingBottom: '20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                <TabButton active={activeTab === 'LEGER'} onClick={() => setActiveTab('LEGER')}>Ledger</TabButton>
                <TabButton active={activeTab === 'PAY_REG'} onClick={() => setActiveTab('PAY_REG')}>Payments</TabButton>
                <TabButton active={activeTab === 'REC_REG'} onClick={() => setActiveTab('REC_REG')}>Receipts</TabButton>
                <TabButton active={activeTab === 'PL'} onClick={() => setActiveTab('PL')}>P&L</TabButton>
                <TabButton active={activeTab === 'BS'} onClick={() => setActiveTab('BS')}>Balance Sheet</TabButton>
                <TabButton active={activeTab === 'TB'} onClick={() => setActiveTab('TB')}>Trial Balance</TabButton>
                <TabButton active={activeTab === 'VAT'} onClick={() => setActiveTab('VAT')}>VAT</TabButton>
                <TabButton active={activeTab === 'INV'} onClick={() => setActiveTab('INV')}>Inventory</TabButton>
            </div>

            {loading ? (
                <div style={{ color: 'var(--gold)', padding: '80px', textAlign: 'center', letterSpacing: '2px', fontWeight: '800' }}>COMPUTING FISCAL DATA...</div>
            ) : (
                <>
                    {activeTab === 'LEGER' && (
                        <LedgerView
                            transactions={transactions.filter(t => {
                                const desc = t.description || t.narration || '';
                                return desc.toLowerCase().includes(filters.search.toLowerCase()) ||
                                    (t.reference || '').toLowerCase().includes(filters.search.toLowerCase());
                            })}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                    {activeTab === 'PAY_REG' && <RegisterView data={reportData} title="Payment Register" type="PAYMENT" />}
                    {activeTab === 'REC_REG' && <RegisterView data={reportData} title="Receipt Register" type="RECEIPT" />}
                    {activeTab === 'PL' && <ProfitLossView data={reportData} />}
                    {activeTab === 'BS' && <BalanceSheetView data={reportData} />}
                    {activeTab === 'TB' && <TrialBalanceView data={reportData} />}
                    {activeTab === 'VAT' && <VatReportView data={reportData} />}
                    {activeTab === 'INV' && <InventoryView stats={reportData} />}
                </>
            )}
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

const ProfitLossView = ({ data }) => {
    if (!data) return null;
    const { income, expense, total_income, total_expense, net_profit } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
            <PortfolioCard>
                <div style={{ marginBottom: '40px' }}>
                    <PortfolioSectionTitle>PROFIT & LOSS STATEMENT</PortfolioSectionTitle>
                </div>

                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>1. OPERATING REVENUE</div>
                {income.map((acc, i) => (
                    <ReportRow key={i} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                ))}
                <ReportRow label="Total Revenue" value={total_income} total />

                <div style={{ height: '40px' }}></div>

                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>2. OPERATING EXPENSES</div>
                {expense.map((acc, i) => (
                    <ReportRow key={i} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                ))}
                <ReportRow label="Total Operating Expenses" value={total_expense} total isNegative />

                <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid rgba(232, 230, 227, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--cream)', letterSpacing: '1px' }}>RETAINED FISCAL PERFORMANCE</span>
                        <span style={{ fontSize: '42px', fontWeight: '300', color: net_profit >= 0 ? '#10b981' : '#f43f5e', fontFamily: 'var(--font-serif)' }}>
                            AED {net_profit.toLocaleString()}
                        </span>
                    </div>
                </div>
            </PortfolioCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <PortfolioCard borderColor="var(--gold)">
                    <h4 style={{ margin: '0 0 30px 0', fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>FISCAL RATIOS</h4>
                    <SummaryMetric label="Gross Margin" value="100%" color="#10b981" />
                    <SummaryMetric label="Expense Ratio" value={`${((total_expense / total_income) * 100 || 0).toFixed(1)}%`} color="#f43f5e" />
                    <SummaryMetric label="Net Profit Margin" value={`${((net_profit / total_income) * 100 || 0).toFixed(1)}%`} color="#3b82f6" />
                </PortfolioCard>

                <PortfolioCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <FileText color="var(--gold)" size={20} />
                        <h4 style={{ margin: 0, fontWeight: '800', fontSize: '14px', color: 'var(--cream)' }}>AUDITOR NOTE</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.7)', lineHeight: '1.6' }}>
                        This statement reflects live ledger updates. Revenue accounts are recognized upon invoice posting or voucher receipt.
                    </p>
                </PortfolioCard>
            </div>
        </div>
    );
};

const BalanceSheetView = ({ data }) => {
    if (!data) return null;
    const { assets, liabilities, equity, total_assets, total_liabilities, total_equity } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '40px' }}>
            <PortfolioCard>
                <PortfolioSectionTitle>ASSETS</PortfolioSectionTitle>
                <div style={{ height: '30px' }}></div>
                {assets.map((acc, i) => (
                    <ReportRow key={i} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                ))}
                <div style={{ marginTop: '40px' }}>
                    <ReportRow label="Total Assets" value={total_assets} total />
                </div>
            </PortfolioCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <PortfolioCard>
                    <PortfolioSectionTitle>LIABILITIES & EQUITY</PortfolioSectionTitle>
                    <div style={{ height: '30px' }}></div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', mb: '10px' }}>LIABILITIES</div>
                    {liabilities.map((acc, i) => (
                        <ReportRow key={i} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                    ))}

                    <div style={{ height: '30px' }}></div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', mb: '10px' }}>OWNERS EQUITY</div>
                    {equity.map((acc, i) => (
                        <ReportRow key={i} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                    ))}

                    <div style={{ marginTop: '40px' }}>
                        <ReportRow label="Total Liabilities & Equity" value={total_liabilities + total_equity} total />
                    </div>
                </PortfolioCard>

                <div style={{ padding: '20px', background: total_assets === (total_liabilities + total_equity) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: total_assets === (total_liabilities + total_equity) ? '#10b981' : '#f43f5e', fontWeight: '800', letterSpacing: '1px' }}>
                        {total_assets === (total_liabilities + total_equity) ? '✅ LEDGER BALANCED' : '⚠️ BALANCE DISCREPANCY DETECTED'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const TrialBalanceView = ({ data }) => {
    if (!data) return null;
    const { accounts, totals } = data;

    return (
        <PortfolioCard>
            <PortfolioSectionTitle>TRIAL BALANCE AUDIT</PortfolioSectionTitle>
            <div style={{ height: '30px' }}></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={thStyle}>A/C Code</th>
                        <th style={thStyle}>Account Name</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Debit</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={tdStyle}>{acc.code}</td>
                            <td style={tdStyle}>{acc.name}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{acc.debit > 0 ? acc.debit.toLocaleString() : '--'}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{acc.credit > 0 ? acc.credit.toLocaleString() : '--'}</td>
                        </tr>
                    ))}
                    <tr style={{ background: 'rgba(212, 175, 55, 0.05)', fontWeight: '800' }}>
                        <td style={tdStyle} colSpan="2">TOTALS</td>
                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--gold)' }}>{totals.debit.toLocaleString()}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--gold)' }}>{totals.credit.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </PortfolioCard>
    );
};

const VatReportView = ({ data }) => {
    if (!data) return null;
    const { input_vat, output_vat, total_input, total_output, net_payable } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '40px' }}>
            <PortfolioCard>
                <div style={{ color: '#3b82f6', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>PURCHASE VAT (INPUT)</div>
                {input_vat.map((item, i) => (
                    <ReportRow key={i} label={item.name} value={item.debit} indent />
                ))}
                <div style={{ marginTop: '30px' }}>
                    <ReportRow label="Total Input VAT" value={total_input} total />
                </div>
            </PortfolioCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <PortfolioCard>
                    <div style={{ color: '#f59e0b', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>SALES VAT (OUTPUT)</div>
                    {output_vat.map((item, i) => (
                        <ReportRow key={i} label={item.name} value={item.credit} indent />
                    ))}
                    <div style={{ marginTop: '30px' }}>
                        <ReportRow label="Total Output VAT" value={total_output} total />
                    </div>
                </PortfolioCard>

                <PortfolioCard borderColor="var(--gold)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '800', color: 'var(--cream)', fontSize: '14px' }}>VAT PAYABLE / (REFUNDABLE)</span>
                        <span style={{ fontSize: '32px', fontWeight: '300', color: net_payable >= 0 ? '#f43f5e' : '#10b981', fontFamily: 'var(--font-serif)' }}>
                            AED {Math.abs(net_payable).toLocaleString()}
                            {net_payable < 0 && <span style={{ fontSize: '12px', marginLeft: '10px' }}>Cr.</span>}
                        </span>
                    </div>
                </PortfolioCard>
            </div>
        </div>
    );
};
const RegisterView = ({ data, title, type }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <PortfolioSectionTitle>{title.toUpperCase()}</PortfolioSectionTitle>
                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', marginTop: '5px', fontWeight: '800', letterSpacing: '1px' }}>
                    POSTED VOUCHERS: {data?.length || 0} RECORDS
                </div>
            </div>
            <div style={{ padding: '15px 30px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '15px', border: '1px solid rgba(232, 230, 227, 0.1)' }}>
                <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px', marginRight: '15px' }}>AGGREGATE:</span>
                <span style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>
                    AED {data?.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0).toLocaleString()}
                </span>
            </div>
        </div>
        <div style={{ background: 'rgba(232, 230, 227, 0.02)', border: '1.5px solid rgba(232, 230, 227, 0.1)', borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(232, 230, 227, 0.05)', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Voucher No</th>
                        <th style={thStyle}>Reference</th>
                        <th style={thStyle}>Narration</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(v => (
                        <tr key={v.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                            <td style={tdStyle}>{new Date(v.date).toLocaleDateString()}</td>
                            <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '700' }}>{v.voucher_number}</td>
                            <td style={tdStyle}>{v.reference_number || '--'}</td>
                            <td style={{ ...tdStyle, fontSize: '12px', opacity: 0.7 }}>{v.narration}</td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '400', color: type === 'PAYMENT' ? '#f43f5e' : '#10b981', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                                AED {parseFloat(v.total_amount || 0).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const InventoryView = ({ stats }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
        <PortfolioCard>
            <PortfolioSectionTitle>WORKSHOP INVENTORY VALUATION</PortfolioSectionTitle>
            <div style={{ height: '30px' }}></div>

            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>ASSET CATEGORIES</div>
            {stats?.category_summary?.map((cat, i) => (
                <ReportRow key={i} label={cat.category} value={cat.valuation || 0} primary />
            ))}

            <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid rgba(232, 230, 227, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--cream)', letterSpacing: '1px' }}>TOTAL INVENTORY ASSET VALUE</span>
                    <span style={{ fontSize: '42px', fontWeight: '300', color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>
                        AED {parseFloat(stats?.total_valuation || 0).toLocaleString()}
                    </span>
                </div>
            </div>
        </PortfolioCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <PortfolioCard borderColor="var(--gold)">
                <h4 style={{ margin: '0 0 30px 0', fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>STOCK HEALTH</h4>
                <SummaryMetric label="Low Stock Alerts" value={`${(stats?.low_stock_count || 0)} ITEMS`} color="#f43f5e" />
                <SummaryMetric label="Total SKUs" value={`${(stats?.total_items || 0)} ITEMS`} color="#10b981" />
                <div style={{ height: '30px' }}></div>
                <p style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', lineHeight: '1.6', fontWeight: '600' }}>
                    Asset values are calculated based on Weighted Average Cost * Current Balance for each SKU in the industrial ledger.
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
