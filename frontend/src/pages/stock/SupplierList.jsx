import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    Users, Phone, Mail, MapPin, Plus,
    Search, Filter, ExternalLink, ShieldCheck,
    Truck, MoreVertical, Edit2, Trash2
} from 'lucide-react';

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
            const res = await axios.get('/forms/stock/api/suppliers/');
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
            s.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = filterCategory === 'ALL' || s.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Procurement & Supply Chain</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Supplier Registry</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>Manage all active vendors and material partners.</p>
                </div>
                <button
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px',
                        background: '#b08d57', color: '#000', border: 'none', borderRadius: '12px',
                        fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                >
                    <Plus size={20} /> REGISTER SUPPLIER
                </button>
            </header>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or contact person..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            style={{
                                ...catBtnStyle,
                                background: filterCategory === cat ? 'rgba(176, 141, 87, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                borderColor: filterCategory === cat ? '#b08d57' : 'rgba(255, 255, 255, 0.1)',
                                color: filterCategory === cat ? '#b08d57' : '#94a3b8'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                {filteredSuppliers.map(supplier => (
                    <GlassCard key={supplier.id} style={{ padding: '25px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b08d57' }}>
                                <Truck size={28} />
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button style={iconBtnStyle}><Edit2 size={16} /></button>
                                <button style={iconBtnStyle}><Trash2 size={16} color="#f43f5e" /></button>
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff' }}>{supplier.name}</h3>
                        <div style={{ fontSize: '12px', color: '#b08d57', fontWeight: '800', marginBottom: '20px' }}>{supplier.category || 'GENERAL SUPPLIER'}</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={infoRowStyle}>
                                <Users size={14} color="#64748b" />
                                <span>{supplier.contact_person || 'No Contact Person'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <Phone size={14} color="#64748b" />
                                <span>{supplier.phone || 'N/A'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <Mail size={14} color="#64748b" />
                                <span>{supplier.email || 'N/A'}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <ShieldCheck size={14} color="#64748b" />
                                <span>Trade License: {supplier.trade_license || 'Not Provided'}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                            <button style={cardActionBtn}>VIEW HISTORY</button>
                            <button style={{ ...cardActionBtn, background: 'rgba(255,255,255,0.05)' }}>
                                <ExternalLink size={14} /> SITE
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

const filterInputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 12px 12px 45px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s'
};

const catBtnStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: '#94a3b8'
};

const iconBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#94a3b8'
};

const cardActionBtn = {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
};

export default SupplierList;
