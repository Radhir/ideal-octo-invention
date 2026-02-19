import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Save, User, Car, Shield, Award, PenTool } from 'lucide-react';
import SignaturePad from '../../components/SignaturePad';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioInput,
    PortfolioSelect,
    PortfolioButton,
    PortfolioBackButton,
    PortfolioGrid
} from '../../components/PortfolioComponents';

const CeramicForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        salutation: 'Mr.',
        full_name: '',
        phone_prefix: '+971 5',
        phone_suffix_code: '0',
        contact_number: '',
        email: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: new Date().getFullYear(),
        vehicle_color: '',
        license_plate: '',
        vin: '',
        installation_date: new Date().toISOString().split('T')[0],
        branch_location: 'DXB',
        coating_brand: '',
        coating_type: 'CERAMIC',
        warranty_period: '',
        signature_data: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                full_name: `${formData.salutation} ${formData.full_name}`,
                contact_number: `${formData.phone_prefix}${formData.phone_suffix_code}${formData.contact_number}`
            };
            await api.post('/forms/ceramic/api/warranties/', submissionData);
            navigate('/ceramic');
        } catch (err) {
            console.error('Error saving warranty', err);
            alert('Failed to save warranty.');
        }
    };

    return (
        <PortfolioPage breadcrumb="Warranty / Register Ceramic">
            <PortfolioBackButton onClick={() => navigate('/ceramic')} />

            <div style={{ marginBottom: '80px' }}>
                <PortfolioTitle
                    subtitle="Enroll a new surface protection application into the Elite Shine global registry."
                >
                    Surface<br />Enrollment
                </PortfolioTitle>
            </div>

            <form onSubmit={handleSubmit}>
                <PortfolioGrid columns="1fr 1fr">
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                            <User size={18} color="var(--gold)" opacity={0.5} />
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Customer Dossier</span>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ width: '120px' }}>
                                <PortfolioSelect
                                    label="Salutation"
                                    name="salutation"
                                    value={formData.salutation}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'Mr.', label: 'Mr.' },
                                        { value: 'Mrs.', label: 'Mrs.' },
                                        { value: 'Ms.', label: 'Ms.' }
                                    ]}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <PortfolioInput
                                    label="Full Name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter client name"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ width: '160px' }}>
                                <PortfolioSelect
                                    label="Network Code"
                                    name="phone_suffix_code"
                                    value={formData.phone_suffix_code}
                                    onChange={handleChange}
                                    options={[...Array(9).keys()].map(n => ({ value: n.toString(), label: `+971 5${n}` }))}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <PortfolioInput
                                    label="Contact Number"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="1234567"
                                    maxLength="7"
                                />
                            </div>
                        </div>

                        <PortfolioInput
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="client@luxury.ae"
                        />
                    </PortfolioCard>

                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                            <Car size={18} color="var(--gold)" opacity={0.5} />
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Asset Registry</span>
                        </div>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Brand"
                                name="vehicle_brand"
                                value={formData.vehicle_brand}
                                onChange={handleChange}
                                required
                            />
                            <PortfolioInput
                                label="Model"
                                name="vehicle_model"
                                value={formData.vehicle_model}
                                onChange={handleChange}
                                required
                            />
                        </PortfolioGrid>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Year"
                                name="vehicle_year"
                                type="number"
                                value={formData.vehicle_year}
                                onChange={handleChange}
                                required
                            />
                            <PortfolioInput
                                label="Color"
                                name="vehicle_color"
                                value={formData.vehicle_color}
                                onChange={handleChange}
                                required
                            />
                        </PortfolioGrid>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="License Plate"
                                name="license_plate"
                                value={formData.license_plate}
                                onChange={handleChange}
                                required
                                placeholder="A 00000"
                            />
                            <PortfolioInput
                                label="VIN"
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                required
                                placeholder="Identification Number"
                            />
                        </PortfolioGrid>
                    </PortfolioCard>
                </PortfolioGrid>

                <PortfolioCard style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <Award size={18} color="var(--gold)" opacity={0.5} />
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Protection Specification</span>
                    </div>

                    <PortfolioGrid columns="repeat(3, 1fr)">
                        <PortfolioInput
                            label="Application Date"
                            name="installation_date"
                            type="date"
                            value={formData.installation_date}
                            onChange={handleChange}
                            required
                        />
                        <PortfolioSelect
                            label="Studio Branch"
                            name="branch_location"
                            value={formData.branch_location}
                            onChange={handleChange}
                            options={[
                                { value: 'DXB', label: 'Dubai' },
                                { value: 'AUH', label: 'Abu Dhabi' },
                                { value: 'SHJ', label: 'Sharjah' }
                            ]}
                        />
                        <PortfolioSelect
                            label="Coating Classification"
                            name="coating_type"
                            value={formData.coating_type}
                            onChange={handleChange}
                            options={[
                                { value: 'CERAMIC', label: 'Ceramic Coating' },
                                { value: 'GRAPHENE', label: 'Graphene Coating' },
                                { value: 'QUARTZ', label: 'Quartz Coating' }
                            ]}
                        />
                    </PortfolioGrid>

                    <PortfolioGrid columns="1fr 1fr" style={{ marginTop: '25px' }}>
                        <PortfolioInput
                            label="Product Solution"
                            name="coating_brand"
                            value={formData.coating_brand}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Gyeon, Ceramic Pro"
                        />
                        <PortfolioInput
                            label="Warranty Period"
                            name="warranty_period"
                            value={formData.warranty_period}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 5 Years"
                        />
                    </PortfolioGrid>
                </PortfolioCard>

                <PortfolioCard style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <PenTool size={18} color="var(--gold)" opacity={0.5} />
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Authentication protocol</span>
                    </div>

                    <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '14px', marginBottom: '30px', fontFamily: 'var(--font-serif)' }}>
                        The undersigned certifies that the application has been inspected and meets the Elite Shine standards of excellence.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(232, 230, 227, 0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                        <SignaturePad
                            title="Owner Signature"
                            onSave={(data) => setFormData({ ...formData, signature_data: data })}
                        />
                    </div>
                </PortfolioCard>

                <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'flex-end', gap: '30px' }}>
                    <PortfolioButton variant="glass" onClick={() => navigate('/ceramic')} type="button">
                        DISCARD.node
                    </PortfolioButton>
                    <PortfolioButton variant="gold" type="submit" style={{ padding: '15px 50px' }}>
                        <Save size={18} /> INITIATE.registry
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default CeramicForm;
