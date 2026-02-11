import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Users, UserPlus, Search, Trash2, ArrowLeft,
    Crown, Plus, X, Shield, ChevronDown, ChevronUp
} from 'lucide-react';

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [addingMemberTo, setAddingMemberTo] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', leader: '', members: [] });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTeams();
        fetchEmployees();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await api.get('/hr/api/teams/');
            setTeams(res.data);
        } catch (err) {
            console.error('Error fetching teams', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                description: form.description,
                leader: form.leader || null,
                members: form.members
            };
            if (editingId) {
                await api.put(`/hr/api/teams/${editingId}/`, payload);
            } else {
                await api.post('/hr/api/teams/', payload);
            }
            setShowForm(false);
            setForm({ name: '', description: '', leader: '', members: [] });
            setEditingId(null);
            fetchTeams();
        } catch (err) {
            console.error('Error saving team', err);
            alert('Failed to save team. Check that the name is unique.');
        }
    };

    const handleEdit = (team) => {
        setForm({
            name: team.name,
            description: team.description || '',
            leader: team.leader || '',
            members: team.members_detail ? team.members_detail.map(m => m.id) : []
        });
        setEditingId(team.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        try {
            await api.delete(`/hr/api/teams/${id}/`);
            fetchTeams();
        } catch (err) {
            console.error('Error deleting team', err);
        }
    };

    const handleAddMember = async (teamId, employeeId) => {
        try {
            await api.post(`/hr/api/teams/${teamId}/add_member/`, { employee_id: employeeId });
            setAddingMemberTo(null);
            fetchTeams();
        } catch (err) {
            console.error('Error adding member', err);
        }
    };

    const handleRemoveMember = async (teamId, employeeId) => {
        try {
            await api.post(`/hr/api/teams/${teamId}/remove_member/`, { employee_id: employeeId });
            fetchTeams();
        } catch (err) {
            console.error('Error removing member', err);
        }
    };

    const toggleMember = (empId) => {
        setForm(prev => ({
            ...prev,
            members: prev.members.includes(empId)
                ? prev.members.filter(id => id !== empId)
                : [...prev.members, empId]
        }));
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvailableMembers = (team) => {
        const currentMemberIds = (team.members_detail || []).map(m => m.id);
        return employees.filter(e => !currentMemberIds.includes(e.id));
    };

    return (
        <div style={{ padding: '30px 20px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
                        <button
                            onClick={() => window.location.href = '/hr/hub'}
                            style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--gold)', cursor: 'pointer', padding: '8px', borderRadius: '10px' }}
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>TEAMS</h1>
                    </div>
                    <p style={{ color: 'var(--gold)', marginLeft: '45px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Workforce Structure & Member Assignment</p>
                </div>
                <button
                    className="glass-card"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', leader: '', members: [] }); }}
                    style={{ fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', textTransform: 'uppercase' }}
                >
                    {showForm ? <X size={16} color="var(--gold)" /> : <Plus size={16} color="var(--gold)" />}
                    {showForm ? 'Cancel' : 'New Team'}
                </button>
            </header>

            {/* Create / Edit Form */}
            {showForm && (
                <GlassCard style={{ padding: '30px', marginBottom: '30px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                    <h3 style={{ color: 'var(--gold)', fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase', fontSize: '1.25rem' }}>
                        {editingId ? 'Edit Performance Unit' : 'Initialize New Team'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Team Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    placeholder="e.g. Detailing Bay A"
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--gold-border)', fontWeight: '900' }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Team Leader</label>
                                <select
                                    className="form-control"
                                    value={form.leader}
                                    onChange={(e) => setForm({ ...form, leader: e.target.value })}
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--gold-border)', fontWeight: '900' }}
                                >
                                    <option value="">-- Select Executive Lead --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id} style={{ background: 'var(--bg-primary)' }}>{emp.full_name} ({emp.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--gold-border)', fontWeight: '900' }}
                                placeholder="Brief description of this team's responsibility"
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Members</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {employees.map(emp => (
                                    <button
                                        key={emp.id}
                                        type="button"
                                        onClick={() => toggleMember(emp.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '900',
                                            border: form.members.includes(emp.id) ? '1.5px solid var(--gold)' : '1px solid var(--border-color)',
                                            background: form.members.includes(emp.id) ? 'var(--gold-glow)' : 'var(--bg-glass)',
                                            color: form.members.includes(emp.id) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {emp.full_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="glass-card" style={{ fontWeight: '900', padding: '12px 30px', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', background: 'var(--gold-glow)', cursor: 'pointer', textTransform: 'uppercase' }}>
                            {editingId ? 'COMMIT CHANGES' : 'INITIALIZE UNIT'}
                        </button>
                    </form>
                </GlassCard>
            )}

            {/* Search */}
            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search performance units..."
                    style={{ paddingLeft: '45px', height: '50px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)', fontWeight: '900' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <GlassCard style={{ padding: '20px', textAlign: 'center', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                    <Shield size={24} color="var(--gold)" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '8px' }}>{teams.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>Total Teams</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px', textAlign: 'center', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                    <Users size={24} color="var(--gold)" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '8px' }}>
                        {teams.reduce((sum, t) => sum + (t.member_count || 0), 0)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>Assigned Members</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px', textAlign: 'center', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                    <Crown size={24} color="var(--gold)" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '8px' }}>
                        {teams.filter(t => t.leader).length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>With Leaders</div>
                </GlassCard>
            </div>

            {/* Team Cards */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading Teams...</p>
                ) : filteredTeams.length === 0 ? (
                    <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                        <Users size={48} color="#64748b" />
                        <p style={{ color: '#94a3b8', marginTop: '15px' }}>No teams found. Create your first team above.</p>
                    </GlassCard>
                ) : filteredTeams.map(team => (
                    <GlassCard key={team.id} style={{ padding: '25px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'var(--gold-glow)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1.5px solid var(--gold-border)'
                                }}>
                                    <Users size={24} color="var(--gold)" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>{team.name}</h3>
                                    {team.description && (
                                        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: '900', margin: '4px 0 0', textTransform: 'uppercase' }}>{team.description}</p>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '6px 16px', borderRadius: '6px', fontSize: '10px', fontWeight: '900',
                                    background: 'var(--gold-glow)', color: 'var(--text-primary)', border: '1px solid var(--gold-border)', textTransform: 'uppercase'
                                }}>
                                    {team.member_count || 0} MEMBERS
                                </span>
                                <button onClick={() => handleEdit(team)} style={iconBtnStyle} title="Edit Unit">
                                    <UserPlus size={18} color="var(--gold)" />
                                </button>
                                <button onClick={() => handleDelete(team.id)} style={iconBtnStyle} title="Decommission Unit">
                                    <Trash2 size={18} color="#ef4444" />
                                </button>
                                <button onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)} style={iconBtnStyle}>
                                    {expandedTeam === team.id ? <ChevronUp size={18} color="var(--gold)" /> : <ChevronDown size={18} color="var(--gold)" />}
                                </button>
                            </div>
                        </div>

                        {/* Leader Badge */}
                        {team.leader_name && (
                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Crown size={16} color="var(--gold)" />
                                <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Executive Lead:</span>
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '900' }}>{team.leader_name}</span>
                            </div>
                        )}

                        {/* Expanded Members Section */}
                        {expandedTeam === team.id && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b' }}>
                                        Team Members
                                    </span>
                                    <button
                                        onClick={() => setAddingMemberTo(addingMemberTo === team.id ? null : team.id)}
                                        style={{ ...iconBtnStyle, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#b08d57', fontWeight: '700' }}
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                </div>

                                {/* Add Member Dropdown */}
                                {addingMemberTo === team.id && (
                                    <div style={{
                                        marginBottom: '15px', padding: '12px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)'
                                    }}>
                                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '700' }}>
                                            Select employee to add:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {getAvailableMembers(team).map(emp => (
                                                <button
                                                    key={emp.id}
                                                    onClick={() => handleAddMember(team.id, emp.id)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '15px', fontSize: '11px',
                                                        fontWeight: '700', border: '1px solid rgba(176,141,87,0.3)',
                                                        background: 'rgba(176,141,87,0.1)', color: '#b08d57', cursor: 'pointer'
                                                    }}
                                                >
                                                    + {emp.full_name}
                                                </button>
                                            ))}
                                            {getAvailableMembers(team).length === 0 && (
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>All employees are already in this team.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Member List */}
                                {(team.members_detail && team.members_detail.length > 0) ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                        {team.members_detail.map(member => (
                                            <div key={member.id} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '10px 15px', borderRadius: '10px',
                                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '700' }}>{member.full_name}</div>
                                                    <div style={{ fontSize: '11px', color: '#b08d57' }}>{member.role}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveMember(team.id, member.id)}
                                                    style={{ ...iconBtnStyle, padding: '4px' }}
                                                    title="Remove from team"
                                                >
                                                    <X size={14} color="#ef4444" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>No members assigned yet.</p>
                                )}
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '8px',
    letterSpacing: '1px'
};

const iconBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px'
};

export default TeamManagement;
