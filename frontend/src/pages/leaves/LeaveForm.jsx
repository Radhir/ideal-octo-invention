import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft } from 'lucide-react';

const LeaveForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_name: '',
        position: '',
        leave_type: 'ANNUAL',
        leave_period_from: new Date().toISOString().split('T')[0],
        leave_period_to: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/leaves/api/applications/', formData);
            alert('Leave Application Submitted');
            navigate('/leaves');
        } catch (err) {
            console.error('Error submitting leave', err);
            alert('Failed to submit application.');
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <button
                onClick={() => navigate('/leaves')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', marginBottom: '30px', fontSize: '1.8rem' }}>Leave Application</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Employee Name</label>
                        <input name="employee_name" className="form-control" onChange={handleChange} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Position</label>
                        <input name="position" className="form-control" onChange={handleChange} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Leave Type</label>
                        <select name="leave_type" className="form-control" onChange={handleChange}>
                            <option value="ANNUAL">Annual Leave</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="EMERGENCY">Emergency Leave</option>
                            <option value="UNPAID">Unpaid Leave</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={labelStyle}>From Date</label>
                            <input name="leave_period_from" type="date" className="form-control" value={formData.leave_period_from} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>To Date</label>
                            <input name="leave_period_to" type="date" className="form-control" value={formData.leave_period_to} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> Submit Application
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

export default LeaveForm;
