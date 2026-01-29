import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, PlusCircle, CreditCard, FileText, Tag, Calendar } from 'lucide-react';

const TransactionEntry = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        account: '',
        amount: '',
        transaction_type: 'DEBIT',
        description: '',
        reference: '',
        department: 'GENERAL'
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('/finance/api/accounts/');
            setAccounts(res.data);
        } catch (err) {
            console.error('Error fetching accounts', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/finance/api/transactions/', formData);
            alert('Financial Ledger Updated Successfully.');
            navigate('/finance');
        } catch (err) {
            console.error(err);
            alert('Transaction Failed. Please check the ledger status.');
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Syncing Ledger...</div>;

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/finance')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE LEDGER</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>New Transaction</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
                <GlassCard style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '35px' }}>
                        <div style={{ gridColumn: '1 / span 2' }}>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Target Account</label>
                            <select name="account" onChange={handleChange} required
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}>
                                <option value="" style={{ background: '#1e293b' }}>Select Account...</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id} style={{ background: '#1e293b' }}>{acc.code} - {acc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Flow Type</label>
                            <select name="transaction_type" onChange={handleChange}
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}>
                                <option value="DEBIT" style={{ background: '#1e293b' }}>Debit (Expenditure)</option>
                                <option value="CREDIT" style={{ background: '#1e293b' }}>Credit (Revenue/Capital)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount (AED)</label>
                            <input name="amount" type="number" step="0.01" onChange={handleChange} required
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    outline: 'none'
                                }} />
                        </div>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Department</label>
                            <select name="department" onChange={handleChange}
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}>
                                <option value="GENERAL" style={{ background: '#1e293b' }}>General & Admin</option>
                                <option value="OPERATIONS" style={{ background: '#1e293b' }}>Operations</option>
                                <option value="MARKETING" style={{ background: '#1e293b' }}>Marketing</option>
                                <option value="HR" style={{ background: '#1e293b' }}>HR & Visa</option>
                                <option value="INVENTORY" style={{ background: '#1e293b' }}>Inventory</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference #</label>
                            <input name="reference" onChange={handleChange} placeholder="Invoice or Receipt #"
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none'
                                }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Description / Narrative</label>
                            <textarea name="description" rows="3" onChange={handleChange} placeholder="Detailed reason for transaction..."
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '60px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <CreditCard size={24} /> Commit to Ledger
                    </button>
                </GlassCard>
            </form>
        </div>
    );
};

export default TransactionEntry;
