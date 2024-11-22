import { Database } from '../supabase/types';

export type ChannelAccess = Database['public']['Enums']['channel_type'];

export type ChannelRow = Database['public']['Tables']['global_channels']['Row'];
export type ChannelInsert =
  Database['public']['Tables']['global_channels']['Insert'];
export type ChannelUpdate =
  Database['public']['Tables']['global_channels']['Update'];

export type AdminChannelRow =
  Database['public']['Tables']['admin_channels']['Row'];
export type AdminChannelInsert =
  Database['public']['Tables']['admin_channels']['Insert'];
export type AdminChannelUpdate =
  Database['public']['Tables']['admin_channels']['Update'];
