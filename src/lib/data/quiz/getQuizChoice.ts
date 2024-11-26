import { supabase } from 'src/lib/supabase';

export async function getQuizChoice(choiceId: number) {
  const { data, error } = await supabase
    .from('quiz_choices')
    .select('*')
    .eq('id', choiceId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
