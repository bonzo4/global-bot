import { supabase } from 'src/lib/supabase';

export async function getQuiz(quizId: number) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
