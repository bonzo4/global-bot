import { supabase } from 'src/lib/supabase';

export async function getEmbed(embedId: number) {
  const { data, error } = await supabase
    .from('embeds')
    .select('*')
    .eq('id', embedId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
