import { supabase } from 'src/lib/supabase';

export async function getGameFlip(id: number) {
  const { data, error } = await supabase
    .from('game_flips')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
