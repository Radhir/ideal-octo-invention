import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Search, Filter, Plus, FileText,
    Calendar, User, Car, CheckCircle, Clock,
    ChevronRight, ExternalLink, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioInput,
    PortfolioSelect,
    PortfolioStats
} from '../../components/PortfolioComponents';

const WarrantyBook = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');

    const categories = [
        { id: 'ALL', name: 'ALL RECORDS' },
        { id: 'PPF', name: 'PPF' },
        { id: 'CERAMIC', name: 'CERAMIC' },
        { id: 'TINT', name: 'TINT' },
        { id: 'PAINT', name: 'PAINT' },
        { id: 'WRAP', name: 'WRAP' }
    ];

    useEffect(() => {
        fetchRegistrations();
    }, [activeCategory]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const params = activeCategory !== 'ALL' ? { category: activeCategory } : {};
            const res = await api.get('/api/warranty-book/api/registrations/', { params });
            setRegistrations(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching warranties', err);
            setLoading(false);
        }
    };

    const filteredRecords = registrations.filter(r =>
        r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.warranty_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'ACTIVE CLEARANCE', value: registrations.filter(r => r.status === 'ACTIVE').length, icon: Shield, color: '#10b981' },
        { label: 'EXPIRING SOON', value: registrations.filter(r => r.status === 'ACTIVE' && new Date(r.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length, icon: Clock, color: 'var(--gold)' },
        { label: 'TOTAL ISSUED', value: registrations.length, icon: FileText, color: 'var(--cream)' }
    ];

    return (
        <PortfolioPage breadcrumb="Quality Assurance / Warranty Book">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Electronic warranty ledger and high-security compliance registry.">
                    WARRANTY BOOK
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => navigate('/warranty/new')}>
                        <Plus size={18} style={{ marginRight: '10px' }} /> NEW REGISTRATION
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ marginBottom: '50px' }}>
                <div style={filterBar}>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    padding: '12px 25px',
                                    borderRadius: '12px',
                                    border: `1px solid ${activeCategory === cat.id ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`,
                                    background: activeCategory === cat.id ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                                    color: activeCategory === cat.id ? 'var(--gold)' : 'var(--cream)',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    letterSpacing: '2px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Plate..."
                            style={searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--gold)', textAlign: 'center', padding: '100px' }}>ACCESSING SECURE LEDGER...</div>
            ) : (
                <PortfolioGrid columns="repeat(auto-fill, minmax(400px, 1fr))">
                    <AnimatePresence>
                        {filteredRecords.map((reg, idx) => (
                            <motion.div
                                key={reg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' }}>
                                                    {reg.category_display.toUpperCase()}
                                                </div>
                                                <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                                    {reg.warranty_number}
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                background: reg.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                color: reg.status === 'ACTIVE' ? '#10b981' : '#f43f5e',
                                                fontSize: '9px',
                                                fontWeight: '900',
                                                letterSpacing: '1px',
                                                border: `1px solid ${reg.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                            }}>
                                                {reg.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '30px' }}>
                                        <div style={recordItem}>
                                            <User size={16} />
                                            <span>{reg.customer_name}</span>
                                        </div>
                                        <div style={recordItem}>
                                            <Car size={16} />
                                            <span>{reg.vehicle_brand} {reg.vehicle_model} // {reg.plate_number}</span>
                                        </div>
                                        <div style={recordItem}>
                                            <Calendar size={16} />
                                            <span>EXPIRES: {new Date(reg.expiry_date).toLocaleDateString()}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                            <PortfolioButton
                                                variant="secondary"
                                                style={{ flex: 1, height: '45px', fontSize: '11px' }}
                                                onClick={() => window.open(reg.qr_code, '_blank')}
                                            >
                                                <Download size={14} style={{ marginRight: '8px' }} /> CARD
                                            </PortfolioButton>
                                            <PortfolioButton
                                                style={{ flex: 1, height: '45px', fontSize: '11px' }}
                                                onClick={() => navigate(`/warranty/view/${reg.portal_token}`)}
                                            >
                                                <ExternalLink size={14} style={{ marginRight: '8px' }} /> PORTAL
                                            </PortfolioButton>
                                        </div>
                                    </div>
                                </PortfolioCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </PortfolioGrid>
            )}

            {filteredRecords.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <Shield size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontWeight: '800' }}>NO WARRANTY RECORDS FOUND</p>
                </div>
            )}
        </PortfolioPage>
    );
};

const filterBar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 10px 10px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const searchInput = {
    width: '100%',
    padding: '12px 15px 12px 45px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px'
};

const recordItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(232, 230, 227, 0.6)',
    fontSize: '14px',
    marginBottom: '15px'
};

export default WarrantyBook;
