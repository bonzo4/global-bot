import { supabase } from 'src/lib/supabase';
import { Database } from 'src/lib/supabase/types';

type ErrorInsert = Database['public']['Tables']['bot_errors']['Insert'];

export async function insertError(error: ErrorInsert): Promise<void> {
  await supabase.from('bot_errors').insert(error);
}
