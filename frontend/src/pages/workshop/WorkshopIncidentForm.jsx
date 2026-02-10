import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, ShieldAlert } from 'lucide-react';

const WorkshopIncidentForm = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        incident_number: `INC-${Date.now()}`,
        job_card: '',
        incident_type: 'VEHICLE_DAMAGE',
        severity: 'MINOR',
        incident_date: new Date().toISOString().slice(0, 16),
        incident_location: 'Workshop Floor',
        incident_description: '',
        what_happened: '',
        how_it_happened: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/forms/job-cards/api/jobs/');
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs', err);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/workshop/api/incidents/', formData);
            alert('Incident Report Logged Successfully');
            navigate('/workshop');
        } catch (err) {
            console.error('Error logging incident', err);
            alert('Failed to log incident: ' + (err.response?.data?.detail || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', background: '#0a0a0a', minHeight: '100vh' }}>
            <button
                onClick={() => navigate('/workshop')}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '30px', padding: '10px 20px', borderRadius: '12px' }}
            >
                <ArrowLeft size={18} /> BACK TO WORKSHOP
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '900', letterSpacing: '4px', marginBottom: '10px' }}>RISK & COMPLIANCE</div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2rem', fontWeight: '900', margin: 0 }}>Log Workshop Incident</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Incident Type</label>
                            <select name="incident_type" className="form-control" value={formData.incident_type} onChange={handleChange}>
                                <option value="VEHICLE_DAMAGE">Vehicle Damage</option>
                                <option value="EQUIPMENT_FAILURE">Equipment Failure</option>
                                <option value="STAFF_INJURY">Staff Injury</option>
                                <option value="CUSTOMER_DISPUTE">Customer Dispute</option>
                                <option value="LOST_ITEM">Lost Property</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Severity</label>
                            <select name="severity" className="form-control" value={formData.severity} onChange={handleChange}>
                                <option value="MINOR">Minor (No cost/Low risk)</option>
                                <option value="MAJOR">Major (Cost/Risk involved)</option>
                                <option value="SEVERE">Severe (Legal/Safety concern)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Job Card (Optional)</label>
                            <select name="job_card" className="form-control" value={formData.job_card} onChange={handleChange} disabled={loadingJobs}>
                                <option value="">{loadingJobs ? 'Loading...' : 'N/A'}</option>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.job_card_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Incident Date/Time</label>
                            <input name="incident_date" type="datetime-local" className="form-control" value={formData.incident_date} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Incident Location</label>
                        <input name="incident_location" className="form-control" value={formData.incident_location} onChange={handleChange} required />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Incident Description (Brief)</label>
                        <input name="incident_description" className="form-control" value={formData.incident_description} onChange={handleChange} required placeholder="Quick summary of the event..." />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={labelStyle}>What Happened?</label>
                            <textarea name="what_happened" className="form-control" rows="4" value={formData.what_happened} onChange={handleChange} required placeholder="Detailed sequence of events..."></textarea>
                        </div>
                        <div>
                            <label style={labelStyle}>How It Happened?</label>
                            <textarea name="how_it_happened" className="form-control" rows="4" value={formData.how_it_happened} onChange={handleChange} required placeholder="Root cause analysis..."></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#ef4444', border: 'none' }}>
                        <Save size={20} /> {submitting ? 'LOGGER ACTIVE...' : 'SUBMIT INCIDENT REPORT'}
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
    marginBottom: '8px',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '1px'
};

export default WorkshopIncidentForm;
