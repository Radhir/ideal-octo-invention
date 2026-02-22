import React, { useState, useEffect } from 'react';
import {
    Truck, Phone, Mail, MapPin,
    CreditCard, ShieldCheck, Box,
    ChevronRight, ArrowLeft, Save,
    CheckCircle, Globe
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

const SupplierForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        category: 'GENERAL',
        trn_number: '',
        payment_terms: '',
        credit_limit: '0.00',
        is_active: true
    });

    useEffect(() => {
        if (isEdit) {
            fetchSupplier();
        }
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const res = await api.get(`/forms/stock/api/suppliers/${id}/`);
            setFormData(res.data);
        } catch (err) {
            console.error("Failed to fetch supplier", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await api.put(`/forms/stock/api/suppliers/${id}/`, formData);
            } else {
                await api.post('/forms/stock/api/suppliers/', formData);
            }
            navigate('/stock/suppliers');
        } catch (err) {
            alert("Error saving: " + JSON.stringify(err.response?.data || err.message));
        } finally {
            setSaving(false);
        }
    };

    const categories = ['GENERAL', 'PPF', 'CERAMIC', 'CHEMICALS', 'TOOLS', 'CONSUMABLES'];

    if (loading) return <PageLoader />;

    return (
        <PortfolioPage breadcrumb={`LOGISTICS / REGISTRY / ${isEdit ? 'REFINE' : 'REGISTER'} PARTNER`}>
            <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <PortfolioTitle subtitle="Consolidating material supply chains and industrial partnerships.">
                    {isEdit ? 'Supplier Dossier' : 'Register New Partner'}
                </PortfolioTitle>
                <div className="no-print">
                    <PortfolioButton variant="secondary" onClick={() => navigate('/stock/suppliers')}>
                        <ArrowLeft size={16} /> BACK TO REGISTRY
                    </PortfolioButton>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginBottom: '40px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <PortfolioInput
                            label="TRADING TITLE / COMPANY NAME"
                            icon={Truck}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <PortfolioSelect
                        label="SUPPLY CATEGORY"
                        icon={Box}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </PortfolioSelect>

                    <PortfolioInput
                        label="ACCOUNT MANAGER / CONTACT"
                        icon={Globe}
                        value={formData.contact_person}
                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />

                    <PortfolioInput
                        label="PRIMARY COMMS LINE"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />

                    <PortfolioInput
                        label="OFFICIAL NETWORK MAIL"
                        icon={Mail}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <PortfolioInput
                        label="VAT / TRN REGISTRY"
                        icon={ShieldCheck}
                        value={formData.trn_number}
                        onChange={(e) => setFormData({ ...formData, trn_number: e.target.value })}
                    />

                    <PortfolioInput
                        label="PAYMENT TERMS (e.g. 30 Days)"
                        icon={CreditCard}
                        value={formData.payment_terms}
                        onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                        <PortfolioInput
                            label="LOGISTICS NODE (ADDRESS)"
                            icon={MapPin}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            multiline
                            rows={3}
                        />
                    </div>

                    <PortfolioInput
                        label="ALLOCATED CREDIT LIMIT (AED)"
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
                            {formData.is_active ? 'PARTNER ACTIVE' : 'PARTNER SUSPENDED'}
                        </button>
                    </div>
                </div>

                <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', display: 'flex', gap: '20px' }}>
                    <PortfolioButton type="submit" variant="primary" disabled={saving} style={{ height: '60px', padding: '0 40px' }}>
                        <Save size={18} /> {saving ? 'SYNCING...' : 'REGISTER PARTNER'}
                    </PortfolioButton>
                    <PortfolioButton type="button" variant="secondary" onClick={() => navigate('/stock/suppliers')} style={{ height: '60px' }}>
                        DISCARD CHANGES
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default SupplierForm;
