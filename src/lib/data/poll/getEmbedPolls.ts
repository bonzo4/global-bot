import { supabase } from 'src/lib/supabase';

export async function getEmbedPolls(embedId: number) {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('embed_id', embedId);

  if (error) {
    return [];
  }

  return data;
}
