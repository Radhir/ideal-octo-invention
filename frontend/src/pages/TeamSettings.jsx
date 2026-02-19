import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Plus, MoreVertical, Search,
    Mail, Shield, Key, Bell, CreditCard,
    FileText, Globe, Code, User, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const TeamSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('My details');
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { name: 'My details', id: 'details' },
        { name: 'Team', id: 'team' },
        { name: 'Password', id: 'password' },
        { name: 'Notifications', id: 'notifications', badge: '2' },
    ];

    useEffect(() => {
        if (activeTab === 'Team') {
            const fetchTeam = async () => {
                setLoading(true);
                try {
                    const res = await api.get('/api/auth/users/');
                    setTeam(res.data);
                } catch (err) {
                    console.error('Error fetching team', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchTeam();
        }
    }, [activeTab]);

    return (
        <div className="team-settings-page">


            <header className="settings-header">
                <div className="header-text">
                    <h1>{activeTab === 'Team' ? 'Team members' : 'Account Settings'}</h1>
                    <p>{activeTab === 'Team' ? 'Manage your team members and their account permissions here.' : 'Update your personal details and Preferences.'}</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">Discard</button>
                    <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
                    <MoreVertical size={20} opacity={0.4} cursor="pointer" />
                </div>
            </header>

            <div className="sub-nav-capsule">
                {tabs.map(tab => (
                    <div
                        key={tab.name}
                        className={`nav-tab ${activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.name}
                        {tab.badge && <span className="nav-badge">{tab.badge}</span>}
                    </div>
                ))}
            </div>

            <div className="settings-content">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'My details' && (
                        <div style={{ maxWidth: 600 }}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, marginBottom: 8, opacity: 0.6 }}>Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                                />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, marginBottom: 8, opacity: 0.6 }}>Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ''}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                                />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, marginBottom: 8, opacity: 0.6 }}>Role</label>
                                <input
                                    type="text"
                                    value={user?.role || ''}
                                    readOnly
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Team' && (
                        <table className="team-table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>STATUS</th>
                                    <th>ROLE</th>
                                    <th>EMAIL</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div className="user-badge">{member.username?.[0]?.toUpperCase()}</div>
                                                <span style={{ fontWeight: 600 }}>{member.username}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 100 }}>Active</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: 13, opacity: 0.6 }}>{member.role || 'Member'}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: 13, opacity: 0.6 }}>{member.email || 'N/A'}</span>
                                        </td>
                                        <td><MoreVertical size={16} opacity={0.3} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab !== 'My details' && activeTab !== 'Team' && (
                        <div style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>
                            {activeTab} module is coming soon in the next update.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TeamSettings;
