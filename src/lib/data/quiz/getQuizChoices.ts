import { supabase } from 'src/lib/supabase';

export async function getQuizChoices(quizId: number) {
  const { data, error } = await supabase
    .from('quiz_choices')
    .select('*')
    .eq('quiz_id', quizId);

  if (error) {
    return [];
  }

  return data;
}
