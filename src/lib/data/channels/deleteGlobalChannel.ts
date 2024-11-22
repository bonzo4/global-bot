import { supabase } from 'src/lib/supabase';

export async function deleteGlobalChannel(channelId: string): Promise<void> {
  const { error } = await supabase
    .from('global_channels')
    .delete()
    .eq('id', channelId);

  if (error) {
    throw new Error(error.message);
  }
}
