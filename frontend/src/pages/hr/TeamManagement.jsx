import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
            const res = await axios.get('/hr/api/teams/');
            setTeams(res.data);
        } catch (err) {
            console.error('Error fetching teams', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/hr/api/employees/');
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
                await axios.put(`/hr/api/teams/${editingId}/`, payload);
            } else {
                await axios.post('/hr/api/teams/', payload);
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
            await axios.delete(`/hr/api/teams/${id}/`);
            fetchTeams();
        } catch (err) {
            console.error('Error deleting team', err);
        }
    };

    const handleAddMember = async (teamId, employeeId) => {
        try {
            await axios.post(`/hr/api/teams/${teamId}/add_member/`, { employee_id: employeeId });
            setAddingMemberTo(null);
            fetchTeams();
        } catch (err) {
            console.error('Error adding member', err);
        }
    };

    const handleRemoveMember = async (teamId, employeeId) => {
        try {
            await axios.post(`/hr/api/teams/${teamId}/remove_member/`, { employee_id: employeeId });
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
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
                        <button
                            onClick={() => window.location.href = '/hr'}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>TEAMS</h1>
                    </div>
                    <p style={{ color: '#94a3b8', marginLeft: '37px' }}>Team Management & Member Assignment</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', leader: '', members: [] }); }}
                    style={{ fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'New Team'}
                </button>
            </header>

            {/* Create / Edit Form */}
            {showForm && (
                <GlassCard style={{ padding: '30px', marginBottom: '30px' }}>
                    <h3 style={{ color: '#b08d57', fontWeight: '800', marginBottom: '20px' }}>
                        {editingId ? 'Edit Team' : 'Create New Team'}
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
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Team Leader</label>
                                <select
                                    className="form-control"
                                    value={form.leader}
                                    onChange={(e) => setForm({ ...form, leader: e.target.value })}
                                >
                                    <option value="">-- Select Leader --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.role})</option>
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
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            border: form.members.includes(emp.id) ? '1px solid #b08d57' : '1px solid rgba(255,255,255,0.1)',
                                            background: form.members.includes(emp.id) ? 'rgba(176,141,87,0.2)' : 'rgba(255,255,255,0.03)',
                                            color: form.members.includes(emp.id) ? '#b08d57' : '#94a3b8',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {emp.full_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ fontWeight: '800' }}>
                            {editingId ? 'Update Team' : 'Create Team'}
                        </button>
                    </form>
                </GlassCard>
            )}

            {/* Search */}
            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search teams..."
                    style={{ paddingLeft: '45px', height: '50px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <GlassCard style={{ padding: '20px', textAlign: 'center' }}>
                    <Shield size={22} color="#b08d57" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '8px' }}>{teams.length}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Total Teams</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px', textAlign: 'center' }}>
                    <Users size={22} color="#8400ff" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '8px' }}>
                        {teams.reduce((sum, t) => sum + (t.member_count || 0), 0)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Assigned Members</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px', textAlign: 'center' }}>
                    <Crown size={22} color="#f59e0b" />
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '8px' }}>
                        {teams.filter(t => t.leader).length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>With Leaders</div>
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
                    <GlassCard key={team.id} style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #b08d5733, transparent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(176,141,87,0.2)'
                                }}>
                                    <Users size={24} color="#b08d57" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{team.name}</h3>
                                    {team.description && (
                                        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>{team.description}</p>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                                    background: 'rgba(176,141,87,0.15)', color: '#b08d57'
                                }}>
                                    {team.member_count || 0} members
                                </span>
                                <button onClick={() => handleEdit(team)} style={iconBtnStyle} title="Edit">
                                    <UserPlus size={16} color="#94a3b8" />
                                </button>
                                <button onClick={() => handleDelete(team.id)} style={iconBtnStyle} title="Delete">
                                    <Trash2 size={16} color="#ef4444" />
                                </button>
                                <button onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)} style={iconBtnStyle}>
                                    {expandedTeam === team.id ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                                </button>
                            </div>
                        </div>

                        {/* Leader Badge */}
                        {team.leader_name && (
                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Crown size={14} color="#f59e0b" />
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>Leader:</span>
                                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{team.leader_name}</span>
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
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: '6px'
};

const iconBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px'
};

export default TeamManagement;
