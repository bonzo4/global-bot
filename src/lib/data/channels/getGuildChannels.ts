import { supabase } from 'src/lib/supabase';
import { ChannelRow } from 'src/lib/types/channels';

export async function getGuildChannels(guildId: string): Promise<ChannelRow[]> {
  const { data, error } = await supabase
    .from('global_channels')
    .select('*')
    .eq('guild_id', guildId);

  if (error) {
    return [];
  }

  return data;
}
