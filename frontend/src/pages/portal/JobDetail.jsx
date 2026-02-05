import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Paper, Typography, Box,
    Stepper, Step, StepLabel, Button,
    Grid, Card, CardContent, Chip,
    CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import {
    CheckCircle, Clock, AlertCircle,
    DollarSign, Truck, Camera
} from 'lucide-react';
import api from '../../api/axios';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [activePhotoTab, setActivePhotoTab] = useState(0);

    const STAGES = [
        'RECEPTION', 'ESTIMATION', 'WORK_ASSIGNMENT',
        'WIP', 'QC', 'INVOICING', 'DELIVERY', 'CLOSED'
    ];

    useEffect(() => {
        loadJobDetails();
    }, [id]);

    const loadJobDetails = async () => {
        try {
            const [jobRes, photosRes] = await Promise.all([
                api.get(`/customer-portal/my-jobs/${id}/`),
                api.get(`/customer-portal/my-jobs/${id}/photos/`)
            ]);
            setJob(jobRes.data);
            setPhotos(photosRes.data);
        } catch (err) {
            console.error('Error loading job details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStageIcon = (stage, currentStage) => {
        const stageIndex = STAGES.indexOf(stage);
        const currentIndex = STAGES.indexOf(currentStage);

        if (stageIndex < currentIndex) return <CheckCircle color="green" />;
        if (stageIndex === currentIndex) return <Clock color="orange" />;
        return <AlertCircle color="gray" />;
    };

    const handleApproveEstimate = async () => {
        if (window.confirm('Are you sure you want to approve this estimate?')) {
            try {
                await api.post(`/customer-portal/my-jobs/${id}/approve_estimate/`);
                setJob({ ...job, status: 'WORK_ASSIGNMENT', current_status_display: 'Work Assignment' });
                alert('Estimate approved successfully!');
            } catch (err) {
                alert('Error approving estimate');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!job) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">Job not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Job Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4">Job #{job.job_number}</Typography>
                        <Typography variant="body1" color="textSecondary">
                            {job.vehicle_details?.make} {job.vehicle_details?.model} •
                            {job.vehicle_details?.license_plate}
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="h5" color="primary">
                            ${parseFloat(job.total_estimated_cost || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">Estimated Total</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Workflow Stepper */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Job Progress</Typography>
                <Stepper activeStep={STAGES.indexOf(job.status)} alternativeLabel>
                    {STAGES.map((stage) => (
                        <Step key={stage}>
                            <StepLabel
                                icon={getStageIcon(stage, job.status)}
                                StepIconProps={{ completed: STAGES.indexOf(stage) < STAGES.indexOf(job.status) }}
                            >
                                {stage.replace('_', ' ')}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column - Job Details */}
                <Grid item xs={12} md={8}>
                    {/* Services */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Services</Typography>
                        <Grid container spacing={2}>
                            {job.services?.map((service, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1">{service.name}</Typography>
                                            <Typography variant="h6" color="primary">
                                                ${service.price}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {!job.services?.length && <Typography variant="body2">No specific services listed.</Typography>}
                        </Grid>
                    </Paper>

                    {/* Photos */}
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Camera size={20} />
                            <Typography variant="h6" ml={1}>Progress Photos</Typography>
                        </Box>

                        <Tabs
                            value={activePhotoTab}
                            onChange={(e, val) => setActivePhotoTab(val)}
                            sx={{ mb: 2 }}
                        >
                            <Tab label="All" />
                            <Tab label="Before" />
                            <Tab label="During" />
                            <Tab label="After" />
                        </Tabs>

                        <Grid container spacing={2}>
                            {photos
                                .filter(photo =>
                                    activePhotoTab === 0 ||
                                    photo.stage === ['All', 'BEFORE', 'DURING', 'AFTER'][activePhotoTab]
                                )
                                .map((photo) => (
                                    <Grid item xs={6} md={4} key={photo.id}>
                                        <Card>
                                            <img
                                                src={photo.thumbnail_url || photo.image}
                                                alt={photo.description}
                                                style={{ width: '100%', height: 150, objectFit: 'cover' }}
                                            />
                                            <CardContent>
                                                <Typography variant="caption" color="textSecondary">
                                                    {photo.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            {photos.length === 0 && <Typography variant="body2" p={2}>No photos available.</Typography>}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Column - Actions & Info */}
                <Grid item xs={12} md={4}>
                    {/* Status Card */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Current Status</Typography>
                        <Box textAlign="center" py={2}>
                            <Chip
                                label={job.current_status_display}
                                color={
                                    job.status === 'CLOSED' ? 'success' :
                                        job.status === 'WIP' ? 'warning' :
                                            job.status === 'ESTIMATION' ? 'info' : 'default'
                                }
                                size="large"
                                sx={{ fontSize: '1.1rem', p: 2 }}
                            />
                        </Box>

                        {job.status === 'ESTIMATION' && (
                            <Box mt={3}>
                                <Typography variant="body2" gutterBottom>
                                    Please review and approve the estimate to proceed
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleApproveEstimate}
                                >
                                    Approve Estimate
                                </Button>
                            </Box>
                        )}

                        {job.estimated_completion && (
                            <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
                                <Box display="flex" alignItems="center">
                                    <Clock size={18} />
                                    <Typography variant="body2" ml={1}>
                                        <strong>Estimated Completion:</strong><br />
                                        {typeof job.estimated_completion === 'string' ? new Date(job.estimated_completion).toLocaleString() : job.estimated_completion}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {/* Contact Information */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Contact & Support</Typography>
                        <Box mt={2}>
                            <Typography variant="body2">
                                <strong>Service Advisor:</strong><br />
                                {job.assigned_advisor?.name || 'Not assigned'}
                                {/* Note: Serializer didn't return assigned_advisor. Might be missing in backend or fields not expanded. */}
                            </Typography>
                            <Typography variant="body2" mt={1}>
                                For questions, please contact our support.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default JobDetail;
