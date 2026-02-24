import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FileText, Download, AlertCircle, CheckCircle, DollarSign, IdCard, Users, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PortfolioPage, PortfolioTitle, PortfolioStats, PortfolioGrid, PortfolioCard, PortfolioSectionTitle } from '../../components/PortfolioComponents';

const HRHub = () => {
    const [slips, setSlips] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHRData();
    }, []);

    const fetchHRData = async () => {
        setLoading(true);
        try {
            const [slipRes, docRes, warnRes] = await Promise.all([
                api.get('/api/hr/salary-slips/'),
                api.get('/api/hr/employee-documents/'),
                api.get('/api/hr/warning-letters/')
            ]);
            setSlips(slipRes.data);
            setDocuments(docRes.data);
            setWarnings(warnRes.data);
        } catch (err) {
            console.error('Error fetching HR Hub data', err);
        } finally {
            setLoading(false);
        }
    };

    const totalSalary = slips.reduce((sum, slip) => sum + parseFloat(slip.net_salary || 0), 0);
    const validDocs = documents.filter(doc => new Date(doc.expiry_date) > new Date()).length;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Human Resources">
            <PortfolioTitle subtitle="Employee documents, salary slips, and compliance records">
                HR HUB
            </PortfolioTitle>

            <div style={{ marginBottom: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <PortfolioCard
                    title="ID CARD GENERATOR"
                    subtitle="Generate industrial-grade credentials for all operatives."
                    icon={IdCard}
                    onClick={() => navigate('/hr/id-cards')}
                />
                <PortfolioCard
                    title="ACCESS MANAGEMENT"
                    subtitle="Module permissions & roles"
                    icon={<ShieldCheck size={24} />}
                    onClick={() => navigate('/hr/access')}
                />

                <PortfolioCard
                    title="EMPLOYEE DATA CENTER"
                    subtitle="comprehensive record registry"
                    icon={<FileText size={24} />}
                    onClick={() => navigate('/hr/reports/employees')}
                    variant="glass"
                />
                <PortfolioCard
                    title="HR REPORTS & ANALYTICS"
                    subtitle="Comprehensive payroll and attendance intelligence."
                    icon={FileText}
                    onClick={() => navigate('/hr/reports')}
                />
                <PortfolioCard
                    title="DEPARTMENT MASTERS"
                    subtitle="Structure operational units and cost centers."
                    icon={Users} // Reusing Users icon or import another if needed
                    onClick={() => navigate('/admin/departments')}
                />
            </div>

            <PortfolioStats stats={[
                { value: slips.length, label: 'SALARY SLIPS', color: 'var(--gold)' },
                { value: documents.length, label: 'COMPLIANCE DOCS', color: validDocs === documents.length ? 'var(--gold)' : '#f59e0b' },
                { value: warnings.length, label: 'ACTIVE WARNINGS', color: warnings.length > 0 ? '#ef4444' : 'var(--gold)' }
            ]} />

            {/* Salary Slips */}
            <PortfolioSectionTitle style={{ marginTop: '100px', marginBottom: '40px' }}>FISCAL EMOLUMENTS (SALARY SLIPS)</PortfolioSectionTitle>

            <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                {slips.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px', fontWeight: '800', fontSize: '10px' }}>
                        NO FISCAL PULSES DETECTED
                    </div>
                ) : slips.map(slip => (
                    <PortfolioCard key={slip.id} style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: 'rgba(176, 141, 87, 0.1)',
                                    border: '1px solid rgba(176, 141, 87, 0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <DollarSign size={20} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', color: 'var(--cream)', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
                                        {new Date(slip.month).toLocaleDateString([], { month: 'long', year: 'numeric' })}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase' }}>
                                        {slip.status} // SECURE
                                    </div>
                                </div>
                            </div>
                            {slip.file && (
                                <a href={slip.file} target="_blank" rel="noreferrer" style={{ color: 'rgba(232, 230, 227, 0.3)', transition: 'color 0.3s' }} className="hover-gold">
                                    <Download size={22} />
                                </a>
                            )}
                        </div>
                        <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                            <span style={{ fontSize: '16px', color: 'var(--gold)', marginRight: '10px', fontWeight: '800', verticalAlign: 'middle' }}>AED</span>
                            {parseFloat(slip.net_salary).toLocaleString()}
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>

            {/* Documents */}
            <PortfolioSectionTitle style={{ marginTop: '100px', marginBottom: '40px' }}>COMPLIANCE REPOSITORY (DOCUMENTS)</PortfolioSectionTitle>

            <PortfolioGrid columns="repeat(auto-fill, minmax(360px, 1fr))">
                {documents.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px', fontWeight: '800', fontSize: '10px' }}>
                        CLEAN REPOSITORY
                    </div>
                ) : documents.map(doc => {
                    const isValid = new Date(doc.expiry_date) > new Date();
                    return (
                        <PortfolioCard
                            key={doc.id}
                            style={{
                                padding: '35px',
                                border: `1px solid ${isValid ? 'rgba(232, 230, 227, 0.05)' : 'rgba(244, 63, 94, 0.1)'}`,
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: '25px', right: '25px',
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: isValid ? '#10b981' : '#f43f5e',
                                boxShadow: `0 0 12px ${isValid ? '#10b981' : '#f43f5e'}40`
                            }}></div>

                            <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '10px', letterSpacing: '0.5px' }}>
                                {doc.document_type}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginBottom: '30px', textTransform: 'uppercase' }}>
                                REF // {doc.document_number}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(232, 230, 227, 0.03)', paddingTop: '20px' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '700', letterSpacing: '1px' }}>
                                    EXPIRY // {new Date(doc.expiry_date).toLocaleDateString()}
                                </div>
                                {doc.file && (
                                    <a href={doc.file} target="_blank" rel="noreferrer" style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'var(--gold)',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        letterSpacing: '2px',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase'
                                    }}>
                                        <FileText size={14} /> VIEW
                                    </a>
                                )}
                            </div>
                        </PortfolioCard>
                    );
                })}
            </PortfolioGrid>

            {/* Warnings */}
            <PortfolioSectionTitle style={{ marginTop: '100px', marginBottom: '40px' }}>CONDUCT & DISCIPLINE</PortfolioSectionTitle>

            <PortfolioCard style={{
                padding: '40px',
                maxWidth: '700px',
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                border: `1px solid ${warnings.length === 0 ? 'rgba(232, 230, 227, 0.05)' : 'rgba(244, 63, 94, 0.1)'}`
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: warnings.length === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(232, 230, 227, 0.05)'
                }}>
                    {warnings.length === 0 ?
                        <CheckCircle size={32} color="#10b981" /> :
                        <AlertCircle size={32} color="#f43f5e" />
                    }
                </div>
                <div>
                    <div style={{
                        fontSize: '24px',
                        fontFamily: 'var(--font-serif)',
                        color: warnings.length === 0 ? '#10b981' : '#f43f5e',
                        letterSpacing: '0.5px'
                    }}>
                        {warnings.length === 0 ? 'Exemplary Standing' : `${warnings.length} Active Notice${warnings.length > 1 ? 's' : ''}`}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800', letterSpacing: '2px', marginTop: '10px', textTransform: 'uppercase' }}>
                        {warnings.length === 0 ? 'ALL CLEARANCE PROTOCOLS ACTIVE' : 'IMMEDIATE EXECUTIVE REVIEW REQUIRED'}
                    </div>
                </div>
            </PortfolioCard>


        </PortfolioPage>
    );
};

export default HRHub;
