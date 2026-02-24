import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioInput,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import { Save, ArrowLeft, Plus, X, Layers, User, Car } from 'lucide-react';
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
        initial_inspection_notes: '',
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
                color: formData.color,
                kilometers: formData.kilometers ? parseInt(formData.kilometers, 10) : 0,
                service_advisor: formData.service_advisor ? parseInt(formData.service_advisor, 10) : null,
                total_amount: formData.total_price ? parseFloat(formData.total_price) : 0.00,
                vat_amount: formData.vat_amount ? parseFloat(formData.vat_amount) : 0.00,
                net_amount: formData.net_amount ? parseFloat(formData.net_amount) : 0.00,
                status: 'RECEPTION',
                job_description: (formData.job_description ? formData.job_description + '\n\n' : '') +
                    'Selected Services:\n' +
                    (formData.selected_services || []).map(s => `- ${s.name} (AED ${s.price})`).join('\n'),
                initial_inspection_notes: formData.initial_inspection_notes || ""
            };

            if (formData.lead_id) submissionData.lead_id = formData.lead_id;
            if (formData.booking_id) submissionData.booking_id = formData.booking_id;

            const res = await api.post('/api/job-cards/api/jobs/', submissionData);
            alert('Job Card Created successfully!');
            navigate(`/service-advisor/form?jobId=${res.data.id}`);
        } catch (err) {
            console.error('Submission Error:', err);
            alert('Failed to create Job Card. Please check all fields.');
        }
    };

    return (
        <PortfolioPage>
            <div style={{ padding: '40px 0' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
                    color: 'var(--cream)', fontSize: '13px', letterSpacing: '1px', cursor: 'pointer'
                }} onClick={() => navigate('/job-cards')}>
                    <ArrowLeft size={16} /> BACK TO LIST
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                    <PortfolioTitle
                        title="NEW JOB CARD"
                        subtitle={`RECEPTION // ${formData.job_card_number}`}
                    />
                    <div style={{
                        textAlign: 'right',
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: '800' }}>TIMESTAMP</div>
                        <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '700', marginTop: '4px' }}>{new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* LEFT COLUMN: Customer & Vehicle */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <PortfolioCard style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={20} color="var(--gold)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>SECTION // 01</div>
                                        <PortfolioSectionTitle title="CLIENT IDENTITY" style={{ marginBottom: 0, fontSize: '18px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px', marginBottom: '25px' }}>
                                    <PortfolioInput
                                        label="TITLE"
                                        name="salutation"
                                        type="select"
                                        value={formData.salutation}
                                        onChange={handleChange}
                                        options={[{ value: 'Mr.', label: 'Mr.' }, { value: 'Mrs.', label: 'Mrs.' }, { value: 'Ms.', label: 'Ms.' }]}
                                    />
                                    <PortfolioInput
                                        label="FULL NAME"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        placeholder="Customer Name"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px' }}>
                                    <PortfolioInput
                                        label="PREFIX"
                                        name="phone_suffix_code"
                                        type="select"
                                        value={formData.phone_suffix_code}
                                        onChange={handleChange}
                                        options={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => ({ value: n, label: `05${n}` }))}
                                    />
                                    <PortfolioInput
                                        label="MOBILE NUMBER"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="7-digits"
                                        maxLength="7"
                                    />
                                </div>
                            </PortfolioCard>

                            <PortfolioCard style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Car size={20} color="var(--gold)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>SECTION // 02</div>
                                        <PortfolioSectionTitle title="VEHICLE PROFILE" style={{ marginBottom: 0, fontSize: '18px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <PortfolioInput
                                        label="BRAND"
                                        name="brand"
                                        type="select"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        options={CAR_BRANDS.map(b => ({ value: b, label: b }))}
                                    />
                                    <PortfolioInput
                                        label="MODEL"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        list="car-models"
                                    />
                                    <datalist id="car-models">
                                        {CAR_MODELS[formData.brand]?.map(m => (
                                            <option key={m} value={m} />
                                        ))}
                                    </datalist>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <PortfolioInput
                                        label="YEAR"
                                        name="year"
                                        type="select"
                                        value={formData.year}
                                        onChange={handleChange}
                                        options={YEAR_CHOICES.map(y => ({ value: y, label: y }))}
                                    />
                                    <PortfolioInput
                                        label="COLOR"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        list="car-colors"
                                    />
                                    <datalist id="car-colors">
                                        {CAR_COLORS.map(c => <option key={c} value={c} />)}
                                    </datalist>
                                    <PortfolioInput
                                        label="ODOMETER (KM)"
                                        name="kilometers"
                                        type="number"
                                        value={formData.kilometers}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '100px 80px 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <PortfolioInput
                                        label="EMIRATES"
                                        name="plate_emirate"
                                        type="select"
                                        value={formData.plate_emirate}
                                        onChange={handleChange}
                                        options={PLATE_EMIRATES.map(e => ({ value: e, label: e }))}
                                    />
                                    <PortfolioInput
                                        label="CODE"
                                        name="plate_code"
                                        type="select"
                                        value={formData.plate_code}
                                        onChange={handleChange}
                                        options={PLATE_CODES.map(c => ({ value: c, label: c }))}
                                    />
                                    <PortfolioInput
                                        label="PLATE NO."
                                        name="license_plate"
                                        value={formData.license_plate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <PortfolioInput
                                    label="VIN (CHASSIS NO.)"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleChange}
                                />
                            </PortfolioCard>
                        </div>

                        {/* RIGHT COLUMN: Services & Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <PortfolioCard style={{ padding: '35px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Layers size={20} color="var(--gold)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>SECTION // 03</div>
                                        <PortfolioSectionTitle title="SERVICE CONFIGURATION" style={{ marginBottom: 0, fontSize: '18px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    <PortfolioInput
                                        label="CATEGORY"
                                        name="category"
                                        type="select"
                                        value={activeCategory}
                                        onChange={(e) => setActiveCategory(e.target.value)}
                                        options={[
                                            { value: '', label: 'Select Category...' },
                                            ...Object.keys(SERVICES_CATALOG).map(cat => ({ value: cat, label: cat }))
                                        ]}
                                    />
                                    <PortfolioInput
                                        label="SERVICE"
                                        name="service"
                                        type="select"
                                        disabled={!activeCategory}
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                const service = SERVICES_CATALOG[activeCategory][parseInt(e.target.value)];
                                                addService(service);
                                            }
                                        }}
                                        options={[
                                            { value: '', label: 'Add Service...' },
                                            ...(activeCategory && SERVICES_CATALOG[activeCategory]
                                                ? SERVICES_CATALOG[activeCategory].map((s, idx) => ({
                                                    value: idx,
                                                    label: `${s.name} — AED ${(s.price * 1.05).toFixed(0)}`
                                                }))
                                                : [])
                                        ]}
                                    />
                                </div>

                                {/* Services List */}
                                <div style={{ marginBottom: '30px', minHeight: '100px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', marginBottom: '10px', letterSpacing: '1px' }}>SELECTED SERVICES</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {formData.selected_services.length === 0 ? (
                                            <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed rgba(232, 230, 227, 0.2)', borderRadius: '10px', color: 'rgba(232, 230, 227, 0.4)', fontSize: '13px' }}>
                                                No services added. Select a category to begin.
                                            </div>
                                        ) : (
                                            formData.selected_services.map((s, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '15px', background: 'var(--gold-glow)', borderRadius: '10px', border: '1px solid var(--gold-border)'
                                                }}>
                                                    <div>
                                                        <div style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '500' }}>{s.name}</div>
                                                        <div style={{ color: 'var(--gold)', fontSize: '12px' }}>AED {s.price}</div>
                                                    </div>
                                                    <button type="button" onClick={() => removeService(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <PortfolioInput
                                    label="CUSTOMER PREFERENCES / COMPLAINTS"
                                    name="job_description"
                                    type="textarea"
                                    rows={3}
                                    value={formData.job_description}
                                    onChange={handleChange}
                                    placeholder="Enter specific requests or reported issues..."
                                />
                            </PortfolioCard>

                            <PortfolioCard style={{ background: 'var(--bg-secondary)' }}>
                                <PortfolioSectionTitle title="FINANCIAL ESTIMATE" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)' }}>
                                    <span>Subtotal (Net)</span>
                                    <span>AED {formData.total_price.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)' }}>
                                    <span>VAT (5%)</span>
                                    <span>AED {formData.vat_amount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', fontSize: '24px', fontWeight: '600', color: 'var(--gold)' }}>
                                    <span>TOTAL</span>
                                    <span>AED {(formData.net_amount || formData.total_price).toFixed(2)}</span>
                                </div>
                            </PortfolioCard>

                            <PortfolioCard>
                                <PortfolioInput
                                    label="SERVICE ADVISOR"
                                    name="service_advisor"
                                    type="select"
                                    value={formData.service_advisor}
                                    onChange={handleChange}
                                    options={[
                                        { value: '', label: 'Select Advisor...' },
                                        ...users.filter(u => u.hr_profile).map(u => ({ value: u.hr_profile.id, label: u.first_name || u.username }))
                                    ]}
                                />
                                <div style={{ marginTop: '30px' }}>
                                    <PortfolioButton primary type="submit" style={{ width: '100%', height: '56px', fontSize: '14px' }}>
                                        <Save size={18} /> INITIALIZE JOB CARD
                                    </PortfolioButton>
                                </div>
                            </PortfolioCard>
                        </div>
                    </div>
                </form>
            </div>
        </PortfolioPage>
    );
};

export default JobCreate;
