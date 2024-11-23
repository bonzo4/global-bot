import { Database } from '../supabase/types';

export type GameStatsRow = Database['public']['Tables']['game_stats']['Row'];
export type GameStatsInsert =
  Database['public']['Tables']['game_stats']['Insert'];
export type GameStatsUpdate =
  Database['public']['Tables']['game_stats']['Update'];

export type FlipRow = Database['public']['Tables']['game_flips']['Row'];
export type FlipInsert = Database['public']['Tables']['game_flips']['Insert'];
export type FlipUpdate = Database['public']['Tables']['game_flips']['Update'];

export type StealRow = Database['public']['Tables']['game_steals']['Row'];
export type StealInsert = Database['public']['Tables']['game_steals']['Insert'];
export type StealUpdate = Database['public']['Tables']['game_steals']['Update'];
