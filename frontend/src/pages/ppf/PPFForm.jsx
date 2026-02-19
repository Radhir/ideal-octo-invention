import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Save, User, Car, Shield, MapPin, PenTool } from 'lucide-react';
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

const PPFForm = () => {
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
        film_brand: '',
        film_type: 'GLOSS',
        coverage_area: '',
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
            await api.post('/forms/ppf/api/warranties/', submissionData);
            navigate('/ppf');
        } catch (err) {
            console.error('Error saving warranty', err);
            alert('Failed to save warranty. Check console for details.');
        }
    };

    return (
        <PortfolioPage breadcrumb="Warranty / Register PPF">
            <PortfolioBackButton onClick={() => navigate('/ppf')} />

            <div style={{ marginBottom: '80px' }}>
                <PortfolioTitle
                    subtitle="Register a new paint protection film installation to generate a digital warranty certificate."
                >
                    Armor<br />Deployment
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
                            placeholder="client@luxury.com"
                        />
                    </PortfolioCard>

                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                            <Car size={18} color="var(--gold)" opacity={0.5} />
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Asset Registry</span>
                        </div>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Vehicle Brand"
                                name="vehicle_brand"
                                value={formData.vehicle_brand}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Porsche"
                            />
                            <PortfolioInput
                                label="Vehicle Model"
                                name="vehicle_model"
                                value={formData.vehicle_model}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 911 GT3"
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
                                label="Exterior Color"
                                name="vehicle_color"
                                value={formData.vehicle_color}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Crayon"
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
                                label="VIN Identification"
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                required
                                placeholder="17-Digit VIN"
                            />
                        </PortfolioGrid>
                    </PortfolioCard>
                </PortfolioGrid>

                <PortfolioCard style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <Shield size={18} color="var(--gold)" opacity={0.5} />
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Armor Specification</span>
                    </div>

                    <PortfolioGrid columns="repeat(4, 1fr)">
                        <PortfolioInput
                            label="Installation Date"
                            name="installation_date"
                            type="date"
                            value={formData.installation_date}
                            onChange={handleChange}
                            required
                        />
                        <PortfolioSelect
                            label="Studio Location"
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
                            label="Film Finish"
                            name="film_type"
                            value={formData.film_type}
                            onChange={handleChange}
                            options={[
                                { value: 'GLOSS', label: 'Gloss' },
                                { value: 'MATTE', label: 'Matte' },
                                { value: 'SATIN', label: 'Satin' },
                                { value: 'VINYL', label: 'Vinyl Wrap' },
                                { value: 'COLOR', label: 'Color PPF' }
                            ]}
                        />
                        <PortfolioInput
                            label="Film Brand"
                            name="film_brand"
                            value={formData.film_brand}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Xpel"
                        />
                    </PortfolioGrid>

                    <div style={{ marginTop: '25px' }}>
                        <PortfolioInput
                            label="Coverage Area"
                            name="coverage_area"
                            value={formData.coverage_area}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Full Front, Full Body"
                        />
                    </div>
                </PortfolioCard>

                <PortfolioCard style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <PenTool size={18} color="var(--gold)" opacity={0.5} />
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--gold)' }}>Authentication protocol</span>
                    </div>

                    <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '14px', marginBottom: '30px', fontFamily: 'var(--font-serif)' }}>
                        I confirm that all asset metadata and installation parameters are accurate to the actual service performed.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(232, 230, 227, 0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                        <SignaturePad
                            title="Digital Authorization"
                            onSave={(data) => setFormData({ ...formData, signature_data: data })}
                        />
                    </div>
                </PortfolioCard>

                <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'flex-end', gap: '30px' }}>
                    <PortfolioButton variant="glass" onClick={() => navigate('/ppf')} type="button">
                        DISCARD.node
                    </PortfolioButton>
                    <PortfolioButton variant="gold" type="submit" style={{ padding: '15px 50px' }}>
                        <Save size={18} /> INITIATE.deployment
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default PPFForm;
