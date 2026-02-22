import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, Wallet, Tag, CheckCircle, XCircle } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea
} from '../../components/PortfolioComponents';

const PettyCashVoucher = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'entry'; // entry or approval

    const [accounts, setAccounts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        voucher_no: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        payee_name: '',
        account: '', // Expense Account
        description: '',
        branch: ''
    });

    const fetchMasters = useCallback(async () => {
        try {
            const [accRes, branchRes] = await Promise.all([
                api.get('/finance/api/accounts/'),
                api.get('/hr/api/branches/')
            ]);
            setAccounts(accRes.data.results || accRes.data);
            setBranches(branchRes.data.results || branchRes.data);
        } catch (err) {
            console.error('Error fetching masters', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find the Cash-in-hand account for Debit (if Approval) or Credit (if Payment)
            // For Petty Cash Payment: Credit Petty Cash, Debit Expense
            const pettyCashAccount = accounts.find(a => a.name.toLowerCase().includes('petty') || a.code === '1001');

            const payload = {
                voucher_number: `PCV-${Date.now()}`,
                voucher_type: 'PETTY_CASH',
                date: formData.date,
                narration: formData.description,
                payment_mode: 'CASH',
                payee_name: formData.payee_name,
                branch: formData.branch || null,
                status: mode === 'entry' ? 'DRAFT' : 'POSTED',
                details: [
                    {
                        // DEBIT (Expense)
                        account: formData.account,
                        debit: formData.amount,
                        credit: 0,
                        description: formData.description
                    },
                    {
                        // CREDIT (Petty Cash)
                        account: pettyCashAccount?.id || null,
                        debit: 0,
                        credit: formData.amount,
                        description: `Petty Cash Payment to ${formData.payee_name}`
                    }
                ]
            };

            await api.post('/finance/api/vouchers/', payload);
            navigate('/finance');
        } catch (err) {
            console.error(err);
            alert('Petty Cash Voucher Failed.');
        }
    };

    if (loading) return <div className="p-20 text-center text-cream">Loading Petty Cash Masters...</div>;

    return (
        <PortfolioPage breadcrumb={`Finance / Vouchers / Petty Cash ${mode === 'approval' ? 'Approval' : 'Payment'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PortfolioTitle subtitle={mode === 'approval' ? "Review and authorize pending petty cash requests." : "Record day-to-day minor cash expenditures."}>
                    Petty Cash {mode === 'approval' ? 'Approval' : 'Payment'}
                </PortfolioTitle>
                <PortfolioButton variant="secondary" onClick={() => navigate('/finance')}>
                    Close
                </PortfolioButton>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', marginTop: '40px' }}>
                <PortfolioCard>
                    <div style={{ background: mode === 'approval' ? '#059669' : '#b08d57', padding: '15px', marginBottom: '20px', borderRadius: '8px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Wallet size={18} />
                        {mode === 'approval' ? 'Approval Workflow' : 'New Payment Entry'}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <PortfolioInput
                                label="Voucher Reference"
                                name="voucher_no"
                                value={formData.voucher_no}
                                placeholder="(Auto-Generated)"
                                disabled
                            />
                            <PortfolioInput
                                label="Transaction Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                            <PortfolioInput
                                label="Paid To (Payee)"
                                name="payee_name"
                                value={formData.payee_name}
                                onChange={handleChange}
                                required
                                placeholder="Enter name of person receiving cash..."
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <PortfolioSelect
                                label="Expense Account"
                                name="account"
                                value={formData.account}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Select Ledger--</option>
                                {accounts.filter(a => a.category === 'EXPENSE').map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.code})</option>
                                ))}
                            </PortfolioSelect>

                            <PortfolioInput
                                label="Amount (AED)"
                                name="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />

                            <PortfolioSelect
                                label="Branch"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                            >
                                <option value="">--Select--</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </PortfolioSelect>
                        </div>
                    </div>

                    <PortfolioTextarea
                        label="Narration / Remarks"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        style={{ marginTop: '20px' }}
                    />

                    <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <PortfolioButton variant="gold" type="submit">
                            {mode === 'approval' ? <CheckCircle size={18} /> : <PlusCircle size={18} />}
                            {mode === 'approval' ? ' Approve & Post' : ' Save Draft'}
                        </PortfolioButton>
                        <PortfolioButton variant="secondary" type="button" onClick={() => navigate(-1)}>
                            <XCircle size={18} /> Cancel
                        </PortfolioButton>
                    </div>
                </PortfolioCard>
            </form>
        </PortfolioPage>
    );
};

export default PettyCashVoucher;
