import { Database } from '../supabase/types';

export type InputRow = Database['public']['Tables']['inputs']['Row'];
export type InputInteraction =
  Database['public']['Tables']['input_interactions']['Row'];

export type InputInteractionInsert =
  Database['public']['Tables']['input_interactions']['Insert'];
