import { supabase } from '../utils/apiClient';

export const analyticsService = {
  async trackClick(referralId) {
    const { error } = await supabase
      .from('analytics')
      .insert([{ referral_id: referralId, timestamp: new Date() }]);
    if (error) throw error;
  },

  async getReferralStats(referralId) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('referral_id', referralId);
    if (error) throw error;
    return data;
  }
};