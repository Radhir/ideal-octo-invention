import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button,
    Chip, CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { Check } from 'lucide-react';
import api from '../../api/axios';

const MembershipTab = ({ customerId }) => {
    const [plans, setPlans] = useState([]);
    const [mySubscription] = useState(null); // Keeping as null for now as per comment in original
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const plansRes = await api.get('/subscriptions/plans/');
            // ADJUSTMENT: The Subscription ViewSet expects IsAuthenticated. 
            // For now, I will assume the public Plans fetch is AllowAny.
            setPlans(plansRes.data.results || plansRes.data);
        } catch (err) {
            console.error("Error loading membership data", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData, customerId]);

    const handleSubscribe = async (planId) => {
        setSubmitting(true);
        try {
            await api.post('/subscriptions/my-subscriptions/subscribe/', {
                plan_id: planId,
                customer_id: customerId
            });
            alert("Membership activated successfully!");
            loadData();
        } catch (err) {
            alert("Failed to subscribe: " + (err.response?.data?.error || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box mb={4} textAlign="center">
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Upgrade Your Care
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Join our exclusive membership plans for premium benefits and priority service.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {plans.map((plan) => {
                    const isCurrent = mySubscription?.plan?.id === plan.id;
                    return (
                        <Grid item xs={12} md={4} key={plan.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    border: isCurrent ? '2px solid #b08d57' : '1px solid rgba(255,255,255,0.1)',
                                    transform: isCurrent ? 'scale(1.05)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isCurrent && (
                                    <Chip
                                        label="CURRENT PLAN"
                                        color="primary"
                                        size="small"
                                        sx={{ position: 'absolute', top: 10, right: 10 }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {plan.name}
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {plan.currency} {parseFloat(plan.price)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                                        per {plan.interval === 'YEARLY' ? 'year' : 'month'}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <List dense>
                                        {(plan.features || []).map((feature, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <Check size={16} color="#4caf50" />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} />
                                            </ListItem>
                                        ))}
                                        {(!plan.features || plan.features.length === 0) && (
                                            <Typography variant="body2" color="textSecondary">
                                                Includes standard benefits.
                                            </Typography>
                                        )}
                                    </List>
                                </CardContent>
                                <Box p={2}>
                                    <Button
                                        variant={isCurrent ? "outlined" : "contained"}
                                        fullWidth
                                        color="primary"
                                        disabled={isCurrent || submitting}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {isCurrent ? 'Active' : 'Subscribe Now'}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default MembershipTab;
