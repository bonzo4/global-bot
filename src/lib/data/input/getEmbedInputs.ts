import { supabase } from 'src/lib/supabase';

export async function getEmbedInputs(embedId: number) {
  const { data, error } = await supabase
    .from('inputs')
    .select('*')
    .eq('embed_id', embedId);

  if (error) {
    return [];
  }

  return data;
}
