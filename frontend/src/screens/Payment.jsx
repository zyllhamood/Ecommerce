import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { payments } from '@square/web-sdk';

const Payment = ({ onPaymentMethodGenerated }) => {
    const cardContainerRef = useRef(null);

    useEffect(() => {
        const initializeCard = async () => {
            if (!cardContainerRef.current) return;

            try {
                const paymentsInstance = await payments('sandbox-sq0idb-qD7ypI7FWKfTxsP2SvNigw', 'LPFEGKNBG0TWT');
                const card = await paymentsInstance.card();
                await card.attach(cardContainerRef.current);

                document.getElementById('payment-form').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const result = await card.tokenize();
                    if (result.status === 'OK') {
                        onPaymentMethodGenerated(result.token);
                    } else {
                        console.error('Tokenization failed:', result.errors);
                    }
                });
            } catch (error) {
                console.error('Failed to initialize payment card:', error);
            }
        };

        initializeCard();
    }, [onPaymentMethodGenerated]);

    return (
        <Box>
            <form id="payment-form">
                <div ref={cardContainerRef} />
                <button type="submit">Pay</button>
            </form>
        </Box>
    );
};

export default Payment;
