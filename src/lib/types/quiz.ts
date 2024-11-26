import { Database } from '../supabase/types';

export type QuizChoice = Database['public']['Tables']['quiz_choices']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizInteraction =
  Database['public']['Tables']['quiz_interactions']['Row'];
export type QuizInteractionInsert =
  Database['public']['Tables']['quiz_interactions']['Insert'];
