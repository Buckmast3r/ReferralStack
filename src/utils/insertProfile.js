import { supabase } from '../utils/supabaseClient';

export async function insertProfile(user) {
  if (!user) return false;

  const { id, email } = user;

  const { error } = await supabase.from('profiles').insert([
    {
      id: id,
      email: email,
      username: email.split('@')[0], // default username = email prefix
      full_name: '',
      avatar_url: ''
    }
  ]);

  if (error) {
    console.error('Error inserting profile:', error.message);
    return false;
  }

  return true;
} 