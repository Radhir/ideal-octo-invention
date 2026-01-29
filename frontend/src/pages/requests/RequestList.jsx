import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, User, Car, Hash, Wallet, Printer } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/forms/requests/api/forms/');
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching request forms', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(r =>
        r.request_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Purchase Request Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Purchase Requests</h1>
                    <p style={{ color: '#94a3b8' }}>External service and part requests</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Print Registry
                    </button>
                    <Link to="/requests/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={20} /> Create Request
                    </Link>
                </div>
            </header>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or plate..."
                    style={{ paddingLeft: '45px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <GlassCard style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Request By</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Car / Plate</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Amount</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Payment</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>No requests found.</td></tr>
                        ) : (
                            filteredRequests.map((r) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="#b08d57" />
                                            </div>
                                            <div style={{ fontWeight: '600' }}>{r.request_by}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{r.car_type}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Hash size={10} /> {r.plate_number}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '800', color: '#fff' }}>AED {r.amount}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                                            <Wallet size={14} color="#b08d57" />
                                            {r.payment_type}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                                        {new Date(r.date).toLocaleDateString()}
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

export default RequestList;
