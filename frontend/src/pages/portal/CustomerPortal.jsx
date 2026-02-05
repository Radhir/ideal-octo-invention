import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography,
    Box, Card, CardContent, Button,
    CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import api from '../../api/axios'; // Adjust path as necessary
import {
    Wrench as CarRepair,
    ReceiptText as Receipt,
    History as HistoryIcon,
    Star as StarIcon,
    Calendar as Schedule,
    Image as Photo
} from 'lucide-react';
import MembershipTab from '../../components/portal/MembershipTab';

const CustomerPortal = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (token) verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await api.post('/customer-portal/portal/verify_token/', {
                token: token
            });
            setCustomer(response.data);
            loadDashboardData(response.data.id);
        } catch (err) {
            setError('Invalid or expired access link. Please request a new one.');
            setLoading(false);
        }
    };

    const loadDashboardData = async (customerId) => {
        try {
            const [jobsRes, invoicesRes, statsRes] = await Promise.all([
                api.get(`/customer-portal/my-jobs/?customer_id=${customerId}`),
                api.get(`/customer-portal/invoices/?customer_id=${customerId}`),
                api.get(`/customer-portal/portal/dashboard_stats/?customer_id=${customerId}`)
            ]);

            setJobs(jobsRes.data.results || jobsRes.data);
            setInvoices(invoicesRes.data.results || invoicesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/portal/request-access')}
                >
                    Request New Access Link
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Welcome back, {customer?.name}!
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Member since {new Date(customer?.member_since).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h6" color="primary">
                            {customer?.loyalty_points}
                        </Typography>
                        <Typography variant="body2">Loyalty Points</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <CarRepair size={24} />
                                <Box ml={2}>
                                    <Typography variant="h6">{stats.active_jobs || 0}</Typography>
                                    <Typography variant="body2">Active Jobs</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <HistoryIcon size={24} />
                                <Box ml={2}>
                                    <Typography variant="h6">{stats.total_jobs || 0}</Typography>
                                    <Typography variant="body2">Total Jobs</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Receipt size={24} />
                                <Box ml={2}>
                                    <Typography variant="h6">
                                        ${(stats.total_spent || 0).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">Total Spent</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <StarIcon size={24} />
                                <Box ml={2}>
                                    <Typography variant="h6">{stats.warranties_active || 0}</Typography>
                                    <Typography variant="body2">Active Warranties</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Paper sx={{ p: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="My Jobs" icon={<CarRepair size={20} />} />
                    <Tab label="Invoices" icon={<Receipt size={20} />} />
                    <Tab label="Book New Service" icon={<Schedule size={20} />} />
                    <Tab label="Memberships" icon={<StarIcon size={20} />} />
                    <Tab label="Feedback" icon={<StarIcon size={20} />} />
                </Tabs>

                {activeTab === 0 && <JobList jobs={jobs} navigate={navigate} />}
                {activeTab === 1 && <InvoiceList invoices={invoices} navigate={navigate} />}
                {/* Placeholders for now */}
                {activeTab === 2 && <Typography variant="body1" p={2}>Booking Form Coming Soon</Typography>}
                {activeTab === 3 && <MembershipTab customerId={customer?.id} />}
                {activeTab === 4 && <Typography variant="body1" p={2}>Feedback Form Coming Soon</Typography>}
            </Paper>
        </Container>
    );
};

// Job List Component
const JobList = ({ jobs, navigate }) => (
    <Grid container spacing={3}>
        {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h6">Job #{job.job_number}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {job.vehicle_details?.make} {job.vehicle_details?.model}
                                </Typography>
                                <Typography variant="body2">
                                    Status: <strong>{job.current_status_display}</strong>
                                </Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="h6">
                                    ${parseFloat(job.total_estimated_cost || 0).toLocaleString()}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => navigate(`/portal/jobs/${job.id}`)}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Box>
                        {job.notes_for_customer && (
                            <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> {job.notes_for_customer}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

// Invoice List Component
const InvoiceList = ({ invoices, navigate }) => (
    <Grid container spacing={3}>
        {invoices.map((invoice) => (
            <Grid item xs={12} key={invoice.id}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h6">Invoice #{invoice.invoice_number}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {/* Job Number linking might need adjustment depending on API data */}
                                    {new Date(invoice.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    Status:
                                    <span style={{
                                        color: invoice.payment_status === 'PAID' ? 'green' : 'orange',
                                        fontWeight: 'bold',
                                        marginLeft: 8
                                    }}>
                                        {invoice.payment_status}
                                    </span>
                                </Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="h6">
                                    ${parseFloat(invoice.total_amount).toLocaleString()}
                                </Typography>
                                {invoice.payment_status === 'PENDING' && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/payment/${invoice.id}`)}
                                    >
                                        Pay Now
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

export default CustomerPortal;
