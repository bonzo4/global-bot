import { supabase } from 'src/lib/supabase';

export async function getScheduledMessages() {
  const { data, error } = await supabase
    .from('hook_messages')
    .select('*')
    .order('schedule', { ascending: true })
    .gt('schedule', new Date().toISOString());

  const { data: data2, error: error2 } = await supabase
    .from('hook_messages')
    .select('*')
    .neq('cron_string', null);

  if (error || error2) {
    throw new Error(error?.message || error2?.message);
  }

  return data.concat(data2);
}
