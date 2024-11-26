import { supabase } from 'src/lib/supabase';

export async function getEmbedQuizzes(embedId: number) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('embed_id', embedId);

  if (error) {
    return [];
  }

  return data;
}
