import { supabase } from 'src/lib/supabase';

export async function getGlobalChannel(id: string) {
  const { data, error } = await supabase
    .from('global_channels')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    return null;
  }

  return data;
}
