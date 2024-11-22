import { supabase } from 'src/lib/supabase';

export async function getMessage(id: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    return null;
  }

  return data;
}
