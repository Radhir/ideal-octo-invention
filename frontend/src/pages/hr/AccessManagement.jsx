
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, User, Lock, Save, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AccessManagement = () => {
    const { user: currentUser } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const modules = [
        'Inventory', 'Job Cards', 'Leads', 'Finance', 'HR',
        'Projects', 'Risk Management', 'Ceramic/PPF', 'Invoices',
        'Staff Roster', 'Attendance'
    ];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE}/hr/api/employees/`);
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
                    await axios.put(`${API_BASE}/hr/api/permissions/${perm.id}/`, perm);
                } else {
                    await axios.post(`${API_BASE}/hr/api/permissions/`, {
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
        <div className="p-6 bg-black min-h-screen text-gray-200">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-gold" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent">
                    Elite Security & Access Control
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee List */}
                <div className="bg-gray-900 border border-gold/20 rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-4 bg-gold/10 border-b border-gold/20 flex items-center justify-between">
                        <span className="font-semibold text-gold">Employee Directory</span>
                        <User className="w-5 h-5 text-gold" />
                    </div>
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        {employees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => handleEmployeeSelect(emp)}
                                className={`p-4 border-b border-gray-800 cursor-pointer transition-all hover:bg-gold/5 ${selectedEmployee?.id === emp.id ? 'bg-gold/10 border-l-4 border-l-gold' : ''}`}
                            >
                                <div className="font-medium">{emp.full_name}</div>
                                <div className="text-sm text-gray-500">{emp.role} • {emp.employee_id}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Permission Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedEmployee ? (
                        <div className="bg-gray-900 border border-gold/20 rounded-xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gold">Permission Matrix: {selectedEmployee.full_name}</h2>
                                    <p className="text-sm text-gray-400">Configure granular sector access for this operative.</p>
                                </div>
                                <button
                                    onClick={savePermissions}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Encrypting...' : 'Save Protocols'}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    {message.text}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-800">
                                            <th className="py-3 text-gold">Module Sector</th>
                                            <th className="py-3 text-center">View</th>
                                            <th className="py-3 text-center">Create</th>
                                            <th className="py-3 text-center">Edit</th>
                                            <th className="py-3 text-center">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((perm, idx) => (
                                            <tr key={perm.module_name} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                                                <td className="py-4 font-medium">{perm.module_name}</td>
                                                {['can_view', 'can_create', 'can_edit', 'can_delete'].map(field => (
                                                    <td key={field} className="py-4 text-center">
                                                        <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={perm[field]}
                                                                onChange={() => togglePermission(idx, field)}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
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
                        <div className="h-full flex flex-col items-center justify-center bg-gray-900 border border-gold/20 rounded-xl p-12 text-center">
                            <Lock className="w-16 h-16 text-gold/20 mb-4" />
                            <h2 className="text-2xl font-bold text-gold/40">Secured Access Control</h2>
                            <p className="text-gray-500 mt-2">Select an employee from the directory to configure their operational permissions.</p>
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
