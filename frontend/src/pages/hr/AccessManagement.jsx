import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ArrowLeft, Check, ShieldCheck, User,
    ShieldAlert, BadgeCheck, Zap, MoreHorizontal,
    Search as SearchIcon, X, CheckSquare, ChevronRight
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioCard,
    PortfolioButton, PortfolioGrid, PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import { motion, AnimatePresence } from 'framer-motion';

const AccessManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const modules = [
        'Employees', 'HR Management', 'Job Cards', 'Bookings', 'Stock',
        'Payroll', 'Attendance', 'Invoices', 'Dashboard', 'Finance',
        'Leads', 'Projects', 'Ceramic/PPF', 'Pick & Drop', 'Masters', 'Reports',
        'Paint Control', 'Workshop', 'Service Advisor'
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/auth/users/');
            // Users endpoint returns users with nested hr_profile
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setLoading(false);
        }
    };

    const fetchPermissions = async (employeeId) => {
        setLoadingPermissions(true);
        try {
            const res = await api.get(`/api/hr/permissions/?employee=${employeeId}`);
            const existingPermissions = res.data.results || res.data;

            // Map standard modules to existing permissions or create default structure
            const mapped = modules.map(mod => {
                const existing = existingPermissions.find(p => p.module_name === mod);
                return existing || {
                    module_name: mod,
                    can_view: false,
                    can_create: false,
                    can_edit: false,
                    can_delete: false,
                    // employee ID will be added during save
                };
            });
            setPermissions(mapped);
        } catch (err) {
            console.error('Error fetching permissions:', err);
            setMessage({ type: 'error', text: 'Failed to load permissions' });
        } finally {
            setLoadingPermissions(false);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (user.hr_profile) {
            fetchPermissions(user.hr_profile.id);
        } else {
            setPermissions([]);
        }
    };

    const togglePermission = (index, field) => {
        const updated = [...permissions];
        updated[index][field] = !updated[index][field];
        setPermissions(updated);
    };

    const activateAll = () => {
        const updated = permissions.map(p => ({
            ...p,
            can_view: true,
            can_create: true,
            can_edit: true,
            can_delete: true
        }));
        setPermissions(updated);
        setMessage({ type: 'info', text: 'All modules staged for activation' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    };

    const savePermissions = async () => {
        if (!selectedUser?.hr_profile) {
            alert('This user has no HR Profile. Please create one in Personnel Directory first.');
            return;
        }

        setSaving(true);
        try {
            const promises = permissions.map(perm => {
                // If it has an ID, it's an existing record -> PUT
                if (perm.id) {
                    return api.put(`/api/hr/permissions/${perm.id}/`, perm);
                }
                // If no ID, but has any true permission -> POST
                // Optimization: Don't save if all false and new (optional, but cleaner db)
                else if (perm.can_view || perm.can_create || perm.can_edit || perm.can_delete) {
                    return api.post(`/api/hr/permissions/`, {
                        ...perm,
                        employee: selectedUser.hr_profile.id
                    });
                }
                return Promise.resolve(); // Skip empty new permissions
            });

            await Promise.all(promises);

            setMessage({ type: 'success', text: 'Permissions synced successfully' });
            fetchPermissions(selectedUser.hr_profile.id); // Refresh to get IDs
        } catch (err) {
            console.error('Save error:', err);
            setMessage({ type: 'error', text: 'Failed to sync permissions' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.first_name + ' ' + u.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px', fontWeight: '800', letterSpacing: '2px' }}>INITIALIZING SECURITY PROTOCOLS...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="HR Management / Security">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Global access control and module clearance levels for the Elite Shine enterprise.">
                    ACCESS COMMAND
                </PortfolioTitle>
                <ShieldCheck size={48} color="var(--gold)" strokeWidth={1} style={{ opacity: 0.5 }} />
            </div>

            {!selectedUser ? (
                <>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '50px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <SearchIcon size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="text"
                                placeholder="Search personnel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '15px 15px 15px 45px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <PortfolioGrid columns="repeat(auto-fill, minmax(340px, 1fr))">
                        {filteredUsers.map(user => (
                            <PortfolioCard
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                style={{
                                    padding: '30px',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="workflow-card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: 'rgba(176,141,87,0.1)', border: '1px solid rgba(176,141,87,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--gold)', fontWeight: '900', fontSize: '20px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                    }}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--cream)', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                                            {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                            <div style={{
                                                fontSize: '9px', padding: '4px 10px', borderRadius: '20px',
                                                background: user.hr_profile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                color: user.hr_profile ? '#10b981' : '#f43f5e',
                                                border: `1px solid ${user.hr_profile ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                                fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}>
                                                <div className={`status-pulse ${user.hr_profile ? '' : 'active'}`} style={{ background: user.hr_profile ? '#10b981' : '#f43f5e', width: '5px', height: '5px' }} />
                                                {user.hr_profile ? 'ACTIVE' : 'INACTIVE'}
                                            </div>
                                            {user.is_superuser && (
                                                <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>[ SUPERUSER ]</span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                                </div>
                            </PortfolioCard>
                        ))}
                    </PortfolioGrid>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                        <PortfolioButton variant="secondary" onClick={() => setSelectedUser(null)}>
                            <ArrowLeft size={16} style={{ marginRight: '10px' }} /> BACK TO DIRECTORY
                        </PortfolioButton>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <PortfolioButton variant="secondary" onClick={activateAll}>
                                <CheckSquare size={16} style={{ marginRight: '10px' }} /> FULL CLEARANCE
                            </PortfolioButton>
                            <PortfolioButton onClick={savePermissions} disabled={saving}>
                                {saving ? 'SYNCING...' : <><Zap size={16} style={{ marginRight: '10px' }} /> UPDATE CLEARANCE</>}
                            </PortfolioButton>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '80px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px',
                            background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--gold)', fontSize: '32px'
                        }}>
                            {selectedUser.username[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '42px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: 0 }}>
                                {selectedUser.first_name ? `${selectedUser.first_name} ${selectedUser.last_name}` : selectedUser.username}
                            </h2>
                            <p style={{ color: 'rgba(232, 230, 227, 0.4)', marginTop: '8px', letterSpacing: '1px' }}>
                                SYSTEM ID: {selectedUser.id} // {selectedUser.email || 'NO_EMAIL_REGISTERED'}
                            </p>
                        </div>
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '15px 25px', borderRadius: '12px', marginBottom: '40px',
                            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : message.type === 'info' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.type === 'success' ? '#22c55e44' : message.type === 'info' ? '#eab30844' : '#ef444444'}`,
                            color: message.type === 'success' ? '#22c55e' : message.type === 'info' ? '#eab308' : '#ef4444',
                            fontSize: '14px',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <Check size={16} /> {message.text}
                        </div>
                    )}

                    {!selectedUser.hr_profile ? (
                        <div style={{ padding: '80px', textAlign: 'center', border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.02)' }}>
                            <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <h3 style={{ color: 'var(--cream)', marginBottom: '10px' }}>Account Not Activated</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto 30px' }}>
                                This system user does not have an HR Profile linked. Activation is required before assigning module-level permissions.
                            </p>
                            {/* Navigation to Employee Page or similar could go here */}
                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Please configure in Personnel Directory</div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '24px',
                            padding: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}>
                            {loadingPermissions && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gold)' }}>
                                    Retrieving Security Protocols...
                                </div>
                            )}

                            {!loadingPermissions && (
                                <>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr repeat(4, 100px)',
                                        padding: '15px 30px',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '16px',
                                        fontSize: '9px',
                                        color: 'var(--gold)',
                                        fontWeight: '900',
                                        letterSpacing: '2px'
                                    }}>
                                        <span>SYSTEM MODULE</span>
                                        <span style={{ textAlign: 'center' }}>VIEW</span>
                                        <span style={{ textAlign: 'center' }}>CREATE</span>
                                        <span style={{ textAlign: 'center' }}>EDIT</span>
                                        <span style={{ textAlign: 'center' }}>DELETE</span>
                                    </div>
                                    {permissions.map((perm, idx) => (
                                        <div key={perm.module_name} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr repeat(4, 100px)',
                                            padding: '20px 30px',
                                            background: 'rgba(255,255,255,0.01)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.02)',
                                            alignItems: 'center',
                                            transition: 'all 0.3s'
                                        }} className="permission-row-hover">
                                            <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: '16px', letterSpacing: '0.5px' }}>{perm.module_name.toUpperCase()}</span>
                                            {['can_view', 'can_create', 'can_edit', 'can_delete'].map(key => (
                                                <div key={key} style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => togglePermission(idx, key)}
                                                        style={{
                                                            width: '28px', height: '28px', borderRadius: '8px',
                                                            background: perm[key] ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                                                            border: `1.5px solid ${perm[key] ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                                            boxShadow: perm[key] ? '0 5px 15px rgba(176,141,87,0.3)' : 'none'
                                                        }}
                                                    >
                                                        {perm[key] && <Check size={16} color="#000" strokeWidth={3} />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </PortfolioPage>
    );
};

export default AccessManagement;
