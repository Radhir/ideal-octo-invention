import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft } from 'lucide-react';

const StockForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        department: '',
        request_by: '',
        car_type: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_type: 'CASH',
        plate_number: '',
        item_description: ''
    });

    const location = useLocation();

    React.useEffect(() => {
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                plate_number: location.state.plate_number || '',
                car_type: location.state.car_type || '',
                request_by: location.state.request_by || ''
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/forms/stock/api/items/', formData);
            alert('Stock Request Created Successfully');
            navigate('/stock');
        } catch (err) {
            console.error('Error creating stock request', err);
            alert('Failed to create stock request.');
        }
    };

    return (
        <div className="bento-section" style={{ padding: '40px 20px', minHeight: '100vh', background: '#0a0a0a' }}>
            <button
                onClick={() => navigate('/stock')}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '30px', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}
            >
                <ArrowLeft size={18} /> BACK TO LOGISTICS
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '4px', marginBottom: '10px' }}>PROCUREMENT ENGINE</div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Item Registration</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Department</label>
                            <input name="department" className="form-control" value={formData.department} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Requested By</label>
                            <input name="request_by" className="form-control" value={formData.request_by} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Car Type</label>
                            <input name="car_type" className="form-control" value={formData.car_type} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Plate Number</label>
                            <input name="plate_number" className="form-control" value={formData.plate_number} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Amount</label>
                            <input name="amount" type="number" className="form-control" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Payment Type</label>
                            <select name="payment_type" className="form-control" onChange={handleChange}>
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>Item Description</label>
                        <textarea name="item_description" className="form-control" rows="4" onChange={handleChange} required></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: '#b08d57', color: '#000', fontWeight: '900', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                        <Save size={20} /> SYNC WITH INDUSTRIAL DATABASE
                    </button>
                </form>
            </GlassCard>
        </div >
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    fontWeight: '600'
};

export default StockForm;
