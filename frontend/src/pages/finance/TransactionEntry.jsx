import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, PlusCircle, CreditCard, FileText, Tag, Calendar } from 'lucide-react';

const TransactionEntry = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyVAT, setApplyVAT] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [formData, setFormData] = useState({
        account: '',
        amount: '',
        transaction_type: 'DEBIT',
        description: '',
        reference: '',
        department: 'GENERAL',
        receipt: null
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/finance/api/accounts/');
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

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const max = 1200;

                if (width > height && width > max) {
                    height *= max / width;
                    width = max;
                } else if (height > max) {
                    width *= max / height;
                    height = max;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                    setFormData(prev => ({ ...prev, receipt: compressedFile }));
                    setReceiptPreview(URL.createObjectURL(blob));
                }, 'image/jpeg', 0.7);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            let finalAmount = parseFloat(formData.amount);
            let finalDesc = formData.description;

            if (applyVAT) {
                const vat = finalAmount * 0.05;
                finalAmount += vat;
                finalDesc = `${finalDesc} (Incl. 5% VAT: ${vat.toFixed(2)})`;
            }

            submitData.append('account', formData.account);
            submitData.append('amount', finalAmount);
            submitData.append('transaction_type', formData.transaction_type);
            submitData.append('description', finalDesc);
            submitData.append('reference', formData.reference);
            submitData.append('department', formData.department);
            if (formData.receipt) {
                submitData.append('receipt', formData.receipt);
            }

            await api.post('/finance/api/transactions/', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <GlassCard style={{ padding: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '35px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
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
                                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount (AED Excl. VAT)</label>
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

                            {/* VAT Automation */}
                            <div style={{ gridColumn: '1 / -1', background: 'rgba(176,141,87,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(176,141,87,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>VAT Automation (UAE 5%)</div>
                                    <div style={{ color: '#64748b', fontSize: '11px' }}>Automatically append tax and adjust total amount</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={applyVAT}
                                    onChange={(e) => setApplyVAT(e.target.checked)}
                                    style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#b08d57' }}
                                />
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

                    {/* Receipt Evidence */}
                    <div>
                        <GlassCard style={{ padding: '25px', marginBottom: '20px' }}>
                            <h4 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '800', color: '#b08d57', textTransform: 'uppercase', letterSpacing: '1px' }}>Verification Receipt</h4>
                            <div
                                onClick={() => document.getElementById('receipt-upload').click()}
                                style={{
                                    width: '100%',
                                    aspectRatio: '3/4',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#b08d57'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            >
                                {receiptPreview ? (
                                    <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <PlusCircle size={32} color="#64748b" />
                                        <span style={{ color: '#64748b', fontSize: '11px', marginTop: '10px' }}>TAP TO SECURE IMAGE</span>
                                    </>
                                )}
                            </div>
                            <input id="receipt-upload" type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                        </GlassCard>

                        <div style={{ background: 'rgba(176,141,87,0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(176,141,87,0.2)' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                <Tag size={16} color="#b08d57" />
                                <span style={{ fontWeight: '800', fontSize: '12px' }}>Ledger Integrity</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
                                All entries are permanent. SEC compliance requires image evidence for all debit flows over 500 AED.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TransactionEntry;
