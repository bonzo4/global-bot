import { supabase } from 'src/lib/supabase';

export async function getPollInteractions(pollId: number, userId: string) {
  const { data, error } = await supabase
    .from('poll_interactions')
    .select('*')
    .eq('poll_id', pollId)
    .eq('user_id', userId);

  if (error) {
    return [];
  }

  return data;
}
