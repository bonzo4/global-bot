import { supabase } from 'src/lib/supabase';

export async function getHookMessage(messageId: number) {
  const { data, error } = await supabase
    .from('hook_messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
