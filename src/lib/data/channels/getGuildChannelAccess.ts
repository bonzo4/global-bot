import { supabase } from 'src/lib/supabase';

export async function getGuildChannelAccess(guildId: string) {
  const { data, error } = await supabase
    .from('guild_channel_access')
    .select('*')
    .eq('guild_id', guildId);

  if (error) {
    return [];
  }

  return data;
}
