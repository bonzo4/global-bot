import { Database } from '../supabase/types';

export type GuildRow = Database['public']['Tables']['guilds']['Row'];
export type GuildInsert = Database['public']['Tables']['guilds']['Insert'];
export type GuildUpdate = Database['public']['Tables']['guilds']['Update'];

export type GuildUserRow = Database['public']['Tables']['_guild_users']['Row'];
export type GuildUserInsert =
  Database['public']['Tables']['_guild_users']['Insert'];
export type GuildUserUpdate =
  Database['public']['Tables']['_guild_users']['Update'];
