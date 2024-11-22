import { supabase } from 'src/lib/supabase';
import { UserRow } from 'src/lib/types/user';

export async function getUser(userId: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
