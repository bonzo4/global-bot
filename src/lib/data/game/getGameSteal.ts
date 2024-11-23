import { supabase } from 'src/lib/supabase';

export async function getGameSteal(id: number) {
  const { data, error } = await supabase
    .from('game_steals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
