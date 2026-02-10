import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Clock } from 'lucide-react';

const WorkshopDelayForm = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        job_card: '',
        delay_number: `DLY-${Date.now()}`,
        delay_reason: '',
        detailed_reason: '',
        severity: 'LOW',
        original_completion_date: new Date().toISOString().slice(0, 16),
        new_estimated_completion_date: new Date().toISOString().slice(0, 16),
        additional_cost: 0,
        status: 'REPORTED'
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
            await api.post('/workshop/api/delays/', formData);
            alert('Delay Report Submitted Successfully');
            navigate('/workshop');
        } catch (err) {
            console.error('Error submitting delay', err);
            alert('Failed to submit delay report: ' + (err.response?.data?.detail || err.message));
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
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '4px', marginBottom: '10px' }}>OPERATIONAL EFFICIENCY</div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2rem', fontWeight: '900', margin: 0 }}>Report Service Delay</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Job Card</label>
                        <select name="job_card" className="form-control" value={formData.job_card} onChange={handleChange} required disabled={loadingJobs}>
                            <option value="">{loadingJobs ? 'Loading Jobs...' : 'Select Job Card'}</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>
                                    {job.job_card_number} - {job.customer_name} ({job.brand})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Delay Reason (Summary)</label>
                            <input name="delay_reason" className="form-control" value={formData.delay_reason} onChange={handleChange} required placeholder="e.g., Parts Availability" />
                        </div>
                        <div>
                            <label style={labelStyle}>Severity</label>
                            <select name="severity" className="form-control" value={formData.severity} onChange={handleChange}>
                                <option value="LOW">Minor Delay (1-2 hours)</option>
                                <option value="MEDIUM">Moderate Delay (3-6 hours)</option>
                                <option value="HIGH">Significant Delay (6+ hours)</option>
                                <option value="CRITICAL">Major Delay (24+ hours)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Original Completion</label>
                            <input name="original_completion_date" type="datetime-local" className="form-control" value={formData.original_completion_date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>New Estimated Completion</label>
                            <input name="new_estimated_completion_date" type="datetime-local" className="form-control" value={formData.new_estimated_completion_date} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Additional Cost (AED)</label>
                        <input name="additional_cost" type="number" step="0.01" className="form-control" value={formData.additional_cost} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>Detailed Reason / Notes</label>
                        <textarea name="detailed_reason" className="form-control" rows="4" value={formData.detailed_reason} onChange={handleChange} placeholder="Provide details about the root cause and mitigation steps..."></textarea>
                    </div>

                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> {submitting ? 'SUBMITTING...' : 'LOG DELAY EVENT'}
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

export default WorkshopDelayForm;
