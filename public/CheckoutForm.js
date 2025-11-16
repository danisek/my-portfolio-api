import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (result.error) {
      setMessage(`Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent.status === 'succeeded') {
      setMessage('✅ Payment successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
      <p>{message}</p>
    </form>
  );
}

export default CheckoutForm;
