import { supabase } from 'src/lib/supabase';

export async function getLastMessage(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('user_id', userId)
    .neq('deleted', true)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    return null;
  }

  return data[0];
}
