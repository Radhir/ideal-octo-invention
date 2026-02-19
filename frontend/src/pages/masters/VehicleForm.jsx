import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Car, Save, X, Hash, Calendar,
    User, Palette, Ruler, Info, ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioInput,
    PortfolioSelect
} from '../../components/PortfolioComponents';

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vin: '',
        registration_number: '',
        plate_emirate: 'Dubai',
        plate_code: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        engine_number: '',
        chassis_number: '',
        customer_name: '',
        customer_phone: ''
    });

    useEffect(() => {
        if (id) {
            // Fetch vehicle for edit if needed
            // For now, vehicle master is derived from JobCards
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real ERP, this would save to a Vehicle model.
            // For this implementation, we ensure data is ready for JobCards.
            await api.post('/forms/masters/api/vehicles/', formData);
            alert('Vehicle registered in system registry.');
            navigate('/masters/vehicles');
            navigate('/masters/vehicles');
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert('Failed to register vehicle. Please check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb={`SYSTEM REGISTRY / ${id ? 'EDIT' : 'ADD'} NODE`}>
            <PortfolioTitle subtitle="Register high-fidelity vehicle nodes into the Elite Shine operational database.">
                {id ? 'Edit Vehicle Node' : 'Register New Vehicle'}
            </PortfolioTitle>

            <form onSubmit={handleSubmit}>
                <PortfolioGrid>
                    <PortfolioCard>
                        <h3 style={{ color: 'var(--gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Info size={18} /> Primary Identification
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <PortfolioInput
                                label="VIN Number"
                                icon={<Hash size={16} />}
                                value={formData.vin}
                                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                placeholder="Enter Chassis/VIN"
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <PortfolioInput
                                    label="Registration Number"
                                    value={formData.registration_number}
                                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                    placeholder="Plate Number"
                                    required
                                />
                                <PortfolioSelect
                                    label="Emirate"
                                    value={formData.plate_emirate}
                                    onChange={(e) => setFormData({ ...formData, plate_emirate: e.target.value })}
                                >
                                    <option value="Dubai">Dubai</option>
                                    <option value="Abu Dhabi">Abu Dhabi</option>
                                    <option value="Sharjah">Sharjah</option>
                                    <option value="Ajman">Ajman</option>
                                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                    <option value="Fujairah">Fujairah</option>
                                </PortfolioSelect>
                            </div>
                        </div>
                    </PortfolioCard>

                    <PortfolioCard>
                        <h3 style={{ color: 'var(--gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Car size={18} /> Vehicle Specifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <PortfolioInput
                                    label="Brand / Make"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="e.g. Porsche"
                                    required
                                />
                                <PortfolioInput
                                    label="Model"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    placeholder="e.g. 911 GT3"
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <PortfolioSelect
                                    label="Year"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                >
                                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </PortfolioSelect>
                                <PortfolioInput
                                    label="Color"
                                    icon={<Palette size={16} />}
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="Paint Code/Name"
                                />
                            </div>
                        </div>
                    </PortfolioCard>

                    <PortfolioCard>
                        <h3 style={{ color: 'var(--gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={18} /> Owner Registration
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <PortfolioInput
                                label="Customer Name"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                placeholder="Full Legal Name"
                                required
                            />
                            <PortfolioInput
                                label="Primary Mobile"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                placeholder="+971 -- --- ----"
                            />
                        </div>
                    </PortfolioCard>
                </PortfolioGrid>

                <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                    <PortfolioButton
                        type="submit"
                        variant="gold"
                        loading={loading}
                        style={{ padding: '15px 40px' }}
                    >
                        <ShieldCheck size={18} style={{ marginRight: '10px' }} />
                        Register Terminal Node
                    </PortfolioButton>
                    <PortfolioButton
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/masters/vehicles')}
                    >
                        <X size={18} style={{ marginRight: '10px' }} />
                        Cancel
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default VehicleForm;
