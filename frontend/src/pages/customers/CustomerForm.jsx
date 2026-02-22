import React, { useState, useEffect } from 'react';
import {
    Users, Phone, Mail, MapPin,
    CreditCard, Fingerprint, Map,
    ChevronRight, ArrowLeft, Save,
    CheckCircle, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput,
    PortfolioSelect
} from '../../components/PortfolioComponents';

const CustomerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        trn_number: '',
        credit_limit: '0.00',
        customer_type: 'INDIVIDUAL', // INDIVIDUAL, CORPORATE
        is_active: true
    });

    useEffect(() => {
        if (isEdit) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const res = await api.get(`/customers/api/${id}/`);
            setFormData(res.data);
        } catch (err) {
            console.error("Failed to fetch customer", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await api.put(`/customers/api/${id}/`, formData);
            } else {
                await api.post('/customers/api/', formData);
            }
            navigate('/customers');
        } catch (err) {
            alert("Error saving: " + JSON.stringify(err.response?.data || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <PortfolioPage breadcrumb={`CRM / REGISTRY / ${isEdit ? 'REFINE' : 'INITIALIZE'} CLIENT`}>
            <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <PortfolioTitle subtitle="Maintaining high-fidelity records for elite client relations and financial compliance.">
                    {isEdit ? 'Client Dossier' : 'New Client Registration'}
                </PortfolioTitle>
                <div className="no-print">
                    <PortfolioButton variant="secondary" onClick={() => navigate('/customers')}>
                        <ArrowLeft size={16} /> BACK TO REGISTRY
                    </PortfolioButton>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginBottom: '40px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <PortfolioInput
                            label="FULL NAME / TRADING TITLE"
                            icon={Users}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <PortfolioInput
                        label="PRIMARY CONTACT"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />

                    <PortfolioInput
                        label="ELECTRONIC MAIL"
                        icon={Mail}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <PortfolioSelect
                        label="CLIENT CLASSIFICATION"
                        icon={Fingerprint}
                        value={formData.customer_type}
                        onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                    >
                        <option value="INDIVIDUAL">Private Client (Individual)</option>
                        <option value="CORPORATE">Enterprise / Corporate Partner</option>
                    </PortfolioSelect>

                    <PortfolioInput
                        label="VAT / TRN NUMBER"
                        icon={ShieldCheck}
                        value={formData.trn_number}
                        onChange={(e) => setFormData({ ...formData, trn_number: e.target.value })}
                        placeholder="700XXXXXXXXXXX"
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                        <PortfolioInput
                            label="FIELD COORDINATES (ADDRESS)"
                            icon={MapPin}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            multiline
                            rows={3}
                        />
                    </div>

                    <PortfolioInput
                        label="FINANCIAL CREDIT LIMIT (AED)"
                        icon={CreditCard}
                        type="number"
                        value={formData.credit_limit}
                        onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            style={{
                                padding: '15px 25px',
                                borderRadius: '12px',
                                border: formData.is_active ? '1px solid #10b981' : '1px solid #ef4444',
                                background: formData.is_active ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                color: formData.is_active ? '#10b981' : '#ef4444',
                                fontSize: '11px',
                                fontWeight: '900',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                textTransform: 'uppercase'
                            }}
                        >
                            {formData.is_active ? <CheckCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> : '■'}
                            {formData.is_active ? 'REGISTRY ACTIVE' : 'REGISTRY SUSPENDED'}
                        </button>
                    </div>
                </div>

                <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', display: 'flex', gap: '20px' }}>
                    <PortfolioButton type="submit" variant="primary" disabled={saving} style={{ height: '60px', padding: '0 40px' }}>
                        <Save size={18} /> {saving ? 'SYNCING...' : 'COMMIT TO REGISTRY'}
                    </PortfolioButton>
                    <PortfolioButton type="button" variant="secondary" onClick={() => navigate('/customers')} style={{ height: '60px' }}>
                        DISCARD CHANGES
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default CustomerForm;
