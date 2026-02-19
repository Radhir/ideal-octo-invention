import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, ClipboardList, Car, Paintbrush, Package,
    TrendingUp, Clock, UserCheck, AlertCircle, CheckCircle2,
    Save, FileText, Download, Printer, Send, Plus,
    Trash2, DollarSign, Camera, Calendar as CalendarIcon
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioButton, PortfolioGrid, PortfolioCard,
    PortfolioSectionTitle, PortfolioInput, PortfolioSelect
} from '../../components/PortfolioComponents';

const SchedulingPortal = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeams = useCallback(async () => {
        try {
            const response = await api.get('/forms/scheduling/teams/');
            setTeams(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const stats = [
        { label: 'Active Jobs', value: '24' },
        { label: 'Completed Today', value: '12', color: '#00FFA3' },
        { label: 'Pending Delivery', value: '8', color: '#FFB800' },
        { label: 'Urgent Work', value: '4', color: '#FF4D4D' }
    ];

    return (
        <PortfolioPage breadcrumb="OPERATIONS / SCHEDULING">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Daily Work Schedule & Personnel Reporting">
                    SYSTEM<br />SCHEDULING
                </PortfolioTitle>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'flex', gap: '30px', marginBottom: '60px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                {['DASHBOARD', 'TEAMS', 'SHEETS', 'REPORTING'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '15px 0',
                            color: activeTab === tab ? 'var(--cream)' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab ? '2px solid var(--cream)' : '2px solid transparent',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    SYNCHRONIZING SCHEDULER...
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === 'DASHBOARD' && (
                        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <PortfolioSectionTitle>Team Capacity Overview</PortfolioSectionTitle>
                            <PortfolioGrid columns="repeat(auto-fill, minmax(320px, 1fr))">
                                {teams.map(team => (
                                    <PortfolioCard key={team.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '600' }}>{team.name}</span>
                                            <span style={{ fontSize: '11px', opacity: 0.4 }}>{team.capacity} SLOTS</span>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(232, 230, 227, 0.1)', borderRadius: '2px', marginBottom: '15px' }}>
                                            <div style={{ width: '75%', height: '100%', background: 'var(--cream)', borderRadius: '2px' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ opacity: 0.6 }}>3/4 Slots Used</span>
                                            <span style={{ color: '#00FFA3', fontWeight: '700' }}>OPTIMAL</span>
                                        </div>
                                    </PortfolioCard>
                                ))}
                            </PortfolioGrid>
                        </motion.div>
                    )}

                    {activeTab === 'TEAMS' && <TeamSectionView teams={teams} />}

                    {activeTab === 'SHEETS' && <AdvisorSheetsView />}

                    {activeTab === 'REPORTING' && <ReportingView />}
                </AnimatePresence>
            )}
        </PortfolioPage>
    );
};

// --- Sub-Components migrated and styled ---

