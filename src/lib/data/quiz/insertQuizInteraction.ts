import { supabase } from 'src/lib/supabase';
import { QuizInteractionInsert } from 'src/lib/types/quiz';

export async function insertQuizInteraction(
  quizInteraction: QuizInteractionInsert,
) {
  const { data, error } = await supabase
    .from('quiz_interactions')
    .insert(quizInteraction)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
