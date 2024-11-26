import { supabase } from 'src/lib/supabase';

export async function getQuizInteractions(quizId: number, userId: string) {
  const { data, error } = await supabase
    .from('quiz_interactions')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('user_id', userId);

  if (error) {
    return [];
  }

  return data;
}
