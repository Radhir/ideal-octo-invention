import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    Save, ArrowLeft, User, DollarSign, Zap, AlertCircle,
    Car, X, Shield, Layers, ChevronRight, Phone, Mail,
    Target, Hash, FileText, Camera, Image, Trash2
} from 'lucide-react';
import { SERVICES_CATALOG } from '../../constants/services';

const STEPS = [
    { key: 'customer', label: 'Customer', icon: User },
    { key: 'vehicle', label: 'Vehicle', icon: Car },
    { key: 'services', label: 'Services', icon: Layers },
    { key: 'pipeline', label: 'Pipeline', icon: Target },
    { key: 'review', label: 'Review', icon: FileText },
];

const SOURCES = [
    { value: 'INSTAGRAM', label: 'Instagram', color: '#E1306C' },
    { value: 'FACEBOOK', label: 'Facebook', color: '#1877F2' },
    { value: 'WHATSAPP', label: 'WhatsApp', color: '#25D366' },
    { value: 'WALKIN', label: 'Walk-in', color: '#b08d57' },
    { value: 'REFERRAL', label: 'Referral', color: '#8B5CF6' },
    { value: 'WEBSITE', label: 'Website', color: '#3B82F6' },
    { value: 'TIKTOK', label: 'TikTok', color: '#FF0050' },
    { value: 'GOOGLE', label: 'Google Ads', color: '#34A853' },
];

const PRIORITIES = [
    { value: 'LOW', label: 'Low', color: '#64748b', desc: 'Follow up within a week' },
    { value: 'MEDIUM', label: 'Standard', color: '#3b82f6', desc: 'Follow up within 48h' },
    { value: 'HIGH', label: 'High Priority', color: '#f59e0b', desc: 'Follow up within 24h' },
    { value: 'HOT', label: 'Hot / Immediate', color: '#f43f5e', desc: 'Contact immediately' },
];

const STATUSES = [
    { value: 'NEW', label: 'New Lead' },
    { value: 'CONTACTED', label: 'First Contact' },
    { value: 'NEGOTIATION', label: 'In Negotiation' },
    { value: 'QUOTED', label: 'Quote Sent' },
];

const LeadForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        email: '',
        source: '',
        interested_service: '',
        priority: 'MEDIUM',
        estimated_value: '',
        assigned_to: '',
        follow_up_date: '',
        notes: '',
        status: 'NEW',
        // Vehicle fields (stored locally, sent as notes enrichment)
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: new Date().getFullYear(),
        vehicle_color: '',
        vehicle_type: 'SEDAN',
        license_plate: '',
    });
    const [photos, setPhotos] = useState([]); // { file, preview, label }
    const fileInputRef = useRef(null);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            label: photos.length === 0 ? 'Front' : photos.length === 1 ? 'Rear' : photos.length === 2 ? 'Left Side' : photos.length === 3 ? 'Right Side' : 'Damage'
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

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('/hr/api/employees/');
                setEmployees(res.data);
            } catch (err) {
                console.error('Error fetching employees', err);
            }
        };
        fetchEmployees();
    }, []);

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

    const subtotal = selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
    const vat = subtotal * 0.05;
    const grandTotal = subtotal + vat;

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            const payload = {
                customer_name: formData.customer_name,
                phone: formData.phone,
                email: formData.email,
                source: formData.source,
                interested_service: servicesSummary || formData.interested_service,
                priority: formData.priority,
                estimated_value: subtotal > 0 ? subtotal.toFixed(2) : formData.estimated_value,
                assigned_to: formData.assigned_to,
                follow_up_date: formData.follow_up_date,
                notes: enrichedNotes,
                status: formData.status,
            };

            await axios.post('/forms/leads/api/list/', payload);
            alert('Lead Captured Successfully');
            navigate('/leads');
        } catch (err) {
            console.error('Error capturing lead', err);
            alert('Failed to capture lead.');
        }
    };

    const canProceed = () => {
        switch (step) {
            case 0: return formData.customer_name && formData.phone;
            case 1: return true; // vehicle is optional
            case 2: return true; // services optional
            case 3: return formData.source;
            default: return true;
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <button
                    onClick={() => navigate('/leads')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE CRM</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '900', margin: 0, color: '#fff' }}>New Opportunity</h1>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#64748b', fontWeight: '800' }}>
                    STEP {step + 1} / {STEPS.length}
                </div>
            </header>

            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '35px', maxWidth: '900px' }}>
                {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = i === step;
                    const isDone = i < step;
                    return (
                        <button
                            key={s.key}
                            onClick={() => setStep(i)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 10px',
                                borderRadius: '12px',
                                border: isActive ? '1px solid #b08d57' : '1px solid rgba(255,255,255,0.06)',
                                background: isActive ? 'rgba(176,141,87,0.12)' : isDone ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                                color: isActive ? '#b08d57' : isDone ? '#10b981' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Icon size={14} />
                            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>{s.label}</span>
                        </button>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                {/* STEP 0: Customer Identity */}
                {step === 0 && (
                    <GlassCard style={{ padding: '40px' }}>
                        <h3 style={sectionTitle}><User size={18} color="#b08d57" /> Customer Identity</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                            <div>
                                <label style={labelStyle}>Full Name / Corporate</label>
                                <input name="customer_name" className="form-control" value={formData.customer_name} onChange={handleChange} required
                                    placeholder="John Doe / ACME Corp"
                                    style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Primary Contact</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required
                                        placeholder="+971 50 XXX XXXX"
                                        style={{ ...inputStyle, paddingLeft: '38px' }} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange}
                                    placeholder="customer@email.com"
                                    style={{ ...inputStyle, paddingLeft: '38px' }} />
                            </div>
                        </div>
                    </GlassCard>
                )}

                {/* STEP 1: Vehicle Information */}
                {step === 1 && (
                    <GlassCard style={{ padding: '40px' }}>
                        <h3 style={sectionTitle}><Car size={18} color="#b08d57" /> Vehicle Intelligence</h3>
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '25px' }}>
                            Pre-fill vehicle details for faster booking conversion. All fields optional at this stage.
                        </p>

                        {/* Vehicle Type Selector */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={labelStyle}>Vehicle Class</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['SEDAN', 'SUV', '4X4', 'COUPE', 'TRUCK'].map(type => (
                                    <button key={type} type="button"
                                        onClick={() => setFormData({ ...formData, vehicle_type: type })}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            border: formData.vehicle_type === type ? '1px solid #b08d57' : '1px solid rgba(255,255,255,0.08)',
                                            background: formData.vehicle_type === type ? 'rgba(176,141,87,0.15)' : 'rgba(255,255,255,0.03)',
                                            color: formData.vehicle_type === type ? '#b08d57' : '#94a3b8',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            letterSpacing: '1px',
                                            transition: 'all 0.2s'
                                        }}
                                    >{type}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Brand</label>
                                <input name="vehicle_brand" className="form-control" value={formData.vehicle_brand} onChange={handleChange}
                                    placeholder="Porsche" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Model</label>
                                <input name="vehicle_model" className="form-control" value={formData.vehicle_model} onChange={handleChange}
                                    placeholder="Cayenne Turbo GT" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Year</label>
                                <input name="vehicle_year" type="number" className="form-control" value={formData.vehicle_year} onChange={handleChange}
                                    style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Exterior Color</label>
                                <input name="vehicle_color" className="form-control" value={formData.vehicle_color} onChange={handleChange}
                                    placeholder="Shark Blue" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>License Plate</label>
                                <div style={{ position: 'relative' }}>
                                    <Hash size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input name="license_plate" className="form-control" value={formData.license_plate} onChange={handleChange}
                                        placeholder="DUBAI A 12345" style={{ ...inputStyle, paddingLeft: '38px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Photo Documentation */}
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={sectionTitle}><Camera size={18} color="#b08d57" /> Vehicle Photos</h3>
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                                Capture front, rear, sides, and any existing damage for pre-inspection documentation.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                capture="environment"
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />

                            {/* Photo Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '15px' }}>
                                {photos.map((photo, idx) => (
                                    <div key={idx} style={{
                                        position: 'relative',
                                        aspectRatio: '4/3',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.08)'
                                    }}>
                                        <img src={photo.preview} alt={photo.label}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            padding: '6px 10px',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <select value={photo.label}
                                                onChange={(e) => {
                                                    const updated = [...photos];
                                                    updated[idx] = { ...updated[idx], label: e.target.value };
                                                    setPhotos(updated);
                                                }}
                                                style={{
                                                    background: 'none', border: 'none', color: '#fff',
                                                    fontSize: '10px', fontWeight: '700', outline: 'none', cursor: 'pointer'
                                                }}
                                            >
                                                {['Front', 'Rear', 'Left Side', 'Right Side', 'Roof', 'Damage', 'Dent', 'Chip', 'Scratch', 'Interior', 'VIN Plate', 'Other'].map(opt => (
                                                    <option key={opt} value={opt} style={{ background: '#1e293b' }}>{opt}</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={() => removePhoto(idx)}
                                                style={{ background: 'rgba(239,68,68,0.7)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', display: 'flex' }}>
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Photo Button */}
                                <button type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        aspectRatio: '4/3',
                                        borderRadius: '12px',
                                        border: '2px dashed rgba(176,141,87,0.3)',
                                        background: 'rgba(176,141,87,0.04)',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: '8px', cursor: 'pointer',
                                        color: '#b08d57', transition: 'all 0.2s'
                                    }}
                                >
                                    <Camera size={24} />
                                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' }}>
                                        {photos.length === 0 ? 'ADD PHOTOS' : 'ADD MORE'}
                                    </span>
                                </button>
                            </div>

                            {photos.length > 0 && (
                                <div style={{ fontSize: '11px', color: '#64748b' }}>
                                    <Image size={12} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                    {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
                                    {' '}| {photos.filter(p => ['Damage', 'Dent', 'Chip', 'Scratch'].includes(p.label)).length} damage tagged
                                </div>
                            )}
                        </div>
                    </GlassCard>
                )}

                {/* STEP 2: Service Selection */}
                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <GlassCard style={{ padding: '40px' }}>
                            <h3 style={sectionTitle}><Layers size={18} color="#b08d57" /> Service Configurator</h3>
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '25px' }}>
                                Select services the customer is interested in. Pricing auto-calculates for the quotation.
                            </p>

                            {/* Category Tabs */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                                {Object.keys(SERVICES_CATALOG).map(cat => (
                                    <button key={cat} type="button"
                                        onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: activeCategory === cat ? '1px solid #b08d57' : '1px solid rgba(255,255,255,0.06)',
                                            background: activeCategory === cat ? 'rgba(176,141,87,0.12)' : 'rgba(255,255,255,0.02)',
                                            color: activeCategory === cat ? '#b08d57' : '#94a3b8',
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            letterSpacing: '0.5px',
                                            transition: 'all 0.2s'
                                        }}
                                    >{cat}</button>
                                ))}
                            </div>

                            {/* Service Items */}
                            {activeCategory && (
                                <div style={{
                                    maxHeight: '300px', overflowY: 'auto',
                                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    {SERVICES_CATALOG[activeCategory].map((s, idx) => {
                                        const isSelected = selectedServices.find(sel => sel.name === s.name);
                                        return (
                                            <button key={idx} type="button"
                                                onClick={() => isSelected ? removeService(selectedServices.findIndex(sel => sel.name === s.name)) : addService(s)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '12px 18px',
                                                    background: isSelected ? 'rgba(176,141,87,0.08)' : 'transparent',
                                                    border: 'none',
                                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.15s',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '6px',
                                                        border: isSelected ? '2px solid #b08d57' : '2px solid rgba(255,255,255,0.1)',
                                                        background: isSelected ? '#b08d57' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {isSelected && <span style={{ color: '#000', fontSize: '11px', fontWeight: '900' }}>✓</span>}
                                                    </div>
                                                    <span style={{ fontSize: '13px', color: isSelected ? '#fff' : '#cbd5e1', fontWeight: isSelected ? '600' : '400' }}>
                                                        {s.name}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#b08d57', flexShrink: 0, marginLeft: '15px' }}>
                                                    AED {s.price.toLocaleString()}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Or Manual Input */}
                            {!activeCategory && selectedServices.length === 0 && (
                                <div>
                                    <label style={labelStyle}>Or Describe Interest Manually</label>
                                    <input name="interested_service" className="form-control" value={formData.interested_service} onChange={handleChange}
                                        placeholder="e.g. Full PPF Matte, Ceramic Coating Gold..."
                                        style={inputStyle} />
                                </div>
                            )}
                        </GlassCard>

                        {/* Selected Services & Pricing */}
                        {selectedServices.length > 0 && (
                            <GlassCard style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0, fontSize: '12px', color: '#b08d57', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        Selected Services ({selectedServices.length})
                                    </h4>
                                    <button type="button" onClick={() => setSelectedServices([])}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                                        Clear All
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                    {selectedServices.map((s, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 14px', borderRadius: '10px',
                                            background: 'rgba(176,141,87,0.05)', border: '1px solid rgba(176,141,87,0.1)'
                                        }}>
                                            <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '500' }}>{s.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#b08d57' }}>AED {s.price.toLocaleString()}</span>
                                                <button type="button" onClick={() => removeService(idx)}
                                                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '4px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Breakdown */}
                                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Subtotal (Net)</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', color: '#b08d57' }}>VAT (5%)</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#b08d57' }}>AED {vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>Grand Total (Gross)</span>
                                        <span style={{ fontSize: '22px', fontWeight: '900', color: '#b08d57' }}>AED {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </GlassCard>
                        )}
                    </div>
                )}

                {/* STEP 3: Pipeline Configuration */}
                {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <GlassCard style={{ padding: '40px' }}>
                            <h3 style={sectionTitle}><Zap size={18} color="#b08d57" /> Lead Source</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
                                {SOURCES.map(s => (
                                    <button key={s.value} type="button"
                                        onClick={() => setFormData({ ...formData, source: s.value })}
                                        style={{
                                            padding: '16px 12px',
                                            borderRadius: '12px',
                                            border: formData.source === s.value ? `1px solid ${s.color}` : '1px solid rgba(255,255,255,0.06)',
                                            background: formData.source === s.value ? `${s.color}15` : 'rgba(255,255,255,0.02)',
                                            color: formData.source === s.value ? s.color : '#94a3b8',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >{s.label}</button>
                                ))}
                            </div>

                            <h3 style={sectionTitle}><AlertCircle size={18} color="#b08d57" /> Priority Level</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
                                {PRIORITIES.map(p => (
                                    <button key={p.value} type="button"
                                        onClick={() => setFormData({ ...formData, priority: p.value })}
                                        style={{
                                            padding: '16px 12px',
                                            borderRadius: '12px',
                                            border: formData.priority === p.value ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.06)',
                                            background: formData.priority === p.value ? `${p.color}15` : 'rgba(255,255,255,0.02)',
                                            color: formData.priority === p.value ? p.color : '#94a3b8',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div>{p.label}</div>
                                        <div style={{ fontSize: '9px', fontWeight: '500', marginTop: '4px', opacity: 0.7 }}>{p.desc}</div>
                                    </button>
                                ))}
                            </div>

                            <h3 style={sectionTitle}><Shield size={18} color="#b08d57" /> Status & Assignment</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={labelStyle}>Pipeline Stage</label>
                                    <select name="status" className="form-control" value={formData.status} onChange={handleChange}
                                        style={inputStyle}>
                                        {STATUSES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Assign Sales Executive</label>
                                    <select name="assigned_to" className="form-control" value={formData.assigned_to} onChange={handleChange}
                                        style={inputStyle}>
                                        <option value="">Select Rep...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Follow-up Date</label>
                                    <input name="follow_up_date" type="date" className="form-control" value={formData.follow_up_date} onChange={handleChange}
                                        style={inputStyle} />
                                </div>
                            </div>

                            {!selectedServices.length && (
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={labelStyle}>Opportunity Value (AED)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} />
                                        <input name="estimated_value" type="number" step="0.01" className="form-control"
                                            value={formData.estimated_value} onChange={handleChange}
                                            placeholder="Manual estimate if no services selected"
                                            style={{ ...inputStyle, paddingLeft: '38px' }} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={labelStyle}>Internal Notes / Requirements</label>
                                <textarea name="notes" className="form-control" rows="3" value={formData.notes} onChange={handleChange}
                                    placeholder="Detail any specific customer requests, obstacles, or follow-up notes..."
                                    style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* STEP 4: Review & Submit */}
                {step === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <GlassCard style={{ padding: '40px' }}>
                            <h3 style={sectionTitle}><FileText size={18} color="#b08d57" /> Opportunity Summary</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                {/* Customer */}
                                <div style={reviewSection}>
                                    <div style={reviewLabel}>Customer</div>
                                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>{formData.customer_name || '—'}</div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{formData.phone} {formData.email && `| ${formData.email}`}</div>
                                </div>

                                {/* Vehicle */}
                                <div style={reviewSection}>
                                    <div style={reviewLabel}>Vehicle</div>
                                    {formData.vehicle_brand ? (
                                        <>
                                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                                                {formData.vehicle_brand} {formData.vehicle_model} {formData.vehicle_year}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                                {formData.vehicle_color} | {formData.vehicle_type} {formData.license_plate && `| ${formData.license_plate}`}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: '13px', color: '#64748b' }}>Not specified</div>
                                    )}
                                    {photos.length > 0 && (
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {photos.slice(0, 4).map((p, i) => (
                                                <img key={i} src={p.preview} alt={p.label}
                                                    style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                            ))}
                                            {photos.length > 4 && (
                                                <div style={{
                                                    width: '48px', height: '36px', borderRadius: '6px',
                                                    background: 'rgba(176,141,87,0.15)', border: '1px solid rgba(176,141,87,0.2)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px', fontWeight: '800', color: '#b08d57'
                                                }}>+{photos.length - 4}</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Pipeline */}
                                <div style={reviewSection}>
                                    <div style={reviewLabel}>Pipeline</div>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {formData.source && <ReviewBadge label={formData.source} color={SOURCES.find(s => s.value === formData.source)?.color || '#64748b'} />}
                                        <ReviewBadge label={PRIORITIES.find(p => p.value === formData.priority)?.label || formData.priority} color={PRIORITIES.find(p => p.value === formData.priority)?.color || '#64748b'} />
                                        <ReviewBadge label={STATUSES.find(s => s.value === formData.status)?.label || formData.status} color="#3b82f6" />
                                    </div>
                                </div>

                                {/* Value */}
                                <div style={reviewSection}>
                                    <div style={reviewLabel}>Estimated Value</div>
                                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#b08d57' }}>
                                        AED {selectedServices.length > 0 ? grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) : parseFloat(formData.estimated_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    {selectedServices.length > 0 && (
                                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Incl. 5% VAT | {selectedServices.length} service(s)</div>
                                    )}
                                </div>
                            </div>

                            {/* Selected Services */}
                            {selectedServices.length > 0 && (
                                <div style={{ marginBottom: '25px' }}>
                                    <div style={reviewLabel}>Services</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {selectedServices.map((s, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{s.name}</span>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#b08d57' }}>AED {s.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.notes && (
                                <div>
                                    <div style={reviewLabel}>Notes</div>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>{formData.notes}</p>
                                </div>
                            )}
                        </GlassCard>

                        <button type="submit" className="btn-primary" style={{
                            width: '100%', padding: '20px', fontSize: '16px', fontWeight: '900',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                            borderRadius: '14px', letterSpacing: '1px'
                        }}>
                            <Save size={20} /> SYNC WITH CRM DATABASE
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
                        <button type="button"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            style={{
                                padding: '14px 30px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.03)',
                                color: step === 0 ? '#334155' : '#fff',
                                fontWeight: '700', fontSize: '14px',
                                cursor: step === 0 ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <button type="button"
                            onClick={() => setStep(Math.min(4, step + 1))}
                            disabled={!canProceed()}
                            style={{
                                padding: '14px 30px', borderRadius: '12px',
                                border: 'none',
                                background: canProceed() ? '#b08d57' : 'rgba(255,255,255,0.05)',
                                color: canProceed() ? '#000' : '#334155',
                                fontWeight: '900', fontSize: '14px',
                                cursor: canProceed() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

const ReviewBadge = ({ label, color }) => (
    <span style={{
        padding: '5px 12px', borderRadius: '8px',
        background: `${color}15`, border: `1px solid ${color}30`,
        color, fontSize: '10px', fontWeight: '800',
        textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>{label}</span>
);

const sectionTitle = {
    margin: '0 0 25px 0',
    fontSize: '18px',
    fontWeight: '900',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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

const inputStyle = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    width: '100%',
    padding: '15px',
    borderRadius: '12px'
};

const reviewSection = {
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const reviewLabel = {
    fontSize: '10px',
    color: '#b08d57',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '10px'
};

export default LeadForm;
