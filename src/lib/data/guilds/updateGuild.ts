import { supabase } from 'src/lib/supabase';
import { GuildUpdate } from 'src/lib/types/guilds';

export async function updateGuild(
  guildId: string,
  guildData: GuildUpdate,
): Promise<void> {
  const { error } = await supabase
    .from('guilds')
    .update(guildData)
    .eq('id', guildId);
  if (error) {
    throw new Error(error.message);
  }
}
