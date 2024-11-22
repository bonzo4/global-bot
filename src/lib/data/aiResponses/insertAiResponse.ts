import { supabase } from 'src/lib/supabase';
import { AiResponseInsert, AiResponseRow } from 'src/lib/types/messages';

export async function insertAiResponse(
  aiResponseInsert: AiResponseInsert,
): Promise<AiResponseRow> {
  const { data, error } = await supabase
    .from('ai_responses')
    .insert(aiResponseInsert)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Failed to insert AI response');
  }

  return data;
}
