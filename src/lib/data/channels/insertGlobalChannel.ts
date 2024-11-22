import { supabase } from 'src/lib/supabase';
import { ChannelInsert, ChannelRow } from 'src/lib/types/channels';

export async function insertGlobalChannel(
  channel: ChannelInsert,
): Promise<ChannelRow> {
  const { data, error } = await supabase
    .from('global_channels')
    .insert(channel)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
