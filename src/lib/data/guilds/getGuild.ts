import { supabase } from 'src/lib/supabase';
import { GuildRow } from 'src/lib/types/guilds';

export async function getGuild(guildId: string): Promise<GuildRow | null> {
  const { data, error } = await supabase
    .from('guilds')
    .select('*')
    .eq('id', guildId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
