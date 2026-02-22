import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Save, Shield, User, Car, Calendar,
    FileText, CheckCircle, Info, PenTool,
    ChevronRight, ArrowLeft
} from 'lucide-react';
import SignaturePad from 'react-signature-canvas';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const WarrantyForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sigPad = useRef({});

    const [formData, setFormData] = useState({
        category: 'PPF',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        vehicle_brand: '',
        vehicle_model: '',
        plate_number: '',
        vin: '',
        installation_date: new Date().toISOString().split('T')[0],
        duration_years: 5,
        specifications: {
            film_brand: 'STEK',
            film_type: 'GLOSS',
            coverage_area: 'FULL BODY',
            ceramic_layers: 2,
            tint_percentage: '30%',
            paint_code: '',
            wrap_color: ''
        }
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Handle pre-fill from Invoice Book
        if (location.state?.jobData) {
            const job = location.state.jobData;
            setFormData(prev => ({
                ...prev,
                customer_name: job.customer_name || '',
                customer_phone: job.customer_phone || '',
                customer_email: job.customer_email || '',
                vehicle_brand: job.vehicle_brand || '',
                vehicle_model: job.vehicle_model || '',
                plate_number: job.plate_number || '',
                vin: job.vin || ''
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('spec_')) {
            const specName = name.replace('spec_', '');
            setFormData({
                ...formData,
                specifications: { ...formData.specifications, [specName]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const clearSignature = () => sigPad.current.clear();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            const finalData = {
                ...formData,
                signature_data: sigPad.current.isEmpty() ? null : sigPad.current.getTrimmedCanvas().toDataURL('image/png')
            };

            await api.post('/api/warranty-book/api/registrations/', finalData);
            alert('Warranty Registered Successfully');
            navigate('/warranty-book');
        } catch (err) {
            console.error('Error registering warranty', err);
            alert('Failed to sync with security module.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb="Quality Assurance / New Registration">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioBackButton onClick={() => navigate('/warranty-book')} />
                <PortfolioTitle subtitle="Initiate a permanent security clearance and digital warranty bond.">
                    WARRANTY REGISTRATION
                </PortfolioTitle>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <PortfolioCard style={{ padding: '60px' }}>
                        {/* 1. CLASSIFICATION */}
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>1. CLASSIFICATION</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioSelect
                                    label="SERVICE CATEGORY"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'PPF', label: 'PAINT PROTECTION FILM (PPF)' },
                                        { value: 'CERAMIC', label: 'CERAMIC COATING' },
                                        { value: 'TINT', label: 'WINDOW TINTING' },
                                        { value: 'PAINT', label: 'PAINT / BODYWORK' },
                                        { value: 'WRAP', label: 'VINYL WRAP' }
                                    ]}
                                    required
                                />
                                <PortfolioSelect
                                    label="WARRANTY DURATION"
                                    name="duration_years"
                                    value={formData.duration_years}
                                    onChange={handleChange}
                                    options={[
                                        { value: 1, label: '1 YEAR' },
                                        { value: 2, label: '2 YEARS' },
                                        { value: 3, label: '3 YEARS' },
                                        { value: 5, label: '5 YEARS' },
                                        { value: 10, label: '10 YEARS' },
                                        { value: 99, label: 'LIFETIME' }
                                    ]}
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. CUSTOMER DOMAIN */}
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>2. CUSTOMER DOMAIN</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                                <PortfolioInput
                                    label="FULL NAME"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />
                                <PortfolioInput
                                    label="PHONE NUMBER"
                                    name="customer_phone"
                                    value={formData.customer_phone}
                                    onChange={handleChange}
                                    required
                                />
                                <PortfolioInput
                                    label="EMAIL ADDRESS"
                                    name="customer_email"
                                    type="email"
                                    value={formData.customer_email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 3. ASSET IDENTIFICATION */}
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>3. ASSET IDENTIFICATION</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                                <PortfolioInput label="BRAND" name="vehicle_brand" value={formData.vehicle_brand} onChange={handleChange} required />
                                <PortfolioInput label="MODEL" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} required />
                                <PortfolioInput label="PLATE NUMBER" name="plate_number" value={formData.plate_number} onChange={handleChange} required />
                                <PortfolioInput label="VIN / CHASSIS" name="vin" value={formData.vin} onChange={handleChange} />
                            </div>
                        </div>

                        {/* 4. TECHNICAL SPECIFICATIONS (DYNAMIC) */}
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>4. TECHNICAL SPECIFICATIONS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioInput
                                    label="INSTALLATION DATE"
                                    name="installation_date"
                                    type="date"
                                    value={formData.installation_date}
                                    onChange={handleChange}
                                    required
                                />

                                {formData.category === 'PPF' && (
                                    <>
                                        <PortfolioInput label="FILM BRAND" name="spec_film_brand" value={formData.specifications.film_brand} onChange={handleChange} />
                                        <PortfolioInput label="COVERAGE AREA" name="spec_coverage_area" value={formData.specifications.coverage_area} onChange={handleChange} />
                                    </>
                                )}

                                {formData.category === 'CERAMIC' && (
                                    <PortfolioInput label="LAYERS APPLIED" name="spec_ceramic_layers" type="number" value={formData.specifications.ceramic_layers} onChange={handleChange} />
                                )}

                                {formData.category === 'TINT' && (
                                    <PortfolioInput label="TINT PERCENTAGE" name="spec_tint_percentage" value={formData.specifications.tint_percentage} onChange={handleChange} />
                                )}

                                {formData.category === 'PAINT' && (
                                    <PortfolioInput label="PAINT CODE" name="spec_paint_code" value={formData.specifications.paint_code} onChange={handleChange} />
                                )}

                                {formData.category === 'WRAP' && (
                                    <PortfolioInput label="WRAP COLOR / BRAND" name="spec_wrap_color" value={formData.specifications.wrap_color} onChange={handleChange} />
                                )}
                            </div>
                        </div>

                        {/* 5. LEGAL AUTHORIZATION */}
                        <div style={{ marginBottom: '60px' }}>
                            <div style={sectionHeader}>5. LEGAL AUTHORIZATION</div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}>DIGITAL SIGNATURE</span>
                                    <button type="button" onClick={clearSignature} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '10px', cursor: 'pointer' }}>CLEAR</button>
                                </div>
                                <div style={{ background: 'white', borderRadius: '8px', height: '150px' }}>
                                    <SignaturePad
                                        ref={sigPad}
                                        canvasProps={{ width: 880, height: 150, className: 'sigCanvas' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <PortfolioButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            style={{ width: '100%', height: '70px', fontSize: '14px' }}
                        >
                            {loading ? 'SECURING LEDGER...' : <><Shield size={20} /> INITIALIZE WARRANTY GUARANTEE</>}
                        </PortfolioButton>
                    </PortfolioCard>
                </form>
            </div>
        </PortfolioPage>
    );
};

const sectionHeader = {
    fontSize: '11px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '30px',
    opacity: 0.8,
    borderBottom: '1px solid rgba(176, 141, 87, 0.2)',
    paddingBottom: '10px'
};

export default WarrantyForm;
