import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { PortfolioPage, PortfolioTitle, PortfolioCard, GlassCard } from '../../components/PortfolioComponents';
import { FileText, Calendar, Search, AlertTriangle, Download, Filter } from 'lucide-react';

const EmployeeDocumentRegistry = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get('/api/hr/employee-documents/');
                setDocuments(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to fetch documents", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = (doc.employee_name || doc.employee?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.document_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || doc.document_type === filterType;
        return matchesSearch && matchesType;
    });

    const isExpired = (date) => new Date(date) < new Date();
    const isExpiringSoon = (date) => {
        const diff = new Date(date) - new Date();
        return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000); // 30 days
    };

    if (loading) return <div className="p-20 text-center text-gold">Accessing Document Vault...</div>;

    return (
        <PortfolioPage breadcrumb="HRMS / Master / Document Registry">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Centralized repository for all employee compliance and identity documents.">
                    DOCUMENT REGISTRY
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            className="premium-input-field"
                            style={{ paddingLeft: '40px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', height: '40px', width: '250px' }}
                            placeholder="Search by Employee / ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="premium-select-field"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', padding: '0 15px', height: '40px' }}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Document Types</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="VISA">Visa</option>
                        <option value="ID">Emirates ID</option>
                        <option value="CONTRACT">Labor Contract</option>
                    </select>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr auto', padding: '15px 30px', background: 'rgba(212,175,55,0.05)', borderRadius: '8px', fontSize: '10px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px' }}>
                    <span>EMPLOYEE</span>
                    <span>TYPE</span>
                    <span>DOC NUMBER</span>
                    <span>EXPIRY DATE</span>
                    <span>STATUS</span>
                    <span>ACTION</span>
                </div>

                {filteredDocs.map(doc => {
                    const expired = isExpired(doc.expiry_date);
                    const soon = isExpiringSoon(doc.expiry_date);

                    return (
                        <GlassCard key={doc.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr auto', padding: '20px 30px', alignItems: 'center', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={16} />
                                </div>
                                <span style={{ fontWeight: '700' }}>{doc.employee_name || doc.employee?.full_name}</span>
                            </div>

                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{doc.document_type}</span>

                            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{doc.document_number}</span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: expired ? '#ef4444' : soon ? '#f59e0b' : 'inherit' }}>
                                <Calendar size={14} />
                                <span style={{ fontWeight: '600' }}>{doc.expiry_date}</span>
                            </div>

                            <div>
                                {expired ? (
                                    <span style={{ color: '#ef4444', fontSize: '9px', fontWeight: '900', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '4px' }}>EXPIRED</span>
                                ) : soon ? (
                                    <span style={{ color: '#f59e0b', fontSize: '9px', fontWeight: '900', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '4px' }}>EXPIRING SOON</span>
                                ) : (
                                    <span style={{ color: '#10b981', fontSize: '9px', fontWeight: '900', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>VALID</span>
                                )}
                            </div>

                            <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', opacity: 0.7 }}>
                                <Download size={18} />
                            </a>
                        </GlassCard>
                    );
                })}

                {filteredDocs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <AlertTriangle size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '15px' }} />
                        <h3 style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>No documents found matching the criteria.</h3>
                    </div>
                )}
            </div>
        </PortfolioPage>
    );
};

export default EmployeeDocumentRegistry;
