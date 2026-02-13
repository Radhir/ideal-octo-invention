import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioButton, PortfolioCard, PortfolioGrid, PortfolioStats } from '../../components/PortfolioComponents';

const EmployeeDirectory = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

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

    const activeEmployees = employees.filter(emp => emp.is_active !== false);
    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Human Resources">
            {!selectedEmployee ? (
                <>
                    <PortfolioTitle>EMPLOYEES</PortfolioTitle>

                    <PortfolioStats stats={[
                        { value: activeEmployees.length, label: 'ACTIVE' },
                        { value: departments.length, label: 'DEPARTMENTS' },
                        { value: employees.length, label: 'TOTAL' }
                    ]} />

                    <PortfolioButton onClick={() => navigate('/hr/register')} style={{ marginBottom: '60px' }}>
                        <UserPlus size={18} style={{ display: 'inline', marginRight: '10px', marginBottom: '-3px' }} />
                        New Employee
                    </PortfolioButton>

                    <PortfolioGrid>
                        {activeEmployees.map(emp => (
                            <PortfolioCard key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%',
                                        background: 'rgba(232, 230, 227, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Users size={24} color="var(--cream)" opacity={0.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', marginBottom: '5px' }}>
                                            {emp.full_name}
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.5 }}>
                                            {emp.role || 'Employee'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '13px', opacity: 0.6 }}>
                                    {emp.employee_id} • {emp.department || 'General'}
                                </div>
                            </PortfolioCard>
                        ))}
                    </PortfolioGrid>
                </>
            ) : (
                <>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => setSelectedEmployee(null)}
                        style={{ marginBottom: '60px' }}
                    >
                        ← Back to directory
                    </PortfolioButton>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '20px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedEmployee.full_name}
                    </h2>

                    <div style={{
                        fontSize: '16px',
                        color: 'rgba(232, 230, 227, 0.7)',
                        marginBottom: '60px'
                    }}>
                        {selectedEmployee.role || 'Employee'} • {selectedEmployee.department || 'General Department'}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '60px',
                        maxWidth: '900px'
                    }}>
                        <div style={{
                            padding: '25px 30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px'
                        }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                EMPLOYEE ID
                            </div>
                            <div style={{ fontSize: '18px', color: 'var(--cream)' }}>
                                {selectedEmployee.employee_id}
                            </div>
                        </div>

                        <div style={{
                            padding: '25px 30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px'
                        }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                <Mail size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                EMAIL
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--cream)' }}>
                                {selectedEmployee.email || 'N/A'}
                            </div>
                        </div>

                        <div style={{
                            padding: '25px 30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px'
                        }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                <Phone size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                PHONE
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--cream)' }}>
                                {selectedEmployee.uae_mobile || selectedEmployee.home_mobile || 'N/A'}
                            </div>
                        </div>

                        <div style={{
                            padding: '25px 30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '15px'
                        }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                <Calendar size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                JOINED
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--cream)' }}>
                                {new Date(selectedEmployee.date_joined).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <PortfolioButton onClick={() => navigate(`/hr/employee/${selectedEmployee.id}/edit`)}>
                            Edit Details
                        </PortfolioButton>
                        <PortfolioButton variant="secondary" onClick={() => navigate(`/hr/payroll?employee=${selectedEmployee.id}`)}>
                            View Payroll
                        </PortfolioButton>
                    </div>
                </>
            )}
        </PortfolioPage>
    );
};

export default EmployeeDirectory;
