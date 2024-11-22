import { supabase } from 'src/lib/supabase';

export async function getAdminChannel(channelId: string) {
  const { data, error } = await supabase
    .from('admin_channels')
    .select('*')
    .eq('channel_id', channelId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAdminChannelByGuild(guildId: string) {
  const { data, error } = await supabase
    .from('admin_channels')
    .select('*')
    .eq('guild_id', guildId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
