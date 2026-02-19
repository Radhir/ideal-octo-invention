import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioInput,
    PortfolioSelect
} from '../../components/PortfolioComponents';
import { Target, PieChart } from 'lucide-react';

const BudgetManager = () => {
    const [accounts, setAccounts] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [formData, setFormData] = useState({
        account: '',
        department: 'GENERAL',
        amount: '',
        period: '2024-Q1'
    });

    const fetchData = async () => {
        try {
            const [accRes, budgetRes] = await Promise.all([
                api.get('/finance/api/accounts/'),
                api.get('/finance/api/budgets/')
            ]);
            setAccounts(accRes.data);
            setBudgets(budgetRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/finance/api/budgets/', formData);
            alert('Capital Allocation Confirmed.');
            setFormData({ account: '', department: 'GENERAL', amount: '', period: '2024-Q1' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PortfolioPage breadcrumb="Finance / Capital / Budgeting">
            <PortfolioTitle subtitle="Set departmental fiscal limits and forecast expenditures.">
                Capital Allocation
            </PortfolioTitle>

            <div style={{ maxWidth: '800px' }}>
                <PortfolioCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <PieChart size={24} color="var(--gold)" />
                        <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '2px' }}>New Allocation Strategy</h3>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <PortfolioSelect
                                label="TARGET DEPARTMENT"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="GENERAL">GENERAL & ADMIN</option>
                                <option value="OPERATIONS">OPERATIONS</option>
                                <option value="MARKETING">MARKETING</option>
                                <option value="HR">HR & VISA</option>
                                <option value="INVENTORY">INVENTORY & STOCK</option>
                            </PortfolioSelect>

                            <PortfolioSelect
                                label="FISCAL PERIOD"
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            >
                                <option value="2024-Q1">Q1 2024 (JAN - MAR)</option>
                                <option value="2024-Q2">Q2 2024 (APR - JUN)</option>
                                <option value="2024-Q3">Q3 2024 (JUL - SEP)</option>
                                <option value="2024-Q4">Q4 2024 (OCT - DEC)</option>
                            </PortfolioSelect>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <PortfolioSelect
                                    label="LEDGER ACCOUNT"
                                    value={formData.account}
                                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                                    required
                                >
                                    <option value="">SELECT ACCOUNT...</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </PortfolioSelect>
                            </div>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            <label style={{ display: 'block', color: 'rgba(232, 230, 227, 0.6)', fontSize: '13px', marginBottom: '15px', letterSpacing: '1px' }}>
                                ALLOCATED CAPITAL (AED)
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid var(--gold)',
                                    color: 'var(--cream)',
                                    width: '100%',
                                    fontSize: '56px',
                                    fontFamily: 'var(--font-serif)',
                                    outline: 'none',
                                    padding: '10px 0'
                                }}
                                placeholder="0.00"
                            />
                        </div>

                        <PortfolioButton
                            variant="gold"
                            type="submit"
                            style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '15px' }}
                        >
                            <Target size={20} /> CONFIRM ALLOCATION
                        </PortfolioButton>
                    </form>
                </PortfolioCard>
            </div>

            <div style={{ marginTop: '60px' }}>
                <PortfolioTitle subtitle="Current active capital distributions.">
                    ACTIVE LEDGERS
                </PortfolioTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
                    {budgets.map(budget => (
                        <div key={budget.id} style={{
                            background: 'rgba(232, 230, 227, 0.02)',
                            border: '1px solid rgba(232, 230, 227, 0.05)',
                            padding: '25px',
                            borderRadius: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--gold)', letterSpacing: '1px' }}>{budget.period}</span>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(232, 230, 227, 0.5)', letterSpacing: '1px' }}>{budget.department}</span>
                            </div>
                            <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                AED {parseFloat(budget.amount).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>
                                Target Account: {budget.account_details?.name || 'Linked Account'}
                            </div>
                        </div>
                    ))}
                    {budgets.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.3)', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '16px' }}>
                            NO ACTIVE CAPITAL ALLOCATIONS FOUND.
                        </div>
                    )}
                </div>
            </div>
        </PortfolioPage>
    );
};

export default BudgetManager;
