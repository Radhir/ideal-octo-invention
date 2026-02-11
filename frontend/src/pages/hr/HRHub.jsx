import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

const HRHub = () => {
    const [slips, setSlips] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [_loading, setLoading] = useState(true);

    const fetchHRData = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchHRData();
    }, [fetchHRData]);
    return (
        <div className="p-8 max-w-7xl mx-auto" style={{ color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Executive Workforce</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>HR Console</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Employee documents, salary slips, and warning letters</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--gold-border)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Recent Salary Slips</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {slips.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontWeight: '800' }}>No fiscal slips available for current period.</p>
                            ) : slips.map(slip => (
                                <div key={slip.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'var(--input-bg)', borderRadius: '1rem', border: '1.5px solid var(--gold-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--gold-glow)', borderRadius: '0.75rem', border: '1px solid var(--gold-border)' }}>
                                            <FileText style={{ color: 'var(--gold)' }} size={20} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '900', color: 'var(--text-primary)' }}>Salary Slip - {new Date(slip.month).toLocaleDateString([], { month: 'short', year: 'numeric' })}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800' }}>Status: {slip.status}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: '900', fontSize: '1.1rem' }}>AED {parseFloat(slip.net_salary).toLocaleString()}</span>
                                        <a href={slip.file} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--gold-border)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Employee Documents</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {documents.length === 0 ? (
                                <p style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontWeight: '800' }}>No compliance documents hosted.</p>
                            ) : documents.map(doc => (
                                <div key={doc.id} style={{ padding: '1.25rem', backgroundColor: 'var(--input-bg)', borderRadius: '1rem', border: '1.5px solid var(--gold-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <span style={{
                                            backgroundColor: new Date(doc.expiry_date) > new Date() ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: new Date(doc.expiry_date) > new Date() ? '#10b981' : '#f43f5e',
                                            fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: '900', border: `1px solid ${new Date(doc.expiry_date) > new Date() ? '#10b98140' : '#f43f5e40'}`
                                        }}>{new Date(doc.expiry_date) > new Date() ? 'Valid' : 'Expired'}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '800' }}>Expires: {doc.expiry_date}</span>
                                    </div>
                                    <p style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>{doc.document_type}</p>
                                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--gold)', fontSize: '0.9rem', fontWeight: '800' }}>{doc.document_number}</p>
                                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                        <a href={doc.file} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                                            <button style={{ width: '100%', padding: '0.6rem', fontSize: '11px', fontWeight: '900', backgroundColor: 'var(--gold-glow)', border: '1px solid var(--gold-border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>View Record</button>
                                        </a>
                                        <a href={doc.file} download style={{ color: 'var(--text-primary)' }}>
                                            <button style={{ padding: '0.6rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', cursor: 'pointer' }}><Download size={14} /></button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--gold-border)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Disciplinary Status</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: warnings.length === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', borderRadius: '1rem', border: `1.5px solid ${warnings.length === 0 ? '#10b98140' : '#f43f5e40'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {warnings.length === 0 ? <CheckCircle style={{ color: '#10b981' }} size={24} /> : <AlertCircle style={{ color: '#f43f5e' }} size={24} />}
                                <span style={{ color: warnings.length === 0 ? '#10b981' : '#f43f5e', fontWeight: '900', fontSize: '1.1rem' }}>
                                    {warnings.length === 0 ? 'Good Standing' : `${warnings.length} Active Warnings`}
                                </span>
                            </div>
                        </div>
                        <div style={{ marginTop: '2.5rem' }}>
                            <p style={{ color: 'var(--gold)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Warning Letters</p>
                            {warnings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '2px dashed var(--gold-border)', borderRadius: '1.5rem', background: 'var(--gold-glow)' }}>
                                    <AlertCircle size={40} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '800', margin: 0 }}>No disciplinary history found.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {warnings.map(warn => (
                                        <div key={warn.id} style={{ padding: '1.25rem', backgroundColor: '#f43f5e10', borderRadius: '1rem', border: '1.5px solid #f43f5e40' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span style={{ fontWeight: '900', color: '#f43f5e', fontSize: '11px', textTransform: 'uppercase' }}>{warn.warning_level}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '800' }}>{warn.date_issued}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{warn.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHub;
