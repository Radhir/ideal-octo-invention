import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft } from 'lucide-react';

const RequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        request_by: '',
        car_type: '',
        plate_number: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_type: 'CASH',
        chassis_number: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/requests/api/forms/', formData);
            alert('Request Form Submitted');
            navigate('/requests');
        } catch (err) {
            console.error('Error submitting request', err);
            alert('Failed to submit request.');
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <button
                onClick={() => navigate('/requests')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', marginBottom: '30px', fontSize: '1.8rem' }}>Purchase Request Form</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Requested By</label>
                            <input name="request_by" className="form-control" onChange={handleChange} required />
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Car Type</label>
                            <input name="car_type" className="form-control" onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Plate Number</label>
                            <input name="plate_number" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={labelStyle}>Chassis Number</label>
                            <input name="chassis_number" className="form-control" onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Amount</label>
                            <input name="amount" type="number" className="form-control" onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> Submit Request
                    </button>
                </form>
            </GlassCard>
        </div>
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

export default RequestForm;
