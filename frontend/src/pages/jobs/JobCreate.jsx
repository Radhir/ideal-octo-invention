import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { SERVICES_CATALOG } from '../../constants/services';

const JobCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        job_card_number: `JC-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        customer_name: '',
        phone_number: '',
        address: '', // Fixed: initialized
        car_type: '',
        license_plate: '',
        odometer_reading: '',
        fuel_level: '50%',
        service_category: '', // Fixed: initialized
        vin: '', // Fixed: initialized
        assigned_to: '', // Fixed: initialized
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        job_description: '',
        service_advisor: 'Admin',
        status: 'RECEPTION',
        selected_services: [],
        total_price: 0
    });

    const [activeCategory, setActiveCategory] = useState('');
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchUsers();
        if (location.state && location.state.lead) {
            const lead = location.state.lead;
            setFormData(prev => ({
                ...prev,
                customer_name: lead.customer_name || '',
                phone_number: lead.phone || '',
                job_description: lead.notes || '',
            }));
        } else if (location.state && location.state.booking) {
            // New: Handle booking pre-fill if navigating from Booking List
            const b = location.state.booking;
            setFormData(prev => ({
                ...prev,
                customer_name: b.customer_name || '',
                phone_number: b.phone || '',
                license_plate: b.v_registration_no || '',
                date: b.booking_date || new Date().toISOString().split('T')[0],
                service_advisor: b.advisor_name || 'Admin',
            }));
        }
    }, [location.state]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users/');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const addService = (service) => {
        if (formData.selected_services.find(s => s.name === service.name)) return;
        const newServices = [...formData.selected_services, service];
        const subtotal = newServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
        const vat = subtotal * 0.05;
        const total = subtotal + vat;
        setFormData({
            ...formData,
            selected_services: newServices,
            total_price: subtotal, // This is net
            vat_amount: vat,
            net_amount: total
        });
    };

    const removeService = (index) => {
        const newServices = formData.selected_services.filter((_, i) => i !== index);
        const subtotal = newServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
        const vat = subtotal * 0.05;
        const total = subtotal + vat;
        setFormData({
            ...formData,
            selected_services: newServices,
            total_price: subtotal,
            vat_amount: vat,
            net_amount: total
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Map frontend fields to backend fields
            const submissionData = {
                ...formData,
                phone: formData.phone_number, // Fixed: Mapped phone number
                registration_number: formData.license_plate,
                kilometers: formData.odometer_reading,
                total_amount: formData.total_price, // Net
                vat_amount: formData.vat_amount || 0,
                net_amount: formData.net_amount || formData.total_price, // Gross
                // Join selected services into description if empty, or append
                job_description: (formData.job_description ? formData.job_description + '\n\n' : '') +
                    'Selected Services:\n' +
                    formData.selected_services.map(s => `- ${s.name} (AED ${s.price})`).join('\n')
            };

            const res = await axios.post('/forms/job-cards/api/jobs/', submissionData);
            alert('Job Card Created!');
            navigate(`/job-cards/${res.data.id}`);
        } catch (err) {
            console.error('Error creating job card', err);
            let errorMessage = 'Failed to create Job Card.';

            if (err.response && err.response.data) {
                // Format backend validation errors
                errorMessage = 'Validation Error:\n' + Object.entries(err.response.data)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('\n');
            }

            alert(errorMessage);
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <button
                onClick={() => navigate('/job-cards')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Reception & Check-in</h2>
                    <span style={{ color: '#b08d57', fontWeight: '800' }}>#{formData.job_card_number}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                        <div className="section">
                            <h3 style={sectionTitleStyle}>Customer Details</h3>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Customer Name</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    className="form-control"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    className="form-control"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Address</label>
                                <textarea name="address" className="form-control" rows="3" onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="section">
                            <h3 style={sectionTitleStyle}>Vehicle Information</h3>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Vehicle (Model/Year)</label>
                                <input
                                    type="text"
                                    name="car_type"
                                    className="form-control"
                                    value={formData.car_type}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Plate#</label>
                                    <input name="license_plate" className="form-control" value={formData.license_plate} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>VIN#</label>
                                    <input name="vin" className="form-control" value={formData.vin} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Brand</label>
                                    <input name="brand" className="form-control" value={formData.brand} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Model</label>
                                    <input name="model" className="form-control" value={formData.model} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <input name="year" type="number" className="form-control" onChange={handleChange} value={formData.year} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Color</label>
                                    <input name="color" className="form-control" value={formData.color} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Kilometers</label>
                                    <input name="odometer_reading" type="number" className="form-control" value={formData.odometer_reading} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section" style={{ marginBottom: '30px' }}>
                        <h3 style={sectionTitleStyle}>Service Selection</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Service Category</label>
                                <select
                                    className="form-control"
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                >
                                    <option value="">Select Category...</option>
                                    {Object.keys(SERVICES_CATALOG).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Specific Service</label>
                                <select
                                    className="form-control"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const service = SERVICES_CATALOG[activeCategory][e.target.value];
                                            addService(service);
                                            e.target.value = '';
                                        }
                                    }}
                                    disabled={!activeCategory}
                                >
                                    <option value="">Select Service...</option>
                                    {activeCategory && SERVICES_CATALOG[activeCategory].map((s, idx) => (
                                        <option key={idx} value={idx}>{s.name} - AED {(s.price * 1.05).toFixed(2)} (Incl. VAT)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Selected Services List */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Selected Services</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {formData.selected_services.length === 0 ? (
                                    <div style={{ padding: '15px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)', color: '#64748b', fontSize: '13px' }}>
                                        No services selected yet.
                                    </div>
                                ) : (
                                    formData.selected_services.map((s, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 15px',
                                            background: 'rgba(176, 141, 87, 0.05)',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(176, 141, 87, 0.1)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{s.name}</div>
                                                <div style={{ fontSize: '12px', color: '#b08d57' }}>AED {s.price}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeService(idx)}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Subtotal (Net)</label>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#94a3b8' }}>AED {formData.total_price.toFixed(2)}</div>
                                </div>
                                <div>
                                    <label style={labelStyle}>VAT (5%)</label>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#94a3b8' }}>AED {(formData.vat_amount || 0).toFixed(2)}</div>
                                </div>
                                <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                                    <label style={labelStyle}>Total Estimate (Gross)</label>
                                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#b08d57' }}>AED {(formData.net_amount || formData.total_price).toFixed(2)}</div>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Service Advisor</label>
                                <select
                                    name="service_advisor"
                                    className="form-control"
                                    value={formData.service_advisor}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Advisor...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.username}>{u.first_name || u.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Check-in Date</label>
                                <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} required />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={labelStyle}>Internal Notes / Additional Complaints</label>
                            <textarea name="job_description" className="form-control" rows="2" onChange={handleChange} placeholder="Any specific requirements or existing damages..."></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> Create Job Card
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};

const sectionTitleStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#b08d57',
    marginBottom: '15px',
    borderLeft: '3px solid #b08d57',
    paddingLeft: '10px',
    fontWeight: '700'
};

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    fontWeight: '600'
};

export default JobCreate;
