import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, Eye, Printer } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const CeramicList = () => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWarranties();
    }, []);

    const fetchWarranties = async () => {
        try {
            const res = await axios.get('/forms/ceramic/api/warranties/');
            setWarranties(res.data);
        } catch (err) {
            console.error('Error fetching warranties', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredWarranties = warranties.filter(w =>
        w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Ceramic Warranty Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Ceramic Warranty Registrations</h1>
                    <p style={{ color: '#94a3b8' }}>Manage and track Ceramic & Graphene coatings</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                        <Printer size={20} /> Print Registry
                    </button>
                    <Link to="/ceramic/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={20} /> Register New
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
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Customer</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Vehicle</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Type</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Date</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', color: '#b08d57' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredWarranties.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>No registrations found.</td></tr>
                        ) : (
                            filteredWarranties.map((w) => (
                                <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '600' }}>{w.full_name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{w.contact_number}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{w.vehicle_brand} {w.vehicle_model}</td>
                                    <td style={{ padding: '15px' }}><span style={{ background: 'rgba(176, 141, 87, 0.2)', color: '#b08d57', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>{w.coating_type}</span></td>
                                    <td style={{ padding: '15px' }}>{new Date(w.installation_date).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <Link to={`/ceramic/${w.id}`} style={{ color: '#b08d57' }}><Eye size={20} /></Link>
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

export default CeramicList;
