import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Trophy, Users, Target, Activity,
    TrendingUp, CheckCircle, Clock
} from 'lucide-react';
import '../../layouts/AppLayout.css';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card p-6" style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px'
    }}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10`}>
                <Icon size={24} className={`text-${color}-400`} />
            </div>
        </div>
    </div>
);

const TechnicianAnalytics = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/hr/api/employees/technician_leaderboard/');
                setLeaderboard(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Leaderboard fetch failed', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totals = leaderboard.reduce((acc, curr) => ({
        jobs: acc.jobs + curr.jobs_closed,
        revenue: acc.revenue + curr.revenue_generated
    }), { jobs: 0, revenue: 0 });

    if (loading) return <div className="p-12 text-white">Calculating Performance...</div>;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        ROI Intelligence
                    </h1>
                    <p className="text-gray-400 mt-2 italic">Workshop throughput & elite detailing metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Total Detailing Jobs"
                    value={totals.jobs}
                    icon={Activity}
                    color="blue"
                />
                <StatCard
                    title="Realized Revenue"
                    value={`AED ${totals.revenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Avg. QC Pass"
                    value={`${(leaderboard.reduce((a, c) => a + c.qc_pass_rate, 0) / (leaderboard.length || 1)).toFixed(1)}%`}
                    icon={CheckCircle}
                    color="amber"
                />
            </div>

            <div className="glass-card overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px'
            }}>
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <Trophy size={20} className="text-[#b08d57]" />
                    <h2 className="text-xl font-bold text-white">Elite Technician Leaderboard</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-widest">
                                <th className="p-6">Technician</th>
                                <th className="p-6">Jobs Closed</th>
                                <th className="p-6">Revenue Contribution</th>
                                <th className="p-6 text-center">QC Precision</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {leaderboard.map((tech, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b08d57] to-black flex items-center justify-center font-bold text-white">
                                                {tech.technician.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-white group-hover:text-[#b08d57] transition-colors">
                                                {tech.technician}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-mono">{tech.jobs_closed}</td>
                                    <td className="p-6 text-green-400 font-bold">AED {tech.revenue_generated.toLocaleString()}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xs">{tech.qc_pass_rate}%</span>
                                            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 transition-all duration-1000"
                                                    style={{ width: `${tech.qc_pass_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        {i === 0 && (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-tighter">Top Performer</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TechnicianAnalytics;
