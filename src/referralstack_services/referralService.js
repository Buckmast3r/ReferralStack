import { supabase } from '../utils/supabaseClient';

export const referralService = {
  async getReferrals() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error.message);
      throw error;
    }
    return data || [];
  },

  async addReferral(referralData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in, cannot add referral.");
      throw new Error("User must be logged in to add a referral.");
    }

    const dataToInsert = {
      app: referralData.app,
      description: referralData.description,
      url: referralData.link,
      category: referralData.category,
      program_name: referralData.program_name,
      company_logo_url: referralData.company_logo_url,
      user_id: user.id,
    };
    
    Object.keys(dataToInsert).forEach(key => {
        if (dataToInsert[key] === undefined || dataToInsert[key] === '') {
             if (key === 'category' || key === 'program_name' || key === 'company_logo_url') {
                 dataToInsert[key] = null;
             }
        }
    });

    const { data, error } = await supabase
      .from('referrals')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error in referralService.addReferral inserting data:', error.message);
      throw error;
    }
    return data;
  },

  async deleteReferral(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in, cannot delete referral.");
      throw new Error("User must be logged in to delete a referral.");
    }

    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error deleting referral:', error.message);
      throw error;
    }
  }
};