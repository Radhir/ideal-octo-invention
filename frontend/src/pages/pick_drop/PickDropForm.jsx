import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Truck, User, MapPin, Calendar, Car } from 'lucide-react';

const PickDropForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const payload = location.state?.payload || location.state?.jobCard;

    const [formData, setFormData] = useState({
        job_card: payload?.id || '',
        customer_name: payload?.customer_name || '',
        phone: payload?.phone || '',
        vehicle_brand: payload?.vehicle_brand || '',
        vehicle_model: payload?.vehicle_model || '',
        license_plate: payload?.license_plate || '',
        pickup_location: '',
        drop_off_location: '',
        scheduled_time: new Date().toISOString().slice(0, 16),
        driver: '',
        status: 'SCHEDULED'
    });

    const [employees, setEmployees] = useState([]);
    const [jobCards, setJobCards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, jcRes] = await Promise.all([
                    axios.get('/hr/api/employees/'),
                    axios.get('/forms/job-cards/api/jobs/')
                ]);
                setEmployees(empRes.data);
                setJobCards(jcRes.data);
            } catch (err) {
                console.error('Error fetching Logistics metadata', err);
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
            await axios.post('/forms/pick-and-drop/api/trips/', formData);
            alert('Logistics Movement Scheduled Successfully');
            navigate('/pick-drop');
        } catch (err) {
            console.error('Error scheduling trip', err);
            alert('Failed to schedule logistics trip.');
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/pick-drop')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Logistics Associate</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>Schedule Movement</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><Car size={18} color="#b08d57" /> Vehicle & Identity</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Linked Job Card</label>
                                    <select name="job_card" className="form-control" value={formData.job_card} onChange={handleChange}>
                                        <option value="">Standby / Unlinked</option>
                                        {jobCards.map(jc => (
                                            <option key={jc.id} value={jc.id}>{jc.jc_number} - {jc.customer_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Customer Name</label>
                                        <input name="customer_name" className="form-control" value={formData.customer_name} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Contact #</label>
                                        <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Brand</label>
                                    <input name="vehicle_brand" className="form-control" value={formData.vehicle_brand} onChange={handleChange} placeholder="e.g. Porsche" required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Model</label>
                                    <input name="vehicle_model" className="form-control" value={formData.vehicle_model} onChange={handleChange} placeholder="e.g. 911 GT3" required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Plate #</label>
                                    <input name="license_plate" className="form-control" value={formData.license_plate} onChange={handleChange} placeholder="Dubai A 12345" required />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><MapPin size={18} color="#b08d57" /> Route Configuration</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                <div>
                                    <label style={labelStyle}>Pickup Point</label>
                                    <input name="pickup_location" className="form-control" value={formData.pickup_location} onChange={handleChange} placeholder="Specify detailed pickup address..." required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Delivery Point</label>
                                    <input name="drop_off_location" className="form-control" value={formData.drop_off_location} onChange={handleChange} placeholder="Specify detailed drop-off address..." required />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><Calendar size={16} color="#b08d57" /> Timing</h3>
                            <label style={labelStyle}>Scheduled Time</label>
                            <input name="scheduled_time" type="datetime-local" className="form-control" value={formData.scheduled_time} onChange={handleChange} required />
                        </GlassCard>

                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><User size={16} color="#b08d57" /> Assignment</h3>
                            <label style={labelStyle}>Assign Driver</label>
                            <select name="driver" className="form-control" onChange={handleChange} value={formData.driver} required>
                                <option value="">Select Driver...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                        </GlassCard>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderRadius: '15px' }}>
                            <Save size={20} /> SYNC LOGISTICS
                        </button>
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

export default PickDropForm;
