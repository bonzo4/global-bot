import { supabase } from 'src/lib/supabase';

export async function getPollChoices(pollId: number) {
  const { data, error } = await supabase
    .from('poll_choices')
    .select('*')
    .eq('poll_id', pollId);

  if (error) {
    return [];
  }

  return data;
}
