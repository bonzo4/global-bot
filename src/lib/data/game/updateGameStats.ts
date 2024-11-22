import { supabase } from 'src/lib/supabase';
import { GameStatsUpdate } from 'src/lib/types/user';

export async function updateGameStats(
  userId: string,
  gameStats: GameStatsUpdate,
) {
  const { data, error } = await supabase
    .from('game_stats')
    .update(gameStats)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error('Failed to update game stats');
  }

  return data;
}
