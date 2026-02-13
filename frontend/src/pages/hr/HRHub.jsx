import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FileText, Download, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioStats, PortfolioGrid, PortfolioCard } from '../../components/PortfolioComponents';

const HRHub = () => {
    const [slips, setSlips] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHRData();
    }, []);

    const fetchHRData = async () => {
        setLoading(true);
        try {
            const [slipRes, docRes, warnRes] = await Promise.all([
                api.get('/hr/api/salary-slips/'),
                api.get('/hr/api/employee-documents/'),
                api.get('/hr/api/warning-letters/')
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

            <PortfolioStats stats={[
                { value: slips.length, label: 'SALARY SLIPS' },
                { value: documents.length, label: 'DOCUMENTS', color: validDocs === documents.length ? '#10b981' : '#f59e0b' },
                { value: warnings.length, label: 'WARNINGS', color: warnings.length > 0 ? '#ef4444' : '#10b981' }
            ]} />

            {/* Salary Slips */}
            <h3 style={{
                fontSize: '24px',
                fontFamily: 'var(--font-serif)',
                color: 'var(--cream)',
                marginBottom: '30px',
                letterSpacing: '-0.01em'
            }}>
                Salary Slips
            </h3>

            <PortfolioGrid columns="repeat(auto-fill, minmax(350px, 1fr))">
                {slips.length === 0 ? (
                    <div style={{
                        gridColumn: '1/-1',
                        textAlign: 'center',
                        padding: '60px',
                        color: 'rgba(232, 230, 227, 0.5)'
                    }}>
                        No salary slips available
                    </div>
                ) : slips.map(slip => (
                    <div
                        key={slip.id}
                        style={{
                            padding: '30px',
                            background: 'rgba(232, 230, 227, 0.03)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '20px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <DollarSign size={20} color="#10b981" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                        {new Date(slip.month).toLocaleDateString([], { month: 'long', year: 'numeric' })}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '2px' }}>
                                        {slip.status}
                                    </div>
                                </div>
                            </div>
                            {slip.file && (
                                <a href={slip.file} target="_blank" rel="noreferrer" style={{ color: 'var(--cream)' }}>
                                    <Download size={20} />
                                </a>
                            )}
                        </div>
                        <div style={{ fontSize: '28px', fontFamily: 'var(--font-serif)', color: '#10b981' }}>
                            AED {parseFloat(slip.net_salary).toLocaleString()}
                        </div>
                    </div>
                ))}
            </PortfolioGrid>

            {/* Documents */}
            <h3 style={{
                fontSize: '24px',
                fontFamily: 'var(--font-serif)',
                color: 'var(--cream)',
                marginTop: '80px',
                marginBottom: '30px',
                letterSpacing: '-0.01em'
            }}>
                Employee Documents
            </h3>

            <PortfolioGrid columns="repeat(auto-fill, minmax(300px, 1fr))">
                {documents.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.5)' }}>
                        No documents on file
                    </div>
                ) : documents.map(doc => {
                    const isValid = new Date(doc.expiry_date) > new Date();
                    return (
                        <div
                            key={doc.id}
                            style={{
                                padding: '25px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                border: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                borderRadius: '15px'
                            }}
                        >
                            <div style={{
                                padding: '6px 12px',
                                background: isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                color: isValid ? '#10b981' : '#f43f5e',
                                fontSize: '11px',
                                borderRadius: '50px',
                                width: 'fit-content',
                                marginBottom: '15px',
                                fontWeight: '500'
                            }}>
                                {isValid ? 'Valid' : 'Expired'}
                            </div>
                            <div style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '8px' }}>
                                {doc.document_type}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '15px' }}>
                                {doc.document_number}
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)' }}>
                                Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                            </div>
                            {doc.file && (
                                <a href={doc.file} target="_blank" rel="noreferrer" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '15px',
                                    color: 'var(--cream)',
                                    fontSize: '13px',
                                    textDecoration: 'none'
                                }}>
                                    <FileText size={16} /> View Document
                                </a>
                            )}
                        </div>
                    );
                })}
            </PortfolioGrid>

            {/* Warnings */}
            <h3 style={{
                fontSize: '24px',
                fontFamily: 'var(--font-serif)',
                color: 'var(--cream)',
                marginTop: '80px',
                marginBottom: '30px',
                letterSpacing: '-0.01em'
            }}>
                Disciplinary Status
            </h3>

            <div style={{
                padding: '30px',
                background: warnings.length === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                border: `1px solid ${warnings.length === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                borderRadius: '20px',
                maxWidth: '600px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {warnings.length === 0 ?
                        <CheckCircle size={32} color="#10b981" /> :
                        <AlertCircle size={32} color="#f43f5e" />
                    }
                    <div>
                        <div style={{
                            fontSize: '20px',
                            fontFamily: 'var(--font-serif)',
                            color: warnings.length === 0 ? '#10b981' : '#f43f5e'
                        }}>
                            {warnings.length === 0 ? 'Good Standing' : `${warnings.length} Active Warning${warnings.length > 1 ? 's' : ''}`}
                        </div>
                        {warnings.length > 0 && (
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '5px' }}>
                                Review disciplinary records
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default HRHub;
