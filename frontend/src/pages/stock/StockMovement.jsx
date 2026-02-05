import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Save, Box, ArrowUpCircle, ArrowDownCircle, AlertCircle, FileText } from 'lucide-react';

const StockMovementEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        item: location.state?.itemId || '',
        type: location.state?.type || 'IN',
        quantity: '',
        job_card: location.state?.jobCardId || '',
        reason: location.state?.jobCardId ? `Consumption for Job #${location.state.jobCardId}` : '',
        recorded_by: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemRes, jobRes] = await Promise.all([
                api.get('/forms/stock/api/items/'),
                api.get('/forms/job-cards/api/jobs/')
            ]);
            setItems(itemRes.data);
            setJobs(jobRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/stock/api/movements/', formData);
            alert('Inventory Movement Recorded Successfully.');
            navigate('/stock');
        } catch (err) {
            console.error(err);
            alert('Failed to record movement. Check item selection & quantity.');
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Syncing Supply Chain...</div>;

    return (
        <div className="bento-section" style={{ padding: '40px 20px', minHeight: '100vh', background: '#0a0a0a' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingLeft: '20px' }}>
                <button
                    onClick={() => navigate('/stock')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '900', letterSpacing: '4px', marginBottom: '10px' }}>STOCK LOGISTICS</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '3rem', fontWeight: '900', margin: 0, color: '#fff' }}>Record Movement</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                <GlassCard style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '35px' }}>
                        <div style={{ gridColumn: '1 / span 2' }}>
                            <label style={labelStyle}>SELECT INVENTORY ITEM</label>
                            <select name="item" className="form-control" onChange={handleChange} value={formData.item} required
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px' }}>
                                <option value="">Select Item to Adjust...</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} ({item.current_stock} {item.unit} available)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>MOVEMENT TYPE</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <TypeButton
                                    active={formData.type === 'IN'}
                                    onClick={() => setFormData({ ...formData, type: 'IN' })}
                                    icon={<ArrowUpCircle size={18} />}
                                    label="Restock (In)"
                                    color="#10b981"
                                />
                                <TypeButton
                                    active={formData.type === 'OUT'}
                                    onClick={() => setFormData({ ...formData, type: 'OUT' })}
                                    icon={<ArrowDownCircle size={18} />}
                                    label="Consumption (Out)"
                                    color="#f43f5e"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>QUANTITY</label>
                            <input name="quantity" className="form-control" type="number" step="0.01" onChange={handleChange} required
                                placeholder="Enter amount..."
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px' }} />
                        </div>

                        {formData.type === 'OUT' && (
                            <div style={{ gridColumn: '1 / span 2' }}>
                                <label style={labelStyle}>LINK TO JOB CARD (FOR CONSUMPTION)</label>
                                <select name="job_card" className="form-control" onChange={handleChange}
                                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px' }}>
                                    <option value="">Search Job Cards...</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.job_card_number} - {job.customer_name} ({job.registration_number})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ gridColumn: '1 / span 2' }}>
                            <label style={labelStyle}>NARRATIVE / REASON</label>
                            <textarea name="reason" className="form-control" onChange={handleChange} rows="3"
                                placeholder="Details of this adjustment..."
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px' }}></textarea>
                        </div>

                        <div>
                            <label style={labelStyle}>RECORDED BY</label>
                            <input name="recorded_by" className="form-control" onChange={handleChange} required
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: '#b08d57', color: '#000', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                        <Save size={20} /> SYNC WITH INVENTORY LEDGER
                    </button>
                </GlassCard>
            </form>
        </div>
    );
};

const TypeButton = ({ active, onClick, icon, label, color }) => (
    <div
        onClick={onClick}
        style={{
            flex: 1,
            padding: '15px',
            borderRadius: '12px',
            border: `2px solid ${active ? color : 'rgba(255,255,255,0.05)'}`,
            background: active ? `${color}1A` : 'rgba(0,0,0,0.2)',
            color: active ? color : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontWeight: '800',
            fontSize: '12px',
            transition: 'all 0.3s'
        }}
    >
        {icon} {label}
    </div>
);

const labelStyle = {
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '800',
    marginBottom: '10px',
    display: 'block',
    letterSpacing: '1px'
};

export default StockMovementEntry;
