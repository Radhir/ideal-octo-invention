import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, Calendar, User, CheckCircle2, XCircle, Printer } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const LeaveList = () => {
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
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Leave Application Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Leave Applications</h1>
                    <p style={{ color: '#94a3b8' }}>Staff time-off management</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Print Registry
                    </button>
                    <Link to="/leaves/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={20} /> Apply for Leave
                    </Link>
                </div>
            </header>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search employees..."
                    style={{ paddingLeft: '45px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <GlassCard style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Employee</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Type</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Period</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Days</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredLeaves.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>No applications found.</td></tr>
                        ) : (
                            filteredLeaves.map((l) => (
                                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '600' }}>{l.employee_name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{l.position}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ color: '#b08d57', fontSize: '12px', fontWeight: '700' }}>{l.leave_type}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '13px' }}>{l.leave_period_from} to {l.leave_period_to}</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{l.total_days}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                            <div title="Manager Approval" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: l.manager_approval ? '#10b981' : '#f43f5e' }}>
                                                {l.manager_approval ? <CheckCircle2 size={14} /> : <XCircle size={14} />} MGR
                                            </div>
                                            <div title="HR Approval" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: l.hr_approval ? '#10b981' : '#f43f5e' }}>
                                                {l.hr_approval ? <CheckCircle2 size={14} /> : <XCircle size={14} />} HR
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassCard>
            <style>{`
            `}</style>
        </div>
    );
};

export default LeaveList;
