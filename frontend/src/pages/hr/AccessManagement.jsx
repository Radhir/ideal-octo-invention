
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Shield, User, Lock, Save, CheckCircle, XCircle } from 'lucide-react';
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
        // Map existing permissions or create defaults
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
            setMessage({ type: 'success', text: 'Permissions updated successfully!' });
            fetchEmployees(); // Refresh data
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update permissions.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (loading) return <div className="p-8 text-gold">Loading Sector Access Protocols...</div>;

    return (
        <div style={{ padding: '24px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>
                    <Shield size={32} color="var(--gold)" />
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Security Operations</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', margin: 0 }}>
                        ACCESS <span style={{ color: 'var(--gold)' }}>CONTROL</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee List */}
                <div style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                    <div style={{ padding: '20px', background: 'var(--bg-glass)', borderBottom: '1.5px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase' }}>Personnel Nodes</span>
                        <User size={20} color="var(--gold)" />
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="custom-scrollbar">
                        {employees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => handleEmployeeSelect(emp)}
                                style={{
                                    padding: '16px',
                                    borderBottom: '1.5px solid var(--gold-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: selectedEmployee?.id === emp.id ? 'var(--input-bg)' : 'transparent',
                                    borderLeft: selectedEmployee?.id === emp.id ? '6px solid var(--gold)' : 'none'
                                }}
                                onMouseOver={(e) => selectedEmployee?.id !== emp.id && (e.currentTarget.style.background = 'var(--input-bg)')}
                                onMouseOut={(e) => selectedEmployee?.id !== emp.id && (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '15px' }}>{emp.full_name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '800' }}>{emp.role} • {emp.employee_id}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Permission Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedEmployee ? (
                        <div style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Protocols: <span style={{ color: 'var(--gold)' }}>{selectedEmployee.full_name}</span></h2>
                                    <p style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Configure granular operational clearance</p>
                                </div>
                                <button
                                    onClick={savePermissions}
                                    disabled={saving}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 30px',
                                        background: 'var(--gold)',
                                        color: '#000',
                                        fontWeight: '900',
                                        borderRadius: '8px',
                                        border: '1.5px solid var(--gold-border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        opacity: saving ? 0.5 : 1,
                                        textTransform: 'uppercase',
                                        fontSize: '11px',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <Save size={18} />
                                    {saving ? 'ENCRYPTING...' : 'SAVE PROTOCOLS'}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    {message.text}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr style={{ borderBottom: '1.5px solid var(--gold-border)', color: 'var(--gold)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>
                                            <th style={{ padding: '15px 0' }}>Module Sector</th>
                                            <th style={{ padding: '15px 0', textAlign: 'center' }}>View</th>
                                            <th style={{ padding: '15px 0', textAlign: 'center' }}>Create</th>
                                            <th style={{ padding: '15px 0', textAlign: 'center' }}>Edit</th>
                                            <th style={{ padding: '15px 0', textAlign: 'center' }}>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((perm, idx) => (
                                            <tr key={perm.module_name} style={{ borderBottom: '1.5px solid var(--gold-border)', transition: 'all 0.3s' }}>
                                                <td style={{ padding: '16px 0', fontWeight: '900', color: 'var(--text-primary)', fontSize: '14px' }}>{perm.module_name}</td>
                                                {['can_view', 'can_create', 'can_edit', 'can_delete'].map(field => (
                                                    <td key={field} style={{ padding: '16px 0', textAlign: 'center' }}>
                                                        <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={perm[field]}
                                                                onChange={() => togglePermission(idx, field)}
                                                            />
                                                            <div className="w-10 h-5 bg-[var(--text-muted)] opacity-30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:opacity-100"></div>
                                                        </label>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            height: '100%',
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            itemsCenter: 'center',
                            justifyContent: 'center',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '48px',
                            textAlign: 'center',
                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ background: 'var(--gold-glow)', padding: '30px', borderRadius: '50%', marginBottom: '24px', border: '1.5px solid var(--gold-border)' }}>
                                <Lock size={64} color="var(--gold)" style={{ opacity: 0.8 }} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Clearance</h2>
                            <p style={{ color: 'var(--gold)', marginTop: '8px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase' }}>Select an operative to modify clearance levels</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(176, 141, 87, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(176, 141, 87, 0.4); }
                .text-gold { color: #b08d57; }
                .bg-gold { background-color: #b08d57; }
                .border-gold { border-color: #b08d57; }
            `}</style>
        </div>
    );
};

export default AccessManagement;
