import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
    Switch, Typography, Chip
} from '@mui/material';
import { Plus, Edit2, Trash2, MapPin, Phone, Building } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import api from '../../api/axios';

const BranchManagementPage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
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
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await api.put(`/api/locations/branches/${editId}/`, formData);
            } else {
                await api.post('/api/locations/branches/', formData);
            }
            fetchBranches();
            setOpen(false);
        } catch (err) {
            alert("Error saving branch: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    if (loading) return <div style={{ color: 'white' }}>Loading Branches...</div>;

    return (
        <div style={{ padding: '30px', color: '#fff' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <div>
                    <Typography variant="overline" color="primary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>
                        ADMINISTRATION
                    </Typography>
                    <Typography variant="h3" fontWeight="900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Branch Management
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    Add New Branch
                </Button>
            </Box>

            <Grid container spacing={3}>
                {branches.map(branch => (
                    <Grid item xs={12} md={6} lg={4} key={branch.id}>
                        <GlassCard style={{ padding: '25px', height: '100%', position: 'relative', borderLeft: branch.is_head_office ? '4px solid #b08d57' : '1px solid rgba(255,255,255,0.1)' }}>
                            {branch.is_head_office && (
                                <Chip
                                    label="HEAD OFFICE"
                                    size="small"
                                    style={{
                                        position: 'absolute', top: 15, right: 15,
                                        backgroundColor: '#b08d57', color: '#000', fontWeight: 'bold'
                                    }}
                                />
                            )}

                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px'
                                }}>
                                    <Building size={24} color={branch.is_active ? "#fff" : "#666"} />
                                </div>
                                <div>
                                    <Typography variant="h5" fontWeight="bold">{branch.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">Code: {branch.code}</Typography>
                                </div>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <MapPin size={18} color="#94a3b8" style={{ marginTop: 2 }} />
                                    <Typography variant="body2" color="#94a3b8">{branch.address}</Typography>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Phone size={18} color="#94a3b8" />
                                    <Typography variant="body2" color="#94a3b8">{branch.contact_phone}</Typography>
                                </div>
                            </Box>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    startIcon={<Edit2 size={16} />}
                                    onClick={() => handleOpen(branch)}
                                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                >
                                    Edit
                                </Button>
                            </div>
                        </GlassCard>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog Form */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Branch Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Branch Code (Unique)"
                            fullWidth
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Phone"
                                    fullWidth
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography>Set as Head Office</Typography>
                            <Switch
                                checked={formData.is_head_office}
                                onChange={(e) => setFormData({ ...formData, is_head_office: e.target.checked })}
                            />
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography>Active Status</Typography>
                            <Switch
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Save Branch</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BranchManagementPage;
