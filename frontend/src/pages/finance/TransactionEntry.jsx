import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CreditCard, Tag, Upload } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';

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

    const fetchAccounts = useCallback(async () => {
        try {
            const res = await api.get('/finance/api/accounts/');
            setAccounts(res.data);
        } catch (err) {
            console.error('Error fetching accounts', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

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
            navigate('/finance');
        } catch (err) {
            console.error(err);
            alert('Transaction Failed. Please check the ledger status.');
        }
    };

    if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--cream)', opacity: 0.5 }}>Synchronizing Ledger...</div>;

    return (
        <PortfolioPage breadcrumb="Finance / Executive Ledger / New Entry">
            <PortfolioTitle subtitle="Record a new fiscal event into the master general ledger with full audit capability.">
                Transaction Entry
            </PortfolioTitle>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1200px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

                    {/* Main Form Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <PortfolioCard>
                            <PortfolioSectionTitle>Fiscal Classification</PortfolioSectionTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioSelect
                                    label="TARGET ACCOUNT"
                                    name="account"
                                    value={formData.account}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">SELECT LEDGER ACCOUNT...</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </PortfolioSelect>

                                <PortfolioSelect
                                    label="FLOW TYPE"
                                    name="transaction_type"
                                    value={formData.transaction_type}
                                    onChange={handleChange}
                                >
                                    <option value="DEBIT">DEBIT (EXPENDITURE)</option>
                                    <option value="CREDIT">CREDIT (REVENUE/CAPITAL)</option>
                                </PortfolioSelect>

                                <PortfolioSelect
                                    label="DEPARTMENT"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    <option value="GENERAL">GENERAL & ADMIN</option>
                                    <option value="OPERATIONS">OPERATIONS</option>
                                    <option value="MARKETING">MARKETING</option>
                                    <option value="HR">HR & VISA</option>
                                    <option value="INVENTORY">INVENTORY</option>
                                </PortfolioSelect>

                                <PortfolioInput
                                    label="REFERENCE TOKEN"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    placeholder="INV-001 / REC-992"
                                />
                            </div>
                        </PortfolioCard>

                        <PortfolioCard>
                            <PortfolioSectionTitle>Transaction Details</PortfolioSectionTitle>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', color: 'rgba(232, 230, 227, 0.6)', fontSize: '13px', marginBottom: '15px', letterSpacing: '1px' }}>
                                    TRANSACTION VALUE (AED)
                                </label>
                                <input
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '2px solid var(--gold)',
                                        color: 'var(--cream)',
                                        width: '100%',
                                        fontSize: '48px',
                                        fontFamily: 'var(--font-serif)',
                                        outline: 'none',
                                        padding: '10px 0'
                                    }}
                                    placeholder="0.00"
                                />
                            </div>

                            <div style={{
                                background: 'rgba(176, 141, 87, 0.1)',
                                border: '1px solid rgba(176, 141, 87, 0.2)',
                                borderRadius: '15px',
                                padding: '25px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '40px'
                            }}>
                                <div>
                                    <div style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '14px', marginBottom: '5px' }}>VAT AUTOMATION (5%)</div>
                                    <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '12px' }}>Automatically calculate and append UAE VAT tax to this entry.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={applyVAT}
                                    onChange={(e) => setApplyVAT(e.target.checked)}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--gold)', cursor: 'pointer' }}
                                />
                            </div>

                            <PortfolioTextarea
                                label="NARRATIVE / DESCRIPTION"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Enter detailed justification for this ledger entry..."
                            />
                        </PortfolioCard>
                    </div>

                    {/* Sidebar / Evidence */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <PortfolioButton
                            variant="gold"
                            onClick={handleSubmit}
                            style={{ width: '100%', height: '80px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}
                        >
                            <CreditCard size={24} /> COMMIT LEDGER
                        </PortfolioButton>

                        <PortfolioCard>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <Tag size={20} color="var(--gold)" />
                                <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '1px' }}>Evidence & Audit</h3>
                            </div>

                            <div
                                onClick={() => document.getElementById('receipt-upload').click()}
                                style={{
                                    width: '100%',
                                    aspectRatio: '3/4',
                                    background: 'rgba(232, 230, 227, 0.02)',
                                    border: '1px dashed rgba(232, 230, 227, 0.2)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(232, 230, 227, 0.2)'}
                            >
                                {receiptPreview ? (
                                    <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'rgba(232, 230, 227, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '15px'
                                        }}>
                                            <Upload size={24} color="rgba(232, 230, 227, 0.4)" />
                                        </div>
                                        <span style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>UPLOAD RECEIPT</span>
                                    </>
                                )}
                            </div>
                            <input id="receipt-upload" type="file" hidden accept="image/*" onChange={handlePhotoUpload} />

                            <p style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(232, 230, 227, 0.4)', lineHeight: '1.6', textAlign: 'center' }}>
                                All debit entries exceeding AED 500 require digital evidence for SEC compliance.
                            </p>
                        </PortfolioCard>
                    </div>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default TransactionEntry;
