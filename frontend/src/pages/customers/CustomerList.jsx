import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Phone, Mail, MapPin, Plus, Edit3 } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioButton, PortfolioGrid, PortfolioCard, PortfolioStats } from '../../components/PortfolioComponents';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/api/customers/');
            setCustomers(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Customer Relations">
            {!selectedCustomer ? (
                <>
                    <PortfolioTitle>CUSTOMERS</PortfolioTitle>

                    <PortfolioStats stats={[
                        { value: customers.length, label: 'TOTAL CUSTOMERS' }
                    ]} />

                    <PortfolioButton onClick={() => navigate('/customers/create')} style={{ marginBottom: '60px' }}>
                        <Plus size={18} style={{ display: 'inline', marginRight: '10px', marginBottom: '-3px' }} />
                        New Customer
                    </PortfolioButton>

                    <PortfolioGrid>
                        {customers.map(customer => (
                            <PortfolioCard key={customer.id} onClick={() => setSelectedCustomer(customer)}>
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
                                        {customer.name}
                                    </div>
                                    <div style={{ fontSize: '13px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Phone size={14} /> {customer.phone}
                                    </div>
                                </div>

                                {customer.email && (
                                    <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Mail size={13} /> {customer.email}
                                    </div>
                                )}

                                {customer.address && (
                                    <div style={{ fontSize: '12px', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={13} /> {customer.address.substring(0, 40)}...
                                    </div>
                                )}

                                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', fontSize: '11px', opacity: 0.5 }}>
                                    Since {new Date(customer.created_at).toLocaleDateString()}
                                </div>
                            </PortfolioCard>
                        ))}
                    </PortfolioGrid>
                </>
            ) : (
                <>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => setSelectedCustomer(null)}
                        style={{ marginBottom: '60px' }}
                    >
                        ← Back to customers
                    </PortfolioButton>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedCustomer.name}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                        <div style={{ padding: '25px 30px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                <Phone size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                PHONE
                            </div>
                            <div style={{ fontSize: '16px', color: 'var(--cream)' }}>{selectedCustomer.phone}</div>
                        </div>

                        {selectedCustomer.email && (
                            <div style={{ padding: '25px 30px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                                <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                    <Mail size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                    EMAIL
                                </div>
                                <div style={{ fontSize: '16px', color: 'var(--cream)' }}>{selectedCustomer.email}</div>
                            </div>
                        )}

                        {selectedCustomer.address && (
                            <div style={{ padding: '25px 30px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px', letterSpacing: '1px' }}>
                                    <MapPin size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                    ADDRESS
                                </div>
                                <div style={{ fontSize: '16px', color: 'var(--cream)', lineHeight: '1.6' }}>{selectedCustomer.address}</div>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '60px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '40px' }}>
                        <PortfolioButton onClick={() => navigate(`/customers/${selectedCustomer.id}/edit`)}>
                            <Edit3 size={18} style={{ display: 'inline', marginRight: '10px', marginBottom: '-3px' }} />
                            Edit Profile
                        </PortfolioButton>
                    </div>
                </>
            )}
        </PortfolioPage>
    );
};

export default CustomerList;
