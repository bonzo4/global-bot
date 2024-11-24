import { supabase } from 'src/lib/supabase';

export async function getPollChoice(choiceId: number) {
  const { data, error } = await supabase
    .from('poll_choices')
    .select('*')
    .eq('id', choiceId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
