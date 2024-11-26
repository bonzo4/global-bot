import { supabase } from 'src/lib/supabase';
import { InputInteractionInsert } from 'src/lib/types/input';

export async function insertInputInteraction(
  inputInteraction: InputInteractionInsert,
) {
  const { data, error } = await supabase
    .from('input_interactions')
    .insert(inputInteraction)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
