import React, { useState, useEffect } from 'react';
import {
    Plus, MapPin, Phone, Mail, Check,
    Globe, Shield, Activity, Search,
    ChevronRight, ArrowLeft, MoreVertical,
    Warehouse, Building2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';

const BranchManagementPage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        is_head_office: false,
        is_active: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/api/locations/branches/');
            setBranches(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch branches", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (branch = null) => {
        if (branch) {
            setFormData(branch);
            setIsEdit(true);
            setEditId(branch.id);
        } else {
            setFormData({
                name: '', code: '', address: '', contact_email: '', contact_phone: '',
                is_head_office: false, is_active: true
            });
            setIsEdit(false);
            setEditId(null);
        }
        setShowForm(true);
        setSelectedBranch(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/api/locations/branches/${editId}/`, formData);
            } else {
                await api.post('/api/locations/branches/', formData);
            }
            fetchBranches();
            setShowForm(false);
            setFormData({
                name: '', code: '', address: '', contact_email: '', contact_phone: '',
                is_head_office: false, is_active: true
            });
        } catch (err) {
            console.error("Error saving branch", err);
            alert("Error saving branch: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen text-white">
            {!showForm && !selectedBranch ? (
                <>
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Globe className="text-blue-400" size={24} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[3px] font-bold text-blue-400">Global Infrastructure</span>
                            </motion.div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Branch Management</h1>
                            <p className="text-white/40 mt-2 font-medium">Coordinate the operational nodes and command centers of the Elite Shine network.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleOpen()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Plus size={16} />
                                Initialize Node
                            </button>
                        </div>
                    </header>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Active Nodes</span>
                            <span className="text-2xl font-bold text-blue-400">{branches.filter(b => b.is_active).length}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Headquarters</span>
                            <span className="text-2xl font-bold text-purple-400">{branches.filter(b => b.is_head_office).length}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Latency</span>
                            <span className="text-2xl font-bold text-green-400">Optimal</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Traffic Pool</span>
                            <span className="text-2xl font-bold text-white/80">Unified</span>
                        </div>
                    </div>

                    {/* Node Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {branches.map((branch, idx) => (
                                <motion.div
                                    key={branch.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedBranch(branch)}
                                    className={`group bg-white/5 border rounded-[30px] p-8 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden ${branch.is_head_office ? 'border-blue-500/40' : 'border-white/10 hover:border-blue-500/30'}`}
                                >
                                    {branch.is_head_office && (
                                        <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                                            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-bold rounded-full uppercase tracking-widest">HQ HUB</div>
                                        </div>
                                    )}

                                    <div className="flex flex-col h-full">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                            {branch.is_head_office ? <Building2 className="text-blue-400" size={28} /> : <Warehouse className="text-white/40" size={28} />}
                                        </div>

                                        <h3 className="text-xl font-bold tracking-tight mb-1">{branch.name}</h3>
                                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 mb-6">{branch.code}</p>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={14} className="text-white/20 shrink-0 mt-0.5" />
                                                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{branch.address}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                    <Zap size={10} className="text-green-500" /> ONLINE
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                    <Shield size={10} className="text-blue-500" /> SECURE
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            ) : showForm ? (
                <div className="max-w-3xl">
                    <button
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <ArrowLeft size={16} /> Return to Infrastructure
                    </button>

                    <h2 className="text-4xl font-extrabold tracking-tighter mb-10">
                        {isEdit ? 'Re-Configure Node' : 'Initialize New Node'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Node Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all"
                                    placeholder="e.g. Dubai Central"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Node Registry Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all"
                                    placeholder="e.g. DXB-01"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Geographic Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all resize-none"
                                placeholder="Full operational coordinates..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Comms Line</label>
                                <input
                                    type="text"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all"
                                    placeholder="+971 XX XXX XXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Network Email</label>
                                <input
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all"
                                    placeholder="hub@eliteshine.pro"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_head_office: !formData.is_head_office })}
                                className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${formData.is_head_office ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                            >
                                {formData.is_head_office && <Check size={12} className="inline mr-2" />}
                                Primary Headquarters
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${formData.is_active ? 'bg-green-600 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                            >
                                {formData.is_active && <Check size={12} className="inline mr-2" />}
                                Operational Status
                            </button>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="px-12 py-4 bg-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                            >
                                {isEdit ? 'Sync Node Data' : 'Initialize Command'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : selectedBranch && (
                <div className="max-w-4xl">
                    <button
                        onClick={() => setSelectedBranch(null)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <ArrowLeft size={16} /> Return to Infrastructure
                    </button>

                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="w-48 h-48 rounded-[40px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center relative shrink-0 overflow-hidden">
                            {selectedBranch.is_head_office ? <Building2 className="text-blue-400" size={64} /> : <Warehouse className="text-white/40" size={64} />}
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10 animate-pulse"></div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-5xl font-extrabold tracking-tighter">{selectedBranch.name}</h1>
                                {selectedBranch.is_head_office && (
                                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Main Hub</div>
                                )}
                            </div>

                            <p className="text-lg font-bold text-blue-400 uppercase tracking-widest family-mono mb-12">{selectedBranch.code}</p>

                            <div className="grid grid-cols-1 gap-4 mb-12">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                                    <MapPin className="text-blue-400 mt-1" size={20} />
                                    <div>
                                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Coordinates</div>
                                        <div className="font-bold text-lg leading-relaxed">{selectedBranch.address}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                                        <Phone className="text-green-400" size={20} />
                                        <div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Comms</div>
                                            <div className="font-bold italic">{selectedBranch.contact_phone || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                                        <Mail className="text-purple-400" size={20} />
                                        <div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Network</div>
                                            <div className="font-bold italic">{selectedBranch.contact_email || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleOpen(selectedBranch)}
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all font-serif"
                                >
                                    Re-Configure Node
                                </button>
                                <button className="px-8 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                                    Operational Audit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[2px] text-white/20">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500/50" /> Global Nexus</span>
                    <span className="flex items-center gap-1.5"><Shield size={12} className="text-green-500/50" /> End-to-End Encryption</span>
                </div>
                <div>Ops OS v3.1</div>
            </footer>
        </div>
    );
};

export default BranchManagementPage;