const TeamSectionView = ({ teams }) => {
    const [activeSection, setActiveSection] = useState('DETAILING');
    const sections = ['DETAILING', 'PAINTING', 'PPF_WRAPPING', 'MEDIA_DIGITAL'];
    const [assignments, setAssignments] = useState([]);

    const fetchAssignments = useCallback(async () => {
        try {
            const resp = await api.get('/forms/scheduling/assignments/');
            setAssignments(resp.data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

    const filteredTeams = teams.filter(t => {
        if (activeSection === 'MEDIA_DIGITAL') return ['SOCIAL MEDIA TEAM', 'SEO & DIGITAL MARKETING', 'VIDEOGRAPHERS'].includes(t.name);
        return t.section === activeSection;
    });

    return (
        <motion.div key="teams" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                {sections.map(s => (
                    <PortfolioButton
                        key={s}
                        variant={activeSection === s ? 'primary' : 'secondary'}
                        onClick={() => setActiveSection(s)}
                        style={{ padding: '10px 25px', fontSize: '11px' }}
                    >
                        {s.replace('_', ' ')}
                    </PortfolioButton>
                ))}
            </div>

            <PortfolioGrid columns="repeat(auto-fill, minmax(450px, 1fr))">
                {filteredTeams.map(team => (
                    <PortfolioCard key={team.id}>
                        <div style={{ marginBottom: '25px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)', paddingBottom: '15px' }}>
                            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>{team.name}</div>
                            <div style={{ fontSize: '12px', opacity: 0.4 }}>LEADER: {team.leader}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[...Array(team.capacity)].map((_, i) => {
                                const assigned = assignments.find(a => a.team === team.id && a.slot_number === i + 1 && !a.is_overtime);
                                return (
                                    <div key={i} style={{
                                        display: 'flex',
                                        padding: '12px 20px',
                                        background: assigned ? 'rgba(232, 230, 227, 0.05)' : 'transparent',
                                        border: '1px dashed rgba(232, 230, 227, 0.1)',
                                        borderRadius: '10px',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '11px', opacity: 0.4 }}>SLOT {i + 1}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                            {assigned ? `Job Card #${assigned.job_card}` : 'EMPTY'}
                                        </span>
                                        {!assigned && <PortfolioButton variant="secondary" style={{ padding: '4px 12px', fontSize: '10px' }}>Assign</PortfolioButton>}
                                    </div>
                                );
                            })}
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const AdvisorSheetsView = () => {
    const advisors = ['Anish', 'Suraj', 'Rony'];
    const [selectedAdvisor, setSelectedAdvisor] = useState('Anish');

    return (
        <motion.div key="sheets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                {advisors.map(name => (
                    <PortfolioButton
                        key={name}
                        variant={selectedAdvisor === name ? 'primary' : 'secondary'}
                        onClick={() => setSelectedAdvisor(name)}
                        style={{ padding: '10px 25px', fontSize: '11px' }}
                    >
                        {name}
                    </PortfolioButton>
                ))}
            </div>

            <PortfolioCard>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1.5px solid rgba(232, 230, 227, 0.1)' }}>
                                <th style={{ textAlign: 'left', padding: '20px', fontSize: '11px', opacity: 0.4 }}>JC#</th>
                                <th style={{ textAlign: 'left', padding: '20px', fontSize: '11px', opacity: 0.4 }}>CUSTOMER</th>
                                <th style={{ textAlign: 'left', padding: '20px', fontSize: '11px', opacity: 0.4 }}>CAR</th>
                                <th style={{ textAlign: 'left', padding: '20px', fontSize: '11px', opacity: 0.4 }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <td style={{ padding: '20px', fontSize: '14px' }}>#9842</td>
                                <td style={{ padding: '20px', fontSize: '14px' }}>***</td>
                                <td style={{ padding: '20px', fontSize: '14px' }}>Ferrari 296 GTB</td>
                                <td style={{ padding: '20px' }}><span style={{ color: '#00D1FF', fontSize: '11px', fontWeight: '700' }}>ASSIGNED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </PortfolioCard>
        </motion.div>
    );
};

const ReportingView = () => {
    return (
        <motion.div key="reporting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PortfolioGrid columns="1fr 1fr">
                <PortfolioCard>
                    <PortfolioSectionTitle>Daily Performance</PortfolioSectionTitle>
                    <PortfolioInput label="Jobs Received" type="number" defaultValue="24" />
                    <PortfolioInput label="Jobs Delivered" type="number" defaultValue="12" />
                    <PortfolioButton variant="primary">Submit Closing</PortfolioButton>
                </PortfolioCard>
                <PortfolioCard>
                    <PortfolioSectionTitle>Staff Report</PortfolioSectionTitle>
                    <PortfolioSelect label="Reporting Category">
                        <option>Sales / Advisor</option>
                        <option>Operations</option>
                        <option>Finance</option>
                    </PortfolioSelect>
                    <PortfolioButton variant="primary">Log Progress</PortfolioButton>
                </PortfolioCard>
            </PortfolioGrid>
        </motion.div>
    );
};

export default SchedulingPortal;
