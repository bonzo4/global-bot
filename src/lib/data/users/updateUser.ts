import { supabase } from 'src/lib/supabase';
import { UserRow, UserUpdate } from 'src/lib/types/user';

export async function updateUser(
  userId: string,
  user: UserUpdate,
): Promise<UserRow> {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
