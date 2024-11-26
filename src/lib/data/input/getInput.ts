import { supabase } from 'src/lib/supabase';
import { InputRow } from 'src/lib/types/input';

export async function getInput(inputId: number): Promise<InputRow | null> {
  const { data, error } = await supabase
    .from('inputs')
    .select('*')
    .eq('id', inputId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
