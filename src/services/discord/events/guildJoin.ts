import { Guild, ClientEvents, ChannelType, SnowflakeUtil } from 'discord.js';
import { EventHandler } from '.';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import RequiredPermissions from 'src/lib/utils/permissions';
import TickerText from 'src/lib/utils/tickerText';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';
import { insertGlobalChannel } from 'src/lib/data/channels/insertGlobalChannel';
import ChannelCache from 'src/lib/utils/channelCache';
import { EmbedUtils } from 'src/lib/utils/embeds';

export default class GuildJoinHandler implements EventHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  eventName: keyof ClientEvents = 'guildCreate';
  process = async (guild: Guild): Promise<void> => {
    const guildData = await getGuild(guild.id);

    if (!guildData) {
      await insertGuild({
        id: guild.id,
        name: guild.name,
        icon_url: guild.iconURL() || null,
      });
    } else {
      if (
        guildData.name === guild.name &&
        guildData.icon_url === guild.iconURL()
      )
        return;
      await updateGuild(guild.id, {
        name: guild.name,
        icon_url: guild.iconURL() || null,
      });
    }

    // const botMember = await guild.members.fetchMe();
    // const permissions = botMember.permissions;
    // const missingPermissions = permissions.missing(
    //   RequiredPermissions.globalPermissions,
    // );

    // if (missingPermissions.length) return;

    // const members = await guild.members.fetch();

    // const hasProtectionBot = members.some((member) =>
    //   ['957481307405975552'].includes(member.user.id),
    // );

    // if (hasProtectionBot) return;

    // const globalChannels = await getGuildChannels(guild.id);

    // if (globalChannels.length >= 3) return;

    // const globalChannel = await this.createGlobalChannel(guild);
    // const webhook = await createGlobalWebhook(globalChannel);

    // await insertGlobalChannel({
    //   guild_id: guild.id,
    //   id: globalChannel.id,
    //   channel_access: 'general',
    //   webhook_url: webhook.url,
    // });

    // this.channelCache.addGlobalChannel(globalChannel.id);

    // const nonce = SnowflakeUtil.generate().toString();
    // await webhook.send({
    //   embeds: [EmbedUtils.WelcomeMessage(globalChannel.guild, 'general')],
    //   username: 'Global Message',
    //   avatarURL:
    //     'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
    //   options: {
    //     enforceNonce: true,
    //     nonce,
    //   },
    // });
  };

  private async createGlobalChannel(guild: Guild) {
    const channel = await guild.channels.create({
      name: '⚪️┃global-chat',
      type: ChannelType.GuildText,
      topic: TickerText.defaultTicker,
      permissionOverwrites: [
        {
          id: process.env.DISCORD_ID!,
          allow: RequiredPermissions.globalPermissions,
        },
        {
          id: guild.roles.everyone.id,
          deny: ['ViewChannel'],
        },
      ],
    });

    return channel;
  }
}
