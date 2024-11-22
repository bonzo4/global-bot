import { supabase } from 'src/lib/supabase';

export async function getGameStats(userId: string) {
  const { data, error } = await supabase
    .from('game_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
