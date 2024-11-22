import { supabase } from 'src/lib/supabase';
import { GuildInsert, GuildRow } from 'src/lib/types/guilds';

export async function insertGuild(guild: GuildInsert): Promise<GuildRow> {
  const { data, error } = await supabase
    .from('guilds')
    .insert(guild)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
