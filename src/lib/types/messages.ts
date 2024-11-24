import { Database } from '../supabase/types';

export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type AiResponseRow = Database['public']['Tables']['ai_responses']['Row'];
export type AiResponseInsert =
  Database['public']['Tables']['ai_responses']['Insert'];
export type AiResponseUpdate =
  Database['public']['Tables']['ai_responses']['Update'];

export type HookMessage = Database['public']['Tables']['hook_messages']['Row'];
export type MessageAccess =
  Database['public']['Tables']['message_access']['Row'];
