import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioBackButton,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea
} from '../../components/PortfolioComponents';

const StockForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        department: '',
        request_by: '',
        car_type: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_type: 'CASH',
        plate_number: '',
        item_description: ''
    });

    useEffect(() => {
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                plate_number: location.state.plate_number || '',
                car_type: location.state.car_type || '',
                request_by: location.state.request_by || ''
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            // Corrected endpoint to match StockForm model in backend
            await api.post('/forms/stock/api/requests/', formData);
            alert('Logistics Request Registered Successfully');
            navigate('/stock');
        } catch (err) {
            console.error('Error creating stock request', err);
            alert('Failed to sync with industrial database.');
        }
    };

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Registration">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioBackButton onClick={() => navigate('/stock')} />
                <PortfolioTitle subtitle="Initialize a formal ledger entry for material acquisition and vehicle-specific logistics.">
                    Asset Procurement
                </PortfolioTitle>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <PortfolioCard style={{ padding: '60px' }}>
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>1. OPERATIONAL CONTEXT</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioInput
                                    label="DEPARTMENT"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Ceramic Lab"
                                />
                                <PortfolioInput
                                    label="REQUESTED BY"
                                    name="request_by"
                                    value={formData.request_by}
                                    onChange={handleChange}
                                    required
                                    placeholder="Officer Name"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>2. ASSET IDENTIFICATION</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioInput
                                    label="CAR MODEL"
                                    name="car_type"
                                    value={formData.car_type}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Porsche 911 GT3"
                                />
                                <PortfolioInput
                                    label="PLATE NUMBER"
                                    name="plate_number"
                                    value={formData.plate_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="Dubai A-00000"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>3. FISCAL PARAMETERS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                                <PortfolioInput
                                    label="AMOUNT (AED)"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                                <PortfolioInput
                                    label="ENTRY DATE"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                                <PortfolioSelect
                                    label="PAYMENT METHOD"
                                    name="payment_type"
                                    value={formData.payment_type}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'CASH', label: 'CASH ON HAND' },
                                        { value: 'CARD', label: 'CORPORATE CARD' },
                                        { value: 'TRANSFER', label: 'WIRE TRANSFER' }
                                    ]}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '60px' }}>
                            <div style={sectionHeader}>4. TECHNICAL DESCRIPTION</div>
                            <PortfolioTextarea
                                label="ITEMIZED SPECIFICATIONS"
                                name="item_description"
                                value={formData.item_description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Detail the materials or parts required for this operation..."
                            />
                        </div>

                        <PortfolioButton
                            type="submit"
                            variant="primary"
                            style={{ width: '100%', height: '70px', fontSize: '14px' }}
                        >
                            <Save size={20} /> SYNC WITH INDUSTRIAL DATABASE
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

export default StockForm;
