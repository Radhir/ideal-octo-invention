import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Plus, MapPin, Phone, Mail, Check } from 'lucide-react';
import api from '../../api/axios';

const BranchManagementPage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        is_head_office: false,
        is_active: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/api/locations/branches/');
            setBranches(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch branches", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (branch = null) => {
        if (branch) {
            setFormData(branch);
            setIsEdit(true);
            setEditId(branch.id);
        } else {
            setFormData({
                name: '', code: '', address: '', contact_email: '', contact_phone: '',
                is_head_office: false, is_active: true
            });
            setIsEdit(false);
            setEditId(null);
        }
        setShowForm(true);
        setSelectedBranch(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/api/locations/branches/${editId}/`, formData);
            } else {
                await api.post('/api/locations/branches/', formData);
            }
            fetchBranches();
            setShowForm(false);
            setFormData({
                name: '', code: '', address: '', contact_email: '', contact_phone: '',
                is_head_office: false, is_active: true
            });
        } catch (err) {
            alert("Error saving branch: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    if (loading) return <div style={{ padding: '60px', color: 'var(--cream)' }}>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 80px',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '40px'
            }}>
                <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '300', letterSpacing: '1px' }}>
                    Administration
                </div>
                <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
            </div>

            {!showForm && !selectedBranch ? (
                <>
                    {/* Main Title */}
                    <h1 style={{
                        fontSize: 'clamp(4rem, 12vw, 10rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '600',
                        color: 'var(--cream)',
                        lineHeight: '0.9',
                        marginBottom: '100px',
                        letterSpacing: '-0.02em'
                    }}>
                        BRANCH<br />LOCATIONS
                    </h1>

                    {/* Action Button */}
                    <button
                        onClick={() => handleOpen()}
                        style={{
                            padding: '18px 40px',
                            background: 'var(--cream)',
                            border: 'none',
                            borderRadius: '50px',
                            color: '#0a0a0a',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Add New Branch
                    </button>

                    {/* Branch Pills */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                        maxWidth: '1200px'
                    }}>
                        {branches.map(branch => (
                            <button
                                key={branch.id}
                                onClick={() => setSelectedBranch(branch)}
                                style={{
                                    padding: '30px',
                                    background: 'transparent',
                                    border: branch.is_head_office
                                        ? '2px solid var(--gold)'
                                        : '1.5px solid var(--cream)',
                                    borderRadius: '20px',
                                    color: 'var(--cream)',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-serif)',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(232, 230, 227, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                }}
                            >
                                {branch.is_head_office && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        padding: '5px 15px',
                                        background: 'var(--gold)',
                                        color: '#0a0a0a',
                                        borderRadius: '50px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        letterSpacing: '1px'
                                    }}>
                                        HQ
                                    </div>
                                )}
                                <div style={{ fontSize: '20px', marginBottom: '10px' }}>{branch.name}</div>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '5px' }}>
                                    {branch.code}
                                </div>
                                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '10px', fontFamily: 'inherit', fontWeight: '300' }}>
                                    {branch.address}
                                </div>
                            </button>
                        ))}
                    </div>

                    {branches.length === 0 && (
                        <p style={{
                            color: 'rgba(232, 230, 227, 0.6)',
                            fontSize: '15px',
                            marginTop: '40px'
                        }}>
                            No branches created yet. Add your first location.
                        </p>
                    )}
                </>
            ) : showForm ? (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back
                    </button>

                    {/* Form Title */}
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {isEdit ? 'Edit Branch' : 'New Branch'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>BRANCH NAME</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="e.g. Downtown Service Center"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>BRANCH CODE</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="e.g. DSC01"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>ADDRESS</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                                placeholder="Full address..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>PHONE</label>
                                <input
                                    type="text"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    style={inputStyle}
                                    placeholder="+971 XX XXX XXXX"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>EMAIL</label>
                                <input
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    style={inputStyle}
                                    placeholder="branch@eliteshine.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px', display: 'flex', gap: '30px' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_head_office: !formData.is_head_office })}
                                style={{
                                    padding: '15px 30px',
                                    background: formData.is_head_office ? 'var(--gold)' : 'transparent',
                                    border: '1px solid ' + (formData.is_head_office ? 'var(--gold)' : 'var(--cream)'),
                                    borderRadius: '50px',
                                    color: formData.is_head_office ? '#0a0a0a' : 'var(--cream)',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {formData.is_head_office && <Check size={14} />}
                                Head Office
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                style={{
                                    padding: '15px 30px',
                                    background: formData.is_active ? 'var(--cream)' : 'transparent',
                                    border: '1px solid var(--cream)',
                                    borderRadius: '50px',
                                    color: formData.is_active ? '#0a0a0a' : 'var(--cream)',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {formData.is_active && <Check size={14} />}
                                Active
                            </button>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '18px 60px',
                                background: 'var(--cream)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#0a0a0a',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {isEdit ? 'Save Changes' : 'Create Branch'}
                        </button>
                    </form>
                </>
            ) : selectedBranch && (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => setSelectedBranch(null)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back to branches
                    </button>

                    {/* Branch Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                            fontFamily: 'var(--font-serif)',
                            fontWeight: '500',
                            color: 'var(--cream)',
                            letterSpacing: '-0.01em',
                            margin: 0
                        }}>
                            {selectedBranch.name}
                        </h2>
                        {selectedBranch.is_head_office && (
                            <div style={{
                                padding: '8px 20px',
                                background: 'var(--gold)',
                                color: '#0a0a0a',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '1px'
                            }}>
                                HEADQUARTERS
                            </div>
                        )}
                    </div>

                    <div style={{
                        color: 'rgba(232, 230, 227, 0.6)',
                        fontSize: '16px',
                        marginBottom: '60px',
                        fontFamily: 'monospace',
                        letterSpacing: '2px'
                    }}>
                        {selectedBranch.code}
                    </div>

                    {/* Details Grid */}
                    <div style={{
                        display: 'grid',
                        gap: '30px',
                        marginBottom: '60px',
                        maxWidth: '600px'
                    }}>
                        <div style={{
                            padding: '25px 30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                <MapPin size={20} color="var(--cream)" style={{ marginTop: '2px', opacity: 0.6 }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '8px', letterSpacing: '1px' }}>
                                        ADDRESS
                                    </div>
                                    <div style={{ fontSize: '16px', color: 'var(--cream)', lineHeight: '1.6' }}>
                                        {selectedBranch.address}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedBranch.contact_phone && (
                            <div style={{
                                padding: '25px 30px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                borderRadius: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Phone size={20} color="var(--cream)" style={{ opacity: 0.6 }} />
                                    <div>
                                        <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '8px', letterSpacing: '1px' }}>
                                            PHONE
                                        </div>
                                        <div style={{ fontSize: '16px', color: 'var(--cream)' }}>
                                            {selectedBranch.contact_phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedBranch.contact_email && (
                            <div style={{
                                padding: '25px 30px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                borderRadius: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Mail size={20} color="var(--cream)" style={{ opacity: 0.6 }} />
                                    <div>
                                        <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '8px', letterSpacing: '1px' }}>
                                            EMAIL
                                        </div>
                                        <div style={{ fontSize: '16px', color: 'var(--cream)' }}>
                                            {selectedBranch.contact_email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={() => handleOpen(selectedBranch)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Edit Branch
                    </button>
                </>
            )}
        </div>
    );
};

const labelStyle = {
    display: 'block',
    color: 'rgba(232, 230, 227, 0.6)',
    fontSize: '13px',
    marginBottom: '10px',
    letterSpacing: '1px'
};

const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    background: 'transparent',
    border: '1px solid rgba(232, 230, 227, 0.3)',
    borderRadius: '10px',
    color: 'var(--cream)',
    fontSize: '15px',
    fontFamily: 'inherit'
};

export default BranchManagementPage;
