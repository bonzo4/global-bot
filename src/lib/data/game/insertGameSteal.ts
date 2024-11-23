import { supabase } from 'src/lib/supabase';
import { StealInsert } from 'src/lib/types/game';

export async function insertGameSteal(steal: StealInsert) {
  const { data, error } = await supabase
    .from('game_steals')
    .insert(steal)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
