import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Box, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, TextField, InputAdornment, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Chip,
    Menu, LinearProgress
} from '@mui/material';
import {
    Search, Filter, Upload, FileText,
    MoreVertical, Download, Trash2, Share2, Eye
} from 'lucide-react';
import api from '../../api/axios';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [categories, setCategories] = useState([]); // Fetch from API

    // Upload State
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadData, setUploadData] = useState({
        title: '',
        category: '',
        access_level: 'RESTRICTED',
        description: ''
    });

    useEffect(() => {
        loadDocuments();
        loadCategories();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await api.get('/documents/files/');
            setDocuments(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/documents/categories/');
            setCategories(response.data.results || response.data);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', uploadData.title);
        formData.append('category', uploadData.category);
        formData.append('access_level', uploadData.access_level);
        formData.append('description', uploadData.description);
        // document_number needs to be generated or handled by backend. 
        // Assuming backend handles it or I need to add logic? 
        // Model has unique document_number. I'll let backend handle/generate or add random if it errors.
        // For now, let's assume backend auto-generates or user inputs. 
        // I'll add a simple generator for now if needed, but standard is backend logic or user input.
        // I'll add `document_number` to uploadData just in case.
        formData.append('document_number', `DOC-${Date.now()}`);

        try {
            await api.post('/documents/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadDialogOpen(false);
            loadDocuments();
            setUploadFile(null); // Reset
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + (error.response?.data?.detail || error.message));
        }
    };

    // Menu Handling (placeholder logic)
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const handleMenuClick = (event, doc) => {
        setAnchorEl(event.currentTarget);
        setSelectedDoc(doc);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDoc(null);
    };

    const handleDownload = () => {
        if (selectedDoc) {
            window.open(selectedDoc.file, '_blank');
        }
        handleMenuClose();
    }

    const handleDelete = async () => {
        if (selectedDoc && window.confirm("Are you sure?")) {
            try {
                await api.delete(`/documents/files/${selectedDoc.id}/`);
                loadDocuments();
            } catch (err) {
                console.error(err);
            }
        }
        handleMenuClose();
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Document Management</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Upload size={20} />}
                        onClick={() => setUploadDialogOpen(true)}
                    >
                        Upload Document
                    </Button>
                </Box>
            </Paper>

            {/* Search and Filters */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Category"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MenuItem value="ALL">All Categories</MenuItem>
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Documents Table */}
            <TableContainer component={Paper}>
                {loading && <LinearProgress />}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Document</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents
                            .filter(doc =>
                                (categoryFilter === 'ALL' || doc.category === categoryFilter) &&
                                (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    doc.document_number.includes(searchQuery))
                            )
                            .map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <FileText size={20} color="#666" />
                                            <Box ml={2}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {doc.title}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {doc.document_number}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={doc.category_name || 'General'} size="small" />
                                    </TableCell>
                                    <TableCell>{doc.owner_name}</TableCell>
                                    <TableCell>v{doc.version}</TableCell>
                                    <TableCell>
                                        {/* Status chip logic */}
                                        <Chip label="Active" color="success" size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(doc.updated_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuClick(e, doc)}>
                                            <MoreVertical size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {!loading && documents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No documents found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDownload}><Download size={16} style={{ marginRight: 8 }} /> Download</MenuItem>
                <MenuItem onClick={() => { alert('View'); handleMenuClose(); }}><Eye size={16} style={{ marginRight: 8 }} /> View Details</MenuItem>
                <MenuItem onClick={() => { alert('Share'); handleMenuClose(); }}><Share2 size={16} style={{ marginRight: 8 }} /> Share</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Trash2 size={16} style={{ marginRight: 8 }} /> Delete</MenuItem>
            </Menu>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Document Title"
                                value={uploadData.title}
                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={uploadData.category}
                                    label="Category"
                                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                >
                                    {categories.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Access Level</InputLabel>
                                <Select
                                    value={uploadData.access_level}
                                    label="Access Level"
                                    onChange={(e) => setUploadData({ ...uploadData, access_level: e.target.value })}
                                >
                                    <MenuItem value="PUBLIC">Public</MenuItem>
                                    <MenuItem value="RESTRICTED">Restricted</MenuItem>
                                    <MenuItem value="CONFIDENTIAL">Confidential</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={uploadData.description}
                                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<Upload />}
                            >
                                {uploadFile ? uploadFile.name : 'Select File'}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpload} disabled={!uploadFile || !uploadData.title}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DocumentManager;
