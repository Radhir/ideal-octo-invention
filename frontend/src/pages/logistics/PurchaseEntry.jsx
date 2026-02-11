import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
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
            await api.post('/logistics/api/purchases/', submissionData);
            alert('Purchase Entry Synchronized with Inventory Ledger.');
            navigate('/stock');
        } catch (err) {
            console.error(err);
            alert('Failed to log purchase entry.');
        }
    };

    const totals = calculateTotals();

    return (
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Procurement & Inventory</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>PURCHASE ENTRY</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><User size={18} color="var(--gold)" /> Vendor & Reference</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Vendor / Supplier Name</label>
                                    <input name="vendor_name" className="form-control" value={formData.vendor_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Purchase Reference #</label>
                                    <input name="purchase_number" className="form-control" value={formData.purchase_number} onChange={handleChange} required />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}><ShoppingCart size={18} color="var(--gold)" /> Item Breakdown</h3>
                                <button type="button" onClick={addItem} className="btn-outline" style={{ fontSize: '11px', padding: '8px 15px' }}>
                                    <Plus size={14} /> ADD ITEM
                                </button>
                            </div>

                            {formData.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 50px', gap: '15px', marginBottom: '15px', alignItems: 'end' }}>
                                    <div>
                                        {idx === 0 && <label style={labelStyle}>Item Description</label>}
                                        <input className="form-control" value={item.detail} onChange={(e) => handleItemChange(idx, 'detail', e.target.value)} required placeholder="e.g. Engine Oil 5W30" />
                                    </div>
                                    <div>
                                        {idx === 0 && <label style={labelStyle}>Qty</label>}
                                        <input type="number" className="form-control" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value))} required />
                                    </div>
                                    <div>
                                        {idx === 0 && <label style={labelStyle}>Price</label>}
                                        <input type="number" className="form-control" value={item.price} onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value))} required />
                                    </div>
                                    <button type="button" onClick={() => removeItem(idx)} style={{ height: '45px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </GlassCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><Calendar size={16} color="var(--gold)" /> Date</h3>
                            <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} required />
                        </GlassCard>

                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}>Financial Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span>Subtotal</span>
                                    <span>AED {totals.subtotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gold)' }}>
                                    <span>VAT (5%)</span>
                                    <span>AED {totals.vat.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#fff', borderTop: '1px solid var(--gold-border)', paddingTop: '10px' }}>
                                    <span>TOTAL</span>
                                    <span>AED {totals.grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </GlassCard>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                            <Save size={20} /> SYNC PURCHASE
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800' };
const sectionTitleStyle = { margin: '0 0 25px 0', fontSize: '18px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' };

export default PurchaseEntry;
