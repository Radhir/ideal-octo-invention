import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Activity, User, Target, Clock, AlertCircle } from 'lucide-react';

const OperationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const jcData = location.state?.jobCard;

    const [formData, setFormData] = useState({
        job_card: jcData?.id || '',
        operation_name: '',
        assigned_to: '',
        start_date: new Date().toISOString().split('T')[0],
        estimated_completion: '',
        progress_percentage: 0,
        status: 'IN_PROGRESS',
        remarks: ''
    });

    const [employees, setEmployees] = useState([]);
    const [jobCards, setJobCards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, jcRes] = await Promise.all([
                    api.get('/api/hr/employees/'),
                    api.get('/api/job-cards/api/jobs/')
                ]);
                setEmployees(empRes.data);
                setJobCards(jcRes.data);
            } catch (err) {
                console.error('Error fetching form metadata', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/operations/api/list/', formData);
            alert('Production Log Updated Successfully');
            navigate('/operations');
        } catch (err) {
            console.error('Error logging operation', err);
            alert('Failed to log production activity.');
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/operations')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Logistics Associate</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>Production Entry</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><Activity size={18} color="#b08d57" /> Task Definition</h3>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={labelStyle}>Linked Job Card</label>
                                <select name="job_card" className="form-control" value={formData.job_card} onChange={handleChange} required>
                                    <option value="">Select Job Card...</option>
                                    {jobCards.map(jc => (
                                        <option key={jc.id} value={jc.id}>{jc.job_card_number} - {jc.customer_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Operation / Service Name</label>
                                <input name="operation_name" className="form-control" value={formData.operation_name} onChange={handleChange} placeholder="e.g. Multi-Stage Correction" required />
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><Target size={18} color="#b08d57" /> Performance Tracking</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Production Status</label>
                                    <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                                        <option value="IN_PROGRESS">In Production</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Progress Percentage (%)</label>
                                    <input name="progress_percentage" type="number" min="0" max="100" className="form-control" value={formData.progress_percentage} onChange={handleChange} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                <div>
                                    <label style={labelStyle}>Commencement Date</label>
                                    <input name="start_date" type="date" className="form-control" value={formData.start_date} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>ETA / Completion Time</label>
                                    <input name="estimated_completion" type="datetime-local" className="form-control" value={formData.estimated_completion} onChange={handleChange} />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <label style={labelStyle}>Technician Comments</label>
                            <textarea name="remarks" className="form-control" rows="4" value={formData.remarks} onChange={handleChange} placeholder="Detail any issues encountered or specific observations..."></textarea>
                        </GlassCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><User size={16} color="#b08d57" /> Personnel</h3>
                            <label style={labelStyle}>Assign Lead Technician</label>
                            <select name="assigned_to" className="form-control" onChange={handleChange} value={formData.assigned_to} required>
                                <option value="">Select Technician...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '15px' }}>
                                This technician will be primary responsible for the outcome of this specific task.
                            </p>
                        </GlassCard>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderRadius: '15px' }}>
                            <Save size={20} /> SYNC PRODUCTION
                        </button>

                        <GlassCard style={{ padding: '20px', border: '1px solid rgba(176,141,87,0.2)' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <AlertCircle size={20} color="#b08d57" />
                                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>Note: Completing 100% progress will automatically trigger Quality Control inspection requests.</span>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </form>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '8px',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: '1px'
};

const sectionTitleStyle = {
    margin: '0 0 25px 0',
    fontSize: '18px',
    fontWeight: '900',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

export default OperationForm;
