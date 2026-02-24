import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioGrid,
    PortfolioCard,
    PortfolioInput,
    PortfolioSelect,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import { Clock, Calendar, User, Truck, Award, DollarSign, PenTool, CheckCircle, ArrowLeft } from 'lucide-react';
import SignaturePad from '../../components/SignaturePad';
import { CAR_BRANDS, CAR_MODELS, CAR_COLORS } from '../../constants/vehicle_data';

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const leadData = location.state?.lead;

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

    const { salutation: initSal, cleanName: initName, phoneSuffix: initSuffix, cleanPhone: initPhone } = parseCustomerData(leadData?.customer_name, leadData?.phone);

    const [employees, setEmployees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({
        salutation: initSal,
        customer_name: initName,
        phone_prefix: '+971 5',
        phone_suffix_code: initSuffix,
        phone: initPhone,
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
                const [empRes, svcRes] = await Promise.all([
                    api.get('/api/hr/employees/'),
                    api.get('/api/masters/services/')
                ]);
                setEmployees(empRes.data);
                setServices(svcRes.data);
                // Dynamically derive categories from services if needed, 
                // or just set a flat list for now.
                const uniqueCats = [...new Set(svcRes.data.map(s => s.department_name))].filter(Boolean);
                setCategories(uniqueCats.map((c, i) => ({ id: i + 1, name: c })));
            } catch (err) {
                console.error('Error fetching form metadata', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const submissionData = {
                ...formData,
                customer_name: `${formData.salutation} ${formData.customer_name}`,
                phone: `${formData.phone_prefix}${formData.phone_suffix_code}${formData.phone}`,
                vehicle_details: `${formData.brand} ${formData.model} - ${formData.color}`
            };
            await api.post('/api/bookings/', submissionData);
            alert('Executive Appointment Scheduled Successfully');
            navigate('/bookings');
        } catch (err) {
            console.error('Error creating booking', err);
            alert('Failed to schedule appointment.');
        }
    };

    return (
        <PortfolioPage>
            <div style={{ marginBottom: '80px', paddingTop: '40px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '40px',
                    color: 'var(--cream)',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/bookings')}>
                    <ArrowLeft size={16} /> BACK TO CALENDAR
                </div>

                <PortfolioTitle
                    title="SCHEDULE ASSIGNMENT"
                    subtitle="RESERVATION ENGINE // EXECUTIVE APPOINTMENT"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* Customer & Vehicle Section */}
                    <PortfolioCard>
                        <PortfolioSectionTitle title="CLIENT & MACHINE" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '30px' }}>
                            <PortfolioInput
                                label="SALUTATION"
                                name="salutation"
                                type="select"
                                value={formData.salutation}
                                onChange={handleChange}
                                options={[
                                    { value: 'Mr.', label: 'Mr.' },
                                    { value: 'Mrs.', label: 'Mrs.' },
                                    { value: 'Ms.', label: 'Ms.' }
                                ]}
                            />
                            <PortfolioInput
                                label="CLIENT FULL NAME"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px', marginBottom: '40px' }}>
                            <PortfolioInput
                                label="PREFIX"
                                name="phone_suffix_code"
                                type="select"
                                value={formData.phone_suffix_code}
                                onChange={handleChange}
                                options={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => ({ value: n, label: `05${n}` }))}
                            />
                            <PortfolioInput
                                label="CONTACT NUMBER"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="1234567"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <PortfolioInput
                                label="LICENSE PLATE"
                                name="v_registration_no"
                                value={formData.v_registration_no}
                                onChange={handleChange}
                                placeholder="DUBAI A 12345"
                            />
                            <PortfolioInput
                                label="VEHICLE BRAND"
                                name="brand"
                                type="select"
                                value={formData.brand || 'Toyota'}
                                onChange={handleChange}
                                options={CAR_BRANDS.map(b => ({ value: b, label: b }))}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <PortfolioInput
                                label="MODEL"
                                name="model"
                                value={formData.model || ''}
                                onChange={handleChange}
                                placeholder="Select or type..."
                                list="booking-car-models"
                            />
                            <datalist id="booking-car-models">
                                {CAR_MODELS[formData.brand || 'Toyota']?.map(m => (
                                    <option key={m} value={m} />
                                ))}
                            </datalist>

                            <PortfolioInput
                                label="COLOR"
                                name="color"
                                value={formData.color || ''}
                                onChange={handleChange}
                                placeholder="Select or type..."
                                list="booking-car-colors"
                            />
                            <datalist id="booking-car-colors">
                                {CAR_COLORS.map(c => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>
                    </PortfolioCard>

                    {/* Service Config */}
                    <PortfolioCard>
                        <PortfolioSectionTitle title="SERVICE CONFIGURATION" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <PortfolioInput
                                label="SERVICE CATEGORY"
                                name="service_category"
                                type="select"
                                value={formData.service_category}
                                onChange={handleChange}
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                            />
                            {formData.service_category && (
                                <PortfolioInput
                                    label="SPECIFIC PACKAGE"
                                    name="service"
                                    type="select"
                                    value={formData.service}
                                    onChange={(e) => {
                                        const sId = e.target.value;
                                        const selectedSvc = services.find(s => s.id === parseInt(sId));
                                        setFormData({
                                            ...formData,
                                            service: sId,
                                            estimated_total: selectedSvc ? parseFloat(selectedSvc.price) : parseFloat(formData.estimated_total || 0)
                                        });
                                    }}
                                    options={services
                                        .filter(s => s.category === parseInt(formData.service_category))
                                        .map(s => ({ value: s.id, label: `${s.name} - AED ${s.price}` }))
                                    }
                                />
                            )}
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <PortfolioInput
                                label="ESTIMATED TOTAL (AED)"
                                name="estimated_total"
                                type="number"
                                value={formData.estimated_total}
                                onChange={handleChange}
                            />
                            <div style={{
                                marginTop: '15px',
                                padding: '20px',
                                background: 'rgba(232, 230, 227, 0.05)',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                borderRadius: '10px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px' }}>
                                    <span>SUBTOTAL</span>
                                    <span>AED {parseFloat(formData.estimated_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '15px' }}>
                                    <span>VAT (5%)</span>
                                    <span>AED {(formData.estimated_total * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '500', color: 'var(--cream)', paddingTop: '15px', borderTop: '1px solid rgba(232, 230, 227, 0.1)' }}>
                                    <span>TOTAL QUOTATION</span>
                                    <span>AED {(formData.estimated_total * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <PortfolioInput
                                label="SPECIAL NOTES / INSTRUCTIONS"
                                name="notes"
                                type="textarea"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                    </PortfolioCard>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <PortfolioCard>
                        <PortfolioSectionTitle title="SCHEDULING" />

                        <div style={{ marginBottom: '30px' }}>
                            <PortfolioInput
                                label="DATE OF ARRIVAL"
                                name="booking_date"
                                type="date"
                                value={formData.booking_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <PortfolioInput
                                label="TIME SLOT"
                                name="booking_time"
                                type="time"
                                value={formData.booking_time}
                                onChange={handleChange}
                            />
                        </div>

                        <PortfolioInput
                            label="ASSIGNED ADVISOR"
                            name="advisor"
                            type="select"
                            value={formData.advisor}
                            onChange={handleChange}
                            options={employees.map(e => ({ value: e.id, label: e.full_name }))}
                        />
                    </PortfolioCard>

                    <PortfolioCard>
                        <PortfolioSectionTitle title="AUTHORIZATION" />
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SignaturePad
                                title="CLIENT SIGNATURE"
                                onSave={(data) => setFormData({ ...formData, signature_data: data })}
                            />
                        </div>
                    </PortfolioCard>

                    <PortfolioButton
                        onClick={handleSubmit}
                        primary
                        style={{ height: '70px', fontSize: '1.2rem' }}
                    >
                        CONFIRM RESERVATION
                    </PortfolioButton>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default BookingForm;
