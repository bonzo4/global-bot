import { supabase } from 'src/lib/supabase';
import { GuildUserUpdate } from 'src/lib/types/guilds';

export async function updateGuildUser(
  guildId: string,
  userId: string,
  data: GuildUserUpdate,
) {
  const { error } = await supabase
    .from('_guild_users')
    .update(data)
    .eq('guild_id', guildId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
