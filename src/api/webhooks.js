import Stripe from 'stripe';
import { supabase } from '../utils/supabaseClient';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Update user's subscription status in your database
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_id: session.subscription,
            payment_status: 'paid'
          })
          .eq('id', session.metadata.userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        // Update subscription status in your database
        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            payment_status: subscription.status === 'active' ? 'paid' : 'free'
          })
          .eq('subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Update user's subscription status in your database
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            payment_status: 'free'
          })
          .eq('subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Handle failed payment
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
            payment_status: 'failed'
          })
          .eq('subscription_id', invoice.subscription);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
}; 