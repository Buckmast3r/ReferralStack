import { supabase } from '../utils/supabaseClient';

export const referralService = {
  async getReferrals() {
    const { data, error } = await supabase
      .from('referrals')
      .select('*');
    if (error) throw error;
    return data;
  },

  async addReferral(referral) {
    const { data, error } = await supabase
      .from('referrals')
      .insert([referral]);
    if (error) throw error;
    return data[0];
  },

  async deleteReferral(id) {
    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};