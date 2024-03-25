// PayPalButtonComponent.jsx
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const PayPalButtonComponent = ({ total }) => {
    const formattedTotal = parseFloat(total).toFixed(2);
    if (isNaN(formattedTotal) || formattedTotal <= 0) {
        console.error("Total amount must be greater than zero.");
        return null; // Or handle this case as appropriate in your app
    }
    // Setup for PayPal with initial options
    const initialOptions = {
        "client-id": "AUA4GvhFzTYHrGimYKaPYEOAo1R4GNAEmKY0EEKt7pRQvkKqyQYWEUuDIW7foKuGXuDsxfOmAlWiwioD", // Replace with your PayPal client ID
        currency: "USD",
        intent: "capture", // or "authorize"
    };

    const handleCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: { value: formattedTotal.toString() }, // Total amount to charge
            }],
        });
    };

    const handleApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            // Here, you can call your backend API to verify the transaction
            fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from your backend
                    console.log(data);
                });
        });
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
            />
        </PayPalScriptProvider>
    );
};
