import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Car, Tag, Layers, Plus, Trash2, Edit2, Search, ChevronRight } from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard
} from '../../components/PortfolioComponents';

const VehicleMaster = () => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('brands');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bRes, mRes, tRes] = await Promise.all([
                api.get('/api/masters/brands/'),
                api.get('/api/masters/models/'),
                api.get('/api/masters/types/')
            ]);
            setBrands(bRes.data);
            setModels(mRes.data);
            setTypes(tRes.data);
        } catch (err) {
            console.error('Error fetching master data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        // Implementation for modal/form to add
        alert('Form integration in progress...');
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>DECODING REGISTRY...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="System Master / Vehicle Configuration">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Architectural registry for elite automotive specifications.">
                    Asset Hierarchy
                </PortfolioTitle>
                <PortfolioButton variant="primary" onClick={handleAdd}>
                    <Plus size={18} /> INITIALIZE NODE
                </PortfolioButton>
            </div>

            <div style={tabContainerStyle}>
                <button
                    style={activeTab === 'brands' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('brands')}
                >
                    <Car size={16} /> BRANDS
                </button>
                <button
                    style={activeTab === 'models' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('models')}
                >
                    <Layers size={16} /> MODELS
                </button>
                <button
                    style={activeTab === 'types' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('types')}
                >
                    <Tag size={16} /> TYPES
                </button>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <div style={searchContainerStyle}>
                    <Search size={18} color="rgba(232, 230, 227, 0.2)" />
                    <input
                        type="text"
                        placeholder="Search Registry..."
                        style={searchInputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeTab === 'brands' && brands.map(brand => (
                    <div key={brand.id} style={listItemStyle}>
                        <div style={iconBoxStyle}><Car size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={itemNameStyle}>{brand.name}</div>
                            <div style={itemSubStyle}>{brand.is_active ? 'ACTIVE STATUS' : 'INACTIVE'}</div>
                        </div>
                        <PortfolioButton variant="secondary" style={{ padding: '10px' }}><Edit2 size={14} /></PortfolioButton>
                    </div>
                ))}

                {activeTab === 'models' && models.map(model => (
                    <div key={model.id} style={listItemStyle}>
                        <div style={iconBoxStyle}><Layers size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={itemNameStyle}>{model.name}</div>
                            <div style={itemSubStyle}>{model.brand_name || 'GENERIC BRAND'}</div>
                        </div>
                        <PortfolioButton variant="secondary" style={{ padding: '10px' }}><Edit2 size={14} /></PortfolioButton>
                    </div>
                ))}

                {activeTab === 'types' && types.map(type => (
                    <div key={type.id} style={listItemStyle}>
                        <div style={iconBoxStyle}><Tag size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={itemNameStyle}>{type.name}</div>
                            <div style={itemSubStyle}>{type.is_active ? 'ACTIVE SPEC' : 'ARCHIVED'}</div>
                        </div>
                        <PortfolioButton variant="secondary" style={{ padding: '10px' }}><Edit2 size={14} /></PortfolioButton>
                    </div>
                ))}
            </div>
        </PortfolioPage>
    );
};

const tabContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
    paddingBottom: '10px'
};

const tabStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(232, 230, 227, 0.4)',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '2px',
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s'
};

const activeTabStyle = {
    ...tabStyle,
    color: 'var(--gold)',
    borderBottom: '2px solid var(--gold)'
};

const listItemStyle = {
    padding: '20px 30px',
    background: 'rgba(232, 230, 227, 0.01)',
    border: '1px solid rgba(232, 230, 227, 0.04)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
};

const iconBoxStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(176, 141, 87, 0.05)',
    border: '1px solid rgba(176, 141, 87, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--gold)'
};

const itemNameStyle = {
    fontSize: '16px',
    color: 'var(--cream)',
    fontFamily: 'var(--font-serif)'
};

const itemSubStyle = {
    fontSize: '9px',
    color: 'rgba(232, 230, 227, 0.2)',
    fontWeight: '900',
    letterSpacing: '1px',
    marginTop: '4px'
};

const searchContainerStyle = {
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '12px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    height: '45px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    width: '100%',
    outline: 'none',
    fontSize: '13px'
};

export default VehicleMaster;
