import { supabase } from 'src/lib/supabase';
import { FlipInsert } from 'src/lib/types/game';

export async function insertGameFlip(flip: FlipInsert) {
  const { data, error } = await supabase
    .from('game_flips')
    .insert(flip)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
