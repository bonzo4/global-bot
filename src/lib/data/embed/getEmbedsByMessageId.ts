import { supabase } from 'src/lib/supabase';

export async function getEmbedsByMessageId(messageId: number) {
  const { data, error } = await supabase
    .from('embeds')
    .select('*')
    .eq('message', messageId);

  if (error) {
    return [];
  }

  return data;
}
