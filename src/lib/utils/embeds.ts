import { EmbedBuilder, Guild } from 'discord.js';
import { ChannelAccess } from '../types/channels';
import { GuildRow } from '../types/guilds';
import { UserRow } from '../types/user';
import { FlipRow, StealRow } from '../types/game';

export class EmbedUtils {
  public static Info(content: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Global Chat')
      .setDescription(`${content}`)
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
    claimedPoints: boolean,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(':sunny: **GM**')
      .setDescription(
        `${userRow.username} says GM from ${guildRow.name}\n\n${claimedPoints ? 'You have claimed your points for today!' : '+ 100'}`,
      )
      .setThumbnail(
        guildRow.gm_url
          ? guildRow.gm_url
          : 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/GM_overlay_no_logo.png',
      );
  }

  public static WelcomeMessage(
    guild: Guild,
    channelAccess: ChannelAccess,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🌐 Welcome to Global')
      .setDescription(
        `🎉┃${guild.name} joined ${channelAccess.slice(0, 1).toUpperCase()}${channelAccess.slice(1)} Chat`,
      )
      .setColor(0x000000);
  }

  public static FlipMessage(flip: FlipRow, user: UserRow): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(':coin: Coinflip!!!')
      .setThumbnail(
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/coinflip_gif.gif',
      )
      .setDescription(
        `${user.username} chose ${flip.choice} and put a ${Math.abs(flip.points)} bet.\n\nGood luck!`,
      );
  }

  public static FlipResult(flip: FlipRow, user: UserRow): EmbedBuilder {
    const actualResult =
      flip.is_successful && flip.choice === 'heads' ? 'heads' : 'tails';
    return new EmbedBuilder()
      .setTitle(':coin: Coinflip!!!')
      .setDescription(
        `It's **${actualResult}**. \n\n${user.username} ${flip.is_successful ? 'won' : 'lost'} the ${Math.abs(flip.points)} bet.`,
      )
      .setThumbnail(
        actualResult === 'heads'
          ? 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/coin_heads.png'
          : 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/coin_tails.png?t=2024-10-27T20%3A03%3A49.264Z',
      );
  }

  public static StealMessage(
    steal: StealRow,
    user: UserRow,
    target: UserRow,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(':moneybag: Thievery!!!')
      .setDescription(
        `${user.username} is attempting to steal ${Math.abs(steal.points)} from ${target.username}.\n\nGood luck!`,
      )
      .setThumbnail(
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/thievery_gif.gif',
      );
  }

  public static StealResult(steal: StealRow, user: UserRow, target: UserRow) {
    return new EmbedBuilder()
      .setTitle(':moneybag: Thievery!!!')
      .setDescription(
        `${user.username} ${steal.is_successful ? 'earned' : 'lost'} ${Math.abs(steal.points)} stealing from ${target.username}`,
      )
      .setThumbnail(
        steal.is_successful
          ? 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/thief_mugged.png'
          : 'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/thief_rugged.png',
      );
  }
}
