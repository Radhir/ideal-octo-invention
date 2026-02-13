import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ArrowRight, ArrowLeft, Plus, X, Check, Trash2 } from 'lucide-react';

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
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
            setSelectedTeam(null);
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
        setSelectedTeam(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team?')) return;
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

    const getAvailableMembers = (team) => {
        const currentMemberIds = (team.members_detail || []).map(m => m.id);
        return employees.filter(e => !currentMemberIds.includes(e.id));
    };

    if (loading) return <div style={{ padding: '60px', color: 'var(--cream)' }}>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 80px',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '40px'
            }}>
                <button
                    onClick={() => window.location.href = '/hr/hub'}
                    style={{
                        fontSize: '13px',
                        color: 'var(--cream)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <ArrowLeft size={18} /> Back to HR
                </button>
                <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
            </div>

            {!showForm && !selectedTeam ? (
                <>
                    {/* Main Title */}
                    <h1 style={{
                        fontSize: 'clamp(4rem, 12vw, 10rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '600',
                        color: 'var(--cream)',
                        lineHeight: '0.9',
                        marginBottom: '100px',
                        letterSpacing: '-0.02em'
                    }}>
                        TEAM<br />MANAGEMENT
                    </h1>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '60px'
                    }}>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                padding: '18px 40px',
                                background: 'var(--cream)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#0a0a0a',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Create New Team
                        </button>
                    </div>

                    {/* Team Pills */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        maxWidth: '1000px'
                    }}>
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => setSelectedTeam(team)}
                                style={{
                                    padding: '25px 30px',
                                    background: 'transparent',
                                    border: '1.5px solid var(--cream)',
                                    borderRadius: '20px',
                                    color: 'var(--cream)',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-serif)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'var(--cream)';
                                    e.target.style.color = '#0a0a0a';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--cream)';
                                }}
                            >
                                <div>{team.name}</div>
                                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.6 }}>
                                    {team.member_count || 0} members
                                </div>
                            </button>
                        ))}
                    </div>

                    {teams.length === 0 && (
                        <p style={{
                            color: 'rgba(232, 230, 227, 0.6)',
                            fontSize: '15px',
                            marginTop: '40px'
                        }}>
                            No teams created yet. Start by creating your first team.
                        </p>
                    )}
                </>
            ) : showForm ? (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', description: '', leader: '', members: [] }); }}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            transition: 'all 0.3s'
                        }}
                    >
                        ← Back
                    </button>

                    {/* Form Title */}
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {editingId ? 'Edit Team' : 'New Team'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(232, 230, 227, 0.6)',
                                fontSize: '13px',
                                marginBottom: '10px',
                                letterSpacing: '1px'
                            }}>
                                TEAM NAME
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    background: 'transparent',
                                    border: '1px solid rgba(232, 230, 227, 0.3)',
                                    borderRadius: '10px',
                                    color: 'var(--cream)',
                                    fontSize: '16px',
                                    fontFamily: 'var(--font-serif)'
                                }}
                                placeholder="e.g. Detailing Team A"
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(232, 230, 227, 0.6)',
                                fontSize: '13px',
                                marginBottom: '10px',
                                letterSpacing: '1px'
                            }}>
                                DESCRIPTION
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    background: 'transparent',
                                    border: '1px solid rgba(232, 230, 227, 0.3)',
                                    borderRadius: '10px',
                                    color: 'var(--cream)',
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                                placeholder="Brief description..."
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(232, 230, 227, 0.6)',
                                fontSize: '13px',
                                marginBottom: '10px',
                                letterSpacing: '1px'
                            }}>
                                TEAM LEADER
                            </label>
                            <select
                                value={form.leader}
                                onChange={(e) => setForm({ ...form, leader: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(232, 230, 227, 0.3)',
                                    borderRadius: '10px',
                                    color: 'var(--cream)',
                                    fontSize: '15px'
                                }}
                            >
                                <option value="">-- Select Leader --</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.role})</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(232, 230, 227, 0.6)',
                                fontSize: '13px',
                                marginBottom: '15px',
                                letterSpacing: '1px'
                            }}>
                                MEMBERS
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {employees.map(emp => (
                                    <button
                                        key={emp.id}
                                        type="button"
                                        onClick={() => toggleMember(emp.id)}
                                        style={{
                                            padding: '10px 25px',
                                            background: form.members.includes(emp.id) ? 'var(--cream)' : 'transparent',
                                            border: '1px solid var(--cream)',
                                            borderRadius: '50px',
                                            color: form.members.includes(emp.id) ? '#0a0a0a' : 'var(--cream)',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: form.members.includes(emp.id) ? '500' : '300'
                                        }}
                                    >
                                        {form.members.includes(emp.id) && <Check size={14} />}
                                        {emp.full_name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '18px 60px',
                                background: 'var(--cream)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#0a0a0a',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {editingId ? 'Save Changes' : 'Create Team'}
                        </button>
                    </form>
                </>
            ) : selectedTeam && (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => setSelectedTeam(null)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            transition: 'all 0.3s'
                        }}
                    >
                        ← Back to teams
                    </button>

                    {/* Team Name */}
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '20px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedTeam.name}
                    </h2>

                    {selectedTeam.description && (
                        <p style={{
                            color: 'rgba(232, 230, 227, 0.7)',
                            fontSize: '16px',
                            marginBottom: '40px',
                            maxWidth: '600px'
                        }}>
                            {selectedTeam.description}
                        </p>
                    )}

                    {selectedTeam.leader_name && (
                        <div style={{
                            marginBottom: '40px',
                            padding: '20px 30px',
                            background: 'rgba(232, 230, 227, 0.05)',
                            borderRadius: '15px',
                            width: 'fit-content'
                        }}>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '5px' }}>TEAM LEADER</div>
                            <div style={{ fontSize: '18px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                {selectedTeam.leader_name}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '60px' }}>
                        <button
                            onClick={() => handleEdit(selectedTeam)}
                            style={{
                                padding: '15px 35px',
                                background: 'transparent',
                                border: '1.5px solid var(--cream)',
                                borderRadius: '50px',
                                color: 'var(--cream)',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit Team
                        </button>
                        <button
                            onClick={() => handleDelete(selectedTeam.id)}
                            style={{
                                padding: '15px 35px',
                                background: 'transparent',
                                border: '1.5px solid rgba(239, 68, 68, 0.5)',
                                borderRadius: '50px',
                                color: 'rgba(239, 68, 68, 0.8)',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Delete Team
                        </button>
                    </div>

                    {/* Members */}
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--cream)',
                            marginBottom: '30px',
                            fontWeight: '400'
                        }}>
                            Team Members ({selectedTeam.member_count || 0})
                        </h3>

                        {(selectedTeam.members_detail && selectedTeam.members_detail.length > 0) ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                                {selectedTeam.members_detail.map(member => (
                                    <div key={member.id} style={{
                                        padding: '20px',
                                        background: 'rgba(232, 230, 227, 0.03)',
                                        border: '1px solid rgba(232, 230, 227, 0.1)',
                                        borderRadius: '15px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ color: 'var(--cream)', fontSize: '15px', fontWeight: '500' }}>{member.full_name}</div>
                                            <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '13px', marginTop: '3px' }}>{member.role}</div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '5px'
                                            }}
                                        >
                                            <X size={18} color="rgba(239, 68, 68, 0.7)" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '15px', marginBottom: '40px' }}>
                                No members assigned yet.
                            </p>
                        )}

                        {/* Add Member */}
                        <div>
                            <h4 style={{
                                fontSize: '14px',
                                color: 'rgba(232, 230, 227, 0.6)',
                                marginBottom: '15px',
                                letterSpacing: '1px'
                            }}>
                                ADD MEMBER
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {getAvailableMembers(selectedTeam).map(emp => (
                                    <button
                                        key={emp.id}
                                        onClick={() => handleAddMember(selectedTeam.id, emp.id)}
                                        style={{
                                            padding: '10px 25px',
                                            background: 'transparent',
                                            border: '1px solid rgba(232, 230, 227, 0.3)',
                                            borderRadius: '50px',
                                            color: 'rgba(232, 230, 227, 0.7)',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(232, 230, 227, 0.1)';
                                            e.target.style.borderColor = 'var(--cream)';
                                            e.target.style.color = 'var(--cream)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.borderColor = 'rgba(232, 230, 227, 0.3)';
                                            e.target.style.color = 'rgba(232, 230, 227, 0.7)';
                                        }}
                                    >
                                        + {emp.full_name}
                                    </button>
                                ))}
                                {getAvailableMembers(selectedTeam).length === 0 && (
                                    <p style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '14px' }}>
                                        All employees are already in this team.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamManagement;
