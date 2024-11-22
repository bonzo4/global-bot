import { supabase } from 'src/lib/supabase';
import { UserInsert, UserRow } from 'src/lib/types/user';

export async function insertUser(user: UserInsert): Promise<UserRow> {
  const { data, error } = await supabase.from('users').insert(user).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
