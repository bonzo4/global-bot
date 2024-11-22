import { supabase } from 'src/lib/supabase';
import { ChannelRow, ChannelUpdate } from 'src/lib/types/channels';

export async function updateGlobalChannel(
  channelId: string,
  channel: ChannelUpdate,
): Promise<ChannelRow> {
  const { data, error } = await supabase
    .from('global_channels')
    .update(channel)
    .eq('id', channelId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
