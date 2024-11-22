import { supabase } from 'src/lib/supabase';

export async function getAiResponse(id: string) {
  const { data, error } = await supabase
    .from('ai_responses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
