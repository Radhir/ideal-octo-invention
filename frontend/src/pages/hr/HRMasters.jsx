import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { PortfolioPage, PortfolioTitle, PortfolioButton, PortfolioInput, GlassCard } from '../../components/PortfolioComponents';
import { Plus, Trash2, Save, FileText, Heart, ShieldAlert } from 'lucide-react';

const HRMasters = () => {
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'marital');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', description: '' });

    const masters = {
        marital: {
            title: 'Marital Status Registry',
            endpoint: '/api/hr/marital-statuses/',
            icon: Heart,
            description: 'Define official marital categories for employee records.'
        },
        deduction: {
            title: 'Deduction Type Registry',
            endpoint: '/api/hr/deduction-types/',
            icon: ShieldAlert,
            description: 'Define standardized categories for salary deductions (e.g. Fines, Advances).'
        },
        leave: {
            title: 'Leave Type Registry',
            endpoint: '/leaves/api/leave-types/',
            icon: FileText,
            description: 'Define allowed leave categories (e.g. Sick, Annual, Emergency).'
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(masters[activeTab].endpoint);
            setData(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch master data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleAdd = async () => {
        if (!newItem.name) return;
        try {
            await api.post(masters[activeTab].endpoint, newItem);
            setNewItem({ name: '', description: '' });
            fetchData();
        } catch (err) {
            alert("Failed to add master item");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This may affect existing employee records.")) return;
        try {
            await api.delete(`${masters[activeTab].endpoint}${id}/`);
            fetchData();
        } catch (err) {
            alert("Delete failed. Check if item is in use.");
        }
    };

    const MasterIcon = masters[activeTab].icon;

    return (
        <PortfolioPage breadcrumb={`HRMS / Masters / ${activeTab.toUpperCase()}`}>
            <PortfolioTitle subtitle="Manage standardized registries for the HRMS module.">
                HR MASTER DATA
            </PortfolioTitle>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                {Object.keys(masters).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            padding: '12px 24px',
                            background: activeTab === key ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                            color: activeTab === key ? 'black' : 'white',
                            border: '1px solid ' + (activeTab === key ? 'var(--gold)' : 'rgba(255,255,255,0.1)'),
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {key.toUpperCase()}
                    </button>
                ))}
            </div>

            <GlassCard style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                        <MasterIcon size={20} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>{masters[activeTab].title}</h2>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{masters[activeTab].description}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', marginBottom: '40px', alignItems: 'end' }}>
                    <PortfolioInput
                        label="Classification Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g. Health Insurance Deduction"
                    />
                    <PortfolioInput
                        label="Description (Optional)"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Details about this classification..."
                    />
                    <PortfolioButton variant="gold" onClick={handleAdd} style={{ height: '45px' }}>
                        <Plus size={18} /> Add New
                    </PortfolioButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {loading ? (
                        <p style={{ color: 'var(--gold)' }}>Fetching Registry...</p>
                    ) : data.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px' }}>No records found in this category.</p>
                    ) : (
                        data.map(item => (
                            <div key={item.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr auto',
                                padding: '15px 20px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                <span style={{ fontWeight: '700', color: 'var(--gold)' }}>{item.name}</span>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.description || '--'}</span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>
        </PortfolioPage>
    );
};

export default HRMasters;
