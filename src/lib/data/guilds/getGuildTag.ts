import { supabase } from 'src/lib/supabase';

export async function getGuildTag(tag: string) {
  const { data, error } = await supabase
    .from('guilds')
    .select()
    .eq('tag', tag)
    .single();

  if (error) {
    return null;
  }
  return data;
}
