import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Settings, DollarSign, Briefcase, Plus, Search, Edit2 } from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard
} from '../../components/PortfolioComponents';

const ServiceMaster = () => {
    const [services, setServices] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, dRes] = await Promise.all([
                api.get('/api/masters/services/'),
                api.get('/api/hr/departments/')
            ]);
            setServices(sRes.data);
            setDepartments(dRes.data);
        } catch (err) {
            console.error('Error fetching service data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        alert('Form integration in progress...');
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>DECRYPTING SERVICES...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="System Master / Service Catalog">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A standardized ledger of elite automotive treatments and logistics.">
                    Operations Registry
                </PortfolioTitle>
                <PortfolioButton variant="primary" onClick={handleAdd}>
                    <Plus size={18} /> DEFINE SERVICE
                </PortfolioButton>
            </div>

            <PortfolioStats stats={[
                { value: services.length, label: 'TOTAL SERVICES' },
                { value: departments.length, label: 'DEPARTMENTS' }
            ]} />

            <div style={{ marginBottom: '40px', marginTop: '40px' }}>
                <div style={searchContainerStyle}>
                    <Search size={18} color="rgba(232, 230, 227, 0.2)" />
                    <input
                        type="text"
                        placeholder="Search Services (Polishing, Ceramic, Logistics)..."
                        style={searchInputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {services.map(service => (
                    <PortfolioCard key={service.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={deptBadgeStyle}>{service.department_name || 'UNASSIGNED'}</div>
                            <div style={{ color: 'var(--gold)', fontWeight: '100', fontSize: '20px', fontFamily: 'var(--font-serif)' }}>
                                AED {service.base_price}
                            </div>
                        </div>
                        <h3 style={{ fontSize: '18px', color: 'var(--cream)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                            {service.name}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.4)', lineHeight: '1.6', marginBottom: '20px' }}>
                            {service.description || 'No description provided for this operational dossier.'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <PortfolioButton variant="secondary" style={{ flex: 1, padding: '10px' }}>
                                <Edit2 size={14} /> CONFIGURE
                            </PortfolioButton>
                        </div>
                    </PortfolioCard>
                ))}
            </div>
        </PortfolioPage>
    );
};

const deptBadgeStyle = {
    padding: '4px 12px',
    background: 'rgba(176, 141, 87, 0.05)',
    border: '1px solid rgba(176, 141, 87, 0.1)',
    borderRadius: '30px',
    fontSize: '9px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '1px'
};

const searchContainerStyle = {
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '12px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    height: '50px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'var(--font-serif)'
};

export default ServiceMaster;
