import { supabase } from './supabaseClient';

// Placeholder for email service integration
export const sendNotification = async (to, subject, body) => {
  // In production, integrate with a service like SendGrid, Mailgun, or AWS SES
  console.log(`Email to ${to}: ${subject} - ${body}`);
};

export const notifyNewClick = async (userId, referralTitle) => {
  const { data: user } = await supabase.from('profiles').select('email').eq('id', userId).single();
  if (user?.email) {
    await sendNotification(
      user.email,
      'New Referral Click',
      `Your referral "${referralTitle}" was clicked!`
    );
  }
};

export const notifyPaymentSuccess = async (userId) => {
  const { data: user } = await supabase.from('profiles').select('email').eq('id', userId).single();
  if (user?.email) {
    await sendNotification(
      user.email,
      'Payment Successful',
      'Thank you for upgrading to Pro! Your account has been updated.'
    );
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'welcome',
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export const sendReferralCreatedEmail = async (user, referral) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'referral-created',
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        referralTitle: referral.title,
        referralId: referral.id
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error sending referral created email:', error);
  }
};

export const sendReferralClickedEmail = async (user, referral, clickCount) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'referral-clicked',
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        referralTitle: referral.title,
        clickCount
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error sending referral clicked email:', error);
  }
};

export const sendUpgradeReminderEmail = async (user) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'upgrade-reminder',
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error sending upgrade reminder email:', error);
  }
}; 