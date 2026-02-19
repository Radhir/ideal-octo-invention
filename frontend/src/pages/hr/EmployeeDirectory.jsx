import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Users, UserPlus, Mail, Phone, Briefcase,
    Shield, Search, Filter, MoreVertical,
    Activity, Globe, Fingerprint, Award, ArrowLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioSectionTitle,
    PortfolioInput,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const EmployeeDirectory = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredEmployees = activeEmployees.filter(emp =>
    (emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = [
        { label: 'ACTIVE NODES', value: activeEmployees.length, color: 'var(--purple)' },
        { label: 'SECTORS', value: [...new Set(activeEmployees.map(e => e.department))].length, color: 'var(--blue)' },
        { label: 'COMPLIANCE', value: '100%', color: 'var(--gold)' }
    ];

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Syncing Personnel...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="HR / PERSONNEL COMMAND">
            {!selectedEmployee ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                        <PortfolioTitle subtitle="Orchestration of digital identities, operational vectors, and production roles.">
                            Operative<br />Roster
                        </PortfolioTitle>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <PortfolioButton variant="glass" onClick={() => navigate('/hr/register')}>
                                <UserPlus size={16} /> PROVISION.node
                            </PortfolioButton>
                        </div>
                    </div>

                    <PortfolioStats stats={stats} />

                    <div style={{ marginBottom: '60px', position: 'relative', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '10px 25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Search color="var(--gold)" size={20} opacity={0.5} />
                            <input
                                type="text"
                                placeholder="Search personnel vectors (Name, ID, Role, Sector)..."
                                style={{
                                    padding: '15px 0',
                                    fontSize: '15px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--cream)',
                                    width: '100%',
                                    outline: 'none',
                                    letterSpacing: '0.5px',
                                    fontWeight: '300'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', opacity: 0.4 }}>PERSONNEL.search</div>
                        </div>
                    </div>

                    <PortfolioGrid columns="repeat(auto-fill, minmax(320px, 1fr))">
                        {filteredEmployees.map((emp, idx) => (
                            <motion.div
                                key={emp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <PortfolioCard onClick={() => setSelectedEmployee(emp)} style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                                    <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '35px' }}>
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '35px',
                                                background: 'rgba(176, 141, 87, 0.08)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid rgba(176, 141, 87, 0.15)',
                                                position: 'relative',
                                                boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
                                            }}>
                                                <Fingerprint size={45} color="var(--gold)" strokeWidth={0.5} className="pulse" />
                                                <div className="status-pulse" style={{ position: 'absolute', top: '5px', right: '5px' }}></div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                                            <h3 style={{ fontSize: '24px', fontWeight: '300', color: 'var(--cream)', margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>
                                                {emp.full_name}
                                            </h3>
                                            <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '3px' }}>
                                                {emp.role?.toUpperCase() || 'GENERAL OPERATIVE'}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '25px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>SECTOR</div>
                                                <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{emp.department?.toUpperCase() || 'GENERAL'}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>ID.NODE</div>
                                                <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{emp.employee_id}</div>
                                            </div>
                                        </div>

                                        <PortfolioButton variant="glass" style={{ width: '100%', fontSize: '10px', marginTop: '10px' }} onClick={() => setSelectedEmployee(emp)}>
                                            ACCESS.dossier <ChevronRight size={14} style={{ marginLeft: '10px' }} />
                                        </PortfolioButton>
                                    </div>
                                </PortfolioCard>
                            </motion.div>
                        ))}
                    </PortfolioGrid>
                </>
            ) : (
                <div style={{ maxWidth: '1200px' }}>
                    <PortfolioBackButton onClick={() => setSelectedEmployee(null)} label="RETURN TO COMMAND" />

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '80px', marginTop: '60px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: '50px',
                                background: 'rgba(176, 141, 87, 0.05)',
                                border: '1px solid rgba(176, 141, 87, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.1 }} />
                                <Fingerprint size={120} color="var(--gold)" strokeWidth={0.3} className="pulse" style={{ position: 'relative', zIndex: 1 }} />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'radial-gradient(circle, rgba(176, 141, 87, 0.15) 0%, transparent 70%)',
                                    zIndex: 0
                                }}></div>
                            </div>

                            <PortfolioCard style={{ padding: '30px', background: 'rgba(0,0,0,0.3)' }}>
                                <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '15px', opacity: 0.5 }}>OPERATIONAL STATUS</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div className="status-pulse"></div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '800', letterSpacing: '1px' }}>ACTIVE NODE</div>
                                </div>
                                <div style={{ marginTop: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.6' }}>
                                    Personnel is currently authorized and active within the operational vector.
                                </div>
                            </PortfolioCard>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '60px' }}>
                                <PortfolioTitle subtitle={`${selectedEmployee.role?.toUpperCase() || 'OPERATIVE'} // ${selectedEmployee.department?.toUpperCase() || 'GENERAL OPERATIONS'}`}>
                                    {selectedEmployee.full_name}
                                </PortfolioTitle>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', marginBottom: '80px' }}>
                                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', position: 'relative' }}>
                                    <Mail size={20} color="var(--gold)" style={{ marginBottom: '20px', opacity: 0.4 }} />
                                    <div style={{ fontSize: '8px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '2px', opacity: 0.5 }}>Network Address</div>
                                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{selectedEmployee.email || 'UNIDENTIFIED'}</div>
                                </div>
                                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', position: 'relative' }}>
                                    <Phone size={20} color="var(--gold)" style={{ marginBottom: '20px', opacity: 0.4 }} />
                                    <div style={{ fontSize: '8px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '2px', opacity: 0.5 }}>Comms Line</div>
                                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{selectedEmployee.uae_mobile || selectedEmployee.home_mobile || 'UNIDENTIFIED'}</div>
                                </div>
                                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', position: 'relative' }}>
                                    <Briefcase size={20} color="var(--gold)" style={{ marginBottom: '20px', opacity: 0.4 }} />
                                    <div style={{ fontSize: '8px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '2px', opacity: 0.5 }}>Index Code</div>
                                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{selectedEmployee.employee_id}</div>
                                </div>
                                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', position: 'relative' }}>
                                    <Award size={20} color="var(--gold)" style={{ marginBottom: '20px', opacity: 0.4 }} />
                                    <div style={{ fontSize: '8px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '2px', opacity: 0.5 }}>Joined Pulse</div>
                                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{new Date(selectedEmployee.date_joined).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '30px' }}>
                                <PortfolioButton variant="glass" style={{ flex: 1 }} onClick={() => navigate(`/hr/employee/${selectedEmployee.id}/edit`)}>
                                    MODIFY.profiling
                                </PortfolioButton>
                                <PortfolioButton variant="gold" style={{ flex: 1 }} onClick={() => navigate(`/hr/payroll?employee=${selectedEmployee.id}`)}>
                                    FISCAL.intelligence <ArrowRight size={14} style={{ marginLeft: '10px' }} />
                                </PortfolioButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer style={{ marginTop: '100px', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 230, 227, 0.05)', paddingTop: '40px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    PERSONNEL OS v2.4 // ELITE SHINE ERP
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Shield size={16} color="rgba(232, 230, 227, 0.2)" />
                    <Activity size={16} color="rgba(232, 230, 227, 0.2)" />
                    <Fingerprint size={16} color="rgba(232, 230, 227, 0.2)" />
                </div>
            </footer>
        </PortfolioPage>
    );
};

export default EmployeeDirectory;
