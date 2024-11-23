import { supabase } from 'src/lib/supabase';
import { GameStatsInsert } from 'src/lib/types/game';

export default async function insertGameStats(gameStats: GameStatsInsert) {
  const { data, error } = await supabase
    .from('game_stats')
    .insert(gameStats)
    .select('*')
    .single();

  if (error) {
    throw new Error('Failed to insert game stats');
  }

  return data;
}
