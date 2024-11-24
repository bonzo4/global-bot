import { Database } from '../supabase/types';

export type PollChoice = Database['public']['Tables']['poll_choices']['Row'];
export type Poll = Database['public']['Tables']['polls']['Row'];
export type PollInteraction =
  Database['public']['Tables']['poll_interactions']['Row'];
export type PollInteractionInsert =
  Database['public']['Tables']['poll_interactions']['Insert'];
