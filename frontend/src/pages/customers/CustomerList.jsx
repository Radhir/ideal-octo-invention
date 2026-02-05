import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import { Users, Search, Phone, Mail, MapPin, Plus } from 'lucide-react';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers/api/');
            setCustomers(res.data.results || res.data); // Handle pagination or list
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#ec4899', fontWeight: '800', letterSpacing: '2px' }}>RELATIONSHIP MANAGEMENT</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Customer Database</h1>
                </div>
                <button className="btn-primary" style={{ background: '#ec4899' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> New Customer
                </button>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }} size={20} />
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="form-control"
                    style={{ paddingLeft: '55px', borderColor: 'rgba(236,72,153,0.3)' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {loading ? <div style={{ color: '#fff' }}>Loading Database...</div> : filtered.map(c => (
                    <GlassCard key={c.id} style={{ padding: '25px', position: 'relative', borderTop: '4px solid #ec4899' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '800' }}>{c.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
                            <Phone size={14} /> {c.phone}
                        </div>

                        <div style={{ display: 'grid', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                            {c.email && <div style={{ display: 'flex', gap: '8px' }}><Mail size={14} /> {c.email}</div>}
                            {c.address && <div style={{ display: 'flex', gap: '8px' }}><MapPin size={14} /> {c.address}</div>}
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: '#64748b' }}>Since {new Date(c.created_at).toLocaleDateString()}</span>
                            <span style={{ color: '#ec4899', fontWeight: '700' }}>View Profile →</span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default CustomerList;
