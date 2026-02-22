import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Users, CreditCard, Phone, UserX, Banknote, Calendar, FileClock,
    Download, RefreshCw, Search
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioCard,
    PortfolioButton, PortfolioGrid
} from '../../components/PortfolioComponents';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeReports = () => {
    const [activeTab, setActiveTab] = useState('contact');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'contact', label: 'Contact Details', icon: <Phone size={18} /> },
        { id: 'family', label: 'Family Records', icon: <Users size={18} /> },
        { id: 'bank', label: 'Bank Accounts', icon: <CreditCard size={18} /> },
        { id: 'loan', label: 'Loan History', icon: <Banknote size={18} /> },
        { id: 'leave', label: 'Leave Register', icon: <Calendar size={18} /> },
        { id: 'expiry', label: 'Doc Expiry', icon: <FileClock size={18} /> },
        { id: 'resign', label: 'Resignations', icon: <UserX size={18} /> },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reports/api/employees/details/?type=${activeTab}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data.length) return;

        // Convert JSON to CSV
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName =>
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value) // Handle nulls and escapings
            ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeTab}_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const renderTable = () => {
        if (!data.length) return <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No records found.</div>;

        const headers = Object.keys(data[0]).map(key => key.replace(/_/g, ' ').toUpperCase());

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {headers.map(h => (
                                <th key={h} style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                {Object.values(row).map((val, i) => (
                                    <td key={i} style={{ padding: '15px', color: 'rgba(255,255,255,0.7)' }}>
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <PortfolioPage breadcrumb="HR Management / Employee Reports">
            <PortfolioTitle subtitle="Comprehensive registry of employee personal and professional records.">
                Personnel Data Center
            </PortfolioTitle>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 20px', borderRadius: '12px',
                            background: activeTab === tab.id ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                            color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.6)',
                            border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <PortfolioCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '15px', top: '12px', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 10px 10px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: '#fff'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <PortfolioButton variant="secondary" onClick={fetchData}>
                            <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        </PortfolioButton>
                        <PortfolioButton onClick={handleExport}>
                            <Download size={16} style={{ marginRight: '8px' }} /> Export CSV
                        </PortfolioButton>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
                        RETRIEVING DATA...
                    </div>
                ) : (
                    renderTable()
                )}
            </PortfolioCard>
        </PortfolioPage>
    );
};

export default EmployeeReports;
