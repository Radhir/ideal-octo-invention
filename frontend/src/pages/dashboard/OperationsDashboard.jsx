import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Wrench, Clock, AlertTriangle,
    CheckCircle2, RotateCcw, BarChart3, Users,
    Car, Calendar
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

const OperationsDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalWIP: 0,
        criticalJobs: [],
        technicianLoad: [],
        departmentEfficiency: {
            mech: 0,
            body: 0,
            paint: 0
        },
        recentCompletions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOperationsData();
    }, []);

    const fetchOperationsData = async () => {
        try {
            // In production, these would be dedicated aggregate endpoints
            const jobsRes = await api.get('/api/job-cards/api/jobs/');

            const jobs = jobsRes.data;
            const wipJobs = jobs.filter(j => j.status !== 'CLOSED' && j.status !== 'DELIVERED');
            const critical = wipJobs.filter(j => {
                // Mock logic for "Critical" - e.g., created > 7 days ago
                const daysOpen = (new Date() - new Date(j.created_at)) / (1000 * 60 * 60 * 24);
                return daysOpen > 7;
            }).slice(0, 3);

            const completed = jobs.filter(j => j.status === 'QC_PASSED' || j.status === 'READY_FOR_DELIVERY').slice(0, 5);

            setStats({
                totalWIP: wipJobs.length,
                criticalJobs: critical,
                technicianLoad: [
                    { name: 'Alex M.', role: 'Senior Tech', jobs: 4, status: 'Overloaded' },
                    { name: 'Sarah K.', role: 'Electrician', jobs: 2, status: 'Optimal' },
                    { name: 'Mike R.', role: 'Mechanic', jobs: 3, status: 'Busy' },
                    { name: 'David L.', role: 'Junior Tech', jobs: 1, status: 'Available' },
                ],
                departmentEfficiency: {
                    mech: 85,
                    body: 62,
                    paint: 94
                },
                recentCompletions: completed
            });
        } catch (err) {
            console.error("Failed to load operations data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Workshop Data...</p>
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Elite Shine Operations">
                    Workshop Command
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        variant="glass"
                        onClick={() => navigate('/workshop-diary')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Calendar size={18} /> Diary View
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => navigate('/job-cards/new')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Wrench size={18} /> New Job Card
                    </PortfolioButton>
                </div>
            </div>

            {/* HIGH LEVEL KPI ROW */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <KPICard
                    icon={Car}
                    label="Vehicles on Lift"
                    value={stats.totalWIP}
                    subvalue="Active WIP"
                    color="var(--gold)"
                />
                <KPICard
                    icon={AlertTriangle}
                    label="Critical Attention"
                    value={stats.criticalJobs.length}
                    subvalue="Over 7 Days WIP"
                    color="#f43f5e"
                />
                <KPICard
                    icon={RotateCcw}
                    label="Avg Turnaround"
                    value="3.2"
                    subvalue="Days / Vehicle"
                    color="#3b82f6"
                />
                <KPICard
                    icon={Activity}
                    label="Shop Efficiency"
                    value="82%"
                    subvalue="Target: 85%"
                    color="#10b981"
                />
            </PortfolioGrid>

            {/* MAIN CONTENT GRID */}
            <PortfolioGrid columns={3} gap="25px">

                {/* LEFT COLUMN: Critical Issues & Workflow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertTriangle size={18} color="#f43f5e" /> Critical Jobs
                            </h3>
                            <span style={{ fontSize: '10px', color: 'rgba(232,230,227,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Priority High</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stats.criticalJobs.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No critical jobs.</div> :
                                stats.criticalJobs.map(job => (
                                    <div key={job.id} onClick={() => navigate(`/job-cards/${job.id}`)} className="ops-row">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{job.job_card_number}</div>
                                            <div style={{ color: '#f43f5e', fontSize: '11px', fontWeight: '800' }}>{job.vehicle_details?.model || 'Vehicle'}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)' }}>{job.current_status_display}</div>
                                            <div style={{ fontSize: '10px', color: '#f43f5e' }}>Delayed</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </PortfolioCard>
                </div>

                {/* CENTER COLUMN: Technician Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users size={18} color="#3b82f6" /> Technician Load
                            </h3>
                            <button onClick={() => navigate('/hr/schedule')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '10px', cursor: 'pointer', fontWeight: '700' }}>MANAGE</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stats.technicianLoad.map((tech, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', color: '#fff' }}>
                                        {tech.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>{tech.name}</div>
                                        <div style={{ color: 'rgba(232,230,227,0.5)', fontSize: '11px' }}>{tech.role}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: tech.status === 'Overloaded' ? '#f43f5e' : tech.status === 'Available' ? '#10b981' : 'var(--gold)', fontSize: '11px', fontWeight: '800' }}>{tech.status}</div>
                                        <div style={{ fontSize: '10px', color: 'rgba(232,230,227,0.4)' }}>{tech.jobs} Active Jobs</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>

                {/* RIGHT COLUMN: Quality & Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart3 size={18} color="#10b981" /> Efficiency Rate
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <EfficiencyBar label="Mechanical" value={stats.departmentEfficiency.mech} color="#3b82f6" />
                            <EfficiencyBar label="Body Shop" value={stats.departmentEfficiency.body} color="#f59e0b" />
                            <EfficiencyBar label="Paint Booth" value={stats.departmentEfficiency.paint} color="#f43f5e" />
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 size={18} color="var(--gold)" /> Recent Output
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stats.recentCompletions.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No completed jobs.</div> :
                                stats.recentCompletions.map(job => (
                                    <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ color: '#fff' }}>#{job.job_card_number}</span>
                                        <span style={{ color: '#10b981', fontWeight: '700' }}>QC PASSED</span>
                                    </div>
                                ))
                            }
                        </div>
                    </PortfolioCard>
                </div>

            </PortfolioGrid>

        </PortfolioPage>
    );
};

const KPICard = ({ icon: Icon, label, value, subvalue, color }) => (
    <PortfolioCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `4px solid ${color}` }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={22} />
        </div>
        <div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cream)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '10px', color: 'rgba(232,230,227,0.5)', marginTop: '2px' }}>{subvalue}</div>
        </div>
    </PortfolioCard>
);

const EfficiencyBar = ({ label, value, color }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
            <span style={{ color: '#fff' }}>{label}</span>
            <span style={{ color: color, fontWeight: '700' }}>{value}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px' }}></div>
        </div>
    </div>
);

export default OperationsDashboard;
