import { supabase } from 'src/lib/supabase';

export async function getInputInteractions(inputId: number, userId: string) {
  const { data, error } = await supabase
    .from('input_interactions')
    .select('*')
    .eq('input_id', inputId)
    .eq('user_id', userId);

  if (error) {
    return [];
  }

  return data;
}
