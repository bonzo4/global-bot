import { supabase } from 'src/lib/supabase';
import { PollInteractionInsert } from 'src/lib/types/poll';

export async function insertPollInteraction(
  pollInteraction: PollInteractionInsert,
) {
  const { data, error } = await supabase
    .from('poll_interactions')
    .insert(pollInteraction)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
