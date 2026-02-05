import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Container, Paper, Typography, Box, Skeleton } from '@mui/material';
import api from '../../api/axios';
import CheckoutForm from '../../components/payments/CheckoutForm';

// Replace with your actual publishable key or env var
const stripePromise = loadStripe('pk_test_placeholder');

const PaymentPage = () => {
    const { invoiceId } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceAndIntent();
        }
    }, [invoiceId]);

    const fetchInvoiceAndIntent = async () => {
        try {
            // Fetch Invoice Details first
            const invoiceRes = await api.get(`/invoices/${invoiceId}/`);
            setInvoice(invoiceRes.data);

            // Create Payment Intent
            const intentRes = await api.post('/payments/create-payment-intent/', {
                invoice_id: invoiceId
            });
            setClientSecret(intentRes.data.clientSecret);
        } catch (error) {
            console.error("Error initializing payment:", error);
            alert("Failed to initialize payment.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        alert("Payment Successful! Thank you.");
        navigate('/customer-portal'); // Redirect back to portal
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Skeleton variant="rectangular" height={400} />
            </Container>
        );
    }

    if (!invoice || !clientSecret) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Typography color="error">Invalid Invoice or Payment Configuration</Typography>
            </Container>
        );
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#b08d57',
            },
        },
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 10 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: '#1e293b', color: '#fff' }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#b08d57', fontWeight: 'bold' }}>
                    Secure Payment
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Invoice #{invoice.invoice_number}
                </Typography>
                <Typography variant="h4" sx={{ my: 3, fontWeight: 'bold' }}>
                    AED {invoice.balance_due}
                </Typography>

                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm amount={invoice.balance_due} onSuccess={handlePaymentSuccess} />
                </Elements>
            </Paper>
        </Container>
    );
};

export default PaymentPage;
