import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { SERVICES_CATALOG } from '../../constants/services';

import { CAR_BRANDS, CAR_MODELS, CAR_COLORS, YEAR_CHOICES, PLATE_EMIRATES, PLATE_CODES } from '../../constants/vehicle_data';

const JobCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        job_card_number: `JC-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        salutation: 'Mr.',
        customer_name: '',
        phone_prefix: '+971 5',
        phone_suffix_code: '0',
        phone_number: '',
        address: '',
        license_plate: '',
        plate_emirate: 'Dubai',
        plate_code: 'A',
        vin: '',
        brand: 'Toyota',
        model: '',
        year: '2025',
        color: '',
        kilometers: '',
        job_description: '',
        service_advisor: '',
        status: 'RECEPTION',
        selected_services: [],
        total_price: 0,
        vat_amount: 0,
        net_amount: 0
    });

    const [activeCategory, setActiveCategory] = useState('');
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const parseCustomerData = (name = '', phone = '') => {
        let salutation = 'Mr.';
        let cleanName = name;
        if (name.startsWith('Mr. ')) { salutation = 'Mr.'; cleanName = name.replace('Mr. ', ''); }
        else if (name.startsWith('Mrs. ')) { salutation = 'Mrs.'; cleanName = name.replace('Mrs. ', ''); }
        else if (name.startsWith('Ms. ')) { salutation = 'Ms.'; cleanName = name.replace('Ms. ', ''); }

        let phoneSuffix = '0';
        let cleanPhone = phone;
        if (phone.startsWith('+971 5')) {
            phoneSuffix = phone.charAt(6) || '0';
            cleanPhone = phone.substring(7);
        }

        return { salutation, cleanName, phoneSuffix, cleanPhone };
    };

    useEffect(() => {
        fetchUsers();
        if (location.state && (location.state.lead || location.state.booking)) {
            const data = location.state.lead || location.state.booking;
            const { salutation, cleanName, phoneSuffix, cleanPhone } = parseCustomerData(data.customer_name, data.phone || data.phone_number);

            setFormData(prev => ({
                ...prev,
                salutation,
                customer_name: cleanName,
                phone_suffix_code: phoneSuffix,
                phone_number: cleanPhone,
                license_plate: data.v_registration_no || data.license_plate || '',
                date: data.booking_date || new Date().toISOString().split('T')[0],
                job_description: data.notes || '',
                lead_id: data.id || '',
                brand: data.brand || 'Toyota',
                model: data.model || '',
                year: data.year || '2025',
                color: data.color || '',
            }));
        }
    }, [location.state]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/auth/users/');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const addService = (service) => {
        if (formData.selected_services.find(s => s.name === service.name)) return;
        const newServices = [...formData.selected_services, service];
        const subtotal = parseFloat(newServices.reduce((sum, s) => sum + parseFloat(s.price), 0).toFixed(2));
        const vat = parseFloat((subtotal * 0.05).toFixed(2));
        const total = parseFloat((subtotal + vat).toFixed(2));
        setFormData({
            ...formData,
            selected_services: newServices,
            total_price: subtotal,
            vat_amount: vat,
            net_amount: total
        });
    };

    const removeService = (index) => {
        const newServices = formData.selected_services.filter((_, i) => i !== index);
        const subtotal = newServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
        const vat = parseFloat((subtotal * 0.05).toFixed(2));
        const total = parseFloat((subtotal + vat).toFixed(2));
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
            // Strictly construct only valid model fields to avoid 400 Bad Request
            const submissionData = {
                job_card_number: formData.job_card_number + "-" + Math.floor(Math.random() * 999),
                date: formData.date,
                customer_name: `${formData.salutation} ${formData.customer_name}`,
                phone: `${formData.phone_prefix}${formData.phone_suffix_code}${formData.phone_number}`,
                address: formData.address || "",
                registration_number: formData.license_plate,
                plate_emirate: formData.plate_emirate || "Dubai",
                plate_code: formData.plate_code || "A",
                vin: formData.vin,
                brand: formData.brand,
                model: formData.model,
                year: parseInt(formData.year, 10) || new Date().getFullYear(),
                kilometers: formData.kilometers ? parseInt(formData.kilometers, 10) : 0,
                service_advisor: formData.service_advisor ? parseInt(formData.service_advisor, 10) : null,
                total_amount: formData.total_price ? parseFloat(formData.total_price) : 0.00,
                vat_amount: formData.vat_amount ? parseFloat(formData.vat_amount) : 0.00,
                net_amount: formData.net_amount ? parseFloat(formData.net_amount) : 0.00,
                status: 'RECEPTION',
                job_description: (formData.job_description ? formData.job_description + '\n\n' : '') +
                    'Selected Services:\n' +
                    (formData.selected_services || []).map(s => `- ${s.name} (AED ${s.price})`).join('\n')
            };

            // Optional: link to lead/booking if they exist
            if (formData.lead_id) submissionData.lead_id = formData.lead_id;
            if (formData.booking_id) submissionData.booking_id = formData.booking_id;

            console.log('Raw Service Advisor:', formData.service_advisor);
            console.log('Constructed Payload:', submissionData);

            const res = await api.post('/forms/job-cards/api/jobs/', submissionData);
            alert('Job Card Created successfully!');
            navigate(`/service-advisor/form?jobId=${res.data.id}`);
        } catch (err) {
            console.error('Full Error Object:', err);
            let errorMessage = 'Failed to create Job Card.';

            if (err.response && err.response.data) {
                // DRF validation errors are usually an object with field names
                const serverData = err.response.data;
                const fieldErrors = Object.entries(serverData)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('\n');

                errorMessage = `Validation Error (Status: ${err.response.status}):\n${fieldErrors}`;

                // If it's a non-field error
                if (serverData.non_field_errors) {
                    errorMessage += `\nGeneral: ${serverData.non_field_errors.join(', ')}`;
                }
                if (serverData.detail) {
                    errorMessage += `\nDetail: ${serverData.detail}`;
                }
            }
            alert(errorMessage);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button
                onClick={() => navigate('/job-cards')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px', fontSize: '13px' }}
            >
                <ArrowLeft size={16} /> Back to List
            </button>

            <GlassCard style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.5rem', margin: 0 }}>NEW JOB CARD</h2>
                    <span style={{ color: '#b08d57', fontWeight: '800', fontSize: '14px' }}>#{formData.job_card_number}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) 1fr', gap: '30px', marginBottom: '20px' }}>
                        <div className="section">
                            <h3 style={sectionTitleStyle}>RECEPTION & CUSTOMER</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '20px', marginBottom: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Customer Name</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select
                                            name="salutation"
                                            className="form-control"
                                            value={formData.salutation}
                                            onChange={handleChange}
                                            style={{ width: '80px', height: '36px', background: 'var(--input-bg)' }}
                                        >
                                            <option value="Mr.">Mr.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Ms.">Ms.</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            className="form-control"
                                            placeholder="Enter Full Name"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            required
                                            style={{ flex: 1, height: '36px' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone Number</label>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>+971 5</span>
                                        <select
                                            name="phone_suffix_code"
                                            className="form-control"
                                            value={formData.phone_suffix_code}
                                            onChange={handleChange}
                                            style={{ width: '60px', height: '36px', background: 'var(--input-bg)' }}
                                        >
                                            {['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            className="form-control"
                                            placeholder="7-digits"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            required
                                            style={{ flex: 1, height: '36px' }}
                                            maxLength="7"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={labelStyle}>Address (Optional)</label>
                                <input name="address" className="form-control" value={formData.address} onChange={handleChange} style={{ height: '36px' }} />
                            </div>

                            <h3 style={{ ...sectionTitleStyle, marginTop: '20px' }}>NOTES & COMPLAINTS</h3>
                            <textarea name="job_description" className="form-control" rows="3" value={formData.job_description} onChange={handleChange} placeholder="Damages, special requests..." style={{ fontSize: '13px', minHeight: '80px' }}></textarea>
                        </div>

                        <div className="section">
                            <h3 style={sectionTitleStyle}>VEHICLE DETAILS</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '10px' }}>
                                <div>
                                    <label style={labelStyle}>Brand</label>
                                    <select name="brand" className="form-control" value={formData.brand} onChange={handleChange} required style={{ height: '34px', fontSize: '13px', padding: '0 10px' }} autoComplete="off">
                                        {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Model</label>
                                    <input
                                        name="model"
                                        className="form-control"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                        list="car-models"
                                        placeholder="Type model..."
                                        style={{ height: '34px' }}
                                    />
                                    <datalist id="car-models">
                                        {CAR_MODELS[formData.brand]?.map(m => (
                                            <option key={m} value={m} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <select name="year" className="form-control" value={formData.year} onChange={handleChange} required style={{ height: '34px', fontSize: '13px', padding: '0 10px' }} autoComplete="off">
                                        {YEAR_CHOICES.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Color</label>
                                    <input
                                        name="color"
                                        className="form-control"
                                        value={formData.color}
                                        onChange={handleChange}
                                        required
                                        list="car-colors"
                                        placeholder="Pick color..."
                                        style={{ height: '34px' }}
                                    />
                                    <datalist id="car-colors">
                                        {CAR_COLORS.map(c => (
                                            <option key={c} value={c} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label style={labelStyle}>Kilometers</label>
                                    <input name="kilometers" type="number" className="form-control" value={formData.kilometers} onChange={handleChange} required style={{ height: '34px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div>
                                    <label style={labelStyle}>Emirate</label>
                                    <select name="plate_emirate" className="form-control" value={formData.plate_emirate} onChange={handleChange} required style={{ height: '34px', fontSize: '13px', padding: '0 10px' }}>
                                        {PLATE_EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Code</label>
                                    <select name="plate_code" className="form-control" value={formData.plate_code} onChange={handleChange} required style={{ height: '34px', fontSize: '13px', padding: '0 10px' }}>
                                        {PLATE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Number</label>
                                    <input name="license_plate" className="form-control" value={formData.license_plate} onChange={handleChange} required style={{ height: '34px' }} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>VIN Number</label>
                                <input name="vin" className="form-control" value={formData.vin} onChange={handleChange} required style={{ height: '34px' }} />
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
                                    {users.filter(u => u.hr_profile).map(u => (
                                        <option key={u.hr_profile.id || u.id} value={u.hr_profile.id}>{u.first_name || u.username}</option>
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
