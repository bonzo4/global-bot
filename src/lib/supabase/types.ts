export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      _guild_tags: {
        Row: {
          created_at: string;
          guild_id: string;
          tag: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          tag: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_guild_tags_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_guild_tags_tag_fkey';
            columns: ['tag'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['name'];
          },
        ];
      };
      _guild_users: {
        Row: {
          banned: boolean;
          created_at: string;
          guild_id: string;
          user_id: string;
        };
        Insert: {
          banned?: boolean;
          created_at?: string;
          guild_id: string;
          user_id: string;
        };
        Update: {
          banned?: boolean;
          created_at?: string;
          guild_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public__guild_users_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public__guild_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      _message_tags: {
        Row: {
          created_at: string;
          message_id: number;
          tag: string;
        };
        Insert: {
          created_at?: string;
          message_id?: number;
          tag: string;
        };
        Update: {
          created_at?: string;
          message_id?: number;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_message_tags_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_message_tags_tag_fkey';
            columns: ['tag'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['name'];
          },
        ];
      };
      admin_channels: {
        Row: {
          channel_id: string;
          created_at: string;
          guild_id: string;
        };
        Insert: {
          channel_id: string;
          created_at?: string;
          guild_id: string;
        };
        Update: {
          channel_id?: string;
          created_at?: string;
          guild_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_channels_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: true;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_messages: {
        Row: {
          button_link: string | null;
          button_text: string | null;
          channel_access: Database['public']['Enums']['channel_type'] | null;
          created_at: string;
          embed_link: string;
          id: number;
        };
        Insert: {
          button_link?: string | null;
          button_text?: string | null;
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          created_at?: string;
          embed_link: string;
          id?: number;
        };
        Update: {
          button_link?: string | null;
          button_text?: string | null;
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          created_at?: string;
          embed_link?: string;
          id?: number;
        };
        Relationships: [];
      };
      ai_responses: {
        Row: {
          assistant_id: string;
          created_at: string;
          discord_user_id: string;
          id: number;
          message: string;
          response: string;
          score: number;
          thread_id: string;
        };
        Insert: {
          assistant_id: string;
          created_at?: string;
          discord_user_id: string;
          id?: number;
          message: string;
          response: string;
          score?: number;
          thread_id: string;
        };
        Update: {
          assistant_id?: string;
          created_at?: string;
          discord_user_id?: string;
          id?: number;
          message?: string;
          response?: string;
          score?: number;
          thread_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_responses_discord_user_id_fkey';
            columns: ['discord_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      allowed_links: {
        Row: {
          created_at: string;
          id: number;
          link: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          link: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          link?: string;
        };
        Relationships: [];
      };
      auto_messages: {
        Row: {
          button_link: string | null;
          button_text: string | null;
          created_at: string;
          embed_link: string;
          id: number;
        };
        Insert: {
          button_link?: string | null;
          button_text?: string | null;
          created_at?: string;
          embed_link: string;
          id?: number;
        };
        Update: {
          button_link?: string | null;
          button_text?: string | null;
          created_at?: string;
          embed_link?: string;
          id?: number;
        };
        Relationships: [];
      };
      bot_errors: {
        Row: {
          created_at: string;
          error: string;
          guild_id: string | null;
          id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          error: string;
          guild_id?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          error?: string;
          guild_id?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_bot_errors_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_bot_errors_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      cron_messages: {
        Row: {
          created_at: string;
          cron_string: string;
          id: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          cron_string: string;
          id?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          cron_string?: string;
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      embed_presets: {
        Row: {
          created_at: string;
          embed_json: Json;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          embed_json: Json;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          embed_json?: Json;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      embeds: {
        Row: {
          content: Json;
          created_at: string;
          has_view_tracker: boolean;
          id: number;
          interaction_types: Database['public']['Enums']['interaction_type'][];
          message_id: number;
          order: number;
        };
        Insert: {
          content: Json;
          created_at?: string;
          has_view_tracker?: boolean;
          id?: number;
          interaction_types?: Database['public']['Enums']['interaction_type'][];
          message_id: number;
          order?: number;
        };
        Update: {
          content?: Json;
          created_at?: string;
          has_view_tracker?: boolean;
          id?: number;
          interaction_types?: Database['public']['Enums']['interaction_type'][];
          message_id?: number;
          order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'embeds_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
        ];
      };
      game_flips: {
        Row: {
          choice: Database['public']['Enums']['flip_results'];
          created_at: string;
          guild_id: string;
          id: number;
          is_successful: boolean;
          points: number;
          user_id: string;
        };
        Insert: {
          choice: Database['public']['Enums']['flip_results'];
          created_at?: string;
          guild_id: string;
          id?: number;
          is_successful: boolean;
          points: number;
          user_id: string;
        };
        Update: {
          choice?: Database['public']['Enums']['flip_results'];
          created_at?: string;
          guild_id?: string;
          id?: number;
          is_successful?: boolean;
          points?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_flips_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_flips_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      game_stats: {
        Row: {
          created_at: string;
          has_claimed: boolean;
          has_shield: boolean;
          total_points: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          has_claimed?: boolean;
          has_shield?: boolean;
          total_points?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          has_claimed?: boolean;
          has_shield?: boolean;
          total_points?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_stats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      game_steals: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          is_successful: boolean;
          points: number;
          target_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          is_successful: boolean;
          points: number;
          target_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          is_successful?: boolean;
          points?: number;
          target_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_flips_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_steals_target_id_fkey';
            columns: ['target_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      global_channels: {
        Row: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at: string;
          guild_id: string;
          id: string;
          webhook_url: string;
        };
        Insert: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at?: string;
          guild_id: string;
          id: string;
          webhook_url: string;
        };
        Update: {
          channel_access?: Database['public']['Enums']['channel_type'];
          created_at?: string;
          guild_id?: string;
          id?: string;
          webhook_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'extra_channels_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
        ];
      };
      guild_admin: {
        Row: {
          created_at: string;
          discord_user_id: string;
          guild_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          discord_user_id: string;
          guild_id: string;
          id: string;
        };
        Update: {
          created_at?: string;
          discord_user_id?: string;
          guild_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guild_admin_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guild_admin_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      guild_channel_access: {
        Row: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at: string;
          guild_id: string;
          id: number;
        };
        Insert: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at?: string;
          guild_id: string;
          id?: number;
        };
        Update: {
          channel_access?: Database['public']['Enums']['channel_type'];
          created_at?: string;
          guild_id?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'purchased_access_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
        ];
      };
      guild_stats: {
        Row: {
          banned_user_count: number;
          created_at: string;
          deleted_message_count: number;
          error_count: number;
          guild_id: string;
          message_count: number;
          user_count: number;
        };
        Insert: {
          banned_user_count?: number;
          created_at?: string;
          deleted_message_count?: number;
          error_count?: number;
          guild_id: string;
          message_count?: number;
          user_count?: number;
        };
        Update: {
          banned_user_count?: number;
          created_at?: string;
          deleted_message_count?: number;
          error_count?: number;
          guild_id?: string;
          message_count?: number;
          user_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_guild_stats_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: true;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
        ];
      };
      guilds: {
        Row: {
          channel_access: Database['public']['Enums']['channel_type'] | null;
          created_at: string;
          global_channel_id: string | null;
          gm_url: string | null;
          icon_url: string | null;
          id: string;
          left_at: string | null;
          links_allowed: boolean;
          name: string;
          shard_id: number | null;
          tag: string | null;
          webhook_url: string | null;
          whitelisted: boolean;
        };
        Insert: {
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          created_at?: string;
          global_channel_id?: string | null;
          gm_url?: string | null;
          icon_url?: string | null;
          id: string;
          left_at?: string | null;
          links_allowed?: boolean;
          name: string;
          shard_id?: number | null;
          tag?: string | null;
          webhook_url?: string | null;
          whitelisted?: boolean;
        };
        Update: {
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          created_at?: string;
          global_channel_id?: string | null;
          gm_url?: string | null;
          icon_url?: string | null;
          id?: string;
          left_at?: string | null;
          links_allowed?: boolean;
          name?: string;
          shard_id?: number | null;
          tag?: string | null;
          webhook_url?: string | null;
          whitelisted?: boolean;
        };
        Relationships: [];
      };
      hook_image_folders: {
        Row: {
          created_at: string;
          name: string;
          parent: string | null;
        };
        Insert: {
          created_at?: string;
          name: string;
          parent?: string | null;
        };
        Update: {
          created_at?: string;
          name?: string;
          parent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'hook_image_folders_parent_fkey';
            columns: ['parent'];
            isOneToOne: false;
            referencedRelation: 'hook_image_folders';
            referencedColumns: ['name'];
          },
        ];
      };
      hook_images: {
        Row: {
          created_at: string;
          folder: string | null;
          id: number;
          name: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          folder?: string | null;
          id?: number;
          name: string;
          url: string;
        };
        Update: {
          created_at?: string;
          folder?: string | null;
          id?: number;
          name?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'hook_images_folder_fkey';
            columns: ['folder'];
            isOneToOne: false;
            referencedRelation: 'hook_image_folders';
            referencedColumns: ['name'];
          },
        ];
      };
      hook_messages: {
        Row: {
          created_at: string;
          created_by: string;
          id: number;
          schedule: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: number;
          schedule: string;
          title: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: number;
          schedule?: string;
          title?: string;
        };
        Relationships: [];
      };
      input_interactions: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          input: string;
          input_id: number;
          message_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          input: string;
          input_id: number;
          message_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          input?: string;
          input_id?: number;
          message_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'input_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'input_interactions_input_id_fkey';
            columns: ['input_id'];
            isOneToOne: false;
            referencedRelation: 'inputs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'input_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'input_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      inputs: {
        Row: {
          created_at: string;
          embed_id: number;
          id: number;
          order: number;
          question: string;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          id?: number;
          order?: number;
          question: string;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          id?: number;
          order?: number;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'input_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      links: {
        Row: {
          created_at: string;
          embed_id: number;
          emoji: string | null;
          id: number;
          label: string;
          order: number;
          url: string;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          emoji?: string | null;
          id?: number;
          label: string;
          order?: number;
          url: string;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          emoji?: string | null;
          id?: number;
          label?: string;
          order?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'links_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      message_access: {
        Row: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at: string;
          id: number;
          message_id: number;
          schedule: string;
        };
        Insert: {
          channel_access: Database['public']['Enums']['channel_type'];
          created_at?: string;
          id?: number;
          message_id: number;
          schedule: string;
        };
        Update: {
          channel_access?: Database['public']['Enums']['channel_type'];
          created_at?: string;
          id?: number;
          message_id?: number;
          schedule?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'message_access_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'hook_messages';
            referencedColumns: ['id'];
          },
        ];
      };
      message_drafts: {
        Row: {
          created_at: string;
          id: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          channel_access: Database['public']['Enums']['channel_type'] | null;
          content: string;
          created_at: string;
          deleted: boolean;
          guild_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          content: string;
          created_at?: string;
          deleted?: boolean;
          guild_id: string;
          id: string;
          user_id: string;
        };
        Update: {
          channel_access?: Database['public']['Enums']['channel_type'] | null;
          content?: string;
          created_at?: string;
          deleted?: boolean;
          guild_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_messages_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      poll_choices: {
        Row: {
          created_at: string;
          emoji: string;
          id: number;
          label: string;
          poll_id: number;
          votes: number;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          id?: number;
          label: string;
          poll_id: number;
          votes?: number;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          id?: number;
          label?: string;
          poll_id?: number;
          votes?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'poll_choices_poll_id_fkey';
            columns: ['poll_id'];
            isOneToOne: false;
            referencedRelation: 'polls';
            referencedColumns: ['id'];
          },
        ];
      };
      poll_interactions: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          message_id: number;
          poll_choice_id: number | null;
          poll_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          message_id: number;
          poll_choice_id?: number | null;
          poll_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          message_id?: number;
          poll_choice_id?: number | null;
          poll_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'poll_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'poll_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'hook_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'poll_interactions_message_id_fkey1';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'poll_interactions_poll_choice_id_fkey';
            columns: ['poll_choice_id'];
            isOneToOne: false;
            referencedRelation: 'poll_choices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'poll_interactions_poll_id_fkey';
            columns: ['poll_id'];
            isOneToOne: false;
            referencedRelation: 'polls';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'poll_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      polls: {
        Row: {
          created_at: string;
          embed_id: number;
          id: number;
          is_random: boolean;
          order: number;
          question: string;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          id?: number;
          is_random: boolean;
          order?: number;
          question: string;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          id?: number;
          is_random?: boolean;
          order?: number;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'polls_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      preview_auto_messages: {
        Row: {
          button_link: string | null;
          button_text: string | null;
          created_at: string;
          embed_link: string;
          id: number;
        };
        Insert: {
          button_link?: string | null;
          button_text?: string | null;
          created_at?: string;
          embed_link: string;
          id?: number;
        };
        Update: {
          button_link?: string | null;
          button_text?: string | null;
          created_at?: string;
          embed_link?: string;
          id?: number;
        };
        Relationships: [];
      };
      profile_buttons: {
        Row: {
          created_at: string;
          embed_id: number;
          id: number;
          order: number;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          id?: number;
          order?: number;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          id?: number;
          order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_buttons_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_interactions: {
        Row: {
          created_at: string;
          guild_id: string | null;
          id: number;
          message_id: number | null;
          profile_button: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id?: string | null;
          id?: number;
          message_id?: number | null;
          profile_button?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string | null;
          id?: number;
          message_id?: number | null;
          profile_button?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'hook_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_interactions_profile_button_fkey';
            columns: ['profile_button'];
            isOneToOne: false;
            referencedRelation: 'profile_buttons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      promo_interactions: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          interaction_type: Database['public']['Enums']['promo_interaction_type'];
          message_id: number;
          promo_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          interaction_type: Database['public']['Enums']['promo_interaction_type'];
          message_id: number;
          promo_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          interaction_type?: Database['public']['Enums']['promo_interaction_type'];
          message_id?: number;
          promo_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promo_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'promo_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'promo_interactions_promo_id_fkey';
            columns: ['promo_id'];
            isOneToOne: false;
            referencedRelation: 'promos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'promo_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      promos: {
        Row: {
          created_at: string;
          embed_id: number;
          id: number;
          order: number;
          tweet_url: string | null;
          twitter_url: string | null;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          id?: number;
          order?: number;
          tweet_url?: string | null;
          twitter_url?: string | null;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          id?: number;
          order?: number;
          tweet_url?: string | null;
          twitter_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'promos_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_choices: {
        Row: {
          created_at: string;
          emoji: string;
          id: number;
          label: string;
          quiz_id: number;
          votes: number;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          id?: number;
          label: string;
          quiz_id: number;
          votes?: number;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          id?: number;
          label?: string;
          quiz_id?: number;
          votes?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_choices_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_interactions: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          message_id: number;
          quiz_choice_id: number;
          quiz_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          message_id: number;
          quiz_choice_id: number;
          quiz_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          message_id?: number;
          quiz_choice_id?: number;
          quiz_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_interactions_quiz_choice_id_fkey';
            columns: ['quiz_choice_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_choices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_interactions_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      quizzes: {
        Row: {
          answer: string;
          created_at: string;
          embed_id: number;
          id: number;
          is_random: boolean;
          order: number;
          question: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          embed_id: number;
          id?: number;
          is_random: boolean;
          order?: number;
          question: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          embed_id?: number;
          id?: number;
          is_random?: boolean;
          order?: number;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quizzes_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      redirect_clicks: {
        Row: {
          created_at: string;
          guild_id: string;
          id: number;
          message_id: number;
          redirect_id: number;
        };
        Insert: {
          created_at?: string;
          guild_id: string;
          id?: number;
          message_id: number;
          redirect_id: number;
        };
        Update: {
          created_at?: string;
          guild_id?: string;
          id?: number;
          message_id?: number;
          redirect_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'redirect_clicks_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'redirect_clicks_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'redirect_clicks_redirect_id_fkey';
            columns: ['redirect_id'];
            isOneToOne: false;
            referencedRelation: 'redirects';
            referencedColumns: ['id'];
          },
        ];
      };
      redirects: {
        Row: {
          clicks: number;
          created_at: string;
          embed_id: number;
          guild_id: string;
          id: number;
          link_id: number | null;
          message_id: number;
          url: string;
        };
        Insert: {
          clicks: number;
          created_at?: string;
          embed_id: number;
          guild_id: string;
          id?: number;
          link_id?: number | null;
          message_id: number;
          url: string;
        };
        Update: {
          clicks?: number;
          created_at?: string;
          embed_id?: number;
          guild_id?: string;
          id?: number;
          link_id?: number | null;
          message_id?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'redirects_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'redirects_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'redirects_link_id_fkey';
            columns: ['link_id'];
            isOneToOne: false;
            referencedRelation: 'links';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'redirects_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
        ];
      };
      scheduled_message: {
        Row: {
          created_at: string;
          cron_string: string;
          event_name: string;
          id: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          cron_string: string;
          event_name: string;
          id?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          cron_string?: string;
          event_name?: string;
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      staff_users: {
        Row: {
          created_at: string;
          staff_role: Database['public']['Enums']['staff_role_type'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          staff_role: Database['public']['Enums']['staff_role_type'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          staff_role?: Database['public']['Enums']['staff_role_type'];
          user_id?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          created_at: string;
          deleted_message_count: number;
          message_count: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deleted_message_count?: number;
          message_count?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deleted_message_count?: number;
          message_count?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_user_stats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          banned: boolean;
          created_at: string;
          display_name: string | null;
          gm_url: string | null;
          id: string;
          is_admin: boolean;
          is_mod: boolean;
          is_verified: boolean;
          links_allowed: boolean;
          user_id: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          banned?: boolean;
          created_at?: string;
          display_name?: string | null;
          gm_url?: string | null;
          id: string;
          is_admin?: boolean;
          is_mod?: boolean;
          is_verified?: boolean;
          links_allowed?: boolean;
          user_id?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          banned?: boolean;
          created_at?: string;
          display_name?: string | null;
          gm_url?: string | null;
          id?: string;
          is_admin?: boolean;
          is_mod?: boolean;
          is_verified?: boolean;
          links_allowed?: boolean;
          user_id?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      wallet_buttons: {
        Row: {
          created_at: string;
          embed_id: number;
          eth: boolean;
          id: number;
          order: number;
          sol: boolean;
        };
        Insert: {
          created_at?: string;
          embed_id: number;
          eth: boolean;
          id?: number;
          order?: number;
          sol: boolean;
        };
        Update: {
          created_at?: string;
          embed_id?: number;
          eth?: boolean;
          id?: number;
          order?: number;
          sol?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'wallet_buttons_embed_id_fkey';
            columns: ['embed_id'];
            isOneToOne: false;
            referencedRelation: 'embeds';
            referencedColumns: ['id'];
          },
        ];
      };
      wallet_interactions: {
        Row: {
          created_at: string;
          eth_address: string;
          guild_id: string;
          id: number;
          message_id: number;
          sol_address: string;
          user_id: string;
          wallet_button_id: number;
        };
        Insert: {
          created_at?: string;
          eth_address: string;
          guild_id: string;
          id?: number;
          message_id: number;
          sol_address: string;
          user_id: string;
          wallet_button_id: number;
        };
        Update: {
          created_at?: string;
          eth_address?: string;
          guild_id?: string;
          id?: number;
          message_id?: number;
          sol_address?: string;
          user_id?: string;
          wallet_button_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'wallet_interactions_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guilds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'wallet_interactions_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'scheduled_message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'wallet_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'wallet_interactions_wallet_button_id_fkey';
            columns: ['wallet_button_id'];
            isOneToOne: false;
            referencedRelation: 'wallet_buttons';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      reset_game_stats: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      channel_type: 'whitelist' | 'general' | 'superteam' | 'test';
      flip_results: 'heads' | 'tails';
      interaction_type:
        | 'POLL'
        | 'QUIZ'
        | 'INPUT'
        | 'PROMO'
        | 'LINK'
        | 'PROFILE'
        | 'WALLET';
      promo_interaction_type: 'FOLLOW' | 'LIKE' | 'RETWEET';
      staff_role_type: 'WRITER' | 'ADMIN';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
