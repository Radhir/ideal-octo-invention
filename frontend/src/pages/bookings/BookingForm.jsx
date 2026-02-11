import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, Clock, Calendar, User, Truck, Award, DollarSign, PenTool } from 'lucide-react';
import SignaturePad from '../../components/SignaturePad';
import { CAR_BRANDS, CAR_MODELS, CAR_COLORS } from '../../constants/vehicle_data';

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const leadData = location.state?.lead;

    const [employees, setEmployees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        salutation: 'Mr.',
        customer_name: leadData?.customer_name || '',
        phone_prefix: '+971 5',
        phone_suffix_code: '0',
        phone: leadData?.phone || '',
        v_registration_no: '',
        vehicle_details: '',
        service_category: '',
        service: '',
        booking_date: new Date().toISOString().split('T')[0],
        booking_time: '10:00',
        advisor: '',
        related_lead: leadData?.id || '',
        estimated_total: leadData?.estimated_value || 0,
        status: 'PENDING',
        notes: leadData?.notes || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, catRes, svcRes] = await Promise.all([
                    api.get('/hr/api/employees/'),
                    api.get('/forms/job-cards/api/service-categories/'),
                    api.get('/forms/job-cards/api/services/')
                ]);
                setEmployees(empRes.data);
                setCategories(catRes.data);
                setServices(svcRes.data);
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
            const submissionData = {
                ...formData,
                customer_name: `${formData.salutation} ${formData.customer_name}`,
                phone: `${formData.phone_prefix}${formData.phone_suffix_code}${formData.phone}`,
                vehicle_details: `${formData.brand} ${formData.model} - ${formData.color}`
            };
            await api.post('/forms/bookings/api/list/', submissionData);

            // If it came from a lead, mark the lead as negotiated or converted if needed
            // For now, just confirming the booking
            alert('Executive Appointment Scheduled Successfully');
            navigate('/bookings');
        } catch (err) {
            console.error('Error creating booking', err);
            alert('Failed to schedule appointment.');
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/bookings')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Reservation Engine</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>Schedule Appointment</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><User size={18} color="#b08d57" /> Customer & Vehicle</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Customer Full Name</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select
                                            name="salutation"
                                            className="form-control"
                                            value={formData.salutation}
                                            onChange={handleChange}
                                            style={{ width: '80px', height: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                                        >
                                            <option value="Mr.">Mr.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Ms.">Ms.</option>
                                        </select>
                                        <input name="customer_name" className="form-control" value={formData.customer_name} onChange={handleChange} required style={{ flex: 1 }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Contact Number</label>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>+971 5</span>
                                        <select
                                            name="phone_suffix_code"
                                            className="form-control"
                                            value={formData.phone_suffix_code}
                                            onChange={handleChange}
                                            style={{ width: '60px', height: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '0 5px' }}
                                        >
                                            {['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                        <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required
                                            placeholder="1234567" maxLength="7" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>License Plate #</label>
                                    <input name="v_registration_no" className="form-control" placeholder="DUBAI A 12345" onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Vehicle Brand</label>
                                    <select
                                        name="brand"
                                        className="form-control"
                                        value={formData.brand || 'Toyota'}
                                        onChange={handleChange}
                                        required
                                    >
                                        {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Model</label>
                                    <input
                                        name="model"
                                        className="form-control"
                                        value={formData.model || ''}
                                        onChange={handleChange}
                                        required
                                        list="booking-car-models"
                                        placeholder="Type model..."
                                    />
                                    <datalist id="booking-car-models">
                                        {CAR_MODELS[formData.brand || 'Toyota']?.map(m => (
                                            <option key={m} value={m} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label style={labelStyle}>Color</label>
                                    <input
                                        name="color"
                                        className="form-control"
                                        value={formData.color || ''}
                                        onChange={handleChange}
                                        required
                                        list="booking-car-colors"
                                        placeholder="Pick color..."
                                    />
                                    <datalist id="booking-car-colors">
                                        {CAR_COLORS.map(c => (
                                            <option key={c} value={c} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <h3 style={sectionTitleStyle}><Award size={18} color="#b08d57" /> Service Configuration</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Core Service Type</label>
                                    <select name="service_category" className="form-control" onChange={handleChange} required value={formData.service_category}>
                                        <option value="">Select Category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {formData.service_category && (
                                    <div style={{ marginTop: '10px' }}>
                                        <label style={labelStyle}>Specific Service</label>
                                        <select
                                            name="service"
                                            className="form-control"
                                            onChange={(e) => {
                                                const sId = e.target.value;
                                                const selectedSvc = services.find(s => s.id === parseInt(sId));
                                                setFormData({
                                                    ...formData,
                                                    service: sId,
                                                    estimated_total: selectedSvc ? parseFloat(selectedSvc.price) : parseFloat(formData.estimated_total || 0)
                                                });
                                            }}
                                            required
                                            value={formData.service}
                                        >
                                            <option value="">Select Specific Service...</option>
                                            {services.filter(s => s.category === parseInt(formData.service_category)).map(svc => (
                                                <option key={svc.id} value={svc.id}>{svc.name} - AED {svc.price}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label style={labelStyle}>Estimated Quotation (AED)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} size={16} />
                                        <input name="estimated_total" type="number" className="form-control" style={{ paddingLeft: '35px' }} value={formData.estimated_total} onChange={handleChange} />
                                    </div>
                                    {formData.estimated_total > 0 && (
                                        <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                                                <span>Subtotal (Net)</span>
                                                <span>AED {parseFloat(formData.estimated_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#b08d57', margin: '4px 0' }}>
                                                <span>VAT (5%)</span>
                                                <span>AED {(formData.estimated_total * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '900', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
                                                <span>Grand Total</span>
                                                <span>AED {(formData.estimated_total * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px' }}>
                            <label style={labelStyle}>Special Instructions / Notes</label>
                            <textarea name="notes" className="form-control" rows="4" value={formData.notes} onChange={handleChange} placeholder="Detail any specific arrival time constraints or valet requests..."></textarea>
                        </GlassCard>

                        <GlassCard style={{ padding: '35px', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                            <h3 style={sectionTitleStyle}><PenTool size={18} color="#b08d57" /> Pre-Check-in Signature</h3>
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
                                Customer signature for arrival authorization and initial service acceptance.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SignaturePad
                                    title="Customer Acceptance"
                                    onSave={(data) => setFormData({ ...formData, signature_data: data })}
                                />
                            </div>
                        </GlassCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><Clock size={16} color="#b08d57" /> Time-slot</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Date of Arrival</label>
                                <input name="booking_date" type="date" className="form-control" onChange={handleChange} value={formData.booking_date} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Estimated Time</label>
                                <input name="booking_time" type="time" className="form-control" onChange={handleChange} value={formData.booking_time} required />
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '30px' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '15px' }}><Award size={16} color="#b08d57" /> Representative</h3>
                            <label style={labelStyle}>Assign Service Advisor</label>
                            <select name="advisor" className="form-control" onChange={handleChange}>
                                <option value="">Select Advisor...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '15px' }}>
                                The advisor will be notified of this arrival and responsible for the Initial Inspection.
                            </p>
                        </GlassCard>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderRadius: '15px' }}>
                            <Save size={20} /> SYNC APPOINTMENT
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

export default BookingForm;
