import React, { useState, useEffect } from 'react';
import {
    FileText, Search, Upload, Filter,
    MoreVertical, Download, Trash2, Share2,
    Eye, Shield, Activity, ArrowRight,
    Folder, Tag, Clock, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats,
    PortfolioInput,
    PortfolioSelect,
    PortfolioButton
} from '../../components/PortfolioComponents';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchDocuments();
        fetchCategories();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/api/documents/files/');
            setDocuments(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            // Fallback for demo/missing backend
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/documents/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const filteredDocs = documents.filter(doc => {
        const matchesSearch =
            (doc.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (doc.document_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || doc.category_name === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = [
        { label: 'Total Dossiers', value: documents.length, color: 'var(--gold)' },
        { label: 'Restricted Access', value: documents.filter(d => d.access_level === 'RESTRICTED').length, color: 'var(--blue)' },
        { label: 'Cloud Synchronized', value: '100%', color: 'var(--purple)' }
    ];

    return (
        <PortfolioPage breadcrumb="OPERATIONAL ASSETS / DOCUMENT MANAGEMENT">
            <PortfolioTitle subtitle="Centralized intelligence vault for technical, legal, and operational documentation. High-fidelity version control and access governance.">
                Document Manager
            </PortfolioTitle>

            <PortfolioStats stats={stats} />

            {/* Portfolio Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '60px' }}>
                <PortfolioInput
                    placeholder="Search by Title, Serial, or Metadata..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <PortfolioSelect
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </PortfolioSelect>
                <PortfolioButton variant="gold" onClick={() => alert('Secure Upload Protocol Initiated')}>
                    <Upload size={14} style={{ marginRight: '10px' }} /> Upload Node
                </PortfolioButton>
            </div>

            {/* Document Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <AnimatePresence>
                    {filteredDocs.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                        >
                            <PortfolioCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: 'rgba(232, 230, 227, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(232, 230, 227, 0.1)'
                                        }}>
                                            <FileText size={20} color="var(--gold)" strokeWidth={1} />
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '4px' }}>
                                                {doc.title}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '1px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={10} /> {doc.document_number}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Folder size={10} /> {doc.category_name || 'GENERAL'}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={10} /> v{doc.version}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--cream)' }}>{doc.owner_name}</div>
                                            <div style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                                                {doc.access_level}
                                            </div>
                                        </div>

                                        <div style={{ width: '1px', height: '30px', background: 'rgba(232, 230, 227, 0.1)' }}></div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                                                onClick={() => window.open(doc.file, '_blank')}
                                                title="Secure Download"
                                            >
                                                <Download size={18} color="rgba(232, 230, 227, 0.5)" />
                                            </button>
                                            <button
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                                                title="Manage Access"
                                            >
                                                <Share2 size={18} color="rgba(232, 230, 227, 0.5)" />
                                            </button>
                                            <button
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                                                title="Delete Node"
                                            >
                                                <Trash2 size={18} color="#f43f5e" style={{ opacity: 0.6 }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </PortfolioCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredDocs.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(232, 230, 227, 0.2)' }}>
                        <Folder size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                        <div style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>No intelligence files currently indexed.</div>
                    </div>
                )}
            </div>

            <footer style={{ marginTop: '100px', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 230, 227, 0.05)', paddingTop: '40px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px' }}>
                    ELITE SHINE DOCUMENT GOVERNANCE v2.4
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Shield size={14} color="rgba(232, 230, 227, 0.1)" />
                    <Activity size={14} color="rgba(232, 230, 227, 0.1)" />
                </div>
            </footer>
        </PortfolioPage>
    );
};

export default DocumentManager;
