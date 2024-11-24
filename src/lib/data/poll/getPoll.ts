import { supabase } from 'src/lib/supabase';

export async function getPoll(pollId: number) {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('id', pollId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
