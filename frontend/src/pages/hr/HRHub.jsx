import React from 'react';
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

const HRHub = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto" style={{ color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>HR Console</h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Employee documents, salary slips, and warning letters</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Salary Slips</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                                            <FileText style={{ color: '#10b981' }} size={20} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>Salary Slip - Jan 2026</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Generated on 28 Jan 2026</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>AED 8,500.00</span>
                                        <button style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0' }}>Employee Documents</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { type: 'Passport', number: 'RL123456', expiry: '2028-12-31', status: 'Valid' },
                                { type: 'Visa', number: 'VN987654', expiry: '2026-06-15', status: 'Expiring Soon' }
                            ].map(doc => (
                                <div key={doc.type} style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            backgroundColor: doc.status === 'Valid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: doc.status === 'Valid' ? '#10b981' : '#f59e0b',
                                            fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold'
                                        }}>{doc.status}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Expires: {doc.expiry}</span>
                                    </div>
                                    <p style={{ margin: 0, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{doc.type}</p>
                                    <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{doc.number}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>View</button>
                                        <button style={{ padding: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}><Download size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0' }}>Disciplinary Status</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle style={{ color: '#10b981' }} size={20} />
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Good Standing</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Warning Letters</p>
                            <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed rgba(255, 255, 255, 0.1)', borderRadius: '1rem' }}>
                                <AlertCircle size={32} style={{ color: '#334155', marginBottom: '0.5rem' }} />
                                <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>No disciplinary history found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHub;
