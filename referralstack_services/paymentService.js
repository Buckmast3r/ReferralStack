export const paymentService = {
  async createCheckoutSession() {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan: 'pro' }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('Checkout session creation failed.');
    }
  }
};