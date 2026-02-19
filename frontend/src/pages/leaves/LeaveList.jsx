import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, CheckCircle2, XCircle, Printer } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput
} from '../../components/PortfolioComponents';

const LeaveList = () => {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/forms/leaves/api/applications/');
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching leave applications', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PortfolioPage breadcrumb="Workforce Logistics / Leave Registry">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <PortfolioTitle
                    subtitle="Staff time-off management and approval workflows"
                >
                    Leave Applications
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Printer size={18} /> Print Registry
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/leaves/create')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plus size={18} /> Apply for Leave
                    </PortfolioButton>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <PortfolioInput
                    icon={Search}
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            <PortfolioCard style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.1)', background: 'rgba(176,141,87,0.05)' }}>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', fontWeight: '800' }}>Employee</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', fontWeight: '800' }}>Type</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', fontWeight: '800' }}>Period</th>
                                <th style={{ padding: '20px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', fontWeight: '800' }}>Days</th>
                                <th style={{ padding: '20px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', fontWeight: '800' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.5)' }}>Loading registry...</td></tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.5)' }}>No applications found.</td></tr>
                            ) : (
                                filteredLeaves.map((l) => (
                                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)', transition: 'background 0.2s' }} className="hover-row">
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--cream)' }}>{l.employee_name}</div>
                                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '4px' }}>{l.position}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                padding: '5px 10px',
                                                background: 'rgba(176,141,87,0.1)',
                                                border: '1px solid rgba(176,141,87,0.2)',
                                                borderRadius: '4px',
                                                color: 'var(--gold)',
                                                letterSpacing: '0.5px'
                                            }}>{l.leave_type}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.8)' }}>
                                                {new Date(l.leave_period_from).toLocaleDateString()} <span style={{ color: 'rgba(232, 230, 227, 0.3)', margin: '0 5px' }}>→</span> {new Date(l.leave_period_to).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{l.total_days}</td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                                <div title="Manager Approval" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '800', color: l.manager_approval ? '#10b981' : 'rgba(244,63,94,0.7)' }}>
                                                    {l.manager_approval ? <CheckCircle2 size={14} /> : <XCircle size={14} />} MGR
                                                </div>
                                                <div title="HR Approval" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '800', color: l.hr_approval ? '#10b981' : 'rgba(244,63,94,0.7)' }}>
                                                    {l.hr_approval ? <CheckCircle2 size={14} /> : <XCircle size={14} />} HR
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </PortfolioCard>

        </PortfolioPage>
    );
};

export default LeaveList;
