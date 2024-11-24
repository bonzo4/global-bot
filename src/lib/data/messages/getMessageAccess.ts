import { supabase } from 'src/lib/supabase';

export async function getMessageAccess(messageId: number) {
  const { data, error } = await supabase
    .from('message_access')
    .select('*')
    .eq('message_id', messageId);

  if (error) {
    return [];
  }

  return data;
}
