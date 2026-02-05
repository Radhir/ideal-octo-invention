import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button, Box, Alert, CircularProgress } from '@mui/material';

const CheckoutForm = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/payment/success', // We'll handle success here or via redirect
            },
            redirect: 'if_required', // Handle success without redirect if possible
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment successful!');
            setIsProcessing(false);
            if (onSuccess) onSuccess(paymentIntent);
        } else {
            setMessage('Unexpected state');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {message && <Alert severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
                <Button
                    disabled={isProcessing || !stripe || !elements}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                >
                    {isProcessing ? <CircularProgress size={24} /> : `Pay AED ${amount}`}
                </Button>
            </Box>
        </form>
    );
};

export default CheckoutForm;
