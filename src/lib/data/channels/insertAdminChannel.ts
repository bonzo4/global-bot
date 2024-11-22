import { supabase } from 'src/lib/supabase';
import { AdminChannelInsert } from 'src/lib/types/channels';

export async function insertAdminChannel(channel: AdminChannelInsert) {
  const { data, error } = await supabase
    .from('admin_channels')
    .insert(channel)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
