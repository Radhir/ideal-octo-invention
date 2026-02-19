import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
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
import {
    User, Car, Layers, Zap, AlertCircle, Shield, FileText,
    Camera, Image, X, Check, ArrowLeft, ArrowRight, Save,
    Trash2, DollarSign, Mail
} from 'lucide-react';

// Constants
const STEPS = [
    { key: 'customer', label: 'CLIENT IDENTITY', icon: User },
    { key: 'vehicle', label: 'VEHICLE PROFILE', icon: Car },
    { key: 'services', label: 'SERVICE CONFIG', icon: Layers },
    { key: 'source', label: 'LEAD SOURCE', icon: Zap },
    { key: 'review', label: 'FINAL REVIEW', icon: FileText }
];

const SOURCES = [
    { value: 'INSTAGRAM', label: 'Instagram', color: '#E1306C' },
    { value: 'GOOGLE', label: 'Google Ads', color: '#4285F4' },
    { value: 'WALK_IN', label: 'Walk-In', color: '#10B981' },
    { value: 'REFERRAL', label: 'Referral', color: '#F59E0B' },
    { value: 'TIKTOK', label: 'TikTok', color: '#000000' },
    { value: 'FACEBOOK', label: 'Facebook', color: '#1877F2' },
    { value: 'PHONE', label: 'Phone Inquiry', color: '#8B5CF6' },
    { value: 'OTHER', label: 'Other', color: '#64748B' }
];

const PRIORITIES = [
    { value: 'LOW', label: 'LOW', color: '#94A3B8', desc: 'Standard Timeline' },
    { value: 'MEDIUM', label: 'MEDIUM', color: '#3B82F6', desc: 'Normal Processing' },
    { value: 'HIGH', label: 'HIGH', color: '#F59E0B', desc: 'Priority Service' },
    { value: 'URGENT', label: 'URGENT', color: '#EF4444', desc: 'Immediate Action' }
];

const STATUSES = [
    { value: 'NEW', label: 'New Lead' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'NEGOTIATION', label: 'Negotiation' },
    { value: 'WON', label: 'Won / Booked' },
    { value: 'LOST', label: 'Lost' }
];

const SERVICES_CATALOG = {
    'PPF': [
        { name: 'Full Body PPF (Gloss)', price: 12000 },
        { name: 'Full Body PPF (Matte)', price: 14000 },
        { name: 'Front Kit PPF', price: 4500 },
        { name: 'Track Pack PPF', price: 6500 }
    ],
    'TINTING': [
        { name: 'Full Car Tint (Ceramic)', price: 1200 },
        { name: 'Full Car Tint (Crystalline)', price: 2500 }
    ],
    'POLISHING': [
        { name: 'Detailing Standard', price: 500 },
        { name: 'Detailing Premium', price: 1200 },
        { name: 'Paint Correction (Stage 1)', price: 1500 },
        { name: 'Paint Correction (Stage 2)', price: 2500 }
    ],
    'CERAMIC': [
        { name: 'Ceramic Coating (1 Year)', price: 1500 },
        { name: 'Ceramic Coating (3 Years)', price: 2500 },
        { name: 'Ceramic Coating (5 Years)', price: 4000 }
    ],
    'WRAPPING': [
        { name: 'Full Color Change', price: 10000 },
        { name: 'Roof Wrap', price: 800 },
        { name: 'Chrome Delete', price: 1500 }
    ]
};

const LeadForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [employees, setEmployees] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        salutation: 'Mr.',
        customer_name: '',
        phone_prefix: '+971 5',
        phone_suffix_code: '0',
        phone: '',
        email: '',
        vehicle_type: 'SEDAN',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: new Date().getFullYear(),
        vehicle_color: '',
        license_plate: '',
        vin: '',
        source: '',
        priority: 'MEDIUM',
        status: 'NEW',
        assigned_to: '',
        follow_up_date: '',
        estimated_value: '',
        notes: '',
        interested_service: ''
    });

    const [selectedServices, setSelectedServices] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [photos, setPhotos] = useState([]);
    const fileInputRef = useRef(null);

    // Fetch Employees
    const fetchEmployees = useCallback(async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addService = (service) => {
        if (selectedServices.find(s => s.name === service.name)) return;
        setSelectedServices(prev => [...prev, service]);
    };

    const removeService = (index) => {
        setSelectedServices(prev => prev.filter((_, i) => i !== index));
    };

    // Photo Handling
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const scaleSize = MAX_WIDTH / img.width;
                    const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
                    const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        const compressedFiles = await Promise.all(files.map(compressImage));
        const newPhotos = compressedFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            label: 'General'
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
        e.target.value = '';
    };

    const removePhoto = (index) => {
        setPhotos(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Calculations
    const subtotal = selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
    const vat = subtotal * 0.05;
    const grandTotal = subtotal + vat;

    // Submission
    const handleSubmit = async () => {
        try {
            const servicesSummary = selectedServices.map(s => s.name).join(', ');
            const vehicleInfo = formData.vehicle_brand
                ? `${formData.vehicle_brand} ${formData.vehicle_model} ${formData.vehicle_year} (${formData.vehicle_color}) - ${formData.vehicle_type} | Plate: ${formData.license_plate}`
                : '';

            const enrichedNotes = [
                vehicleInfo && `Vehicle: ${vehicleInfo}`,
                selectedServices.length > 0 && `\nSelected Services:\n${selectedServices.map(s => `  - ${s.name} (AED ${s.price})`).join('\n')}`,
                `\nSubtotal: AED ${subtotal.toFixed(2)} | VAT: AED ${vat.toFixed(2)} | Total: AED ${grandTotal.toFixed(2)}`,
                formData.notes && `\nNotes: ${formData.notes}`,
            ].filter(Boolean).join('\n');

            const formDataPayload = new FormData();
            formDataPayload.append('customer_name', `${formData.salutation} ${formData.customer_name}`);
            formDataPayload.append('phone', `${formData.phone_prefix}${formData.phone_suffix_code}${formData.phone}`);
            formDataPayload.append('email', formData.email || '');
            formDataPayload.append('source', formData.source);
            formDataPayload.append('interested_service', servicesSummary || formData.interested_service);
            formDataPayload.append('priority', formData.priority);
            formDataPayload.append('estimated_value', subtotal > 0 ? subtotal.toFixed(2) : (formData.estimated_value ? parseFloat(formData.estimated_value).toFixed(2) : '0.00'));
            formDataPayload.append('assigned_to', formData.assigned_to || '');
            formDataPayload.append('follow_up_date', formData.follow_up_date || '');
            formDataPayload.append('notes', enrichedNotes);
            formDataPayload.append('status', formData.status);

            // Vehicle Registry Integration
            formDataPayload.append('vin', formData.vin || '');
            formDataPayload.append('registration_number', formData.license_plate || '');
            formDataPayload.append('brand', formData.vehicle_brand || '');
            formDataPayload.append('model', formData.vehicle_model || '');
            formDataPayload.append('year', formData.vehicle_year || '');
            formDataPayload.append('color', formData.vehicle_color || '');

            photos.forEach((photo) => {
                formDataPayload.append('photos', photo.file);
                formDataPayload.append('captions', photo.label);
            });

            await api.post('/forms/leads/api/list/', formDataPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Lead Captured Successfully');
            navigate('/leads');
        } catch (err) {
            console.error('Error capturing lead', err);
            alert('Failed to capture lead. Please check connection.');
        }
    };

    const canProceed = () => {
        switch (step) {
            case 0: return formData.customer_name && formData.phone;
            case 1: return true;
            case 2: return true;
            case 3: return formData.source;
            default: return true;
        }
    };

    return (
        <PortfolioPage>
            {/* Header */}
            <div style={{ marginBottom: '60px', paddingTop: '40px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '40px',
                    color: 'var(--cream)',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/leads')}>
                    <ArrowLeft size={16} /> BACK TO LIST
                </div>
                <PortfolioTitle
                    title="NEW OPPORTUNITY"
                    subtitle={`EXECUTIVE CRM // STEP ${step + 1} OF ${STEPS.length}`}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '60px' }}>
                {/* Steps Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i === step;
                        const isDone = i < step;
                        return (
                            <div
                                key={s.key}
                                onClick={() => i <= step && setStep(i)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    background: isActive ? 'var(--gold-glow)' : 'transparent',
                                    border: isActive ? '1px solid var(--gold-border)' : '1px solid transparent',
                                    color: isActive ? 'var(--gold)' : isDone ? 'var(--cream)' : 'rgba(232, 230, 227, 0.3)',
                                    cursor: i <= step ? 'pointer' : 'default',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Icon size={20} />
                                <span style={{ fontWeight: '600', fontSize: '12px', letterSpacing: '1px' }}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Content */}
                <div>
                    {/* STEP 0: Customer */}
                    {step === 0 && (
                        <PortfolioCard>
                            <PortfolioSectionTitle title="CLIENT IDENTITY" />
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px', marginBottom: '30px' }}>
                                <PortfolioInput
                                    label="SALUTATION"
                                    name="salutation"
                                    type="select"
                                    value={formData.salutation}
                                    onChange={handleChange}
                                    options={[{ value: 'Mr.', label: 'Mr.' }, { value: 'Mrs.', label: 'Mrs.' }, { value: 'Ms.', label: 'Ms.' }]}
                                />
                                <PortfolioInput
                                    label="FULL NAME / CORPORATE"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    placeholder="Enter client name..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px', marginBottom: '30px' }}>
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

                            <PortfolioInput
                                label="EMAIL ADDRESS"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="client@email.com"
                            />
                        </PortfolioCard>
                    )}

                    {/* STEP 1: Vehicle */}
                    {step === 1 && (
                        <PortfolioCard>
                            <PortfolioSectionTitle title="VEHICLE PROFILE" />

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                {['SEDAN', 'SUV', '4X4', 'COUPE', 'TRUCK'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, vehicle_type: type })}
                                        style={{
                                            padding: '10px 20px',
                                            border: formData.vehicle_type === type ? '1px solid var(--gold)' : '1px solid rgba(232, 230, 227, 0.1)',
                                            background: formData.vehicle_type === type ? 'var(--gold-glow)' : 'transparent',
                                            color: formData.vehicle_type === type ? 'var(--gold)' : 'var(--cream)',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <PortfolioInput
                                    label="BRAND"
                                    name="vehicle_brand"
                                    value={formData.vehicle_brand}
                                    onChange={handleChange}
                                />
                                <PortfolioInput
                                    label="MODEL"
                                    name="vehicle_model"
                                    value={formData.vehicle_model}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                                <PortfolioInput
                                    label="VIN / CHASSIS"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleChange}
                                />
                                <PortfolioInput
                                    label="YEAR"
                                    name="vehicle_year"
                                    type="number"
                                    value={formData.vehicle_year}
                                    onChange={handleChange}
                                />
                                <PortfolioInput
                                    label="COLOR"
                                    name="vehicle_color"
                                    value={formData.vehicle_color}
                                    onChange={handleChange}
                                />
                                <PortfolioInput
                                    label="PLATE NO."
                                    name="license_plate"
                                    value={formData.license_plate}
                                    onChange={handleChange}
                                />
                            </div>

                            <PortfolioSectionTitle title="VISUAL DOCUMENTATION" />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '12px',
                                        border: '1px dashed var(--gold)',
                                        background: 'rgba(176,141,87,0.05)',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--gold)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Camera size={24} />
                                    <span style={{ fontSize: '10px', marginTop: '5px' }}>ADD</span>
                                </button>
                                {photos.map((photo, idx) => (
                                    <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src={photo.preview} alt="Vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            onClick={() => removePhoto(idx)}
                                            style={{
                                                position: 'absolute', top: 5, right: 5,
                                                background: 'rgba(0,0,0,0.5)',
                                                border: 'none', color: '#fff',
                                                borderRadius: '50%', width: '20px', height: '20px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </PortfolioCard>
                    )}

                    {/* STEP 2: Service Config */}
                    {step === 2 && (
                        <PortfolioCard>
                            <PortfolioSectionTitle title="SERVICE SELECTION" />

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                {Object.keys(SERVICES_CATALOG).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: activeCategory === cat ? '1px solid var(--gold)' : '1px solid rgba(232, 230, 227, 0.1)',
                                            background: activeCategory === cat ? 'var(--gold-glow)' : 'rgba(232, 230, 227, 0.02)',
                                            color: activeCategory === cat ? 'var(--gold)' : 'var(--cream)',
                                            fontSize: '11px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {activeCategory && (
                                <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    {SERVICES_CATALOG[activeCategory].map((s, idx) => {
                                        const isSelected = selectedServices.find(sel => sel.name === s.name);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => isSelected ? removeService(selectedServices.findIndex(sel => sel.name === s.name)) : addService(s)}
                                                style={{
                                                    padding: '15px',
                                                    borderRadius: '10px',
                                                    background: isSelected ? 'var(--gold-glow)' : 'rgba(232, 230, 227, 0.02)',
                                                    border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(232, 230, 227, 0.05)',
                                                    cursor: 'pointer',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}
                                            >
                                                <span style={{ fontSize: '13px', color: 'var(--cream)' }}>{s.name}</span>
                                                <span style={{ fontSize: '13px', color: 'var(--gold)' }}>AED {s.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {selectedServices.length > 0 && (
                                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', width: '100%' }}>
                                    <h4 style={{ color: 'var(--gold)', fontSize: '12px', marginBottom: '15px' }}>SUMMARY</h4>
                                    {selectedServices.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'rgba(232, 230, 227, 0.7)' }}>
                                            <span>{s.name}</span>
                                            <span>AED {s.price}</span>
                                        </div>
                                    ))}
                                    <div style={{ height: '1px', background: 'rgba(232, 230, 227, 0.1)', margin: '15px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: 'var(--cream)' }}>
                                        <span>TOTAL</span>
                                        <span>AED {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </PortfolioCard>
                    )}

                    {/* STEP 3: Source & Priority */}
                    {step === 3 && (
                        <PortfolioCard>
                            <PortfolioSectionTitle title="LEAD DETAILS" />

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', marginBottom: '10px', letterSpacing: '1px' }}>LEAD SOURCE</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {SOURCES.map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => setFormData({ ...formData, source: s.value })}
                                            style={{
                                                padding: '10px 15px',
                                                borderRadius: '8px',
                                                border: formData.source === s.value ? `1px solid ${s.color}` : '1px solid rgba(232, 230, 227, 0.1)',
                                                background: formData.source === s.value ? `${s.color}20` : 'transparent',
                                                color: formData.source === s.value ? s.color : 'var(--cream)',
                                                fontSize: '11px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', marginBottom: '10px', letterSpacing: '1px' }}>PRIORITY</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {PRIORITIES.map(p => (
                                        <button
                                            key={p.value}
                                            onClick={() => setFormData({ ...formData, priority: p.value })}
                                            style={{
                                                flex: 1,
                                                padding: '15px',
                                                borderRadius: '8px',
                                                border: formData.priority === p.value ? `1px solid ${p.color}` : '1px solid rgba(232, 230, 227, 0.1)',
                                                background: formData.priority === p.value ? `${p.color}20` : 'transparent',
                                                color: formData.priority === p.value ? p.color : 'var(--cream)',
                                                fontSize: '11px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <PortfolioInput
                                label="INTERNAL NOTES"
                                name="notes"
                                type="textarea"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                            />
                        </PortfolioCard>
                    )}

                    {/* STEP 4: Review */}
                    {step === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <PortfolioCard>
                                <PortfolioSectionTitle title="OPPORTUNITY REVIEW" />
                                <div style={{ background: 'rgba(232, 230, 227, 0.02)', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '10px', color: 'var(--gold)' }}>CLIENT</div>
                                            <div style={{ color: 'var(--cream)', fontSize: '16px' }}>{formData.customer_name}</div>
                                            <div style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '12px' }}>{formData.phone_prefix}{formData.phone_suffix_code}{formData.phone}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: 'var(--gold)' }}>VEHICLE</div>
                                            <div style={{ color: 'var(--cream)', fontSize: '16px' }}>{formData.vehicle_brand} {formData.vehicle_model}</div>
                                            <div style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '12px' }}>{formData.license_plate}</div>
                                        </div>
                                    </div>

                                    {selectedServices.length > 0 && (
                                        <div style={{ borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '20px' }}>
                                            {selectedServices.map(s => (
                                                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--cream)' }}>
                                                    <span>{s.name}</span>
                                                    <span>AED {s.price}</span>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '18px', color: 'var(--gold)' }}>
                                                <span>ESTIMATED TOTAL</span>
                                                <span>AED {grandTotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </PortfolioCard>

                            <PortfolioButton
                                primary
                                onClick={handleSubmit}
                                style={{ height: '60px', fontSize: '14px' }}
                            >
                                <Save size={18} /> CONFIRM AND SYNC TO CRM
                            </PortfolioButton>
                        </div>
                    )}

                    {/* Navigation */}
                    {step < 4 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                            <PortfolioButton
                                onClick={() => setStep(s => Math.max(0, s - 1))}
                                disabled={step === 0}
                                style={{ width: '150px' }}
                            >
                                BACK
                            </PortfolioButton>
                            <PortfolioButton
                                primary
                                onClick={() => setStep(s => Math.min(4, s + 1))}
                                disabled={!canProceed()}
                                style={{ width: '150px' }}
                            >
                                NEXT STEP
                            </PortfolioButton>
                        </div>
                    )}
                </div>
            </div>
        </PortfolioPage>
    );
};

export default LeadForm;
