import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, Shield, Key, Bell,
    LogOut, Save, Camera, CreditCard, FileText,
    Globe, Activity, HardDrive, MapPin, Briefcase,
    BadgeCheck, ShieldCheck
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioInput,
    PortfolioDetailBox
} from '../components/PortfolioComponents';
import api from '../api/axios';

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '',
        phone: '', bio: '', location: '',
        passport_no: '', visa_uid: '', nationality: '',
        employee_id: 'ES-2026-001', department: 'Executive Office',
        role: 'Master Administrator', date_joined: '2020-11-23',
        uae_address: 'Downtown Dubai, Elite Tower 1',
        home_country: 'India', skills: 'System Architecture, Cyber-Security, Logic Gateways'
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role_name || user.role || 'Master Administrator',
                employee_id: user.employee_id || 'ES-2026-001',
                passport_no: user.passport_no || 'P77890XXX',
                visa_uid: user.visa_uid || '101/2020/XXXXXX',
                nationality: user.nationality || 'Indian',
            }));
            setPreview(user.profile_image || null);
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key]) formData.append(key, form[key]);
            });
            if (photo) formData.append('profile_image', photo);

            await api.patch('/api/hr/employees/me/profile_update/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Personnel Dossier Synchronized Successfully.');
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Synchronization Failed. Check System Status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb="System / Security / Superuser Dossier">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <div className="superuser-master-badge">[MASTER SUPERUSER]</div>
                    <PortfolioTitle subtitle="High-fidelity personnel intelligence and identification archive.">
                        Personnel Dossier
                    </PortfolioTitle>
                    <div className="dossier-id-tag">ARCHIVE NO: {form.employee_id} / V6.2-FINAL</div>
                </div>
                <PortfolioButton variant="gold" onClick={handleSave} disabled={loading} style={{ padding: '15px 40px' }}>
                    {loading ? 'SYNCHRONIZING...' : <><HardDrive size={18} style={{ marginRight: '10px' }} /> SECURE CHANGES</>}
                </PortfolioButton>
            </div>

            <PortfolioGrid columns="1fr 1fr">
                {/* 1. IDENTITY PORTFOLIO */}
                <div className="dossier-card">
                    <div className="dossier-section-title">
                        <User size={18} /> IDENTITY PORTFOLIO
                    </div>
                    <div className="dossier-grid">
                        <MetadataItem label="Full Legal Name" value={`${form.first_name} ${form.last_name}`} />
                        <MetadataItem label="Archive ID" value={form.employee_id} />
                        <MetadataItem label="Nationality" value={form.nationality} />
                        <MetadataItem label="Operational Status" value="ACTIVE / VERIFIED" style={{ color: '#10b981' }} />
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <PortfolioInput label="Override Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    </div>
                </div>

                {/* 2. DEPLOYMENT PROTOCOLS */}
                <div className="dossier-card">
                    <div className="dossier-section-title">
                        <Briefcase size={18} /> DEPLOYMENT PROTOCOLS
                    </div>
                    <div className="dossier-grid">
                        <MetadataItem label="Department" value={form.department} />
                        <MetadataItem label="Primary Role" value={form.role} />
                        <MetadataItem label="Joining Date" value={form.date_joined} />
                        <MetadataItem label="Security Clear" value="LEVEL 0 (MASTER)" style={{ color: 'var(--gold)' }} />
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <MetadataItem label="Competency Synopsis" value={form.skills} />
                    </div>
                </div>

                {/* 3. UAE ASSIGNMENT */}
                <div className="dossier-card">
                    <div className="dossier-section-title">
                        <MapPin size={18} /> UAE ASSIGNMENT
                    </div>
                    <div className="dossier-grid">
                        <MetadataItem label="Residential Zone" value={form.uae_address} />
                        <MetadataItem label="Secure Mobile" value={form.phone} />
                    </div>
                    <div style={{
                        marginTop: '25px', padding: '15px', background: 'rgba(232,230,227,0.03)',
                        borderRadius: '8px', border: '1px solid rgba(232,230,227,0.05)'
                    }}>
                        <div style={{ fontSize: '9px', fontWeight: '900', color: 'var(--gold)', marginBottom: '10px' }}>LOCAL EMERGENCY NODE</div>
                        <div className="dossier-grid">
                            <MetadataItem label="Contact" value="Verified Next of Kin" />
                            <MetadataItem label="Status" value="SECURED" />
                        </div>
                    </div>
                </div>

                {/* 4. COMPLIANCE & REGISTRY */}
                <div className="dossier-card">
                    <div className="dossier-section-title">
                        <ShieldCheck size={18} /> COMPLIANCE & REGISTRY
                    </div>
                    <div className="dossier-grid">
                        <MetadataItem label="Passport No" value={form.passport_no} />
                        <MetadataItem label="Visa UID" value={form.visa_uid} />
                        <MetadataItem label="Legal Status" value="COMPLIANT" style={{ color: '#10b981' }} />
                        <MetadataItem label="Auth Expiry" value="PERPETUAL" />
                    </div>
                    <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '10px', fontWeight: '900' }}>
                            <BadgeCheck size={16} /> LABOR PERMIT VERIFIED
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '10px', fontWeight: '900' }}>
                            <BadgeCheck size={16} /> VISA STATUS SECURED
                        </div>
                    </div>
                </div>
            </PortfolioGrid>

            {/* Photo & Profile Control */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '180px', height: '180px', borderRadius: '24px',
                        background: preview ? `url(${preview}) center/cover` : '#000',
                        border: '2px solid var(--gold)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {!preview && <User size={60} color="var(--gold)" />}
                    </div>
                    <label htmlFor="photo-upload" style={{
                        position: 'absolute', bottom: '-15px', right: '-15px',
                        width: '40px', height: '40px', background: 'var(--gold)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: '3px solid #000', color: '#000'
                    }}>
                        <Camera size={20} />
                    </label>
                    <input id="photo-upload" type="file" hidden onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setPhoto(file);
                            setPreview(URL.createObjectURL(file));
                        }
                    }} />
                </div>

                <div style={{ flex: 1 }}>
                    <div className="dossier-card" style={{ padding: '40px' }}>
                        <div className="dossier-section-title"><Activity size={18} /> SYSTEM AUTHENTICATION</div>
                        <div className="dossier-grid">
                            <MetadataItem label="Primary Email" value={form.email} />
                            <MetadataItem label="Account Type" value="SUPERUSER / ARCHITECT" />
                            <MetadataItem label="Last Login" value={new Date().toLocaleString()} />
                        </div>
                        <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                            <PortfolioButton variant="outline" onClick={() => setActiveTab('security')}>
                                <Key size={16} style={{ marginRight: '10px' }} /> ROTATE SECURITY KEYS
                            </PortfolioButton>
                            <PortfolioButton variant="danger" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                <LogOut size={16} style={{ marginRight: '10px' }} /> TERMINATE SESSION
                            </PortfolioButton>
                        </div>
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

const MetadataItem = ({ label, value, style = {} }) => (
    <div className="metadata-box">
        <span className="metadata-label">{label}</span>
        <span className="metadata-value" style={style}>{value || 'NOT SPECIFIED'}</span>
    </div>
);

export default UserProfilePage;
