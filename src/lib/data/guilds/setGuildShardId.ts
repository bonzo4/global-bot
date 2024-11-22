import { supabase } from 'src/lib/supabase';

export async function setGuildShardId(
  guildId: string,
  shardId: number,
): Promise<void> {
  const { error } = await supabase
    .from('guilds')
    .update({ shard_id: shardId })
    .eq('id', guildId);

  if (error) {
    throw new Error(error.message);
  }
}
