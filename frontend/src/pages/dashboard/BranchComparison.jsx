import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    LayoutGrid, BarChart3, TrendingUp, Users,
    ArrowRightCircle, MapPin
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats
} from '../../components/PortfolioComponents';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const BranchComparison = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const branches = [
        { code: 'DXB', name: 'Dubai HQ', color: 'var(--gold)' },
        { code: 'AUH', name: 'Abu Dhabi', color: '#10b981' },
        { code: 'SHJ', name: 'Sharjah', color: '#6366f1' },
    ];

    useEffect(() => {
        // Simulated comparison data for now
        const mockData = [
            { name: 'Revenue', DXB: 450000, AUH: 320000, SHJ: 210000 },
            { name: 'Leads', DXB: 120, AUH: 85, SHJ: 60 },
            { name: 'Efficiency', DXB: 88, AUH: 92, SHJ: 85 },
            { name: 'Retention', DXB: 65, AUH: 70, SHJ: 58 },
        ];
        setData(mockData);
        setLoading(false);
    }, []);

    return (
        <PortfolioPage breadcrumb="Strategic Hub / Performance / Branch Multi-View">
            <header style={{ marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Comparative analytical lens for monitoring institutional KPIs across all regional operations.">
                    Multi-Branch Performance Spectrum
                </PortfolioTitle>
            </header>

            <PortfolioGrid columns={3}>
                {branches.map(branch => (
                    <PortfolioCard key={branch.code} style={{ borderTop: `4px solid ${branch.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={branchLabel}><MapPin size={10} inline /> {branch.name}</div>
                                <div style={branchValue}>AED 1.2M</div>
                                <div style={branchSub}>MTD REVENUE</div>
                            </div>
                            <div style={{ ...statusIndicator, background: branch.color }}></div>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>

            <div style={{ marginTop: '60px' }}>
                <PortfolioCard title="CORE KPI SPECTRUM">
                    <div style={{ height: '400px', width: '100%', marginTop: '30px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232, 230, 227, 0.05)" />
                                <XAxis dataKey="name" stroke="rgba(232, 230, 227, 0.4)" fontSize={11} tickLine={false} />
                                <YAxis stroke="rgba(232, 230, 227, 0.4)" fontSize={11} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1c1b18', border: '1px solid rgba(232, 230, 227, 0.1)', color: 'var(--cream)' }}
                                    cursor={{ fill: 'rgba(232, 230, 227, 0.03)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', letterSpacing: '2px' }} />
                                <Bar dataKey="DXB" fill="var(--gold)" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="AUH" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="SHJ" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>
            </div>
        </PortfolioPage>
    );
};

const branchLabel = {
    fontSize: '10px',
    color: 'rgba(232, 230, 227, 0.4)',
    letterSpacing: '3px',
    fontWeight: '900',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '15px'
};

const branchValue = {
    fontSize: '32px',
    color: 'var(--cream)',
    fontFamily: "'Cormorant Garamond', serif",
};

const branchSub = {
    fontSize: '9px',
    color: 'var(--gold)',
    letterSpacing: '2px',
    fontWeight: '700',
    marginTop: '5px'
};

const statusIndicator = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 15px currentColor'
};

export default BranchComparison;
