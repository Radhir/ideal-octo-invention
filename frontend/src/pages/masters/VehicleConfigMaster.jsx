import React, { useState, useEffect } from 'react';
import {
    Plus, Car, Palette, Box, Trash2,
    ChevronRight, ArrowLeft, Search, Layers,
    CheckCircle, XCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioInput,
    PortfolioSelect
} from '../../components/PortfolioComponents';

const VehicleConfigMaster = () => {
    const [activeTab, setActiveTab] = useState('BRANDS'); // BRANDS, MODELS, COLORS
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [bRes, mRes, cRes] = await Promise.all([
                api.get('/forms/masters/api/brands/'),
                api.get('/forms/masters/api/models/'),
                api.get('/forms/masters/api/vehicle-colors/')
            ]);
            setBrands(bRes.data.results || bRes.data);
            setModels(mRes.data.results || mRes.data);
            setColors(cRes.data.results || cRes.data);
        } catch (err) {
            console.error("Failed to load vehicle configs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (type, item = null) => {
        setIsEdit(!!item);
        setEditId(item?.id || null);

        if (type === 'BRANDS') {
            setFormData({ name: item?.name || '', is_active: item ? item.is_active : true });
        } else if (type === 'MODELS') {
            setFormData({ name: item?.name || '', brand: item?.brand || '', is_active: item ? item.is_active : true });
        } else if (type === 'COLORS') {
            setFormData({ name: item?.name || '', hex_code: item?.hex_code || '#000000' });
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = activeTab === 'BRANDS' ? '/forms/masters/api/brands/' :
            activeTab === 'MODELS' ? '/forms/masters/api/models/' :
                '/forms/masters/api/vehicle-colors/';

        try {
            if (isEdit) {
                await api.put(`${endpoint}${editId}/`, formData);
            } else {
                await api.post(endpoint, formData);
            }
            setShowForm(false);
            fetchAll();
        } catch (err) {
            alert("Error saving: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this registry node?")) return;
        const endpoint = activeTab === 'BRANDS' ? '/forms/masters/api/brands/' :
            activeTab === 'MODELS' ? '/forms/masters/api/models/' :
                '/forms/masters/api/vehicle-colors/';
        try {
            await api.delete(`${endpoint}${id}/`);
            fetchAll();
        } catch (err) {
            alert("Delete failed: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    if (loading) return <PageLoader />;

    return (
        <PortfolioPage breadcrumb={`SYSTEM REGISTRY // VEHICLE CONFIG // ${activeTab}`}>
            <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <PortfolioTitle subtitle="Global configuration for brand archetypes, model series, and aesthetic color palettes.">
                    Vehicle Configuration
                </PortfolioTitle>
                <div className="no-print">
                    <PortfolioButton variant="primary" onClick={() => handleOpenForm(activeTab)}>
                        <Plus size={18} /> ADD {activeTab.slice(0, -1)}
                    </PortfolioButton>
                </div>
            </header>

            {/* Premium Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', borderBottom: '1px solid rgba(232, 230, 227, 0.05)', paddingBottom: '20px' }}>
                <TabButton active={activeTab === 'BRANDS'} onClick={() => setActiveTab('BRANDS')} icon={<Layers size={14} />}>Brands</TabButton>
                <TabButton active={activeTab === 'MODELS'} onClick={() => setActiveTab('MODELS')} icon={<Box size={14} />}>Models</TabButton>
                <TabButton active={activeTab === 'COLORS'} onClick={() => setActiveTab('COLORS')} icon={<Palette size={14} />}>Colors</TabButton>
            </div>

            <div style={{ minHeight: '400px' }}>
                {activeTab === 'BRANDS' && <BrandGrid brands={brands} onEdit={(b) => handleOpenForm('BRANDS', b)} onDelete={handleDelete} />}
                {activeTab === 'MODELS' && <ModelGrid models={models} brands={brands} onEdit={(m) => handleOpenForm('MODELS', m)} onDelete={handleDelete} />}
                {activeTab === 'COLORS' && <ColorGrid colors={colors} onEdit={(c) => handleOpenForm('COLORS', c)} onDelete={handleDelete} />}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            style={{ background: '#0f0f0f', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '30px', width: '100%', maxWidth: '500px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '30px' }}>
                                {isEdit ? 'Refine Registry Node' : `Initialize ${activeTab.slice(0, -1)}`}
                            </h2>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <PortfolioInput
                                    label="NAME / IDENTIFIER"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                {activeTab === 'MODELS' && (
                                    <PortfolioSelect
                                        label="PARENT BRAND"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        required
                                    >
                                        <option value="">-- SELECT BRAND --</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </PortfolioSelect>
                                )}

                                {activeTab === 'COLORS' && (
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <PortfolioInput
                                                label="HEX COLOR CODE"
                                                value={formData.hex_code}
                                                onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                                            />
                                        </div>
                                        <input
                                            type="color"
                                            value={formData.hex_code}
                                            onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                                            style={{ width: '60px', height: '60px', border: 'none', background: 'none', cursor: 'pointer', marginTop: '20px' }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                    <PortfolioButton type="submit" variant="primary" style={{ flex: 1 }}>SAVE NODE</PortfolioButton>
                                    <PortfolioButton type="button" variant="secondary" onClick={() => setShowForm(false)}>CANCEL</PortfolioButton>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PortfolioPage>
    );
};

const TabButton = ({ active, children, onClick, icon }) => (
    <button
        onClick={onClick}
        style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: active ? 'rgba(232, 230, 227, 0.05)' : 'transparent',
            color: active ? 'var(--gold)' : 'rgba(232, 230, 227, 0.4)',
            border: active ? '1px solid var(--gold)' : '1px solid transparent',
            fontWeight: '800',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}
    >
        {icon}
        {children}
    </button>
);

const BrandGrid = ({ brands, onEdit, onDelete }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {brands.map(brand => (
            <PortfolioCard key={brand.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                            <Car size={20} />
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--cream)', letterSpacing: '1px' }}>{brand.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => onEdit(brand)} style={iconBtn}><ChevronRight size={14} /></button>
                        <button onClick={() => onDelete(brand.id)} style={iconBtn} className="hover-red"><Trash2 size={14} /></button>
                    </div>
                </div>
            </PortfolioCard>
        ))}
    </div>
);

const ModelGrid = ({ models, brands, onEdit, onDelete }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)' }}>
            <thead>
                <tr style={{ textAlign: 'left', color: 'var(--gold)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <th style={{ padding: '20px' }}>Model Name</th>
                    <th style={{ padding: '20px' }}>Parent Brand</th>
                    <th style={{ padding: '20px' }}>Status</th>
                    <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {models.map(model => (
                    <tr key={model.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                        <td style={{ padding: '20px', fontWeight: '700' }}>{model.name}</td>
                        <td style={{ padding: '20px', opacity: 0.6 }}>{brands.find(b => b.id === model.brand)?.name || 'Unknown'}</td>
                        <td style={{ padding: '20px' }}>
                            <span style={{ fontSize: '9px', fontWeight: '900', color: model.is_active ? '#10b981' : '#f43f5e', background: model.is_active ? '#10b98111' : '#f43f5e11', padding: '4px 10px', borderRadius: '5px' }}>
                                {model.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => onEdit(model)} style={iconBtn}><ChevronRight size={14} /></button>
                                <button onClick={() => onDelete(model.id)} style={iconBtn}><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ColorGrid = ({ colors, onEdit, onDelete }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {colors.map(color => (
            <PortfolioCard key={color.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '30px', height: '30px', background: color.hex_code, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}></div>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '13px' }}>{color.name}</div>
                            <div style={{ fontSize: '10px', opacity: 0.4, fontFamily: 'monospace' }}>{color.hex_code}</div>
                        </div>
                    </div>
                    <button onClick={() => onDelete(color.id)} style={iconBtn}><Trash2 size={14} /></button>
                </div>
            </PortfolioCard>
        ))}
    </div>
);

const iconBtn = {
    background: 'rgba(232, 230, 227, 0.05)',
    border: 'none',
    color: 'rgba(232, 230, 227, 0.4)',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s hover:background:rgba(232, 230,227,0.1) hover:color:var(--gold)'
};

export default VehicleConfigMaster;
