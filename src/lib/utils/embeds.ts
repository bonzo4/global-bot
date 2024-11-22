import { EmbedBuilder, Guild } from 'discord.js';
import { ChannelAccess } from '../types/channels';
import { GuildRow } from '../types/guilds';
import { UserRow } from '../types/user';

export class EmbedUtils {
  public static Info(content: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Global Chat')
      .setDescription(`🌐┃${content}`)
      .setColor(0x000000);
  }

  public static Success(content: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Success')
      .setDescription(`✅┃${content}`)
      .setColor(0x000000);
  }

  public static Error(content: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Error')
      .setDescription(`❌┃${content}.`)
      .setColor(0xf1c232);
  }

  public static Warning(content: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Warning')
      .setDescription(`⚠️┃${content}`)
      .setColor(0xf1c232);
  }

  public static GmMessage(
    guildRow: GuildRow,
    userRow: UserRow,
    hasGuildIcon: boolean,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(':sunny: **GM**')
      .setDescription(`${userRow.username} says GM from ${guildRow.name}`)
      .setThumbnail(
        hasGuildIcon
          ? guildRow.gm_url
          : 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/GM_overlay_no_logo.png',
      );
  }

  public static WelcomeMessage(
    guild: Guild,
    channelAccess: ChannelAccess,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Welcome')
      .setDescription(
        `🎉┃${guild.name} joined ${channelAccess.slice(0, 1).toUpperCase()}${channelAccess.slice(1)}`,
      )
      .setColor(0x000000);
  }
}
