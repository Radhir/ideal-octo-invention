import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Users, Phone, Mail, Plus,
    Search, Truck, ShieldCheck, ExternalLink,
    ChevronRight
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
} from '../../components/PortfolioComponents';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/forms/stock/api/suppliers/');
            setSuppliers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching suppliers", err);
            setLoading(false);
        }
    };

    const categories = ['ALL', 'PPF', 'CERAMIC', 'CHEMICALS', 'TOOLS', 'GENERAL'];

    const filteredSuppliers = suppliers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.contact_person && s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCat = filterCategory === 'ALL' || s.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Suppliers">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A curation of elite industrial partners and material suppliers for the workshop.">
                    Supplier Registry
                </PortfolioTitle>
                <PortfolioButton
                    variant="primary"
                    style={{ height: '60px', padding: '0 30px' }}
                >
                    <Plus size={18} /> REGISTER NEW PARTNER
                </PortfolioButton>
            </header>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232, 230, 227, 0.4)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search partner registry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            style={{
                                ...catBtnStyle,
                                background: filterCategory === cat ? 'var(--gold)' : 'rgba(232, 230, 227, 0.05)',
                                color: filterCategory === cat ? '#000' : 'rgba(232, 230, 227, 0.6)',
                                border: filterCategory === cat ? '1px solid var(--gold)' : '1px solid rgba(232, 230, 227, 0.1)'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <PortfolioGrid minWidth="400px">
                {filteredSuppliers.map(supplier => (
                    <PortfolioCard key={supplier.id} style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '15px',
                                background: 'rgba(176,141,87,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--gold)'
                            }}>
                                <Truck size={30} />
                            </div>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: '900',
                                letterSpacing: '2px',
                                color: 'var(--gold)',
                                opacity: 0.8
                            }}>
                                {supplier.category.toUpperCase() || 'GENERAL'}
                            </div>
                        </div>

                        <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '26px',
                            color: 'var(--cream)',
                            margin: '0 0 10px 0'
                        }}>
                            {supplier.name}
                        </h3>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            padding: '25px 0',
                            borderTop: '1px solid rgba(232, 230, 227, 0.05)',
                        }}>
                            <div style={infoRowStyle}>
                                <Users size={14} color="var(--gold)" />
                                <span>{supplier.contact_person || 'Logistics Officer'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <Phone size={14} color="var(--gold)" />
                                <span>{supplier.phone || 'COMMUNICATION SECURED'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <Mail size={14} color="var(--gold)" />
                                <span>{supplier.email || 'N/A'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <ShieldCheck size={14} color="var(--gold)" />
                                <span>TL NO: {supplier.trade_license || 'VERIFIED'}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                            <PortfolioButton variant="secondary" style={{ flex: 1, height: '45px', fontSize: '11px' }}>
                                VIEW HISTORY
                            </PortfolioButton>
                            <PortfolioButton variant="secondary" style={{ height: '45px', width: '45px', padding: 0 }}>
                                <ChevronRight size={16} />
                            </PortfolioButton>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>

            {filteredSuppliers.length === 0 && !loading && (
                <div style={{
                    padding: '100px 20px',
                    textAlign: 'center',
                    background: 'rgba(232, 230, 227, 0.02)',
                    borderRadius: '20px',
                    border: '1px dashed rgba(232, 230, 227, 0.1)'
                }}>
                    <Users size={40} style={{ color: 'var(--gold)', marginBottom: '20px', opacity: 0.3 }} />
                    <div style={{ color: 'var(--cream)', fontSize: '18px', fontFamily: "'Cormorant Garamond', serif" }}>No Partners Found</div>
                    <div style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '12px', marginTop: '10px' }}>Expand the registry by adding new suppliers.</div>
                </div>
            )}
        </PortfolioPage>
    );
};

const filterInputStyle = {
    width: '100%',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '15px',
    padding: '18px 20px 18px 55px',
    color: 'var(--cream)',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s'
};

const catBtnStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textTransform: 'uppercase'
};

const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.6)'
};

export default SupplierList;
