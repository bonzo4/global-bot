import { supabase } from 'src/lib/supabase';

export async function getEmbedLinks(embedId: number) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('embed_id', embedId);

  if (error) {
    return [];
  }

  return data;
}
