import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import {
    Users, UserPlus, Search, Filter,
    MoreVertical, ShieldCheck, Mail, Phone,
    Briefcase, Calendar, DollarSign
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
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>WORKFORCE</h1>
                    <p style={{ color: '#94a3b8' }}>Human Capital Management & Payroll</p>
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
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, ID or role..."
                    style={{ paddingLeft: '45px', height: '50px' }}
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
                    <EmployeeCard key={emp.id} employee={emp} />
                ))}
            </div>
        </div>
    );
};

const EmployeeCard = ({ employee }) => (
    <GlassCard style={{ padding: '25px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#64748b' }}>
            <MoreVertical size={18} cursor="pointer" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #b08d5733, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(176,141,87,0.2)'
            }}>
                <Users size={28} color="#b08d57" />
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{employee.full_name}</h3>
                <div style={{ color: '#b08d57', fontSize: '12px', fontWeight: '700' }}>{employee.role}</div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <InfoItem icon={<ShieldCheck size={14} />} label="ID" value={employee.employee_id} />
            <InfoItem icon={<Briefcase size={14} />} label="Dept" value={employee.department || '--'} />
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <ActionIcon icon={<Mail size={16} />} />
                <ActionIcon icon={<Phone size={16} />} />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
                Since {new Date(employee.date_joined).toLocaleDateString()}
            </div>
        </div>
    </GlassCard>
);

const InfoItem = ({ icon, label, value }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {icon} {label}
        </div>
        <div style={{ fontWeight: '700', fontSize: '14px' }}>{value}</div>
    </div>
);

const ActionIcon = ({ icon }) => (
    <div style={{
        padding: '8px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
        color: '#64748b',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        {icon}
    </div>
);

const CircleButton = ({ icon, label, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }}
    >
        <div
            className="glass-card"
            style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(176,141,87,0.2)',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b08d57';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(176,141,87,0.3)';
                e.currentTarget.style.background = 'rgba(176,141,87,0.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(176,141,87,0.2)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
        >
            {icon}
        </div>
        <span style={{ fontSize: '11px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
);

export default EmployeeDirectory;
