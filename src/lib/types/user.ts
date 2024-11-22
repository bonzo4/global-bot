import { Database } from '../supabase/types';

export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type GameStatsRow = Database['public']['Tables']['game_stats']['Row'];
export type GameStatsInsert =
  Database['public']['Tables']['game_stats']['Insert'];
export type GameStatsUpdate =
  Database['public']['Tables']['game_stats']['Update'];
