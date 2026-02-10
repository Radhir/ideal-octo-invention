import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import {
    Users, UserPlus, Search, Filter,
    MoreVertical, ShieldCheck, Mail, Phone,
    Briefcase, Calendar, DollarSign, Eye, Edit, XCircle, FileText
} from 'lucide-react';

const EmployeeDirectory = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--gold)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>WORKFORCE</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Human Capital Management & Payroll</p>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <CircleButton
                        icon={<DollarSign size={18} />}
                        label="Payroll"
                        onClick={() => navigate('/hr/payroll')}
                    />
                    <CircleButton
                        icon={<Calendar size={18} />}
                        label="Roster"
                        onClick={() => navigate('/hr/roster')}
                    />
                    <CircleButton
                        icon={<ShieldCheck size={18} />}
                        label="Policies"
                        onClick={() => navigate('/hr/rules')}
                    />
                    <CircleButton
                        icon={<Users size={18} />}
                        label="Logs"
                        onClick={() => navigate('/hr/attendance')}
                    />
                    <CircleButton
                        icon={<Users size={18} />}
                        label="Teams"
                        onClick={() => navigate('/hr/teams')}
                    />
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/hr/register')}
                        style={{ height: '50px', padding: '0 25px', borderRadius: '25px', fontSize: '12px', fontWeight: '800', marginLeft: '10px' }}
                    >
                        <UserPlus size={16} /> REGISTER
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, ID or role..."
                    style={{ paddingLeft: '45px', height: '50px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Loading Workforce...</p>
                ) : filteredEmployees.length === 0 ? (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No records found.</p>
                ) : filteredEmployees.map(emp => (
                    <EmployeeCard key={emp.id} employee={emp} navigate={navigate} />
                ))}
            </div>
        </div>
    );
};

const EmployeeCard = ({ employee, navigate }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const phoneNumber = employee.uae_mobile || employee.home_mobile || 'N/A';
    const email = employee.email || `${employee.full_name.replace(/\s/g, '.').toLowerCase()}@eliteshineuae.com`;

    const menuActions = [
        { icon: <Eye size={14} />, label: 'View Profile', onClick: () => navigate(`/hr/employee/${employee.id}`) },
        { icon: <Edit size={14} />, label: 'Edit Details', onClick: () => navigate(`/hr/employee/${employee.id}/edit`) },
        { icon: <FileText size={14} />, label: 'Salary Slip', onClick: () => navigate(`/hr/payroll?employee=${employee.id}`) },
        { icon: <XCircle size={14} />, label: 'Deactivate', onClick: () => alert(`Deactivate ${employee.full_name}?`), danger: true },
    ];

    return (
        <GlassCard style={{ padding: '25px', position: 'relative' }}>
            {/* 3-Dot Menu */}
            <div ref={menuRef} style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <div
                    style={{ color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <MoreVertical size={18} />
                </div>
                {showMenu && (
                    <div style={{
                        position: 'absolute', top: '30px', right: '0', zIndex: 50,
                        background: 'var(--bg-secondary)', border: '1.5px solid var(--gold-border)',
                        borderRadius: '12px', padding: '8px 0', minWidth: '180px',
                        backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        {menuActions.map((action, i) => (
                            <div
                                key={i}
                                onClick={() => { action.onClick(); setShowMenu(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 16px', cursor: 'pointer',
                                    color: action.danger ? '#ef4444' : 'var(--text-primary)',
                                    fontSize: '13px', fontWeight: '600',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                {action.icon} {action.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '15px',
                    background: 'var(--input-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid var(--gold-border)'
                }}>
                    <Users size={28} color="var(--gold)" />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{employee.full_name}</h3>
                    <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '700' }}>{employee.role}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <InfoItem icon={<ShieldCheck size={14} />} label="ID" value={employee.employee_id} />
                <InfoItem icon={<Briefcase size={14} />} label="Dept" value={employee.department || '--'} />
            </div>

            {/* Expandable Info Banners */}
            {showEmail && (
                <div style={{
                    background: 'rgba(176,141,87,0.08)', border: '1px solid rgba(176,141,87,0.2)',
                    borderRadius: '8px', padding: '8px 12px', marginBottom: '10px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <a href={`mailto:${email}`} style={{ color: '#b08d57', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>{email}</a>
                    <span onClick={() => setShowEmail(false)} style={{ color: '#64748b', cursor: 'pointer', fontSize: '12px' }}>✕</span>
                </div>
            )}
            {showPhone && (
                <div style={{
                    background: 'rgba(176,141,87,0.08)', border: '1px solid rgba(176,141,87,0.2)',
                    borderRadius: '8px', padding: '8px 12px', marginBottom: '10px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <a href={`tel:${phoneNumber}`} style={{ color: '#b08d57', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>{phoneNumber}</a>
                    <span onClick={() => setShowPhone(false)} style={{ color: '#64748b', cursor: 'pointer', fontSize: '12px' }}>✕</span>
                </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <ActionIcon icon={<Mail size={16} />} onClick={() => setShowEmail(!showEmail)} active={showEmail} />
                    <ActionIcon icon={<Phone size={16} />} onClick={() => setShowPhone(!showPhone)} active={showPhone} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Since {new Date(employee.date_joined).toLocaleDateString()}
                </div>
            </div>
        </GlassCard>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>
            {icon} {label}
        </div>
        <div style={{ fontWeight: '900', fontSize: '15px', color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

const ActionIcon = ({ icon, onClick, active }) => (
    <div
        onClick={onClick}
        style={{
            padding: '8px', borderRadius: '8px',
            background: active ? 'var(--gold-glow)' : 'var(--input-bg)',
            color: active ? 'var(--gold)' : 'var(--text-secondary)',
            cursor: 'pointer',
            border: active ? '1px solid var(--gold-border)' : '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
        {icon}
    </div>
);

const CircleButton = ({ icon, label, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
        }}
    >
        <div
            className="glass-card"
            style={{
                width: '60px', height: '60px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--gold-border)',
                background: 'var(--bg-glass)', color: 'var(--text-primary)',
                transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.boxShadow = '0 0 15px var(--gold-glow)';
                e.currentTarget.style.background = 'var(--input-bg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'var(--bg-glass)';
            }}
        >
            {icon}
        </div>
        <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
);

export default EmployeeDirectory;
