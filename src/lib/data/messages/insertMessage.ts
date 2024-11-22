import { supabase } from 'src/lib/supabase';
import { MessageInsert, MessageRow } from 'src/lib/types/messages';

export async function insertMessage(
  message: MessageInsert,
): Promise<MessageRow> {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
