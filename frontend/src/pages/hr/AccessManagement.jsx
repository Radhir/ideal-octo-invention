
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AccessManagement = () => {
    const { user: currentUser } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const modules = [
        'Employees', 'HR Management', 'Job Cards', 'Bookings', 'Stock',
        'Payroll', 'Attendance', 'Invoices', 'Dashboard', 'Finance',
        'Leads', 'Projects', 'Ceramic/PPF', 'Pick & Drop'
    ];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleEmployeeSelect = (emp) => {
        setSelectedEmployee(emp);
        const existing = emp.module_permissions || [];
        const mapped = modules.map(mod => {
            const perm = existing.find(p => p.module_name === mod);
            return perm || {
                module_name: mod,
                can_view: false,
                can_create: false,
                can_edit: false,
                can_delete: false,
                employee: emp.id
            };
        });
        setPermissions(mapped);
    };

    const togglePermission = (index, field) => {
        const updated = [...permissions];
        updated[index][field] = !updated[index][field];
        setPermissions(updated);
    };

    const savePermissions = async () => {
        setSaving(true);
        try {
            for (const perm of permissions) {
                if (perm.id) {
                    await api.put(`/hr/api/permissions/${perm.id}/`, perm);
                } else {
                    await api.post(`/hr/api/permissions/`, {
                        ...perm,
                        employee: selectedEmployee.id
                    });
                }
            }
            setMessage({ type: 'success', text: 'Saved successfully' });
            fetchEmployees();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Save failed' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 2000);
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
                marginBottom: '80px'
            }}>
                <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '300', letterSpacing: '1px' }}>
                    Team Management
                </div>
                <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
            </div>

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
                ACCESS<br />CONTROL
            </h1>

            {!selectedEmployee ? (
                <>
                    {/* Employee Selection Pills */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        maxWidth: '800px',
                        marginBottom: '60px'
                    }}>
                        {employees.map(emp => (
                            <button
                                key={emp.id}
                                onClick={() => handleEmployeeSelect(emp)}
                                style={{
                                    padding: '18px 35px',
                                    background: 'transparent',
                                    border: '1.5px solid var(--cream)',
                                    borderRadius: '50px',
                                    color: 'var(--cream)',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'var(--cream)';
                                    e.target.style.color = '#0a0a0a';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--cream)';
                                }}
                            >
                                {emp.full_name}
                            </button>
                        ))}
                    </div>

                    {/* Subtitle */}
                    <p style={{
                        color: 'rgba(232, 230, 227, 0.6)',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        maxWidth: '500px',
                        fontWeight: '300'
                    }}>
                        Select a team member to configure their module access permissions and operational clearance levels.
                    </p>
                </>
            ) : (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => setSelectedEmployee(null)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--cream)';
                            e.target.style.color = '#0a0a0a';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--cream)';
                        }}
                    >
                        ← Back to team
                    </button>

                    {/* Employee Name */}
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedEmployee.full_name}
                    </h2>

                    {/* Success Message */}
                    {message.text && (
                        <div style={{
                            padding: '15px 30px',
                            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                            borderRadius: '50px',
                            color: message.type === 'success' ? '#22c55e' : '#ef4444',
                            fontSize: '14px',
                            marginBottom: '40px',
                            width: 'fit-content'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {/* Permissions Grid */}
                    <div style={{ display: 'grid', gap: '15px', maxWidth: '900px' }}>
                        {permissions.map((perm, idx) => (
                            <div
                                key={perm.module_name}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '200px 1fr',
                                    alignItems: 'center',
                                    padding: '25px 0',
                                    borderBottom: '1px solid rgba(232, 230, 227, 0.1)'
                                }}
                            >
                                <div style={{
                                    color: 'var(--cream)',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    fontFamily: 'var(--font-serif)'
                                }}>
                                    {perm.module_name}
                                </div>

                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {[
                                        { key: 'can_view', label: 'View' },
                                        { key: 'can_create', label: 'Create' },
                                        { key: 'can_edit', label: 'Edit' },
                                        { key: 'can_delete', label: 'Delete' }
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => togglePermission(idx, key)}
                                            style={{
                                                padding: '10px 25px',
                                                background: perm[key] ? 'var(--cream)' : 'transparent',
                                                border: '1px solid var(--cream)',
                                                borderRadius: '50px',
                                                color: perm[key] ? '#0a0a0a' : 'var(--cream)',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontWeight: perm[key] ? '500' : '300'
                                            }}
                                        >
                                            {perm[key] && <Check size={14} />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={savePermissions}
                        disabled={saving}
                        style={{
                            marginTop: '60px',
                            padding: '18px 60px',
                            background: 'var(--cream)',
                            border: 'none',
                            borderRadius: '50px',
                            color: '#0a0a0a',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.5 : 1,
                            transition: 'all 0.3s',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => !saving && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </>
            )}

            {/* Footer */}
            <div style={{
                position: 'fixed',
                bottom: '60px',
                right: '80px',
                fontSize: '13px',
                color: 'rgba(232, 230, 227, 0.4)',
                fontWeight: '300'
            }}>
                {currentUser?.username}
            </div>
        </div>
    );
};

export default AccessManagement;
