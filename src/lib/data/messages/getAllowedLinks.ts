import { supabase } from 'src/lib/supabase';

export async function getAllowedLinks() {
  const { data, error } = await supabase.from('allowed_links').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
