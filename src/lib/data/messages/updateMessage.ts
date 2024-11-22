import { supabase } from 'src/lib/supabase';
import { MessageRow, MessageUpdate } from 'src/lib/types/messages';

export async function updateMessage(
  id: string,
  message: MessageUpdate,
): Promise<MessageRow> {
  const { data, error } = await supabase
    .from('messages')
    .update(message)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
