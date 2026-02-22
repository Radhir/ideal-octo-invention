import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioInput,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import { Save, ArrowLeft, ShoppingCart, User, Calendar, Plus, Trash2 } from 'lucide-react';

const PurchaseEntry = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        purchase_number: `PRCH-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        vendor_name: '',
        items: [{ detail: '', qty: 1, price: 0 }],
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { detail: '', qty: 1, price: 0 }] });
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
        }
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const vat = subtotal * 0.05;
        return { subtotal, vat, grandTotal: subtotal + vat };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { subtotal, vat, grandTotal } = calculateTotals();
        const submissionData = {
            ...formData,
            items_detail: formData.items.map(i => `${i.detail}|${i.qty}|${i.price}`).join('\n'),
            subtotal,
            vat_amount: vat,
            total_amount: grandTotal
        };

        try {
            const res = await api.post('/logistics/api/purchases/', submissionData);
            navigate('/logistics/order-confirmation', { state: { order: res.data, totals } });
        } catch (err) {
            console.error(err);
            alert('Failed to synchronize supply order protocol.');
        }
    };

    const totals = calculateTotals();

    return (
        <PortfolioPage>
            <div style={{ padding: '40px 0' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
                    color: 'var(--cream)', fontSize: '13px', letterSpacing: '1px', cursor: 'pointer'
                }} onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> BACK
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle
                        title="SUPPLY ORDER PROTOCOL"
                        subtitle={`PROCUREMENT // AUTH.ID: ${formData.purchase_number}`}
                    />
                    <div style={{
                        textAlign: 'right',
                        padding: '15px 25px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900' }}>TIMESTAMP.LOG</div>
                        <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: '300', marginTop: '6px', fontFamily: 'var(--font-serif)' }}>{new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <PortfolioCard style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={20} color="var(--gold)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>VENDORS</div>
                                        <PortfolioSectionTitle title="SUPPLY SOURCE" style={{ marginBottom: 0, fontSize: '18px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                    <PortfolioInput
                                        label="VENDOR NAME"
                                        name="vendor_name"
                                        value={formData.vendor_name}
                                        onChange={handleChange}
                                        placeholder="Enter Supplier"
                                    />
                                    <PortfolioInput
                                        label="REFERENCE #"
                                        name="purchase_number"
                                        value={formData.purchase_number}
                                        onChange={handleChange}
                                    />
                                </div>
                            </PortfolioCard>

                            <PortfolioCard style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShoppingCart size={20} color="var(--gold)" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>INVENTORY.node</div>
                                            <PortfolioSectionTitle title="ASSET MANIFEST" style={{ marginBottom: 0, fontSize: '18px' }} />
                                        </div>
                                    </div>
                                    <PortfolioButton onClick={addItem} variant="glass" style={{ fontSize: '9px', padding: '10px 20px', height: 'auto' }}>
                                        <Plus size={14} /> ADD.row
                                    </PortfolioButton>
                                </div>

                                {formData.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'minmax(200px, 1fr) 100px 140px 140px 50px',
                                        gap: '15px',
                                        marginBottom: '15px',
                                        alignItems: 'flex-end',
                                        padding: '20px',
                                        background: 'rgba(232, 230, 227, 0.02)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(232, 230, 227, 0.05)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <PortfolioInput
                                            label={idx === 0 ? "ASSET.detail" : ""}
                                            value={item.detail}
                                            onChange={(e) => handleItemChange(idx, 'detail', e.target.value)}
                                            placeholder="Part ID or Service Name..."
                                        />
                                        <PortfolioInput
                                            label={idx === 0 ? "QUANTITY" : ""}
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 0)}
                                        />
                                        <PortfolioInput
                                            label={idx === 0 ? "UNIT_PRICE" : ""}
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {idx === 0 && <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '900', letterSpacing: '1px' }}>LINE.total</div>}
                                            <div style={{
                                                height: '52px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', padding: '0 20px', color: 'var(--cream)',
                                                fontSize: '14px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.03)'
                                            }}>
                                                {(item.qty * item.price).toLocaleString()} <span style={{ fontSize: '10px', opacity: 0.4, marginLeft: '6px' }}>AED</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            style={{
                                                height: '52px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#f43f5e',
                                                cursor: 'pointer',
                                                opacity: formData.items.length > 1 ? 0.6 : 0.2,
                                                transition: 'all 0.3s'
                                            }}
                                            disabled={formData.items.length <= 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </PortfolioCard>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <PortfolioCard style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                    <Calendar size={18} color="var(--gold)" />
                                    <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px' }}>ENTRY DATE</div>
                                </div>
                                <PortfolioInput
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </PortfolioCard>

                            <PortfolioCard style={{ padding: '35px', background: 'rgba(176,141,87,0.03)' }}>
                                <PortfolioSectionTitle title="FINANCIAL SUMMARY" style={{ fontSize: '15px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                                        <span>Subtotal</span>
                                        <span>AED {totals.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gold)' }}>
                                        <span>VAT (5%)</span>
                                        <span>AED {totals.vat.toLocaleString()}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '24px',
                                        fontWeight: '900',
                                        color: '#fff',
                                        borderTop: '1px solid rgba(176,141,87,0.1)',
                                        paddingTop: '20px',
                                        marginTop: '5px'
                                    }}>
                                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>TOTAL</span>
                                        <span>AED {totals.grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </PortfolioCard>

                            <PortfolioButton type="submit" variant="gold" style={{ width: '100%', height: '70px', fontSize: '15px', fontWeight: '900', letterSpacing: '2px' }}>
                                <Save size={20} /> SYNC.supply_order
                            </PortfolioButton>
                        </div>
                    </div>
                </form>
            </div>
        </PortfolioPage>
    );
};

const labelStyle = { display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800' };
const sectionTitleStyle = { margin: '0 0 25px 0', fontSize: '18px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' };

export default PurchaseEntry;
