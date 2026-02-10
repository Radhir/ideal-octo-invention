import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Clock, CheckCircle2, AlertCircle, Camera,
    FileText, Award, ChevronRight, Car
} from 'lucide-react';
import '../../layouts/AppLayout.css';

const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-card ${className}`} style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
        {children}
    </div>
);

const CustomerLiveTracker = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/forms/job-cards/api/portal/${token}/`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Unable to retrieve service status. Please verify your link.');
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [token]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="animate-pulse">Synchronizing Elite Service Data...</div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <GlassCard>
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </GlassCard>
        </div>
    );

    const { job, steps, invoice, warranties } = data;

    return (
        <div className="min-h-screen p-6 md:p-12 text-white" style={{
            background: 'linear-gradient(135deg, #0a0c10 0%, #1a1c24 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-[#b08d57]/20 flex items-center justify-center">
                                <Car className="text-[#b08d57]" size={28} />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Elite Service Live</h1>
                        </div>
                        <p className="text-gray-400">Tracking {job.brand} {job.model} • #{job.job_card_number}</p>
                    </div>

                    <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${job.status === 'CLOSED' ? 'bg-green-400' : 'bg-[#b08d57]'}`} />
                        <span className="text-sm font-medium uppercase tracking-widest text-gray-300">
                            Current: {job.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Status Timeline */}
                <GlassCard className="mb-8">
                    <div className="space-y-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex items-center gap-6 group">
                                {idx !== steps.length - 1 && (
                                    <div className={`absolute left-4 top-10 w-0.5 h-12 transition-colors duration-500 ${step.status === 'completed' ? 'bg-[#b08d57]' : 'bg-white/10'
                                        }`} />
                                )}

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${step.status === 'completed' ? 'bg-[#b08d57] border-[#b08d57]' :
                                    step.status === 'active' ? 'bg-white/10 border-white/40 ring-4 ring-white/5' :
                                        'bg-transparent border-white/10'
                                    }`}>
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 size={16} className="text-white" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${step.status === 'active' ? 'bg-white' : 'bg-transparent'}`} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-semibold tracking-wide transition-colors ${step.status === 'pending' ? 'text-gray-600' : 'text-white'
                                        }`}>
                                        {step.label}
                                    </h3>
                                    {step.status === 'active' && (
                                        <p className="text-sm text-[#b08d57] font-medium mt-1">Our masters are refining your vehicle right now.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual Archive */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Camera size={20} className="text-[#b08d57]" /> Visual Archive
                            </h2>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{job.photos?.length || 0} Assets</span>
                        </div>
                        {job.photos?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {job.photos.map((photo, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                                        <img
                                            src={photo.image}
                                            alt={photo.caption}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-600 italic">
                                Photos will appear once detailing begins.
                            </div>
                        )}
                    </GlassCard>

                    {/* Documentation Hub */}
                    <div className="space-y-8">
                        <GlassCard>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-[#b08d57]">
                                <FileText size={20} /> Digital Archive
                            </h2>
                            {invoice ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-colors">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tax Invoice</p>
                                            <p className="font-bold">{invoice.number}</p>
                                        </div>
                                        <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                                    </div>

                                    {warranties.map((w, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-[#b08d57]/10 border border-[#b08d57]/20 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-[#b08d57] uppercase tracking-widest mb-1">{w.type} Protection</p>
                                                <div className="flex items-center gap-2">
                                                    <Award size={14} />
                                                    <p className="font-bold">{w.certificate_id}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-[#b08d57] text-[10px] font-bold text-white uppercase tracking-tighter">Verified</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    <Clock size={32} className="mx-auto mb-3 text-gray-700" />
                                    <p className="text-sm text-gray-500 italic">Final documentation is generated upon delivery.</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLiveTracker;
